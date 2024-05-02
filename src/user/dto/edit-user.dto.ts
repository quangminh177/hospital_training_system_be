import { Gender, Job } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsOptional()
  dob?: Date;

  @IsString()
  @IsOptional()
  image?: string;

  @IsEnum(Job)
  @IsOptional()
  job?: Job;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsNumber()
  @IsOptional()
  departmentId?: number;
}
