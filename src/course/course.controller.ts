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
} from '@nestjs/common';
import { CourseService } from './course.service';
import { Public } from 'src/common/decorators';
import { CreateCourseDto, EditCourseDto } from './dto';

@Controller('course')
export class CourseController {
  constructor(private courseService: CourseService) {}

  //Get All Courses
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('')
  getAllCourse() {
    return this.courseService.getAllCourse();
  }

  //Get Course By Id
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  getClassById(@Param('id', ParseIntPipe) courseId: number) {
    return this.courseService.getCourseById(courseId);
  }

  //Create Course
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('createCourse')
  async createCourse(@Body() dto: CreateCourseDto) {
    return this.courseService.createCourse(dto);
  }

  //Edit Course by Id
  @Public()
  @HttpCode(HttpStatus.OK)
  @Patch('editCourse/:id')
  editClassById(
    @Param('id', ParseIntPipe) courseId: number,
    @Body() dto: EditCourseDto,
  ) {
    return this.courseService.editCourseById(courseId, dto);
  }

  //Delete Course by Id
  @Public()
  @HttpCode(HttpStatus.OK)
  @Delete('deleteCourse/:id')
  deleteClassById(@Param('id', ParseIntPipe) courseId: number) {
    return this.courseService.deleteCourseById(courseId);
  }
}
