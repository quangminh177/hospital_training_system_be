import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCurriculumDto, EditCurriculumDto } from './dto';
import { Curriculum } from '@prisma/client';

@Injectable()
export class CurriculumService {
  constructor(private prisma: PrismaService) {}

  //Get all Curriculum
  async getAllCurriculum(querry: {
    page: number;
    size: number;
    keyword: string;
  }) {
    try {
      const { page, size, keyword } = querry;
      if (page <= 0)
        throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);

      let allCurriculums: Curriculum[];

      if (page && size) {
        const take = size;
        const skip = (page - 1) * size;
        allCurriculums = await this.prisma.curriculum.findMany({
          take: +take,
          skip: skip,
          where: {
            isDeleted: false,
            curriculumName: {
              contains: keyword,
              mode: 'insensitive',
            },
          },
        });
      } else {
        allCurriculums = await this.prisma.curriculum.findMany({
          where: {
            isDeleted: false,
            curriculumName: {
              contains: keyword,
              mode: 'insensitive',
            },
          },
        });
      }

      return allCurriculums;
    } catch (error) {
      throw error;
    }
  }

  //Get Curriculum by Id
  async getCurriculumById(curriculumId: number) {
    try {
      const curriculum = await this.prisma.curriculum.findUnique({
        where: {
          id: curriculumId,
          isDeleted: false,
        },
      });

      return curriculum;
    } catch (error) {
      throw error;
    }
  }

  //Create Curriculum
  async createCurriculum(dto: CreateCurriculumDto) {
    try {
      // Create new Curriculum
      const newCurriculum = await this.prisma.curriculum.create({
        data: {
          ...dto,
        },
      });

      return newCurriculum;
    } catch (error) {
      throw error;
    }
  }

  //Edit Curriculum by Id
  async editCurriculumById(curriculumId: number, dto: EditCurriculumDto) {
    try {
      //Update Curriculum
      await this.prisma.curriculum.update({
        where: {
          id: curriculumId,
        },
        data: {
          ...dto,
        },
      });

      return true;
    } catch (error) {
      throw error;
    }
  }

  //Delete Curriculum By Id
  async deleteCurriculumById(curriculumId: number) {
    try {
      await this.prisma.curriculum.update({
        where: {
          id: curriculumId,
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
