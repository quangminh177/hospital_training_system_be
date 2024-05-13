import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';

@Module({
  imports: [PrismaModule],
  controllers: [TopicController],
  providers: [TopicService],
})
export class TopicModule {}
