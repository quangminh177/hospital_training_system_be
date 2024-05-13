import { DayInWeek } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class AddSchedule {
  @IsNotEmpty()
  @IsEnum(DayInWeek)
  schedule: DayInWeek;

  @IsNotEmpty()
  @IsString()
  startTime: string;

  @IsNotEmpty()
  @IsString()
  endTime: string;
}
