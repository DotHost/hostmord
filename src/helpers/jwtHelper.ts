import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

function createJwtService(configService: ConfigService): JwtService {
  return new JwtService({
    secret: configService.get<string>('SECRET_KEY'),
    signOptions: { expiresIn: '12h' },
  });
}

export async function signToken(
  userid: any,
  username: string,
  configService: ConfigService,
): Promise<string> {
  const jwtService = createJwtService(configService);

  const payload = {
    sub: userid,
    username,
  };

  return jwtService.signAsync(payload);
}
