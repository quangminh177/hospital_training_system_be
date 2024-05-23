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
import { CurriculumService } from './curriculum.service';
import { CreateCurriculumDto, EditCurriculumDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('curriculum')
@ApiTags('curriculum')
export class CurriculumController {
  constructor(private curriculumService: CurriculumService) {}

  //Get All Curriculums
  @Roles('UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('')
  getAllCurriculum(
    @Query()
    querry: {
      page: number;
      size: number;
      keyword: string;
    },
  ) {
    return this.curriculumService.getAllCurriculum(querry);
  }

  //Get Curriculum By Id
  @Roles('UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  getCurriculumById(@Param('id', ParseIntPipe) curriculumId: number) {
    return this.curriculumService.getCurriculumById(curriculumId);
  }

  //Create Curriculum
  @Roles('UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('createCurriculum')
  async createCurriculum(@Body() dto: CreateCurriculumDto) {
    return this.curriculumService.createCurriculum(dto);
  }

  //Edit Curriculum by Id
  @Roles('UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('editCurriculum/:id')
  editCurriculumById(
    @Param('id', ParseIntPipe) curriculumId: number,
    @Body() dto: EditCurriculumDto,
  ) {
    return this.curriculumService.editCurriculumById(curriculumId, dto);
  }

  //Delete Curriculum by Id
  @Roles('UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('deleteCurriculum/:id')
  deleteCurriculumById(@Param('id', ParseIntPipe) curriculumId: number) {
    return this.curriculumService.deleteCurriculumById(curriculumId);
  }
}
