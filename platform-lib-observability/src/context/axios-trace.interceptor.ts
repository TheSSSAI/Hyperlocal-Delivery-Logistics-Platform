import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { ContextService } from './context.service';
import { propagation, context as apiContext, trace } from '@opentelemetry/api';
import { W3CTraceContextPropagator } from '@opentelemetry/core';

/**
 * Injects Correlation ID and OpenTelemetry trace context into outgoing Axios requests.
 * This is not a standard NestJS interceptor, but a class that applies an
 * interceptor to the underlying Axios instance of NestJS's HttpService.
 *
 * This is crucial for fulfilling REQ-1-110 (distributed tracing with correlationId).
 */
@Injectable()
export class AxiosTraceInterceptor implements OnModuleInit {
  private readonly propagator = new W3CTraceContextPropagator();

  constructor(
    private readonly httpService: HttpService,
    private readonly contextService: ContextService,
  ) {}

  onModuleInit() {
    const axiosInstance = this.httpService.axiosRef;

    axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig): AxiosRequestConfig => {
        const correlationId = this.contextService.getCorrelationId();

        // Ensure headers object exists
        if (!config.headers) {
          config.headers = {};
        }

        // 1. Inject Correlation ID
        if (correlationId) {
          config.headers['x-correlation-id'] = correlationId;
        }

        // 2. Inject OpenTelemetry Trace Context
        // This allows downstream services to continue the trace.
        const activeContext = trace.getSpan(apiContext.active())?.spanContext();

        if (activeContext) {
          const carrier = {};
          propagation.inject(apiContext.active(), carrier);
          for (const key in carrier) {
            if (Object.prototype.hasOwnProperty.call(carrier, key)) {
              config.headers[key] = carrier[key];
            }
          }
        }

        return config;
      },
      (error) => {
        // Errors in request interceptors are rare but should be propagated.
        return Promise.reject(error);
      },
    );
  }
}