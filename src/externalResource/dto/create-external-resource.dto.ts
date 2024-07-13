import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateExternalResourceDto {
  @IsNotEmpty()
  @IsNumber()
  topicId: number;

  @IsOptional()
  @IsString()
  externalUrl?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
