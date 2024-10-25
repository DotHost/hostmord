import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from 'src/common/decorator';
import { JwtGuard } from 'src/common/guard';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@ApiBearerAuth('Authorization')
@ApiTags('Users')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'View current profile' })
  @Get('/profile')
  async findOne(@GetUser() user: User) {
    return this.usersService.getProfile(user.userid);
  }
}
