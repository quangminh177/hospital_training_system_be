import { IsNotEmpty, IsString } from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  jobName: string;

  @IsNotEmpty()
  @IsString()
  description?: string;
}
