import { Gender, Job } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddTraineesByExcelFile {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  dob: Date;

  @IsNumber()
  @IsNotEmpty()
  departmentId: number;

  @IsEnum(Job)
  @IsOptional()
  job: Job;

  @IsEnum(Gender)
  @IsOptional()
  gender: Gender;
}
