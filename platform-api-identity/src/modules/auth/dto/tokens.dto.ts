import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for representing the JWT access and refresh tokens.
 * This is the standard response for successful login or registration.
 *
 * REQ-1-040: Upon successful OTP-based authentication, the authentication
 * service shall issue a pair of JSON Web Tokens (JWTs): a short-lived access
 * token for API authorization and a long-lived refresh token.
 */
export class TokensDto {
  @ApiProperty({
    description: 'A short-lived JSON Web Token for API authorization.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'A long-lived JSON Web Token for refreshing the access token.',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;
}