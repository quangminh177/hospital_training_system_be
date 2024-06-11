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
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AssignmentService } from './assignment.service';
import { CreateAssignmentDto, EditAssignmentDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('assignment')
@ApiTags('assignment')
export class AssignmentController {
  constructor(private assignmentService: AssignmentService) {}

  //Get Assignment By TopicId
  @Roles('TRAINER', 'TRAINEE')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('topic/:id')
  async getAssignmentByTopicId(@Param('id', ParseIntPipe) topicId: number) {
    return await this.assignmentService.getAssignmentsByTopicId(topicId);
  }

  //Get Assignment By Id
  @Roles('TRAINER', 'TRAINEE')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async getAssignmentById(
    @Param('id', ParseIntPipe) assignmentId: number,
    @Res() res: Response,
  ) {
    return await this.assignmentService.getAssignmentById(assignmentId, res);
  }

  //Create Assignment
  @Roles('TRAINER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('createAssignment')
  @UseInterceptors(FileInterceptor('assignmentFile'))
  async createAssignment(
    @Body() dto: CreateAssignmentDto,
    @UploadedFile() assignmentFile: Express.Multer.File,
  ) {
    return await this.assignmentService.createAssignment(dto, assignmentFile);
  }

  //Edit Assignment by Id
  @Roles('TRAINER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('editAssignment/:id')
  async editAssignmentById(
    @Param('id', ParseIntPipe) assignmentId: number,
    @Body() dto: EditAssignmentDto,
  ) {
    return await this.assignmentService.editAssignmentById(assignmentId, dto);
  }

  //Delete Assignment by Id
  @Roles('TRAINER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('deleteAssignment/:id')
  async deleteAssignmentById(@Param('id', ParseIntPipe) assignmentId: number) {
    return await this.assignmentService.deleteAssignmentById(assignmentId);
  }
}
