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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ExternalResourceService } from './externalResource.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateExternalResourceDto, EditExternalResourceDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('externalResource')
@ApiTags('externalResource')
export class ExternalResourceController {
  constructor(private externalResourceService: ExternalResourceService) {}

  //Get ExternalResource By topicId
  @Roles('TRAINER', 'TRAINEE')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('topic/:id')
  async getExternalResourceByTopicId(
    @Param('id', ParseIntPipe) topicId: number,
  ) {
    return await this.externalResourceService.getExternalResourceByTopicId(
      topicId,
    );
  }

  //Get ExternalResource By Id
  // @Public()
  @Roles('TRAINER', 'TRAINEE')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getExternalResourceById(
    @Param('id', ParseIntPipe) externalResourceId: number,
  ) {
    return await this.externalResourceService.getExternalResourceById(
      externalResourceId,
    );
  }

  //Create ExternalResource
  @Public()
  //@Roles('TRAINER')
  //@UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('createExternalResource')
  @UseInterceptors(FileInterceptor('file'))
  async createExternalResource(
    @Body() dto: CreateExternalResourceDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.externalResourceService.createExternalResource(dto, file);
  }

  //Edit ExternalResource by Id
  // @Public()
  @Roles('TRAINER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('editExternalResource/:id')
  async editExternalResourceById(
    @Param('id', ParseIntPipe) externalResourceId: number,
    @Body() dto: EditExternalResourceDto,
  ) {
    return await this.externalResourceService.editExternalResourceById(
      externalResourceId,
      dto,
    );
  }

  //Delete ExternalResource by Id
  // @Public()
  @Roles('TRAINER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('deleteExternalResource/:id')
  async deleteExternalResourceById(
    @Param('id', ParseIntPipe) externalResourceId: number,
  ) {
    return await this.externalResourceService.deleteExternalResourceById(
      externalResourceId,
    );
  }
}
