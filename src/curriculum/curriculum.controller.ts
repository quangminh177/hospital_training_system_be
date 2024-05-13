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
import { CurriculumService } from './curriculum.service';
import { CreateCurriculumDto, EditCurriculumDto } from './dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('curriculum')
@ApiTags('curriculum')
export class CurriculumController {
  constructor(private curriculumService: CurriculumService) {}

  //Get All Curriculums
  @HttpCode(HttpStatus.OK)
  @Get('')
  getAllCurriculum() {
    return this.curriculumService.getAllCurriculum();
  }

  //Get Curriculum By Id
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  getCurriculumById(@Param('id', ParseIntPipe) curriculumId: number) {
    return this.curriculumService.getCurriculumById(curriculumId);
  }

  //Create Curriculum
  @HttpCode(HttpStatus.CREATED)
  @Post('createCurriculum')
  async createCurriculum(@Body() dto: CreateCurriculumDto) {
    return this.curriculumService.createCurriculum(dto);
  }

  //Edit Curriculum by Id
  @HttpCode(HttpStatus.OK)
  @Patch('editCurriculum/:id')
  editCurriculumById(
    @Param('id', ParseIntPipe) curriculumId: number,
    @Body() dto: EditCurriculumDto,
  ) {
    return this.curriculumService.editCurriculumById(curriculumId, dto);
  }

  //Delete Curriculum by Id
  @HttpCode(HttpStatus.OK)
  @Delete('deleteCurriculum/:id')
  deleteCurriculumById(@Param('id', ParseIntPipe) curriculumId: number) {
    return this.curriculumService.deleteCurriculumById(curriculumId);
  }
}
