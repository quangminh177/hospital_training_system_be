import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTopicDto, EditTopicDto } from './dto';

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
      const allTopics = this.prisma.topic.findMany({
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
      const allTopics = this.prisma.topic.findMany({
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
}
