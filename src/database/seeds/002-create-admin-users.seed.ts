import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { UserRole } from '../../modules/user-role/user-role.entity';
import { User } from '../../modules/user/user.entity';
import { UserRoleType } from '../../modules/user-role/enum/user-role.enum';
import { EncryptionService } from '../../modules/encryption/encryption.service';
import { ConfigService } from '@nestjs/config';
import { GenderType } from '../../modules/user/enum/gender-type.enum';

export default class CreateAdminUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const userRole = await connection
      .getRepository(UserRole)
      .createQueryBuilder('user_role')
      .where("user_role.user_role_type = '" + UserRoleType.ADMIN + "'")
      .getOne();
    const configService: ConfigService = new ConfigService();
    const encryptionService: EncryptionService = new EncryptionService(
      configService,
    );
    const hashedPassword = await encryptionService.hashPassword('Test123!');
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          id: 1,
          email: 'luka.zlatecan@gmail.com',
          is_verified: true,
          password: hashedPassword,
          user_role: userRole,
          first_name: 'Luka',
          last_name: 'Zlatečan',
          birthdate: new Date('1994-05-05'),
          gender: GenderType.MALE,
        },
      ])
      .execute();
  }
}
