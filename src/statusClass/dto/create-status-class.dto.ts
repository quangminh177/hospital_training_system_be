import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStatusClassDto {
  @IsNotEmpty()
  @IsString()
  statusClass: string;

  @IsNotEmpty()
  @IsString()
  description?: string;
}
