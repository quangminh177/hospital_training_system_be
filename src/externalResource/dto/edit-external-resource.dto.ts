import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EditExternalResourceDto {
  @IsOptional()
  @IsNumber()
  topicId?: number;

  @IsOptional()
  @IsString()
  externalUrl?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
