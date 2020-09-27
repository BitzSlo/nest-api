import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import { TransformDateToISO8601 } from '../../helpers/ISO8601-date-transformer.helper';
import { UploadFileType } from './enum/upload-file-type.enum';

@Entity()
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    nullable: false,
  })
  original_name: string;

  @Column({
    nullable: false,
  })
  file_type: UploadFileType;

  @Transform(TransformDateToISO8601)
  @CreateDateColumn()
  created_at: Date;

  @Transform(TransformDateToISO8601)
  @UpdateDateColumn()
  updated_at: Date;
}
