import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { SendMailsService } from './sendMail.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const emailProvider = configService.get<string>('EMAIL_PROVIDER'); // 'google' or 'zeptomail'
        let transport;

        if (emailProvider === 'google') {
          transport = {
            service: 'gmail',
            auth: {
              user: configService.get<string>('EMAIL_ADDRESS'),
              pass: configService.get<string>('EMAIL_PASSWORD'),
            },
          };
        } else if (emailProvider === 'smtp') {
          transport = {
            host: configService.get<string>('SMTP_HOST'),
            port: 587,
            secure: false, // TLS
            auth: {
              user: configService.get<string>('SMTP_USER'),
              pass: configService.get<string>('SMTP_PASS'),
            },
          };
        } else {
          throw new Error('Invalid email provider specified');
        }

        return {
          transport,
          defaults: {
            from: {
              name: configService.get<string>('PLATFORM_NAME'),
              address: configService.get<string>('PLATFORM_SUPPORT'),
            },
          },
          template: {
            dir: __dirname + '/templates',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [SendMailsService],
  providers: [SendMailsService],
})
export class SendMailsModule {}
