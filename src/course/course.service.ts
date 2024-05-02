import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto, EditCourseDto } from './dto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  //Get all Course
  async getAllCourse() {
    const allCourses = this.prisma.course.findMany({
      where: {
        isDeleted: false,
      },
    });

    return allCourses;
  }

  //Get Course by Id
  async getCourseById(courseId: number) {
    const course = await this.prisma.course.findUnique({
      where: {
        id: courseId,
        isDeleted: false,
      },
    });

    return course;
  }

  //Create Course
  async createCourse(dto: CreateCourseDto) {
    // Create new Course
    const newCourse = await this.prisma.course.create({
      data: {
        ...dto,
      },
    });

    return newCourse;
  }

  //Edit Course by Id
  async editCourseById(courseId: number, dto: EditCourseDto) {
    //Update class
    await this.prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        ...dto,
      },
    });

    return true;
  }

  //Delete Course By Id
  async deleteCourseById(courseId: number) {
    await this.prisma.course.update({
      where: {
        id: courseId,
      },
      data: {
        isDeleted: true,
      },
    });

    return true;
  }
}
