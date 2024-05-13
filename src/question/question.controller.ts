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
import { QuestionService } from './question.service';
import { CreateQuestionDto, EditQuestionDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators';

@Controller('question')
@ApiTags('question')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  //Get Question By TopicId
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('topic/:id')
  getAllQuestion(@Param('id', ParseIntPipe) topicId: number) {
    return this.questionService.getQuestionByTopicId(topicId);
  }

  //Get Question By Id
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  getQuestionById(@Param('id', ParseIntPipe) questionId: number) {
    return this.questionService.getQuestionById(questionId);
  }

  //Create Question
  @HttpCode(HttpStatus.CREATED)
  @Post('createQuestion')
  createQuestion(@Body() dto: CreateQuestionDto) {
    return this.questionService.createQuestion(dto);
  }

  //Edit Question by Id
  @HttpCode(HttpStatus.OK)
  @Patch('editQuestion/:id')
  editQuestionById(
    @Param('id', ParseIntPipe) questionId: number,
    @Body() dto: EditQuestionDto,
  ) {
    return this.questionService.editQuestionById(questionId, dto);
  }

  //Delete Question by Id
  @HttpCode(HttpStatus.OK)
  @Delete('deleteQuestion/:id')
  deleteQuestionById(@Param('id', ParseIntPipe) questionId: number) {
    return this.questionService.deleteQuestionById(questionId);
  }
}
