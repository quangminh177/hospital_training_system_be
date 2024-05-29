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
import { QuestionService } from './question-answer.service';
import { CreateQuestionDto, EditQuestionDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('question')
@ApiTags('question')
export class QuestionController {
  constructor(private questionService: QuestionService) {}

  //Get Question By TopicId
  @Roles('TRAINER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('topic/:id')
  async getQuestionByTopicId(@Param('id', ParseIntPipe) topicId: number) {
    return await this.questionService.getQuestionByTopicId(topicId);
  }

  //Get Question By Id
  @Roles('TRAINER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getQuestionById(@Param('id', ParseIntPipe) questionId: number) {
    return await this.questionService.getQuestionById(questionId);
  }

  //Create Question
  @Roles('TRAINER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('createQuestion')
  async createQuestion(@Body() dto: CreateQuestionDto) {
    return await this.questionService.createQuestion(dto);
  }

  //Edit Question by Id
  @Roles('TRAINER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('editQuestion/:id')
  async editQuestionById(
    @Param('id', ParseIntPipe) questionId: number,
    @Body() dto: EditQuestionDto,
  ) {
    return await this.questionService.editQuestionById(questionId, dto);
  }

  //Delete Question by Id
  @Roles('TRAINER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('deleteQuestion/:id')
  async deleteQuestionById(@Param('id', ParseIntPipe) questionId: number) {
    return await this.questionService.deleteQuestionById(questionId);
  }
}
