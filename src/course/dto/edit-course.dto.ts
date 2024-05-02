import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EditCourseDto {
  @IsOptional()
  @IsString()
  courseName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  credit?: number;

  @IsNumber()
  @IsOptional()
  totalSession?: number;

  @IsOptional()
  @IsNumber()
  departmentId?: number;
}
