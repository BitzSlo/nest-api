import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendForgetPasswordMailDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password_reset_token: string;
}
