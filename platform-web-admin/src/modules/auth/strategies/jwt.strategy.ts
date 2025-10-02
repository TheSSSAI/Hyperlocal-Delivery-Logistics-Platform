import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../dto/jwt-payload.interface';
import { UsersService } from '../../users/users.service';
import { User, UserStatus } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('auth.jwt_access_token_secret'),
    });
  }

  /**
   * This method is called by Passport to validate the JWT payload after signature verification.
   * It's responsible for fetching the user from the database and ensuring they are active.
   * The returned value is attached to the request object as `request.user`.
   * @param payload The decoded JWT payload.
   * @returns The full user entity if validation is successful.
   * @throws UnauthorizedException if the user is not found or not active.
   */
  async validate(payload: JwtPayload): Promise<User> {
    const { sub: cognitoSub } = payload;
    this.logger.debug(`Validating JWT for user with Cognito SUB: ${cognitoSub}`);

    if (!cognitoSub) {
      this.logger.warn('JWT payload missing "sub" (subject) claim.');
      throw new UnauthorizedException('Invalid token claims.');
    }

    const user = await this.usersService.findUserByCognitoSub(cognitoSub);

    if (!user) {
      this.logger.warn(`User with Cognito SUB ${cognitoSub} not found in the database.`);
      throw new UnauthorizedException('User not found.');
    }

    if (user.status !== UserStatus.ACTIVE) {
      this.logger.warn(
        `Authentication failed for user ${user.id}. Account status is "${user.status}".`,
      );
      throw new UnauthorizedException(`User account is not active. Status: ${user.status}`);
    }

    this.logger.debug(`JWT validation successful for user ID: ${user.id}`);
    
    // Passport will attach this user object to the request object
    return user;
  }
}