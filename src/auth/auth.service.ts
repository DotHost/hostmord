import { Injectable, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateAuthDto } from './dto/auth.dto';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { SendMailsService } from 'src/config/email/sendMail.service';
import { AvatarService } from 'src/config/avatars/avatar.service';
import { AuthHelper } from 'src/helpers';
import { handleResponse } from 'src/common';
import { Role } from '@prisma/client';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly sendMail: SendMailsService,
    private readonly avatar: AvatarService,
    private config: ConfigService,
    private auth: AuthHelper,
  ) {}
  async create(createAuthDto: CreateAuthDto, userid: string) {
    //check if the userid from login is valid
    const user = await this.auth.validateUser(userid);

    if (!user) {
      throw new handleResponse(
        HttpStatus.UNAUTHORIZED,
        'User session not authorized',
      );
    }

    //create a random avatar image
    const avatar = await this.avatar.getRandomAvatar();

    //check if password match
    if (createAuthDto.password !== createAuthDto.confirm_password) {
      throw new handleResponse(HttpStatus.CONFLICT, 'Passwords do not match');
    }

    //hash the password using argon2
    const hashedPassword = await this.auth.hashData(createAuthDto.password);

    //generate otp codes and expiry
    const otpCode = await this.auth.generateOTP();
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 10);

    //hash orp code
    const hashOtp = await argon.hash(otpCode);

    const Newuser = await this.prisma.user.create({
      data: {
        ...createAuthDto,
        password: hashedPassword,
        confirm_password: hashedPassword,
        otp: hashOtp,
        otpExpiry: otpExpiration,
        profilePicture: avatar,
        role: Role.MODERATOR,
      },
    });

    //check if user is created
    if (!Newuser) {
      throw new handleResponse(
        HttpStatus.FORBIDDEN,
        'There was an issue creating your account',
      );
    }

    const to = { name: user.firstname, address: user.email };
    const subject = 'Activate Your Account';
    const template = 'activateAccount';
    const context = {
      name: `${user.firstname} ${user.lastname}`,
      otpCode,
      platform: this.config.get<string>('PLATFORM_NAME'),
      platformMail: this.config.get<string>('PLATFORM_SUPPORT'),
    };

    await this.sendMail.sendEmail(to, subject, template, context);

    const sanitizedUser = this.auth.sanitizeUser(user);

    return new handleResponse(
      HttpStatus.CREATED,
      'Admin User Created Successfully',
      sanitizedUser,
    ).getResponse();
  }
}
