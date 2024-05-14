import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { Observable } from 'rxjs';
import { ROLES } from '../decorators/roles.decorator';
import { RequestWithUser } from 'src/auth/types/requests.type';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles: string[] = this.reflector.getAllAndOverride<Role[]>(
      ROLES,
      [context.getHandler(), context.getClass()],
    );
    const request: RequestWithUser = context.switchToHttp().getRequest();
    return requiredRoles.includes(request.user.role);
  }
}
