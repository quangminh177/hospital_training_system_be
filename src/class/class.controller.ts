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
import { CreateClassDto, CreateClassWithExcelDto, EditClassDto } from './dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { StatusClass } from '@prisma/client';
// import { Public } from 'src/common/decorators';

@Controller('class')
@ApiTags('class')
export class ClassController {
  constructor(private classService: ClassService) {}

  //Get All Classes
  @Roles('ADMIN', 'UPPER')
  @UseGuards(RolesGuard)
  // @Public()
  @HttpCode(HttpStatus.OK)
  @Get('')
  getAllClass(
    @Query()
    querry: {
      page: number;
      size: number;
      status: StatusClass;
      keyword: string;
    },
  ) {
    return this.classService.getAllClass(querry);
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
  @Roles('ADMIN', 'UPPER')
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
  @Roles('ADMIN', 'UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('deleteClass/:id')
  deleteClassById(@Param('id', ParseIntPipe) classId: number) {
    return this.classService.deleteClassById(classId);
  }
}
