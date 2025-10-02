import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * A custom authorization guard that checks if the authenticated user has the required roles.
 * It reads role metadata set by the `@Roles()` decorator on a route handler.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Determines if the current user is authorized to access the route.
   *
   * @param context The execution context of the current request.
   * @returns A boolean indicating whether the user is authorized.
   * @throws ForbiddenException if the user does not have the required roles.
   */
  canActivate(context: ExecutionContext): boolean {
    // Get the roles required for the specific route handler
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no roles are required for this route, access is granted
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Get the user object from the request, which should have been attached by an authentication guard (e.g., JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // If there's no user object or the user has no roles, deny access
    if (!user || !user.roles) {
      throw new ForbiddenException('You do not have the necessary permissions.');
    }

    // Check if the user's roles array includes at least one of the required roles
    const hasRequiredRole = requiredRoles.some((role) =>
      user.roles.includes(role),
    );

    if (!hasRequiredRole) {
      throw new ForbiddenException('You do not have the necessary permissions.');
    }

    return true;
  }
}