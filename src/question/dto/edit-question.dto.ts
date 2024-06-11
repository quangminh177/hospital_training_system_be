import {
  ArrayMinSize,
  IsArray,
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

  @IsNumber()
  @IsOptional()
  levelId?: number;

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
