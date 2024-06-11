import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAssignmentDto, EditAssignmentDto } from './dto';
import { Response } from 'express';

@Injectable()
export class AssignmentService {
  constructor(private prisma: PrismaService) {}

  //Get Assignments by TopicId
  async getAssignmentsByTopicId(topicId: number) {
    try {
      const assignments = await this.prisma.assignment.findMany({
        where: {
          isDeleted: false,
          topicId: topicId,
        },
      });

      const allAssignments = [];
      for (const assignment of assignments) {
        //Get Submission of Assignment
        const assignmentSubmission =
          await this.prisma.assignmentSubmission.findMany({
            where: {
              assignmentId: assignment.id,
            },
          });

        const assignmentsAndSubmissions = {
          ...assignment,
          assignmentSubmission,
        };
        allAssignments.push(assignmentsAndSubmissions);
      }

      return allAssignments;
    } catch (error) {
      throw error;
    }
  }

  //Get Assignment by Id
  async getAssignmentById(assignmentId: number, res: Response) {
    try {
      const assignment = await this.prisma.assignment.findUnique({
        where: {
          id: assignmentId,
          isDeleted: false,
        },
      });

      const assignmentSubmission =
        await this.prisma.assignmentSubmission.findMany({
          where: {
            assignmentId: assignment.id,
          },
        });

      const assignmentAttachments = await this.prisma.attachment.findMany({
        where: {
          assignmentId: assignmentId,
        },
      });

      if (!assignmentAttachments) {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }

      for (const assignmentAttachment of assignmentAttachments) {
        res.setHeader(
          'Content-Disposition',
          `attachment; filename=${assignmentAttachment}`,
        );
        res.setHeader('Content-Type', assignmentAttachment.mimeType);
        res.send(assignmentAttachment.data);
      }

      const assignmentAndSubmissions = {
        ...assignment,
        assignmentAttachments,
        assignmentSubmission,
      };

      return assignmentAndSubmissions;
    } catch (error) {
      throw error;
    }
  }

  //Create Assignment
  async createAssignment(
    dto: CreateAssignmentDto,
    assignmentFile: Express.Multer.File,
  ) {
    try {
      // Create new Assignment
      const newAssignment = await this.prisma.assignment.create({
        data: {
          topicId: dto.topicId,
          name: dto.name,
          description: dto.description,
          instruction: dto.instruction,
          weight: dto.weight,
          startAt: dto.startAt,
          endAt: dto.endAt,
          dueAt: dto.dueAt,
          isExpired: false,
        },
      });

      const { originalname, mimetype, buffer } = assignmentFile;

      //Create Attachment
      const assignmentAttachment = await this.prisma.attachment.create({
        data: {
          assignmentId: newAssignment.id,
          name: originalname,
          mimeType: mimetype,
          data: buffer,
        },
      });

      return { ...newAssignment, assignmentAttachment };
    } catch (error) {
      throw error;
    }
  }

  //Edit Assignment by Id
  async editAssignmentById(assignmentId: number, dto: EditAssignmentDto) {
    try {
      //Update Assignment
      await this.prisma.assignment.update({
        where: {
          id: assignmentId,
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

  //Delete Assignment By Id
  async deleteAssignmentById(assignmentId: number) {
    try {
      await this.prisma.assignment.update({
        where: {
          id: assignmentId,
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
