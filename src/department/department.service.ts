import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDepartmentDto, EditDepartmentDto } from './dto';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  //Get all Department
  async getAllDepartment() {
    try {
      const allDepartments = this.prisma.department.findMany({
        where: {
          isDeleted: false,
        },
      });

      return allDepartments;
    } catch (error) {
      throw error;
    }
  }

  //Get Department by Id
  async getDepartmentById(departmentId: number) {
    try {
      const department = await this.prisma.department.findUnique({
        where: {
          id: departmentId,
          isDeleted: false,
        },
      });

      return department;
    } catch (error) {
      throw error;
    }
  }

  //Create Department
  async createDepartment(dto: CreateDepartmentDto) {
    try {
      // Create new Department
      const newDepartment = await this.prisma.department.create({
        data: {
          name: dto.departmentName,
          description: dto.description,
        },
      });

      return newDepartment;
    } catch (error) {
      throw error;
    }
  }

  //Edit Department by Id
  async editDepartmentById(departmentId: number, dto: EditDepartmentDto) {
    try {
      //Update department
      await this.prisma.department.update({
        where: {
          id: departmentId,
        },
        data: {
          name: dto.departmentName,
          description: dto.description,
        },
      });

      return true;
    } catch (error) {
      throw error;
    }
  }

  //Delete Department By Id
  async deleteDepartmentById(departmentId: number) {
    try {
      await this.prisma.department.update({
        where: {
          id: departmentId,
        },
        data: {
          isDeleted: true,
        },
      });

      return true;
    } catch (error) {
      throw error;
    }
  }
}
