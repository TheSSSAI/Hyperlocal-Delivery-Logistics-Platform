# 1 Id

REPO-BE-CHAT

# 2 Name

platform-api-chat

# 3 Description

This is a new microservice repository responsible exclusively for real-time chat functionality. It was decomposed from the original 'platform-api-communications' repository to isolate its unique technical requirements. This service manages WebSocket connections, message delivery, chat rooms associated with active orders, and chat history. Its single responsibility is to provide a low-latency, reliable, real-time messaging layer between customers, vendors, and riders. Separating it from other communication features like ratings allows its infrastructure to be scaled and optimized independently for a high number of persistent WebSocket connections, a requirement not shared by other services.

# 4 Type

🔹 Application Services

# 5 Namespace

Platform.Services.Chat

# 6 Output Path

services/chat

# 7 Framework

NestJS

# 8 Language

TypeScript

# 9 Technology

NestJS (WebSockets), Redis, PostgreSQL

# 10 Thirdparty Libraries

- @nestjs/websockets
- ioredis

# 11 Layer Ids

- application-services

# 12 Dependencies

- REPO-LIB-CONTRACTS
- REPO-LIB-OBSERVABILITY

# 13 Requirements

## 13.1 Requirement Id

### 13.1.1 Requirement Id

REQ-1-081

## 13.2.0 Requirement Id

### 13.2.1 Requirement Id

REQ-1-015

# 14.0.0 Generate Tests

✅ Yes

# 15.0.0 Generate Documentation

✅ Yes

# 16.0.0 Architecture Style

Microservices

# 17.0.0 Architecture Map

- application-services

# 18.0.0 Components Map

- Ratings & Communication Service

# 19.0.0 Requirements Map

- REQ-1-081
- REQ-1-015

# 20.0.0 Decomposition Rationale

## 20.1.0 Operation Type

NEW_DECOMPOSED

## 20.2.0 Source Repository

REPO-BE-COMMS

## 20.3.0 Decomposition Reasoning

The real-time, stateful nature of WebSocket-based chat has vastly different scaling and performance characteristics than the stateless, CRUD-based nature of ratings or support tickets. Decomposing it allows for specialized infrastructure (e.g., a Redis pub/sub backplane for scaling WebSocket servers horizontally) and independent scaling based on concurrent connections, rather than being tied to the deployment lifecycle of other, unrelated features.

## 20.4.0 Extracted Responsibilities

- WebSocket connection management
- Real-time message broadcasting
- Chat history persistence
- Role-based chat permissions enforcement (REQ-1-015)

## 20.5.0 Reusability Scope

- Provides the core chat functionality for the platform.

## 20.6.0 Development Benefits

- A focused team can specialize in real-time communication technologies.
- The service can be optimized and scaled independently based on the number of active users.

# 21.0.0 Dependency Contracts

## 21.1.0 Repo-Be-Order

### 21.1.1 Required Interfaces

- {'interface': 'OrderActiveEvent', 'methods': [], 'events': ["Listens for 'order.accepted' to create a chat room", "Listens for 'order.delivered' or 'order.cancelled' to make a chat room read-only"], 'properties': []}

### 21.1.2 Integration Pattern

Event-driven via SNS/SQS.

### 21.1.3 Communication Protocol

Async Messaging

# 22.0.0 Exposed Contracts

## 22.1.0 Public Interfaces

- {'interface': 'IChatGateway', 'methods': [], 'events': ["Emits 'newMessage' to clients in a room", "Receives 'sendMessage' from clients"], 'properties': [], 'consumers': ['REPO-FE-CUST', 'REPO-FE-RIDER', 'REPO-FE-VEND']}

# 23.0.0 Integration Patterns

| Property | Value |
|----------|-------|
| Dependency Injection | Standard NestJS DI. |
| Event Communication | Uses WebSockets for client communication and SNS/S... |
| Data Flow | Receives messages via WSS, persists them, and broa... |
| Error Handling | Handles connection drops and authentication errors... |
| Async Patterns | Heavy use of async/await for message handling. |

# 24.0.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | Leverage NestJS WebSocket Gateways and Adapters (e... |
| Performance Considerations | Optimize for a high number of concurrent, persiste... |
| Security Considerations | Authenticate WebSocket connections using the user'... |
| Testing Approach | End-to-end tests using a WebSocket client library. |

# 25.0.0 Scope Boundaries

## 25.1.0 Must Implement

- Real-time chat for active orders.

## 25.2.0 Must Not Implement

- Ratings, reviews, or support ticket functionality.

## 25.3.0 Extension Points

- Support for quick-reply templates (REQ-1-081).

## 25.4.0 Validation Rules

- Users can only send messages related to orders they are a party to (REQ-1-015).

