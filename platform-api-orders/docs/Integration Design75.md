# 1 Integration Specifications

## 1.1 Extraction Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-api-orders |
| Extraction Timestamp | 2024-05-24T10:30:00Z |
| Mapping Validation Score | 100% |
| Context Completeness Score | 100% |
| Implementation Readiness Level | High |

## 1.2 Relevant Requirements

### 1.2.1 Requirement Id

#### 1.2.1.1 Requirement Id

REQ-1-077

#### 1.2.1.2 Requirement Text

The system shall manage the order lifecycle using a finite state machine with the following states: Payment Pending, Pending Vendor Acceptance, Accepted, Preparing, Ready for Pickup, In Transit, Delivered, Cancelled, and Allocation Failed. Every transition from one state to another must be recorded in an immutable event log associated with the order. Each log entry must include the timestamp, the new state, and the actor (e.g., customer, vendor, system) responsible for the change.

#### 1.2.1.3 Validation Criteria

- Verify the order passes through the correct states in the correct sequence.
- Inspect its event log and verify that every state transition is recorded with the correct timestamp and actor.

#### 1.2.1.4 Implementation Implications

- A state machine pattern must be implemented to manage and validate all state transitions.
- An append-only 'order_status_history' table must be created to store the immutable log for each order, ensuring auditability.
- All state-changing operations must be atomic, updating the order's current state and creating a new event log entry within a single database transaction.

#### 1.2.1.5 Extraction Reasoning

This requirement defines the absolute core responsibility of the platform-api-orders service. Its primary purpose, as stated in its description, is to manage the entire order lifecycle and its state transitions.

### 1.2.2.0 Requirement Id

#### 1.2.2.1 Requirement Id

REQ-1-105

#### 1.2.2.2 Requirement Text

Communication between microservices shall primarily be asynchronous using a message bus (AWS SQS/SNS) to ensure decoupling and resilience. For distributed transactions that span multiple services (e.g., order creation), the Saga pattern must be implemented to manage data consistency. Synchronous, direct API calls are permissible only for user-facing operations requiring an immediate response.

#### 1.2.2.3 Validation Criteria

- Verify that after initial placement, subsequent steps like notifying the vendor are handled via asynchronous messages.
- Inspect the implementation of the order creation process and confirm it follows the Saga pattern.

#### 1.2.2.4 Implementation Implications

- The service must act as the orchestrator for the order creation Saga.
- It must publish events (e.g., 'OrderPlaced') to a message bus (SNS/SQS) for other services to consume.
- It must consume events (e.g., 'PaymentConfirmed') to drive the order's state machine forward.
- Compensating transactions must be implemented to handle failures in the Saga (e.g., initiating a refund if an order fails post-payment).

#### 1.2.2.5 Extraction Reasoning

This architectural requirement dictates the primary communication and transaction management pattern for the service. The repository description explicitly states it acts as the 'orchestrator for the order creation Saga'.

### 1.2.3.0 Requirement Id

#### 1.2.3.1 Requirement Id

REQ-1-055

#### 1.2.3.2 Requirement Text

The system must perform a final, real-time inventory check for all items in the customer's cart at the exact moment they initiate payment. If any item has become out of stock since it was added to the cart, the payment process must be halted. The system shall then display a notification to the customer, informing them of the unavailable item(s) and prompting them to update their cart.

#### 1.2.3.3 Validation Criteria

- Customer A adds the last unit of an item to their cart.
- Customer B buys that last unit.
- Customer A proceeds to payment. Verify the payment is blocked.
- Verify Customer A is shown a message indicating the item is now out of stock and is prompted to remove it from the cart.

#### 1.2.3.4 Implementation Implications

- The order creation saga must begin with a synchronous, blocking API call to the Vendor & Catalog service to validate inventory.
- This call must be highly performant and resilient, requiring patterns like circuit breakers to prevent cascading failures.

#### 1.2.3.5 Extraction Reasoning

This requirement defines a critical synchronous dependency that this service has on the Vendor & Catalog service, which is a key part of its integration design.

### 1.2.4.0 Requirement Id

#### 1.2.4.1 Requirement Id

REQ-1-052

#### 1.2.4.2 Requirement Text

The system shall provide shopping cart functionality allowing customers to add items, remove items, and update the quantity of items in their cart. The cart display must always show an itemized breakdown including the subtotal, all applicable taxes, delivery fees, and the final, payable total amount.

#### 1.2.4.3 Validation Criteria

- Successfully add an item to the cart.
- Increase the quantity of the item in the cart and verify the totals update correctly.
- Remove the item from the cart.

#### 1.2.4.4 Implementation Implications

- The service must expose API endpoints for all cart CRUD operations (add, update, remove, view).
- Cart state must be persisted server-side, associated with a user's session or ID.
- The service is responsible for calculating totals based on cart contents, although it may need to fetch prices and rules from other services.

#### 1.2.4.5 Extraction Reasoning

The repository's scope explicitly lists 'Cart management' as a primary responsibility, making this requirement directly relevant.

## 1.3.0.0 Relevant Components

- {'component_name': 'Order Management Service', 'component_specification': "Acts as the transactional core of the platform. Its sole responsibility is to manage the entire order lifecycle, including cart management, order creation, state transitions, and orchestrating the order creation Saga. It is the single source of truth for an order's state.", 'implementation_requirements': ['Implement a finite state machine for order statuses as defined in REQ-1-077.', 'Orchestrate the order creation Saga as per REQ-1-105.', 'Provide and manage all cart-related APIs (add, remove, update, view).', 'Implement an immutable event log for every state change associated with an order.'], 'architectural_context': "This component resides in the 'Application Services' layer and represents the 'Order Management' bounded context from a Domain-Driven Design perspective.", 'extraction_reasoning': "This is the primary component mapped to the 'platform-api-orders' repository, encapsulating all of its core responsibilities as defined in the repository's description and decomposition rationale."}

## 1.4.0.0 Architectural Layers

- {'layer_name': 'Application Services', 'layer_responsibilities': 'This layer is the core of the backend system, composed of independently deployable services organized around business capabilities (Bounded Contexts). Services in this layer implement core business logic, own their data, and communicate asynchronously.', 'layer_constraints': ['Services should be loosely coupled and communicate via events.', "Each service must own and manage a specific subset of the application's data."], 'implementation_patterns': ['Microservices', 'Domain-Driven Design (DDD)', 'Event-Driven Architecture', 'Saga Pattern'], 'extraction_reasoning': "The 'platform-api-orders' repository is explicitly mapped to this layer, and its description as a transactional, stateful microservice aligns perfectly with the layer's responsibilities."}

## 1.5.0.0 Dependency Interfaces

### 1.5.1.0 Interface Name

#### 1.5.1.1 Interface Name

IInventoryServiceProvider

#### 1.5.1.2 Source Repository

REPO-BE-CATLG

#### 1.5.1.3 Method Contracts

- {'method_name': 'checkAvailability', 'method_signature': 'POST /internal/inventory/check (body: { items: [{ productId: string, quantity: number }] })', 'method_purpose': "To perform a final, real-time, and atomic availability check for all items in a customer's cart before initiating payment.", 'integration_context': 'Called synchronously at the beginning of the order creation Saga, as mandated by REQ-1-055.'}

#### 1.5.1.4 Integration Pattern

Synchronous Request/Response

#### 1.5.1.5 Communication Protocol

HTTPS/REST within the service mesh (e.g., AWS App Mesh). Must be wrapped in a circuit breaker for resilience.

#### 1.5.1.6 Extraction Reasoning

This is a critical, blocking dependency necessary for the order creation saga to prevent overselling. The synchronous nature is an exception to the async-first rule, permitted by REQ-1-105 for immediate user-facing operations.

### 1.5.2.0 Interface Name

#### 1.5.2.1 Interface Name

IPaymentEventsConsumer

#### 1.5.2.2 Source Repository

REPO-BE-PAYMT

#### 1.5.2.3 Method Contracts

##### 1.5.2.3.1 Method Name

###### 1.5.2.3.1.1 Method Name

onPaymentConfirmed

###### 1.5.2.3.1.2 Method Signature

Consumes PaymentConfirmedEvent from a message bus

###### 1.5.2.3.1.3 Method Purpose

To advance the order state from 'PaymentPending' to 'PendingVendorAcceptance' after a payment is successfully processed.

###### 1.5.2.3.1.4 Integration Context

This is a key step in the order creation Saga.

##### 1.5.2.3.2.0 Method Name

###### 1.5.2.3.2.1 Method Name

onPaymentFailed

###### 1.5.2.3.2.2 Method Signature

Consumes PaymentFailedEvent from a message bus

###### 1.5.2.3.2.3 Method Purpose

To trigger a compensating transaction by moving the order state to 'Cancelled' if a payment fails.

###### 1.5.2.3.2.4 Integration Context

This is a compensating step in the order creation Saga.

#### 1.5.2.4.0.0 Integration Pattern

Event-Driven Consumer (Subscriber)

#### 1.5.2.5.0.0 Communication Protocol

Asynchronous via AWS SNS/SQS. The Order service will have a dedicated SQS queue subscribed to the SNS topic where payment events are published.

#### 1.5.2.6.0.0 Extraction Reasoning

This is the primary dependency for the repository's role as a Saga orchestrator, allowing it to react to the outcome of the payment processing step as required by REQ-1-056 and REQ-1-105.

### 1.5.3.0.0.0 Interface Name

#### 1.5.3.1.0.0 Interface Name

ISharedContracts

#### 1.5.3.2.0.0 Source Repository

REPO-LIB-CONTRACTS

#### 1.5.3.3.0.0 Method Contracts

*No items available*

#### 1.5.3.4.0.0 Integration Pattern

Library Consumption (NPM Package)

#### 1.5.3.5.0.0 Communication Protocol

N/A (Compile-time dependency)

#### 1.5.3.6.0.0 Extraction Reasoning

This service must depend on the shared contracts library to ensure all DTOs for its APIs and all payloads for the events it produces and consumes are strongly-typed and consistent with the rest of the system.

### 1.5.4.0.0.0 Interface Name

#### 1.5.4.1.0.0 Interface Name

IObservabilityProvider

#### 1.5.4.2.0.0 Source Repository

REPO-LIB-OBSERVABILITY

#### 1.5.4.3.0.0 Method Contracts

*No items available*

#### 1.5.4.4.0.0 Integration Pattern

Library Consumption (NPM Package)

#### 1.5.4.5.0.0 Communication Protocol

N/A (Compile-time dependency)

#### 1.5.4.6.0.0 Extraction Reasoning

As a core backend service, it must integrate the shared observability library to provide standardized structured logging, metrics, and distributed tracing as mandated by REQ-1-108 and REQ-1-110.

## 1.6.0.0.0.0 Exposed Interfaces

### 1.6.1.0.0.0 Interface Name

#### 1.6.1.1.0.0 Interface Name

IOrderApi

#### 1.6.1.2.0.0 Consumer Repositories

- REPO-API-GATEWAY

#### 1.6.1.3.0.0 Method Contracts

##### 1.6.1.3.1.0 Method Name

###### 1.6.1.3.1.1 Method Name

createOrder

###### 1.6.1.3.1.2 Method Signature

POST /api/v1/orders

###### 1.6.1.3.1.3 Method Purpose

Initiates the order creation process. This is the primary entry point for a customer placing an order via the API Gateway. It begins the order creation Saga.

###### 1.6.1.3.1.4 Implementation Requirements

This method will perform initial validation, orchestrate the synchronous inventory check, and then publish an event to the Payments service to start the payment flow.

##### 1.6.1.3.2.0 Method Name

###### 1.6.1.3.2.1 Method Name

getOrderById

###### 1.6.1.3.2.2 Method Signature

GET /api/v1/orders/{id}

###### 1.6.1.3.2.3 Method Purpose

Allows clients (customers, admins) to query the current status and history of a specific order.

###### 1.6.1.3.2.4 Implementation Requirements

The implementation must include an authorization check to ensure the requesting user is the owner of the order or an administrator.

##### 1.6.1.3.3.0 Method Name

###### 1.6.1.3.3.1 Method Name

cancelOrder

###### 1.6.1.3.3.2 Method Signature

PATCH /api/v1/orders/{id}/cancel

###### 1.6.1.3.3.3 Method Purpose

Allows an authorized user (customer, vendor, admin) to cancel an order.

###### 1.6.1.3.3.4 Implementation Requirements

Must validate that the cancellation is allowed from the current order state and then trigger the cancellation workflow, including publishing an OrderCancelledEvent.

##### 1.6.1.3.4.0 Method Name

###### 1.6.1.3.4.1 Method Name

getCart

###### 1.6.1.3.4.2 Method Signature

GET /api/v1/cart

###### 1.6.1.3.4.3 Method Purpose

Retrieves the current user's shopping cart.

###### 1.6.1.3.4.4 Implementation Requirements

Must be authorized for the current user's session.

##### 1.6.1.3.5.0 Method Name

###### 1.6.1.3.5.1 Method Name

updateCartItem

###### 1.6.1.3.5.2 Method Signature

PATCH /api/v1/cart/items/{itemId}

###### 1.6.1.3.5.3 Method Purpose

Updates the quantity of an item in the cart.

###### 1.6.1.3.5.4 Implementation Requirements

Must perform stock validation before updating the quantity.

#### 1.6.1.4.0.0 Service Level Requirements

- P95 latency for all synchronous API calls must be under 200ms.
- The service must be highly available with a 99.95% uptime SLA due to its transactional nature.

#### 1.6.1.5.0.0 Implementation Constraints

- API endpoints must be stateless and adhere to RESTful principles.
- Authorization must be enforced on all endpoints to ensure data isolation.

#### 1.6.1.6.0.0 Extraction Reasoning

This interface represents the synchronous contract this service provides to the outside world via the API Gateway, enabling core functionalities like cart management and order placement for the frontend applications.

### 1.6.2.0.0.0 Interface Name

#### 1.6.2.1.0.0 Interface Name

IOrderEventsPublisher

#### 1.6.2.2.0.0 Consumer Repositories

- REPO-BE-LOGIS
- REPO-BE-PAYMT
- REPO-BE-NOTIF
- REPO-BE-CATLG
- REPO-BE-CHAT
- REPO-BE-RATINGS

#### 1.6.2.3.0.0 Method Contracts

##### 1.6.2.3.1.0 Method Name

###### 1.6.2.3.1.1 Method Name

OrderPlacedEvent

###### 1.6.2.3.1.2 Method Signature

Event payload containing orderId, customerId, vendorId, items, etc.

###### 1.6.2.3.1.3 Method Purpose

Notifies the system that a new order has been successfully created and paid for, and is ready for vendor acceptance.

###### 1.6.2.3.1.4 Implementation Requirements

Consumed by Notifications, Chat, and other services.

##### 1.6.2.3.2.0 Method Name

###### 1.6.2.3.2.1 Method Name

OrderReadyForPickupEvent

###### 1.6.2.3.2.2 Method Signature

Event payload containing orderId, vendorLocation, customerLocation, etc.

###### 1.6.2.3.2.3 Method Purpose

Triggers the rider allocation process in the Logistics service.

###### 1.6.2.3.2.4 Implementation Requirements

Consumed by REPO-BE-LOGIS as per REQ-1-078.

##### 1.6.2.3.3.0 Method Name

###### 1.6.2.3.3.1 Method Name

OrderCancelledEvent

###### 1.6.2.3.3.2 Method Signature

Event payload containing orderId, items, paymentDetails, reason, etc.

###### 1.6.2.3.3.3 Method Purpose

Notifies the system that an order has been cancelled, triggering refunds and stock replenishment.

###### 1.6.2.3.3.4 Implementation Requirements

Consumed by REPO-BE-PAYMT for refunds and REPO-BE-CATLG to revert stock.

##### 1.6.2.3.4.0 Method Name

###### 1.6.2.3.4.1 Method Name

OrderDeliveredEvent

###### 1.6.2.3.4.2 Method Signature

Event payload containing orderId, customerId, vendorId, riderId, etc.

###### 1.6.2.3.4.3 Method Purpose

Signals the successful completion of an order, triggering commission calculations and enabling ratings.

###### 1.6.2.3.4.4 Implementation Requirements

Consumed by REPO-BE-PAYMT for commissions and REPO-BE-RATINGS to enable feedback.

#### 1.6.2.4.0.0 Service Level Requirements

- Events must be published with guaranteed at-least-once delivery.

#### 1.6.2.5.0.0 Implementation Constraints

- The service must use the Transactional Outbox pattern to ensure that an event is published if and only if the corresponding database transaction for the state change commits successfully. This prevents data inconsistencies.
- All event payloads must conform to the schemas defined in the REPO-LIB-CONTRACTS library.

#### 1.6.2.6.0.0 Extraction Reasoning

This is the primary exposed interface for this service within the microservices ecosystem. It defines the events that drive workflows in all other downstream services, fulfilling its role as a central orchestrator as per REQ-1-105.

## 1.7.0.0.0.0 Technology Context

### 1.7.1.0.0.0 Framework Requirements

The service must be implemented using NestJS on Node.js v18.18+ and use PostgreSQL v15.4+ for its database. Standard NestJS dependency injection patterns must be followed.

### 1.7.2.0.0.0 Integration Technologies

- AWS SQS/SNS for asynchronous, event-driven communication (both consuming and publishing events).
- PostgreSQL with transactional support to ensure atomicity of state changes and event log entries.
- TypeORM as the ORM for database interaction.
- A NestJS HTTP client (@nestjs/axios) for synchronous internal API calls, wrapped with a circuit breaker.

### 1.7.3.0.0.0 Performance Constraints

Database queries must be highly optimized, especially for writing to the immutable event log and updating order states. The use of database transactions is mandatory for all state-changing operations to ensure data integrity.

### 1.7.4.0.0.0 Security Requirements

API endpoints must be secured with RBAC, ensuring that a user can only access their own order data. The service must never handle direct payment credentials.

## 1.8.0.0.0.0 Extraction Validation

| Property | Value |
|----------|-------|
| Mapping Completeness Check | The repository's mapped requirements, component, a... |
| Cross Reference Validation | The requirements for a state machine (REQ-1-077) a... |
| Implementation Readiness Assessment | Readiness is high. The context provides clear and ... |
| Quality Assurance Confirmation | The extracted context has been systematically vali... |

