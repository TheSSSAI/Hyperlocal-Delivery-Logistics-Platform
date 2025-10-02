/**
 * @file Defines the configuration interface for the ObservabilityModule.
 * @description This interface specifies the contract for all configuration options
 * required to set up logging, metrics, and tracing across services, ensuring
 * type-safe and consistent configuration. It directly supports REQ-1-108 and REQ-1-110.
 */

import { Sampler } from '@opentelemetry/api';

/**
 * Defines the log level for the application logger.
 * Follows standard log level conventions.
 */
export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

/**
 * IObservabilityConfig defines the shape of the configuration object
 * for the entire observability library. This allows consuming services
 * to provide settings in a strongly-typed manner.
 */
export interface IObservabilityConfig {
  /**
   * The name of the consuming service (e.g., 'identity-service').
   * This is a mandatory field used to tag all telemetry (logs, metrics, traces).
   * @example 'order-management-service'
   */
  serviceName: string;

  /**
   * The minimum log level to output. Logs below this level will be suppressed.
   * Optional, defaults to 'info' in production and 'debug' in development.
   * @default 'info'
   */
  logLevel?: LogLevel;

  /**
   * An array of object keys (case-insensitive) to be masked in log outputs.
   * Useful for preventing sensitive data like tokens and passwords from being logged.
   * Optional, defaults to a standard list of sensitive keys.
   * @default ['password', 'token', 'authorization', 'accessToken', 'refreshToken', 'apiKey']
   */
  sensitiveFields?: string[];

  /**
   * A boolean flag to globally enable or disable OpenTelemetry distributed tracing.
   * Useful for development or specific environments where tracing is not needed.
   * Optional, defaults to true.
   * @default true
   */
  tracingEnabled?: boolean;

  /**
   * The endpoint URL for the OpenTelemetry Collector to which traces will be exported.
   * Can be a gRPC or HTTP endpoint depending on the collector's configuration.
   * Optional, defaults to 'http://localhost:4318/v1/traces' for HTTP/OTLP.
   * @default process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces'
   */
  otlpExporterUrl?: string;

  /**
   * The sampling ratio for distributed tracing, represented as a number between 0.0 and 1.0.
   * A value of 1.0 means all traces are sampled (useful for development).
   * A value of 0.1 means 10% of traces are sampled (a common production setting).
   * This is critical for managing performance and cost, as per REQ-1-093.
   * Optional, defaults to 1.0.
   * @default 1.0
   */
  traceSamplerRatio?: number;

  /**
   * Advanced configuration to provide a custom OpenTelemetry Sampler.
   * If provided, this will override `traceSamplerRatio`.
   * @see https://opentelemetry.io/docs/instrumentation/js/sampling/
   * @default ParentBased(new TraceIdRatioBasedSampler(traceSamplerRatio))
   */
  traceSampler?: Sampler;
}

/**
 * Defines the asynchronous options for providing the ObservabilityModule configuration.
 * This allows the configuration to be loaded from an external source, such as a ConfigService.
 */
export interface ObservabilityModuleAsyncOptions {
  /**
   * An array of existing providers that should be imported into this dynamic module.
   * Typically used to import a `ConfigModule`.
   */
  imports?: any[];
  /**
   * An array of providers that the `useFactory` function depends on.
   * Typically used to inject a `ConfigService`.
   */
  inject?: any[];
  /**
   * A factory function that returns the observability configuration object.
   * This function can be async and can inject dependencies from the `inject` array.
   * @param args The providers injected via the `inject` option.
   * @returns A promise that resolves to the `IObservabilityConfig` object.
   */
  useFactory: (
    ...args: any[]
  ) => Promise<IObservabilityConfig> | IObservabilityConfig;
}