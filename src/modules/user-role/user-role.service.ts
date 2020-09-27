import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole } from './user-role.entity';
import { UserRoleType } from './enum/user-role.enum';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  async getAll(): Promise<UserRole[]> {
    return this.userRoleRepository.find();
  }

  async getUserRoleByUserRoleType(
    user_role_type: UserRoleType,
  ): Promise<UserRole | null> {
    return this.userRoleRepository.findOne({ user_role_type });
  }
}
