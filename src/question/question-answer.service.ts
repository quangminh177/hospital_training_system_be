import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionDto, EditQuestionDto } from './dto';
// import { Answer } from '@prisma/client';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  //Get Questions by TopicId
  async getQuestionByTopicId(topicId) {
    try {
      const questions = await this.prisma.question.findMany({
        where: {
          isDeleted: false,
          topicId: topicId,
        },
      });

      const allQuestions = [];
      for (const question of questions) {
        //Get Answers of Question
        const answers = await this.prisma.answer.findMany({
          where: {
            questionId: question.id,
          },
        });

        const questionAnswer = {
          ...question,
          answers,
        };
        allQuestions.push(questionAnswer);
      }

      return allQuestions;
    } catch (error) {
      throw error;
    }
  }

  //Get Question by Id
  async getQuestionById(questionId: number) {
    try {
      const question = await this.prisma.question.findUnique({
        where: {
          id: questionId,
          isDeleted: false,
        },
      });

      const answers = await this.prisma.answer.findMany({
        where: {
          questionId: question.id,
        },
      });

      const questionAnswer = {
        ...question,
        answers,
      };

      return questionAnswer;
    } catch (error) {
      throw error;
    }
  }

  //Create Question
  async createQuestion(dto: CreateQuestionDto) {
    try {
      // Create new Question
      let newQuestion = await this.prisma.question.create({
        data: {
          questionName: dto.questionName,
          topicId: dto.topicId,
          levelId: dto.levelId,
          countCorrect: 0,
        },
      });

      let countCorrect = 0;
      // Create Answer of this Question
      for (let i = 0; i < dto.answers.length; i++) {
        const answer = await this.prisma.answer.create({
          data: {
            answerName: dto.answers[i].answerName,
            isCorrect: dto.answers[i].isCorrect,
            defaultOrder: i + 1,
            questionId: newQuestion.id,
          },
        });

        if (answer.isCorrect) countCorrect++;
      }

      newQuestion = await this.prisma.question.update({
        where: {
          id: newQuestion.id,
        },
        data: {
          countCorrect: countCorrect,
        },
      });

      const question = this.getQuestionById(newQuestion.id);

      return question;
    } catch (error) {
      throw error;
    }
  }

  //Edit Question by Id
  async editQuestionById(questionId: number, dto: EditQuestionDto) {
    try {
      //Update Question
      await this.prisma.question.update({
        where: {
          id: questionId,
        },
        data: {
          questionName: dto.questionName,
          topicId: dto.topicId,
          levelId: dto.levelId,
        },
      });

      if (dto.answers) {
        //Update Answers of Question
        for (let i = 0; i < dto.answers.length; i++) {
          await this.prisma.answer.update({
            where: {
              id: dto.answers[i].answerId,
            },
            data: {
              answerName: dto.answers[i].answerName,
              isCorrect: dto.answers[i].isCorrect,
            },
          });
        }
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  //Delete Question By Id
  async deleteQuestionById(questionId: number) {
    try {
      await this.prisma.question.update({
        where: {
          id: questionId,
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
