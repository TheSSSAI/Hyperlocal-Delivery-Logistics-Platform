import { IsJWT, IsNotEmpty } from 'class-validator';

/**
 * Data Transfer Object representing the JWT access and refresh tokens.
 * This is the standard response for a successful login or registration.
 * REQ-1-040
 */
export class TokensDto {
  @IsNotEmpty()
  @IsJWT()
  accessToken: string;

  @IsNotEmpty()
  @IsJWT()
  refreshToken: string;
}