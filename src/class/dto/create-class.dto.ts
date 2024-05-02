import { User } from '@prisma/client';
import { IsArray, IsOptional } from 'class-validator';
import { CreateClassWithExcelDto } from './create-class-with-excel.dto';
// import { AddTraineesByExcelFile } from './add-trainees-by-excel-file.dto';

export class CreateClassDto extends CreateClassWithExcelDto {
  @IsArray()
  @IsOptional()
  trainees: Array<User>;
}
