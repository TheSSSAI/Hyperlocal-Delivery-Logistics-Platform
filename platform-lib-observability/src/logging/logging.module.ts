import { Global, Module, Scope } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { LoggerService } from './logger.service';
import { LoggingExceptionFilter } from './logging.exception-filter';
import { ContextService } from '../context/context.service';

/**
 * @module LoggingModule
 * @description Provides a standardized, structured JSON logger for the application.
 * It globally provides the LoggerService and a global exception filter to catch
 * and log all unhandled exceptions in the same structured format.
 *
 * @provides LoggerService - The main injectable logger.
 * @provides APP_FILTER - Registers LoggingExceptionFilter globally.
 */
@Global()
@Module({
  providers: [
    // ContextService is a dependency for LoggerService to fetch the correlationId.
    ContextService,
    {
      provide: LoggerService,
      // LoggerService is provided with TRANSIENT scope.
      // This allows NestJS to inject a new instance for each consumer,
      // which can then be initialized with a specific context (e.g., class name),
      // while still leveraging the request-scoped correlationId from AsyncLocalStorage.
      scope: Scope.TRANSIENT,
    },
    {
      // Register the LoggingExceptionFilter globally.
      // This ensures that any unhandled exception anywhere in the application
      // will be caught and logged by our structured LoggerService,
      // guaranteeing consistent error logging format as per REQ-1-108.
      provide: APP_FILTER,
      useClass: LoggingExceptionFilter,
    },
  ],
  exports: [LoggerService],
})
export class LoggingModule {}