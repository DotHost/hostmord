import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

//config
import { CustomLoggerService } from 'src/config/logger/logger.service';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { GeolocationModule } from 'src/config/geolocation/geolocation.module';
import { WhoisModule } from 'src/config/whois/whois.module';
import { PaystackModule } from 'src/config/paystack/paystack.module';
import { DNSModule } from 'src/config/dns/dns.module';
import { MetaModule } from 'src/config/meta/meta.mordule';
import { SendMailsModule } from 'src/config/email/sendMail.module';
import { CloudinaryModule } from 'src/config/cloudinary/cloudinary.module';
import { AvatarModule } from 'src/config/avatars/avatar.module';

//mordules
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    GeolocationModule,
    WhoisModule,
    PaystackModule,
    DNSModule,
    MetaModule,
    SendMailsModule,
    CloudinaryModule,
    AvatarModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, CustomLoggerService],
})
export class AppModule {}
