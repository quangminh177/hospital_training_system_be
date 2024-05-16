import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { QuestionController } from './question-answer.controller';
import { QuestionService } from './question-answer.service';

@Module({
  imports: [PrismaModule],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
