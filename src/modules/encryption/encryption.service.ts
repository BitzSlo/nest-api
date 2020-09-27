import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EncryptionService {
  constructor(private configService: ConfigService) {}

  async hashPassword(password: string): Promise<string> {
    const saltRounds: number = +this.configService.get<number>(
      'BCRYPT_SALT_ROUNDS',
    );
    return bcrypt.hash(password, saltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async generateRandomHash(): Promise<string> {
    return crypto.randomBytes(32).toString('hex');
  }
}
