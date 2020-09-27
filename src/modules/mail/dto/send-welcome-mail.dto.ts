import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendWelcomeMailDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  verification_token: string;
}
