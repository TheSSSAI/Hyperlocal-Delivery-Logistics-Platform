import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  Registry,
  collectDefaultMetrics,
  Counter,
  Gauge,
  Histogram,
  Summary,
  CounterConfiguration,
  GaugeConfiguration,
  HistogramConfiguration,
  SummaryConfiguration,
} from 'prom-client';
import { ConfigService } from '@nestjs/config';
import { IObservabilityConfig } from '../config/observability.interface';

/**
 * A singleton service that manages the lifecycle of the Prometheus metrics registry.
 * It provides factory methods for creating different metric types and collects default
 * Node.js/process metrics. This service is the core of the Prometheus integration,
 * enabling REQ-1-108 and REQ-1-109.
 */
@Injectable()
export class MetricsService implements OnModuleInit, OnModuleDestroy {
  private readonly registry: Registry;
  private defaultMetricsInterval: NodeJS.Timeout;

  constructor(private readonly configService: ConfigService) {
    this.registry = new Registry();
  }

  /**
   * NestJS lifecycle hook. Called once the module has been initialized.
   * It registers default metrics with a service name label.
   */
  onModuleInit() {
    const observabilityConfig = this.configService.get<IObservabilityConfig>('observability');
    this.registry.setDefaultLabels({
      service: observabilityConfig.serviceName,
    });

    // Start collecting default Node.js and process metrics
    this.defaultMetricsInterval = collectDefaultMetrics({ register: this.registry });
  }

  /**
   * NestJS lifecycle hook. Called when the application is shutting down.
   * It clears the default metrics interval and the registry.
   */
  onModuleDestroy() {
    if (this.defaultMetricsInterval) {
      clearInterval(this.defaultMetricsInterval);
    }
    this.registry.clear();
  }

  /**
   * Creates and registers a new Prometheus Counter.
   * @param config - The configuration for the counter.
   * @returns The created Counter instance.
   */
  createCounter<T extends string>(config: CounterConfiguration<T>): Counter<T> {
    const counter = new Counter<T>(config);
    this.registry.registerMetric(counter);
    return counter;
  }

  /**
   * Creates and registers a new Prometheus Gauge.
   * @param config - The configuration for the gauge.
   * @returns The created Gauge instance.
   */
  createGauge<T extends string>(config: GaugeConfiguration<T>): Gauge<T> {
    const gauge = new Gauge<T>(config);
    this.registry.registerMetric(gauge);
    return gauge;
  }

  /**
   * Creates and registers a new Prometheus Histogram.
   * @param config - The configuration for the histogram.
   * @returns The created Histogram instance.
   */
  createHistogram<T extends string>(config: HistogramConfiguration<T>): Histogram<T> {
    const histogram = new Histogram<T>(config);
    this.registry.registerMetric(histogram);
    return histogram;
  }

  /**
   * Creates and registers a new Prometheus Summary.
   * @param config - The configuration for the summary.
   * @returns The created Summary instance.
   */
  createSummary<T extends string>(config: SummaryConfiguration<T>): Summary<T> {
    const summary = new Summary<T>(config);
    this.registry.registerMetric(summary);
    return summary;
  }

  /**
   * Gathers all registered metrics and formats them for Prometheus scraping.
   * @returns A promise that resolves to the formatted metrics string.
   */
  async getMetrics(): Promise<string> {
    return this.registry.metrics();
  }

  /**
   * Gets the content type for the metrics endpoint.
   * @returns The Prometheus content type string.
   */
  getMetricsContentType(): string {
    return this.registry.contentType;
  }

  /**
   * Returns the underlying prom-client registry instance.
   * Useful for advanced use cases where direct access to the registry is needed.
   * @returns The Registry instance.
   */
  getRegistry(): Registry {
    return this.registry;
  }
}