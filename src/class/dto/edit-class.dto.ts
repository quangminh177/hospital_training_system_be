import { Schedule } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditClassDto {
  @IsNumber()
  @IsOptional()
  courseId?: number;

  @IsNumber()
  @IsOptional()
  curriculumId?: number;

  @IsString()
  @IsOptional()
  className?: string;

  @IsNumber()
  @IsOptional()
  trainerId?: number;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  startDate?: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  endDate?: Date;

  @IsOptional()
  @IsNumber()
  minQuantity?: number;

  @IsOptional()
  @IsNumber()
  maxQuantity?: number;

  @IsOptional()
  @IsBoolean()
  allowedRegister?: boolean;

  @IsOptional()
  @IsArray()
  schedules?: Array<Schedule>;
}
