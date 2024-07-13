import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Answer, Prisma, PrismaClient, User } from '@prisma/client';
import prismaRandom from 'prisma-extension-random';
import { CreateQuizDto, EditQuizDto } from './dto';
import { AttemptQuizDto } from './dto/attempt-quiz.dto';
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
        const quizDetail = await this.getQuizById(quiz.id);
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
      const quiz = await this.prisma.quiz
        .findUnique({
          where: {
            id: quizId,
          },
        })
        .catch((error) => {
          console.log(error);
          throw error;
        });

      //Get Question from QuizDetail
      const questionsQuiz = await this.prisma.quizDetail.findMany({
        where: {
          quizId: quizId,
          isDeleted: false,
        },
        orderBy: {
          id: 'asc',
        },
      });

      const allQuestionsOfQuiz = [];

      for (const questionQuiz of questionsQuiz) {
        const orderOfAnswer = this.stringToNumberArray(
          questionQuiz.orderOfAnswer,
        );
        // Get All Questions of Quiz
        const question = await this.prisma.question.findUnique({
          where: { id: questionQuiz.questionId },
        });

        const answers: Answer[] = [];

        const answersDefault = await this.prisma.answer.findMany({
          where: {
            questionId: question.id,
            isDeleted: false,
          },
        });

        for (let i = 0; i < orderOfAnswer.length; i++) {
          answers[i] = answersDefault[orderOfAnswer[i] - 1];
        }

        const questionAnswers = { ...question, answers };
        allQuestionsOfQuiz.push(questionAnswers);
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
      const quiz = await this.getQuizById(quizId);

      //Tạo đề thi trộn mới từ đề gốc
      let shuffledQuiz = await this.prisma.quiz.create({
        data: {
          topicId: quiz.topicId,
          quizName: quiz.quizName,
          timeLimit: quiz.timeLimit,
          weight: quiz.weight,
          startAt: quiz.startAt,
          endAt: quiz.endAt,
          isOriginal: false,
          originalQuizId: quiz.id,
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

      const allQuestionsOfQuiz = quiz.allQuestionsOfQuiz;

      //Trộn các câu hỏi
      allQuestionsOfQuiz.sort(function () {
        return Math.random() - 0.5;
      });

      for (let i = 0; i < allQuestionsOfQuiz.length; i++) {
        //Create Quiz Detail
        let quizDetail = await this.prisma.quizDetail.create({
          data: {
            questionId: allQuestionsOfQuiz[i].id,
            quizId: shuffledQuiz.id,
            orderOfAnswer: '',
          },
        });

        //Shuffle answer
        allQuestionsOfQuiz[i].answers.sort(function () {
          return Math.random() - 0.5;
        });

        const answers = allQuestionsOfQuiz[i].answers;

        for (const answer of answers) {
          const newOrderOfAnswer = `${quizDetail.orderOfAnswer}${answer.defaultOrder}`;
          //Save orderOfAnswer
          quizDetail = await this.prisma.quizDetail.update({
            where: {
              id: quizDetail.id,
            },
            data: {
              orderOfAnswer: newOrderOfAnswer,
            },
          });
        }
      }

      const quizDetail = {
        ...shuffledQuiz,
        allQuestionsOfQuiz,
      };

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
          quizName: `${dto.quizName}`,
          timeLimit: dto.timeLimit,
          weight: dto.weight,
          startAt: dto.startAt,
          endAt: dto.endAt,
          seeAnswer: dto.seeAnswer,
          isOriginal: true,
          originalQuizId: null,
        },
      });

      // Add Question of this Quiz
      const allQuestions = [];

      for (const option of dto.option) {
        const arrayLevelQuestionsOfQuiz = await prisma.question.findManyRandom(
          option.numberOfLevelQuestion,
          {
            select: { id: true, questionName: true, levelId: true },
            where: {
              topicId: { equals: dto.topicId },
              levelId: option.levelId,
              isDeleted: false,
            },
          },
        );

        for (const levelQuestionsOfQuiz of arrayLevelQuestionsOfQuiz) {
          allQuestions.push(levelQuestionsOfQuiz);
        }
      }

      const allQuestionAnswer = [];

      for (const question of allQuestions) {
        //Create quizDetail for each question
        let quizDetail = await this.prisma.quizDetail.create({
          data: {
            quizId: newQuiz.id,
            questionId: question.id,
            orderOfAnswer: '',
          },
        });

        const answers = await this.prisma.answer.findMany({
          where: {
            questionId: question.id,
            isDeleted: false,
          },
        });

        const questionAnswer = { ...question, answers };
        allQuestionAnswer.push(questionAnswer);

        for (const answer of answers) {
          const newOrderOfAnswer = `${quizDetail.orderOfAnswer}${answer.defaultOrder}`;
          quizDetail = await this.prisma.quizDetail.update({
            where: {
              id: quizDetail.id,
            },
            data: {
              orderOfAnswer: newOrderOfAnswer,
            },
          });
        }
      }

      // //Shuffle original Quiz to Many Quizzes
      // for (let i = 0; i < dto.numberOfQuizzes; i++) {
      //   await this.shuffleQuizById(newQuiz.id);
      // }

      return { ...newQuiz, allQuestionAnswer };
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

  //Attempt Quiz
  async attemptQuiz(user: User, quizId: number, dto: AttemptQuizDto) {
    //Find quiz to attempt
    const quiz = await this.getQuizById(quizId);

    //Find if this user has attempted this quiz
    const hasAttemptedQuiz = await this.prisma.quizAttempt.findMany({
      where: {
        userId: user.id,
        quizId: quiz.id,
        isDeleted: false,
      },
    });

    if (hasAttemptedQuiz.length === 0) {
      //Create quiz attempt
      const quizAttempt = await this.prisma.quizAttempt.create({
        data: {
          userId: user.id,
          quizId: quizId,
          startAt: quiz.startAt,
          endAt: quiz.endAt,
          grade: 0,
        },
      });

      //Get QuizDetails
      const quizDetails = await this.prisma.quizDetail.findMany({
        where: {
          quizId: quizId,
          isDeleted: false,
        },
      });

      const allQuizAttemptDetail = [];

      const questions = quiz.allQuestionsOfQuiz;

      for (const attemptQuestion of dto.attemptQuestion) {
        for (let i = 0; i < questions.length; i++) {
          if (attemptQuestion.questionId === questions[i].id) {
            //Create QuizAttemptDetail
            const quizAttemptDetail =
              await this.prisma.quizAttemptDetail.create({
                data: {
                  quizAttemptId: quizAttempt.id,
                  questionId: questions[i].id,
                  questionNo: i + 1,
                  chosenAnswer: attemptQuestion.chosenAnswerId,
                  orderOfAnswer: quizDetails[i].orderOfAnswer,
                },
              });

            allQuizAttemptDetail.push(quizAttemptDetail);
          }
        }
      }

      const gradeMax = 10;
      const gradePerQuestion = new Prisma.Decimal(gradeMax / questions.length);

      for (const quizAttemptDetail of allQuizAttemptDetail) {
        // let count = 0;
        const correctAnswers = await this.prisma.answer.findMany({
          where: {
            questionId: quizAttemptDetail.questionId,
            isCorrect: true,
          },
          select: { id: true },
        });
        const arrayIdOfCorrectAnswers = [];
        for (const correctAnswer of correctAnswers) {
          const id = correctAnswer.id;
          arrayIdOfCorrectAnswers.push(id);
        }

        const isCorrect = this.areArraysEqual(
          arrayIdOfCorrectAnswers,
          quizAttemptDetail.chosenAnswer,
        );

        if (isCorrect) {
          quizAttempt.grade = quizAttempt.grade.plus(gradePerQuestion);
        }
      }

      await this.prisma.quizAttempt.update({
        where: {
          id: quizAttempt.id,
        },
        data: {
          grade: quizAttempt.grade,
        },
      });

      return { ...quizAttempt, allQuizAttemptDetail };
    }
    return false;
  }

  //Review QuizAttempt
  async reviewQuizAttempt(quizAttemptId: number) {
    //Get quizAttempt (Lấy ra bài làm)
    const quizAttempt = await this.prisma.quizAttempt.findUnique({
      where: {
        id: quizAttemptId,
      },
    });

    //Get quiz (Lấy ra bài làm của học viên)
    const quiz = await this.getQuizById(quizAttempt.quizId);

    const allQuestionsOfQuiz = quiz.allQuestionsOfQuiz; //Lấy ra tất cả câu hỏi của đề thi
    const allQuestionAttemptsOfQuiz = []; //Tất cả câu hỏi bài làm của học viên

    for (const questionOfQuiz of allQuestionsOfQuiz) {
      const questionAttemptDetailOfQuiz =
        await this.prisma.quizAttemptDetail.findFirst({
          where: {
            questionId: questionOfQuiz.id,
            quizAttemptId: quizAttemptId,
          },
        });

      const questionAttemptOfQuiz = {
        ...questionOfQuiz,
        chosenAnswer: questionAttemptDetailOfQuiz.chosenAnswer,
      };
      allQuestionAttemptsOfQuiz.push(questionAttemptOfQuiz);
    }
    return allQuestionAttemptsOfQuiz;
  }

  async getGradesOfQuiz(quizId: number) {
    //Get quizAttempt of assignment
    const quizAttempts = await this.prisma.quizAttempt.findMany({
      where: {
        quizId: quizId,
      },
    });

    const quizAttemptDetails = [];

    for (const attempt of quizAttempts) {
      const trainee = await this.prisma.user.findUnique({
        where: {
          id: attempt.userId,
        },
      });
      delete trainee.hash;
      delete trainee.hashedRt;

      const quizAttemptAndTrainee = { ...attempt, trainee };
      quizAttemptDetails.push(quizAttemptAndTrainee);
    }

    return quizAttemptDetails;
  }

  stringToNumberArray = (str: string) =>
    str.split('').map((char) => Number(char));

  areArraysEqual = (arr1: number[], arr2: number[]) => {
    // Kiểm tra độ dài của hai mảng
    if (arr1.length !== arr2.length) {
      return false;
    }

    // So sánh từng phần tử
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        return false;
      }
    }

    return true;
  };
}
