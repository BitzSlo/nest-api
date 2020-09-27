import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @MinLength(5)
  password: string;

  @IsNotEmpty()
  @IsString()
  password_reset_token: string;
}
