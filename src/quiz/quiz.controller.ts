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

@Controller('quiz')
@ApiTags('quiz')
export class QuizController {
  constructor(private quizService: QuizService) {}

  //Get Quiz By TopicId
  @Roles('TRAINER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('topic/:id')
  getAllQuiz(@Param('id', ParseIntPipe) topicId: number) {
    return this.quizService.getQuizByTopicId(topicId);
  }

  //Get Quiz By Id
  @Roles('TRAINER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  getQuizById(@Param('id', ParseIntPipe) quizId: number) {
    return this.quizService.getQuizById(quizId);
  }

  //Shuffle Quiz By QuizId
  @Roles('TRAINER', 'ADMIN')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/shuffleQuiz/:id')
  shuffleQuizById(@Param('id', ParseIntPipe) quizId: number) {
    return this.quizService.shuffleQuizById(quizId);
  }

  //Create Quiz
  @Roles('TRAINER', 'ADMIN')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('createQuiz')
  createQuiz(@Body() dto: CreateQuizDto) {
    return this.quizService.createQuiz(dto);
  }

  //Edit Quiz by Id
  @Roles('TRAINER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('editQuiz/:id')
  editQuizById(
    @Param('id', ParseIntPipe) quizId: number,
    @Body() dto: EditQuizDto,
  ) {
    return this.quizService.editQuizById(quizId, dto);
  }

  //Delete Quiz by Id
  @Roles('TRAINER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('deleteQuiz/:id')
  deleteQuizById(@Param('id', ParseIntPipe) quizId: number) {
    return this.quizService.deleteQuizById(quizId);
  }
}
