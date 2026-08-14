import { Area } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryCamperDto {
  @IsOptional()
  @IsEnum(Area, { message: 'Invalid area filter' })
  area?: Area;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt({ message: 'Age filter must be a whole number' })
  @Min(3, { message: 'Age filter must be at least 3' })
  @Max(25, { message: 'Age filter must be 25 or under' })
  age?: number;

  @IsOptional()
  @IsString()
  gender?: string;
}
