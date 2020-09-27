import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { UserRole } from '../../modules/user-role/user-role.entity';
import { UserRoleType } from '../../modules/user-role/enum/user-role.enum';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(UserRole)
      .values([
        {
          id: 1,
          user_role_type: UserRoleType.ADMIN,
          description: 'Admin role that has access to all of the endpoints',
        },
        {
          id: 2,
          user_role_type: UserRoleType.USER,
          description: 'Default role for all the users with limited access',
        },
      ])
      .execute();
  }
}
