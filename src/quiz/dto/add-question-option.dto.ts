import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddQuestionOption {
  @IsNotEmpty()
  @IsNumber()
  numberOfEasyQuestion: number;

  @IsNotEmpty()
  @IsNumber()
  numberOfMediumQuestion: number;

  @IsNotEmpty()
  @IsNumber()
  numberOfHardQuestion: number;
}
