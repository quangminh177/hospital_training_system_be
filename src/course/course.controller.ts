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
import { CreateCourseDto, EditCourseDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('course')
@ApiTags('course')
export class CourseController {
  constructor(private courseService: CourseService) {}

  //Get All Courses
  @HttpCode(HttpStatus.OK)
  @Get('')
  getAllCourse() {
    return this.courseService.getAllCourse();
  }

  //Get Course By Id
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  getCourseById(@Param('id', ParseIntPipe) courseId: number) {
    return this.courseService.getCourseById(courseId);
  }

  //Create Course
  @HttpCode(HttpStatus.CREATED)
  @Post('createCourse')
  async createCourse(@Body() dto: CreateCourseDto) {
    return this.courseService.createCourse(dto);
  }

  //Edit Course by Id
  @HttpCode(HttpStatus.OK)
  @Patch('editCourse/:id')
  editCourseById(
    @Param('id', ParseIntPipe) courseId: number,
    @Body() dto: EditCourseDto,
  ) {
    return this.courseService.editCourseById(courseId, dto);
  }

  //Delete Course by Id
  @HttpCode(HttpStatus.OK)
  @Delete('deleteCourse/:id')
  deleteCourseById(@Param('id', ParseIntPipe) courseId: number) {
    return this.courseService.deleteCourseById(courseId);
  }
}
