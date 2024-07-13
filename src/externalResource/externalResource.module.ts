import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ExternalResourceController } from './externalResource.controller';
import { ExternalResourceService } from './externalResource.service';

@Module({
  imports: [PrismaModule],
  controllers: [ExternalResourceController],
  providers: [ExternalResourceService],
})
export class ExternalResourceModule {}
