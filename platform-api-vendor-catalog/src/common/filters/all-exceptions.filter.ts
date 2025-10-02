import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';

interface IErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  correlationId?: string;
  message: string | object;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const errorResponse: IErrorResponse = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      method: httpAdapter.getRequestMethod(request),
      correlationId: request.headers['x-correlation-id'] as string,
      message,
    };

    if (statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `[${errorResponse.method}] ${errorResponse.path} >> StatusCode: ${statusCode} >> Message: ${JSON.stringify(message)}`,
        exception instanceof Error ? exception.stack : JSON.stringify(exception),
      );
      // In production, sanitize the message to prevent leaking implementation details
      if (process.env.NODE_ENV === 'production') {
        errorResponse.message = 'An unexpected error occurred. Please try again later.';
      }
    } else {
      this.logger.warn(
        `[${errorResponse.method}] ${errorResponse.path} >> StatusCode: ${statusCode} >> Message: ${JSON.stringify(message)}`,
      );
    }

    httpAdapter.reply(response, errorResponse, statusCode);
  }
}