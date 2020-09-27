import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class ForgetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
