import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      this.logError(info);
      throw err || new UnauthorizedException('Authentication token is invalid or expired.');
    }
    return user;
  }
  
  private logError(info: any): void {
    if (info) {
        // passport-jwt error messages can be helpful for debugging
        if (info.name === 'TokenExpiredError') {
            console.error('JWT expired:', info.message);
        } else if (info.name === 'JsonWebTokenError') {
            console.error('JWT error:', info.message);
        } else {
            console.error('Authentication error:', info.toString());
        }
    }
  }
}