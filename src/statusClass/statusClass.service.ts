import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { StatusClass } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStatusClassDto, EditStatusClassDto } from './dto';

@Injectable()
export class StatusClassService {
  constructor(private prisma: PrismaService) {}

  //Get all StatusClass
  async getAllStatusClass(querry: {
    page: number;
    size: number;
    keyword: string;
  }) {
    try {
      const { page, size, keyword } = querry;
      if (page <= 0)
        throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);

      let allStatusClasss: StatusClass[];

      if (page && size) {
        const take = size;
        const skip = (page - 1) * size;
        allStatusClasss = await this.prisma.statusClass.findMany({
          take: +take,
          skip: skip,
          where: {
            isDeleted: false,
            statusClass: {
              contains: keyword,
              mode: 'insensitive',
            },
          },
        });
      } else {
        allStatusClasss = await this.prisma.statusClass.findMany({
          where: {
            isDeleted: false,
            statusClass: {
              contains: keyword,
              mode: 'insensitive',
            },
          },
        });
      }

      return allStatusClasss;
    } catch (error) {
      throw error;
    }
  }

  //Get StatusClass by Id
  async getStatusClassById(statusClassId: number) {
    try {
      const statusClass = await this.prisma.statusClass.findUnique({
        where: {
          id: statusClassId,
          isDeleted: false,
        },
      });

      return statusClass;
    } catch (error) {
      throw error;
    }
  }

  //Create StatusClass
  async createStatusClass(dto: CreateStatusClassDto) {
    try {
      // Create new StatusClass
      const newStatusClass = await this.prisma.statusClass.create({
        data: {
          statusClass: dto.statusClass,
          description: dto.description,
        },
      });

      return newStatusClass;
    } catch (error) {
      throw error;
    }
  }

  //Edit StatusClass by Id
  async editStatusClassById(statusClassId: number, dto: EditStatusClassDto) {
    try {
      //Update statusClass
      await this.prisma.statusClass.update({
        where: {
          id: statusClassId,
        },
        data: {
          statusClass: dto.statusClass,
          description: dto.description,
        },
      });

      return true;
    } catch (error) {
      throw error;
    }
  }

  //Delete StatusClass By Id
  async deleteStatusClassById(statusClassId: number) {
    try {
      await this.prisma.statusClass.update({
        where: {
          id: statusClassId,
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
