import { Module, Logger, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; // <-- ADD THIS
import { JwtStrategy } from './auth/jwt.strategy'; // <-- ADD THIS (make sure you have this file)
import config from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
      global: true,
    }),
    // Remove duplicate ConfigModule.forRoot() - your original had this duplicated, remove it:
    // ConfigModule.forRoot({ isGlobal: true }),  <-- REMOVE THIS LINE
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        if (!uri) throw new Error('❌ MONGODB_URI not defined');

        mongoose.connection.on('connected', () => Logger.log('✅ MongoDB connected'));
        mongoose.connection.on('disconnected', () => Logger.warn('⚠️ MongoDB disconnected'));
        mongoose.connection.on('reconnected', () => Logger.log('🔁 MongoDB reconnected'));
        mongoose.connection.on('error', (err) => Logger.error(`❌ MongoDB error: ${err}`));

        await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        });

        return { uri };
      },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }), // <-- ADD THIS LINE
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy], // <-- ADD JwtStrategy here
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL }); // ✅ Fix here
  }
}
