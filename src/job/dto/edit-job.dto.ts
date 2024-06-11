import { IsOptional, IsString } from 'class-validator';

export class EditJobDto {
  @IsOptional()
  @IsString()
  jobName?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
