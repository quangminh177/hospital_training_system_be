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
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClassService } from './class.service';
import {
  ClassQueryDto,
  CreateClassDto,
  CreateClassWithExcelDto,
  EditClassDto,
} from './dto';
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
  async getAllClass(
    @Query()
    query: ClassQueryDto,
  ) {
    return await this.classService.getAllClass(query);
  }

  //Get Class By Id
  @Roles('ADMIN', 'UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getClassById(@Param('id', ParseIntPipe) classId: number) {
    return await this.classService.getClassById(classId);
  }

  //Create Class
  @Roles('ADMIN', 'UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('createClass')
  async createClass(@Body() dto: CreateClassDto) {
    return await this.classService.createClass(dto);
  }

  //Create Class With Excel
  @Roles('ADMIN', 'UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('createClassWithExcel')
  @UseInterceptors(FileInterceptor('traineesFile'))
  async createClassWithExcel(
    @Body() dto: CreateClassWithExcelDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.classService.createClassWithExcel(dto, file);
  }

  //Edit Class by Id
  @Roles('ADMIN', 'UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('editClass/:id')
  async editClassById(
    @Param('id', ParseIntPipe) classId: number,
    @Body() dto: EditClassDto,
  ) {
    return await this.classService.editClassById(classId, dto);
  }

  //Delete Class by Id
  @Roles('ADMIN', 'UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('deleteClass/:id')
  async deleteClassById(@Param('id', ParseIntPipe) classId: number) {
    return await this.classService.deleteClassById(classId);
  }
}
