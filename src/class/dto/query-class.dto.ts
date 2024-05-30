import { IsOptional, IsInt, IsString, Min, Max, IsEnum } from 'class-validator';
import { StatusClass } from '@prisma/client';

export class ClassQueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  size?: number;

  @IsOptional()
  @IsEnum(StatusClass)
  status?: StatusClass;

  @IsOptional()
  @IsString()
  keyword?: string;
}
