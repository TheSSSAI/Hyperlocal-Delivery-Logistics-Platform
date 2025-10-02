# 1 Overview

## 1.1 Diagram Id

SEQ-FF-001

## 1.2 Name

Rider Live Location Tracking and Display

## 1.3 Description

After a rider picks up an order, their mobile application continuously broadcasts their GPS location to the backend. This data is then relayed in near real-time to the customer's mobile application, displaying the rider's position on a map.

## 1.4 Type

🔹 FeatureFlow

## 1.5 Purpose

To provide customers with live visibility into their order's delivery progress, enhancing the user experience as specified in REQ-FUN-008.

## 1.6 Complexity

High

## 1.7 Priority

🔴 High

## 1.8 Frequency

OnDemand

## 1.9 Participants

- REPO-FE-RIDER
- REPO-BE-LOGISTICS
- REPO-FE-CUST

## 1.10 Key Interactions

- Rider app, using device GPS, sends a location payload (lat, long, timestamp, accuracy) to the Logistics Service via a Secure WebSocket (WSS) connection every 5-10 seconds.
- Logistics Service validates the incoming data and persists the rider's last known location in a fast-access store like Redis.
- Logistics Service broadcasts the new location data to the relevant customer's active session via a dedicated, order-specific WebSocket channel.
- Customer app receives the location data and updates the rider's icon on the Mapbox map view.

## 1.11 Triggers

- Rider updates the order status to 'Picked Up' (REQ-FUN-014).

## 1.12 Outcomes

- The customer can see the rider's current location moving on their order tracking screen with latency under 2 seconds.

## 1.13 Business Rules

- Location updates must occur every 5-10 seconds (REQ-FUN-008).
- The end-to-end latency for location updates (rider device to customer device) shall be under 2 seconds (REQ-FUN-008).
- If the GPS signal is lost, the map shall display the last known location with a timestamp (REQ-FUN-008).
- All real-time communication must use Secure WebSockets (WSS) as per REQ-INT-004.

## 1.14 Error Scenarios

- Rider's device loses GPS signal.
- Rider's device loses internet connectivity.
- WebSocket connection drops and needs to be re-established by the client application.

## 1.15 Integration Points

- Mapbox APIs for rendering the map on the client applications (REQ-INT-003).

# 2.0 Details

## 2.1 Diagram Id

SEQ-US-TRN-002

## 2.2 Name

Admin Validates and Approves/Rejects Vendor Data Migration

## 2.3 Description

This sequence details the process for an Onboarding Specialist to review, validate, and either approve or reject a vendor's migrated catalog data via the Admin Dashboard. The process includes fetching migration batch details, comparing with source files, and triggering an immutable audit log for the final action. This flow is a critical control point for ensuring data integrity before a vendor goes live.

## 2.4 Participants

### 2.4.1 Frontend Web Application

#### 2.4.1.1 Repository Id

REPO-FE-ADMIN

#### 2.4.1.2 Display Name

Admin Dashboard

#### 2.4.1.3 Type

🔹 Frontend Web Application

#### 2.4.1.4 Technology

React.js v18.2+, Vite

#### 2.4.1.5 Order

1

#### 2.4.1.6 Style

| Property | Value |
|----------|-------|
| Shape | actor |
| Color | #1E90FF |
| Stereotype | UI |

### 2.4.2.0 API Gateway

#### 2.4.2.1 Repository Id

REPO-GW-MAIN

#### 2.4.2.2 Display Name

API Gateway

#### 2.4.2.3 Type

🔹 API Gateway

#### 2.4.2.4 Technology

Amazon API Gateway

#### 2.4.2.5 Order

2

#### 2.4.2.6 Style

| Property | Value |
|----------|-------|
| Shape | boundary |
| Color | #FF4500 |
| Stereotype | Gateway |

### 2.4.3.0 Microservice

#### 2.4.3.1 Repository Id

REPO-BE-VENDOR-CATALOG

#### 2.4.3.2 Display Name

Vendor & Catalog Service

#### 2.4.3.3 Type

🔹 Microservice

#### 2.4.3.4 Technology

NestJS (Node.js v18.18+)

#### 2.4.3.5 Order

3

#### 2.4.3.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #228B22 |
| Stereotype | Service |

### 2.4.4.0 Database

#### 2.4.4.1 Repository Id

DATABASE-POSTGRES-VEND

#### 2.4.4.2 Display Name

PostgreSQL DB

#### 2.4.4.3 Type

🔹 Database

#### 2.4.4.4 Technology

Amazon RDS for PostgreSQL v15.4+

#### 2.4.4.5 Order

4

#### 2.4.4.6 Style

| Property | Value |
|----------|-------|
| Shape | database |
| Color | #4682B4 |
| Stereotype | DB |

### 2.4.5.0 Messaging

#### 2.4.5.1 Repository Id

MESSAGE-BUS-SNS

#### 2.4.5.2 Display Name

Message Bus

#### 2.4.5.3 Type

🔹 Messaging

#### 2.4.5.4 Technology

AWS SNS/SQS

#### 2.4.5.5 Order

5

#### 2.4.5.6 Style

| Property | Value |
|----------|-------|
| Shape | queue |
| Color | #DAA520 |
| Stereotype | Bus |

### 2.4.6.0 Microservice

#### 2.4.6.1 Repository Id

REPO-BE-AUDIT

#### 2.4.6.2 Display Name

Audit Log Service

#### 2.4.6.3 Type

🔹 Microservice

#### 2.4.6.4 Technology

NestJS (Node.js v18.18+)

#### 2.4.6.5 Order

6

#### 2.4.6.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #800080 |
| Stereotype | Service |

## 2.5.0.0 Interactions

### 2.5.1.0 Request

#### 2.5.1.1 Source Id

REPO-FE-ADMIN

#### 2.5.1.2 Target Id

REPO-GW-MAIN

#### 2.5.1.3 Message

1. GET /api/v1/admin/vendors/{vendorId}/migration-batches/latest

#### 2.5.1.4 Sequence Number

1

#### 2.5.1.5 Type

🔹 Request

#### 2.5.1.6 Is Synchronous

✅ Yes

#### 2.5.1.7 Return Message

200 OK with MigrationBatchDetailsDTO

#### 2.5.1.8 Has Return

✅ Yes

#### 2.5.1.9 Is Activation

✅ Yes

#### 2.5.1.10 Technical Details

##### 2.5.1.10.1 Protocol

HTTPS

##### 2.5.1.10.2 Method

GET

##### 2.5.1.10.3 Parameters

- {'name': 'vendorId', 'type': 'UUID', 'in': 'path'}

##### 2.5.1.10.4 Authentication

Required: Authorization header with Bearer JWT.

##### 2.5.1.10.5 Error Handling

Handles 401 (Unauthorized), 403 (Forbidden), 404 (Not Found).

##### 2.5.1.10.6 Performance

###### 2.5.1.10.6.1 Latency

< 200ms P95

#### 2.5.1.11.0.0 Nested Interactions

- {'sourceId': 'REPO-GW-MAIN', 'targetId': 'REPO-BE-VENDOR-CATALOG', 'message': '2. Forwards authorized request: getLatestMigrationBatch(vendorId)', 'sequenceNumber': 2, 'type': 'Internal Request', 'isSynchronous': True, 'returnMessage': 'Returns MigrationBatchDetailsDTO', 'hasReturn': True, 'isActivation': True, 'technicalDetails': {'protocol': 'HTTP', 'method': 'GET', 'parameters': [{'name': 'vendorId', 'type': 'UUID'}, {'name': 'userContext', 'type': 'Object', 'description': 'User info from JWT'}], 'authentication': 'Service-level authorization via RBAC check (Onboarding Specialist role required).', 'errorHandling': 'Throws NotFoundException, ForbiddenException.', 'performance': {'latency': '< 150ms P95'}}, 'nestedInteractions': [{'sourceId': 'REPO-BE-VENDOR-CATALOG', 'targetId': 'DATABASE-POSTGRES-VEND', 'message': '3. SELECT * FROM migration_batches WHERE vendor_id = ? ORDER BY created_at DESC LIMIT 1; SELECT * FROM products WHERE batch_id = ? LIMIT 20;', 'sequenceNumber': 3, 'type': 'Database Query', 'isSynchronous': True, 'returnMessage': 'Returns migration batch and product sample records.', 'hasReturn': True, 'isActivation': False, 'technicalDetails': {'protocol': 'SQL', 'method': 'SELECT', 'parameters': [], 'authentication': 'N/A (Connection Pooling).', 'errorHandling': 'Handles DB connection errors, query timeouts.', 'performance': {'latency': '< 50ms', 'notes': 'Query must be indexed on vendor_id and created_at.'}}}, {'sourceId': 'REPO-BE-VENDOR-CATALOG', 'targetId': 'REPO-BE-VENDOR-CATALOG', 'message': '4. Generate pre-signed S3 URLs for source and error files.', 'sequenceNumber': 4, 'type': 'Internal Logic', 'isSynchronous': True, 'returnMessage': '', 'hasReturn': False, 'isActivation': False, 'technicalDetails': {'protocol': 'Internal Call', 'method': 's3Service.getSignedUrl()', 'parameters': [], 'authentication': 'N/A', 'errorHandling': 'Logs errors if file keys are not found.', 'performance': {}}}]}

### 2.5.2.0.0.0 Request

#### 2.5.2.1.0.0 Source Id

REPO-FE-ADMIN

#### 2.5.2.2.0.0 Target Id

REPO-GW-MAIN

#### 2.5.2.3.0.0 Message

5. POST /api/v1/admin/migration-batches/{batchId}/approve

#### 2.5.2.4.0.0 Sequence Number

5

#### 2.5.2.5.0.0 Type

🔹 Request

#### 2.5.2.6.0.0 Is Synchronous

✅ Yes

#### 2.5.2.7.0.0 Return Message

204 No Content

#### 2.5.2.8.0.0 Has Return

✅ Yes

#### 2.5.2.9.0.0 Is Activation

✅ Yes

#### 2.5.2.10.0.0 Technical Details

##### 2.5.2.10.1.0 Protocol

HTTPS

##### 2.5.2.10.2.0 Method

POST

##### 2.5.2.10.3.0 Parameters

- {'name': 'batchId', 'type': 'UUID', 'in': 'path'}

##### 2.5.2.10.4.0 Authentication

Required: Authorization header with Bearer JWT.

##### 2.5.2.10.5.0 Error Handling

Handles 401, 403, 404, 409 (Conflict if already processed).

##### 2.5.2.10.6.0 Performance

###### 2.5.2.10.6.1 Latency

< 200ms P95

#### 2.5.2.11.0.0 Nested Interactions

- {'sourceId': 'REPO-GW-MAIN', 'targetId': 'REPO-BE-VENDOR-CATALOG', 'message': '6. Forwards authorized request: approveMigration(batchId, userContext)', 'sequenceNumber': 6, 'type': 'Internal Request', 'isSynchronous': True, 'returnMessage': 'Returns success confirmation.', 'hasReturn': True, 'isActivation': True, 'technicalDetails': {'protocol': 'HTTP', 'method': 'POST', 'parameters': [{'name': 'batchId', 'type': 'UUID'}, {'name': 'userContext', 'type': 'Object'}], 'authentication': 'RBAC check for required role.', 'errorHandling': 'Throws NotFoundException, ConflictException.', 'performance': {}}, 'nestedInteractions': [{'sourceId': 'REPO-BE-VENDOR-CATALOG', 'targetId': 'DATABASE-POSTGRES-VEND', 'message': "7. UPDATE migration_batches SET status = 'APPROVED', approved_by = ?, approved_at = NOW() WHERE id = ?;", 'sequenceNumber': 7, 'type': 'Database Query', 'isSynchronous': True, 'returnMessage': 'Returns update confirmation.', 'hasReturn': True, 'isActivation': False, 'technicalDetails': {'protocol': 'SQL', 'method': 'UPDATE', 'parameters': [], 'authentication': 'N/A.', 'errorHandling': 'Handles DB transaction failures.', 'performance': {'latency': '< 20ms'}}}, {'sourceId': 'REPO-BE-VENDOR-CATALOG', 'targetId': 'MESSAGE-BUS-SNS', 'message': '8. Publish AdminActionOccurred Event', 'sequenceNumber': 8, 'type': 'Event Publication', 'isSynchronous': False, 'returnMessage': '', 'hasReturn': False, 'isActivation': False, 'technicalDetails': {'protocol': 'AWS SNS', 'method': 'Publish', 'parameters': [{'name': 'TopicArn', 'value': 'arn:aws:sns:ap-south-1:*:admin-actions-topic'}, {'name': 'Message', 'type': 'JSON', 'value': "{ eventType: 'MIGRATION_APPROVED', actorId: '...', target: { type: 'MigrationBatch', id: '...' }, timestamp: '...' }"}], 'authentication': 'IAM Role.', 'errorHandling': 'Logs failures to publish, but does not block primary transaction.', 'performance': {}}}]}

### 2.5.3.0.0.0 Event Consumption

#### 2.5.3.1.0.0 Source Id

MESSAGE-BUS-SNS

#### 2.5.3.2.0.0 Target Id

REPO-BE-AUDIT

#### 2.5.3.3.0.0 Message

9. Consumes AdminActionOccurred Event via SQS queue

#### 2.5.3.4.0.0 Sequence Number

9

#### 2.5.3.5.0.0 Type

🔹 Event Consumption

#### 2.5.3.6.0.0 Is Synchronous

❌ No

#### 2.5.3.7.0.0 Return Message



#### 2.5.3.8.0.0 Has Return

❌ No

#### 2.5.3.9.0.0 Is Activation

✅ Yes

#### 2.5.3.10.0.0 Technical Details

##### 2.5.3.10.1.0 Protocol

AWS SQS

##### 2.5.3.10.2.0 Method

ReceiveMessage

##### 2.5.3.10.3.0 Parameters

*No items available*

##### 2.5.3.10.4.0 Authentication

IAM Role.

##### 2.5.3.10.5.0 Error Handling

Uses SQS Dead-Letter Queue (DLQ) after 3 failed processing attempts.

##### 2.5.3.10.6.0 Performance

*No data available*

#### 2.5.3.11.0.0 Nested Interactions

- {'sourceId': 'REPO-BE-AUDIT', 'targetId': 'REPO-BE-AUDIT', 'message': '10. Persist immutable audit log entry', 'sequenceNumber': 10, 'type': 'Internal Logic', 'isSynchronous': True, 'returnMessage': '', 'hasReturn': False, 'isActivation': False, 'technicalDetails': {'protocol': 'Internal Call', 'method': 'auditRepository.create()', 'parameters': [{'name': 'auditEntry', 'type': 'Object'}], 'authentication': 'N/A', 'errorHandling': 'Throws error to trigger SQS retry if persistence fails.', 'performance': {}}}

## 2.6.0.0.0.0 Notes

### 2.6.1.0.0.0 Content

#### 2.6.1.1.0.0 Content



```
**Alternative Flow: Rejection**
- Step 5 becomes: `POST /api/v1/admin/migration-batches/{batchId}/reject` with a JSON body `{ "reason": "..." }`.
- Step 7 becomes: `UPDATE migration_batches SET status = 'REJECTED', reason = ?, ...`
- Step 8 Event payload includes the rejection reason.
```

#### 2.6.1.2.0.0 Position

bottom

#### 2.6.1.3.0.0 Participant Id

*Not specified*

#### 2.6.1.4.0.0 Sequence Number

5

### 2.6.2.0.0.0 Content

#### 2.6.2.1.0.0 Content

The system must prevent a vendor from being activated if their latest migration batch is not in an 'APPROVED' state, enforcing business rule BR-TRN-001.

#### 2.6.2.2.0.0 Position

right

#### 2.6.2.3.0.0 Participant Id

REPO-BE-VENDOR-CATALOG

#### 2.6.2.4.0.0 Sequence Number

7

## 2.7.0.0.0.0 Implementation Guidance

| Property | Value |
|----------|-------|
| Security Requirements | Access to all endpoints must be protected by AWS C... |
| Performance Targets | The initial data loading on the validation page (I... |
| Error Handling Strategy | The API should use standard HTTP error codes: 400 ... |
| Testing Considerations | End-to-end tests (Cypress) should cover the full a... |
| Monitoring Requirements | Monitor the latency and error rate (4xx/5xx) of th... |
| Deployment Considerations | This feature depends on the completion of the bulk... |

