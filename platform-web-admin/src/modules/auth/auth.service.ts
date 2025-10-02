import {
  Injectable,
  Logger,
  ConflictException,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  TooManyRequestsException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { UsersService } from '../users/users.service';
import { CognitoService } from '../../shared/infrastructure/cognito/cognito.service';
import { SnsService } from '../../shared/infrastructure/sns/sns.service';
import { RedisService } from '../../shared/infrastructure/redis/redis.service';
import { EventPublisherService } from '../../shared/infrastructure/messaging/event-publisher.service';

import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtPayload } from './dto/jwt-payload.interface';
import { TokensDto } from './dto/tokens.dto';
import { User } from '../users/entities/user.entity';
import { UserType, UserStatus } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly cognitoService: CognitoService,
    private readonly snsService: SnsService,
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly eventPublisherService: EventPublisherService,
  ) {}

  /**
   * Requests an OTP for a given mobile number for either registration or login flow.
   * REQ-1-035, REQ-1-039, REQ-1-041
   * @param requestOtpDto - DTO containing the mobile number.
   * @param flow - The context of the request ('registration' or 'login').
   */
  async requestOtp(
    requestOtpDto: RequestOtpDto,
    flow: 'registration' | 'login',
  ): Promise<void> {
    const { mobileNumber } = requestOtpDto;
    const lockoutKey = `lockout:${mobileNumber}`;
    const rateLimitKey = `otp_rate_limit:${mobileNumber}`;

    const isLocked = await this.redisService.get(lockoutKey);
    if (isLocked) {
      const ttl = await this.redisService.ttl(lockoutKey);
      this.logger.warn(`Attempt to access locked account: ${mobileNumber}`);
      throw new ConflictException(
        `Account is locked. Please try again in ${Math.ceil(ttl / 60)} minutes.`,
      );
    }

    const isRateLimited = await this.redisService.get(rateLimitKey);
    if (isRateLimited) {
      this.logger.warn(`OTP request rate limited for: ${mobileNumber}`);
      throw new TooManyRequestsException(
        'You have requested an OTP too recently. Please wait.',
      );
    }

    const user = await this.usersService.findByMobileNumber(mobileNumber);

    if (flow === 'registration') {
      if (user) {
        this.logger.warn(
          `Registration attempt with existing mobile number: ${mobileNumber}`,
        );
        throw new ConflictException(
          'This mobile number is already registered. Please log in instead.',
        );
      }
    } else {
      // login flow
      if (!user) {
        this.logger.warn(`Login attempt with unregistered number: ${mobileNumber}`);
        throw new NotFoundException(
          'Mobile number not found. Please check the number or sign up.',
        );
      }
      if (user.status !== UserStatus.ACTIVE) {
        this.logger.warn(
          `Login attempt for non-active account: ${mobileNumber}, status: ${user.status}`,
        );
        throw new ForbiddenException(
          `Your account is not active. Status: ${user.status}`,
        );
      }
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpKey = `otp:${mobileNumber}`;
    const otpExpiry = this.configService.get<number>('auth.otp_expiry_seconds');

    await this.redisService.setex(otpKey, otpExpiry, otpHash);
    await this.redisService.setex(rateLimitKey, 60, 'true'); // 60-second rate limit

    await this.snsService.sendSms(
      mobileNumber,
      `Your verification code is: ${otp}`,
    );
    this.logger.log(`OTP sent to mobile number: ${mobileNumber}`);
  }

  /**
   * Verifies an OTP and creates a new user account.
   * REQ-1-035, REQ-1-021
   * @param verifyOtpDto - DTO containing the mobile number and OTP.
   * @returns A promise resolving to the new user and their auth tokens.
   */
  async verifyOtpAndRegister(
    verifyOtpDto: VerifyOtpDto,
  ): Promise<{ tokens: TokensDto; user: User }> {
    const { mobileNumber, otp } = verifyOtpDto;

    const userExists = await this.usersService.findByMobileNumber(mobileNumber);
    if (userExists) {
      throw new ConflictException(
        'This mobile number is already registered. Please log in.',
      );
    }

    await this.validateOtp(mobileNumber, otp);

    const createUserDto: CreateUserDto = {
      mobileNumber,
      userType: UserType.CUSTOMER,
      status: UserStatus.ACTIVE, // Assuming direct activation for customers
    };

    // Orchestrate user creation in Cognito and local DB
    const cognitoSub = await this.cognitoService.createUserInCognito(
      mobileNumber,
      [{ Name: 'custom:userType', Value: UserType.CUSTOMER }],
    );

    const newUser = await this.usersService.createUser(
      createUserDto,
      cognitoSub,
    );
    this.logger.log(`New user registered successfully: ${newUser.id}`);

    // Publish event for downstream services
    await this.eventPublisherService.publish('user.registered', {
      userId: newUser.id,
      mobileNumber: newUser.mobileNumber,
      userType: newUser.userType,
    });

    const tokens = await this._generateTokens({
      sub: newUser.id,
      mobileNumber: newUser.mobileNumber,
      userType: newUser.userType,
    });

    return { tokens, user: newUser };
  }

  /**
   * Verifies an OTP for an existing user and issues auth tokens.
   * REQ-1-039
   * @param verifyOtpDto - DTO containing the mobile number and OTP.
   * @returns A promise resolving to the user's auth tokens.
   */
  async verifyOtpAndLogin(verifyOtpDto: VerifyOtpDto): Promise<TokensDto> {
    const { mobileNumber, otp } = verifyOtpDto;

    const user = await this.usersService.findByMobileNumber(mobileNumber);
    if (!user) {
      this.logger.error(
        `Login verification failed: User not found for ${mobileNumber}`,
      );
      throw new NotFoundException('User not found.');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException(`Your account is not active.`);
    }

    await this.validateOtp(mobileNumber, otp);

    const tokens = await this._generateTokens({
      sub: user.id,
      mobileNumber: user.mobileNumber,
      userType: user.userType,
    });

    await this.eventPublisherService.publish('user.loggedin', {
      userId: user.id,
    });
    this.logger.log(`User logged in successfully: ${user.id}`);

    return tokens;
  }

  /**
   * Invalidates a user's refresh token.
   * @param userId - The ID of the user to log out.
   */
  async logout(userId: string): Promise<void> {
    await this.usersService.update(userId, { hashedRefreshToken: null });
    this.logger.log(`User logged out: ${userId}`);
  }

  /**
   * Generates new access and refresh tokens using a valid refresh token.
   * REQ-1-040
   * @param userId - The user ID.
   * @param refreshToken - The refresh token.
   * @returns A promise resolving to new auth tokens.
   */
  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<TokensDto> {
    const user = await this.usersService.findById(userId);
    if (!user || !user.hashedRefreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.hashedRefreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException('Access Denied');
    }

    const tokens = await this._generateTokens({
      sub: user.id,
      mobileNumber: user.mobileNumber,
      userType: user.userType,
    });
    this.logger.log(`Tokens refreshed for user: ${userId}`);
    return tokens;
  }

  /**
   * Validates a user based on JWT payload. Used by JwtStrategy.
   * @param payload - The decoded JWT payload.
   * @returns The user entity if valid.
   */
  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findById(payload.sub);
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException('Invalid token or inactive user.');
    }
    return user;
  }

  private async validateOtp(mobileNumber: string, otp: string): Promise<void> {
    const lockoutKey = `lockout:${mobileNumber}`;
    const isLocked = await this.redisService.get(lockoutKey);
    if (isLocked) {
      throw new ConflictException('Account is locked.');
    }

    const otpKey = `otp:${mobileNumber}`;
    const otpHash = await this.redisService.get(otpKey);
    if (!otpHash) {
      throw new BadRequestException('OTP has expired or is invalid.');
    }

    const isMatch = await bcrypt.compare(otp, otpHash);
    const failedAttemptsKey = `failed_otp:${mobileNumber}`;

    if (!isMatch) {
      const attempts = await this.redisService.incr(failedAttemptsKey);
      await this.redisService.expire(
        failedAttemptsKey,
        this.configService.get<number>('auth.lockout_duration_minutes') * 60,
      );

      const maxAttempts = this.configService.get<number>(
        'auth.max_otp_attempts',
      );
      if (attempts >= maxAttempts) {
        await this.redisService.setex(
          lockoutKey,
          this.configService.get<number>('auth.lockout_duration_minutes') * 60,
          'true',
        );
        await this.redisService.del(failedAttemptsKey);
        this.logger.warn(`Account locked due to failed OTP attempts: ${mobileNumber}`);
        throw new ConflictException(
          'Too many failed attempts. Your account is locked.',
        );
      }
      throw new BadRequestException('Invalid OTP.');
    }

    await this.redisService.del(otpKey);
    await this.redisService.del(failedAttemptsKey);
  }

  private async _generateTokens(payload: JwtPayload): Promise<TokensDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('auth.jwt_access_token_expiry'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('auth.jwt_refresh_token_expiry'),
      }),
    ]);

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(payload.sub, { hashedRefreshToken });

    return {
      accessToken,
      refreshToken,
    };
  }
}