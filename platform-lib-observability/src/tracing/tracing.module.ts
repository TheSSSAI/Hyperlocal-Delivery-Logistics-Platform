import { Global, Module } from '@nestjs/common';
import { TracingService } from './tracing.service';

/**
 * @module TracingModule
 * @description Provides and initializes the OpenTelemetry SDK for distributed tracing.
 * The TracingService uses the OnModuleInit lifecycle hook to configure and
 * start the tracer for the entire application.
 *
 * @provides TracingService - The service responsible for SDK initialization.
 */
@Global()
@Module({
  providers: [
    // The TracingService encapsulates the complex, one-time setup of the OpenTelemetry NodeSDK.
    // By providing it here, we ensure that its `onModuleInit` lifecycle hook is called
    // by the NestJS application container at startup. This initializes tracing
    // for the entire service, fulfilling REQ-1-108 and REQ-1-110.
    TracingService,
  ],
  exports: [
    // We export the TracingService so it can be injected into other components
    // if direct access to the tracer is needed, such as in the AxiosTraceContextInterceptor.
    TracingService,
  ],
})
export class TracingModule {}