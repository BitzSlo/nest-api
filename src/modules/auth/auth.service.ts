import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { EncryptionService } from '../encryption/encryption.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from '../user/user.entity';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private encryptionService: EncryptionService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    createUserDto.password = await this.encryptionService.hashPassword(
      createUserDto.password,
    );
    const user = await this.userService.create(createUserDto);
    return {
      email: user.email,
      role: user.user_role.user_role_type,
      access_token: await this.generateAccessToken(user.uuid),
      first_name: user.first_name,
      last_name: user.last_name,
      birthdate: user.birthdate,
      gender: user.gender,
    };
  }

  async signin(user: User): Promise<AuthResponseDto> {
    return {
      email: user.email,
      role: user.user_role.user_role_type,
      access_token: await this.generateAccessToken(user.uuid),
      first_name: user.first_name,
      last_name: user.last_name,
      birthdate: user.birthdate,
      gender: user.gender,
    };
  }

  async validateUser(userCredentialsDto: UserCredentialsDto): Promise<User> {
    const { email, password } = userCredentialsDto;
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      return null;
    }
    const isValidPassword = await this.encryptionService.comparePassword(
      password,
      user.password,
    );
    if (!isValidPassword) {
      return null;
    }
    return user;
  }

  private async generateAccessToken(uuid: string): Promise<string> {
    const payload: JwtPayload = { uuid };
    const access_token = await this.jwtService.signAsync(payload);

    return access_token;
  }
}
