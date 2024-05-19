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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators';
import { QuizService } from './quiz.service';
import { CreateQuizDto, EditQuizDto } from './dto';

@Controller('quiz')
@ApiTags('quiz')
export class QuizController {
  constructor(private quizService: QuizService) {}

  //Get Quiz By TopicId
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('topic/:id')
  getAllQuiz(@Param('id', ParseIntPipe) topicId: number) {
    return this.quizService.getQuizByTopicId(topicId);
  }

  //Get Quiz By Id
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  getQuizById(@Param('id', ParseIntPipe) quizId: number) {
    return this.quizService.getQuizById(quizId);
  }

  //Create Quiz
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('createQuiz')
  createQuiz(@Body() dto: CreateQuizDto) {
    return this.quizService.createQuiz(dto);
  }

  //Edit Quiz by Id
  @Public()
  @HttpCode(HttpStatus.OK)
  @Patch('editQuiz/:id')
  editQuizById(
    @Param('id', ParseIntPipe) quizId: number,
    @Body() dto: EditQuizDto,
  ) {
    return this.quizService.editQuizById(quizId, dto);
  }

  //Delete Quiz by Id
  @Public()
  @HttpCode(HttpStatus.OK)
  @Delete('deleteQuiz/:id')
  deleteQuizById(@Param('id', ParseIntPipe) quizId: number) {
    return this.quizService.deleteQuizById(quizId);
  }
}
