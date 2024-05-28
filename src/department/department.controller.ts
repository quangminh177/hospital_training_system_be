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
import { CreateDepartmentDto, EditDepartmentDto } from './dto';
import { DepartmentService } from './department.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('department')
@ApiTags('department')
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  //Get All Departments
  @Roles('UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('')
  async getAllDepartment(
    @Query()
    querry: {
      page: number;
      size: number;
      keyword: string;
    },
  ) {
    return await this.departmentService.getAllDepartment(querry);
  }

  //Get Department By Id
  @Roles('UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async getDepartmentById(@Param('id', ParseIntPipe) departmentId: number) {
    return await this.departmentService.getDepartmentById(departmentId);
  }

  //Create Department
  @Roles('UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post('createDepartment')
  async createDepartment(@Body() dto: CreateDepartmentDto) {
    return await this.departmentService.createDepartment(dto);
  }

  //Edit Department by Id
  @Roles('UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Patch('editDepartment/:id')
  async editDepartmentById(
    @Param('id', ParseIntPipe) departmentId: number,
    @Body() dto: EditDepartmentDto,
  ) {
    return await this.departmentService.editDepartmentById(departmentId, dto);
  }

  //Delete Department by Id
  @Roles('UPPER')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('deleteDepartment/:id')
  async deleteDepartmentById(@Param('id', ParseIntPipe) departmentId: number) {
    return await this.departmentService.deleteDepartmentById(departmentId);
  }
}
