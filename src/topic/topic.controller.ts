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
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateTopicDto, EditTopicDto } from './dto';
import { TopicService } from './topic.service';
import { ApiTags } from '@nestjs/swagger';
// import { Public } from 'src/common/decorators';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { GetCurrentUser } from 'src/common/decorators';
import { User } from '@prisma/client';

@Controller('topic')
@ApiTags('topic')
export class TopicController {
  constructor(private topicService: TopicService) {}

  //Get all Topics
  @Roles('TRAINER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('')
  async getAllTopic(
    @Query()
    querry: {
      page: number;
      size: number;
      keyword: string;
    },
  ) {
    return await this.topicService.getAllTopics(querry);
  }

  //Get Topics By CourseId
  @Roles('TRAINER', 'TRAINEE')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('course/:id')
  async getTopicByCourseId(
    @Param('id', ParseIntPipe) courseId: number,
    @Query()
    querry: {
      page: number;
      size: number;
      keyword: string;
    },
  ) {
    return await this.topicService.getTopicByCourseId(courseId, querry);
  }

  //Get Topic By Id
  // @Public()
  @Roles('TRAINER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getTopicById(@Param('id', ParseIntPipe) topicId: number) {
    return await this.topicService.getTopicById(topicId);
  }

  //Create Topic
  // @Public()
  @Roles('TRAINER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('createTopic')
  async createTopic(@Body() dto: CreateTopicDto) {
    return await this.topicService.createTopic(dto);
  }

  //Edit Topic by Id
  // @Public()
  @Roles('TRAINER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('editTopic/:id')
  async editTopicById(
    @Param('id', ParseIntPipe) topicId: number,
    @Body() dto: EditTopicDto,
  ) {
    return await this.topicService.editTopicById(topicId, dto);
  }

  //Delete Topic by Id
  // @Public()
  @Roles('TRAINER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('deleteTopic/:id')
  async deleteTopicById(@Param('id', ParseIntPipe) topicId: number) {
    return await this.topicService.deleteTopicById(topicId);
  }

  //Get Topic Grade of User
  @Roles('TRAINEE', 'TRAINER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('grade/:topicId')
  async getGradeOfTopic(
    @GetCurrentUser() user: User,
    @Param('topicId', ParseIntPipe) topicId: number,
  ) {
    return await this.topicService.getGradeOfTopic(user, topicId);
  }
}
