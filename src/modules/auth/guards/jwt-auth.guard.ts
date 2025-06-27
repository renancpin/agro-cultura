import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { REQUIRED_ROLES } from '../decorators/metadata/required-role.decorator';
import { Roles } from 'src/modules/user/enums/roles.enum';
import { LoggedUser } from '../types/logged-user.type';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  handleRequest(
    err: any,
    user: LoggedUser,
    _info: any,
    context: ExecutionContext,
  ): any {
    if (!user || err) {
      throw err || new UnauthorizedException();
    }

    const requiredRoles = this.reflector.getAllAndMerge<Roles[]>(
      REQUIRED_ROLES,
      [context.getHandler(), context.getClass()],
    );

    if (
      requiredRoles &&
      requiredRoles.length &&
      !requiredRoles.includes(user.role as Roles)
    ) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
