import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ExcelService } from './excel.service';
import { ExcelController } from './excel.controller';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  providers: [ExcelService],
  controllers: [ExcelController],
  exports: [ExcelService],
})
export class ExcelModule {}
