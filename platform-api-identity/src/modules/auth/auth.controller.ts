import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TokensDto } from './dto/tokens.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@ApiTags('Authentication')
@Controller('auth')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/request-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request an OTP for user registration' })
  @ApiResponse({
    status: 200,
    description: 'OTP has been sent successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid mobile number format.' })
  @ApiResponse({ status: 409, description: 'Mobile number already exists.' })
  @ApiResponse({ status: 429, description: 'Too many requests.' })
  async requestRegistrationOtp(
    @Body() requestOtpDto: RequestOtpDto,
  ): Promise<{ message: string }> {
    await this.authService.requestOtp(requestOtpDto, 'registration');
    return { message: 'OTP sent successfully.' };
  }

  @Post('register/verify-otp')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Verify OTP and complete user registration' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully.',
    type: TokensDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid OTP or mobile number.' })
  @ApiResponse({ status: 401, description: 'OTP has expired.' })
  verifyAndRegister(@Body() createUserDto: CreateUserDto): Promise<TokensDto> {
    return this.authService.verifyAndRegister(createUserDto);
  }

  @Post('login/request-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request an OTP for user login' })
  @ApiResponse({
    status: 200,
    description: 'OTP has been sent successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid mobile number format.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 429, description: 'Too many requests or account locked.' })
  async requestLoginOtp(
    @Body() requestOtpDto: RequestOtpDto,
  ): Promise<{ message: string }> {
    await this.authService.requestOtp(requestOtpDto, 'login');
    return { message: 'OTP sent successfully.' };
  }

  @Post('login/verify-otp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify OTP and log in' })
  @ApiResponse({
    status: 200,
    description: 'Login successful.',
    type: TokensDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid OTP or mobile number.' })
  @ApiResponse({ status: 401, description: 'Invalid OTP or account locked.' })
  verifyAndLogin(@Body() verifyOtpDto: VerifyOtpDto): Promise<TokensDto> {
    return this.authService.verifyOtpAndLogin(verifyOtpDto);
  }

  @Post('token/refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using a refresh token' })
  @ApiResponse({
    status: 200,
    description: 'Tokens refreshed successfully.',
    type: TokensDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token.' })
  refreshTokens(@Body('refreshToken') refreshToken: string): Promise<TokensDto> {
    return this.authService.refreshTokens(refreshToken);
  }
}