import { applyDecorators, UseGuards } from '@nestjs/common';
import { Role } from '../enums/roles.enum';
import { Roles } from './roles.decorator';
import { JwtGuard, RolesGuard } from '../guards';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    Roles(...roles),
    UseGuards(JwtGuard, RolesGuard),
  );
}