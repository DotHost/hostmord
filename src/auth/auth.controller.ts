import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard, GetUser } from 'src/common';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@ApiBearerAuth('Authorization')
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Creates a new admin user' })
  create(@Body() createAuthDto: CreateAuthDto, @GetUser() user: User) {
    return this.authService.create(createAuthDto, user.userid);
  }
}
