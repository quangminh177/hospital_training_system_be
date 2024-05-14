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
export class SignupDto {
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
  @IsNotEmpty()
  role: Role;

  @IsEnum(Job)
  @IsNotEmpty()
  job: Job;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsNotEmpty()
  dob: Date;

  @IsString()
  @IsOptional()
  image?: string;

  @IsEnum(Gender)
  @IsNotEmpty()
  gender: Gender;

  @IsNotEmpty()
  @IsInt()
  departmentId: number;
}
