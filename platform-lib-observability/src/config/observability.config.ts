import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { IObservabilityConfig } from './observability.interface';

/**
 * Configuration factory for the observability library.
 *
 * Loads and validates environment variables related to logging, metrics, and tracing.
 * This configuration is registered under the 'observability' namespace.
 */
export const observabilityConfig = registerAs('observability', (): IObservabilityConfig => {
  const schema = Joi.object<IObservabilityConfig, true>({
    serviceName: Joi.string().required().description('The name of the service for telemetry tagging'),
    logLevel: Joi.string()
      .valid('fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent')
      .default('info')
      .description('Specifies the minimum log level to output'),
    sensitiveFields: Joi.array()
      .items(Joi.string())
      .default([
        'password',
        'token',
        'accessToken',
        'refreshToken',
        'authorization',
        'auth',
        'cookie',
        'creditCard',
        'cvv',
      ])
      .description('Array of keys whose values will be masked in logs'),
    tracingEnabled: Joi.boolean().default(true).description('Globally enables or disables distributed tracing'),
    otlpExporterUrl: Joi.string()
      .uri()
      .default('http://localhost:4318/v1/traces')
      .description('The HTTP endpoint for the OpenTelemetry collector (OTLP)'),
    traceSamplerRatio: Joi.number()
      .min(0.0)
      .max(1.0)
      .default(1.0)
      .description('The ratio of traces to sample (0.0 to 1.0)'),
  });

  const config: IObservabilityConfig = {
    serviceName: process.env.SERVICE_NAME,
    logLevel: process.env.LOG_LEVEL || 'info',
    sensitiveFields: process.env.SENSITIVE_FIELDS ? process.env.SENSITIVE_FIELDS.split(',') : undefined,
    tracingEnabled: process.env.TRACING_ENABLED ? process.env.TRACING_ENABLED === 'true' : true,
    otlpExporterUrl: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT || 'http://localhost:4318/v1/traces',
    traceSamplerRatio: process.env.TRACE_SAMPLER_RATIO ? parseFloat(process.env.TRACE_SAMPLER_RATIO) : 1.0,
  };

  const { error, value } = schema.validate(config, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    throw new Error(`Observability configuration validation error: ${error.message}`);
  }

  return value;
});