import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditQuizDto {
  @IsOptional()
  @IsNumber()
  topicId?: number;

  @IsOptional()
  @IsString()
  quizName?: string;

  @IsOptional()
  @IsNumber()
  timeLimit?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  startAt?: Date;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  endAt?: Date;

  @IsOptional()
  @IsBoolean()
  seeAnswer: boolean;
}
