import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserType, User } from '../../users/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  /**
   * This guard checks if the current user has one of the roles specified
   * in the @Roles() decorator on a route handler or controller.
   * It must be used *after* an authentication guard like JwtAuthGuard.
   * @param context The current execution context.
   * @returns A boolean indicating if the user is authorized.
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required for this route, allow access.
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    // If there is no user object on the request, it means an authentication guard
    // has not been run or has failed. Deny access.
    if (!user || !user.userType) {
        this.logger.warn(`RolesGuard was executed but no user was found on the request. Ensure JwtAuthGuard is used first.`);
        throw new ForbiddenException('Access denied. User context not found.');
    }

    // Check if the user's role is included in the list of required roles.
    const hasRequiredRole = requiredRoles.some((role) => user.userType === role);

    if (!hasRequiredRole) {
        this.logger.warn(`User ${user.id} with role ${user.userType} tried to access a route requiring roles: [${requiredRoles.join(', ')}]`);
        throw new ForbiddenException(`You do not have the required role(s) to access this resource.`);
    }

    this.logger.debug(`User ${user.id} with role ${user.userType} granted access to route requiring roles: [${requiredRoles.join(', ')}]`);
    return true;
  }
}