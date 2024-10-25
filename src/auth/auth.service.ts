import { Injectable, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InviteAuthDto, AuthDto } from 'src/dtos';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { SendMailsService } from 'src/config/email/sendMail.service';
import { AvatarService } from 'src/config/avatars/avatar.service';
import { AuthHelper, signToken } from 'src/helpers';
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

  async invite(invite: InviteAuthDto, userid: string) {
    //check if the userid from login is valid
    const user = await this.auth.validateUser(userid);

    if (!user) {
      throw new handleResponse(
        HttpStatus.UNAUTHORIZED,
        'User session not authorized',
      );
    }

    //generate otp codes and expiry
    const otpCode = await this.auth.generateOTP();
    const otpExpiration = new Date();
    otpExpiration.setMinutes(otpExpiration.getMinutes() + 10);

    //hash orp code
    const hashOtp = await argon.hash(otpCode);

    const Newuser = await this.prisma.user.create({
      data: {
        firstname: 'empty',
        lastname: 'empty',
        email: invite.email,
        username: 'empty',
        password: 'empty',
        confirm_password: 'empty',
        otp: hashOtp,
        otpExpiry: otpExpiration,
        role: Role.MODERATOR,
      },
    });

    //check if user is created
    if (!Newuser) {
      throw new handleResponse(
        HttpStatus.FORBIDDEN,
        'There was an issue inviting the user',
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

  async loginUser(loginAuthDto: AuthDto) {
    const user = await this.auth.fetchUserByIdentifier(loginAuthDto.identifier);

    if (!user) {
      throw new handleResponse(HttpStatus.NOT_FOUND, 'Account not found');
    }

    const pwMatches = await argon.verify(user.password, loginAuthDto.password);

    if (!pwMatches) {
      throw new handleResponse(HttpStatus.FORBIDDEN, 'Password incorrect');
    }

    if (user.isVerified === false) {
      const otpCode = await this.auth.generateOTP();
      const otpExpiration = new Date();
      otpExpiration.setMinutes(otpExpiration.getMinutes() + 10);

      await this.auth.updateUser(user.userid, {
        otp: await argon.hash(otpCode),
        otpExpiry: otpExpiration,
      });

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

      throw new handleResponse(
        HttpStatus.FORBIDDEN,
        'Account Not Verified - OTP sent to email',
      );
    }

    const token = await signToken(user.userid, user.username, this.config);

    const currentDate = new Date();
    await this.prisma.user.update({
      where: { userid: user.userid },
      data: { lastLogin: currentDate, isActive: true, token },
    });

    const sanitizedUser = this.auth.sanitizeUser(user);

    return new handleResponse(HttpStatus.OK, 'User Logged in', {
      user: sanitizedUser,
      token,
    }).getResponse();
  }

  async logout(userId: string) {
    const user = await this.auth.validateUser(userId);

    if (!user) {
      throw new handleResponse(HttpStatus.NOT_FOUND, 'User not found');
    }

    await this.prisma.user.update({
      where: { userid: user.userid },
      data: { isActive: false, token: null },
    });

    return new handleResponse(HttpStatus.OK, 'User Logged Out').getResponse();
  }
}
