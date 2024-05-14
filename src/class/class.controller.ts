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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClassService } from './class.service';
import { CreateClassDto, CreateClassWithExcelDto, EditClassDto } from './dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('class')
@ApiTags('class')
export class ClassController {
  constructor(private classService: ClassService) {}

  //Get All Classes
  @Roles('ADMIN', 'UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('')
  getAllClass() {
    return this.classService.getAllClass();
  }

  //Get Class By Id
  @Roles('ADMIN', 'UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  getClassById(@Param('id', ParseIntPipe) classId: number) {
    return this.classService.getClassById(classId);
  }

  //Create Class
  @Roles('ADMIN', 'UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('createClass')
  createClass(@Body() dto: CreateClassDto) {
    return this.classService.createClass(dto);
  }

  //Create Class With Excel
  @Roles('ADMIN', 'UPPER')
  @UseGuards(RolesGuard)
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
  @Roles('UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('editClass/:id')
  editClassById(
    @Param('id', ParseIntPipe) classId: number,
    @Body() dto: EditClassDto,
  ) {
    return this.classService.editClassById(classId, dto);
  }

  //Delete Class by Id
  @Roles('UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('deleteClass/:id')
  deleteClassById(@Param('id', ParseIntPipe) classId: number) {
    return this.classService.deleteClassById(classId);
  }
}
