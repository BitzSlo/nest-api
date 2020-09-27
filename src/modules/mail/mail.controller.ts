import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MailService } from './mail.service';
import { SendWelcomeMailDto } from './dto/send-welcome-mail.dto';

@Controller('mail')
@UseGuards(JwtAuthGuard)
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('welcome')
  async create(@Body() sendWelcomeMailDto: SendWelcomeMailDto): Promise<void> {
    return this.mailService.sendWelcomeMail(sendWelcomeMailDto);
  }
}
