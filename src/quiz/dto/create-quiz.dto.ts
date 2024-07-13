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
import { AddQuestionOption } from './add-question-option.dto';

export class CreateQuizDto {
  @IsNotEmpty()
  @IsNumber()
  topicId: number;

  @IsNotEmpty()
  @IsString()
  quizName: string;

  @IsNotEmpty()
  @IsNumber()
  timeLimit: number;

  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  startAt: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  endAt: Date;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AddQuestionOption)
  option: AddQuestionOption[];

  @IsNotEmpty()
  @IsBoolean()
  seeAnswer: boolean;

  // @IsNotEmpty()
  // @IsNumber()
  // numberOfQuizzes: number;
}
