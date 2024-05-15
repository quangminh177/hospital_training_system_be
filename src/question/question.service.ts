import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionDto, EditQuestionDto } from './dto';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  //Get Questions by TopicId
  async getQuestionByTopicId(topicId) {
    const allQuestions = this.prisma.question.findMany({
      where: {
        isDeleted: false,
        topicId: topicId,
      },
    });

    return allQuestions;
  }

  //Get Question by Id
  async getQuestionById(questionId: number) {
    const question = await this.prisma.question.findUnique({
      where: {
        id: questionId,
        isDeleted: false,
      },
    });

    return question;
  }

  //Create Question
  async createQuestion(dto: CreateQuestionDto) {
    try {
      // Create new Question
      const newQuestion = await this.prisma.question.create({
        data: {
          ...dto,
        },
      });

      return newQuestion;
    } catch (error) {
      throw error;
    }
  }

  //Edit Question by Id
  async editQuestionById(questionId: number, dto: EditQuestionDto) {
    //Update Question
    await this.prisma.question.update({
      where: {
        id: questionId,
      },
      data: {
        ...dto,
      },
    });

    return true;
  }

  //Delete Question By Id
  async deleteQuestionById(questionId: number) {
    await this.prisma.question.update({
      where: {
        id: questionId,
      },
      data: {
        isDeleted: true,
      },
    });

    return true;
  }
}
