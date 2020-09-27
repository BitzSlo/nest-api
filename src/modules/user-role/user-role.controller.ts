import { Controller, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from './user-role.entity';
import { UserRoleService } from './user-role.service';

@Controller('user-role')
export class UserRoleController {
  constructor(private readonly userRoleService: UserRoleService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(): Promise<UserRole[]> {
    return this.userRoleService.getAll();
  }
}
