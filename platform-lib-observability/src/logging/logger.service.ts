import {
  Injectable,
  Scope,
  ConsoleLogger,
  Inject,
  OnModuleInit,
} from '@nestjs/common';
import pino, { Logger, multistream, destination } from 'pino';
import { ILogger } from './logger.interface';
import { ContextService } from '../context/context.service';
import { ObservabilityConfig } from '../config/observability.config';
import { getMaskingUtil } from './masking.util';

/**
 * A production-ready, structured JSON logger service that replaces NestJS's default logger.
 * It leverages Pino.js for high performance.
 *
 * Fulfills REQ-1-108 (structured JSON logging for CloudWatch) and REQ-1-110 (auto-injection of correlationId).
 *
 * - Automatically injects `correlationId` into every log message.
 * - Automatically redacts sensitive fields (e.g., 'password', 'authorization') defined in config.
 * - Provides standard logging methods (log, error, warn, debug, verbose).
 * - Correctly serializes Error objects to include stack traces.
 * - TRANSIENT scope allows injecting a context (class name) for more granular logs.
 */
@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends ConsoleLogger implements ILogger, OnModuleInit {
  private pinoLogger: Logger;

  constructor(
    private readonly contextService: ContextService,
    @Inject(ObservabilityConfig.KEY)
    private readonly config: ObservabilityConfig,
  ) {
    super();
  }

  onModuleInit() {
    const { logLevel, serviceName, sensitiveFields, isProduction } = this.config;
    const maskingUtil = getMaskingUtil(sensitiveFields);

    // In production, we log to stdout for container log collection.
    // In development, we can use pino-pretty for more readable logs.
    const streams = [
      {
        level: logLevel,
        stream: isProduction
          ? process.stdout
          : destination({
              sync: true, // Use sync destination for dev pretty printing
            }),
      },
    ];

    this.pinoLogger = pino(
      {
        level: logLevel,
        base: {
          serviceName,
          pid: process.pid,
        },
        mixin: () => {
          return {
            correlationId: this.contextService.getCorrelationId(),
          };
        },
        redact: {
          paths: sensitiveFields,
          censor: '[REDACTED]',
        },
        ...maskingUtil, // Includes serializers for masking
        formatters: {
          level: (label) => {
            return { level: label };
          },
        },
        timestamp: pino.stdTimeFunctions.isoTime,
        // Pretty print for development
        ...(isProduction
          ? {}
          : {
              transport: {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  levelFirst: true,
                  translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
                },
              },
            }),
      },
      multistream(streams),
    );
  }

  log(message: any, context?: string | object) {
    this.callPino('info', message, context);
  }

  error(message: any, trace?: string, context?: string | object) {
    // If the message is an error object, pino handles it correctly.
    // We add the trace to the context for consistency.
    const logContext = this.buildContext(context);
    if (message instanceof Error) {
      this.pinoLogger.error({ ...logContext, trace }, message.message);
    } else {
      this.pinoLogger.error({ ...logContext, trace }, message);
    }
  }

  warn(message: any, context?: string | object) {
    this.callPino('warn', message, context);
  }

  debug(message: any, context?: string | object) {
    this.callPino('debug', message, context);
  }

  verbose(message: any, context?: string | object) {
    this.callPino('trace', message, context);
  }

  private callPino(level: pino.Level, message: any, context?: string | object) {
    const logContext = this.buildContext(context);

    if (typeof message === 'object') {
      this.pinoLogger[level](message, logContext.context as string);
    } else {
      this.pinoLogger[level](logContext, message);
    }
  }

  private buildContext(
    context?: string | object,
  ): { context?: string | object } {
    if (typeof context === 'string') {
      return { context };
    }
    if (typeof context === 'object' && context !== null) {
      return { ...context };
    }
    return { context: this.context }; // Inherited from ConsoleLogger
  }
}