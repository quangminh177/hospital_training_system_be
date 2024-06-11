import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Job } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateJobDto, EditJobDto } from './dto';

@Injectable()
export class JobService {
  constructor(private prisma: PrismaService) {}

  //Get all Job
  async getAllJob(querry: { page: number; size: number; keyword: string }) {
    try {
      const { page, size, keyword } = querry;
      if (page <= 0)
        throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);

      let allJobs: Job[];

      if (page && size) {
        const take = size;
        const skip = (page - 1) * size;
        allJobs = await this.prisma.job.findMany({
          take: +take,
          skip: skip,
          where: {
            isDeleted: false,
            jobName: {
              contains: keyword,
              mode: 'insensitive',
            },
          },
        });
      } else {
        allJobs = await this.prisma.job.findMany({
          where: {
            isDeleted: false,
            jobName: {
              contains: keyword,
              mode: 'insensitive',
            },
          },
        });
      }

      return allJobs;
    } catch (error) {
      throw error;
    }
  }

  //Get Job by Id
  async getJobById(jobId: number) {
    try {
      const job = await this.prisma.job.findUnique({
        where: {
          id: jobId,
          isDeleted: false,
        },
      });

      return job;
    } catch (error) {
      throw error;
    }
  }

  //Create Job
  async createJob(dto: CreateJobDto) {
    try {
      // Create new Job
      const newJob = await this.prisma.job.create({
        data: {
          jobName: dto.jobName,
          description: dto.description,
        },
      });

      return newJob;
    } catch (error) {
      throw error;
    }
  }

  //Edit Job by Id
  async editJobById(jobId: number, dto: EditJobDto) {
    try {
      //Update job
      await this.prisma.job.update({
        where: {
          id: jobId,
        },
        data: {
          jobName: dto.jobName,
          description: dto.description,
        },
      });

      return true;
    } catch (error) {
      throw error;
    }
  }

  //Delete Job By Id
  async deleteJobById(jobId: number) {
    try {
      await this.prisma.job.update({
        where: {
          id: jobId,
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
