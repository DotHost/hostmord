import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthHelper } from 'src/helpers';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthHelper],
})
export class AuthModule {}
