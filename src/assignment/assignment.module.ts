import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
import { UploadFileServiceAbstract } from 'src/file/upload-file.abstract.service';
import { UploadFileServiceS3 } from 'src/file/upload-file.service';

@Module({
  imports: [PrismaModule],
  controllers: [AssignmentController],
  providers: [
    AssignmentService,
    {
      provide: UploadFileServiceAbstract,
      useClass: UploadFileServiceS3,
    },
  ],
})
export class AssignmentModule {}
