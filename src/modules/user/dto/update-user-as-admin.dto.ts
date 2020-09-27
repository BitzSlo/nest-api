import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsUppercase,
  IsIn,
} from 'class-validator';
import { UserRoleType } from './../../user-role/enum/user-role.enum';

export class UpdateUserAsAdminDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(5)
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsUppercase()
  @IsIn([UserRoleType.ADMIN, UserRoleType.USER])
  user_role: UserRoleType;
}
