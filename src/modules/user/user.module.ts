import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { MailModule } from '../mail/mail.module';
import { EncryptionModule } from '../encryption/encryption.module';
import { UserRoleModule } from '../user-role/user-role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MailModule,
    EncryptionModule,
    UserRoleModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
