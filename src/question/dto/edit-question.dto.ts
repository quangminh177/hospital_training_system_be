import { Level } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class EditQuestionDto {
  @IsOptional()
  @IsNumber()
  topicId?: number;

  @IsEnum(Level)
  @IsOptional()
  level?: Level;

  @IsOptional()
  @IsString()
  questionName?: string;

  @IsOptional()
  @IsString()
  image?: string;
}
