# 1 Strategies

## 1.1 Retry

### 1.1.1 Type

🔹 Retry

### 1.1.2 Configuration

#### 1.1.2.1 Id

SynchronousApiRetry

#### 1.1.2.2 Description

Managed by AWS App Mesh for synchronous inter-service and external API calls. Applies to transient, idempotent operations.

#### 1.1.2.3 Implementation

AWS App Mesh Route Retry Policy

#### 1.1.2.4 Retry Attempts

3

#### 1.1.2.5 Retry Policy

##### 1.1.2.5.1 Per Try Timeout

2s

##### 1.1.2.5.2 Retry On

- server-error
- gateway-error

##### 1.1.2.5.3 Backoff Strategy

Exponential with Jitter

#### 1.1.2.6.0 Error Handling Rules

- ThirdPartyApiTransientError
- ServiceUnavailableError

## 1.2.0.0.0 Retry

### 1.2.1.0.0 Type

🔹 Retry

### 1.2.2.0.0 Configuration

#### 1.2.2.1.0 Id

AsynchronousConsumerRetry

#### 1.2.2.2.0 Description

Managed by AWS SQS for message consumers from background processing queues. Allows for recovery from temporary downstream failures.

#### 1.2.2.3.0 Implementation

AWS SQS Redrive Policy

#### 1.2.2.4.0 Retry Attempts

5

#### 1.2.2.5.0 Retry Policy

##### 1.2.2.5.1 Backoff Strategy

Exponential

##### 1.2.2.5.2 Visibility Timeout

Starts at 30s, increases with each attempt

#### 1.2.2.6.0 Final Action

Move to Dead-Letter Queue

#### 1.2.2.7.0 Error Handling Rules

- DatabaseTransientError
- UnhandledProcessingError

## 1.3.0.0.0 CircuitBreaker

### 1.3.1.0.0 Type

🔹 CircuitBreaker

### 1.3.2.0.0 Configuration

#### 1.3.2.1.0 Id

ExternalDependencyCircuitBreaker

#### 1.3.2.2.0 Description

Managed by AWS App Mesh to protect the system from failing critical third-party dependencies (Payment, Mapping). As per REQ-1-028.

#### 1.3.2.3.0 Implementation

AWS App Mesh Route Outlier Detection

#### 1.3.2.4.0 Failure Threshold Count

5

#### 1.3.2.5.0 Failure Threshold Type

Consecutive5xxErrors

#### 1.3.2.6.0 Reset Interval

60s

#### 1.3.2.7.0 Error Handling Rules

- PaymentGatewayUnavailable
- MappingServiceUnavailable

## 1.4.0.0.0 Fallback

### 1.4.1.0.0 Type

🔹 Fallback

### 1.4.2.0.0 Configuration

#### 1.4.2.1.0 Id

GracefulDegradationFallback

#### 1.4.2.2.0 Description

Provides a graceful failure mode when a critical dependency's circuit breaker is open. Prevents cascading failures and informs the user.

#### 1.4.2.3.0 Implementation

Application Logic (e.g., NestJS Interceptor)

#### 1.4.2.4.0 Fallback Response

Return a specific error code and message to the client (e.g., 503 Service Unavailable, 'Payment provider is currently offline. Please try again later.').

#### 1.4.2.5.0 Error Handling Rules

- PaymentGatewayUnavailable
- MappingServiceUnavailable

## 1.5.0.0.0 DeadLetter

### 1.5.1.0.0 Type

🔹 DeadLetter

### 1.5.2.0.0 Configuration

#### 1.5.2.1.0 Id

AsyncProcessingDLQ

#### 1.5.2.2.0 Description

Captures messages that fail processing after all retries in SQS, for manual investigation and reprocessing. Prevents message loss.

#### 1.5.2.3.0 Implementation

AWS SQS Dead-Letter Queue

#### 1.5.2.4.0 Dead Letter Queue

platform_main_dlq

#### 1.5.2.5.0 Error Handling Rules

- UnhandledProcessingError
- DataPoisonPill

# 2.0.0.0.0 Monitoring

## 2.1.0.0.0 Error Types

- ThirdPartyApiTransientError
- ThirdPartyApiPermanentError
- DatabaseTransientError
- ServiceUnavailableError
- RiderAllocationFailure
- UnhandledProcessingError

## 2.2.0.0.0 Alerting

Alerts are configured in Prometheus Alertmanager per REQ-1-109. Critical alerts (e.g., >5% ThirdPartyApiPermanentError rate for payments, sustained RiderAllocationFailure) trigger immediate PagerDuty notifications. High-severity warnings (e.g., SQS queue depth > 1000, P95 API latency > 200ms) trigger Slack notifications to the on-call channel. All logs include a `correlationId` for tracing as per REQ-1-110.

