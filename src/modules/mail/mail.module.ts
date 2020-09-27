import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_SMTP_HOST'),
          port: +configService.get<number>('MAIL_SMTP_PORT'),
          secure: configService.get('MAIL_SMTP_SECURE') === 'true',
          ignoreTLS: configService.get('MAIL_SMTP_SECURE') !== 'false',
          auth: {
            user: configService.get('MAIL_SMTP_USERNAME'),
            pass: configService.get('MAIL_SMTP_PASSWORD'),
          },
        },
        defaults: {
          from:
            '"' +
            configService.get('MAIL_SMTP_NAME') +
            '" <' +
            configService.get('MAIL_SMTP_USERNAME') +
            '>',
        },
        template: {
          dir: process.env.PWD + '/src/modules/mail/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  controllers: [MailController],
  exports: [MailService],
})
export class MailModule {}
