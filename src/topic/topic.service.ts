import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTopicDto, EditTopicDto } from './dto';

@Injectable()
export class TopicService {
  constructor(private prisma: PrismaService) {}

  //Get Topic by CourseId
  async getTopicByCourseId(courseId) {
    try {
      const allTopics = this.prisma.topic.findMany({
        where: {
          isDeleted: false,
          courseId: courseId,
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
