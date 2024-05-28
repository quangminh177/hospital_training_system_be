import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class AttemptQuestionDto {
  @IsNotEmpty()
  @IsNumber()
  questionId: number;

  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  chosenAnswerId: Array<number>;
}
