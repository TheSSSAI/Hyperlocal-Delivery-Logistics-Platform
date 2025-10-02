# 1 Id

REPO-BE-NOTIF

# 2 Name

platform-api-notifications

# 3 Description

This is a lightweight, focused microservice with the single responsibility of sending all user-facing notifications. It listens to business events from across the platform (e.g., 'OrderAccepted', 'RiderAssigned', 'PayoutFailed') and translates them into the appropriate push notifications (via FCM) or SMS messages (via AWS SNS). By centralizing this functionality, we decouple all other services from the specific details of notification providers. This service is designed to be simple, stateless, and highly reliable. Its dependencies have been updated to use the new granular shared libraries.

# 4 Type

🔹 Application Services

# 5 Namespace

Platform.Services.Notifications

# 6 Output Path

services/notifications

# 7 Framework

NestJS

# 8 Language

TypeScript

# 9 Technology

NestJS, AWS SNS, Firebase Admin SDK

# 10 Thirdparty Libraries

- firebase-admin

# 11 Layer Ids

- application-services

# 12 Dependencies

- REPO-LIB-CONTRACTS
- REPO-LIB-OBSERVABILITY

# 13 Requirements

## 13.1 Requirement Id

### 13.1.1 Requirement Id

REQ-1-090

## 13.2.0 Requirement Id

### 13.2.1 Requirement Id

REQ-1-073

# 14.0.0 Generate Tests

✅ Yes

# 15.0.0 Generate Documentation

✅ Yes

# 16.0.0 Architecture Style

Microservices

# 17.0.0 Architecture Map

- application-services

# 18.0.0 Components Map

- Notifications Service (Manages Push Notifications via FCM and SMS via AWS SNS)

# 19.0.0 Requirements Map

- REQ-1-090
- REQ-1-073
- REQ-1-026
- REQ-1-046

# 20.0.0 Decomposition Rationale

## 20.1.0 Operation Type

UNCHANGED

## 20.2.0 Source Repository

self

## 20.3.0 Decomposition Reasoning

This service follows the single responsibility principle perfectly. It acts as an anti-corruption layer for external notification systems. If the platform decides to switch from FCM to another push provider, only this single, small service needs to be changed, leaving all other business logic services untouched. It is a classic example of a focused, event-driven utility microservice.

## 20.4.0 Extracted Responsibilities

*No items available*

## 20.5.0 Reusability Scope

- Provides notification capabilities for the entire platform.

## 20.6.0 Development Benefits

- Very simple service to develop and maintain.
- Centralizes management of notification templates and provider integrations.

# 21.0.0 Dependency Contracts

## 21.1.0 Repo-Be-Order

### 21.1.1 Required Interfaces

- {'interface': 'OrderLifecycleEvent', 'methods': [], 'events': ['Listens for all major order status change events to notify customers.'], 'properties': []}

### 21.1.2 Integration Pattern

Event-driven via SNS/SQS.

### 21.1.3 Communication Protocol

Async Messaging

# 22.0.0 Exposed Contracts

## 22.1.0 Public Interfaces

*No items available*

# 23.0.0 Integration Patterns

| Property | Value |
|----------|-------|
| Dependency Injection | Standard NestJS DI. |
| Event Communication | Purely an event consumer. Subscribes to dozens of ... |
| Data Flow | Consumes an event, fetches any additional required... |
| Error Handling | Implements retries for sending notifications. Hand... |
| Async Patterns | Entirely asynchronous. |

# 24.0.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | Use a job queue internally if notification templat... |
| Performance Considerations | Should be able to handle a high throughput of even... |
| Security Considerations | API keys for FCM and AWS SNS must be stored secure... |
| Testing Approach | Integration tests with mocked external notificatio... |

# 25.0.0 Scope Boundaries

## 25.1.0 Must Implement

- Sending push notifications to mobile clients.
- Sending transactional SMS (e.g., OTPs).

## 25.2.0 Must Not Implement

- Any business logic that decides *when* a notification should be sent. It only decides *how* to send it.

## 25.3.0 Extension Points

- Adding new notification channels like email or WhatsApp.

## 25.4.0 Validation Rules

*No items available*

