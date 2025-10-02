import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { MetricsInterceptor } from './metrics.interceptor';

/**
 * @module MetricsModule
 * @description Encapsulates Prometheus metrics collection and exposure.
 * It provides a singleton MetricsService for creating custom metrics,
 * exposes a /metrics endpoint via the MetricsController, and globally
 * applies an interceptor to automatically collect HTTP request metrics.
 *
 * @provides MetricsService - For creating and managing metrics.
 * @provides MetricsController - To expose the /metrics endpoint for Prometheus scraping.
 * @provides APP_INTERCEPTOR - Registers MetricsInterceptor globally.
 */
@Global()
@Module({
  controllers: [
    // The MetricsController is responsible for exposing the /metrics endpoint
    // that the Prometheus server will scrape. This is a core part of fulfilling REQ-1-108.
    MetricsController,
  ],
  providers: [
    // MetricsService is a singleton that manages the prom-client registry.
    // It is exported to be available for dependency injection in any service
    // that needs to create custom, business-specific metrics.
    MetricsService,
    {
      // Register the MetricsInterceptor globally.
      // This is the idiomatic NestJS way to apply cross-cutting concerns.
      // It ensures that every incoming HTTP request is automatically instrumented
      // to measure latency and count status codes, fulfilling REQ-1-109.
      provide: APP_INTERCEPTOR,
      useClass: MetricsInterceptor,
    },
  ],
  exports: [MetricsService],
})
export class MetricsModule {}