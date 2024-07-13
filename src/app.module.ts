import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AtGuard } from './common/guards';
import { APP_GUARD } from '@nestjs/core';
import { ClassModule } from './class/class.module';
import { CourseModule } from './course/course.module';
import { DepartmentModule } from './department/department.module';
import { CurriculumModule } from './curriculum/curriculum.module';
import { TopicModule } from './topic/topic.module';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/exception-filters/global-exception.filter';
import { QuestionModule } from './question/question-answer.module';
import { QuizModule } from './quiz/quiz.module';
import { AssignmentModule } from './assignment/assignment.module';
import { JobModule } from './job/job.module';
import { LevelModule } from './level/level.module';
import { StatusClassModule } from './statusClass/statusClass.module';
import { ExternalResourceModule } from './externalResource/externalResource.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    PrismaModule,
    ClassModule,
    CourseModule,
    DepartmentModule,
    CurriculumModule,
    TopicModule,
    QuestionModule,
    QuizModule,
    AssignmentModule,
    JobModule,
    LevelModule,
    StatusClassModule,
    ExternalResourceModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
