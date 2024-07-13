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
import { CreateLevelDto, EditLevelDto } from './dto';
import { LevelService } from './level.service';

@Controller('level')
@ApiTags('level')
export class LevelController {
  constructor(private levelService: LevelService) {}

  //Get All Levels
  @Roles('ADMIN', 'TRAINER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('')
  async getAllLevel(
    @Query()
    querry: {
      page: number;
      size: number;
      keyword: string;
    },
  ) {
    return await this.levelService.getAllLevel(querry);
  }

  //Get Level By Id
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getLevelById(@Param('id', ParseIntPipe) levelId: number) {
    return await this.levelService.getLevelById(levelId);
  }

  //Create Level
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('createLevel')
  async createLevel(@Body() dto: CreateLevelDto) {
    return await this.levelService.createLevel(dto);
  }

  //Edit Level by Id
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('editLevel/:id')
  async editLevelById(
    @Param('id', ParseIntPipe) levelId: number,
    @Body() dto: EditLevelDto,
  ) {
    return await this.levelService.editLevelById(levelId, dto);
  }

  //Delete Department by Id
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('deleteLevel/:id')
  async deleteDepartmentById(@Param('id', ParseIntPipe) levelId: number) {
    return await this.levelService.deleteLevelById(levelId);
  }
}
