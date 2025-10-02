/**
 * @file Defines a custom NestJS decorator for manual distributed tracing spans.
 * @description This decorator provides a declarative, AOP-style way to wrap a method
 * call in an OpenTelemetry span, which is useful for instrumenting specific business
 * logic or performance-critical sections of code beyond the automatic instrumentation.
 */

import { SpanStatusCode, trace } from '@opentelemetry/api';

/**
 * @decorator Trace
 * A method decorator that automatically creates an OpenTelemetry span around the
 * execution of the decorated method. The span will be named after the class and
 * method (e.g., 'UsersService.createUser'). It automatically records the duration,
 * sets the status to ERROR if an exception is thrown, and ensures the span is
 * always closed.
 *
 * @param spanName Optional. A custom name for the span. If not provided, it defaults
 * to `ClassName.methodName`.
 */
export function Trace(spanName?: string): MethodDecorator {
  return (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;

    // Do not wrap if the original method is not a function
    if (typeof originalMethod !== 'function') {
      return descriptor;
    }

    const tracer = trace.getTracer(
      'default', // It's conventional to use a library name/version, but 'default' is fine here
    );
    const className = target.constructor.name;
    const finalSpanName = spanName || `${className}.${String(propertyKey)}`;

    descriptor.value = function (...args: any[]) {
      return tracer.startActiveSpan(finalSpanName, (span) => {
        try {
          const result = originalMethod.apply(this, args);

          // Handle async methods
          if (result && typeof result.then === 'function') {
            return result
              .catch((error: Error) => {
                span.recordException(error);
                span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
                throw error; // Re-throw the error to not swallow it
              })
              .finally(() => {
                span.end();
              });
          }

          // Handle sync methods
          span.setStatus({ code: SpanStatusCode.OK });
          span.end();
          return result;
        } catch (error) {
          span.recordException(error);
          span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
          span.end();
          throw error; // Re-throw the error
        }
      });
    };

    return descriptor;
  };
}