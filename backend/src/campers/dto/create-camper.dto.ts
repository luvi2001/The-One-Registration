import { Area } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCamperDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(100)
  fullName: string;

  @IsInt({ message: 'Age must be a whole number' })
  @Min(3, { message: 'Age must be at least 3' })
  @Max(25, { message: 'Age must be 25 or under' })
  age: number;

  @IsEnum(Area, { message: 'Please select a valid area' })
  area: Area;

  @IsString()
  @Matches(/^[0-9+\s-]{9,15}$/, { message: 'Enter a valid mobile number' })
  mobileNumber: string;

  @IsString()
  @IsNotEmpty({ message: 'School is required' })
  @MaxLength(150)
  school: string;

  @IsDateString({}, { message: 'Please enter a valid date of birth' })
  dateOfBirth: string;

  @IsString()
  @IsNotEmpty({ message: 'Gender is required' })
  @MaxLength(20)
  gender: string;

  @IsString()
  @IsNotEmpty({ message: 'Address is required' })
  @MaxLength(250)
  address: string;

  @IsString()
  @IsNotEmpty({ message: 'Parent or guardian name is required' })
  @MaxLength(100)
  parentsName: string;

  @IsString()
  @Matches(/^[0-9+\s-]{9,15}$/, { message: 'Enter a valid parent phone number' })
  telephoneNumberOfParents: string;

  @IsString()
  @IsNotEmpty({ message: 'Religion is required' })
  @MaxLength(50)
  religion: string;
}
