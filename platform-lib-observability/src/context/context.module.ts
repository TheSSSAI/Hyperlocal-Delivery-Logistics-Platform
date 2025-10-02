import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ContextService } from './context.service';
import { AxiosTraceContextInterceptor } from './axios-trace.interceptor';
import { TracingService } from '../tracing/tracing.service';

/**
 * @module ContextModule
 * @description Encapsulates request-scoped context management, including correlation ID
 * and trace context propagation for outgoing HTTP requests.
 * It provides and exports the ContextService for manual context interaction.
 *
 * @requires HttpModule - For instrumenting outgoing requests.
 * @provides ContextService - For managing AsyncLocalStorage context.
 * @provides AxiosTraceContextInterceptor - For automatically instrumenting HttpService.
 */
@Global()
@Module({
  imports: [
    // Register HttpModule asynchronously to inject and apply our custom interceptor.
    // This ensures that any service using NestJS's HttpService will automatically
    // have trace and correlation headers propagated.
    HttpModule.registerAsync({
      useFactory: (interceptor: AxiosTraceContextInterceptor) => ({
        // The interceptor is applied directly to the underlying Axios instance.
        // This is a powerful pattern for instrumenting all outgoing calls
        // made via HttpService throughout the application.
        axiosRef: interceptor.applyTo(HttpModule.axiosRef),
      }),
      inject: [AxiosTraceContextInterceptor],
    }),
  ],
  providers: [
    ContextService,
    AxiosTraceContextInterceptor,
    // TracingService is needed by the interceptor to get the active tracer.
    // Although TracingModule is separate, we provide TracingService here
    // to satisfy the dependency of AxiosTraceContextInterceptor.
    // The main ObservabilityModule will ensure TracingModule is imported.
    TracingService,
  ],
  exports: [ContextService, HttpModule],
})
export class ContextModule {}