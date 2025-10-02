import {
  DynamicModule,
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider,
  ModuleMetadata,
} from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { IObservabilityConfig } from './config/observability.interface';
import { ObservabilityConfig } from './config/observability.config';
import { ContextModule } from './context/context.module';
import { CorrelationIdMiddleware } from './context/correlation-id.middleware';
import { LoggingModule } from './logging/logging.module';
import { LoggingExceptionFilter } from './logging/logging.exception-filter';
import { MetricsModule } from './metrics/metrics.module';
import { MetricsInterceptor } from './metrics/metrics.interceptor';
import { TracingModule } from './tracing/tracing.module';

/**
 * Interface for asynchronous configuration of the ObservabilityModule.
 * Allows providing configuration via a factory that can inject dependencies.
 */
export interface ObservabilityModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (
    ...args: any[]
  ) => Promise<IObservabilityConfig> | IObservabilityConfig;
  inject?: any[];
}

/**
 * @Global()
 * @Module
 *
 * The main entry point for the observability library.
 * This module aggregates all observability features (logging, metrics, tracing, context)
 * into a single, configurable package for use in backend microservices.
 *
 * It is configured using the static `forRootAsync` method, which allows the consuming
 * application to provide configuration asynchronously, typically from a ConfigService.
 *
 * Once imported into the root AppModule of a service, it globally provides:
 * - A structured JSON logger (`LoggerService`)
 * - A metrics service and a /metrics endpoint (`MetricsService`, `MetricsController`)
 * - An automated HTTP metrics interceptor (`MetricsInterceptor`)
 * - A correlation ID middleware (`CorrelationIdMiddleware`)
 * - An automated tracing setup (`TracingService`)
 * - A global exception filter for structured error logging (`LoggingExceptionFilter`)
 */
@Global()
@Module({
  imports: [ContextModule, LoggingModule, MetricsModule, TracingModule],
})
export class ObservabilityModule implements NestModule {
  /**
   * Configures the observability stack for the application.
   *
   * @param options The asynchronous configuration options for the module.
   * @returns A `DynamicModule` that sets up the observability providers.
   */
  public static forRootAsync(
    options: ObservabilityModuleAsyncOptions,
  ): DynamicModule {
    const configProvider: Provider = {
      provide: ObservabilityConfig,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    return {
      module: ObservabilityModule,
      imports: options.imports || [],
      providers: [
        configProvider,
        {
          provide: APP_INTERCEPTOR,
          useClass: MetricsInterceptor,
        },
        {
          provide: APP_FILTER,
          useClass: LoggingExceptionFilter,
        },
      ],
      exports: [ObservabilityConfig, ContextModule, LoggingModule, MetricsModule],
    };
  }

  /**
   * Applies middleware to the application's request pipeline.
   * This method is part of the `NestModule` interface implementation.
   * It registers the `CorrelationIdMiddleware` to run for all incoming requests,
   * ensuring the correlation ID context is established at the very beginning
   * of the request lifecycle.
   *
   * @param consumer The middleware consumer to which middleware is applied.
   */
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}