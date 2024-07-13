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
import { StatusClassService } from './statusClass.service';
import { CreateStatusClassDto, EditStatusClassDto } from './dto';

@Controller('statusClass')
@ApiTags('statusClass')
export class StatusClassController {
  constructor(private statusClassService: StatusClassService) {}

  //Get All StatusClasss
  @Roles('UPPER', 'ADMIN')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('')
  async getAllStatusClass(
    @Query()
    querry: {
      page: number;
      size: number;
      keyword: string;
    },
  ) {
    return await this.statusClassService.getAllStatusClass(querry);
  }

  //Get StatusClass By Id
  @Roles('ADMIN', 'UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getStatusClassById(@Param('id', ParseIntPipe) statusClassId: number) {
    return await this.statusClassService.getStatusClassById(statusClassId);
  }

  //Create StatusClass
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('createStatusClass')
  async createStatusClass(@Body() dto: CreateStatusClassDto) {
    return await this.statusClassService.createStatusClass(dto);
  }

  //Edit StatusClass by Id
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('editStatusClass/:id')
  async editStatusClassById(
    @Param('id', ParseIntPipe) statusClassId: number,
    @Body() dto: EditStatusClassDto,
  ) {
    return await this.statusClassService.editStatusClassById(
      statusClassId,
      dto,
    );
  }

  //Delete StatusClass by Id
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('deleteStatusClass/:id')
  async deleteStatusClassById(
    @Param('id', ParseIntPipe) statusClassId: number,
  ) {
    return await this.statusClassService.deleteStatusClassById(statusClassId);
  }
}
