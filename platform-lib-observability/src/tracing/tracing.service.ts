import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { TraceIdRatioBasedSampler } from '@opentelemetry/core';
import { ObservabilityConfig } from '../config/observability.config';
import { Logger } from '@nestjs/common';

/**
 * Service responsible for initializing and managing the OpenTelemetry Node.js SDK.
 * This is a critical one-time setup that runs when the application starts.
 *
 * Fulfills REQ-1-108 by setting up distributed tracing with OpenTelemetry.
 * Addresses the critical finding about performance by making the trace sampling
 * ratio a mandatory configuration, defaulting to a safe value for production.
 */
@Injectable()
export class TracingService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TracingService.name);
  private sdk: NodeSDK;

  constructor(
    @Inject(ObservabilityConfig.KEY)
    private readonly config: ObservabilityConfig,
  ) {}

  onModuleInit() {
    if (!this.config.tracingEnabled) {
      this.logger.log('Distributed tracing is disabled by configuration.');
      return;
    }

    const { serviceName, otlpExporterUrl, traceSamplerRatio } = this.config;

    this.logger.log(`Initializing OpenTelemetry for service: ${serviceName}`);
    this.logger.log(`OTLP Exporter URL: ${otlpExporterUrl}`);
    this.logger.log(`Trace Sampler Ratio: ${traceSamplerRatio}`);

    const traceExporter = new OTLPTraceExporter({
      url: otlpExporterUrl,
    });

    this.sdk = new NodeSDK({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
      }),
      spanProcessor: new BatchSpanProcessor(traceExporter),
      sampler: new TraceIdRatioBasedSampler(traceSamplerRatio),
      instrumentations: [
        getNodeAutoInstrumentations({
          // Add any specific instrumentation configuration here
          '@opentelemetry/instrumentation-http': {
            // Example: Don't trace outbound requests to the OTLP collector itself
            ignoreOutgoingRequestHook: (req) => {
              return req.hostname === new URL(otlpExporterUrl).hostname;
            },
          },
          // Disable instrumentations that are not needed or cause issues
          '@opentelemetry/instrumentation-fs': {
            enabled: false,
          },
        }),
      ],
    });

    try {
      this.sdk.start();
      this.logger.log('OpenTelemetry SDK started successfully.');
    } catch (error) {
      this.logger.error('Failed to start OpenTelemetry SDK', error);
      // Depending on policy, you might want to exit the process
      // process.exit(1);
    }

    // Gracefully shutdown SDK on process exit
    process.on('SIGTERM', () => {
      this.shutdown()
        .then(() => this.logger.log('Tracing terminated'))
        .catch((err) => this.logger.error('Error terminating tracing', err))
        .finally(() => process.exit(0));
    });
  }

  async onModuleDestroy() {
    await this.shutdown();
  }

  private async shutdown() {
    if (this.sdk) {
      try {
        await this.sdk.shutdown();
        this.logger.log('OpenTelemetry SDK has been shut down.');
      } catch (error) {
        this.logger.error('Error shutting down OpenTelemetry SDK', error);
      }
    }
  }
}