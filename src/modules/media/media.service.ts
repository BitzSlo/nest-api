import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMediaDto } from './dto/create-media.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { Media } from './media.entity';
import { renameSync, statSync, mkdirSync } from 'fs';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    private configService: ConfigService,
  ) {}

  async create(createMediaDto: CreateMediaDto): Promise<Media> {
    const { upload_file_type, name, original_name } = createMediaDto;

    const media = new Media();
    media.file_type = upload_file_type;
    media.name = name;
    media.original_name = original_name;

    return this.mediaRepository.save(media);
  }

  async getMediaByName(name: string): Promise<Media | null> {
    return this.mediaRepository.findOne({ name });
  }

  async moveFile(uploadFileDto: UploadFileDto, file): Promise<CreateMediaDto> {
    const { upload_file_type } = uploadFileDto;
    const newDestination = join(file.destination, upload_file_type);
    let stat = null;
    try {
      stat = statSync(newDestination);
    } catch (err) {
      mkdirSync(newDestination);
    }
    if (stat && !stat.isDirectory()) {
      throw new InternalServerErrorException();
    }
    const newPath = join(newDestination, file.filename);
    renameSync(file.path, newPath);
    return {
      upload_file_type: upload_file_type,
      name: file.filename,
      original_name: file.originalname,
    };
  }

  async getFileLocation(media: Media): Promise<string> {
    return join(this.configService.get('MEDIA_UPLOAD_FOLDER'), media.file_type);
  }
}
