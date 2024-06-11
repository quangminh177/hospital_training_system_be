import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Level } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLevelDto, EditLevelDto } from './dto';

@Injectable()
export class LevelService {
  constructor(private prisma: PrismaService) {}

  //Get all Level
  async getAllLevel(querry: { page: number; size: number; keyword: string }) {
    try {
      const { page, size, keyword } = querry;
      if (page <= 0)
        throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);

      let allLevels: Level[];

      if (page && size) {
        const take = size;
        const skip = (page - 1) * size;
        allLevels = await this.prisma.level.findMany({
          take: +take,
          skip: skip,
          where: {
            isDeleted: false,
            level: {
              contains: keyword,
              mode: 'insensitive',
            },
          },
        });
      } else {
        allLevels = await this.prisma.level.findMany({
          where: {
            isDeleted: false,
            level: {
              contains: keyword,
              mode: 'insensitive',
            },
          },
        });
      }

      return allLevels;
    } catch (error) {
      throw error;
    }
  }

  //Get Level by Id
  async getLevelById(levelId: number) {
    try {
      const level = await this.prisma.level.findUnique({
        where: {
          id: levelId,
          isDeleted: false,
        },
      });

      return level;
    } catch (error) {
      throw error;
    }
  }

  //Create Level
  async createLevel(dto: CreateLevelDto) {
    try {
      // Create new Level
      const newLevel = await this.prisma.level.create({
        data: {
          level: dto.level,
          description: dto.description,
        },
      });

      return newLevel;
    } catch (error) {
      throw error;
    }
  }

  //Edit Level by Id
  async editLevelById(levelId: number, dto: EditLevelDto) {
    try {
      //Update level
      await this.prisma.level.update({
        where: {
          id: levelId,
        },
        data: {
          level: dto.level,
          description: dto.description,
        },
      });

      return true;
    } catch (error) {
      throw error;
    }
  }

  //Delete Level By Id
  async deleteLevelById(levelId: number) {
    try {
      await this.prisma.level.update({
        where: {
          id: levelId,
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
