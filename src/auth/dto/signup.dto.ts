import { Gender, Role } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDate,
  // IsEmail,
  IsEnum,
  IsInt,
  // IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { SigninDto } from './signin.dto';
export class SignupDto extends SigninDto {
  // @IsEmail()
  // @IsNotEmpty()
  // email: string;

  // @IsString()
  // @IsNotEmpty()
  // password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEnum(Role)
  role: Role;

  @IsString()
  phone: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dob: Date;

  @IsString()
  image: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsOptional()
  @IsInt()
  departmentId: number;
}
