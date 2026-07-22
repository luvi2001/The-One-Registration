import { Area } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class QueryCamperDto {
  @IsOptional()
  @IsEnum(Area, { message: 'Invalid area filter' })
  area?: Area;

  @IsOptional()
  @IsString()
  search?: string;
}
