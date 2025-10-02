import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request } from 'express';
import { LoggerService } from './logger.service';

/**
 * A global exception filter that catches all unhandled exceptions.
 *
 * This filter's primary responsibility is to ensure that any unhandled error
 * within the application is captured and logged in a standardized, structured
 * JSON format using the custom `LoggerService`.
 *
 * It extends `BaseExceptionFilter` and delegates the final response generation
 * to it. This approach allows for consistent logging of errors while preserving
 * NestJS's default error response behavior, ensuring that clients receive a
 * standard HTTP error payload.
 *
 * This filter is a critical component for production observability, fulfilling
 * the requirement to log all errors for monitoring and alerting.
 *
 * @see REQ-1-108 - Enforces structured JSON logging for all errors.
 * @see REQ-1-110 - The underlying LoggerService automatically includes the correlationId.
 */
@Catch()
@Injectable()
export class LoggingExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  /**
   * Initializes the filter and injects the LoggerService.
   * A transient-scoped logger is used to allow for context-specific logging,
   * although the correlation ID is retrieved via request-scoped context.
   *
   * @param logger The application's structured logger service.
   */
  constructor(private readonly logger: LoggerService) {
    // The `super()` call is necessary as we are extending BaseExceptionFilter.
    // We pass the application reference from the http adapter to the super constructor.
    // The HttpAdapterHost is resolved by Nest's DI container when this filter is instantiated.
    super();
  }

  /**
   * The core method that intercepts unhandled exceptions.
   * It extracts request context, determines the appropriate HTTP status, logs
   * the error in detail, and then passes control to the base filter to send
   * the response.
   *
   * @param exception The exception object that was thrown.
   * @param host The `ArgumentsHost` providing access to the request/response context.
   */
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const { method, url, headers } = request;

    // Determine the HTTP status code. If it's a known HttpException, use its status.
    // Otherwise, default to 500 Internal Server Error.
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const logContext = {
      method,
      url,
      statusCode: status,
      headers: {
        'user-agent': headers['user-agent'],
        'content-type': headers['content-type'],
        referer: headers.referer,
      },
    };

    // The LoggerService is designed to correctly serialize Error objects, including
    // the stack trace. The correlationId is automatically injected by the logger
    // from the request context (AsyncLocalStorage).
    this.logger.error(
      `Unhandled exception for request: ${method} ${url}`,
      exception,
      logContext,
    );

    // After logging, delegate to the base NestJS exception filter to handle
    // sending the standardized HTTP error response to the client.
    super.catch(exception, host);
  }
}