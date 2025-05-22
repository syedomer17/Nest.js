// src/app.module.ts
import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import mongoose from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');

        if (!uri) {
          throw new Error('❌ MONGODB_URI not defined');
        }

        // Event listeners
        mongoose.connection.on('connected', () => {
          Logger.log('✅ MongoDB connected');
        });

        mongoose.connection.on('disconnected', () => {
          Logger.warn('⚠️ MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
          Logger.log('🔁 MongoDB reconnected');
        });

        mongoose.connection.on('error', (err) => {
          Logger.error(`❌ MongoDB error: ${err}`);
        });

        // Connect with retry options
        await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        });

        return { uri };
      },
    }),
    UserModule,
  ],
})
export class AppModule {}
