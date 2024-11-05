import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../enums/roles.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Prisma } from '@prisma/client';

export type UserToken = Prisma.user_ceGetPayload<{ include: { user_role: true } }>

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const { user }: { user: UserToken } = context.switchToHttp().getRequest();

    const userRoles = user.user_role.map(a => Number(a.roleId)) || [];

    if (!requiredRoles.length) return true;
    const validUser = requiredRoles.some(role => userRoles.includes(role));

    if (validUser) return true;

    throw new ForbiddenException('No tienes permisos para acceder a este recurso');
  }
}