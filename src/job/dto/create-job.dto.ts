import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  jobName: string;

  @IsOptional()
  @IsString()
  description?: string;
}
