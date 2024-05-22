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
      //Get all Quizzes
      const quizzes = await this.prisma.quiz.findMany({
        where: {
          isDeleted: false,
          topicId: topicId,
        },
      });

      const allQuizzes = [];

      for (const quiz of quizzes) {
        //Get Question from QuizDetail
        const questionQuizzes = await this.prisma.quizDetail.findMany({
          where: {
            quizId: quiz.id,
            isDeleted: false,
          },
        });

        const allQuestionsOfQuiz = [];

        for (const questionQuiz of questionQuizzes) {
          // Get All Questions of Quiz
          const questions = await this.prisma.question.findMany({
            where: { id: questionQuiz.questionId, isDeleted: false },
          });

          for (const question of questions) {
            const answers = await this.prisma.answer.findMany({
              where: {
                questionId: question.id,
                isDeleted: false,
              },
            });

            const questionAnswers = { ...question, answers };
            allQuestionsOfQuiz.push(questionAnswers);
          }
        }
        const quizDetail = { ...quiz, allQuestionsOfQuiz };
        allQuizzes.push(quizDetail);
      }

      return allQuizzes;
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

      //Get Question from QuizDetail
      const questionQuizzes = await this.prisma.quizDetail.findMany({
        where: {
          quizId: quiz.id,
          isDeleted: false,
        },
      });

      const allQuestionsOfQuiz = [];

      for (const questionQuiz of questionQuizzes) {
        // Get All Questions of Quiz
        const questions = await this.prisma.question.findMany({
          where: { id: questionQuiz.questionId, isDeleted: false },
        });

        for (const question of questions) {
          const answers = await this.prisma.answer.findMany({
            where: {
              questionId: question.id,
              isDeleted: false,
            },
          });

          const questionAnswers = { ...question, answers };
          allQuestionsOfQuiz.push(questionAnswers);
        }
      }

      const quizDetail = { ...quiz, allQuestionsOfQuiz };

      return quizDetail;
    } catch (error) {
      throw error;
    }
  }

  //Shuffle Quiz By Id
  async shuffleQuizById(quizId: number) {
    try {
      const quiz = await this.prisma.quiz.findUnique({
        where: {
          id: quizId,
          isDeleted: false,
        },
      });

      //Get Question from QuizDetail
      const questionQuizzes = await this.prisma.quizDetail.findMany({
        where: {
          quizId: quiz.id,
          isDeleted: false,
        },
      });

      const allQuestionsOfQuiz = [];

      for (const questionQuiz of questionQuizzes) {
        // Get All Questions of Quiz
        const questions = await this.prisma.question.findMany({
          where: { id: questionQuiz.questionId, isDeleted: false },
        });

        for (const question of questions) {
          const answers = await this.prisma.answer.findMany({
            where: {
              questionId: question.id,
              isDeleted: false,
            },
          });

          const questionAnswers = { ...question, answers };
          allQuestionsOfQuiz.push(questionAnswers);
        }
      }

      //Tạo đề thi trộn mới từ đề gốc
      let shuffledQuiz = await this.prisma.quiz.create({
        data: {
          topicId: quiz.topicId,
          quizName: quiz.quizName,
          timeLimit: quiz.timeLimit,
          weight: quiz.weight,
          startAt: quiz.startAt,
          endAt: quiz.endAt,
        },
      });

      shuffledQuiz = await this.prisma.quiz.update({
        where: {
          id: shuffledQuiz.id,
        },
        data: {
          quizName: `${quiz.quizName} Mã đề ${shuffledQuiz.id}`,
        },
      });

      //Trộn các câu hỏi
      allQuestionsOfQuiz.sort(function () {
        return Math.random() - 0.5;
      });

      for (let i = 0; i < allQuestionsOfQuiz.length; i++) {
        allQuestionsOfQuiz[i].answers.sort(function () {
          return Math.random() - 0.5;
        });

        await this.prisma.quizDetail.create({
          data: {
            questionId: allQuestionsOfQuiz[i].id,
            quizId: shuffledQuiz.id,
          },
        });
      }

      const quizDetail = { ...shuffledQuiz, allQuestionsOfQuiz };

      return quizDetail;
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
          quizName: `${dto.quizName} ${dto.timeLimit}`,
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
