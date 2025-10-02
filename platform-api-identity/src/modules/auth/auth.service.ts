import {
  Injectable,
  Logger,
  ConflictException,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { CognitoService } from '../../shared/infrastructure/cognito/cognito.service';
import { SnsService } from '../../shared/infrastructure/sns/sns.service';
import { RedisService } from '../../shared/infrastructure/redis/redis.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { AppConfig } from '../../config/app.config';
import { JwtPayload } from './dto/jwt-payload.interface';
import { TokensDto } from './dto/tokens.dto';
import { User, UserStatus, UserType } from '../users/entities/user.entity';
import * aS otpGenerator from 'otp-generator';
import { EventPublisherService } from '../../shared/infrastructure/messaging/event-publisher.service';
import { UserRegisteredEvent } from '@platform-contracts/events/user-events';
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
    private readonly configService: ConfigService<AppConfig>,
    private readonly eventPublisher: EventPublisherService,
  ) {}

  private getOtpKey(mobileNumber: string): string {
    return `otp:${mobileNumber}`;
  }

  private getOtpAttemptKey(mobileNumber: string): string {
    return `otp:attempts:${mobileNumber}`;
  }

  private getLockoutKey(mobileNumber: string): string {
    return `lockout:${mobileNumber}`;
  }

  async requestOtp(
    requestOtpDto: RequestOtpDto,
    flow: 'registration' | 'login',
  ): Promise<void> {
    const { mobileNumber } = requestOtpDto;

    const lockoutKey = this.getLockoutKey(mobileNumber);
    const isLocked = await this.redisService.get(lockoutKey);
    if (isLocked) {
      const ttl = await this.redisService.ttl(lockoutKey);
      throw new ConflictException(
        `Account is locked. Please try again in ${Math.ceil(ttl / 60)} minutes.`,
      );
    }

    // Simple rate limiting can be added here if needed, separate from lockout

    const user = await this.usersService.findByMobileNumber(mobileNumber);

    if (flow === 'registration' && user) {
      throw new ConflictException(
        'This mobile number is already registered. Please log in instead.',
      );
    }

    if (flow === 'login') {
      if (!user) {
        throw new NotFoundException(
          'Mobile number not found. Please check the number or sign up.',
        );
      }
      if (user.status !== UserStatus.ACTIVE) {
        throw new ForbiddenException(
          `Your account is ${user.status}. Please contact support.`,
        );
      }
    }

    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const otpKey = this.getOtpKey(mobileNumber);
    const otpExpiry = this.configService.get('auth.otp_expiry_seconds', { infer: true });
    await this.redisService.set(otpKey, otp, 'EX', otpExpiry);

    try {
      await this.snsService.sendOtp(mobileNumber, otp);
      this.logger.log(`OTP sent to ${mobileNumber}`);
    } catch (error) {
      this.logger.error(`Failed to send OTP to ${mobileNumber}`, error.stack);
      // In a production scenario, you might want to throw a specific service unavailable exception
      throw new Error('Failed to send OTP. Please try again later.');
    }
  }

  async verifyOtpAndRegister(verifyOtpDto: VerifyOtpDto, userType: UserType): Promise<{ tokens: TokensDto; user: User }> {
    const { mobileNumber, otp } = verifyOtpDto;

    const userExists = await this.usersService.findByMobileNumber(mobileNumber);
    if(userExists) {
        throw new ConflictException('This mobile number is already registered. Please log in instead.');
    }

    await this.validateOtp(mobileNumber, otp);

    const createUserDto: CreateUserDto = {
      mobileNumber,
      userType,
    };
    
    const newUser = await this.usersService.createUser(createUserDto);
    
    // Publish user registration event
    const event = new UserRegisteredEvent({
      userId: newUser.id,
      mobileNumber: newUser.mobileNumber,
      userType: newUser.userType,
      registeredAt: newUser.createdAt.toISOString(),
    });
    await this.eventPublisher.publish('user.registered', event);

    const tokens = await this._generateTokens({ sub: newUser.id, mobileNumber: newUser.mobileNumber, type: newUser.userType });

    return { tokens, user: newUser };
  }

  async verifyOtpAndLogin(verifyOtpDto: VerifyOtpDto): Promise<TokensDto> {
    const { mobileNumber, otp } = verifyOtpDto;

    const user = await this.usersService.findByMobileNumber(mobileNumber);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    if (user.status !== UserStatus.ACTIVE) {
        throw new ForbiddenException(`Your account is ${user.status}. Please contact support.`);
    }

    await this.validateOtp(mobileNumber, otp);

    // Update last login timestamp
    await this.usersService.updateLastLogin(user.id);

    return this._generateTokens({ sub: user.id, mobileNumber: user.mobileNumber, type: user.userType });
  }

  async refreshToken(userId: string, refreshToken: string): Promise<TokensDto> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }
    
    // In a real application, you would also validate the refresh token against a stored hash or use Cognito's refresh flow
    // For simplicity here, we assume if the JWT middleware validated it, it's good to generate a new pair.

    return this._generateTokens({ sub: user.id, mobileNumber: user.mobileNumber, type: user.userType });
  }

  async logout(userId: string): Promise<void> {
    const user = await this.usersService.findById(userId);
    if (!user) {
        throw new NotFoundException('User not found');
    }
    // In a stateful refresh token scenario, you would invalidate the token here.
    // For Cognito, you can use GlobalSignOut.
    // For a simple stateless approach, logout is a client-side responsibility (deleting tokens).
    this.logger.log(`User ${userId} logged out.`);
    await this.cognitoService.signOutUser(user.cognitoSub);
  }

  private async validateOtp(mobileNumber: string, otp: string): Promise<void> {
    const lockoutKey = this.getLockoutKey(mobileNumber);
    const isLocked = await this.redisService.get(lockoutKey);
    if (isLocked) {
      const ttl = await this.redisService.ttl(lockoutKey);
      throw new ConflictException(
        `Account is locked. Please try again in ${Math.ceil(ttl / 60)} minutes.`,
      );
    }
    
    const otpKey = this.getOtpKey(mobileNumber);
    const storedOtp = await this.redisService.get(otpKey);

    if (!storedOtp) {
      throw new BadRequestException('OTP has expired or is invalid. Please request a new one.');
    }

    if (storedOtp !== otp) {
      await this.handleFailedOtpAttempt(mobileNumber);
      throw new BadRequestException('Invalid OTP. Please try again.');
    }

    // OTP is correct, clean up
    const attemptKey = this.getOtpAttemptKey(mobileNumber);
    await Promise.all([
      this.redisService.del(otpKey),
      this.redisService.del(attemptKey),
    ]);
  }

  private async handleFailedOtpAttempt(mobileNumber: string): Promise<void> {
    const attemptKey = this.getOtpAttemptKey(mobileNumber);
    const attempts = await this.redisService.incr(attemptKey);
    
    const maxAttempts = this.configService.get('auth.max_otp_attempts', { infer: true });
    
    if (attempts >= maxAttempts) {
      const lockoutDuration = this.configService.get('auth.lockout_duration_minutes', { infer: true });
      const lockoutKey = this.getLockoutKey(mobileNumber);
      await this.redisService.set(lockoutKey, 'locked', 'EX', lockoutDuration * 60);
      await this.redisService.del(attemptKey); // clear attempts after locking
      this.logger.warn(`Account for ${mobileNumber} has been locked due to too many failed OTP attempts.`);
      throw new ConflictException(`Too many failed attempts. Your account is locked for ${lockoutDuration} minutes.`);
    } else {
        // Set expiry on the attempts key so it doesn't live forever
        await this.redisService.expire(attemptKey, this.configService.get('auth.otp_expiry_seconds', { infer: true }));
    }
  }


  private async _generateTokens(payload: JwtPayload): Promise<TokensDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('auth.jwt_access_token_secret', { infer: true }),
        expiresIn: this.configService.get('auth.jwt_access_token_expiry', { infer: true }),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('auth.jwt_refresh_token_secret', { infer: true }),
        expiresIn: this.configService.get('auth.jwt_refresh_token_expiry', { infer: true }),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}