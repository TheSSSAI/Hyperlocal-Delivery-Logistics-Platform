/**
 * @file Defines the standardized contract for API error responses across the system.
 * @version 1.0.0
 * @since 1.0.0
 * @author Principal Software Engineer
 * @see REQ-1-092
 * @see REQ-1-110
 */

/**
 * Standardized structure for all API error responses.
 * This ensures consistency in error handling on the client-side.
 */
export class ApiErrorResponse {
  /**
   * The HTTP status code of the error.
   * @example 400
   */
  statusCode: number;

  /**
   * A user-friendly error message.
   * @example "Validation failed"
   */
  message: string;

  /**
   * A unique identifier for tracing the request across logs and services.
   * Fulfills requirement REQ-1-110 for distributed tracing.
   * @example "a1b2c3d4-e5f6-7890-1234-567890abcdef"
   */
  correlationId: string;

  /**
   * An optional array of specific validation error messages.
   * Typically used for 400 Bad Request responses to detail field-specific errors.
   * @example ["email must be a valid email address", "password must be at least 8 characters"]
   */
  errors?: string[];

  /**
   * The timestamp when the error occurred, in ISO 8601 format.
   * @example "2023-10-27T10:00:00Z"
   */
  timestamp: string;

  constructor(
    statusCode: number,
    message: string,
    correlationId: string,
    errors?: string[],
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.correlationId = correlationId;
    this.errors = errors;
    this.timestamp = new Date().toISOString();
  }
}