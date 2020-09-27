import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserAsAdminDto } from './dto/update-user-as-admin.dto';
import { User } from './user.entity';
import { ExceptionCodeName } from '../../exceptions/exception-codes.enum';
import { MailService } from '../mail/mail.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EncryptionService } from '../encryption/encryption.service';
import { ConfigService } from '@nestjs/config';
import { UserRoleService } from '../user-role/user-role.service';
import { UserRoleType } from '../user-role/enum/user-role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private mailService: MailService,
    private encryptionService: EncryptionService,
    private configService: ConfigService,
    private userRoleService: UserRoleService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password } = createUserDto;

    const existingUser = await this.getUserByEmail(email);

    if (existingUser) {
      throw new ConflictException(ExceptionCodeName.EMAIL_CONFLICT);
    }
    const user = new User();
    user.email = email;
    user.password = password;
    user.verification_token = await this.encryptionService.generateRandomHash();
    const userRole = await this.userRoleService.getUserRoleByUserRoleType(
      UserRoleType.USER,
    );

    if (!userRole) {
      throw new InternalServerErrorException();
    }
    user.user_role = userRole;

    return this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const { email, password } = updateUserDto;

    const user = await this.getUserById(id);

    if (!user) {
      throw new UnauthorizedException(ExceptionCodeName.INVALID_USER_ID);
    }

    user.email = email;
    user.password = password;

    return this.userRepository.save(user);
  }

  async updateAsAdmin(
    id: number,
    updateUserAsAdminDto: UpdateUserAsAdminDto,
  ): Promise<User> {
    const { email, password, user_role } = updateUserAsAdminDto;

    const user = await this.getUserById(id);

    if (!user) {
      throw new UnauthorizedException(ExceptionCodeName.INVALID_USER_ID);
    }

    user.email = email;
    user.password = password;
    const userRole = await this.userRoleService.getUserRoleByUserRoleType(
      user_role,
    );

    if (!userRole) {
      throw new InternalServerErrorException();
    }
    user.user_role = userRole;

    return this.userRepository.save(user);
  }

  async getAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ email });
  }

  async getUserByUUID(uuid: string): Promise<User | null> {
    return this.userRepository.findOne({ uuid });
  }

  async getUserByVerificationToken(
    verification_token: string,
  ): Promise<User | null> {
    return this.userRepository.findOne({ verification_token });
  }

  async getUserByPasswordResetToken(
    password_reset_token: string,
  ): Promise<User | null> {
    return this.userRepository.findOne({ password_reset_token });
  }

  async delete(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto): Promise<User> {
    const user = await this.getUserByVerificationToken(
      verifyEmailDto.verification_token,
    );
    if (!user) {
      throw new UnauthorizedException(
        ExceptionCodeName.INVALID_VERIFICATION_TOKEN,
      );
    }
    user.is_verified = true;
    user.verification_token = null;
    return this.userRepository.save(user);
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto): Promise<void> {
    const user = await this.getUserByEmail(forgetPasswordDto.email);
    if (!user) {
      throw new UnauthorizedException(ExceptionCodeName.INVALID_EMAIL);
    }
    user.password_reset_token = await this.encryptionService.generateRandomHash();
    user.password_reset_token_expires = new Date(
      Date.now() +
        +this.configService.get<number>(
          'GENERAL_PASSWORD_RESET_TOKEN_EXPIRATION',
        ),
    );

    this.mailService.sendForgetPasswordMail({
      email: user.email,
      password_reset_token: user.password_reset_token,
    });

    await this.userRepository.save(user);
    return null;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<User> {
    const user = await this.getUserByPasswordResetToken(
      resetPasswordDto.password_reset_token,
    );
    if (!user) {
      throw new UnauthorizedException(
        ExceptionCodeName.INVALID_PASSWORD_RESET_TOKEN,
      );
    }
    if (Date.now() > user.password_reset_token_expires.getMilliseconds()) {
      throw new UnauthorizedException(
        ExceptionCodeName.PASSWORD_RESET_TOKEN_EXPIRED,
      );
    }
    user.password = await this.encryptionService.hashPassword(
      resetPasswordDto.password,
    );

    this.mailService.sendForgetPasswordMail({
      email: user.email,
      password_reset_token: user.password_reset_token,
    });

    return this.userRepository.save(user);
  }
}
