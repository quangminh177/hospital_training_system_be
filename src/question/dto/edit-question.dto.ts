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
import { Type } from 'class-transformer';
import { EditAnswerDto } from './edit-answer.dto';

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
  @Type(() => EditAnswerDto)
  answers?: EditAnswerDto[];
}
