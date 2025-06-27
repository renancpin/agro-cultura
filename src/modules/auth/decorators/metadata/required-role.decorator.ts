import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/modules/user/enums/roles.enum';

export const REQUIRED_ROLES = Symbol.for('REQUIRED_ROLES');

export function RequiredRoles(roles: Roles[]) {
  return SetMetadata(REQUIRED_ROLES, roles);
}
