# 1 Integration Specifications

## 1.1 Extraction Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-api-chat |
| Extraction Timestamp | 2024-05-24T10:00:00Z |
| Mapping Validation Score | 100% |
| Context Completeness Score | 100% |
| Implementation Readiness Level | High |

## 1.2 Relevant Requirements

### 1.2.1 Requirement Id

#### 1.2.1.1 Requirement Id

REQ-1-081

#### 1.2.1.2 Requirement Text

The system shall provide two communication channels. First, an in-app chat for active orders, enabling communication between the customer and the vendor, and between the customer and the assigned rider. This chat must support predefined quick-reply templates. Second, a helpdesk module where any user (Customer, Vendor, Rider) can create a support ticket. Administrators must have an interface to view, manage, and respond to these tickets.

#### 1.2.1.3 Validation Criteria

- For an active order, verify the customer can send a message to the vendor and the rider.
- Verify the chat interface shows quick-reply buttons (e.g., 'I'm on my way').

#### 1.2.1.4 Implementation Implications

- This repository is responsible for the 'in-app chat for active orders' portion of the requirement.
- A WebSocket-based service is required to handle real-time, bi-directional communication.
- The service must expose an interface for clients (Customer, Vendor, Rider) to connect and exchange messages.
- A REST API must be provided to fetch context-specific quick-reply templates.

#### 1.2.1.5 Extraction Reasoning

This is a core functional requirement that defines the primary purpose of the 'platform-api-chat' service. The service was specifically decomposed to handle this real-time communication responsibility.

### 1.2.2.0 Requirement Id

#### 1.2.2.1 Requirement Id

REQ-1-015

#### 1.2.2.2 Requirement Text

The system's chat functionality shall enforce role-based permissions. Customers, Vendors, and Riders can only create and read messages within the context of an active order they are directly involved in. Once an order is completed, the associated chat history must become read-only for all parties. Administrators shall have read-only access to all chat logs for all orders.

#### 1.2.2.3 Validation Criteria

- Verify that a customer can only chat with the vendor and rider of their active order.
- Verify that after an order is marked 'Delivered' or 'Cancelled', the chat input is disabled for all parties.
- Verify a user cannot access the chat logs of an order they are not a party to.

#### 1.2.2.4 Implementation Implications

- The WebSocket gateway must perform authentication (via JWT) and authorization for every connection attempt.
- Authorization logic must check if the authenticated user is a participant in the requested order's chat room.
- The service must listen for order completion events (e.g., 'order.delivered', 'order.cancelled') to transition chat rooms to a read-only state.
- A separate REST API must be exposed for administrators to view chat logs.

#### 1.2.2.5 Extraction Reasoning

This requirement dictates the security and state management model for the chat service, forming a critical part of its business logic. The decomposition rationale explicitly lists this as a key responsibility.

### 1.2.3.0 Requirement Id

#### 1.2.3.1 Requirement Id

REQ-1-095

#### 1.2.3.2 Requirement Text

The system shall enforce a data retention policy as follows: ... 3) POD photos and chat logs must be permanently deleted 90 days after order completion.

#### 1.2.3.3 Validation Criteria

- Verify that a scheduled job exists to delete POD photos and chat logs older than 90 days.

#### 1.2.3.4 Implementation Implications

- This service must implement a scheduled, automated job (e.g., a Kubernetes CronJob) to delete chat messages from its database that are older than 90 days, based on the order completion timestamp.
- The service must listen for order completion events to know when to start the 90-day retention timer for a given order's chat logs.

#### 1.2.3.5 Extraction Reasoning

This non-functional requirement defines a specific data lifecycle management responsibility for the chat data owned by this service.

## 1.3.0.0 Relevant Components

- {'component_name': 'Chat Service', 'component_specification': 'A dedicated microservice responsible for all real-time chat functionalities. It manages WebSocket connections, authenticates and authorizes users to order-specific chat rooms, persists message history, and broadcasts messages to room participants. It manages the lifecycle of chat rooms based on order status events.', 'implementation_requirements': ['Implement a NestJS WebSocket Gateway to handle client connections.', 'Use a Redis adapter for the WebSocket gateway to enable horizontal scaling as per REQ-1-100.', "Persist chat messages to a PostgreSQL database using the 'ChatMessage' schema.", 'Implement event listeners for order status updates from the Order Management service.', 'Enforce ownership-based authorization for all chat interactions.'], 'architectural_context': "This component resides in the 'Application Services' layer and is a result of decomposing the original 'Ratings & Communication Service' to isolate stateful, real-time functionality.", 'extraction_reasoning': "The repository 'platform-api-chat' is the direct implementation of this newly decomposed component, which is responsible for fulfilling all chat-related requirements."}

## 1.4.0.0 Architectural Layers

- {'layer_name': 'Application Services Layer', 'layer_responsibilities': "Implements the core business logic and workflows of the platform. Owns and manages a specific subset of the application's data. Exposes APIs for consumption by the API Gateway or other services. Communicates with other services asynchronously via the Messaging Layer.", 'layer_constraints': ['Services must be independently deployable.', 'Communication should be primarily asynchronous to promote loose coupling.'], 'implementation_patterns': ['Microservices', 'Domain-Driven Design (DDD)', 'Event-Driven Architecture'], 'extraction_reasoning': "The 'platform-api-chat' repository is explicitly defined as a microservice within this layer, adhering to its responsibilities of managing a specific business capability (chat) and integrating with other services via events."}

## 1.5.0.0 Dependency Interfaces

### 1.5.1.0 Interface Name

#### 1.5.1.1 Interface Name

IOrderEventsConsumer

#### 1.5.1.2 Source Repository

platform-api-orders

#### 1.5.1.3 Method Contracts

##### 1.5.1.3.1 Method Name

###### 1.5.1.3.1.1 Method Name

onOrderAccepted

###### 1.5.1.3.1.2 Method Signature

handleEvent(payload: OrderAcceptedEvent)

###### 1.5.1.3.1.3 Method Purpose

Listens for 'order.accepted' event to create a new, active chat room for the specified order, adding the customer and vendor as initial participants.

###### 1.5.1.3.1.4 Integration Context

Triggered when a vendor accepts a new order.

##### 1.5.1.3.2.0 Method Name

###### 1.5.1.3.2.1 Method Name

onRiderAssigned

###### 1.5.1.3.2.2 Method Signature

handleEvent(payload: RiderAssignedEvent)

###### 1.5.1.3.2.3 Method Purpose

Listens for 'order.rider_assigned' event to add the assigned rider to the existing chat room for the specified order.

###### 1.5.1.3.2.4 Integration Context

Triggered when a rider is assigned to an order that is ready for pickup.

##### 1.5.1.3.3.0 Method Name

###### 1.5.1.3.3.1 Method Name

onOrderFinalized

###### 1.5.1.3.3.2 Method Signature

handleEvent(payload: OrderFinalizedEvent)

###### 1.5.1.3.3.3 Method Purpose

Listens for 'order.delivered' or 'order.cancelled' events to transition the corresponding chat room to a read-only state, preventing further messages.

###### 1.5.1.3.3.4 Integration Context

Triggered when an order reaches a terminal state.

#### 1.5.1.4.0.0 Integration Pattern

Event-Driven (Choreography)

#### 1.5.1.5.0.0 Communication Protocol

Asynchronous messaging via AWS SNS/SQS. The service subscribes to an SNS topic where order events are published.

#### 1.5.1.6.0.0 Extraction Reasoning

The chat service's core lifecycle management for chat rooms is entirely dependent on state change events published by the Order Management service. This defines the primary backend dependency contract.

### 1.5.2.0.0.0 Interface Name

#### 1.5.2.1.0.0 Interface Name

IOrderParticipantAPI

#### 1.5.2.2.0.0 Source Repository

platform-api-orders

#### 1.5.2.3.0.0 Method Contracts

- {'method_name': 'getParticipants', 'method_signature': 'GET /internal/orders/{orderId}/participants -> { customerId: string, vendorId: string, riderId: string | null }', 'method_purpose': 'To fetch the list of authorized participants for a given order to perform authorization checks during WebSocket connection.', 'integration_context': "Called synchronously by the Chat service's authorization guard when a new client attempts to connect to a chat room."}

#### 1.5.2.4.0.0 Integration Pattern

Synchronous Request/Response

#### 1.5.2.5.0.0 Communication Protocol

HTTPS/REST via the internal service mesh (AWS App Mesh).

#### 1.5.2.6.0.0 Extraction Reasoning

A synchronous check is required to authorize a user's access to a specific chat room upon connection. The Order Management service is the source of truth for order participants. This call must be wrapped in a circuit breaker as per REQ-1-028.

### 1.5.3.0.0.0 Interface Name

#### 1.5.3.1.0.0 Interface Name

IPlatformContracts

#### 1.5.3.2.0.0 Source Repository

platform-lib-contracts

#### 1.5.3.3.0.0 Method Contracts

*No items available*

#### 1.5.3.4.0.0 Integration Pattern

Library Consumption (NPM Package)

#### 1.5.3.5.0.0 Communication Protocol

N/A (Compile-time dependency)

#### 1.5.3.6.0.0 Extraction Reasoning

This repository must consume shared TypeScript types for all event payloads and DTOs from the central contracts library to ensure type safety and consistency across the microservices ecosystem, as per the architecture.

### 1.5.4.0.0.0 Interface Name

#### 1.5.4.1.0.0 Interface Name

IObservability

#### 1.5.4.2.0.0 Source Repository

platform-lib-observability

#### 1.5.4.3.0.0 Method Contracts

*No items available*

#### 1.5.4.4.0.0 Integration Pattern

Library Consumption (NPM Package)

#### 1.5.4.5.0.0 Communication Protocol

N/A (Compile-time dependency)

#### 1.5.4.6.0.0 Extraction Reasoning

This repository must use the shared observability library to implement standardized structured logging, metrics, and distributed tracing, fulfilling requirements REQ-1-108 and REQ-1-110.

## 1.6.0.0.0.0 Exposed Interfaces

### 1.6.1.0.0.0 Interface Name

#### 1.6.1.1.0.0 Interface Name

IChatGateway

#### 1.6.1.2.0.0 Consumer Repositories

- platform-mobile-customer
- platform-mobile-rider
- platform-web-vendor

#### 1.6.1.3.0.0 Method Contracts

##### 1.6.1.3.1.0 Method Name

###### 1.6.1.3.1.1 Method Name

handleConnection

###### 1.6.1.3.1.2 Method Signature

handleConnection(client: Socket)

###### 1.6.1.3.1.3 Method Purpose

Authenticates a new WebSocket connection using the client's JWT and authorizes them for a specific order's chat room based on a query parameter (e.g., ?orderId=...).

###### 1.6.1.3.1.4 Implementation Requirements

Must validate the JWT and check if the user is a valid participant (customer, vendor, or assigned rider) for the given order before allowing the connection to join the room.

##### 1.6.1.3.2.0 Method Name

###### 1.6.1.3.2.1 Method Name

handleSendMessage

###### 1.6.1.3.2.2 Method Signature

handleMessage(client: Socket, payload: { orderId: string, messageText: string })

###### 1.6.1.3.2.3 Method Purpose

Receives an incoming 'sendMessage' event from a client, persists the message, and broadcasts it to all other participants in the same chat room.

###### 1.6.1.3.2.4 Implementation Requirements

Must re-authorize the sender against the room, check if the room is read-only, persist the message to PostgreSQL, and then broadcast the 'newMessage' event to other clients in the room via the Redis adapter.

##### 1.6.1.3.3.0 Method Name

###### 1.6.1.3.3.1 Method Name

emitNewMessage

###### 1.6.1.3.3.2 Method Signature

emit(payload: { senderId: string, messageText: string, createdAt: ISODate })

###### 1.6.1.3.3.3 Method Purpose

Broadcasts a 'newMessage' event to all connected clients in a specific order's chat room.

###### 1.6.1.3.3.4 Implementation Requirements

This is an outbound event triggered after a message is successfully persisted. The payload should be structured for easy rendering on client UIs.

#### 1.6.1.4.0.0 Service Level Requirements

- P95 message delivery latency (sender client to receiver client) must be under 2 seconds.
- Must support a high number of concurrent, persistent connections, scaling horizontally as per REQ-1-100.

#### 1.6.1.5.0.0 Implementation Constraints

- Communication must use Secure WebSockets (WSS) as per REQ-1-092.
- A Redis adapter is required for the NestJS gateway to enable multi-instance broadcasting.

#### 1.6.1.6.0.0 Extraction Reasoning

This WebSocket interface is the primary public contract of the platform-api-chat service, defining how all frontend clients interact with it to provide the real-time chat feature.

### 1.6.2.0.0.0 Interface Name

#### 1.6.2.1.0.0 Interface Name

IAdminChatAPI

#### 1.6.2.2.0.0 Consumer Repositories

- platform-web-admin

#### 1.6.2.3.0.0 Method Contracts

- {'method_name': 'getChatLogsForOrder', 'method_signature': 'GET /api/v1/admin/orders/{orderId}/chatlogs -> ChatMessageDto[]', 'method_purpose': 'Provides read-only access to the complete chat history for a specific order, for support and moderation purposes.', 'implementation_requirements': "This endpoint must be protected by an RBAC guard, allowing access only to users with the 'Administrator' role."}

#### 1.6.2.4.0.0 Service Level Requirements

- P95 latency must be under 500ms.

#### 1.6.2.5.0.0 Implementation Constraints

*No items available*

#### 1.6.2.6.0.0 Extraction Reasoning

This REST API fulfills the specific requirement in REQ-1-015 for administrators to have read-only access to all chat logs.

### 1.6.3.0.0.0 Interface Name

#### 1.6.3.1.0.0 Interface Name

IQuickReplyAPI

#### 1.6.3.2.0.0 Consumer Repositories

- platform-mobile-customer
- platform-mobile-rider
- platform-web-vendor

#### 1.6.3.3.0.0 Method Contracts

- {'method_name': 'getQuickReplyTemplates', 'method_signature': 'GET /api/v1/chat/templates?context={context} -> QuickReplyTemplateDto[]', 'method_purpose': "Fetches a list of predefined quick-reply message templates based on the communication context (e.g., 'customer-to-rider').", 'implementation_requirements': 'The endpoint must be authenticated. The list of templates should be managed via a configuration or a simple database table.'}

#### 1.6.3.4.0.0 Service Level Requirements

- P95 latency must be under 200ms.

#### 1.6.3.5.0.0 Implementation Constraints

*No items available*

#### 1.6.3.6.0.0 Extraction Reasoning

This REST API fulfills the requirement in REQ-1-081 for the system to support predefined quick-reply templates in the chat interface.

## 1.7.0.0.0.0 Technology Context

### 1.7.1.0.0.0 Framework Requirements

The service must be built using NestJS v10+ with TypeScript, leveraging the @nestjs/websockets package for the gateway implementation.

### 1.7.2.0.0.0 Integration Technologies

- PostgreSQL: For persisting chat history, using the 'ChatMessage' schema.
- Redis (ElastiCache): As a high-performance backplane for the WebSocket gateway to enable horizontal scaling via its Pub/Sub capabilities.
- AWS SNS/SQS: For consuming events from other microservices like the Order Management service.

### 1.7.3.0.0.0 Performance Constraints

The service must be optimized for low-latency message delivery and a high number of concurrent, long-lived WebSocket connections.

### 1.7.4.0.0.0 Security Requirements

All WebSocket connections must be authenticated via JWT during the handshake. All subsequent actions must be authorized to ensure users only access chat rooms for orders they are a party to. Input sanitization must be performed on message content to prevent XSS.

## 1.8.0.0.0.0 Extraction Validation

| Property | Value |
|----------|-------|
| Mapping Completeness Check | The repository's mappings to requirements REQ-1-08... |
| Cross Reference Validation | Mappings are strongly validated across multiple co... |
| Implementation Readiness Assessment | The implementation readiness is HIGH. The combinat... |
| Quality Assurance Confirmation | The extracted context is internally consistent and... |

