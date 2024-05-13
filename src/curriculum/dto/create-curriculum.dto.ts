import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCurriculumDto {
  @IsNotEmpty()
  @IsString()
  curriculumName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  duration: string;
}
