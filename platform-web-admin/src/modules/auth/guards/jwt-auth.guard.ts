import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * This guard triggers the JWT authentication flow defined by the JwtStrategy.
   * If the JWT is valid and the user is found and active, canActivate will return true.
   * Otherwise, it will throw an UnauthorizedException.
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  /**
   * Overrides the default handleRequest to provide custom error messages or logic
   * after the authentication attempt.
   * @param err The error object from Passport.
   * @param user The user object returned from the strategy's validate method.
   * @param info Additional info or error details.
   */
  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      // You can customize the error message based on the 'info' object.
      // For example, if info is TokenExpiredError.
      const message = info?.message || 'Unauthorized';
      throw err || new UnauthorizedException(message);
    }
    return user;
  }
}