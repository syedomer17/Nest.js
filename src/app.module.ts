// src/app.module.ts
import { Module, Logger, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';

import { UserModule } from './user/user.module';
import { LoggerMiddleware } from './logger/logger.middleware';

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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*'); // applies to all routes
  }
}
