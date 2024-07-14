import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ExternalResourceController } from './externalResource.controller';
import { ExternalResourceService } from './externalResource.service';
import { UploadFileServiceAbstract } from 'src/file/upload-file.abstract.service';
import { UploadFileServiceS3 } from 'src/file/upload-file.service';

@Module({
  imports: [PrismaModule],
  controllers: [ExternalResourceController],
  providers: [
    ExternalResourceService,
    {
      provide: UploadFileServiceAbstract,
      useClass: UploadFileServiceS3,
    },
  ],
})
export class ExternalResourceModule {}
