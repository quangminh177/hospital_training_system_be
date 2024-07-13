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
  @Roles('UPPER', 'ADMIN')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('')
  async getAllCurriculum(
    @Query()
    querry: {
      page: number;
      size: number;
      keyword: string;
    },
  ) {
    return await this.curriculumService.getAllCurriculum(querry);
  }

  //Get Curriculum By Id
  @Roles('UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getCurriculumById(@Param('id', ParseIntPipe) curriculumId: number) {
    return await this.curriculumService.getCurriculumById(curriculumId);
  }

  //Create Curriculum
  @Roles('UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('createCurriculum')
  async createCurriculum(@Body() dto: CreateCurriculumDto) {
    return await this.curriculumService.createCurriculum(dto);
  }

  //Edit Curriculum by Id
  @Roles('UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('editCurriculum/:id')
  async editCurriculumById(
    @Param('id', ParseIntPipe) curriculumId: number,
    @Body() dto: EditCurriculumDto,
  ) {
    return await this.curriculumService.editCurriculumById(curriculumId, dto);
  }

  //Delete Curriculum by Id
  @Roles('UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('deleteCurriculum/:id')
  async deleteCurriculumById(@Param('id', ParseIntPipe) curriculumId: number) {
    return await this.curriculumService.deleteCurriculumById(curriculumId);
  }
}
