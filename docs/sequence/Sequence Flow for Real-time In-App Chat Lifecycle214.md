# 1 Overview

## 1.1 Diagram Id

SEQ-FF-002

## 1.2 Name

Real-time In-App Chat Lifecycle

## 1.3 Description

Manages the lifecycle of a chat room associated with an active order. A chat room is created when an order is accepted and becomes read-only upon completion, allowing communication between the customer, vendor, and rider.

## 1.4 Type

🔹 FeatureFlow

## 1.5 Purpose

To facilitate direct communication between the three parties of a transaction to resolve issues and provide clarifications related to an active order, as per REQ-FUN-020 and REQ-USR-001.

## 1.6 Complexity

High

## 1.7 Priority

🔴 High

## 1.8 Frequency

OnDemand

## 1.9 Participants

- REPO-BE-CHAT
- REPO-BE-ORDER
- REPO-FE-CUST
- REPO-FE-RIDER
- REPO-FE-VEND

## 1.10 Key Interactions

- The Order Service publishes an 'order.accepted' event.
- The dedicated Chat Service consumes this event and creates a chat room for that orderId, linking the customer and vendor.
- Later, when a 'rider.assigned' event is published, the Chat Service adds the rider to the room.
- Authorized clients (Customer, Vendor, Rider) connect to the room's WebSocket endpoint, authenticating with their JWT.
- A user sends a message via their client's WebSocket connection.
- The Chat Service receives the message, persists it, and broadcasts it to all other participants currently connected to the room.
- The Order Service publishes an 'order.delivered' or 'order.cancelled' event.
- The Chat Service consumes this event and marks the chat room as read-only in its database, preventing new messages.

## 1.11 Triggers

- An order being accepted by a vendor.

## 1.12 Outcomes

- A dedicated, temporary chat channel is available for an active order.
- Chat history is preserved but becomes immutable after the order is completed.

## 1.13 Business Rules

- Users can only create/read messages for active orders they are a party to (REQ-USR-001).
- Chat history becomes read-only upon order completion (REQ-USR-001).
- Administrators have read-only access to all chat logs for support and moderation purposes (REQ-USR-001).

## 1.14 Error Scenarios

- A user's WebSocket connection drops and needs to be re-established.
- A user attempts to send a message to a chat room they are not a part of, which is rejected by the server.

## 1.15 Integration Points

- Listens for events from the Order Management service via SNS/SQS.

# 2.0 Details

## 2.1 Diagram Id

SEQ-FF-002

## 2.2 Name

Implementation: Real-time In-App Chat Lifecycle for Active Orders

## 2.3 Description

Provides a detailed technical specification for the real-time chat feature. The sequence is initiated by an `order.accepted` event from the Order Service, which triggers the Chat Service to create a persistent chat room. Authorized clients connect via a secure WebSocket (WSS) endpoint, authenticating with JWTs. The Chat Service manages message persistence, broadcasting to room participants via a scalable Redis Pub/Sub backplane, and transitions the room to a read-only state upon receiving an order completion event.

## 2.4 Participants

### 2.4.1 Microservice

#### 2.4.1.1 Repository Id

REPO-BE-ORDER

#### 2.4.1.2 Display Name

Order Management Service

#### 2.4.1.3 Type

🔹 Microservice

#### 2.4.1.4 Technology

Node.js (NestJS), PostgreSQL

#### 2.4.1.5 Order

1

#### 2.4.1.6 Style

| Property | Value |
|----------|-------|
| Shape | actor |
| Color | #1E90FF |
| Stereotype | Backend Service |

### 2.4.2.0 Infrastructure

#### 2.4.2.1 Repository Id

aws-sns-sqs

#### 2.4.2.2 Display Name

Messaging Bus

#### 2.4.2.3 Type

🔹 Infrastructure

#### 2.4.2.4 Technology

AWS SNS & SQS

#### 2.4.2.5 Order

2

#### 2.4.2.6 Style

| Property | Value |
|----------|-------|
| Shape | database |
| Color | #FF8C00 |
| Stereotype | Event Bus |

### 2.4.3.0 Microservice

#### 2.4.3.1 Repository Id

REPO-BE-CHAT

#### 2.4.3.2 Display Name

Chat Service

#### 2.4.3.3 Type

🔹 Microservice

#### 2.4.3.4 Technology

NestJS (WebSockets), Redis, PostgreSQL

#### 2.4.3.5 Order

3

#### 2.4.3.6 Style

| Property | Value |
|----------|-------|
| Shape | actor |
| Color | #32CD32 |
| Stereotype | Backend Service |

### 2.4.4.0 Client

#### 2.4.4.1 Repository Id

REPO-FE-CUST

#### 2.4.4.2 Display Name

Customer Client App

#### 2.4.4.3 Type

🔹 Client

#### 2.4.4.4 Technology

React Native

#### 2.4.4.5 Order

4

#### 2.4.4.6 Style

| Property | Value |
|----------|-------|
| Shape | actor |
| Color | #9370DB |
| Stereotype | Mobile Client |

### 2.4.5.0 Client

#### 2.4.5.1 Repository Id

REPO-FE-VEND

#### 2.4.5.2 Display Name

Vendor Web Dashboard

#### 2.4.5.3 Type

🔹 Client

#### 2.4.5.4 Technology

React.js

#### 2.4.5.5 Order

5

#### 2.4.5.6 Style

| Property | Value |
|----------|-------|
| Shape | actor |
| Color | #9370DB |
| Stereotype | Web Client |

### 2.4.6.0 Client

#### 2.4.6.1 Repository Id

REPO-FE-RIDER

#### 2.4.6.2 Display Name

Rider Client App

#### 2.4.6.3 Type

🔹 Client

#### 2.4.6.4 Technology

React Native

#### 2.4.6.5 Order

6

#### 2.4.6.6 Style

| Property | Value |
|----------|-------|
| Shape | actor |
| Color | #9370DB |
| Stereotype | Mobile Client |

## 2.5.0.0 Interactions

### 2.5.1.0 Async Message

#### 2.5.1.1 Source Id

REPO-BE-ORDER

#### 2.5.1.2 Target Id

aws-sns-sqs

#### 2.5.1.3 Message

Publishes `order.accepted` event to 'order-events' SNS Topic

#### 2.5.1.4 Sequence Number

1

#### 2.5.1.5 Type

🔹 Async Message

#### 2.5.1.6 Is Synchronous

❌ No

#### 2.5.1.7 Return Message



#### 2.5.1.8 Has Return

❌ No

#### 2.5.1.9 Is Activation

✅ Yes

#### 2.5.1.10 Technical Details

##### 2.5.1.10.1 Protocol

AWS SDK

##### 2.5.1.10.2 Method

SNS.publish()

##### 2.5.1.10.3 Parameters

###### 2.5.1.10.3.1 TopicArn

####### 2.5.1.10.3.1.1 Name

TopicArn

####### 2.5.1.10.3.1.2 Type

🔹 string

###### 2.5.1.10.3.2.0 Message

####### 2.5.1.10.3.2.1 Name

Message

####### 2.5.1.10.3.2.2 Type

🔹 JSON

####### 2.5.1.10.3.2.3 Schema

{orderId, customerId, vendorId}

###### 2.5.1.10.3.3.0 MessageAttributes

####### 2.5.1.10.3.3.1 Name

MessageAttributes

####### 2.5.1.10.3.3.2 Type

🔹 object

####### 2.5.1.10.3.3.3 Schema

{eventType: 'order.accepted'}

##### 2.5.1.10.4.0.0 Authentication

IAM Role with sns:Publish permissions

##### 2.5.1.10.5.0.0 Error Handling

SDK-managed retries with exponential backoff.

##### 2.5.1.10.6.0.0 Performance

###### 2.5.1.10.6.1.0 Latency

< 50ms

### 2.5.2.0.0.0.0 Async Message

#### 2.5.2.1.0.0.0 Source Id

aws-sns-sqs

#### 2.5.2.2.0.0.0 Target Id

REPO-BE-CHAT

#### 2.5.2.3.0.0.0 Message

Consumes `order.accepted` event from its dedicated SQS queue

#### 2.5.2.4.0.0.0 Sequence Number

2

#### 2.5.2.5.0.0.0 Type

🔹 Async Message

#### 2.5.2.6.0.0.0 Is Synchronous

❌ No

#### 2.5.2.7.0.0.0 Return Message



#### 2.5.2.8.0.0.0 Has Return

❌ No

#### 2.5.2.9.0.0.0 Is Activation

✅ Yes

#### 2.5.2.10.0.0.0 Technical Details

##### 2.5.2.10.1.0.0 Protocol

AWS SDK

##### 2.5.2.10.2.0.0 Method

SQS.receiveMessage()

##### 2.5.2.10.3.0.0 Parameters

*No items available*

##### 2.5.2.10.4.0.0 Authentication

IAM Role with sqs:ReceiveMessage, sqs:DeleteMessage permissions

##### 2.5.2.10.5.0.0 Error Handling

Idempotent consumer logic is required. On failure, message visibility timeout allows for retries before moving to DLQ.

##### 2.5.2.10.6.0.0 Performance

###### 2.5.2.10.6.1.0 Latency

Variable (polling)

#### 2.5.2.11.0.0.0 Nested Interactions

- {'sourceId': 'REPO-BE-CHAT', 'targetId': 'REPO-BE-CHAT', 'message': 'Creates chat room record in DB (orderId, participants=[customerId, vendorId], is_readonly=false)', 'sequenceNumber': 2.1, 'type': 'Internal Logic', 'isSynchronous': True, 'returnMessage': 'Success or DB Error', 'hasReturn': True, 'isActivation': False, 'technicalDetails': {'protocol': 'SQL', 'method': 'INSERT INTO chat_rooms ...', 'parameters': [{'name': 'orderId', 'type': 'UUID'}, {'name': 'participants', 'type': 'JSONB'}], 'authentication': 'Database credentials from AWS Secrets Manager', 'errorHandling': 'Handles unique constraint violations if event is reprocessed.', 'performance': {'latency': '< 10ms'}}}

### 2.5.3.0.0.0.0 Connection Request

#### 2.5.3.1.0.0.0 Source Id

REPO-FE-CUST

#### 2.5.3.2.0.0.0 Target Id

REPO-BE-CHAT

#### 2.5.3.3.0.0.0 Message

Establishes WebSocket connection to /chat?orderId=... with JWT

#### 2.5.3.4.0.0.0 Sequence Number

3

#### 2.5.3.5.0.0.0 Type

🔹 Connection Request

#### 2.5.3.6.0.0.0 Is Synchronous

✅ Yes

#### 2.5.3.7.0.0.0 Return Message

Connection Acknowledged or Error

#### 2.5.3.8.0.0.0 Has Return

✅ Yes

#### 2.5.3.9.0.0.0 Is Activation

✅ Yes

#### 2.5.3.10.0.0.0 Technical Details

##### 2.5.3.10.1.0.0 Protocol

WSS

##### 2.5.3.10.2.0.0 Method

CONNECT

##### 2.5.3.10.3.0.0 Parameters

###### 2.5.3.10.3.1.0 orderId

####### 2.5.3.10.3.1.1 Name

orderId

####### 2.5.3.10.3.1.2 Type

🔹 string (query param)

###### 2.5.3.10.3.2.0 Authorization

####### 2.5.3.10.3.2.1 Name

Authorization

####### 2.5.3.10.3.2.2 Type

🔹 string (header)

####### 2.5.3.10.3.2.3 Value

Bearer <JWT>

##### 2.5.3.10.4.0.0 Authentication

JWT is validated. User ID from token must be a participant in the specified orderId's chat room.

##### 2.5.3.10.5.0.0 Error Handling

Returns 401 Unauthorized if JWT is invalid. Returns 403 Forbidden if user is not a participant.

##### 2.5.3.10.6.0.0 Performance

###### 2.5.3.10.6.1.0 Latency

< 100ms connection handshake

### 2.5.4.0.0.0.0 Connection Request

#### 2.5.4.1.0.0.0 Source Id

REPO-FE-VEND

#### 2.5.4.2.0.0.0 Target Id

REPO-BE-CHAT

#### 2.5.4.3.0.0.0 Message

Establishes WebSocket connection with JWT for the same order

#### 2.5.4.4.0.0.0 Sequence Number

4

#### 2.5.4.5.0.0.0 Type

🔹 Connection Request

#### 2.5.4.6.0.0.0 Is Synchronous

✅ Yes

#### 2.5.4.7.0.0.0 Return Message

Connection Acknowledged or Error

#### 2.5.4.8.0.0.0 Has Return

✅ Yes

#### 2.5.4.9.0.0.0 Is Activation

❌ No

#### 2.5.4.10.0.0.0 Technical Details

##### 2.5.4.10.1.0.0 Protocol

WSS

##### 2.5.4.10.2.0.0 Method

CONNECT

##### 2.5.4.10.3.0.0 Parameters

###### 2.5.4.10.3.1.0 orderId

####### 2.5.4.10.3.1.1 Name

orderId

####### 2.5.4.10.3.1.2 Type

🔹 string (query param)

###### 2.5.4.10.3.2.0 Authorization

####### 2.5.4.10.3.2.1 Name

Authorization

####### 2.5.4.10.3.2.2 Type

🔹 string (header)

####### 2.5.4.10.3.2.3 Value

Bearer <JWT>

##### 2.5.4.10.4.0.0 Authentication

Same JWT validation and participant authorization logic as step 3.

##### 2.5.4.10.5.0.0 Error Handling

Returns 401/403 on failure.

##### 2.5.4.10.6.0.0 Performance

###### 2.5.4.10.6.1.0 Latency

< 100ms

### 2.5.5.0.0.0.0 WebSocket Event

#### 2.5.5.1.0.0.0 Source Id

REPO-FE-CUST

#### 2.5.5.2.0.0.0 Target Id

REPO-BE-CHAT

#### 2.5.5.3.0.0.0 Message

Emits 'sendMessage' event with message payload

#### 2.5.5.4.0.0.0 Sequence Number

5

#### 2.5.5.5.0.0.0 Type

🔹 WebSocket Event

#### 2.5.5.6.0.0.0 Is Synchronous

❌ No

#### 2.5.5.7.0.0.0 Return Message



#### 2.5.5.8.0.0.0 Has Return

❌ No

#### 2.5.5.9.0.0.0 Is Activation

❌ No

#### 2.5.5.10.0.0.0 Technical Details

##### 2.5.5.10.1.0.0 Protocol

WSS

##### 2.5.5.10.2.0.0 Method

EMIT 'sendMessage'

##### 2.5.5.10.3.0.0 Parameters

- {'name': 'payload', 'type': 'JSON', 'schema': "{ message: '...' }"}

##### 2.5.5.10.4.0.0 Authentication

Uses the established authenticated connection.

##### 2.5.5.10.5.0.0 Error Handling

Server validates that room is not read-only. If it is, an 'error' event is emitted back to the sender.

##### 2.5.5.10.6.0.0 Performance

###### 2.5.5.10.6.1.0 Latency

< 20ms to server

### 2.5.6.0.0.0.0 Database Write

#### 2.5.6.1.0.0.0 Source Id

REPO-BE-CHAT

#### 2.5.6.2.0.0.0 Target Id

REPO-BE-CHAT

#### 2.5.6.3.0.0.0 Message

Persists message to `chat_messages` table

#### 2.5.6.4.0.0.0 Sequence Number

6

#### 2.5.6.5.0.0.0 Type

🔹 Database Write

#### 2.5.6.6.0.0.0 Is Synchronous

✅ Yes

#### 2.5.6.7.0.0.0 Return Message

Success

#### 2.5.6.8.0.0.0 Has Return

✅ Yes

#### 2.5.6.9.0.0.0 Is Activation

❌ No

#### 2.5.6.10.0.0.0 Technical Details

##### 2.5.6.10.1.0.0 Protocol

SQL

##### 2.5.6.10.2.0.0 Method

```sql
INSERT INTO chat_messages ...
```

##### 2.5.6.10.3.0.0 Parameters

###### 2.5.6.10.3.1.0 roomId

####### 2.5.6.10.3.1.1 Name

roomId

####### 2.5.6.10.3.1.2 Type

🔹 UUID

###### 2.5.6.10.3.2.0 senderId

####### 2.5.6.10.3.2.1 Name

senderId

####### 2.5.6.10.3.2.2 Type

🔹 UUID

###### 2.5.6.10.3.3.0 content

####### 2.5.6.10.3.3.1 Name

content

####### 2.5.6.10.3.3.2 Type

🔹 TEXT

##### 2.5.6.10.4.0.0 Authentication

Database credentials from AWS Secrets Manager

##### 2.5.6.10.5.0.0 Error Handling

Standard database error handling (e.g., connection issues).

##### 2.5.6.10.6.0.0 Performance

###### 2.5.6.10.6.1.0 Latency

< 15ms

### 2.5.7.0.0.0.0 WebSocket Event

#### 2.5.7.1.0.0.0 Source Id

REPO-BE-CHAT

#### 2.5.7.2.0.0.0 Target Id

REPO-FE-VEND

#### 2.5.7.3.0.0.0 Message

Broadcasts 'newMessage' event to other room participants

#### 2.5.7.4.0.0.0 Sequence Number

7

#### 2.5.7.5.0.0.0 Type

🔹 WebSocket Event

#### 2.5.7.6.0.0.0 Is Synchronous

❌ No

#### 2.5.7.7.0.0.0 Return Message



#### 2.5.7.8.0.0.0 Has Return

❌ No

#### 2.5.7.9.0.0.0 Is Activation

❌ No

#### 2.5.7.10.0.0.0 Technical Details

##### 2.5.7.10.1.0.0 Protocol

WSS

##### 2.5.7.10.2.0.0 Method

BROADCAST 'newMessage'

##### 2.5.7.10.3.0.0 Parameters

- {'name': 'payload', 'type': 'JSON', 'schema': '{ messageId, senderId, content, timestamp }'}

##### 2.5.7.10.4.0.0 Authentication

N/A (server-initiated broadcast on authenticated channel)

##### 2.5.7.10.5.0.0 Error Handling

Client-side logic handles message display.

##### 2.5.7.10.6.0.0 Performance

###### 2.5.7.10.6.1.0 Latency

< 500ms end-to-end delivery

### 2.5.8.0.0.0.0 Async Message

#### 2.5.8.1.0.0.0 Source Id

REPO-BE-ORDER

#### 2.5.8.2.0.0.0 Target Id

aws-sns-sqs

#### 2.5.8.3.0.0.0 Message

Publishes `order.rider_assigned` event

#### 2.5.8.4.0.0.0 Sequence Number

8

#### 2.5.8.5.0.0.0 Type

🔹 Async Message

#### 2.5.8.6.0.0.0 Is Synchronous

❌ No

#### 2.5.8.7.0.0.0 Return Message



#### 2.5.8.8.0.0.0 Has Return

❌ No

#### 2.5.8.9.0.0.0 Is Activation

❌ No

#### 2.5.8.10.0.0.0 Technical Details

##### 2.5.8.10.1.0.0 Protocol

AWS SDK

##### 2.5.8.10.2.0.0 Method

SNS.publish()

##### 2.5.8.10.3.0.0 Parameters

- {'name': 'Message', 'type': 'JSON', 'schema': '{orderId, riderId}'}

##### 2.5.8.10.4.0.0 Authentication

IAM Role

##### 2.5.8.10.5.0.0 Error Handling

Standard SDK retries

##### 2.5.8.10.6.0.0 Performance

###### 2.5.8.10.6.1.0 Latency

< 50ms

### 2.5.9.0.0.0.0 Async Message

#### 2.5.9.1.0.0.0 Source Id

aws-sns-sqs

#### 2.5.9.2.0.0.0 Target Id

REPO-BE-CHAT

#### 2.5.9.3.0.0.0 Message

Consumes `order.rider_assigned` event

#### 2.5.9.4.0.0.0 Sequence Number

9

#### 2.5.9.5.0.0.0 Type

🔹 Async Message

#### 2.5.9.6.0.0.0 Is Synchronous

❌ No

#### 2.5.9.7.0.0.0 Return Message



#### 2.5.9.8.0.0.0 Has Return

❌ No

#### 2.5.9.9.0.0.0 Is Activation

❌ No

#### 2.5.9.10.0.0.0 Technical Details

##### 2.5.9.10.1.0.0 Protocol

AWS SDK

##### 2.5.9.10.2.0.0 Method

SQS.receiveMessage()

##### 2.5.9.10.3.0.0 Parameters

*No items available*

##### 2.5.9.10.4.0.0 Authentication

IAM Role

##### 2.5.9.10.5.0.0 Error Handling

Idempotent consumer logic adds rider to participants array only if not already present.

##### 2.5.9.10.6.0.0 Performance

###### 2.5.9.10.6.1.0 Latency

Variable

#### 2.5.9.11.0.0.0 Nested Interactions

- {'sourceId': 'REPO-BE-CHAT', 'targetId': 'REPO-BE-CHAT', 'message': 'Updates chat room record in DB, adding riderId to participants array', 'sequenceNumber': 9.1, 'type': 'Database Write', 'isSynchronous': True, 'returnMessage': 'Success', 'hasReturn': True, 'isActivation': False, 'technicalDetails': {'protocol': 'SQL', 'method': 'UPDATE chat_rooms SET participants = ...', 'parameters': [{'name': 'orderId', 'type': 'UUID'}, {'name': 'riderId', 'type': 'UUID'}], 'authentication': 'DB Credentials', 'errorHandling': 'Standard DB error handling.', 'performance': {'latency': '< 10ms'}}}

### 2.5.10.0.0.0.0 Connection Request

#### 2.5.10.1.0.0.0 Source Id

REPO-FE-RIDER

#### 2.5.10.2.0.0.0 Target Id

REPO-BE-CHAT

#### 2.5.10.3.0.0.0 Message

Establishes WebSocket connection with JWT for the order

#### 2.5.10.4.0.0.0 Sequence Number

10

#### 2.5.10.5.0.0.0 Type

🔹 Connection Request

#### 2.5.10.6.0.0.0 Is Synchronous

✅ Yes

#### 2.5.10.7.0.0.0 Return Message

Connection Acknowledged or Error

#### 2.5.10.8.0.0.0 Has Return

✅ Yes

#### 2.5.10.9.0.0.0 Is Activation

❌ No

#### 2.5.10.10.0.0.0 Technical Details

##### 2.5.10.10.1.0.0 Protocol

WSS

##### 2.5.10.10.2.0.0 Method

CONNECT

##### 2.5.10.10.3.0.0 Parameters

###### 2.5.10.10.3.1.0 orderId

####### 2.5.10.10.3.1.1 Name

orderId

####### 2.5.10.10.3.1.2 Type

🔹 string (query param)

###### 2.5.10.10.3.2.0 Authorization

####### 2.5.10.10.3.2.1 Name

Authorization

####### 2.5.10.10.3.2.2 Type

🔹 string (header)

####### 2.5.10.10.3.2.3 Value

Bearer <JWT>

##### 2.5.10.10.4.0.0 Authentication

Same JWT validation and participant authorization logic as step 3.

##### 2.5.10.10.5.0.0 Error Handling

Returns 401/403 on failure.

##### 2.5.10.10.6.0.0 Performance

###### 2.5.10.10.6.1.0 Latency

< 100ms

### 2.5.11.0.0.0.0 Async Message

#### 2.5.11.1.0.0.0 Source Id

REPO-BE-ORDER

#### 2.5.11.2.0.0.0 Target Id

aws-sns-sqs

#### 2.5.11.3.0.0.0 Message

Publishes `order.delivered` event

#### 2.5.11.4.0.0.0 Sequence Number

11

#### 2.5.11.5.0.0.0 Type

🔹 Async Message

#### 2.5.11.6.0.0.0 Is Synchronous

❌ No

#### 2.5.11.7.0.0.0 Return Message



#### 2.5.11.8.0.0.0 Has Return

❌ No

#### 2.5.11.9.0.0.0 Is Activation

❌ No

#### 2.5.11.10.0.0.0 Technical Details

##### 2.5.11.10.1.0.0 Protocol

AWS SDK

##### 2.5.11.10.2.0.0 Method

SNS.publish()

##### 2.5.11.10.3.0.0 Parameters

- {'name': 'Message', 'type': 'JSON', 'schema': '{orderId, deliveredAt}'}

##### 2.5.11.10.4.0.0 Authentication

IAM Role

##### 2.5.11.10.5.0.0 Error Handling

Standard SDK retries

##### 2.5.11.10.6.0.0 Performance

###### 2.5.11.10.6.1.0 Latency

< 50ms

### 2.5.12.0.0.0.0 Async Message

#### 2.5.12.1.0.0.0 Source Id

aws-sns-sqs

#### 2.5.12.2.0.0.0 Target Id

REPO-BE-CHAT

#### 2.5.12.3.0.0.0 Message

Consumes `order.delivered` event

#### 2.5.12.4.0.0.0 Sequence Number

12

#### 2.5.12.5.0.0.0 Type

🔹 Async Message

#### 2.5.12.6.0.0.0 Is Synchronous

❌ No

#### 2.5.12.7.0.0.0 Return Message



#### 2.5.12.8.0.0.0 Has Return

❌ No

#### 2.5.12.9.0.0.0 Is Activation

❌ No

#### 2.5.12.10.0.0.0 Technical Details

##### 2.5.12.10.1.0.0 Protocol

AWS SDK

##### 2.5.12.10.2.0.0 Method

SQS.receiveMessage()

##### 2.5.12.10.3.0.0 Parameters

*No items available*

##### 2.5.12.10.4.0.0 Authentication

IAM Role

##### 2.5.12.10.5.0.0 Error Handling

Idempotent consumer logic ensures state is only updated once.

##### 2.5.12.10.6.0.0 Performance

###### 2.5.12.10.6.1.0 Latency

Variable

### 2.5.13.0.0.0.0 Database Write

#### 2.5.13.1.0.0.0 Source Id

REPO-BE-CHAT

#### 2.5.13.2.0.0.0 Target Id

REPO-BE-CHAT

#### 2.5.13.3.0.0.0 Message

Updates chat room record in DB, setting `is_readonly` to true

#### 2.5.13.4.0.0.0 Sequence Number

13

#### 2.5.13.5.0.0.0 Type

🔹 Database Write

#### 2.5.13.6.0.0.0 Is Synchronous

✅ Yes

#### 2.5.13.7.0.0.0 Return Message

Success

#### 2.5.13.8.0.0.0 Has Return

✅ Yes

#### 2.5.13.9.0.0.0 Is Activation

❌ No

#### 2.5.13.10.0.0.0 Technical Details

##### 2.5.13.10.1.0.0 Protocol

SQL

##### 2.5.13.10.2.0.0 Method

```sql
UPDATE chat_rooms SET is_readonly = true WHERE orderId = ...
```

##### 2.5.13.10.3.0.0 Parameters

- {'name': 'orderId', 'type': 'UUID'}

##### 2.5.13.10.4.0.0 Authentication

DB Credentials

##### 2.5.13.10.5.0.0 Error Handling

Standard DB error handling.

##### 2.5.13.10.6.0.0 Performance

###### 2.5.13.10.6.1.0 Latency

< 10ms

## 2.6.0.0.0.0.0 Notes

### 2.6.1.0.0.0.0 Content

#### 2.6.1.1.0.0.0 Content

A Redis Pub/Sub adapter must be used with the NestJS WebSocket gateway to enable message broadcasting across multiple horizontally-scaled instances of the Chat Service.

#### 2.6.1.2.0.0.0 Position

top-right

#### 2.6.1.3.0.0.0 Participant Id

REPO-BE-CHAT

#### 2.6.1.4.0.0.0 Sequence Number

7

### 2.6.2.0.0.0.0 Content

#### 2.6.2.1.0.0.0 Content

All event consumer logic within the Chat Service must be designed to be idempotent to safely handle at-least-once message delivery from SQS, preventing duplicate chat room creation or state changes.

#### 2.6.2.2.0.0.0 Position

bottom-left

#### 2.6.2.3.0.0.0 Participant Id

REPO-BE-CHAT

#### 2.6.2.4.0.0.0 Sequence Number

2

### 2.6.3.0.0.0.0 Content

#### 2.6.3.1.0.0.0 Content

Client applications should implement exponential backoff and retry logic for re-establishing WebSocket connections in case of network interruptions.

#### 2.6.3.2.0.0.0 Position

bottom-right

#### 2.6.3.3.0.0.0 Participant Id

REPO-FE-CUST

#### 2.6.3.4.0.0.0 Sequence Number

3

## 2.7.0.0.0.0.0 Implementation Guidance

| Property | Value |
|----------|-------|
| Security Requirements | WebSocket connection requests MUST be authenticate... |
| Performance Targets | P95 latency for message delivery from one client t... |
| Error Handling Strategy | If a client's WebSocket connection drops, the clie... |
| Testing Considerations | End-to-end tests must utilize a WebSocket client l... |
| Monitoring Requirements | Key Prometheus metrics to monitor are: `websocket_... |
| Deployment Considerations | The Chat Service should be deployed as a separate,... |

