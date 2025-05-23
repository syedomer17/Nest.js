import { Module, Logger, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
    AuthModule,
  ],
  controllers: [AppController],
  providers : [AppService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // ✅ Fix here
  }
}
