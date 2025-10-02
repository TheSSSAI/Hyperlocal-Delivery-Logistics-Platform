import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from 'src/modules/users/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { JwtPayload } from '../dto/jwt-payload.interface';

/**
 * @class RolesGuard
 * @description An authentication guard that implements Role-Based Access Control (RBAC).
 * It inspects the JWT payload of the incoming request and compares the user's role
 * against the roles specified for the route handler via the `@Roles()` decorator.
 * This guard is designed to be used in conjunction with the `JwtAuthGuard`, which must run first
 * to attach the user payload to the request object.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determines if the current user has the required role to access a route.
   * @param context - The execution context of the incoming request.
   * @returns A boolean indicating whether access is granted.
   */
  canActivate(context: ExecutionContext): boolean {
    // 1. Get the required roles from the metadata set by the @Roles() decorator.
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 2. If no roles are required for this route, grant access by default.
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 3. Get the user object from the request. This is attached by a preceding auth guard (e.g., JwtAuthGuard).
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    // 4. If there's no user object, deny access. This shouldn't happen if JwtAuthGuard is used correctly.
    if (!user || !user.userType) {
      return false;
    }

    // 5. Check if the user's role is included in the list of required roles.
    const hasRequiredRole = requiredRoles.some(
      (role) => user.userType === role,
    );

    return hasRequiredRole;
  }
}