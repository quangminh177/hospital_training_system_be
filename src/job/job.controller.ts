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
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { JobService } from './job.service';
import { CreateJobDto, EditJobDto } from './dto';

@Controller('job')
@ApiTags('job')
export class JobController {
  constructor(private jobService: JobService) {}

  //Get All Jobs
  @Roles('UPPER', 'ADMIN')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('')
  async getAllJob(
    @Query()
    querry: {
      page: number;
      size: number;
      keyword: string;
    },
  ) {
    return await this.jobService.getAllJob(querry);
  }

  //Get Job By Id
  @Roles('UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getJobById(@Param('id', ParseIntPipe) jobId: number) {
    return await this.jobService.getJobById(jobId);
  }

  //Create Job
  @Roles('UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('createJob')
  async createJob(@Body() dto: CreateJobDto) {
    return await this.jobService.createJob(dto);
  }

  //Edit Job by Id
  @Roles('UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('editJob/:id')
  async editJobById(
    @Param('id', ParseIntPipe) jobId: number,
    @Body() dto: EditJobDto,
  ) {
    return await this.jobService.editJobById(jobId, dto);
  }

  //Delete Department by Id
  @Roles('UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('deleteJob/:id')
  async deleteDepartmentById(@Param('id', ParseIntPipe) jobId: number) {
    return await this.jobService.deleteJobById(jobId);
  }
}
