import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClassService } from './class.service';
import { Public } from 'src/common/decorators';
import { CreateClassDto, CreateClassWithExcelDto, EditClassDto } from './dto';

@Controller('class')
export class ClassController {
  constructor(private classService: ClassService) {}

  //Get All Classes
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('')
  getAllClass() {
    return this.classService.getAllClass();
  }

  //Get Class By Id
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  getClassById(@Param('id', ParseIntPipe) classId: number) {
    return this.classService.getClassById(classId);
  }

  //Create Class
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('createClass')
  createClass(@Body() dto: CreateClassDto) {
    return this.classService.createClass(dto);
  }

  //Create Class With Excel
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('createClassWithExcel')
  @UseInterceptors(FileInterceptor('traineesFile'))
  createClassWithExcel(
    @Body() dto: CreateClassWithExcelDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.classService.createClassWithExcel(dto, file);
  }

  //Edit Class by Id
  @Public()
  @HttpCode(HttpStatus.OK)
  @Patch('editClass/:id')
  editClassById(
    @Param('id', ParseIntPipe) classId: number,
    @Body() dto: EditClassDto,
  ) {
    return this.classService.editClassById(classId, dto);
  }

  //Delete Class by Id
  @Public()
  @HttpCode(HttpStatus.OK)
  @Delete('deleteClass/:id')
  deleteClassById(@Param('id', ParseIntPipe) classId: number) {
    return this.classService.deleteClassById(classId);
  }
}
