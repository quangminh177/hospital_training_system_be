import { Level } from '@prisma/client';
import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateAnswerDto } from './create-answer.dto';
import { Type } from 'class-transformer';

export class EditQuestionDto {
  @IsNumber()
  @IsOptional()
  topicId?: number;

  @IsEnum(Level)
  @IsOptional()
  level?: Level;

  @IsOptional()
  @IsString()
  questionName?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(3)
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerDto)
  answers?: CreateAnswerDto[];
}
