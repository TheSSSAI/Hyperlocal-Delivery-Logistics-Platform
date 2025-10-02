/**
 * @fileoverview This file serves as the public API entry point for the observability library.
 * It exports all the necessary modules, services, interfaces, decorators, and utilities
 * that consuming applications will need to implement standardized observability.
 *
 * By using a single barrel file, we provide a clean and simple import path for consumers,
 * abstracting the internal structure of the library.
 *
 * Example Usage in a consumer service:
 * `import { ObservabilityModule, ILogger, LoggerService, Trace } from 'platform-lib-observability';`
 */

// Main Module
export * from './observability.module';

// Configuration
export * from './config/observability.interface';

// Context Management (Correlation ID)
export * from './context/context.service';

// Logging
export * from './logging/logger.interface';
export * from './logging/logger.service';
export * from './logging/masking.util';

// Metrics
export * from './metrics/metrics.service';
export * from './metrics/metrics.decorator';

// Tracing
export * from './tracing/tracing.decorator';
export * from './tracing/tracing.service';

// Low-level Interceptors/Middleware/Filters that might be useful for advanced manual setup, though not typical.
// Typically these are applied globally by the ObservabilityModule.
export * from './context/correlation-id.middleware';
export * from './metrics/metrics.interceptor';
export * from './logging/logging.exception-filter';
export * from './context/axios-trace.interceptor';