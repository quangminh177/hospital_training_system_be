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
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto, EditCourseDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('course')
@ApiTags('course')
export class CourseController {
  constructor(private courseService: CourseService) {}

  //Get All Courses
  @Roles('UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('')
  getAllCourse() {
    return this.courseService.getAllCourse();
  }

  //Get Course By Id
  @Roles('UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  getCourseById(@Param('id', ParseIntPipe) courseId: number) {
    return this.courseService.getCourseById(courseId);
  }

  //Create Course
  @Roles('UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('createCourse')
  async createCourse(@Body() dto: CreateCourseDto) {
    return this.courseService.createCourse(dto);
  }

  //Edit Course by Id
  @Roles('UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('editCourse/:id')
  editCourseById(
    @Param('id', ParseIntPipe) courseId: number,
    @Body() dto: EditCourseDto,
  ) {
    return this.courseService.editCourseById(courseId, dto);
  }

  //Delete Course by Id
  @Roles('UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('deleteCourse/:id')
  deleteCourseById(@Param('id', ParseIntPipe) courseId: number) {
    return this.courseService.deleteCourseById(courseId);
  }
}
