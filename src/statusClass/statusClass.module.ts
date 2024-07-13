import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StatusClassController } from './statusClass.controller';
import { StatusClassService } from './statusClass.service';

@Module({
  imports: [PrismaModule],
  controllers: [StatusClassController],
  providers: [StatusClassService],
})
export class StatusClassModule {}
