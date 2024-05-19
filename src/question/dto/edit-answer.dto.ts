import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EditAnswerDto {
  @IsNumber()
  @IsNotEmpty()
  answerId: number;

  @IsNotEmpty()
  @IsString()
  answerName: string;

  @IsNotEmpty()
  @IsBoolean()
  isCorrect: boolean;
}
