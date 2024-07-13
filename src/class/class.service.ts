import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import {
  ClassQueryDto,
  CreateClassDto,
  CreateClassWithExcelDto,
  EditClassDto,
} from './dto';
import { PrismaService } from '../prisma/prisma.service';
import * as exceljs from 'exceljs';
import { Class, Schedule, User } from '@prisma/client';
import { EditUserDto } from 'src/user/dto';
import * as cron from 'node-cron';

@Injectable()
export class ClassService implements OnModuleInit {
  private readonly logger = new Logger(ClassService.name);
  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    this.scheduleUpdateStatusOfClass();
  }

  //Get all Class
  async getAllClass(query: ClassQueryDto) {
    try {
      const { page, size, status, keyword } = query;
      if (page <= 0)
        throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);

      const statusClass = await this.prisma.statusClass.findFirst({
        where: {
          statusClass: status,
        },
      });

      const statusClassId = statusClass.id;

      let allClasses: Class[];

      if (page && size) {
        const take = size;
        const skip = (page - 1) * size;

        allClasses = await this.prisma.class.findMany({
          where: {
            isDeleted: false,
            className: {
              contains: keyword,
              mode: 'insensitive',
            },
            statusClassId: statusClassId,
          },
          take: +take,
          skip: skip,
        });
      } else {
        allClasses = await this.prisma.class.findMany({
          where: {
            isDeleted: false,
            className: {
              contains: keyword,
              mode: 'insensitive',
            },
          },
        });
      }

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

  //Get my Class
  async getMyClass(user: User) {
    try {
      const classUsers = await this.prisma.classUser.findMany({
        where: {
          userId: user.id,
          isDeleted: false,
        },
      });

      const classes: Class[] = [];

      for (const classUser of classUsers) {
        const foundClass = await this.prisma.class.findUnique({
          where: {
            id: classUser.classId,
          },
        });
        classes.push(foundClass);
      }

      return classes;
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
          statusClassId: 1,
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
      console.log(error);
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
            jobId: userDto.jobId,
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

  //Approve Class By Id
  async approveClassById(classId: number) {
    try {
      //Get class
      let approvedClass = await this.getClassById(classId);

      const awaitingApprovingStatus = await this.prisma.statusClass.findFirst({
        where: {
          statusClass: 'AWAITING_APPROVAL',
        },
      });

      if (approvedClass.statusClassId !== awaitingApprovingStatus.id)
        throw new HttpException(
          'Class is not awaiting approving',
          HttpStatus.BAD_REQUEST,
        );

      const openingRegisterStatus = await this.prisma.statusClass.findFirst({
        where: {
          statusClass: 'OPENING_REGISTER',
        },
      });

      const comingSoonStatus = await this.prisma.statusClass.findFirst({
        where: {
          statusClass: 'COMING_SOON',
        },
      });

      if (approvedClass.allowedRegister === true) {
        approvedClass = await this.prisma.class.update({
          where: {
            id: classId,
          },
          data: {
            statusClassId: openingRegisterStatus.id,
          },
        });
      } else {
        approvedClass = await this.prisma.class.update({
          where: {
            id: classId,
          },
          data: {
            statusClassId: comingSoonStatus.id,
          },
        });
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  //Reject Class By Id
  async rejectClassById(classId: number) {
    try {
      const rejectedClass = await this.getClassById(classId);

      const awaitingApprovingStatus = await this.prisma.statusClass.findFirst({
        where: {
          statusClass: 'AWAITING_APPROVAL',
        },
      });

      if (rejectedClass.statusClassId !== awaitingApprovingStatus.id)
        throw new HttpException(
          'Class is not awaiting approving',
          HttpStatus.BAD_REQUEST,
        );

      const rejectedStatus = await this.prisma.statusClass.findFirst({
        where: {
          statusClass: 'REJECTED',
        },
      });

      await this.prisma.class.update({
        where: {
          id: classId,
        },
        data: {
          statusClassId: rejectedStatus.id,
        },
      });

      return true;
    } catch (error) {
      throw error;
    }
  }

  //Update Status Of Class
  async scheduleUpdateStatusOfClass() {
    cron.schedule('* * * * * *', async () => {
      await this.updateStatusOfClass();
    });
  }

  async updateStatusOfClass() {
    const timeNow = new Date();

    //GET COMING_SOON STATUS
    const comingSoonStatus = await this.prisma.statusClass.findFirst({
      where: {
        statusClass: 'COMING_SOON',
        isDeleted: false,
      },
    });

    //GET ON_GOING STATUS
    const onGoingStatus = await this.prisma.statusClass.findFirst({
      where: {
        statusClass: 'ON_GOING',
        isDeleted: false,
      },
    });

    //GET CLOSED STATUS
    const closedStatus = await this.prisma.statusClass.findFirst({
      where: {
        statusClass: 'CLOSED',
        isDeleted: false,
      },
    });

    const classesToStart = await this.prisma.class.findMany({
      where: {
        statusClassId: comingSoonStatus.id,
        isDeleted: false,
      },
    });

    for (const classItem of classesToStart) {
      if (classItem.startDate < timeNow) {
        await this.prisma.class.update({
          where: {
            id: classItem.id,
            isDeleted: false,
          },
          data: {
            statusClassId: onGoingStatus.id,
          },
        });
        this.logger.log(`Class ${classItem.className} started`);
      }
    }

    const classesToEnd = await this.prisma.class.findMany({
      where: {
        statusClassId: onGoingStatus.id,
        isDeleted: false,
      },
    });

    for (const classItem of classesToEnd) {
      if (timeNow > classItem.endDate) {
        await this.prisma.class.update({
          where: {
            id: classItem.id,
            isDeleted: false,
          },
          data: {
            statusClassId: closedStatus.id,
          },
        });
        this.logger.log(`Class ${classItem.className} ended`);
      }
    }
  }

  async registerClassById(classId: number, user: User) {
    const classUser = await this.prisma.classUser.create({
      data: {
        classId: classId,
        userId: user.id,
        isTrainer: false,
        isDeleted: true,
      },
    });

    const register = await this.prisma.register.create({
      data: {
        classUserId: classUser.id,
        isApproved: false,
      },
    });

    return register;
  }

  async approveRegisterById(registerId: number) {
    const register = await this.prisma.register.update({
      where: {
        id: registerId,
      },
      data: {
        isApproved: true,
      },
    });

    await this.prisma.classUser.update({
      where: {
        id: register.classUserId,
      },
      data: {
        isDeleted: false,
      },
    });

    return 'Trainee has been added to Class';
  }

  async rejectRegisterById(registerId: number) {
    const register = await this.prisma.register.update({
      where: {
        id: registerId,
      },
      data: {
        isApproved: false,
        isDeleted: true,
      },
    });

    await this.prisma.classUser.update({
      where: {
        id: register.classUserId,
      },
      data: {
        isDeleted: true,
      },
    });

    return 'Trainee has been rejected to Class';
  }

  async getRegistersByClassId(classId: number) {
    try {
      const classHaveRegister = await this.getClassById(classId);

      const classUsers = await this.prisma.classUser.findMany({
        where: {
          classId: classHaveRegister.id,
          isDeleted: true,
          isTrainer: false,
        },
      });

      const registersOfClass = [];

      for (const classUser of classUsers) {
        //Get user information that register
        const userRegister = await this.prisma.user.findUnique({
          where: {
            id: classUser.userId,
          },
        });
        delete userRegister.hash;
        delete userRegister.hashedRt;

        const register = await this.prisma.register.findFirst({
          where: {
            isDeleted: false,
            classUserId: classUser.id,
            isApproved: false,
          },
        });

        registersOfClass.push({ ...register, userRegister });
      }
      return { registersOfClass, classHaveRegister };
    } catch (error) {
      throw error;
    }
  }

  async getTopicGradesOfClass(classId: number, topicId: number) {
    const foundClassUsers = await this.prisma.classUser.findMany({
      where: {
        classId: classId,
        isTrainer: false,
      },
      select: { userId: true, finalGrade: true },
    });

    const topicGradeOfTrainees = [];

    for (const classUser of foundClassUsers) {
      const traineeTopicGrade = await this.prisma.topicGrade.findFirst({
        where: {
          userId: classUser.userId,
          topicId: topicId,
          isDeleted: false,
        },
        select: { grade: true, quizGrade: true, assignmentGrade: true },
      });

      const trainee = await this.prisma.user.findUnique({
        where: {
          id: classUser.userId,
        },
        select: { firstName: true, lastName: true, email: true },
      });

      const traineeDetailTopicGrade = { ...trainee, traineeTopicGrade };

      topicGradeOfTrainees.push(traineeDetailTopicGrade);
    }

    return topicGradeOfTrainees;
  }

  async getGradesOfClass(classId: number) {
    const foundClassUsers = await this.prisma.classUser.findMany({
      where: {
        classId: classId,
        isTrainer: false,
        isDeleted: false,
      },
      select: { userId: true, finalGrade: true },
    });

    const gradeOfTrainee = [];
    for (const classUser of foundClassUsers) {
      const trainee = await this.prisma.user.findUnique({
        where: {
          id: classUser.userId,
        },
        select: { email: true, firstName: true, lastName: true },
      });

      const traineeOfClass = { ...trainee, classUser };
      gradeOfTrainee.push(traineeOfClass);
    }

    return gradeOfTrainee;
  }
}
