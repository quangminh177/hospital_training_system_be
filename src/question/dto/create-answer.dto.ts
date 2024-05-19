import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateAnswerDto {
  @IsNotEmpty()
  @IsString()
  answerName: string;

  @IsNotEmpty()
  @IsBoolean()
  isCorrect: boolean;
}
