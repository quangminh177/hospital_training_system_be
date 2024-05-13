import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAnswer {
  @IsNotEmpty()
  @IsString()
  answerName: string;

  @IsNotEmpty()
  @IsBoolean()
  isCorrect: boolean;

  @IsNotEmpty()
  @IsNumber()
  defaultOrder: number;

  @IsOptional()
  @IsString()
  image: string;
}
