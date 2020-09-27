import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ExceptionCodeName } from '../../../exceptions/exception-codes.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (
      user &&
      user.user_role &&
      roles.includes(user.user_role.user_role_type)
    ) {
      return true;
    }
    throw new ForbiddenException(ExceptionCodeName.FORBIDDEN_RESOURCE);
  }
}
