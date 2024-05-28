import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { AttemptQuestionDto } from './attempt-question.dto';
import { Type } from 'class-transformer';

export class AttemptQuizDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(2)
  @ValidateNested({ each: true })
  @Type(() => AttemptQuestionDto)
  attemptQuestion: AttemptQuestionDto[];
}
