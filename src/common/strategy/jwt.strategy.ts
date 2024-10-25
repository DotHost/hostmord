import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('SECRET_KEY'),
      passReqToCallback: true, // Enable passing the request object to the validate method
    });
  }

  async validate(req, payload: { sub: string; username: string }) {
    // Extract the token from the request using the same method as in jwtFromRequest
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

    // Find the user by their unique ID (sub) in the payload
    const user = await this.prisma.user.findUnique({
      where: {
        userid: payload.sub,
      },
    });

    // If user is not found, throw an unauthorized exception
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Compare the token from the request with the token stored in the database
    if (user.token !== token) {
      throw new UnauthorizedException('Invalid token');
    }

    // Remove sensitive information from the user object before returning
    delete user.password;
    delete user.confirm_password;
    delete user.otp;
    delete user.otpExpiry;
    delete user.fingerprint;

    return user; // Return the user object, which will be attached to the request object
  }
}
