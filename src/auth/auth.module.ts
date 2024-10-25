import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthHelper } from 'src/helpers';
import { JwtStrategy } from 'src/common'; // Ensure proper path to JwtStrategy
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // Import ConfigModule to use environment variables
    ConfigModule,

    // JWT module with secret key and sign options
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: '60m' }, // Token expiration time
      }),
    }),

    // HttpModule is imported for making HTTP requests (if needed elsewhere)
    HttpModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthHelper, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
