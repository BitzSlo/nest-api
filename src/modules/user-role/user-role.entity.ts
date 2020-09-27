import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Transform } from 'class-transformer';
import { TransformDateToISO8601 } from '../../helpers/ISO8601-date-transformer.helper';
import { User } from '../user/user.entity';
import { UserRoleType } from './enum/user-role.enum';

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true,
  })
  user_role_type: UserRoleType;

  @Column({ nullable: true })
  description: string;

  @OneToMany(
    type => User,
    user => user.user_role,
  )
  users: User[];

  @Transform(TransformDateToISO8601)
  @CreateDateColumn()
  created_at: Date;

  @Transform(TransformDateToISO8601)
  @UpdateDateColumn()
  updated_at: Date;
}
