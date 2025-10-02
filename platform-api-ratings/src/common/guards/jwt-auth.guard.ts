import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * A custom JWT authentication guard that extends the default Passport AuthGuard.
 * It protects all routes by default. To make a route public, use the `@Public()` decorator.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Overrides the default canActivate method to allow for public routes.
   * It checks for the presence of the `IS_PUBLIC_KEY` metadata on the route handler.
   *
   * @param context The execution context of the current request.
   * @returns A boolean indicating whether the route can be activated, or a promise/observable that resolves to a boolean.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // If not public, proceed with the default JWT authentication strategy
    return super.canActivate(context);
  }

  /**
   * Overrides the default handleRequest method to provide custom exception handling if needed.
   * In this default implementation, it simply re-throws any errors and returns the user object.
   *
   * @param err Any error that occurred during the authentication process.
   * @param user The user object returned by the Passport strategy if authentication is successful.
   * @param info Additional information or error details.
   * @returns The authenticated user object.
   * @throws The error that occurred during authentication.
   */
  handleRequest(err, user, info) {
    if (err || !user) {
      // You can throw a custom exception here if you want to override the default 401 Unauthorized
      throw err || info;
    }
    return user;
  }
}