import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

interface IErrorDetail {
  field?: string;
  message: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    let httpStatus: number;
    let message: string;
    let details: IErrorDetail[] | string | undefined = undefined;

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'string') {
        message = response;
      } else if (typeof response === 'object' && response !== null) {
        const responseObject = response as {
          message: string | string[];
          error?: string;
          statusCode?: number;
        };
        // Handle class-validator responses
        if (
          Array.isArray(responseObject.message) &&
          responseObject.error === 'Bad Request'
        ) {
          message = 'Validation failed. Please check your input.';
          details = this.formatValidationErrors(responseObject.message);
        } else {
          message =
            typeof responseObject.message === 'string'
              ? responseObject.message
              : 'An unexpected error occurred.';
        }
      } else {
        message = 'An internal server error occurred.';
      }
    } else {
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'An internal server error occurred.';
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
      message,
      details,
    };

    if (httpStatus >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `HTTP Status ${httpStatus} on ${request.method} ${request.url} - ${message}`,
        exception instanceof Error ? exception.stack : JSON.stringify(exception),
      );
    } else {
      this.logger.warn(
        `HTTP Status ${httpStatus} on ${request.method} ${request.url} - ${message}`,
      );
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }

  private formatValidationErrors(
    errors: any[],
  ): IErrorDetail[] | undefined {
    if (!Array.isArray(errors)) return undefined;

    const formattedErrors: IErrorDetail[] = [];
    for (const error of errors) {
      if (typeof error === 'string') {
        // Handle simple string errors from class-validator
        const match = error.match(/(\w+) should not be empty/);
        if (match) {
          formattedErrors.push({ field: match[1], message: error });
        } else {
            formattedErrors.push({ message: error });
        }
      } else if (error.property && error.constraints) {
        // Handle detailed ValidationError objects (if `validationPipe` is configured that way)
        formattedErrors.push({
          field: error.property,
          message: Object.values(error.constraints).join(', '),
        });
      }
    }
    return formattedErrors.length > 0 ? formattedErrors : undefined;
  }
}