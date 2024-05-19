import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import prismaRandom from 'prisma-extension-random';

import { CreateQuizDto, EditQuizDto } from './dto';
const prisma = new PrismaClient().$extends(prismaRandom());

@Injectable()
export class QuizService {
  constructor(private prisma: PrismaService) {}

  //Get Quiz by TopicId
  async getQuizByTopicId(topicId: number) {
    try {
      const quizzes = await this.prisma.quiz.findMany({
        where: {
          isDeleted: false,
          topicId: topicId,
        },
      });

      // const allQuizzes = [];
      // for (const quiz of quizzes) {
      //   //Get Answers of Question
      //   const answers = await this.prisma.answer.findMany({
      //     where: {
      //       questionId: question.id,
      //     },
      //   });

      //   const questionAnswer = {
      //     ...question,
      //     answers,
      //   };
      //   allQuestions.push(questionAnswer);
      // }

      return quizzes;
    } catch (error) {
      throw error;
    }
  }

  //Get Quiz by Id
  async getQuizById(quizId: number) {
    try {
      const quiz = await this.prisma.quiz.findUnique({
        where: {
          id: quizId,
          isDeleted: false,
        },
      });

      // const answers = await this.prisma.answer.findMany({
      //   where: {
      //     questionId: question.id,
      //   },
      // });

      // const questionAnswer = {
      //   ...question,
      //   answers,
      // };

      // return questionAnswer;
      return quiz;
    } catch (error) {
      throw error;
    }
  }

  //Create Quiz
  async createQuiz(dto: CreateQuizDto) {
    try {
      // Create new Quiz
      const newQuiz = await this.prisma.quiz.create({
        data: {
          topicId: dto.topicId,
          quizName: dto.quizName,
          timeLimit: dto.timeLimit,
          weight: dto.weight,
          startAt: dto.startAt,
          endAt: dto.endAt,
        },
      });

      // Add Question of this Quiz
      // Find random questions with a topicId and level = Easy
      const easyQuestionsOfQuiz = await prisma.question.findManyRandom(
        dto.option.numberOfEasyQuestion,
        {
          select: { id: true, questionName: true, level: true },
          where: { topicId: { equals: dto.topicId }, level: 'Easy' },
        },
      );

      // Find random questions with a topicId and level = Medium
      const mediumQuestionsOfQuiz = await prisma.question.findManyRandom(
        dto.option.numberOfMediumQuestion,
        {
          select: { id: true, questionName: true, level: true },
          where: { topicId: { equals: dto.topicId }, level: 'Medium' },
        },
      );

      for (const question of mediumQuestionsOfQuiz) {
        easyQuestionsOfQuiz.push(question);
      }

      // Find random questions with a topicId and level = Hard
      const hardQuestionsOfQuiz = await prisma.question.findManyRandom(
        dto.option.numberOfHardQuestion,
        {
          select: { id: true, questionName: true, level: true },
          where: { topicId: { equals: dto.topicId }, level: 'Hard' },
        },
      );

      for (const question of hardQuestionsOfQuiz) {
        easyQuestionsOfQuiz.push(question);
      }

      const allQuestions = easyQuestionsOfQuiz;

      for (const question of allQuestions) {
        await this.prisma.quizDetail.create({
          data: {
            quizId: newQuiz.id,
            questionId: question.id,
          },
        });
      }

      return { ...newQuiz, allQuestions };
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //Edit Quiz by Id
  async editQuizById(quizId: number, dto: EditQuizDto) {
    try {
      //Update Quiz
      await this.prisma.quiz.update({
        where: {
          id: quizId,
        },
        data: {
          ...dto,
        },
      });

      // if (dto.answers) {
      //   //Update Answers of Question
      //   for (let i = 0; i < dto.answers.length; i++) {
      //     await this.prisma.answer.update({
      //       where: {
      //         id: dto.answers[i].answerId,
      //       },
      //       data: {
      //         answerName: dto.answers[i].answerName,
      //         isCorrect: dto.answers[i].isCorrect,
      //       },
      //     });
      //   }
      // }

      return true;
    } catch (error) {
      throw error;
    }
  }

  //Delete Quiz By Id
  async deleteQuizById(quizId: number) {
    try {
      await this.prisma.quiz.update({
        where: {
          id: quizId,
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
