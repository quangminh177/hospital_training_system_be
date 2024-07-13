import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto, EditCourseDto } from './dto';
import { Course, User } from '@prisma/client';
import Decimal from 'decimal.js';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  //Get all Course
  async getAllCourse(querry: { page: number; size: number; keyword: string }) {
    try {
      const { page, size, keyword } = querry;
      if (page <= 0)
        throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);

      let allCourses: Course[];

      if (page && size) {
        const take = size;
        const skip = (page - 1) * size;

        allCourses = await this.prisma.course.findMany({
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
      } else {
        allCourses = await this.prisma.course.findMany({
          where: {
            isDeleted: false,
            courseName: {
              contains: keyword,
              mode: 'insensitive',
            },
          },
        });
      }

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

  //Get Grade of Course
  async getGradeOfCourse(user: User, courseId: number) {
    const topicsOfCourse = await this.prisma.topic.findMany({
      where: {
        courseId: courseId,
        isDeleted: false,
      },
      select: {
        topicWeight: true,
        id: true,
        topicName: true,
        topicNo: true,
        quizWeight: true,
        assignmentWeight: true,
      },
      orderBy: { topicNo: 'asc' },
    });

    const topicGradesAndWeight = [];

    for (const topic of topicsOfCourse) {
      const topicGrade = await this.prisma.topicGrade.findFirst({
        where: {
          topicId: topic.id,
          userId: user.id,
          isDeleted: false,
        },
        select: { grade: true, quizGrade: true, assignmentGrade: true },
      });
      const topicGradeAndWeight = { ...topic, topicGrade };
      topicGradesAndWeight.push(topicGradeAndWeight);
    }
    console.log(topicGradesAndWeight);

    let finalGrade = new Decimal(0);
    for (const gradeAndWeight of topicGradesAndWeight) {
      const partGrade = gradeAndWeight.topicWeight.times(
        gradeAndWeight.topicGrade.grade,
      );
      finalGrade = finalGrade.plus(partGrade);
    }
    let classOfTrainee = await this.prisma.classUser.findFirst({
      where: {
        userId: user.id,
        class: {
          courseId: courseId,
          isDeleted: false,
        },
        isDeleted: false,
      },
    });
    classOfTrainee = await this.prisma.classUser.update({
      where: {
        id: classOfTrainee.id,
      },
      data: {
        finalGrade,
      },
    });
    return classOfTrainee;
  }
}
