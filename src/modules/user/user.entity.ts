import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Generated,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { TransformDateToISO8601 } from '../../helpers/ISO8601-date-transformer.helper';
import { UserRole } from '../user-role/user-role.entity';
import { GenderType } from './enum/gender-type.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Transform(TransformDateToISO8601)
  @Column({ nullable: true })
  birthdate: Date;

  @Column({ nullable: true })
  gender: GenderType;

  @Exclude()
  @Column({ nullable: true })
  password: string;

  @Column({ unique: true })
  @Generated('uuid')
  uuid: string;

  @Exclude()
  @Column({
    nullable: false,
    default: false,
  })
  is_verified: boolean;

  @Transform(user_role => user_role.user_role_type)
  @ManyToOne(
    type => UserRole,
    user_role => user_role.users,
    {
      eager: true,
    },
  )
  @JoinColumn({ name: 'user_role_id' })
  user_role: UserRole;

  @Exclude()
  @Column({ nullable: true })
  verification_token: string;

  @Exclude()
  @Column({ nullable: true })
  password_reset_token: string;

  @Exclude()
  @Transform(TransformDateToISO8601)
  @Column({ nullable: true })
  password_reset_token_expires: Date;

  @Transform(TransformDateToISO8601)
  @CreateDateColumn()
  created_at: Date;

  @Transform(TransformDateToISO8601)
  @UpdateDateColumn()
  updated_at: Date;
}
