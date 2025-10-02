import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  UseGuards,
  Get,
  Ip,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { TokensDto } from './dto/tokens.dto';
import { ConfigService } from '@nestjs/config';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtPayload } from './dto/jwt-payload.interface';
import { UpdateConsentDto } from '../consent/dto/update-consent.dto';
import { REFRESH_TOKEN_COOKIE_NAME } from '../../common/constants/auth.constants';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register/otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request an OTP for user registration' })
  @ApiResponse({
    status: 200,
    description: 'OTP has been successfully sent.',
  })
  @ApiResponse({ status: 400, description: 'Invalid mobile number format.' })
  @ApiResponse({ status: 409, description: 'Mobile number already exists.' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded.' })
  async requestRegistrationOtp(
    @Body() requestOtpDto: RequestOtpDto,
  ): Promise<{ message: string }> {
    await this.authService.requestOtp(requestOtpDto, 'registration');
    return { message: 'OTP has been successfully sent.' };
  }

  @Post('register/verify')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Verify OTP and complete user registration' })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully.',
    type: TokensDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid OTP or mobile number.' })
  @ApiResponse({ status: 401, description: 'OTP has expired.' })
  @ApiResponse({ status: 429, description: 'Account locked.' })
  async verifyAndRegister(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Body('consents') consents: UpdateConsentDto[],
    @Res({ passthrough: true }) response: Response,
    @Ip() ip: string,
    @Req() req: Request,
  ): Promise<TokensDto> {
    const userAgent = req.headers['user-agent'] || '';
    const { tokens, user } = await this.authService.verifyOtpAndRegister(
      verifyOtpDto,
      consents,
      { ip, userAgent },
    );
    this._setRefreshTokenCookie(response, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Post('login/otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request an OTP for user login' })
  @ApiResponse({
    status: 200,
    description: 'OTP has been successfully sent.',
  })
  @ApiResponse({ status: 404, description: 'Mobile number not found.' })
  @ApiResponse({ status: 429, description: 'Rate limit exceeded.' })
  async requestLoginOtp(
    @Body() requestOtpDto: RequestOtpDto,
  ): Promise<{ message: string }> {
    await this.authService.requestOtp(requestOtpDto, 'login');
    return { message: 'OTP has been successfully sent.' };
  }

  @Post('login/verify')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP and log the user in' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully.',
    type: TokensDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid OTP or mobile number.' })
  @ApiResponse({ status: 401, description: 'OTP has expired or is invalid.' })
  @ApiResponse({ status: 429, description: 'Account locked.' })
  async verifyAndLogin(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Res({ passthrough: true }) response: Response,
    @Ip() ip: string,
    @Req() req: Request,
  ): Promise<TokensDto> {
    const userAgent = req.headers['user-agent'] || '';
    const tokens = await this.authService.verifyOtpAndLogin(verifyOtpDto, {
      ip,
      userAgent,
    });
    this._setRefreshTokenCookie(response, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log the user out' })
  @ApiResponse({ status: 200, description: 'User logged out successfully.' })
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    const user = req.user as JwtPayload;
    await this.authService.logout(user.sub);
    response.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
    });
    return { message: 'User logged out successfully.' };
  }

  @Post('refresh')
  @ApiCookieAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtain a new access token using a refresh token',
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed successfully.',
    type: TokensDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token.' })
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<TokensDto> {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];
    const userAgent = req.headers['user-agent'] || '';
    const ip = req.ip;

    const tokens = await this.authService.refreshTokens(refreshToken, {
      ip,
      userAgent,
    });
    this._setRefreshTokenCookie(response, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  me(@Req() req: Request) {
    return this.authService.getCurrentUser(req.user as JwtPayload);
  }

  private _setRefreshTokenCookie(response: Response, refreshToken: string) {
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(
      refreshTokenExpiry.getDate() +
        this.configService.get<number>('auth.jwt_refresh_token_expiry_days'),
    );

    response.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      expires: refreshTokenExpiry,
      sameSite: 'strict',
    });
  }
}