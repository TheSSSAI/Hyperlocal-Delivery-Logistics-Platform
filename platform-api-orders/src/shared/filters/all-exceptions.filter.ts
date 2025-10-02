import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

interface IErrorResponse {
  statusCode: number;
  message: string | object;
  timestamp: string;
  path: string;
  correlationId?: string; // Assuming a correlationId middleware exists
}

/**
 * A global exception filter to catch all unhandled exceptions and format them
 * into a standardized JSON response.
 *
 * It handles three cases:
 * 1. HttpException: Uses the status and message from the exception.
 * 2. Error: Treats as an internal server error, logs the full stack, but returns a generic message.
 * 3. Unknown: Handles cases where a non-error is thrown.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    let statusCode: number;
    let message: string | object;
    
    // Default to Internal Server Error
    let responseBody: IErrorResponse = {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(request),
        correlationId: request.correlationId, // Assuming correlationId is attached to request
    };

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const errorResponse = exception.getResponse();
      
      responseBody.statusCode = statusCode;
      responseBody.message = typeof errorResponse === 'string' 
        ? errorResponse 
        : (errorResponse as any).message || 'An error occurred';

      this.logger.warn(`[${responseBody.correlationId}] HttpException caught: ${statusCode} ${JSON.stringify(responseBody.message)} for path: ${responseBody.path}`);

    } else if (exception instanceof Error) {
      // For any other standard Error, we treat it as a 500 but log the real error
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      
      this.logger.error(
        `[${responseBody.correlationId}] Unhandled Error caught: ${exception.message} for path: ${responseBody.path}`,
        exception.stack,
        'AllExceptionsFilter',
      );
      // Do not expose internal error details to the client
      responseBody.message = 'An unexpected internal server error occurred.';

    } else {
      // Handles cases where a non-Error object is thrown
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

      this.logger.error(
        `[${responseBody.correlationId}] Unhandled non-error exception caught for path: ${responseBody.path}`,
        JSON.stringify(exception),
        'AllExceptionsFilter',
      );
      responseBody.message = 'An unexpected error occurred.';
    }

    httpAdapter.reply(response, responseBody, responseBody.statusCode);
  }
}