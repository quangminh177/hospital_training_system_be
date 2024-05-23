import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto, EditCourseDto } from './dto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  //Get all Course
  async getAllCourse(querry: { page: number; size: number; keyword: string }) {
    try {
      const { page, size, keyword } = querry;
      if (page <= 0)
        throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);

      const take: number = size;
      const skip: number = (page - 1) * size;

      const allCourses = this.prisma.course.findMany({
        take: +take,
        skip: skip,
        where: {
          isDeleted: false,
          courseName: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
      });

      return allCourses;
    } catch (error) {
      throw error;
    }
  }

  //Get Course by Id
  async getCourseById(courseId: number) {
    try {
      const course = await this.prisma.course.findUnique({
        where: {
          id: courseId,
          isDeleted: false,
        },
      });

      return course;
    } catch (error) {
      throw error;
    }
  }

  //Create Course
  async createCourse(dto: CreateCourseDto) {
    try {
      // Create new Course
      const newCourse = await this.prisma.course.create({
        data: {
          ...dto,
        },
      });

      return newCourse;
    } catch (error) {
      throw error;
    }
  }

  //Edit Course by Id
  async editCourseById(courseId: number, dto: EditCourseDto) {
    try {
      //Update Course
      await this.prisma.course.update({
        where: {
          id: courseId,
        },
        data: {
          ...dto,
        },
      });

      return true;
    } catch (error) {
      throw error;
    }
  }

  //Delete Course By Id
  async deleteCourseById(courseId: number) {
    try {
      await this.prisma.course.update({
        where: {
          id: courseId,
        },
        data: {
          isDeleted: true,
        },
      });

      return true;
    } catch (error) {
      throw error;
    }
  }
}
