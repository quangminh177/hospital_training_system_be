import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from './excel.service';

@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Post('convert')
  @UseInterceptors(FileInterceptor('file'))
  async convertExcelToJSON(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    const fileBuffer = file.buffer;
    return this.excelService.convertToJSON(fileBuffer);
  }
}
