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
import { CreateDepartmentDto, EditDepartmentDto } from './dto';
import { DepartmentService } from './department.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators';

@Controller('department')
@ApiTags('department')
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  //Get All Departments
  @Public()
  @HttpCode(HttpStatus.OK)
  @Get('')
  getAllDepartment() {
    return this.departmentService.getAllDepartment();
  }

  //Get Department By Id
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  getDepartmentById(@Param('id', ParseIntPipe) departmentId: number) {
    return this.departmentService.getDepartmentById(departmentId);
  }

  //Create Department
  @HttpCode(HttpStatus.CREATED)
  @Post('createDepartment')
  async createDepartment(@Body() dto: CreateDepartmentDto) {
    return this.departmentService.createDepartment(dto);
  }

  //Edit Department by Id
  @HttpCode(HttpStatus.OK)
  @Patch('editDepartment/:id')
  editDepartmentById(
    @Param('id', ParseIntPipe) departmentId: number,
    @Body() dto: EditDepartmentDto,
  ) {
    return this.departmentService.editDepartmentById(departmentId, dto);
  }

  //Delete Department by Id
  @HttpCode(HttpStatus.OK)
  @Delete('deleteDepartment/:id')
  deleteDepartmentById(@Param('id', ParseIntPipe) departmentId: number) {
    return this.departmentService.deleteDepartmentById(departmentId);
  }
}
