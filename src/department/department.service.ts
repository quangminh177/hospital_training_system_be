import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDepartmentDto, EditDepartmentDto } from './dto';

@Injectable()
export class DepartmentService {
  constructor(private prisma: PrismaService) {}

  //Get all Department
  async getAllDepartment(querry: {
    page: number;
    size: number;
    keyword: string;
  }) {
    try {
      const { page, size, keyword } = querry;
      if (page <= 0)
        throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);

      const take: number = size;
      const skip: number = (page - 1) * size;
      const allDepartments = this.prisma.department.findMany({
        take: +take,
        skip: skip,
        where: {
          isDeleted: false,
          name: {
            contains: keyword,
            mode: 'insensitive',
          },
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
