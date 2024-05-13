import { Level } from '@prisma/client';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateAnswer } from './create-answer.dto';
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

  @IsOptional()
  @IsString()
  image?: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateAnswer)
  answer: CreateAnswer[];
}
