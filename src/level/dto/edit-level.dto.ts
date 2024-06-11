import { IsOptional, IsString } from 'class-validator';

export class EditLevelDto {
  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
