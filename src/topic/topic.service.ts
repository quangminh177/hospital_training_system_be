import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTopicDto, EditTopicDto } from './dto';
import { User } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class TopicService {
  constructor(private prisma: PrismaService) {}

  //Get all Topics
  async getAllTopics(querry: { page: number; size: number; keyword: string }) {
    try {
      const { page, size, keyword } = querry;
      if (page <= 0)
        throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);

      const take: number = size;
      const skip: number = (page - 1) * size;
      const allTopics = await this.prisma.topic.findMany({
        take: +take,
        skip: skip,
        where: {
          isDeleted: false,
          topicName: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
      });

      return allTopics;
    } catch (error) {
      throw error;
    }
  }

  //Get Topic by CourseId
  async getTopicByCourseId(
    courseId,
    querry: { page: number; size: number; keyword: string },
  ) {
    try {
      const { page, size, keyword } = querry;
      if (page <= 0)
        throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);

      const take: number = size;
      const skip: number = (page - 1) * size;
      const allTopics = await this.prisma.topic.findMany({
        take: +take,
        skip: skip,
        where: {
          isDeleted: false,
          courseId: courseId,
          topicName: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
      });

      return allTopics;
    } catch (error) {
      throw error;
    }
  }

  //Get Topic by Id
  async getTopicById(topicId: number) {
    try {
      const topic = await this.prisma.topic.findUnique({
        where: {
          id: topicId,
          isDeleted: false,
        },
      });

      return topic;
    } catch (error) {
      throw error;
    }
  }

  //Create Topic
  async createTopic(dto: CreateTopicDto) {
    try {
      // Create new Topic
      const newTopic = await this.prisma.topic.create({
        data: {
          ...dto,
        },
      });

      return newTopic;
    } catch (error) {
      throw error;
    }
  }

  //Edit Topic by Id
  async editTopicById(topicId: number, dto: EditTopicDto) {
    try {
      //Update Topic
      await this.prisma.topic.update({
        where: {
          id: topicId,
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

  //Delete Topic By Id
  async deleteTopicById(topicId: number) {
    try {
      await this.prisma.topic.update({
        where: {
          id: topicId,
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

  //Get Topic Grade of User
  async getGradeOfTopic(user: User, topicId: number) {
    //Check if Topic Grade exist
    const topicGradeExist = await this.prisma.topicGrade.findMany({
      where: {
        userId: user.id,
        topicId: topicId,
      },
    });

    if (topicGradeExist.length === 0) {
      await this.prisma.topicGrade.create({
        data: {
          userId: user.id,
          topicId: topicId,
        },
      });
    }

    //Get all QuizAttempt of User
    const allQuizAttempts = await this.prisma.quizAttempt.findMany({
      where: {
        userId: user.id,
      },
    });

    const allTopicQuizAttempts = [];

    for (const quizAttempt of allQuizAttempts) {
      const quiz = await this.prisma.quiz.findUnique({
        where: {
          id: quizAttempt.quizId,
        },
      });

      const quizWeight = quiz.weight;
      const quizAttemptAndWeight = { ...quizAttempt, quizWeight };

      if (quiz.topicId === topicId)
        allTopicQuizAttempts.push(quizAttemptAndWeight);
    }

    let totalTopicQuizGrade = new Decimal(0);
    for (const topicQuizAttempt of allTopicQuizAttempts) {
      totalTopicQuizGrade = totalTopicQuizGrade.plus(
        topicQuizAttempt.grade.times(topicQuizAttempt.quizWeight),
      );
    }

    const quizGrade = totalTopicQuizGrade.dividedBy(
      allTopicQuizAttempts.length,
    );

    let topicGrade = await this.prisma.topicGrade.findFirst({
      where: {
        userId: user.id,
        topicId: topicId,
      },
    });

    topicGrade = await this.prisma.topicGrade.update({
      where: topicGrade,
      data: {
        ...topicGrade,
        quizGrade,
        grade: quizGrade,
      },
    });

    return topicGrade;
  }
}
