# 1 Id

REPO-BE-ORDER

# 2 Name

platform-api-orders

# 3 Description

This is the transactional core of the platform, a microservice whose sole responsibility is to manage the entire order lifecycle from start to finish. It handles cart management, order creation, and transitions the order through its various states (e.g., 'Pending', 'Accepted', 'In Transit', 'Delivered'). This service acts as the orchestrator for the order creation Saga, coordinating with other services like Payments and Vendor via events. Due to its critical, stateful nature, it must be highly available and resilient. Its dependencies have been updated to use the new granular shared libraries.

# 4 Type

🔹 Application Services

# 5 Namespace

Platform.Services.Orders

# 6 Output Path

services/orders

# 7 Framework

NestJS

# 8 Language

TypeScript

# 9 Technology

NestJS, PostgreSQL

# 10 Thirdparty Libraries

*No items available*

# 11 Layer Ids

- application-services

# 12 Dependencies

- REPO-LIB-CONTRACTS
- REPO-LIB-OBSERVABILITY

# 13 Requirements

## 13.1 Requirement Id

### 13.1.1 Requirement Id

REQ-1-077

## 13.2.0 Requirement Id

### 13.2.1 Requirement Id

REQ-1-105

# 14.0.0 Generate Tests

✅ Yes

# 15.0.0 Generate Documentation

✅ Yes

# 16.0.0 Architecture Style

Microservices

# 17.0.0 Architecture Map

- application-services

# 18.0.0 Components Map

- Order Management Service (Manages Order lifecycle, Cart, Cancellations, Saga Orchestration)

# 19.0.0 Requirements Map

- REQ-1-077
- REQ-1-105
- REQ-1-052
- REQ-1-056
- REQ-1-031
- REQ-1-032
- REQ-1-065

# 20.0.0 Decomposition Rationale

## 20.1.0 Operation Type

UNCHANGED

## 20.2.0 Source Repository

self

## 20.3.0 Decomposition Reasoning

This service represents the 'Order Management' bounded context, which is the central, transactional heart of the business. Isolating this complex, stateful logic into its own service is a critical architectural decision. It allows the data model and infrastructure to be optimized for transactional integrity (ACID properties) and high-throughput writes, separate from other services.

## 20.4.0 Extracted Responsibilities

*No items available*

## 20.5.0 Reusability Scope

- Serves as the single source of truth for all order states and histories.

## 20.6.0 Development Benefits

- Allows a team to focus on the most critical business workflow of the platform.
- Complex state machine logic is encapsulated and not spread across multiple services.

# 21.0.0 Dependency Contracts

## 21.1.0 Repo-Be-Paymt

### 21.1.1 Required Interfaces

- {'interface': 'PaymentConfirmedEvent', 'methods': [], 'events': ["Listens for 'payment.confirmed' to proceed with order placement."], 'properties': []}

### 21.1.2 Integration Pattern

Event-driven via SNS/SQS.

### 21.1.3 Communication Protocol

Async Messaging

# 22.0.0 Exposed Contracts

## 22.1.0 Public Interfaces

- {'interface': 'IOrderService', 'methods': ['createOrder(data: CreateOrderDTO): Promise<OrderDTO>', 'getOrderStatus(orderId: string): Promise<OrderStatusDTO>'], 'events': ["Publishes 'OrderPlaced', 'OrderCancelled', and other lifecycle events."], 'properties': [], 'consumers': ['REPO-API-GATEWAY']}

# 23.0.0 Integration Patterns

| Property | Value |
|----------|-------|
| Dependency Injection | Standard NestJS DI. |
| Event Communication | Heavy use of both publishing and consuming events ... |
| Data Flow | Manages the state machine for an order, updating i... |
| Error Handling | Implements compensating transactions for the Saga ... |
| Async Patterns | Core logic is fundamentally asynchronous and event... |

# 24.0.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | Implement the order state machine using a robust p... |
| Performance Considerations | Database transactions must be used to ensure atomi... |
| Security Considerations | Ensure a user can only access their own order data... |
| Testing Approach | End-to-end tests covering the entire order Saga, i... |

# 25.0.0 Scope Boundaries

## 25.1.0 Must Implement

- Cart management (add, remove, update).
- Order state machine as defined in REQ-1-077.
- Saga orchestration logic.
- Immutable order event log (REQ-1-077).

## 25.2.0 Must Not Implement

- Direct payment processing.
- Rider allocation.
- Product catalog management.

## 25.3.0 Extension Points

- Adding new states to the order lifecycle (e.g., 'Delayed').

## 25.4.0 Validation Rules

- Validate that an order can only transition to valid next states.

