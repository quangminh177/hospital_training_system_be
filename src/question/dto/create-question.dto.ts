import {
  ArrayMinSize,
  IsArray,
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

  @IsNumber()
  @IsNotEmpty()
  levelId: number;

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
