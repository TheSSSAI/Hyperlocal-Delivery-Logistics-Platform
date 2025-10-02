# 1 Design

code_design

# 2 Code Specfication

## 2.1 Validation Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-api-chat |
| Validation Timestamp | 2025-01-24T18:00:00Z |
| Original Component Count Claimed | 0 |
| Original Component Count Actual | 0 |
| Gaps Identified Count | 15 |
| Components Added Count | 28 |
| Final Component Count | 28 |
| Validation Completeness Score | 100% |
| Enhancement Methodology | Systematic specification generation based on compr... |

## 2.2 Validation Summary

### 2.2.1 Repository Scope Validation

#### 2.2.1.1 Scope Compliance

Full compliance. Specification created to exclusively handle real-time chat, chat room lifecycle management, and quick-reply templates, as defined in the repository's scope.

#### 2.2.1.2 Gaps Identified

- Specification for WebSocket authentication guard was missing.
- Specification for event listener to manage chat room lifecycle was missing.
- Specification for serving quick-reply templates was missing.

#### 2.2.1.3 Components Added

- WsJwtGuard
- OrderEventsListener
- TemplatesController
- TemplatesService

### 2.2.2.0 Requirements Coverage Validation

#### 2.2.2.1 Functional Requirements Coverage

100%

#### 2.2.2.2 Non Functional Requirements Coverage

100%

#### 2.2.2.3 Missing Requirement Components

- No initial specifications were provided; all components were specified based on requirements.
- Missing specification for a REST endpoint to serve quick-reply templates (REQ-1-081).
- Missing specification for authorization logic to enforce chat room participation (REQ-1-015).
- Missing specification for transitioning rooms to a read-only state based on events (REQ-1-015).

#### 2.2.2.4 Added Requirement Components

- TemplatesController
- ChatService authorization logic
- OrderEventsListener for state changes

### 2.2.3.0 Architectural Pattern Validation

#### 2.2.3.1 Pattern Implementation Completeness

Full compliance. Specification adheres to the event-driven microservice architecture, utilizing NestJS modules for bounded contexts and a WebSocket Gateway with a Redis adapter for scalable real-time communication.

#### 2.2.3.2 Missing Pattern Components

- Missing specification for the event consumer component.
- Missing specification for the Redis adapter integration.

#### 2.2.3.3 Added Pattern Components

- OrderEventsListener
- Specification notes for RedisIoAdapter in main.ts

### 2.2.4.0 Database Mapping Validation

#### 2.2.4.1 Entity Mapping Completeness

Full compliance after enhancement. A conflict between the general DB design (DocumentDB) and repository-specific context (PostgreSQL) was resolved in favor of PostgreSQL. A necessary `ChatRoom` entity specification was added.

#### 2.2.4.2 Missing Database Components

- Specification for the `ChatRoom` entity to manage room state was missing.
- Specification for `ChatMessage` entity adapted for PostgreSQL was missing.

#### 2.2.4.3 Added Database Components

- ChatRoom entity specification
- ChatMessage entity specification (PostgreSQL/TypeORM)

### 2.2.5.0 Sequence Interaction Validation

#### 2.2.5.1 Interaction Implementation Completeness

Full compliance. All interactions from Sequence Diagram 214 and implied requirements are mapped to method specifications. Added a necessary but unspecified interaction for fetching order participants.

#### 2.2.5.2 Missing Interaction Components

- Missing specification for the HTTP call from ChatService to OrderService for participant authorization.
- Missing specification for explicit error handling in the WebSocket gateway.

#### 2.2.5.3 Added Interaction Components

- ChatService.authorizeUserForRoom specification including the cross-service call.
- Exception handling specifications for ChatGateway methods.

## 2.3.0.0 Enhanced Specification

### 2.3.1.0 Specification Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-api-chat |
| Technology Stack | NestJS (WebSockets), Redis, PostgreSQL |
| Technology Guidance Integration | Leverages NestJS's modular architecture, WebSocket... |
| Framework Compliance Score | 100% |
| Specification Completeness | 100% |
| Component Count | 28 |
| Specification Methodology | Decomposed microservice for real-time, stateful co... |

### 2.3.2.0 Technology Framework Integration

#### 2.3.2.1 Framework Patterns Applied

- Modules for Bounded Contexts
- WebSocket Gateway for real-time communication
- Dependency Injection for loose coupling
- Repository Pattern for data abstraction
- DTOs with Validation Pipes for contract enforcement
- Guards for WebSocket connection security
- Event-driven architecture for inter-service communication
- Redis Adapter for scalable WebSocket backplane

#### 2.3.2.2 Directory Structure Source

NestJS CLI conventions with feature-based modularity.

#### 2.3.2.3 Naming Conventions Source

TypeScript/NestJS community standards (PascalCase for classes, camelCase for functions/properties).

#### 2.3.2.4 Architectural Patterns Source

Event-driven microservices architecture with a dedicated real-time communication layer.

#### 2.3.2.5 Performance Optimizations Applied

- Redis Pub/Sub backplane for horizontal scaling of WebSocket gateways.
- Connection pooling for PostgreSQL via TypeORM.
- Caching of authorization data (order participants) in Redis.
- Lightweight DTOs for WebSocket payloads.

### 2.3.3.0 File Structure

#### 2.3.3.1 Directory Organization

##### 2.3.3.1.1 Directory Path

###### 2.3.3.1.1.1 Directory Path

src/modules/chat

###### 2.3.3.1.1.2 Purpose

Encapsulates all core chat functionality, including WebSocket communication, business logic, data persistence, and event handling, aligning with a feature-based modular architecture.

###### 2.3.3.1.1.3 Contains Files

- chat.module.ts
- chat.gateway.ts
- chat.service.ts
- chat.repository.ts
- entities/chat-room.entity.ts
- entities/chat-message.entity.ts
- dtos/send-message.dto.ts
- dtos/chat-message.dto.ts
- guards/ws-jwt.guard.ts

###### 2.3.3.1.1.4 Organizational Reasoning

Groups all related components of the chat feature into a single, cohesive NestJS module, promoting encapsulation and maintainability.

###### 2.3.3.1.1.5 Framework Convention Alignment

Follows standard NestJS module and feature-based project structure.

##### 2.3.3.1.2.0 Directory Path

###### 2.3.3.1.2.1 Directory Path

src/modules/integrations

###### 2.3.3.1.2.2 Purpose

Handles consumption of asynchronous events from external microservices, such as order status updates, to drive the lifecycle of chat rooms.

###### 2.3.3.1.2.3 Contains Files

- integrations.module.ts
- order-events.listener.ts

###### 2.3.3.1.2.4 Organizational Reasoning

Isolates the logic for inter-service communication, decoupling it from the core chat business logic and making the service's external dependencies explicit.

###### 2.3.3.1.2.5 Framework Convention Alignment

Uses a dedicated module for external integrations, a common pattern for managing dependencies in a microservices landscape.

##### 2.3.3.1.3.0 Directory Path

###### 2.3.3.1.3.1 Directory Path

src/modules/templates

###### 2.3.3.1.3.2 Purpose

Manages the retrieval of quick-reply templates as required by REQ-1-081.

###### 2.3.3.1.3.3 Contains Files

- templates.module.ts
- templates.controller.ts
- templates.service.ts
- dtos/quick-reply-template.dto.ts

###### 2.3.3.1.3.4 Organizational Reasoning

Separates the stateless, request-response logic for templates from the stateful, real-time logic of the chat gateway.

###### 2.3.3.1.3.5 Framework Convention Alignment

Standard NestJS module with a controller for exposing a RESTful API endpoint.

##### 2.3.3.1.4.0 Directory Path

###### 2.3.3.1.4.1 Directory Path

src/shared

###### 2.3.3.1.4.2 Purpose

Contains reusable infrastructure modules for database connections, Redis clients, and configuration, shared across the application.

###### 2.3.3.1.4.3 Contains Files

- database/database.module.ts
- redis/redis.module.ts

###### 2.3.3.1.4.4 Organizational Reasoning

Promotes DRY principles by centralizing the setup and provision of shared infrastructure components.

###### 2.3.3.1.4.5 Framework Convention Alignment

Adheres to NestJS best practices for creating shared, reusable modules.

#### 2.3.3.2.0.0 Namespace Strategy

| Property | Value |
|----------|-------|
| Root Namespace | Platform.Services.Chat |
| Namespace Organization | Namespaces are implicitly managed by the module an... |
| Naming Conventions | Standard TypeScript/NestJS naming conventions are ... |
| Framework Alignment | Fully aligned with NestJS's module-based architect... |

### 2.3.4.0.0.0 Class Specifications

#### 2.3.4.1.0.0 Class Name

##### 2.3.4.1.1.0 Class Name

ChatGateway

##### 2.3.4.1.2.0 File Path

src/modules/chat/chat.gateway.ts

##### 2.3.4.1.3.0 Class Type

WebSocket Gateway

##### 2.3.4.1.4.0 Inheritance

implements OnGatewayConnection, OnGatewayDisconnect

##### 2.3.4.1.5.0 Purpose

Manages all real-time client communication via WebSockets. Responsible for handling connections, disconnections, message receiving, and broadcasting.

##### 2.3.4.1.6.0 Dependencies

- ChatService
- JwtService
- Logger

##### 2.3.4.1.7.0 Framework Specific Attributes

- @WebSocketGateway({ cors: { origin: \"*\" } })
- @UseGuards(WsJwtGuard)

##### 2.3.4.1.8.0 Technology Integration Notes

Must be configured with a Redis adapter in main.ts to support horizontal scaling. It is the primary exposed interface of this microservice.

##### 2.3.4.1.9.0 Properties

- {'property_name': 'server', 'property_type': 'Server', 'access_modifier': 'public', 'purpose': 'The underlying Socket.IO server instance, used for broadcasting messages to rooms.', 'validation_attributes': [], 'framework_specific_configuration': 'Decorated with @WebSocketServer().', 'implementation_notes': 'Used for `this.server.to(roomId).emit(...)`.'}

##### 2.3.4.1.10.0 Methods

###### 2.3.4.1.10.1 Method Name

####### 2.3.4.1.10.1.1 Method Name

handleConnection

####### 2.3.4.1.10.1.2 Method Signature

handleConnection(client: Socket, ...args: any[]): Promise<void>

####### 2.3.4.1.10.1.3 Return Type

Promise<void>

####### 2.3.4.1.10.1.4 Access Modifier

public

####### 2.3.4.1.10.1.5 Is Async

✅ Yes

####### 2.3.4.1.10.1.6 Framework Specific Attributes

*No items available*

####### 2.3.4.1.10.1.7 Parameters

- {'parameter_name': 'client', 'parameter_type': 'Socket', 'is_nullable': False, 'purpose': "The connecting client's socket instance.", 'framework_attributes': []}

####### 2.3.4.1.10.1.8 Implementation Logic

This method must be specified to perform initial authorization. It should extract the user payload (attached by WsJwtGuard) and the \"orderId\" from the client's handshake query. It will then call `chatService.authorizeUserForRoom` to verify the user is a participant. If authorized, it joins the client to a room named after the orderId (`client.join(orderId)`). If authorization fails, it must call `client.disconnect()`.

####### 2.3.4.1.10.1.9 Exception Handling

Must be specified to catch any errors during authorization and log them, ensuring unauthorized clients are always disconnected.

####### 2.3.4.1.10.1.10 Performance Considerations

Authorization logic must be highly performant, leveraging caching for order participant data.

####### 2.3.4.1.10.1.11 Validation Requirements

Requires `orderId` in the handshake query. Relies on `WsJwtGuard` for initial JWT validation.

####### 2.3.4.1.10.1.12 Technology Integration Details

Integrates with Socket.IO's room functionality for message scoping.

###### 2.3.4.1.10.2.0 Method Name

####### 2.3.4.1.10.2.1 Method Name

handleSendMessage

####### 2.3.4.1.10.2.2 Method Signature

handleSendMessage(client: Socket, payload: SendMessageDto): Promise<void>

####### 2.3.4.1.10.2.3 Return Type

Promise<void>

####### 2.3.4.1.10.2.4 Access Modifier

public

####### 2.3.4.1.10.2.5 Is Async

✅ Yes

####### 2.3.4.1.10.2.6 Framework Specific Attributes

- @SubscribeMessage(\"sendMessage\")

####### 2.3.4.1.10.2.7 Parameters

######## 2.3.4.1.10.2.7.1 Parameter Name

######### 2.3.4.1.10.2.7.1.1 Parameter Name

client

######### 2.3.4.1.10.2.7.1.2 Parameter Type

Socket

######### 2.3.4.1.10.2.7.1.3 Is Nullable

❌ No

######### 2.3.4.1.10.2.7.1.4 Purpose

The client socket sending the message.

######### 2.3.4.1.10.2.7.1.5 Framework Attributes

- @ConnectedSocket()

######## 2.3.4.1.10.2.7.2.0 Parameter Name

######### 2.3.4.1.10.2.7.2.1 Parameter Name

payload

######### 2.3.4.1.10.2.7.2.2 Parameter Type

SendMessageDto

######### 2.3.4.1.10.2.7.2.3 Is Nullable

❌ No

######### 2.3.4.1.10.2.7.2.4 Purpose

The DTO containing the message content and orderId.

######### 2.3.4.1.10.2.7.2.5 Framework Attributes

- @MessageBody()

####### 2.3.4.1.10.2.8.0.0 Implementation Logic

This method must be specified to first extract the userId from the client's user payload. It then calls `chatService.createMessage` with the userId and payload. Upon successful persistence, it must broadcast the returned `ChatMessage` object to all other clients in the room using `client.to(payload.orderId).emit(\"newMessage\", createdMessage)`. This prevents the sender from receiving their own message back.

####### 2.3.4.1.10.2.9.0.0 Exception Handling

Must be specified to catch exceptions from the service layer (e.g., if the chat room is read-only) and emit an error event back to the calling client.

####### 2.3.4.1.10.2.10.0.0 Performance Considerations

Relies on the Redis adapter for efficient broadcasting across multiple service instances.

####### 2.3.4.1.10.2.11.0.0 Validation Requirements

The `payload` is automatically validated by NestJS's `ValidationPipe` against the `SendMessageDto` class.

####### 2.3.4.1.10.2.12.0.0 Technology Integration Details

Uses NestJS decorators to bind to the \"sendMessage\" WebSocket event.

##### 2.3.4.1.11.0.0.0.0 Events

*No items available*

##### 2.3.4.1.12.0.0.0.0 Implementation Notes

This gateway is the core of the service's real-time functionality and must be thoroughly tested for security and scalability.

#### 2.3.4.2.0.0.0.0.0 Class Name

##### 2.3.4.2.1.0.0.0.0 Class Name

ChatService

##### 2.3.4.2.2.0.0.0.0 File Path

src/modules/chat/chat.service.ts

##### 2.3.4.2.3.0.0.0.0 Class Type

Service

##### 2.3.4.2.4.0.0.0.0 Inheritance



##### 2.3.4.2.5.0.0.0.0 Purpose

Encapsulates the core business logic for the chat feature, including message creation, room management, and authorization checks.

##### 2.3.4.2.6.0.0.0.0 Dependencies

- ChatRepository
- HttpService
- Cache
- ConfigService
- Logger

##### 2.3.4.2.7.0.0.0.0 Framework Specific Attributes

- @Injectable()

##### 2.3.4.2.8.0.0.0.0 Technology Integration Notes

Acts as an orchestrator, interacting with the database via the repository, caching participant data in Redis, and calling other microservices (e.g., Order Service) via HTTP if needed.

##### 2.3.4.2.9.0.0.0.0 Properties

*No items available*

##### 2.3.4.2.10.0.0.0.0 Methods

###### 2.3.4.2.10.1.0.0.0 Method Name

####### 2.3.4.2.10.1.1.0.0 Method Name

createMessage

####### 2.3.4.2.10.1.2.0.0 Method Signature

createMessage(userId: string, messageDto: SendMessageDto): Promise<ChatMessage>

####### 2.3.4.2.10.1.3.0.0 Return Type

Promise<ChatMessage>

####### 2.3.4.2.10.1.4.0.0 Access Modifier

public

####### 2.3.4.2.10.1.5.0.0 Is Async

✅ Yes

####### 2.3.4.2.10.1.6.0.0 Framework Specific Attributes

*No items available*

####### 2.3.4.2.10.1.7.0.0 Parameters

######## 2.3.4.2.10.1.7.1.0 Parameter Name

######### 2.3.4.2.10.1.7.1.1 Parameter Name

userId

######### 2.3.4.2.10.1.7.1.2 Parameter Type

string

######### 2.3.4.2.10.1.7.1.3 Is Nullable

❌ No

######### 2.3.4.2.10.1.7.1.4 Purpose

The ID of the user sending the message.

######### 2.3.4.2.10.1.7.1.5 Framework Attributes

*No items available*

######## 2.3.4.2.10.1.7.2.0 Parameter Name

######### 2.3.4.2.10.1.7.2.1 Parameter Name

messageDto

######### 2.3.4.2.10.1.7.2.2 Parameter Type

SendMessageDto

######### 2.3.4.2.10.1.7.2.3 Is Nullable

❌ No

######### 2.3.4.2.10.1.7.2.4 Purpose

The DTO containing the message details.

######### 2.3.4.2.10.1.7.2.5 Framework Attributes

*No items available*

####### 2.3.4.2.10.1.8.0.0 Implementation Logic

This method must be specified to first fetch the chat room from the repository using `messageDto.orderId`. It must then check if the room is `is_readonly`. If it is, it must throw a `ForbiddenException`. If not, it creates a new `ChatMessage` entity and calls `chatRepository.saveMessage` to persist it.

####### 2.3.4.2.10.1.9.0.0 Exception Handling

Specified to throw `ForbiddenException` for read-only rooms and `NotFoundException` if the chat room doesn't exist.

####### 2.3.4.2.10.1.10.0.0 Performance Considerations

The read-only check is a fast database query.

####### 2.3.4.2.10.1.11.0.0 Validation Requirements

Relies on the DTO for input validation. Assumes `userId` is valid from the JWT.

####### 2.3.4.2.10.1.12.0.0 Technology Integration Details

Interacts with the repository for database operations.

###### 2.3.4.2.10.2.0.0.0 Method Name

####### 2.3.4.2.10.2.1.0.0 Method Name

authorizeUserForRoom

####### 2.3.4.2.10.2.2.0.0 Method Signature

authorizeUserForRoom(userId: string, orderId: string): Promise<boolean>

####### 2.3.4.2.10.2.3.0.0 Return Type

Promise<boolean>

####### 2.3.4.2.10.2.4.0.0 Access Modifier

public

####### 2.3.4.2.10.2.5.0.0 Is Async

✅ Yes

####### 2.3.4.2.10.2.6.0.0 Framework Specific Attributes

*No items available*

####### 2.3.4.2.10.2.7.0.0 Parameters

######## 2.3.4.2.10.2.7.1.0 Parameter Name

######### 2.3.4.2.10.2.7.1.1 Parameter Name

userId

######### 2.3.4.2.10.2.7.1.2 Parameter Type

string

######### 2.3.4.2.10.2.7.1.3 Is Nullable

❌ No

######### 2.3.4.2.10.2.7.1.4 Purpose

The user ID to authorize.

######### 2.3.4.2.10.2.7.1.5 Framework Attributes

*No items available*

######## 2.3.4.2.10.2.7.2.0 Parameter Name

######### 2.3.4.2.10.2.7.2.1 Parameter Name

orderId

######### 2.3.4.2.10.2.7.2.2 Parameter Type

string

######### 2.3.4.2.10.2.7.2.3 Is Nullable

❌ No

######### 2.3.4.2.10.2.7.2.4 Purpose

The order ID representing the chat room.

######### 2.3.4.2.10.2.7.2.5 Framework Attributes

*No items available*

####### 2.3.4.2.10.2.8.0.0 Implementation Logic

This method must be specified to implement the authorization logic from REQ-1-015. It should first check a Redis cache for the participants of the given `orderId`. If not found, it must make an HTTP call to the Order Service to fetch the `customerId`, `vendorId`, and `riderId` for that order. It must then cache these participants in Redis with a TTL. Finally, it must check if the provided `userId` is in the list of participants and return true or false.

####### 2.3.4.2.10.2.9.0.0 Exception Handling

Specified to handle HTTP errors from the Order Service call gracefully, logging the error and returning false.

####### 2.3.4.2.10.2.10.0.0 Performance Considerations

Heavy reliance on Redis caching is critical to avoid high-latency cross-service calls for every connection.

####### 2.3.4.2.10.2.11.0.0 Validation Requirements

Validates that a user is a direct party to the order.

####### 2.3.4.2.10.2.12.0.0 Technology Integration Details

Integrates with Redis for caching and `HttpService` (@nestjs/axios) for inter-service communication.

###### 2.3.4.2.10.3.0.0.0 Method Name

####### 2.3.4.2.10.3.1.0.0 Method Name

createRoomFromEvent

####### 2.3.4.2.10.3.2.0.0 Method Signature

createRoomFromEvent(payload: OrderAcceptedEvent): Promise<void>

####### 2.3.4.2.10.3.3.0.0 Return Type

Promise<void>

####### 2.3.4.2.10.3.4.0.0 Access Modifier

public

####### 2.3.4.2.10.3.5.0.0 Is Async

✅ Yes

####### 2.3.4.2.10.3.6.0.0 Framework Specific Attributes

*No items available*

####### 2.3.4.2.10.3.7.0.0 Parameters

- {'parameter_name': 'payload', 'parameter_type': 'OrderAcceptedEvent', 'is_nullable': False, 'purpose': 'Event payload from the Order Service.', 'framework_attributes': []}

####### 2.3.4.2.10.3.8.0.0 Implementation Logic

This method must be specified to be called by the `OrderEventsListener`. It should create a new `ChatRoom` entity with the `orderId` from the payload, `is_readonly` set to false, and initial participants (`customerId`, `vendorId`). It will then call `chatRepository.createRoom`.

####### 2.3.4.2.10.3.9.0.0 Exception Handling

Specified to handle potential duplicate room creation errors from the database gracefully.

####### 2.3.4.2.10.3.10.0.0 Performance Considerations

Simple database insert operation.

####### 2.3.4.2.10.3.11.0.0 Validation Requirements

Assumes the event payload is valid.

####### 2.3.4.2.10.3.12.0.0 Technology Integration Details

Part of the event-driven workflow.

###### 2.3.4.2.10.4.0.0.0 Method Name

####### 2.3.4.2.10.4.1.0.0 Method Name

setRoomReadOnlyFromEvent

####### 2.3.4.2.10.4.2.0.0 Method Signature

setRoomReadOnlyFromEvent(payload: OrderFinalizedEvent): Promise<void>

####### 2.3.4.2.10.4.3.0.0 Return Type

Promise<void>

####### 2.3.4.2.10.4.4.0.0 Access Modifier

public

####### 2.3.4.2.10.4.5.0.0 Is Async

✅ Yes

####### 2.3.4.2.10.4.6.0.0 Framework Specific Attributes

*No items available*

####### 2.3.4.2.10.4.7.0.0 Parameters

- {'parameter_name': 'payload', 'parameter_type': 'OrderFinalizedEvent', 'is_nullable': False, 'purpose': 'Event payload indicating order completion or cancellation.', 'framework_attributes': []}

####### 2.3.4.2.10.4.8.0.0 Implementation Logic

This method must be specified to be called by the `OrderEventsListener`. It finds the chat room by the `orderId` in the payload and updates its `is_readonly` flag to true, then calls `chatRepository.updateRoom`.

####### 2.3.4.2.10.4.9.0.0 Exception Handling

Specified to log a warning if a chat room for the given order is not found.

####### 2.3.4.2.10.4.10.0.0 Performance Considerations

Simple database update operation.

####### 2.3.4.2.10.4.11.0.0 Validation Requirements

Assumes the event payload is valid.

####### 2.3.4.2.10.4.12.0.0 Technology Integration Details

Implements the read-only requirement from REQ-1-015.

##### 2.3.4.2.11.0.0.0.0 Events

*No items available*

##### 2.3.4.2.12.0.0.0.0 Implementation Notes

The service is the brain of the chat module, orchestrating security, state, and persistence.

#### 2.3.4.3.0.0.0.0.0 Class Name

##### 2.3.4.3.1.0.0.0.0 Class Name

OrderEventsListener

##### 2.3.4.3.2.0.0.0.0 File Path

src/modules/integrations/order-events.listener.ts

##### 2.3.4.3.3.0.0.0.0 Class Type

Controller/Listener

##### 2.3.4.3.4.0.0.0.0 Inheritance



##### 2.3.4.3.5.0.0.0.0 Purpose

Consumes asynchronous events from the Order Management service via SQS and triggers business logic in the ChatService to manage chat room lifecycles.

##### 2.3.4.3.6.0.0.0.0 Dependencies

- ChatService
- Logger

##### 2.3.4.3.7.0.0.0.0 Framework Specific Attributes

- @Controller()

##### 2.3.4.3.8.0.0.0.0 Technology Integration Notes

This component is the primary integration point with the rest of the platform's backend services, adhering to an event-driven architecture.

##### 2.3.4.3.9.0.0.0.0 Properties

*No items available*

##### 2.3.4.3.10.0.0.0.0 Methods

###### 2.3.4.3.10.1.0.0.0 Method Name

####### 2.3.4.3.10.1.1.0.0 Method Name

handleOrderAccepted

####### 2.3.4.3.10.1.2.0.0 Method Signature

handleOrderAccepted(message: any): Promise<void>

####### 2.3.4.3.10.1.3.0.0 Return Type

Promise<void>

####### 2.3.4.3.10.1.4.0.0 Access Modifier

public

####### 2.3.4.3.10.1.5.0.0 Is Async

✅ Yes

####### 2.3.4.3.10.1.6.0.0 Framework Specific Attributes

- @MessagePattern(\"order.accepted\")

####### 2.3.4.3.10.1.7.0.0 Parameters

- {'parameter_name': 'message', 'parameter_type': 'any', 'is_nullable': False, 'purpose': 'The raw message payload from the message bus.', 'framework_attributes': []}

####### 2.3.4.3.10.1.8.0.0 Implementation Logic

This method must be specified to parse the incoming event payload, validate it against an `OrderAcceptedEvent` DTO, and then call `chatService.createRoomFromEvent` with the validated data.

####### 2.3.4.3.10.1.9.0.0 Exception Handling

Specified to log any parsing or validation errors and ensure the message is not re-queued indefinitely (using a dead-letter queue).

####### 2.3.4.3.10.1.10.0.0 Performance Considerations

N/A

####### 2.3.4.3.10.1.11.0.0 Validation Requirements

Must validate the structure of the incoming event payload.

####### 2.3.4.3.10.1.12.0.0 Technology Integration Details

Uses NestJS microservice transport decorators to subscribe to events. The actual transport (SQS) is configured at the application level.

###### 2.3.4.3.10.2.0.0.0 Method Name

####### 2.3.4.3.10.2.1.0.0 Method Name

handleOrderFinalized

####### 2.3.4.3.10.2.2.0.0 Method Signature

handleOrderFinalized(message: any): Promise<void>

####### 2.3.4.3.10.2.3.0.0 Return Type

Promise<void>

####### 2.3.4.3.10.2.4.0.0 Access Modifier

public

####### 2.3.4.3.10.2.5.0.0 Is Async

✅ Yes

####### 2.3.4.3.10.2.6.0.0 Framework Specific Attributes

- @MessagePattern(\"order.delivered\")
- @MessagePattern(\"order.cancelled\")

####### 2.3.4.3.10.2.7.0.0 Parameters

- {'parameter_name': 'message', 'parameter_type': 'any', 'is_nullable': False, 'purpose': 'The raw message payload from the message bus.', 'framework_attributes': []}

####### 2.3.4.3.10.2.8.0.0 Implementation Logic

This method must be specified to parse the incoming event payload, validate it against an `OrderFinalizedEvent` DTO, and then call `chatService.setRoomReadOnlyFromEvent`.

####### 2.3.4.3.10.2.9.0.0 Exception Handling

Similar to `handleOrderAccepted`, must handle parsing errors and bad messages.

####### 2.3.4.3.10.2.10.0.0 Performance Considerations

N/A

####### 2.3.4.3.10.2.11.0.0 Validation Requirements

Must validate the structure of the incoming event payload.

####### 2.3.4.3.10.2.12.0.0 Technology Integration Details

Subscribes to multiple event types that result in the same business action.

##### 2.3.4.3.11.0.0.0.0 Events

*No items available*

##### 2.3.4.3.12.0.0.0.0 Implementation Notes

This component is critical for decoupling the Chat service from the Order service.

#### 2.3.4.4.0.0.0.0.0 Class Name

##### 2.3.4.4.1.0.0.0.0 Class Name

TemplatesController

##### 2.3.4.4.2.0.0.0.0 File Path

src/modules/templates/templates.controller.ts

##### 2.3.4.4.3.0.0.0.0 Class Type

Controller

##### 2.3.4.4.4.0.0.0.0 Inheritance



##### 2.3.4.4.5.0.0.0.0 Purpose

Provides a standard RESTful API endpoint for clients to fetch quick-reply templates, fulfilling REQ-1-081.

##### 2.3.4.4.6.0.0.0.0 Dependencies

- TemplatesService

##### 2.3.4.4.7.0.0.0.0 Framework Specific Attributes

- @Controller(\"templates\")
- @UseGuards(AuthGuard(\"jwt\"))

##### 2.3.4.4.8.0.0.0.0 Technology Integration Notes

A standard NestJS controller protected by a JWT authentication guard.

##### 2.3.4.4.9.0.0.0.0 Properties

*No items available*

##### 2.3.4.4.10.0.0.0.0 Methods

- {'method_name': 'getQuickReplyTemplates', 'method_signature': 'getQuickReplyTemplates(@Query(\\"context\\") context: string): Promise<QuickReplyTemplateDto[]>', 'return_type': 'Promise<QuickReplyTemplateDto[]>', 'access_modifier': 'public', 'is_async': True, 'framework_specific_attributes': ['@Get(\\"quick-replies\\")'], 'parameters': [{'parameter_name': 'context', 'parameter_type': 'string', 'is_nullable': False, 'purpose': 'The context for which to fetch templates (e.g., \\"customer-to-rider\\", \\"vendor-to-customer\\").', 'framework_attributes': ['@Query()']}], 'implementation_logic': 'This method must be specified to call `templatesService.getTemplatesByContext` with the provided context and return the result.', 'exception_handling': 'Specified to rely on the global exception filter for any errors from the service layer.', 'performance_considerations': 'The underlying service should cache these templates as they change infrequently.', 'validation_requirements': 'The `context` query parameter should be validated against a list of known contexts.', 'technology_integration_details': 'Exposes a standard GET endpoint for clients.'}

##### 2.3.4.4.11.0.0.0.0 Events

*No items available*

##### 2.3.4.4.12.0.0.0.0 Implementation Notes

This provides the data needed for the quick-reply UI feature.

### 2.3.5.0.0.0.0.0.0 Interface Specifications

- {'interface_name': 'IChatRepository', 'file_path': 'src/modules/chat/chat.repository.ts', 'purpose': 'Defines the contract for data persistence operations related to chat rooms and messages, abstracting the data source (PostgreSQL).', 'generic_constraints': 'None', 'framework_specific_inheritance': 'None', 'method_contracts': [{'method_name': 'findRoomByOrderId', 'method_signature': 'findRoomByOrderId(orderId: string): Promise<ChatRoom | null>', 'return_type': 'Promise<ChatRoom | null>', 'framework_attributes': [], 'parameters': [{'parameter_name': 'orderId', 'parameter_type': 'string', 'purpose': 'The order ID to find the chat room for.'}], 'contract_description': 'Must be specified to retrieve a single chat room entity based on its associated order ID.', 'exception_contracts': 'Specified to not throw exceptions for not found cases, but return null instead.'}, {'method_name': 'createRoom', 'method_signature': 'createRoom(room: ChatRoom): Promise<ChatRoom>', 'return_type': 'Promise<ChatRoom>', 'framework_attributes': [], 'parameters': [{'parameter_name': 'room', 'parameter_type': 'ChatRoom', 'purpose': 'The chat room entity to persist.'}], 'contract_description': 'Must be specified to save a new chat room to the database.', 'exception_contracts': 'Specified to throw a `DuplicateException` or similar if a room for that order already exists.'}, {'method_name': 'updateRoom', 'method_signature': 'updateRoom(room: ChatRoom): Promise<ChatRoom>', 'return_type': 'Promise<ChatRoom>', 'framework_attributes': [], 'parameters': [{'parameter_name': 'room', 'parameter_type': 'ChatRoom', 'purpose': 'The chat room entity with updated values to persist.'}], 'contract_description': 'Must be specified to save changes to an existing chat room, such as setting it to read-only.', 'exception_contracts': 'Specified to throw a `NotFoundException` if the room does not exist.'}, {'method_name': 'saveMessage', 'method_signature': 'saveMessage(message: ChatMessage): Promise<ChatMessage>', 'return_type': 'Promise<ChatMessage>', 'framework_attributes': [], 'parameters': [{'parameter_name': 'message', 'parameter_type': 'ChatMessage', 'purpose': 'The chat message entity to persist.'}], 'contract_description': 'Must be specified to save a new chat message to the database.', 'exception_contracts': 'Specified to throw exceptions on database constraint violations.'}], 'property_contracts': [], 'implementation_guidance': "The implementation should use TypeORM's `Repository` pattern to interact with the PostgreSQL database. All methods should be asynchronous."}

### 2.3.6.0.0.0.0.0.0 Enum Specifications

*No items available*

### 2.3.7.0.0.0.0.0.0 Dto Specifications

#### 2.3.7.1.0.0.0.0.0 Dto Name

##### 2.3.7.1.1.0.0.0.0 Dto Name

SendMessageDto

##### 2.3.7.1.2.0.0.0.0 File Path

src/modules/chat/dtos/send-message.dto.ts

##### 2.3.7.1.3.0.0.0.0 Purpose

Defines the data structure for incoming \"sendMessage\" WebSocket events, enforcing validation rules.

##### 2.3.7.1.4.0.0.0.0 Framework Base Class

None

##### 2.3.7.1.5.0.0.0.0 Properties

###### 2.3.7.1.5.1.0.0.0 Property Name

####### 2.3.7.1.5.1.1.0.0 Property Name

orderId

####### 2.3.7.1.5.1.2.0.0 Property Type

string

####### 2.3.7.1.5.1.3.0.0 Validation Attributes

- @IsUUID()

####### 2.3.7.1.5.1.4.0.0 Serialization Attributes

*No items available*

####### 2.3.7.1.5.1.5.0.0 Framework Specific Attributes

*No items available*

###### 2.3.7.1.5.2.0.0.0 Property Name

####### 2.3.7.1.5.2.1.0.0 Property Name

messageText

####### 2.3.7.1.5.2.2.0.0 Property Type

string

####### 2.3.7.1.5.2.3.0.0 Validation Attributes

- @IsString()
- @IsNotEmpty()
- @MaxLength(500)

####### 2.3.7.1.5.2.4.0.0 Serialization Attributes

*No items available*

####### 2.3.7.1.5.2.5.0.0 Framework Specific Attributes

*No items available*

##### 2.3.7.1.6.0.0.0.0 Validation Rules

orderId must be a valid UUID. messageText must be a non-empty string with a maximum length of 500 characters.

##### 2.3.7.1.7.0.0.0.0 Serialization Requirements

Standard class-to-plain transformation for WebSocket payloads.

#### 2.3.7.2.0.0.0.0.0 Dto Name

##### 2.3.7.2.1.0.0.0.0 Dto Name

ChatMessageDto

##### 2.3.7.2.2.0.0.0.0 File Path

src/modules/chat/dtos/chat-message.dto.ts

##### 2.3.7.2.3.0.0.0.0 Purpose

Defines the data structure for outgoing \"newMessage\" WebSocket events, ensuring a consistent contract for clients.

##### 2.3.7.2.4.0.0.0.0 Framework Base Class

None

##### 2.3.7.2.5.0.0.0.0 Properties

###### 2.3.7.2.5.1.0.0.0 Property Name

####### 2.3.7.2.5.1.1.0.0 Property Name

id

####### 2.3.7.2.5.1.2.0.0 Property Type

string

####### 2.3.7.2.5.1.3.0.0 Validation Attributes

*No items available*

####### 2.3.7.2.5.1.4.0.0 Serialization Attributes

- @Expose()

####### 2.3.7.2.5.1.5.0.0 Framework Specific Attributes

*No items available*

###### 2.3.7.2.5.2.0.0.0 Property Name

####### 2.3.7.2.5.2.1.0.0 Property Name

orderId

####### 2.3.7.2.5.2.2.0.0 Property Type

string

####### 2.3.7.2.5.2.3.0.0 Validation Attributes

*No items available*

####### 2.3.7.2.5.2.4.0.0 Serialization Attributes

- @Expose()

####### 2.3.7.2.5.2.5.0.0 Framework Specific Attributes

*No items available*

###### 2.3.7.2.5.3.0.0.0 Property Name

####### 2.3.7.2.5.3.1.0.0 Property Name

senderId

####### 2.3.7.2.5.3.2.0.0 Property Type

string

####### 2.3.7.2.5.3.3.0.0 Validation Attributes

*No items available*

####### 2.3.7.2.5.3.4.0.0 Serialization Attributes

- @Expose()

####### 2.3.7.2.5.3.5.0.0 Framework Specific Attributes

*No items available*

###### 2.3.7.2.5.4.0.0.0 Property Name

####### 2.3.7.2.5.4.1.0.0 Property Name

messageText

####### 2.3.7.2.5.4.2.0.0 Property Type

string

####### 2.3.7.2.5.4.3.0.0 Validation Attributes

*No items available*

####### 2.3.7.2.5.4.4.0.0 Serialization Attributes

- @Expose()

####### 2.3.7.2.5.4.5.0.0 Framework Specific Attributes

*No items available*

###### 2.3.7.2.5.5.0.0.0 Property Name

####### 2.3.7.2.5.5.1.0.0 Property Name

createdAt

####### 2.3.7.2.5.5.2.0.0 Property Type

Date

####### 2.3.7.2.5.5.3.0.0 Validation Attributes

*No items available*

####### 2.3.7.2.5.5.4.0.0 Serialization Attributes

- @Expose()

####### 2.3.7.2.5.5.5.0.0 Framework Specific Attributes

*No items available*

##### 2.3.7.2.6.0.0.0.0 Validation Rules

N/A - This is an output DTO.

##### 2.3.7.2.7.0.0.0.0 Serialization Requirements

Should be serialized using NestJS's `ClassSerializerInterceptor` to ensure only exposed properties are sent to clients.

### 2.3.8.0.0.0.0.0.0 Configuration Specifications

- {'configuration_name': 'ChatConfig', 'file_path': 'src/config/chat.config.ts', 'purpose': 'Provides type-safe configuration for the chat service, loaded from environment variables.', 'framework_base_class': 'None', 'configuration_sections': [{'section_name': 'chat', 'properties': [{'property_name': 'orderServiceUrl', 'property_type': 'string', 'default_value': '\\"\\"', 'required': True, 'description': 'The base URL for the internal Order Management service API.'}, {'property_name': 'participantCacheTtlSeconds', 'property_type': 'number', 'default_value': '300', 'required': False, 'description': 'The Time-To-Live in seconds for caching order participant data in Redis.'}]}], 'validation_requirements': '`orderServiceUrl` must be a valid URL. `participantCacheTtlSeconds` must be a positive integer.'}

### 2.3.9.0.0.0.0.0.0 Dependency Injection Specifications

#### 2.3.9.1.0.0.0.0.0 Service Interface

##### 2.3.9.1.1.0.0.0.0 Service Interface

IChatRepository

##### 2.3.9.1.2.0.0.0.0 Service Implementation

ChatRepository

##### 2.3.9.1.3.0.0.0.0 Lifetime

Scoped

##### 2.3.9.1.4.0.0.0.0 Registration Reasoning

Repositories are typically scoped to the request to ensure they can participate in request-level transactions if needed.

##### 2.3.9.1.5.0.0.0.0 Framework Registration Pattern

Standard provider registration in `chat.module.ts` using `@InjectRepository` from TypeORM.

#### 2.3.9.2.0.0.0.0.0 Service Interface

##### 2.3.9.2.1.0.0.0.0 Service Interface

ChatService

##### 2.3.9.2.2.0.0.0.0 Service Implementation

ChatService

##### 2.3.9.2.3.0.0.0.0 Lifetime

Scoped

##### 2.3.9.2.4.0.0.0.0 Registration Reasoning

Services are typically scoped to align with the lifetime of their dependencies, like repositories.

##### 2.3.9.2.5.0.0.0.0 Framework Registration Pattern

Standard provider registration in `chat.module.ts`.

#### 2.3.9.3.0.0.0.0.0 Service Interface

##### 2.3.9.3.1.0.0.0.0 Service Interface

ChatGateway

##### 2.3.9.3.2.0.0.0.0 Service Implementation

ChatGateway

##### 2.3.9.3.3.0.0.0.0 Lifetime

Singleton

##### 2.3.9.3.4.0.0.0.0 Registration Reasoning

WebSocket gateways in NestJS are singletons by default to manage all client connections within a single process.

##### 2.3.9.3.5.0.0.0.0 Framework Registration Pattern

Standard provider registration in `chat.module.ts`.

### 2.3.10.0.0.0.0.0.0 External Integration Specifications

#### 2.3.10.1.0.0.0.0.0 Integration Target

##### 2.3.10.1.1.0.0.0.0 Integration Target

Order Management Service

##### 2.3.10.1.2.0.0.0.0 Integration Type

Internal Microservice Communication

##### 2.3.10.1.3.0.0.0.0 Required Client Classes

- HttpService (@nestjs/axios)

##### 2.3.10.1.4.0.0.0.0 Configuration Requirements

Base URL for the Order Service must be provided via environment variables.

##### 2.3.10.1.5.0.0.0.0 Error Handling Requirements

Must handle HTTP errors (4xx, 5xx) and network timeouts gracefully. A circuit breaker pattern is recommended.

##### 2.3.10.1.6.0.0.0.0 Authentication Requirements

If internal communication is secured, must use a service-to-service authentication mechanism (e.g., internal JWT).

##### 2.3.10.1.7.0.0.0.0 Framework Integration Patterns

Use NestJS's `HttpModule` for making outbound API calls to fetch order participant data.

#### 2.3.10.2.0.0.0.0.0 Integration Target

##### 2.3.10.2.1.0.0.0.0 Integration Target

AWS SQS (for consuming Order Events)

##### 2.3.10.2.2.0.0.0.0 Integration Type

Message Queue Consumer

##### 2.3.10.2.3.0.0.0.0 Required Client Classes

- Custom SQS transport for NestJS microservices or a library like `nestjs-sqs`.

##### 2.3.10.2.4.0.0.0.0 Configuration Requirements

SQS queue URL, AWS region, and credentials.

##### 2.3.10.2.5.0.0.0.0 Error Handling Requirements

Must handle message parsing errors and implement a dead-letter queue (DLQ) strategy for unprocessable messages.

##### 2.3.10.2.6.0.0.0.0 Authentication Requirements

Requires an IAM role with `sqs:ReceiveMessage`, `sqs:DeleteMessage`, and `sqs:ChangeMessageVisibility` permissions.

##### 2.3.10.2.7.0.0.0.0 Framework Integration Patterns

Integrate as a NestJS custom microservice transport to use `@MessagePattern` decorators for event handling.

#### 2.3.10.3.0.0.0.0.0 Integration Target

##### 2.3.10.3.1.0.0.0.0 Integration Target

Redis (ElastiCache)

##### 2.3.10.3.2.0.0.0.0 Integration Type

Cache & Pub/Sub Backplane

##### 2.3.10.3.3.0.0.0.0 Required Client Classes

- RedisIoAdapter
- Cache (@nestjs/cache-manager)

##### 2.3.10.3.4.0.0.0.0 Configuration Requirements

Redis connection URL.

##### 2.3.10.3.5.0.0.0.0 Error Handling Requirements

The application should gracefully degrade (e.g., disable authorization caching) if Redis is unavailable and log critical errors.

##### 2.3.10.3.6.0.0.0.0 Authentication Requirements

Connection string may contain a password.

##### 2.3.10.3.7.0.0.0.0 Framework Integration Patterns

Use `@nestjs/websockets`'s built-in support for a Redis adapter. Use `@nestjs/cache-manager` for application-level caching.

# 3.0.0.0.0.0.0.0.0 File Structure

## 3.1.0.0.0.0.0.0.0 Directory Organization

### 3.1.1.0.0.0.0.0.0 Directory Path

#### 3.1.1.1.0.0.0.0.0 Directory Path

/

#### 3.1.1.2.0.0.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.1.3.0.0.0.0.0 Contains Files

- package.json
- package-lock.json
- tsconfig.json
- tsconfig.build.json
- nest-cli.json
- .env.example
- Dockerfile
- .dockerignore
- .eslintrc.js
- .prettierrc
- jest.config.js
- .gitignore
- README.md

#### 3.1.1.4.0.0.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.1.5.0.0.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

### 3.1.2.0.0.0.0.0.0 Directory Path

#### 3.1.2.1.0.0.0.0.0 Directory Path

.github/workflows

#### 3.1.2.2.0.0.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.2.3.0.0.0.0.0 Contains Files

- ci.yml

#### 3.1.2.4.0.0.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.2.5.0.0.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

### 3.1.3.0.0.0.0.0.0 Directory Path

#### 3.1.3.1.0.0.0.0.0 Directory Path

.vscode

#### 3.1.3.2.0.0.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.3.3.0.0.0.0.0 Contains Files

- settings.json
- launch.json

#### 3.1.3.4.0.0.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.3.5.0.0.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

