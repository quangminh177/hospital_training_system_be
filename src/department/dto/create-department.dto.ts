import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @IsNotEmpty()
  @IsString()
  departmentName: string;

  @IsString()
  @IsOptional()
  description?: string;
}
