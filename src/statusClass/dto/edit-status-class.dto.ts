import { IsOptional, IsString } from 'class-validator';

export class EditStatusClassDto {
  @IsOptional()
  @IsString()
  statusClass?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
