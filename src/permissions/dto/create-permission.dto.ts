import { IsMongoId, IsNotEmpty } from 'class-validator';
import mongoose from 'mongoose';

export class CreatePermissionDto {
  @IsNotEmpty({ message: 'Email không được để trống!' })
  name: string;

  @IsNotEmpty({ message: 'API_Path không được để trống!' })
  apiPath: string;

  @IsNotEmpty({ message: 'Method không được để trống!' })
  method: string;

  @IsNotEmpty({ message: 'Module không được để trống!' })
  module: string;
}
