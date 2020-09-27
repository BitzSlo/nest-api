import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MediaFileFilter } from '../../helpers/media-file-filter.helper';
import { diskStorage } from 'multer';
import { MediaFileName } from '../../helpers/media-file-name.helper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './media.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get('MEDIA_UPLOAD_FOLDER'),
          filename: MediaFileName,
        }),
        fileFilter: MediaFileFilter,
        limits: {
          files: 1,
          fileSize:
            +configService.get<number>('MEDIA_UPLOAD_SIZE_LIMIT_MB') *
            1024 *
            1024,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [MediaService],
  controllers: [MediaController],
})
export class MediaModule {}
