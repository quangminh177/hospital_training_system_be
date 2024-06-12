import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class TimeRangeQuizGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const quizId = parseInt(request.params.quizId, 10);

    const currentTime = new Date();

    // Truy xuất thời gian bắt đầu và kết thúc từ cơ sở dữ liệu
    const quiz = await this.prisma.quiz.findUnique({
      where: {
        id: quizId,
      },
      select: {
        startAt: true,
        endAt: true,
      },
    });

    const { startAt, endAt } = quiz;

    if (currentTime >= new Date(startAt) && currentTime <= new Date(endAt)) {
      return true;
    }
    throw new ForbiddenException(
      'Bạn chỉ có thể truy cập trong khoảng thời gian cho phép.',
    );
  }
}
