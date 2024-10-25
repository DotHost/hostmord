import { Controller, Post, Body, UseGuards, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { InviteAuthDto, AuthDto } from 'src/dtos';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard, GetUser } from 'src/common';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@ApiBearerAuth('Authorization')
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('invite')
  @ApiOperation({ summary: 'Invite Moderator' })
  invite(@Body() invite: InviteAuthDto, @GetUser() user: User) {
    return this.authService.invite(invite, user.userid);
  }

  @HttpCode(200)
  @ApiOperation({ summary: 'Login to Account' })
  @Post('/signin')
  loginUser(@Body() loginAuthDto: AuthDto) {
    return this.authService.loginUser(loginAuthDto);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({ summary: 'logout user' })
  @Post('/logout')
  logout(@GetUser() user: User) {
    return this.authService.logout(user.userid);
  }
}
