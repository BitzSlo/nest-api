import { UserRoleType } from '../../user-role/enum/user-role.enum';
import { GenderType } from '../../user/enum/gender-type.enum';

export class AuthResponseDto {
  email: string;
  role: UserRoleType;
  access_token: string;
  first_name: string;
  last_name: string;
  birthdate: Date;
  gender: GenderType;
}
