import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateClassDto, CreateClassWithExcelDto, EditClassDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import * as exceljs from 'exceljs';
import { Schedule } from '@prisma/client';
import { EditUserDto } from 'src/user/dto';

@Injectable()
export class ClassService {
  constructor(private prisma: PrismaService) {}

  //Get all Class
  async getAllClass() {
    try {
      const allClasses = this.prisma.class.findMany({
        where: {
          isDeleted: false,
        },
      });

      return allClasses;
    } catch (error) {
      throw error;
    }
  }

  //Get Class by Id
  async getClassById(classId: number) {
    try {
      const foundClass = await this.prisma.class.findUnique({
        where: {
          id: classId,
          isDeleted: false,
        },
      });

      return foundClass;
    } catch (error) {
      throw error;
    }
  }

  //Create Class
  async createClass(dto: CreateClassDto) {
    try {
      // Create new Class
      const newClass = await this.prisma.class.create({
        data: {
          courseId: dto.courseId,
          curriculumId: dto.curriculumId,
          className: dto.className,
          startDate: dto.startDate,
          endDate: dto.endDate,
          minQuantity: dto.minQuantity,
          maxQuantity: dto.maxQuantity,
          allowedRegister: dto.allowedRegister,
        },
      });

      // Create ClassUser(trainer)
      await this.prisma.classUser.create({
        data: {
          user: {
            connect: { id: dto.trainerId },
          },
          class: {
            connect: { id: newClass.id },
          },
          isTrainer: true,
          finalGrade: null,
        },
      });

      // Create ClassUser(trainee)
      for (const trainee of dto.trainees) {
        //   const foundTrainee = await this.prisma.user.findUnique({
        //     where: {
        //       email: trainee.email,
        //     },
        //   });

        await this.prisma.classUser.create({
          data: {
            user: {
              connect: { id: trainee.traineeId },
            },
            class: {
              connect: { id: newClass.id },
            },
            isTrainer: false,
            finalGrade: null,
          },
        });
      }

      for (const schedule of dto.schedules) {
        await this.prisma.schedule.create({
          data: {
            schedule: schedule.schedule,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            class: {
              connect: { id: newClass.id },
            },
          },
        });
      }

      return newClass;
    } catch (error) {
      throw new HttpException(
        'Lỗi khi tạo lớp học',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //Create Class With Excel
  async createClassWithExcel(
    dto: CreateClassWithExcelDto,
    file: Express.Multer.File,
  ) {
    try {
      // Create new Class
      const newClass = await this.prisma.class.create({
        data: {
          courseId: dto.courseId,
          curriculumId: dto.curriculumId,
          className: dto.className,
          startDate: dto.startDate,
          endDate: dto.endDate,
          minQuantity: dto.minQuantity,
          maxQuantity: dto.maxQuantity,
          allowedRegister: dto.allowedRegister,
        },
      });

      // Create ClassUser(trainer)
      await this.prisma.classUser.create({
        data: {
          user: {
            connect: { id: dto.trainerId },
          },
          class: {
            connect: { id: newClass.id },
          },
          isTrainer: true,
          finalGrade: null,
        },
      });

      //Create Schedule
      for (const schedule of dto.schedules) {
        await this.prisma.schedule.create({
          data: {
            schedule: schedule.schedule,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            class: {
              connect: { id: newClass.id },
            },
          },
        });
      }

      // Excel file
      //Tạo một instance mới của Workbook từ exceljs và load dữ liệu từ file Excel đã được tải lên.
      const workbook = new exceljs.Workbook();
      await workbook.xlsx.load(file.buffer);

      //Truy cập vào worksheet đầu tiên trong workbook và lấy ra tất cả các dòng.
      const worksheet = workbook.worksheets[0];
      const rowsLength = worksheet.actualRowCount;
      const rows = worksheet.getRows(1, rowsLength);

      // Lấy thuộc tính của bảng User từ hàng đầu tiên của file Excel
      let properties = rows[0].values;
      properties = JSON.parse(JSON.stringify(properties)).filter(
        (el: string) => el,
      );
      // Đọc thông tin user từ các hàng còn lại trong file Excel và tạo các đối tượng ClassUserDto
      for (let i = 1; i < rows.length; i++) {
        let userData = rows[i].values;
        userData = JSON.parse(JSON.stringify(userData)).filter(
          (el: string) => el,
        );
        const userDto: EditUserDto = {};
        for (let j = 0; j < +properties.length; j++) {
          userDto[properties[j]] = userData[j];
        }
        const trainee = await this.prisma.user.findUnique({
          where: {
            firstName: userDto.firstName,
            lastName: userDto.lastName,
            email: userDto.email['text'],
            phone: userDto.phone,
            dob: userDto.dob,
            departmentId: userDto.departmentId,
            job: userDto.job,
            gender: userDto.gender,
          },
        });

        if (trainee) {
          await this.prisma.classUser.create({
            data: {
              classId: newClass.id,
              userId: trainee.id,
              isTrainer: false,
              finalGrade: null,
            },
          });
        }
      }

      await this.prisma.class.update({
        where: {
          id: newClass.id,
        },
        data: {
          quantity: rowsLength - 1,
        },
      });

      return newClass;
    } catch (error) {
      throw new HttpException(
        'Lỗi khi tạo lớp học',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //Edit Class By Id
  async editClassById(classId: number, dto: EditClassDto) {
    try {
      //Update class
      await this.prisma.class.update({
        where: {
          id: classId,
        },
        data: {
          courseId: dto.courseId,
          curriculumId: dto.curriculumId,
          className: dto.className,
          startDate: dto.startDate,
          endDate: dto.endDate,
          minQuantity: dto.minQuantity,
          maxQuantity: dto.maxQuantity,
          allowedRegister: dto.allowedRegister,
        },
      });

      if (dto.schedules) {
        //Get Schedule of Class
        const editedClassSchedule: Array<Schedule> =
          await this.prisma.schedule.findMany({
            where: {
              classId: classId,
            },
          });

        //Delete Old Schedule (If)
        for (const schedule of editedClassSchedule) {
          await this.prisma.schedule.update({
            where: {
              id: schedule.id,
            },
            data: {
              isDeleted: true,
            },
          });
        }
        //Create New Schedule (If)
        for (const schedule of dto.schedules) {
          await this.prisma.schedule.create({
            data: {
              ...schedule,
            },
          });
        }
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  //Delete Class By Id
  async deleteClassById(classId: number) {
    try {
      await this.prisma.class.update({
        where: {
          id: classId,
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
