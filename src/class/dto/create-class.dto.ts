import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddSchedule } from './add-schedules.dto';
import { AddTrainees } from './add-trainees.dto';

export class CreateClassDto {
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
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AddSchedule)
  schedules: AddSchedule[];

  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AddTrainees)
  trainees: AddTrainees[];
}
