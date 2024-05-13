import { IsOptional, IsString } from 'class-validator';

export class EditDepartmentDto {
  @IsOptional()
  @IsString()
  departmentName?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
