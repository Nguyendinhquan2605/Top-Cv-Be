import { IsArray, IsBoolean, IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Email không được để trống!' })
  name: string;

  @IsNotEmpty({ message: 'Description không được để trống!' })
  description: string;

  @IsNotEmpty({ message: 'Email không được để trống!' })
  @IsBoolean({ message: 'isActive có giá trị boolean' })
  isActive: boolean;

  @IsNotEmpty({ message: 'permission không được để trống!' })
  @IsMongoId({ each: true, message: 'each permission là mongo object id' })
  @IsArray({ message: 'permisson có định dạng là array' })
  permissions: mongoose.Schema.Types.ObjectId[];
}
