import { IsOptional, IsString } from 'class-validator';

export class EditCurriculumDto {
  @IsOptional()
  @IsString()
  curriculumName?: string;

  @IsOptional()
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsOptional()
  duration?: string;
}
