import {
  Body,
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFileDto } from './dto/upload-file.dto';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../../decorators/roles.decorator';
import { UserRoleType } from '../user-role/enum/user-role.enum';
import { Media } from './media.entity';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Roles(UserRoleType.ADMIN)
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file,
    @Body() uploadFileDto: UploadFileDto,
  ): Promise<Media> {
    const createMediaDto = await this.mediaService.moveFile(
      uploadFileDto,
      file,
    );
    return this.mediaService.create(createMediaDto);
  }

  @Get(':img_name')
  async seeUploadedFile(@Param('img_name') image, @Res() res) {
    const media = await this.mediaService.getMediaByName(image);

    return res.sendFile(media.name, {
      root: await this.mediaService.getFileLocation(media),
    });
  }
}
