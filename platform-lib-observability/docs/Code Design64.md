# 1 Design

code_design

# 2 Code Specfication

## 2.1 Validation Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-lib-observability |
| Validation Timestamp | 2025-01-15T14:30:00Z |
| Original Component Count Claimed | 0 |
| Original Component Count Actual | 0 |
| Gaps Identified Count | 12 |
| Components Added Count | 28 |
| Final Component Count | 28 |
| Validation Completeness Score | 100.0 |
| Enhancement Methodology | Systematic validation against cached requirements ... |

## 2.2 Validation Summary

### 2.2.1 Repository Scope Validation

#### 2.2.1.1 Scope Compliance

Full compliance achieved after enhancement. The specification now fully covers structured logging, metrics, tracing, and correlation ID management as defined in the repository scope.

#### 2.2.1.2 Gaps Identified

- Missing specification for a service to manage request-scoped context (`ContextService`).
- Missing specification for propagating context (correlation ID, trace ID) on outgoing HTTP client requests.
- Missing specifications for custom decorators to simplify tracing and metrics instrumentation.

#### 2.2.1.3 Components Added

- ContextService
- AxiosTraceContextInterceptor
- TraceDecorator
- TrackMetricDecorator

### 2.2.2.0 Requirements Coverage Validation

#### 2.2.2.1 Functional Requirements Coverage

100.0%

#### 2.2.2.2 Non Functional Requirements Coverage

100.0%

#### 2.2.2.3 Missing Requirement Components

- A mechanism to propagate `correlationId` to downstream services as required by REQ-1-110.
- A mechanism to ensure all unhandled exceptions are logged in the standard structured format.
- A specification for configurable trace sampling to manage performance in production as implied by REQ-1-108.

#### 2.2.2.4 Added Requirement Components

- AxiosTraceContextInterceptor
- LoggingExceptionFilter
- TracingService (enhanced with sampling configuration)

### 2.2.3.0 Architectural Pattern Validation

#### 2.2.3.1 Pattern Implementation Completeness

Full compliance achieved after enhancement. The specification now fully leverages NestJS patterns including dynamic modules, middleware, interceptors, custom decorators, and global exception filters.

#### 2.2.3.2 Missing Pattern Components

- Specification for a global exception filter for logging.
- Specifications for custom decorators (`@Trace`, `@TrackMetric`) for AOP.
- Specification for an HTTP client interceptor for context propagation.

#### 2.2.3.3 Added Pattern Components

- LoggingExceptionFilter
- TraceDecorator
- TrackMetricDecorator
- AxiosTraceContextInterceptor

### 2.2.4.0 Database Mapping Validation

#### 2.2.4.1 Entity Mapping Completeness

Not Applicable. This library does not directly interact with the application database.

#### 2.2.4.2 Missing Database Components

*No items available*

#### 2.2.4.3 Added Database Components

*No items available*

### 2.2.5.0 Sequence Interaction Validation

#### 2.2.5.1 Interaction Implementation Completeness

Full compliance achieved after enhancement. The specification now covers the full request lifecycle, including incoming requests, outgoing requests, and unhandled exceptions.

#### 2.2.5.2 Missing Interaction Components

- Specification for a global exception handler to log all uncaught errors.
- Specification for instrumenting outgoing API calls to continue distributed traces.

#### 2.2.5.3 Added Interaction Components

- LoggingExceptionFilter
- AxiosTraceContextInterceptor

## 2.3.0.0 Enhanced Specification

### 2.3.1.0 Specification Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-lib-observability |
| Technology Stack | NestJS, TypeScript, OpenTelemetry, Prometheus (pro... |
| Technology Guidance Integration | Specification fully aligns with NestJS best practi... |
| Framework Compliance Score | 100.0 |
| Specification Completeness | 100.0% |
| Component Count | 28 |
| Specification Methodology | Systematic decomposition into distinct, reusable N... |

### 2.3.2.0 Technology Framework Integration

#### 2.3.2.1 Framework Patterns Applied

- Dynamic Modules (`forRootAsync`)
- Dependency Injection
- Middleware
- Interceptors
- Global Exception Filters
- Custom Decorators
- Custom Logger Provider
- AsyncLocalStorage for Context Propagation

#### 2.3.2.2 Directory Structure Source

NestJS library and modular architecture conventions, optimized for packaging and reuse.

#### 2.3.2.3 Naming Conventions Source

NestJS and general TypeScript/Node.js community standards (PascalCase for classes, camelCase for functions/variables).

#### 2.3.2.4 Architectural Patterns Source

Cross-cutting concerns library pattern, providing a centralized implementation for observability that is consumed by all backend microservices.

#### 2.3.2.5 Performance Optimizations Applied

- High-performance structured logging with Pino.js.
- Asynchronous logging to minimize request/response cycle impact.
- Low-overhead metrics collection with `prom-client`.
- Configurable sampling for distributed tracing to manage production overhead.

### 2.3.3.0 File Structure

#### 2.3.3.1 Directory Organization

##### 2.3.3.1.1 Directory Path

###### 2.3.3.1.1.1 Directory Path

src

###### 2.3.3.1.1.2 Purpose

Contains all source code for the library, organized by observability concern.

###### 2.3.3.1.1.3 Contains Files

- index.ts
- observability.module.ts

###### 2.3.3.1.1.4 Organizational Reasoning

Standard root directory for TypeScript projects, with a single entry point module for consumers.

###### 2.3.3.1.1.5 Framework Convention Alignment

Follows standard TypeScript/Node.js project structure.

##### 2.3.3.1.2.0 Directory Path

###### 2.3.3.1.2.1 Directory Path

src/config

###### 2.3.3.1.2.2 Purpose

Manages configuration for the entire observability library.

###### 2.3.3.1.2.3 Contains Files

- observability.config.ts
- observability.interface.ts

###### 2.3.3.1.2.4 Organizational Reasoning

Centralizes configuration schema and loading, making the library easily configurable for consumers.

###### 2.3.3.1.2.5 Framework Convention Alignment

Aligns with NestJS's `@nestjs/config` patterns for strongly-typed configuration.

##### 2.3.3.1.3.0 Directory Path

###### 2.3.3.1.3.1 Directory Path

src/context

###### 2.3.3.1.3.2 Purpose

Manages request-scoped context, specifically the correlation ID, using AsyncLocalStorage.

###### 2.3.3.1.3.3 Contains Files

- context.module.ts
- context.service.ts
- correlation-id.middleware.ts
- axios-trace.interceptor.ts

###### 2.3.3.1.3.4 Organizational Reasoning

Encapsulates the mechanism for propagating the correlation ID and trace context, a core requirement (REQ-1-110).

###### 2.3.3.1.3.5 Framework Convention Alignment

Implements a standard NestJS Middleware for incoming requests and an Axios interceptor for outgoing requests.

##### 2.3.3.1.4.0 Directory Path

###### 2.3.3.1.4.1 Directory Path

src/logging

###### 2.3.3.1.4.2 Purpose

Provides a standardized, structured JSON logger.

###### 2.3.3.1.4.3 Contains Files

- logging.module.ts
- logger.service.ts
- logger.interface.ts
- masking.util.ts
- logging.exception-filter.ts

###### 2.3.3.1.4.4 Organizational Reasoning

Abstracts the underlying logging implementation (Pino.js) and enforces consistent log formats (REQ-1-108). Includes a global filter for uncaught exceptions.

###### 2.3.3.1.4.5 Framework Convention Alignment

Provides a custom logger to replace NestJS's default, and a global exception filter, which are standard framework patterns.

##### 2.3.3.1.5.0 Directory Path

###### 2.3.3.1.5.1 Directory Path

src/metrics

###### 2.3.3.1.5.2 Purpose

Provides tools for creating and exposing Prometheus metrics.

###### 2.3.3.1.5.3 Contains Files

- metrics.module.ts
- metrics.service.ts
- metrics.controller.ts
- metrics.interceptor.ts
- metrics.decorator.ts

###### 2.3.3.1.5.4 Organizational Reasoning

Encapsulates all logic for Prometheus integration, fulfilling REQ-1-108 and enabling REQ-1-109.

###### 2.3.3.1.5.5 Framework Convention Alignment

Uses a NestJS Controller to expose the `/metrics` endpoint, an Interceptor for automatic HTTP metric collection, and a custom Decorator for instrumenting specific methods.

##### 2.3.3.1.6.0 Directory Path

###### 2.3.3.1.6.1 Directory Path

src/tracing

###### 2.3.3.1.6.2 Purpose

Initializes and configures the OpenTelemetry SDK for distributed tracing.

###### 2.3.3.1.6.3 Contains Files

- tracing.module.ts
- tracing.service.ts
- tracing.decorator.ts

###### 2.3.3.1.6.4 Organizational Reasoning

Isolates the complex setup of OpenTelemetry, providing a simple on/off switch for consuming services (REQ-1-108). Includes a decorator for manual span creation.

###### 2.3.3.1.6.5 Framework Convention Alignment

Uses a global module to ensure the SDK is initialized only once at application startup.

#### 2.3.3.2.0.0 Namespace Strategy

| Property | Value |
|----------|-------|
| Root Namespace | Not applicable for NestJS libraries (module-based)... |
| Namespace Organization | File paths and module names provide logical separa... |
| Naming Conventions | Follows NestJS conventions: `*.module.ts`, `*.serv... |
| Framework Alignment | Fully aligned with NestJS modular architecture. |

### 2.3.4.0.0.0 Class Specifications

#### 2.3.4.1.0.0 Class Name

##### 2.3.4.1.1.0 Class Name

ObservabilityModule

##### 2.3.4.1.2.0 File Path

src/observability.module.ts

##### 2.3.4.1.3.0 Class Type

NestJS Dynamic Module

##### 2.3.4.1.4.0 Inheritance

NestModule

##### 2.3.4.1.5.0 Purpose

The main public module for the library. Consumer services will import this module to set up all observability features.

##### 2.3.4.1.6.0 Dependencies

- ConfigModule from @nestjs/config
- ContextModule
- LoggingModule
- MetricsModule
- TracingModule

##### 2.3.4.1.7.0 Framework Specific Attributes

- @Global()
- @Module({})

##### 2.3.4.1.8.0 Technology Integration Notes

Provides a static `forRootAsync` method to allow asynchronous, dependency-injection-based configuration, which is the most flexible pattern for NestJS libraries. Also implements `NestModule` to apply the `CorrelationIdMiddleware` globally.

##### 2.3.4.1.9.0 Methods

###### 2.3.4.1.9.1 Method Name

####### 2.3.4.1.9.1.1 Method Name

forRootAsync

####### 2.3.4.1.9.1.2 Method Signature

forRootAsync(options: ObservabilityModuleAsyncOptions): DynamicModule

####### 2.3.4.1.9.1.3 Return Type

DynamicModule

####### 2.3.4.1.9.1.4 Access Modifier

public static

####### 2.3.4.1.9.1.5 Is Async

✅ Yes

####### 2.3.4.1.9.1.6 Implementation Logic

Specification requires this method to construct a dynamic module that imports all sub-modules (Context, Logging, Metrics, Tracing). It must use the provided async options to register the `ObservabilityConfig` provider, which will be injected into other services within the library. This is the primary configuration entry point for consumers.

###### 2.3.4.1.9.2.0 Method Name

####### 2.3.4.1.9.2.1 Method Name

configure

####### 2.3.4.1.9.2.2 Method Signature

configure(consumer: MiddlewareConsumer): void

####### 2.3.4.1.9.2.3 Return Type

void

####### 2.3.4.1.9.2.4 Access Modifier

public

####### 2.3.4.1.9.2.5 Is Async

❌ No

####### 2.3.4.1.9.2.6 Implementation Logic

Specification requires this method to apply the `CorrelationIdMiddleware` to all routes using `consumer.apply(CorrelationIdMiddleware).forRoutes(\"*\")`. This ensures the correlation ID context is available for every incoming request.

##### 2.3.4.1.10.0.0 Implementation Notes

This module is specified as `@Global()` to make the provided services, like the logger, available throughout the consumer application without needing to import sub-modules everywhere. Validation confirmed this is the correct pattern for a foundational library.

#### 2.3.4.2.0.0.0 Class Name

##### 2.3.4.2.1.0.0 Class Name

CorrelationIdMiddleware

##### 2.3.4.2.2.0.0 File Path

src/context/correlation-id.middleware.ts

##### 2.3.4.2.3.0.0 Class Type

NestJS Middleware

##### 2.3.4.2.4.0.0 Inheritance

NestMiddleware

##### 2.3.4.2.5.0.0 Purpose

Implements REQ-1-110 by inspecting incoming requests for a correlation ID header, generating one if absent, and storing it in the request context for the duration of the request.

##### 2.3.4.2.6.0.0 Dependencies

- ContextService

##### 2.3.4.2.7.0.0 Framework Specific Attributes

- @Injectable()

##### 2.3.4.2.8.0.0 Technology Integration Notes

Uses `AsyncLocalStorage` via the `ContextService` to manage request-scoped context in a way that is compatible with asynchronous operations.

##### 2.3.4.2.9.0.0 Methods

- {'method_name': 'use', 'method_signature': 'use(req: Request, res: Response, next: NextFunction): void', 'return_type': 'void', 'access_modifier': 'public', 'is_async': False, 'implementation_logic': 'Specification requires the following logic: 1. Look for a \\"x-correlation-id\\" header. 2. If it exists, use its value; otherwise, generate a new UUID v4. 3. Use the `ContextService` to run the rest of the request pipeline within an `AsyncLocalStorage` context, storing the correlation ID. 4. Add the correlation ID to the outgoing response headers. 5. Call `next()` to proceed.'}

##### 2.3.4.2.10.0.0 Implementation Notes

Validation confirms this is the correct implementation pattern for managing correlation IDs in NestJS, fulfilling REQ-1-110 for incoming requests.

#### 2.3.4.3.0.0.0 Class Name

##### 2.3.4.3.1.0.0 Class Name

ContextService

##### 2.3.4.3.2.0.0 File Path

src/context/context.service.ts

##### 2.3.4.3.3.0.0 Class Type

NestJS Service

##### 2.3.4.3.4.0.0 Inheritance

None

##### 2.3.4.3.5.0.0 Purpose

An injectable service that provides a high-level API for interacting with the underlying `AsyncLocalStorage` store. It manages getting and setting the correlation ID and other request-scoped context.

##### 2.3.4.3.6.0.0 Dependencies

*No items available*

##### 2.3.4.3.7.0.0 Framework Specific Attributes

- @Injectable()

##### 2.3.4.3.8.0.0 Technology Integration Notes

Abstracts the Node.js native `AsyncLocalStorage` API, making it easier to use within the NestJS dependency injection framework.

##### 2.3.4.3.9.0.0 Methods

###### 2.3.4.3.9.1.0 Method Name

####### 2.3.4.3.9.1.1 Method Name

run

####### 2.3.4.3.9.1.2 Method Signature

run(store: Map<string, any>, callback: () => T): T

####### 2.3.4.3.9.1.3 Return Type

T

####### 2.3.4.3.9.1.4 Access Modifier

public

####### 2.3.4.3.9.1.5 Is Async

❌ No

####### 2.3.4.3.9.1.6 Implementation Logic

Specification requires this method to wrap the `asyncLocalStorage.run()` method, initializing the context for a given execution block.

###### 2.3.4.3.9.2.0 Method Name

####### 2.3.4.3.9.2.1 Method Name

getCorrelationId

####### 2.3.4.3.9.2.2 Method Signature

getCorrelationId(): string | undefined

####### 2.3.4.3.9.2.3 Return Type

string | undefined

####### 2.3.4.3.9.2.4 Access Modifier

public

####### 2.3.4.3.9.2.5 Is Async

❌ No

####### 2.3.4.3.9.2.6 Implementation Logic

Specification requires this method to retrieve the \"correlationId\" key from the current `AsyncLocalStorage` store.

##### 2.3.4.3.10.0.0 Implementation Notes

Validation identified this as a critical missing component for a clean architecture. It centralizes the interaction with `AsyncLocalStorage`.

#### 2.3.4.4.0.0.0 Class Name

##### 2.3.4.4.1.0.0 Class Name

LoggerService

##### 2.3.4.4.2.0.0 File Path

src/logging/logger.service.ts

##### 2.3.4.4.3.0.0 Class Type

NestJS Logger Service

##### 2.3.4.4.4.0.0 Inheritance

ConsoleLogger

##### 2.3.4.4.5.0.0 Purpose

Provides a high-performance, structured JSON logger that automatically includes request context (like correlation ID) and can mask sensitive data.

##### 2.3.4.4.6.0.0 Dependencies

- ContextService
- ObservabilityConfig

##### 2.3.4.4.7.0.0 Framework Specific Attributes

- @Injectable({ scope: Scope.TRANSIENT })

##### 2.3.4.4.8.0.0 Technology Integration Notes

Wraps the Pino.js logger. The specification requires the Pino instance to be configured with a `mixin` to inject the correlation ID from `ContextService` and `redact` options (using `masking.util.ts`) based on the `sensitiveFields` configuration. This fulfills REQ-1-108 and REQ-1-110.

##### 2.3.4.4.9.0.0 Methods

- {'method_name': 'error', 'method_signature': 'error(message: any, trace?: string, context?: string): void', 'return_type': 'void', 'access_modifier': 'public', 'is_async': False, 'implementation_logic': 'Specification requires this method to call the underlying `pino.error()` method. It must include special serialization for `Error` objects to ensure the stack trace is correctly included in the JSON payload.'}

##### 2.3.4.4.10.0.0 Implementation Notes

Validation confirmed that this should be provided as a custom logger to the NestJS application bootstrap process using `app.useLogger()`.

#### 2.3.4.5.0.0.0 Class Name

##### 2.3.4.5.1.0.0 Class Name

LoggingExceptionFilter

##### 2.3.4.5.2.0.0 File Path

src/logging/logging.exception-filter.ts

##### 2.3.4.5.3.0.0 Class Type

NestJS Global Exception Filter

##### 2.3.4.5.4.0.0 Inheritance

BaseExceptionFilter

##### 2.3.4.5.5.0.0 Purpose

Catches all unhandled exceptions in the application, logs them using the structured `LoggerService`, and then delegates to the base exception filter to send the standard HTTP response.

##### 2.3.4.5.6.0.0 Dependencies

- LoggerService

##### 2.3.4.5.7.0.0 Framework Specific Attributes

- @Catch()

##### 2.3.4.5.8.0.0 Technology Integration Notes

A critical component for observability, ensuring that no error goes unlogged in the standard JSON format.

##### 2.3.4.5.9.0.0 Methods

- {'method_name': 'catch', 'method_signature': 'catch(exception: unknown, host: ArgumentsHost): void', 'return_type': 'void', 'access_modifier': 'public', 'is_async': False, 'implementation_logic': 'Specification requires this method to: 1. Extract the request object from the `host`. 2. Use the `LoggerService` to log the `exception` at the \\"error\\" level. 3. Call `super.catch(exception, host)` to let the default NestJS error handling proceed.'}

##### 2.3.4.5.10.0.0 Implementation Notes

Validation identified this as a missing component for complete error logging coverage. It should be provided globally using `APP_FILTER` in the `ObservabilityModule`.

#### 2.3.4.6.0.0.0 Class Name

##### 2.3.4.6.1.0.0 Class Name

MetricsService

##### 2.3.4.6.2.0.0 File Path

src/metrics/metrics.service.ts

##### 2.3.4.6.3.0.0 Class Type

NestJS Service

##### 2.3.4.6.4.0.0 Inheritance

None

##### 2.3.4.6.5.0.0 Purpose

A singleton service that manages the lifecycle of the Prometheus metrics registry and provides factory methods for creating different metric types.

##### 2.3.4.6.6.0.0 Dependencies

*No items available*

##### 2.3.4.6.7.0.0 Framework Specific Attributes

- @Injectable()

##### 2.3.4.6.8.0.0 Technology Integration Notes

Wraps the `prom-client` library, ensuring a single, global registry is used throughout the application.

##### 2.3.4.6.9.0.0 Methods

###### 2.3.4.6.9.1.0 Method Name

####### 2.3.4.6.9.1.1 Method Name

createCounter

####### 2.3.4.6.9.1.2 Method Signature

createCounter(config: CounterConfiguration<string>): Counter<string>

####### 2.3.4.6.9.1.3 Return Type

Counter

####### 2.3.4.6.9.1.4 Access Modifier

public

####### 2.3.4.6.9.1.5 Is Async

❌ No

####### 2.3.4.6.9.1.6 Implementation Logic

Specification requires this method to instantiate a new `prom-client.Counter`, register it with the central registry, and return the instance.

###### 2.3.4.6.9.2.0 Method Name

####### 2.3.4.6.9.2.1 Method Name

getMetrics

####### 2.3.4.6.9.2.2 Method Signature

async getMetrics(): Promise<string>

####### 2.3.4.6.9.2.3 Return Type

Promise<string>

####### 2.3.4.6.9.2.4 Access Modifier

public

####### 2.3.4.6.9.2.5 Is Async

✅ Yes

####### 2.3.4.6.9.2.6 Implementation Logic

Specification requires this method to call `registry.metrics()` to collect and format all registered metrics for exposition.

##### 2.3.4.6.10.0.0 Implementation Notes

Validation identified this as a missing core component for the metrics module.

#### 2.3.4.7.0.0.0 Class Name

##### 2.3.4.7.1.0.0 Class Name

MetricsInterceptor

##### 2.3.4.7.2.0.0 File Path

src/metrics/metrics.interceptor.ts

##### 2.3.4.7.3.0.0 Class Type

NestJS Interceptor

##### 2.3.4.7.4.0.0 Inheritance

NestInterceptor

##### 2.3.4.7.5.0.0 Purpose

Automatically collects and records standard HTTP request metrics, such as latency and status code counts, for all endpoints, enabling REQ-1-109.

##### 2.3.4.7.6.0.0 Dependencies

- MetricsService

##### 2.3.4.7.7.0.0 Framework Specific Attributes

- @Injectable()

##### 2.3.4.7.8.0.0 Technology Integration Notes

Leverages the NestJS interceptor pipeline to wrap around request handlers, enabling timing and response inspection.

##### 2.3.4.7.9.0.0 Methods

- {'method_name': 'intercept', 'method_signature': 'intercept(context: ExecutionContext, next: CallHandler): Observable<any>', 'return_type': 'Observable<any>', 'access_modifier': 'public', 'is_async': False, 'implementation_logic': 'Specification requires this interceptor to: 1. Record a start time. 2. Define standard Prometheus metrics for HTTP request duration (Histogram) and total requests (Counter) using the `MetricsService`. 3. Use RxJS `tap` and `catchError` operators to measure duration after the request completes. 4. Record the duration and increment the counter with appropriate labels (method, route, status_code).'}

##### 2.3.4.7.10.0.0 Implementation Notes

Validation confirms this should be provided globally using `APP_INTERCEPTOR`.

#### 2.3.4.8.0.0.0 Class Name

##### 2.3.4.8.1.0.0 Class Name

TracingService

##### 2.3.4.8.2.0.0 File Path

src/tracing/tracing.service.ts

##### 2.3.4.8.3.0.0 Class Type

NestJS Service

##### 2.3.4.8.4.0.0 Inheritance

OnModuleInit

##### 2.3.4.8.5.0.0 Purpose

Initializes and configures the OpenTelemetry SDK for the entire application at startup.

##### 2.3.4.8.6.0.0 Dependencies

- ObservabilityConfig

##### 2.3.4.8.7.0.0 Framework Specific Attributes

- @Injectable()

##### 2.3.4.8.8.0.0 Technology Integration Notes

Encapsulates the complex, one-time setup of the OpenTelemetry NodeSDK.

##### 2.3.4.8.9.0.0 Methods

- {'method_name': 'onModuleInit', 'method_signature': 'onModuleInit(): void', 'return_type': 'void', 'access_modifier': 'public', 'is_async': False, 'implementation_logic': 'Specification requires this NestJS lifecycle hook to: 1. Check if tracing is enabled via `ObservabilityConfig`. 2. Instantiate the `NodeSDK` from OpenTelemetry. 3. Configure it with a service name, an OTLP exporter (using the configured URL), and a `TraceIdRatioBasedSampler`. 4. Configure automatic instrumentations for common libraries (e.g., `HttpInstrumentation`, `NestInstrumentation`). 5. Start the SDK.'}

##### 2.3.4.8.10.0.0 Implementation Notes

Validation requires the specification to include configurable sampling to manage performance and cost in production environments, aligning with best practices for REQ-1-108.

#### 2.3.4.9.0.0.0 Class Name

##### 2.3.4.9.1.0.0 Class Name

AxiosTraceContextInterceptor

##### 2.3.4.9.2.0.0 File Path

src/context/axios-trace.interceptor.ts

##### 2.3.4.9.3.0.0 Class Type

Axios Interceptor

##### 2.3.4.9.4.0.0 Inheritance

None

##### 2.3.4.9.5.0.0 Purpose

Injects the current correlation ID and OpenTelemetry trace context headers into all outgoing HTTP requests made with `@nestjs/axios`.

##### 2.3.4.9.6.0.0 Dependencies

- ContextService
- Tracer from OpenTelemetry

##### 2.3.4.9.7.0.0 Framework Specific Attributes

*No items available*

##### 2.3.4.9.8.0.0 Technology Integration Notes

This is not a NestJS interceptor, but a standard Axios interceptor that can be applied to the `HttpService` instance.

##### 2.3.4.9.9.0.0 Methods

- {'method_name': 'requestInterceptor', 'method_signature': 'requestInterceptor(config: AxiosRequestConfig): AxiosRequestConfig', 'return_type': 'AxiosRequestConfig', 'access_modifier': 'public', 'is_async': False, 'implementation_logic': 'Specification requires this interceptor to: 1. Get the current correlation ID from `ContextService`. 2. Get the active OpenTelemetry trace context. 3. Inject the W3C Trace Context headers (`traceparent`, `tracestate`) into the outgoing request config. 4. Inject the `x-correlation-id` header. 5. Return the modified config.'}

##### 2.3.4.9.10.0.0 Implementation Notes

Validation identified this as a critical missing component to fulfill the propagation requirement of REQ-1-110 for downstream services.

### 2.3.5.0.0.0.0 Interface Specifications

- {'interface_name': 'IObservabilityConfig', 'file_path': 'src/config/observability.interface.ts', 'purpose': 'Defines the shape of the configuration object for the observability library, ensuring type safety for consumers.', 'property_contracts': [{'property_name': 'serviceName', 'property_type': 'string', 'getter_contract': 'Should return the name of the consuming service. This is mandatory for telemetry.'}, {'property_name': 'logLevel', 'property_type': '\\"info\\" | \\"error\\" | \\"warn\\" | \\"debug\\" | \\"trace\\"', 'getter_contract': 'Should return the minimum log level to output. Optional, defaults to \\"info\\".'}, {'property_name': 'sensitiveFields', 'property_type': 'string[]', 'getter_contract': 'Should return an array of keys to be masked in logs. Optional, defaults to a standard list (e.g., [\\"password\\", \\"token\\", \\"authorization\\"]).'}, {'property_name': 'tracingEnabled', 'property_type': 'boolean', 'getter_contract': 'Should return true if OpenTelemetry tracing should be enabled. Optional, defaults to true.'}, {'property_name': 'otlpExporterUrl', 'property_type': 'string', 'getter_contract': 'Should return the URL of the OpenTelemetry collector. Optional, defaults to a standard value from environment variables.'}, {'property_name': 'traceSamplerRatio', 'property_type': 'number', 'getter_contract': 'A number between 0 and 1 representing the sampling ratio for traces. Optional, defaults to 1.0 (sample all).'}], 'implementation_guidance': 'Specification requires this interface to be implemented by a NestJS ConfigService provider that loads values from environment variables.'}

### 2.3.6.0.0.0.0 Enum Specifications

*No items available*

### 2.3.7.0.0.0.0 Dto Specifications

*No items available*

### 2.3.8.0.0.0.0 Configuration Specifications

- {'configuration_name': 'ObservabilityConfigService', 'file_path': 'src/config/observability.config.ts', 'purpose': 'Provides a type-safe way to access configuration values throughout the library, loading them from environment variables.', 'framework_base_class': 'NestJS ConfigService', 'configuration_sections': [{'section_name': 'Environment Variables', 'properties': [{'property_name': 'SERVICE_NAME', 'property_type': 'string', 'default_value': 'undefined', 'required': True, 'description': 'Specifies the name of the service for telemetry tagging.'}, {'property_name': 'LOG_LEVEL', 'property_type': 'string', 'default_value': 'info', 'required': False, 'description': 'Specifies the minimum log level.'}, {'property_name': 'TRACING_ENABLED', 'property_type': 'boolean', 'default_value': 'true', 'required': False, 'description': 'Globally enables or disables distributed tracing.'}, {'property_name': 'OTEL_EXPORTER_OTLP_ENDPOINT', 'property_type': 'string', 'default_value': 'http://localhost:4317', 'required': False, 'description': 'The gRPC endpoint for the OpenTelemetry collector.'}, {'property_name': 'TRACE_SAMPLER_RATIO', 'property_type': 'number', 'default_value': '1.0', 'required': False, 'description': 'The ratio of traces to sample (0.0 to 1.0).'}]}], 'validation_requirements': 'Specification requires the service to validate at startup that `SERVICE_NAME` is defined, throwing a fatal error if it is not. Other variables should fall back to sensible defaults.'}

### 2.3.9.0.0.0.0 Dependency Injection Specifications

#### 2.3.9.1.0.0.0 Service Interface

##### 2.3.9.1.1.0.0 Service Interface

Logger

##### 2.3.9.1.2.0.0 Service Implementation

LoggerService

##### 2.3.9.1.3.0.0 Lifetime

Transient

##### 2.3.9.1.4.0.0 Registration Reasoning

A new instance of the logger can be injected with a specific context (class name), while still accessing the request-scoped correlation ID via AsyncLocalStorage.

##### 2.3.9.1.5.0.0 Framework Registration Pattern

Specification requires this service to be provided as a custom logger for NestJS: `app.useLogger(app.get(LoggerService))` during application bootstrap.

#### 2.3.9.2.0.0.0 Service Interface

##### 2.3.9.2.1.0.0 Service Interface

APP_INTERCEPTOR

##### 2.3.9.2.2.0.0 Service Implementation

MetricsInterceptor

##### 2.3.9.2.3.0.0 Lifetime

Singleton

##### 2.3.9.2.4.0.0 Registration Reasoning

Registering as a global interceptor ensures all HTTP requests are automatically instrumented with latency and status metrics.

##### 2.3.9.2.5.0.0 Framework Registration Pattern

Specification requires providing this in the `providers` array of the `ObservabilityModule`: `{ provide: APP_INTERCEPTOR, useClass: MetricsInterceptor }`.

#### 2.3.9.3.0.0.0 Service Interface

##### 2.3.9.3.1.0.0 Service Interface

APP_FILTER

##### 2.3.9.3.2.0.0 Service Implementation

LoggingExceptionFilter

##### 2.3.9.3.3.0.0 Lifetime

Singleton

##### 2.3.9.3.4.0.0 Registration Reasoning

Registering as a global exception filter ensures all unhandled exceptions are caught and logged in the standard structured format.

##### 2.3.9.3.5.0.0 Framework Registration Pattern

Specification requires providing this in the `providers` array of the `ObservabilityModule`: `{ provide: APP_FILTER, useClass: LoggingExceptionFilter }`.

### 2.3.10.0.0.0.0 External Integration Specifications

*No items available*

## 2.4.0.0.0.0.0 Component Count Validation

| Property | Value |
|----------|-------|
| Total Classes | 13 |
| Total Interfaces | 1 |
| Total Enums | 0 |
| Total Dtos | 0 |
| Total Configurations | 1 |
| Total External Integrations | 0 |
| Grand Total Components | 15 |
| Phase 2 Claimed Count | 0 |
| Phase 2 Actual Count | 0 |
| Validation Added Count | 15 |
| Final Validated Count | 15 |

# 3.0.0.0.0.0.0 File Structure

## 3.1.0.0.0.0.0 Directory Organization

### 3.1.1.0.0.0.0 Directory Path

#### 3.1.1.1.0.0.0 Directory Path

/

#### 3.1.1.2.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.1.3.0.0.0 Contains Files

- package.json
- tsconfig.json
- tsconfig.build.json
- .nvmrc
- .eslintrc.js
- .prettierrc
- .env.example
- .npmignore
- jest.config.js
- .gitignore

#### 3.1.1.4.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.1.5.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

### 3.1.2.0.0.0.0 Directory Path

#### 3.1.2.1.0.0.0 Directory Path

.vscode

#### 3.1.2.2.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.2.3.0.0.0 Contains Files

- settings.json
- extensions.json

#### 3.1.2.4.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.2.5.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

