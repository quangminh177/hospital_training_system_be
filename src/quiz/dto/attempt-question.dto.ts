import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class AttemptQuestionDto {
  @IsNotEmpty()
  @IsNumber()
  questionId: number;

  @IsArray()
  @IsOptional()
  @ArrayMinSize(0)
  chosenAnswerId?: Array<number>;
}
