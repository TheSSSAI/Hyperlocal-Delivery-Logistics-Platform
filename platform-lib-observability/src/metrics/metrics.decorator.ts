/**
 * @file Defines custom NestJS decorators for metrics instrumentation.
 * @description These decorators provide a declarative, AOP-style way to add
 * custom business metrics to methods, fulfilling requirements for REQ-1-109.
 * They work in conjunction with the MetricsInterceptor.
 */

import { SetMetadata } from '@nestjs/common';
import { LabelValues } from 'prom-client';

/**
 * Metadata key for the TrackMetric decorator.
 * This constant is used to set and retrieve metadata via reflection.
 */
export const TRACK_METRIC_METADATA_KEY = 'platform:track_metric';

/**
 * Metadata key for the TrackDuration decorator.
 */
export const TRACK_DURATION_METADATA_KEY = 'platform:track_duration';

/**
 * @decorator TrackMetric
 * A method decorator that marks a method to have a Prometheus Counter incremented
 * each time it is called.
 *
 * This decorator is read by the `MetricsInterceptor` to perform the action.
 *
 * @example
 * // Increments a counter named 'user_registered_total'
 * @TrackMetric('user_registered_total')
 * async registerUser(dto: RegisterUserDto) {
 *   // ...
 * }
 *
 * @example
 * // Increments counter with dynamic labels resolved at runtime
 * @TrackMetric('payment_processed_total', { status: (args) => args[0].status })
 * async processPayment(payment: Payment) {
 *   // ...
 * }
 *
 * @param name The name of the Prometheus Counter metric.
 * @param labels Optional object where keys are label names and values are either
 * static strings or functions that resolve the label value from the method arguments at runtime.
 */
export const TrackMetric = (
  name: string,
  labels?: LabelValues<string>,
): MethodDecorator =>
  SetMetadata(TRACK_METRIC_METADATA_KEY, { name, labels });

/**
 * @decorator TrackDuration
 * A method decorator that measures the execution time of an asynchronous method
 * and records it in a Prometheus Histogram.
 *
 * This decorator is read by the `MetricsInterceptor` to perform the action.
 *
 * @example
 * // Records duration in a histogram named 'db_query_duration_seconds'
 * @TrackDuration('db_query_duration_seconds')
 * async findUserById(id: string) {
 *   // ...
 * }
 *
 * @example
 * // Records duration with a label for the table name
 * @TrackDuration('db_query_duration_seconds', { table: 'users' })
 * async findUserById(id: string) {
 *   // ...
 * }
 *
 * @param name The name of the Prometheus Histogram metric.
 * @param labels Optional object for static or dynamic labels, similar to @TrackMetric.
 */
export const TrackDuration = (
  name: string,
  labels?: LabelValues<string>,
): MethodDecorator =>
  SetMetadata(TRACK_DURATION_METADATA_KEY, { name, labels });