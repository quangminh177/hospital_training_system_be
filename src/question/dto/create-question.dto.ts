import { Level } from '@prisma/client';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateAnswerDto } from './create-answer.dto';
import { Type } from 'class-transformer';

export class CreateQuestionDto {
  @IsNumber()
  @IsNotEmpty()
  topicId: number;

  @IsEnum(Level)
  @IsNotEmpty()
  level: Level;

  @IsNotEmpty()
  @IsString()
  questionName: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(3)
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerDto)
  answers: CreateAnswerDto[];
}
