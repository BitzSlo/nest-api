import { IsIn, IsNotEmpty, IsString, IsUppercase } from 'class-validator';
import { UploadFileType } from '../enum/upload-file-type.enum';

export class UploadFileDto {
  @IsNotEmpty()
  @IsString()
  @IsUppercase()
  @IsIn([UploadFileType.IMAGE_PRODUCT])
  upload_file_type: UploadFileType;
}
