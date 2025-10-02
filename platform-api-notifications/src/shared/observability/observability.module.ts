import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'crypto';

/**
 * The ObservabilityModule is a shared, global module responsible for setting up
 * and providing a structured logger for the entire application.
 *
 * It uses 'nestjs-pino' for high-performance, structured JSON logging, which is
 * essential for effective monitoring and debugging in a microservices environment.
 * The module is marked as @Global() to make the logger available for injection
 * in any module without needing to import ObservabilityModule explicitly.
 */
@Global()
@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      /**
       * Factory function to create the Pino logger configuration.
       * It dynamically configures the logger based on the application environment.
       * @param configService The injected ConfigService instance.
       * @returns The configuration object for the pino-http logger.
       */
      useFactory: (configService: ConfigService) => {
        const isProduction =
          configService.get<string>('NODE_ENV') === 'production';

        return {
          pinoHttp: {
            // In development, use a human-readable format.
            // In production, use structured JSON for machine-readability.
            transport: !isProduction
              ? {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                    colorize: true,
                  },
                }
              : undefined,
            level: isProduction ? 'info' : 'debug',
            // Define custom log format.
            formatters: {
              level: (label) => {
                return { level: label };
              },
            },
            // Automatically add a correlation ID to every log entry for a given request.
            genReqId: (req) =>
              req.headers['x-correlation-id'] ||
              req.headers['x-request-id'] ||
              randomUUID(),
            // Customize the successful response log message.
            customSuccessMessage: (req, res) => {
              if (res.statusCode === 404) {
                return `[${req.method}] ${req.url} - Not Found`;
              }
              return `[${req.method}] ${req.url} - Request Completed`;
            },
            // Customize the error response log message.
            customErrorMessage: (req, res, err) => {
              return `[${req.method}] ${req.url} - Request Failed with status ${res.statusCode} - ${err.message}`;
            },
            // Redact sensitive headers from logs.
            redact: {
              paths: ['req.headers.authorization', 'req.headers.cookie'],
              censor: '***REDACTED***',
            },
          },
        };
      },
    }),
  ],
  exports: [LoggerModule],
})
export class ObservabilityModule {}