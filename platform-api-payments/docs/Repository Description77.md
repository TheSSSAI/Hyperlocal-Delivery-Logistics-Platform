# 1 Id

REPO-BE-PAYMT

# 2 Name

platform-api-payments

# 3 Description

This microservice repository is responsible for all financial operations. Its scope is strictly controlled to handle payment processing via Razorpay, processing refunds, calculating platform commissions, and managing the weekly settlement and payout cycle for vendors and riders. By isolating all monetary transactions into this single service, we can tightly control its security, auditing, and compliance scope (especially for PCI-DSS). This is a critical, high-reliability service. Its dependencies have been updated to use the new granular shared libraries.

# 4 Type

🔹 Application Services

# 5 Namespace

Platform.Services.Payments

# 6 Output Path

services/payments

# 7 Framework

NestJS

# 8 Language

TypeScript

# 9 Technology

NestJS, PostgreSQL

# 10 Thirdparty Libraries

- razorpay

# 11 Layer Ids

- application-services

# 12 Dependencies

- REPO-LIB-CONTRACTS
- REPO-LIB-OBSERVABILITY

# 13 Requirements

## 13.1 Requirement Id

### 13.1.1 Requirement Id

REQ-1-082

## 13.2.0 Requirement Id

### 13.2.1 Requirement Id

REQ-1-090

# 14.0.0 Generate Tests

✅ Yes

# 15.0.0 Generate Documentation

✅ Yes

# 16.0.0 Architecture Style

Microservices

# 17.0.0 Architecture Map

- application-services

# 18.0.0 Components Map

- Payments & Settlements Service (Manages Payments, Refunds, Commissions, Payouts, Razorpay Integration)

# 19.0.0 Requirements Map

- REQ-1-082
- REQ-1-090
- REQ-1-083
- REQ-1-084
- REQ-1-085
- REQ-1-033

# 20.0.0 Decomposition Rationale

## 20.1.0 Operation Type

UNCHANGED

## 20.2.0 Source Repository

self

## 20.3.0 Decomposition Reasoning

Financial transactions form a distinct and highly sensitive bounded context. Isolating this service is a primary security and compliance measure. It limits the scope of PCI-DSS compliance to this service alone, reduces the attack surface for financial data, and allows for specialized development practices like immutable, double-entry bookkeeping (REQ-1-082).

## 20.4.0 Extracted Responsibilities

*No items available*

## 20.5.0 Reusability Scope

- Provides a centralized financial ledger and transaction engine for the platform.

## 20.6.0 Development Benefits

- A dedicated team can focus on financial accuracy, security, and compliance.
- Changes to payment providers or settlement logic are contained within this service.

# 21.0.0 Dependency Contracts

## 21.1.0 Repo-Be-Order

### 21.1.1 Required Interfaces

- {'interface': 'OrderDeliveredEvent', 'methods': [], 'events': ["Listens for 'order.delivered' to initiate commission calculation.", "Listens for 'order.cancelled' to initiate refunds."], 'properties': []}

### 21.1.2 Integration Pattern

Event-driven via SNS/SQS.

### 21.1.3 Communication Protocol

Async Messaging

# 22.0.0 Exposed Contracts

## 22.1.0 Public Interfaces

- {'interface': 'IPaymentService', 'methods': ['createPaymentIntent(amount: number, currency: string): Promise<PaymentIntentDTO>'], 'events': ["Publishes 'PaymentConfirmed' event.", "Publishes 'PayoutProcessed' event."], 'properties': [], 'consumers': ['REPO-API-GATEWAY']}

# 23.0.0 Integration Patterns

| Property | Value |
|----------|-------|
| Dependency Injection | Standard NestJS DI. |
| Event Communication | Consumes order lifecycle events to trigger financi... |
| Data Flow | Interacts heavily with the Razorpay API for paymen... |
| Error Handling | Implements the stateful payment reconciliation pro... |
| Async Patterns | Uses scheduled jobs (e.g., via pg_cron or a separa... |

# 24.0.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | Implement all database interactions within transac... |
| Performance Considerations | Payout process can be a long-running batch job and... |
| Security Considerations | This is the most security-sensitive service. Must ... |
| Testing Approach | Extensive testing with a mocked payment gateway AP... |

# 25.0.0 Scope Boundaries

## 25.1.0 Must Implement

- Payment processing integration.
- Refund logic.
- Commission calculation.
- Vendor and rider settlement and payout automation.
- Immutable financial ledger.

## 25.2.0 Must Not Implement

- Order state management.
- Product catalog or inventory.

## 25.3.0 Extension Points

- Support for multiple payment gateways.
- More complex commission structures.

## 25.4.0 Validation Rules

- Validate all incoming financial data for correctness.

