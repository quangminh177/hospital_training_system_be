import { Schedule } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateClassWithExcelDto {
  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @IsNumber()
  @IsNotEmpty()
  curriculumId: number;

  @IsString()
  @IsNotEmpty()
  className: string;

  @IsNumber()
  @IsNotEmpty()
  trainerId: number;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDate: Date;

  @IsNotEmpty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  endDate: Date;

  @IsNotEmpty()
  @IsNumber()
  minQuantity: number;

  @IsNotEmpty()
  @IsNumber()
  maxQuantity: number;

  @IsNotEmpty()
  @IsBoolean()
  allowedRegister: boolean;

  @IsArray()
  @IsNotEmpty()
  @IsOptional()
  schedules: Array<Schedule>;
}
