import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';

/**
 * @class AllExceptionsFilter
 * @description A global exception filter to catch all unhandled exceptions
 * and format them into a standardized JSON response.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    const isHttpException = exception instanceof HttpException;

    const httpStatus = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorId = uuidv4();

    let responseBody: {
      statusCode: number;
      timestamp: string;
      path: string;
      errorId: string;
      message: string | object;
      detail?: any;
    };
    
    const timestamp = new Date().toISOString();
    const path = httpAdapter.getRequestUrl(request);

    if (isHttpException) {
      const response = exception.getResponse();
      responseBody = {
        statusCode: httpStatus,
        timestamp,
        path,
        errorId,
        message: typeof response === 'string' ? response : (response as any).message || 'An error occurred',
        detail: typeof response === 'object' ? (response as any).error || (response as any).message : undefined,
      };
      this.logger.warn(`[${errorId}] HttpException: ${httpStatus} ${responseBody.message} on ${path}`);
    } else {
      responseBody = {
        statusCode: httpStatus,
        timestamp,
        path,
        errorId,
        message: 'Internal server error. Please contact support.',
      };
      this.logger.error(
        `[${errorId}] Unhandled Exception: ${(exception as Error).message}`,
        (exception as Error).stack,
      );
    }
    
    // In development, you might want to include the stack trace
    // if (process.env.NODE_ENV !== 'production' && !isHttpException) {
    //   responseBody.detail = (exception as Error).stack;
    // }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}