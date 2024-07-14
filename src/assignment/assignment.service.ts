import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAssignmentDto, EditAssignmentDto } from './dto';
import { User } from '@prisma/client';
import { UploadFileServiceAbstract } from 'src/file/upload-file.abstract.service';

@Injectable()
export class AssignmentService {
  constructor(
    private prisma: PrismaService,
    private readonly upload_file_service: UploadFileServiceAbstract,
  ) {}

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
  async getAssignmentById(assignmentId: number /*, res: Response */) {
    try {
      const assignment = await this.prisma.assignment.findUnique({
        where: {
          id: assignmentId,
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

      // for (const assignmentAttachment of assignmentAttachments) {
      //   res.setHeader(
      //     'Content-Disposition',
      //     `attachment; filename=${assignmentAttachment}`,
      //   );
      //   res.setHeader('Content-Type', assignmentAttachment.mimeType);
      //   res.send(assignmentAttachment.data);
      // }

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

      const { originalname } = assignmentFile;

      if (!originalname) {
        throw new Error('Invalid file data');
      }

      const uploaded_result =
        await this.upload_file_service.uploadFileToPublicBucket(
          'assignment-attachment',
          { file: assignmentFile, file_name: originalname },
        );

      //Create Attachment
      const assignmentAttachment = await this.prisma.attachment.create({
        data: {
          assignmentId: newAssignment.id,
          name: originalname,
          url: uploaded_result,
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

  //Submit Assignment By Id
  async submitAssignmentById(
    assignmentId: number,
    user: User,
    submissionFile: Express.Multer.File,
  ) {
    const assignmentSubmission = await this.prisma.assignmentSubmission.create({
      data: {
        userId: user.id,
        assignmentId: assignmentId,
        grade: 0,
      },
    });

    const { originalname } = submissionFile;

    if (!originalname) {
      throw new Error('Invalid file data');
    }

    const uploaded_result =
      await this.upload_file_service.uploadFileToPublicBucket(
        'assignment-attachment',
        { file: submissionFile, file_name: originalname },
      );

    const attachment = await this.prisma.attachment.create({
      data: {
        assignmentSubmissionId: assignmentSubmission.id,
        name: originalname,
        url: uploaded_result,
      },
    });

    return { ...assignmentSubmission, attachment };
  }

  //Get Submission By Id
  async getSubmissionById(submissionId: number) {
    const submissionAssignment =
      await this.prisma.assignmentSubmission.findUnique({
        where: {
          id: submissionId,
        },
      });

    const submissionAttachment = await this.prisma.attachment.findMany({
      where: {
        assignmentSubmissionId: submissionId,
      },
    });

    const submission = { ...submissionAssignment, submissionAttachment };

    return submission;
  }

  async gradeAssignmentSubmissionById(submissionId: number, grade: number) {
    await this.prisma.assignmentSubmission.update({
      where: {
        id: submissionId,
      },
      data: {
        grade: grade['grade'],
      },
    });

    return true;
  }

  async getGradesOfAssignment(assignmentId: number) {
    //Get all Submission of Assignment
    const allSubmissionOfAssignment =
      await this.prisma.assignmentSubmission.findMany({
        where: {
          assignmentId: assignmentId,
        },
      });

    const allSubmissionAndTrainee = [];

    for (const submission of allSubmissionOfAssignment) {
      const traineeSubmit = await this.prisma.user.findUnique({
        where: {
          id: submission.userId,
        },
      });
      delete traineeSubmit.hash;
      delete traineeSubmit.hashedRt;

      const traineSubmission = { ...submission, traineeSubmit };
      allSubmissionAndTrainee.push(traineSubmission);
    }

    return allSubmissionAndTrainee;
  }
}
