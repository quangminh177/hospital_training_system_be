import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// import { Public } from 'src/common/decorators';
import { QuizService } from './quiz.service';
import { CreateQuizDto, EditQuizDto } from './dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { GetCurrentUser } from 'src/common/decorators';
import { User } from '@prisma/client';
import { AttemptQuizDto } from './dto/attempt-quiz.dto';
import { TimeRangeGuard } from 'src/common/guards/time-range.guard';

@Controller('quiz')
@ApiTags('quiz')
export class QuizController {
  constructor(private quizService: QuizService) {}

  //Get Quiz By TopicId
  @Roles('TRAINER', 'TRAINEE')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('topic/:id')
  async getAllQuiz(@Param('id', ParseIntPipe) topicId: number) {
    return await this.quizService.getQuizByTopicId(topicId);
  }

  //Trainee get Quiz By Id
  @Roles('TRAINEE')
  @UseGuards(RolesGuard)
  @UseGuards(TimeRangeGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/trainee/:quizId')
  async traineeGetQuizById(@Param('quizId', ParseIntPipe) quizId: number) {
    return await this.quizService.getQuizById(quizId);
  }

  //Trainer get Quiz By Id
  @Roles('TRAINER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/trainer/:quizId')
  async trainerGetQuizById(@Param('quizId', ParseIntPipe) quizId: number) {
    return await this.quizService.getQuizById(quizId);
  }

  //Shuffle Quiz By QuizId
  @Roles('TRAINER', 'TRAINEE')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/shuffleQuiz/:id')
  async shuffleQuizById(@Param('id', ParseIntPipe) quizId: number) {
    return await this.quizService.shuffleQuizById(quizId);
  }

  //Create Quiz
  @Roles('TRAINER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('createQuiz')
  async createQuiz(@Body() dto: CreateQuizDto) {
    return await this.quizService.createQuiz(dto);
  }

  //Edit Quiz by Id
  @Roles('TRAINER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('editQuiz/:id')
  async editQuizById(
    @Param('id', ParseIntPipe) quizId: number,
    @Body() dto: EditQuizDto,
  ) {
    return await this.quizService.editQuizById(quizId, dto);
  }

  //Delete Quiz by Id
  @Roles('TRAINER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('deleteQuiz/:id')
  async deleteQuizById(@Param('id', ParseIntPipe) quizId: number) {
    return await this.quizService.deleteQuizById(quizId);
  }

  //Attempt Quiz
  @Roles('TRAINEE')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('attemptQuiz/:id')
  async attemptQuiz(
    @GetCurrentUser() user: User,
    @Param('id', ParseIntPipe) quizId: number,
    @Body() dto: AttemptQuizDto,
  ) {
    return await this.quizService.attemptQuiz(user, quizId, dto);
  }
}
