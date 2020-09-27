import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UseGuards,
  Param,
  Put,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserAsAdminDto } from './dto/update-user-as-admin.dto';
import { User } from './user.entity';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../../decorators/user.decorator';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRoleType } from '../user-role/enum/user-role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(UserRoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get('all')
  async getAll(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Post('verify-mail')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto): Promise<User> {
    return this.userService.verifyEmail(verifyEmailDto);
  }

  @Post('forget-password')
  async forgetPassword(
    @Body() forgetPasswordDto: ForgetPasswordDto,
  ): Promise<void> {
    return this.userService.forgetPassword(forgetPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<User> {
    return this.userService.resetPassword(resetPasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getOne(@GetUser() user: User): Promise<User> {
    return this.userService.getUserById(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async update(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(user.id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async delete(@GetUser() user: User): Promise<void> {
    return this.userService.delete(user.id);
  }

  @Roles(UserRoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Get(':id')
  async getOneAsAdmin(@Param('id') id): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Roles(UserRoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put(':id')
  async updateAsAdmin(
    @Param('id') id,
    @Body() updateAsAdminUserDto: UpdateUserAsAdminDto,
  ): Promise<User> {
    return this.userService.updateAsAdmin(id, updateAsAdminUserDto);
  }

  @Roles(UserRoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Delete(':id')
  async deleteAsAdmin(@Param('id') id): Promise<void> {
    return this.userService.delete(id);
  }
}
