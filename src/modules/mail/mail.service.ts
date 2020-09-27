import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendWelcomeMailDto } from './dto/send-welcome-mail.dto';
import { SendForgetPasswordMailDto } from './dto/send-forget-password-mail.dto';
import { ConfigService } from '@nestjs/config';
import { Template } from './enum/template.enum';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendWelcomeMail(sendWelcomeMailDto: SendWelcomeMailDto): Promise<void> {
    return this.mailerService.sendMail({
      to: sendWelcomeMailDto.email,
      from:
        '"' +
        this.configService.get('MAIL_SMTP_NAME') +
        '" <' +
        this.configService.get('MAIL_SMTP_USERNAME') +
        '>',
      subject: 'Welcome to Ball Back System',
      template: Template.WELCOME,
      context: {
        email: sendWelcomeMailDto.email,
        verify_url:
          this.configService.get('GENERAL_WEB_DOMAIN') +
          '/user/verify-mail?verification_token=' +
          sendWelcomeMailDto.verification_token,
      },
    });
  }

  async sendForgetPasswordMail(
    sendForgetPasswordMailDto: SendForgetPasswordMailDto,
  ): Promise<void> {
    return this.mailerService.sendMail({
      to: sendForgetPasswordMailDto.email,
      from:
        '"' +
        this.configService.get('MAIL_SMTP_NAME') +
        '" <' +
        this.configService.get('MAIL_SMTP_USERNAME') +
        '>',
      subject: 'Reset Password',
      template: Template.RESET_PAWWSORD,
      context: {
        email: sendForgetPasswordMailDto.email,
        reset_url:
          this.configService.get('GENERAL_WEB_DOMAIN') +
          '/user/reset-password?password_reset_token=' +
          sendForgetPasswordMailDto.password_reset_token,
      },
    });
  }
}
