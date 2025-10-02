import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../dto/jwt-payload.interface';
import { User, UserStatus } from '../../users/entities/user.entity';
import { AppConfig } from '../../../config/app.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService<AppConfig>,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.jwt_access_token_secret', { infer: true }),
    });
  }

  /**
   * Validates the JWT payload.
   * This method is automatically called by the passport-jwt strategy after it has verified the token's signature and expiration.
   * @param payload The decoded JWT payload.
   * @returns The user entity if validation is successful.
   * @throws UnauthorizedException if the user is not found or is not active.
   */
  async validate(payload: JwtPayload): Promise<User> {
    const { sub: userId } = payload;

    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedException(
        'User account is not active. Please contact support.',
      );
    }

    // The returned user object will be attached to the request object as `req.user`
    return user;
  }
}