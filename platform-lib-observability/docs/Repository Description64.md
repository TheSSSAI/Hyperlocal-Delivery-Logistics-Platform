# 1 Id

REPO-LIB-OBSERVABILITY

# 2 Name

platform-lib-observability

# 3 Description

This new, decomposed library standardizes observability practices across all backend services. It was extracted from the monolithic 'platform-shared-libs' and provides a single, configurable implementation for structured logging, metrics collection, and distributed tracing. It wraps underlying technologies like OpenTelemetry and Prometheus clients (prom-client) to provide a simple, high-level API for developers. Its responsibility is to ensure that every log message is in a consistent JSON format, every service exposes standard system and business metrics, and that the 'correlationId' is automatically propagated and included in all telemetry, fulfilling critical non-functional requirements REQ-1-108 and REQ-1-110.

# 4 Type

🔹 Cross-Cutting Library

# 5 Namespace

Platform.Core.Observability

# 6 Output Path

libs/observability

# 7 Framework

NestJS

# 8 Language

TypeScript

# 9 Technology

OpenTelemetry, Prometheus, Pino.js

# 10 Thirdparty Libraries

- @opentelemetry/api
- prom-client
- pino

# 11 Layer Ids

- cross-cutting

# 12 Dependencies

- REPO-LIB-CONTRACTS

# 13 Requirements

## 13.1 Requirement Id

### 13.1.1 Requirement Id

REQ-1-108

## 13.2.0 Requirement Id

### 13.2.1 Requirement Id

REQ-1-109

## 13.3.0 Requirement Id

### 13.3.1 Requirement Id

REQ-1-110

# 14.0.0 Generate Tests

✅ Yes

# 15.0.0 Generate Documentation

✅ Yes

# 16.0.0 Architecture Style

Microservices

# 17.0.0 Architecture Map

- cross-cutting

# 18.0.0 Components Map

*No items available*

# 19.0.0 Requirements Map

- REQ-1-108
- REQ-1-109
- REQ-1-110

# 20.0.0 Decomposition Rationale

## 20.1.0 Operation Type

NEW_DECOMPOSED

## 20.2.0 Source Repository

REPO-LIB-SHRD

## 20.3.0 Decomposition Reasoning

Extracted to centralize and enforce a consistent observability strategy. This prevents each of the 7+ microservices from implementing their own logging, metrics, and tracing, which would lead to inconsistency and high maintenance overhead. As an independent library, the entire observability stack can be upgraded and rolled out to services incrementally.

## 20.4.0 Extracted Responsibilities

- Structured JSON logging configuration
- Prometheus metrics registration and exposition
- OpenTelemetry trace initialization and context propagation

## 20.5.0 Reusability Scope

- A mandatory dependency for all backend microservices.

## 20.6.0 Development Benefits

- Simplifies development by abstracting complex observability setup.
- Guarantees consistent telemetry data, which is essential for effective monitoring and debugging in production.

# 21.0.0 Dependency Contracts

*No data available*

# 22.0.0 Exposed Contracts

## 22.1.0 Public Interfaces

- {'interface': 'ILogger', 'methods': ['info(message: string, context: object)', 'error(message: string, error: Error, context: object)'], 'events': [], 'properties': [], 'consumers': ['REPO-BE-IDENT', 'REPO-BE-CATLG', 'REPO-BE-ORDER', 'REPO-BE-LOGIS', 'REPO-BE-PAYMT', 'REPO-BE-CHAT', 'REPO-BE-RATINGS', 'REPO-BE-SUPPORT', 'REPO-BE-NOTIF']}

# 23.0.0 Integration Patterns

| Property | Value |
|----------|-------|
| Dependency Injection | Provides a NestJS 'LoggerModule' that can be impor... |
| Event Communication | N/A |
| Data Flow | Intercepts incoming requests and messages to extra... |
| Error Handling | Provides a standardized way to log errors with sta... |
| Async Patterns | Integrates with async local storage for context pr... |

# 24.0.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | The library should expose a custom NestJS logger p... |
| Performance Considerations | Logging should be asynchronous to minimize impact ... |
| Security Considerations | Includes functionality to automatically mask sensi... |
| Testing Approach | Unit tests for log formatting and metric registrat... |

# 25.0.0 Scope Boundaries

## 25.1.0 Must Implement

- A logger that outputs structured JSON.
- Functions to create and increment Prometheus counters, gauges, and histograms.
- Middleware to manage the correlationId.

## 25.2.0 Must Not Implement

- Any specific business logic.

## 25.3.0 Extension Points

- Configurable log levels.
- Custom metric registration.

## 25.4.0 Validation Rules

*No items available*

