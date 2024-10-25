import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

//config
import { CustomLoggerService } from 'src/config/logger/logger.service';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { GeolocationModule } from 'src/config/geolocation/geolocation.module';
import { WhoisModule } from 'src/config/whois/whois.module';
import { DNSModule } from 'src/config/dns/dns.module';
import { SendMailsModule } from 'src/config/email/sendMail.module';
import { AvatarModule } from 'src/config/avatars/avatar.module';

//mordules
import { AuthModule } from 'src/auth/auth.module';
import { AuthHelper } from 'src/helpers';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    GeolocationModule,
    WhoisModule,
    DNSModule,
    SendMailsModule,
    AvatarModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, CustomLoggerService, AuthHelper],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly appService: AppService) {}

  // Lifecycle hook that runs on module initialization
  async onModuleInit() {
    await this.appService.checkAndCreateAdmin(); // Call admin creation check
  }
}
