import { Gender, Job, Role } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEnum(Role)
  role: Role;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dob: Date;

  @IsString()
  image: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsEnum(Job)
  @IsOptional()
  job: Job;

  @IsOptional()
  @IsInt()
  departmentId: number;
}
