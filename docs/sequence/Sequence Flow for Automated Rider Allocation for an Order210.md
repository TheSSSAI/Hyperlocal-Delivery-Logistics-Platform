# 1 Overview

## 1.1 Diagram Id

SEQ-SI-001

## 1.2 Name

Automated Rider Allocation for an Order

## 1.3 Description

When a vendor marks an order as 'Ready for Pickup', the system automatically initiates a process to find and assign the best available delivery rider. The algorithm considers proximity, current load, performance, and batching potential.

## 1.4 Type

🔹 ServiceInteraction

## 1.5 Purpose

To efficiently and fairly dispatch delivery tasks to the rider network, minimizing delivery times and optimizing operational costs as per REQ-FUN-018.

## 1.6 Complexity

High

## 1.7 Priority

🚨 Critical

## 1.8 Frequency

OnDemand

## 1.9 Participants

- REPO-BE-LOGISTICS
- REPO-BE-ORDER
- REPO-FE-RIDER

## 1.10 Key Interactions

- Order Service publishes an 'OrderReadyForPickup' event to an SNS topic.
- Rider Logistics Service consumes this event from its SQS queue.
- The allocation algorithm queries PostGIS for all 'Online' riders within the operational zone of the vendor.
- It then filters and ranks them based on proximity, current load, and performance rating.
- The task is offered to the top-ranked rider via a push notification to their app.
- The rider has 60 seconds to accept or reject the task on their app.
- If the rider accepts, the Logistics Service updates the order/delivery task records and publishes a 'RiderAssigned' event.
- If the rider rejects or the timer expires, the process is repeated with the next-best rider in the ranked list.

## 1.11 Triggers

- An 'OrderReadyForPickup' event is consumed by the Rider Logistics Service.

## 1.12 Outcomes

- A rider is successfully assigned to the order.
- The order status is updated to 'In Transit'.
- The customer and vendor are notified that a rider is on the way.

## 1.13 Business Rules

- Allocation considers rider proximity, current load, performance rating, and potential for order batching (REQ-FUN-018).
- Riders have a configurable time limit (default 60s) to accept tasks (REQ-FUN-013).
- The system re-assigns the task if the rider rejects it (REQ-FUN-018).
- If no rider accepts after 3 attempts, the allocation fails (see SEQ-EH-002).

## 1.14 Error Scenarios

- No 'Online' riders are available in the area.
- The assigned rider rejects the task.
- The process fails to find a rider after multiple attempts, triggering the failure protocol.

## 1.15 Integration Points

- Mapbox API for calculating proximity and routes.
- FCM for sending push notifications.

# 2.0 Details

## 2.1 Diagram Id

SEQ-TRN-002

## 2.2 Name

Admin Validates and Approves/Rejects Migrated Vendor Data

## 2.3 Description

This sequence details the process for an Onboarding Specialist to validate migrated vendor data, compare it against the source file, and either approve it to go live or reject it with a reason. The sequence covers loading the validation data, the approval workflow, the rejection workflow, and downloading associated files. All state-changing actions are recorded in an immutable audit trail as per REQ-NFR-008.

## 2.4 Participants

### 2.4.1 Human Actor

#### 2.4.1.1 Repository Id

OnboardingSpecialist

#### 2.4.1.2 Display Name

Onboarding Specialist

#### 2.4.1.3 Type

🔹 Human Actor

#### 2.4.1.4 Technology

Web Browser

#### 2.4.1.5 Order

1

#### 2.4.1.6 Style

| Property | Value |
|----------|-------|
| Shape | actor |
| Color | #90CAF9 |
| Stereotype | User |

### 2.4.2.0 Client Application

#### 2.4.2.1 Repository Id

REPO-FE-ADMIN

#### 2.4.2.2 Display Name

Administrator Web Dashboard

#### 2.4.2.3 Type

🔹 Client Application

#### 2.4.2.4 Technology

React.js v18.2+

#### 2.4.2.5 Order

2

#### 2.4.2.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #A5D6A7 |
| Stereotype | Frontend |

### 2.4.3.0 API Gateway

#### 2.4.3.1 Repository Id

api-gateway-001

#### 2.4.3.2 Display Name

API Gateway

#### 2.4.3.3 Type

🔹 API Gateway

#### 2.4.3.4 Technology

Amazon API Gateway

#### 2.4.3.5 Order

3

#### 2.4.3.6 Style

| Property | Value |
|----------|-------|
| Shape | boundary |
| Color | #FFAB91 |
| Stereotype | Gateway |

### 2.4.4.0 Microservice

#### 2.4.4.1 Repository Id

vendor-catalog-service-102

#### 2.4.4.2 Display Name

Vendor & Catalog Service

#### 2.4.4.3 Type

🔹 Microservice

#### 2.4.4.4 Technology

NestJS

#### 2.4.4.5 Order

4

#### 2.4.4.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #81D4FA |
| Stereotype | Service |

### 2.4.5.0 Microservice

#### 2.4.5.1 Repository Id

audit-log-service-108

#### 2.4.5.2 Display Name

Audit Log Service

#### 2.4.5.3 Type

🔹 Microservice

#### 2.4.5.4 Technology

NestJS

#### 2.4.5.5 Order

5

#### 2.4.5.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #CE93D8 |
| Stereotype | Service |

### 2.4.6.0 Database

#### 2.4.6.1 Repository Id

postgres-db-302

#### 2.4.6.2 Display Name

PostgreSQL Database

#### 2.4.6.3 Type

🔹 Database

#### 2.4.6.4 Technology

Amazon RDS for PostgreSQL

#### 2.4.6.5 Order

6

#### 2.4.6.6 Style

| Property | Value |
|----------|-------|
| Shape | database |
| Color | #BDBDBD |
| Stereotype | Database |

### 2.4.7.0 Object Storage

#### 2.4.7.1 Repository Id

s3-storage-304

#### 2.4.7.2 Display Name

File Storage (S3)

#### 2.4.7.3 Type

🔹 Object Storage

#### 2.4.7.4 Technology

Amazon S3

#### 2.4.7.5 Order

7

#### 2.4.7.6 Style

| Property | Value |
|----------|-------|
| Shape | database |
| Color | #F48FB1 |
| Stereotype | Storage |

## 2.5.0.0 Interactions

### 2.5.1.0 User Interaction

#### 2.5.1.1 Source Id

OnboardingSpecialist

#### 2.5.1.2 Target Id

REPO-FE-ADMIN

#### 2.5.1.3 Message

1. Navigates to Vendor Profile and selects 'Migration Validation' for a specific batch.

#### 2.5.1.4 Sequence Number

1

#### 2.5.1.5 Type

🔹 User Interaction

#### 2.5.1.6 Is Synchronous

✅ Yes

#### 2.5.1.7 Return Message



#### 2.5.1.8 Has Return

❌ No

#### 2.5.1.9 Is Activation

✅ Yes

#### 2.5.1.10 Technical Details

*No data available*

### 2.5.2.0 API Call

#### 2.5.2.1 Source Id

REPO-FE-ADMIN

#### 2.5.2.2 Target Id

api-gateway-001

#### 2.5.2.3 Message

2. Requests migration batch details and product sample.

#### 2.5.2.4 Sequence Number

2

#### 2.5.2.5 Type

🔹 API Call

#### 2.5.2.6 Is Synchronous

✅ Yes

#### 2.5.2.7 Return Message

5. Returns migration batch DTO.

#### 2.5.2.8 Has Return

✅ Yes

#### 2.5.2.9 Is Activation

✅ Yes

#### 2.5.2.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS/REST |
| Method | GET /api/v1/admin/vendors/{vendorId}/migration-bat... |
| Parameters | Path parameters: vendorId, batchId. Headers: Autho... |
| Authentication | JWT validation required. User must have 'ADMINISTR... |
| Error Handling | 401 Unauthorized, 403 Forbidden, 404 Not Found. |
| Performance | P95 Latency < 200ms. |

### 2.5.3.0 Service Call

#### 2.5.3.1 Source Id

api-gateway-001

#### 2.5.3.2 Target Id

vendor-catalog-service-102

#### 2.5.3.3 Message

3. Forwards validated request to fetch migration data.

#### 2.5.3.4 Sequence Number

3

#### 2.5.3.5 Type

🔹 Service Call

#### 2.5.3.6 Is Synchronous

✅ Yes

#### 2.5.3.7 Return Message

4. Returns migration batch details and product sample data.

#### 2.5.3.8 Has Return

✅ Yes

#### 2.5.3.9 Is Activation

✅ Yes

#### 2.5.3.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTP |
| Method | Internal GET |
| Parameters | Propagated user context and path parameters. |
| Authentication | mTLS via Service Mesh. |
| Error Handling | Propagates 404 if not found; handles internal DB e... |
| Performance |  |

#### 2.5.3.11 Nested Interactions

- {'sourceId': 'vendor-catalog-service-102', 'targetId': 'postgres-db-302', 'message': '3a. SELECT * FROM migration_batches WHERE id = {batchId}; SELECT * FROM products WHERE migration_batch_id = {batchId} LIMIT 20;', 'sequenceNumber': 3.1, 'type': 'Database Query', 'isSynchronous': True, 'returnMessage': '3b. Returns batch metadata and a sample of associated products.', 'hasReturn': True, 'isActivation': True, 'technicalDetails': {'protocol': 'TCP/IP', 'method': 'SQL SELECT', 'parameters': 'Use indexed lookup on batchId.', 'authentication': 'Database credentials from AWS Secrets Manager.', 'errorHandling': 'Handle connection errors and query timeouts.', 'performance': 'Query execution time < 50ms.'}}

### 2.5.4.0 UI Update

#### 2.5.4.1 Source Id

REPO-FE-ADMIN

#### 2.5.4.2 Target Id

OnboardingSpecialist

#### 2.5.4.3 Message

6. Renders 'Migration Validation' page with data, file links, and Approve/Reject buttons.

#### 2.5.4.4 Sequence Number

6

#### 2.5.4.5 Type

🔹 UI Update

#### 2.5.4.6 Is Synchronous

✅ Yes

#### 2.5.4.7 Return Message



#### 2.5.4.8 Has Return

❌ No

#### 2.5.4.9 Is Activation

❌ No

#### 2.5.4.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | N/A |
| Method | React Component Render |
| Parameters | Displays vendor info, paginated product table, and... |
| Authentication | N/A |
| Error Handling | Display user-friendly error message if API call fa... |
| Performance | Page load < 3s as per NFR. |

### 2.5.5.0 User Interaction

#### 2.5.5.1 Source Id

OnboardingSpecialist

#### 2.5.5.2 Target Id

REPO-FE-ADMIN

#### 2.5.5.3 Message

7. Reviews data and clicks 'Approve Migration'.

#### 2.5.5.4 Sequence Number

7

#### 2.5.5.5 Type

🔹 User Interaction

#### 2.5.5.6 Is Synchronous

✅ Yes

#### 2.5.5.7 Return Message



#### 2.5.5.8 Has Return

❌ No

#### 2.5.5.9 Is Activation

✅ Yes

#### 2.5.5.10 Technical Details

*No data available*

### 2.5.6.0 API Call

#### 2.5.6.1 Source Id

REPO-FE-ADMIN

#### 2.5.6.2 Target Id

api-gateway-001

#### 2.5.6.3 Message

8. Submits approval action.

#### 2.5.6.4 Sequence Number

8

#### 2.5.6.5 Type

🔹 API Call

#### 2.5.6.6 Is Synchronous

✅ Yes

#### 2.5.6.7 Return Message

11. Returns 204 No Content.

#### 2.5.6.8 Has Return

✅ Yes

#### 2.5.6.9 Is Activation

✅ Yes

#### 2.5.6.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS/REST |
| Method | POST /api/v1/admin/migration-batches/{batchId}/app... |
| Parameters | Headers: Authorization: Bearer <JWT>. |
| Authentication | JWT validation with Admin role check. |
| Error Handling | 401, 403, 404, 409 Conflict (if already processed)... |
| Performance | P95 Latency < 200ms. |

### 2.5.7.0 Service Call

#### 2.5.7.1 Source Id

api-gateway-001

#### 2.5.7.2 Target Id

vendor-catalog-service-102

#### 2.5.7.3 Message

9. Forwards approval request.

#### 2.5.7.4 Sequence Number

9

#### 2.5.7.5 Type

🔹 Service Call

#### 2.5.7.6 Is Synchronous

✅ Yes

#### 2.5.7.7 Return Message

10. Returns success confirmation.

#### 2.5.7.8 Has Return

✅ Yes

#### 2.5.7.9 Is Activation

✅ Yes

#### 2.5.7.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTP |
| Method | Internal POST |
| Parameters |  |
| Authentication | mTLS |
| Error Handling | Handle database update failures. |
| Performance |  |

#### 2.5.7.11 Nested Interactions

##### 2.5.7.11.1 Database Query

###### 2.5.7.11.1.1 Source Id

vendor-catalog-service-102

###### 2.5.7.11.1.2 Target Id

postgres-db-302

###### 2.5.7.11.1.3 Message

9a. UPDATE migration_batches SET status = 'Approved', approved_by = {userId}, approved_at = NOW() WHERE id = {batchId};

###### 2.5.7.11.1.4 Sequence Number

9.1

###### 2.5.7.11.1.5 Type

🔹 Database Query

###### 2.5.7.11.1.6 Is Synchronous

✅ Yes

###### 2.5.7.11.1.7 Return Message

9b. Confirms successful update.

###### 2.5.7.11.1.8 Has Return

✅ Yes

###### 2.5.7.11.1.9 Is Activation

✅ Yes

###### 2.5.7.11.1.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | TCP/IP |
| Method | SQL UPDATE |
| Parameters | Updates status and audit fields. |
| Authentication | DB Credentials. |
| Error Handling | Handle DB transaction failures. |
| Performance | Query execution time < 30ms. |

##### 2.5.7.11.2.0 Service Call

###### 2.5.7.11.2.1 Source Id

vendor-catalog-service-102

###### 2.5.7.11.2.2 Target Id

audit-log-service-108

###### 2.5.7.11.2.3 Message

9c. Logs approval event.

###### 2.5.7.11.2.4 Sequence Number

9.2

###### 2.5.7.11.2.5 Type

🔹 Service Call

###### 2.5.7.11.2.6 Is Synchronous

❌ No

###### 2.5.7.11.2.7 Return Message



###### 2.5.7.11.2.8 Has Return

❌ No

###### 2.5.7.11.2.9 Is Activation

✅ Yes

###### 2.5.7.11.2.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | Async Event (SQS) or HTTP |
| Method | POST /events |
| Parameters | Payload: { event: 'MIGRATION_APPROVED', actorId: {... |
| Authentication | mTLS |
| Error Handling | Retry on failure, DLQ for persistent errors. |
| Performance | Fire-and-forget. |

### 2.5.8.0.0.0 UI Update

#### 2.5.8.1.0.0 Source Id

REPO-FE-ADMIN

#### 2.5.8.2.0.0 Target Id

OnboardingSpecialist

#### 2.5.8.3.0.0 Message

12. Displays 'Migration Approved' success notification.

#### 2.5.8.4.0.0 Sequence Number

12

#### 2.5.8.5.0.0 Type

🔹 UI Update

#### 2.5.8.6.0.0 Is Synchronous

✅ Yes

#### 2.5.8.7.0.0 Return Message



#### 2.5.8.8.0.0 Has Return

❌ No

#### 2.5.8.9.0.0 Is Activation

❌ No

#### 2.5.8.10.0.0 Technical Details

*No data available*

### 2.5.9.0.0.0 User Interaction

#### 2.5.9.1.0.0 Source Id

OnboardingSpecialist

#### 2.5.9.2.0.0 Target Id

REPO-FE-ADMIN

#### 2.5.9.3.0.0 Message

13. [Alt Flow] Clicks 'Reject Migration', enters reason in modal, and submits.

#### 2.5.9.4.0.0 Sequence Number

13

#### 2.5.9.5.0.0 Type

🔹 User Interaction

#### 2.5.9.6.0.0 Is Synchronous

✅ Yes

#### 2.5.9.7.0.0 Return Message



#### 2.5.9.8.0.0 Has Return

❌ No

#### 2.5.9.9.0.0 Is Activation

✅ Yes

#### 2.5.9.10.0.0 Technical Details

*No data available*

### 2.5.10.0.0.0 API Call

#### 2.5.10.1.0.0 Source Id

REPO-FE-ADMIN

#### 2.5.10.2.0.0 Target Id

api-gateway-001

#### 2.5.10.3.0.0 Message

14. Submits rejection action with reason.

#### 2.5.10.4.0.0 Sequence Number

14

#### 2.5.10.5.0.0 Type

🔹 API Call

#### 2.5.10.6.0.0 Is Synchronous

✅ Yes

#### 2.5.10.7.0.0 Return Message

17. Returns 204 No Content.

#### 2.5.10.8.0.0 Has Return

✅ Yes

#### 2.5.10.9.0.0 Is Activation

✅ Yes

#### 2.5.10.10.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS/REST |
| Method | POST /api/v1/admin/migration-batches/{batchId}/rej... |
| Parameters | Body: { "reason": "Data mismatch..." }. Headers: A... |
| Authentication | JWT validation with Admin role check. |
| Error Handling | 400 Bad Request if reason is missing. 401, 403, 40... |
| Performance | P95 Latency < 200ms. |

### 2.5.11.0.0.0 Service Call

#### 2.5.11.1.0.0 Source Id

api-gateway-001

#### 2.5.11.2.0.0 Target Id

vendor-catalog-service-102

#### 2.5.11.3.0.0 Message

15. Forwards rejection request.

#### 2.5.11.4.0.0 Sequence Number

15

#### 2.5.11.5.0.0 Type

🔹 Service Call

#### 2.5.11.6.0.0 Is Synchronous

✅ Yes

#### 2.5.11.7.0.0 Return Message

16. Returns success confirmation.

#### 2.5.11.8.0.0 Has Return

✅ Yes

#### 2.5.11.9.0.0 Is Activation

✅ Yes

#### 2.5.11.10.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTP |
| Method | Internal POST |
| Parameters |  |
| Authentication | mTLS |
| Error Handling | Validate presence of 'reason' field. Handle DB err... |
| Performance |  |

#### 2.5.11.11.0.0 Nested Interactions

##### 2.5.11.11.1.0 Database Query

###### 2.5.11.11.1.1 Source Id

vendor-catalog-service-102

###### 2.5.11.11.1.2 Target Id

postgres-db-302

###### 2.5.11.11.1.3 Message

15a. UPDATE migration_batches SET status = 'Rejected', rejection_reason = {reason}, approved_by = {userId}, approved_at = NOW() WHERE id = {batchId};

###### 2.5.11.11.1.4 Sequence Number

15.1

###### 2.5.11.11.1.5 Type

🔹 Database Query

###### 2.5.11.11.1.6 Is Synchronous

✅ Yes

###### 2.5.11.11.1.7 Return Message

15b. Confirms successful update.

###### 2.5.11.11.1.8 Has Return

✅ Yes

###### 2.5.11.11.1.9 Is Activation

✅ Yes

###### 2.5.11.11.1.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | TCP/IP |
| Method | SQL UPDATE |
| Parameters | Updates status, reason, and audit fields. |
| Authentication | DB Credentials. |
| Error Handling | Handle DB transaction failures. |
| Performance | Query execution time < 30ms. |

##### 2.5.11.11.2.0 Service Call

###### 2.5.11.11.2.1 Source Id

vendor-catalog-service-102

###### 2.5.11.11.2.2 Target Id

audit-log-service-108

###### 2.5.11.11.2.3 Message

15c. Logs rejection event.

###### 2.5.11.11.2.4 Sequence Number

15.2

###### 2.5.11.11.2.5 Type

🔹 Service Call

###### 2.5.11.11.2.6 Is Synchronous

❌ No

###### 2.5.11.11.2.7 Return Message



###### 2.5.11.11.2.8 Has Return

❌ No

###### 2.5.11.11.2.9 Is Activation

✅ Yes

###### 2.5.11.11.2.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | Async Event (SQS) or HTTP |
| Method | POST /events |
| Parameters | Payload: { event: 'MIGRATION_REJECTED', actorId: {... |
| Authentication | mTLS |
| Error Handling | Retry on failure, DLQ for persistent errors. |
| Performance | Fire-and-forget. |

### 2.5.12.0.0.0 User Interaction

#### 2.5.12.1.0.0 Source Id

OnboardingSpecialist

#### 2.5.12.2.0.0 Target Id

REPO-FE-ADMIN

#### 2.5.12.3.0.0 Message

18. [File Download] Clicks 'Download Source File'.

#### 2.5.12.4.0.0 Sequence Number

18

#### 2.5.12.5.0.0 Type

🔹 User Interaction

#### 2.5.12.6.0.0 Is Synchronous

✅ Yes

#### 2.5.12.7.0.0 Return Message



#### 2.5.12.8.0.0 Has Return

❌ No

#### 2.5.12.9.0.0 Is Activation

✅ Yes

#### 2.5.12.10.0.0 Technical Details

*No data available*

### 2.5.13.0.0.0 API Call

#### 2.5.13.1.0.0 Source Id

REPO-FE-ADMIN

#### 2.5.13.2.0.0 Target Id

api-gateway-001

#### 2.5.13.3.0.0 Message

19. Requests a temporary download URL for the file.

#### 2.5.13.4.0.0 Sequence Number

19

#### 2.5.13.5.0.0 Type

🔹 API Call

#### 2.5.13.6.0.0 Is Synchronous

✅ Yes

#### 2.5.13.7.0.0 Return Message

22. Returns 302 Redirect to pre-signed S3 URL.

#### 2.5.13.8.0.0 Has Return

✅ Yes

#### 2.5.13.9.0.0 Is Activation

✅ Yes

#### 2.5.13.10.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS/REST |
| Method | GET /api/v1/admin/migration-batches/{batchId}/sour... |
| Parameters | Headers: Authorization: Bearer <JWT>. |
| Authentication | JWT validation with Admin role check. |
| Error Handling | 401, 403, 404. |
| Performance |  |

### 2.5.14.0.0.0 Service Call

#### 2.5.14.1.0.0 Source Id

api-gateway-001

#### 2.5.14.2.0.0 Target Id

vendor-catalog-service-102

#### 2.5.14.3.0.0 Message

20. Forwards request for file URL.

#### 2.5.14.4.0.0 Sequence Number

20

#### 2.5.14.5.0.0 Type

🔹 Service Call

#### 2.5.14.6.0.0 Is Synchronous

✅ Yes

#### 2.5.14.7.0.0 Return Message

21. Returns pre-signed S3 URL.

#### 2.5.14.8.0.0 Has Return

✅ Yes

#### 2.5.14.9.0.0 Is Activation

✅ Yes

#### 2.5.14.10.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTP |
| Method | Internal GET |
| Parameters |  |
| Authentication | mTLS |
| Error Handling |  |
| Performance |  |

#### 2.5.14.11.0.0 Nested Interactions

##### 2.5.14.11.1.0 Database Query

###### 2.5.14.11.1.1 Source Id

vendor-catalog-service-102

###### 2.5.14.11.1.2 Target Id

postgres-db-302

###### 2.5.14.11.1.3 Message

20a. SELECT source_file_key FROM migration_batches WHERE id = {batchId};

###### 2.5.14.11.1.4 Sequence Number

20.1

###### 2.5.14.11.1.5 Type

🔹 Database Query

###### 2.5.14.11.1.6 Is Synchronous

✅ Yes

###### 2.5.14.11.1.7 Return Message

20b. Returns S3 object key.

###### 2.5.14.11.1.8 Has Return

✅ Yes

###### 2.5.14.11.1.9 Is Activation

✅ Yes

###### 2.5.14.11.1.10 Technical Details

*No data available*

##### 2.5.14.11.2.0 API Call

###### 2.5.14.11.2.1 Source Id

vendor-catalog-service-102

###### 2.5.14.11.2.2 Target Id

s3-storage-304

###### 2.5.14.11.2.3 Message

20c. Generate pre-signed GET URL for object key.

###### 2.5.14.11.2.4 Sequence Number

20.2

###### 2.5.14.11.2.5 Type

🔹 API Call

###### 2.5.14.11.2.6 Is Synchronous

✅ Yes

###### 2.5.14.11.2.7 Return Message

20d. Returns temporary, secure URL.

###### 2.5.14.11.2.8 Has Return

✅ Yes

###### 2.5.14.11.2.9 Is Activation

✅ Yes

###### 2.5.14.11.2.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | AWS SDK |
| Method | getSignedUrl |
| Parameters | Object key, bucket name, expiration time (e.g., 5 ... |
| Authentication | IAM Role credentials. |
| Error Handling | Handle cases where the object key does not exist. |
| Performance |  |

### 2.5.15.0.0.0 File Download

#### 2.5.15.1.0.0 Source Id

REPO-FE-ADMIN

#### 2.5.15.2.0.0 Target Id

OnboardingSpecialist

#### 2.5.15.3.0.0 Message

23. Browser automatically follows redirect to download the file from S3.

#### 2.5.15.4.0.0 Sequence Number

23

#### 2.5.15.5.0.0 Type

🔹 File Download

#### 2.5.15.6.0.0 Is Synchronous

✅ Yes

#### 2.5.15.7.0.0 Return Message



#### 2.5.15.8.0.0 Has Return

❌ No

#### 2.5.15.9.0.0 Is Activation

❌ No

#### 2.5.15.10.0.0 Technical Details

*No data available*

## 2.6.0.0.0.0 Notes

### 2.6.1.0.0.0 Content

#### 2.6.1.1.0.0 Content

Business Rule BR-TRN-001 Enforcement: The Vendor & Catalog Service API must prevent changing a vendor's status to 'Active' unless the latest 'migration_batch' status is 'Approved'. This logic is enforced in the vendor status update endpoint.

#### 2.6.1.2.0.0 Position

top-right

#### 2.6.1.3.0.0 Participant Id

vendor-catalog-service-102

#### 2.6.1.4.0.0 Sequence Number

7

### 2.6.2.0.0.0 Content

#### 2.6.2.1.0.0 Content

Audit Trail (REQ-NFR-008): All approval and rejection actions are sent to a dedicated, immutable Audit Log Service. This is a critical security and compliance requirement.

#### 2.6.2.2.0.0 Position

bottom-left

#### 2.6.2.3.0.0 Participant Id

audit-log-service-108

#### 2.6.2.4.0.0 Sequence Number

9.2

### 2.6.3.0.0.0 Content

#### 2.6.3.1.0.0 Content

Error Report Download: The flow for downloading the error report (AC-006) is identical to the source file download flow, simply using a different API endpoint (e.g., /error-report) and S3 object key.

#### 2.6.3.2.0.0 Position

bottom-right

#### 2.6.3.3.0.0 Participant Id

s3-storage-304

#### 2.6.3.4.0.0 Sequence Number

18

## 2.7.0.0.0.0 Implementation Guidance

| Property | Value |
|----------|-------|
| Security Requirements | Role-Based Access Control (RBAC) must be strictly ... |
| Performance Targets | The validation page load (Interaction 1-6) must co... |
| Error Handling Strategy | The backend must perform validation on the rejecti... |
| Testing Considerations | End-to-end tests (Cypress) are critical for this f... |
| Monitoring Requirements | Monitor the latency and error rates for the new ad... |
| Deployment Considerations | This feature requires coordinated deployment of th... |

