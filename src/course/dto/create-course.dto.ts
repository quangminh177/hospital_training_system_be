import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  courseName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  credit: number;

  @IsNumber()
  @IsNotEmpty()
  totalSession: number;

  @IsNotEmpty()
  @IsNumber()
  departmentId: number;
}
