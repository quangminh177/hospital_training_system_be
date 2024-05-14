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
import { CreateTopicDto, EditTopicDto } from './dto';
import { TopicService } from './topic.service';
import { ApiTags } from '@nestjs/swagger';
// import { Public } from 'src/common/decorators';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('topic')
@ApiTags('topic')
export class TopicController {
  constructor(private topicService: TopicService) {}

  //Get Topics By CourseId
  // @Public()
  @Roles('ADMIN', 'UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('course/:id')
  getAllTopic(@Param('id', ParseIntPipe) courseId: number) {
    return this.topicService.getTopicByCourseId(courseId);
  }

  //Get Topic By Id
  // @Public()
  @Roles('ADMIN', 'UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  getTopicById(@Param('id', ParseIntPipe) topicId: number) {
    return this.topicService.getTopicById(topicId);
  }

  //Create Topic
  // @Public()
  @Roles('ADMIN', 'UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('createTopic')
  async createTopic(@Body() dto: CreateTopicDto) {
    return this.topicService.createTopic(dto);
  }

  //Edit Topic by Id
  // @Public()
  @Roles('ADMIN', 'UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('editTopic/:id')
  editTopicById(
    @Param('id', ParseIntPipe) topicId: number,
    @Body() dto: EditTopicDto,
  ) {
    return this.topicService.editTopicById(topicId, dto);
  }

  //Delete Topic by Id
  // @Public()
  @Roles('ADMIN', 'UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('deleteTopic/:id')
  deleteTopicById(@Param('id', ParseIntPipe) topicId: number) {
    return this.topicService.deleteTopicById(topicId);
  }
}
