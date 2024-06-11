import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddQuestionOption {
  @IsNotEmpty()
  @IsNumber()
  levelId: number;

  @IsNotEmpty()
  @IsNumber()
  numberOfLevelQuestion: number;
}
