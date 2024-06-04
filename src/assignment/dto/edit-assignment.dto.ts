import { Transform } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class EditAssignmentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  instruction?: string;

  @IsOptional()
  @IsNumber()
  weight: number;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  startAt: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  endAt: Date;

  @IsOptional()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  dueAt: Date;
}
