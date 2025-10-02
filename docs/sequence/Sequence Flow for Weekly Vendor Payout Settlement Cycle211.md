# 1 Overview

## 1.1 Diagram Id

SEQ-BP-003

## 1.2 Name

Weekly Vendor Payout Settlement Cycle

## 1.3 Description

An automated, scheduled business process that calculates each vendor's net earnings for the week, aggregates them, and disburses the final amount to their registered bank account via a bulk payout service.

## 1.4 Type

🔹 BusinessProcess

## 1.5 Purpose

To ensure vendors are paid accurately and on time, maintaining trust and financial integrity of the platform, fulfilling REQ-FUN-021.

## 1.6 Complexity

Critical

## 1.7 Priority

🚨 Critical

## 1.8 Frequency

Weekly

## 1.9 Participants

- REPO-BE-PAYMENTS

## 1.10 Key Interactions

- A scheduled job (Kubernetes CronJob) triggers the weekly settlement process.
- The Payments Service queries its database for all delivered orders within the settlement period not yet paid out.
- For each vendor, it calculates total sales and subtracts the platform's commission based on their configured rate.
- This generates a net payout amount for each vendor.
- The service constructs a bulk payout request with vendor bank details and amounts.
- It submits this request to the RazorpayX bulk payout API.
- The service polls for the status of the payout batch, logging the outcome (success/failure) of each individual transfer.
- Upon completion, vendors can download their weekly financial statement from their dashboard.

## 1.11 Triggers

- A scheduled job that runs at the end of each weekly settlement cycle (e.g., every Monday).

## 1.12 Outcomes

- Vendors receive their weekly earnings in their bank accounts.
- All transactions, commissions, and payouts are logged immutably for auditing.
- Financial statements are generated and made available to vendors.

## 1.13 Business Rules

- Payouts are processed weekly on a T+2 banking day settlement cycle (REQ-FUN-021).
- Commission is calculated based on a configurable percentage of the order subtotal (REQ-BR-004).
- Every payout attempt and its outcome must be logged (REQ-FUN-021).

## 1.14 Error Scenarios

- Vendor's bank details are incorrect, causing an individual transfer to fail.
- The bulk payout API is temporarily unavailable, requiring the job to be retried.
- Discrepancies found during the calculation phase, which should halt the process for that vendor and raise an alert.

## 1.15 Integration Points

- RazorpayX Bulk Payout API (REQ-FUN-021).

# 2.0 Details

## 2.1 Diagram Id

SEQ-ADM-004

## 2.2 Name

Admin Validates Migrated Vendor Data

## 2.3 Description

Implementation sequence for an Onboarding Specialist to review, validate, and either approve or reject a vendor's migrated catalog data. This process ensures data integrity before a vendor is made active on the platform, fulfilling the requirements of user story TRN-002. The sequence covers fetching migration batch details, approving a valid batch, rejecting an invalid batch with a mandatory reason, and ensuring all state changes are recorded in an immutable audit log.

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
| Color | #9063CD |
| Stereotype |  |

### 2.4.2.0 Client Application

#### 2.4.2.1 Repository Id

REPO-FE-ADMIN

#### 2.4.2.2 Display Name

Admin Web Dashboard

#### 2.4.2.3 Type

🔹 Client Application

#### 2.4.2.4 Technology

React.js, Vite

#### 2.4.2.5 Order

2

#### 2.4.2.6 Style

| Property | Value |
|----------|-------|
| Shape | boundary |
| Color | #438DD5 |
| Stereotype | «Frontend» |

### 2.4.3.0 Gateway

#### 2.4.3.1 Repository Id

REPO-BE-GATEWAY

#### 2.4.3.2 Display Name

API Gateway

#### 2.4.3.3 Type

🔹 Gateway

#### 2.4.3.4 Technology

Amazon API Gateway

#### 2.4.3.5 Order

3

#### 2.4.3.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #FFB500 |
| Stereotype | «Gateway» |

### 2.4.4.0 Microservice

#### 2.4.4.1 Repository Id

REPO-BE-VENDOR-CATALOG

#### 2.4.4.2 Display Name

Vendor & Catalog Service

#### 2.4.4.3 Type

🔹 Microservice

#### 2.4.4.4 Technology

NestJS, Node.js

#### 2.4.4.5 Order

4

#### 2.4.4.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #139A43 |
| Stereotype | «Service» |

### 2.4.5.0 Database

#### 2.4.5.1 Repository Id

REPO-INFRA-DB

#### 2.4.5.2 Display Name

PostgreSQL Database

#### 2.4.5.3 Type

🔹 Database

#### 2.4.5.4 Technology

AWS RDS for PostgreSQL

#### 2.4.5.5 Order

5

#### 2.4.5.6 Style

| Property | Value |
|----------|-------|
| Shape | database |
| Color | #6B7D8D |
| Stereotype | «Database» |

### 2.4.6.0 Microservice

#### 2.4.6.1 Repository Id

REPO-BE-AUDIT

#### 2.4.6.2 Display Name

Audit Log Service

#### 2.4.6.3 Type

🔹 Microservice

#### 2.4.6.4 Technology

NestJS, Node.js

#### 2.4.6.5 Order

6

#### 2.4.6.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #139A43 |
| Stereotype | «Service» |

## 2.5.0.0 Interactions

### 2.5.1.0 User Interaction

#### 2.5.1.1 Source Id

OnboardingSpecialist

#### 2.5.1.2 Target Id

REPO-FE-ADMIN

#### 2.5.1.3 Message

1. Navigates to the 'Migration Validation' view for a specific vendor's import batch.

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

| Property | Value |
|----------|-------|
| Protocol | UI Event |
| Method | onClick |
| Parameters | Vendor ID, Batch ID |
| Authentication | N/A |
| Error Handling | N/A |
| Performance | N/A |

### 2.5.2.0 API Request

#### 2.5.2.1 Source Id

REPO-FE-ADMIN

#### 2.5.2.2 Target Id

REPO-BE-GATEWAY

#### 2.5.2.3 Message

2. GET /api/v1/migration-batches/{batchId}

#### 2.5.2.4 Sequence Number

2

#### 2.5.2.5 Type

🔹 API Request

#### 2.5.2.6 Is Synchronous

✅ Yes

#### 2.5.2.7 Return Message

200 OK: MigrationBatchDetailsDTO

#### 2.5.2.8 Has Return

✅ Yes

#### 2.5.2.9 Is Activation

✅ Yes

#### 2.5.2.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS/REST |
| Method | GET |
| Parameters | Path: batchId |
| Authentication | JWT Bearer Token required. Role: 'Onboarding Speci... |
| Error Handling | Handle 401 Unauthorized, 403 Forbidden, 404 Not Fo... |
| Performance | P95 < 3s (as per NFR) |

#### 2.5.2.11 Nested Interactions

- {'sourceId': 'REPO-BE-GATEWAY', 'targetId': 'REPO-BE-VENDOR-CATALOG', 'message': '3. [Proxy] GET /migration-batches/{batchId}', 'sequenceNumber': 3, 'type': 'Service Call', 'isSynchronous': True, 'returnMessage': 'MigrationBatchDetails', 'hasReturn': True, 'isActivation': True, 'technicalDetails': {'protocol': 'HTTP', 'method': 'GET', 'parameters': 'batchId', 'authentication': 'Forwarded JWT / mTLS', 'errorHandling': 'Propagate errors upstream.', 'performance': 'P95 < 2.8s'}, 'nestedInteractions': [{'sourceId': 'REPO-BE-VENDOR-CATALOG', 'targetId': 'REPO-INFRA-DB', 'message': '4. SELECT * FROM migration_batches WHERE id = {batchId}; SELECT * FROM products WHERE batch_id = {batchId} LIMIT 20;', 'sequenceNumber': 4, 'type': 'Database Query', 'isSynchronous': True, 'returnMessage': 'Batch and Product records', 'hasReturn': True, 'isActivation': True, 'technicalDetails': {'protocol': 'TCP/IP', 'method': 'SELECT', 'parameters': 'batchId', 'authentication': 'Database credentials from AWS Secrets Manager.', 'errorHandling': 'Handle DB connection errors, record not found.', 'performance': 'Query must be indexed on batch_id and complete in < 50ms.'}}]}

### 2.5.3.0 UI Update

#### 2.5.3.1 Source Id

REPO-FE-ADMIN

#### 2.5.3.2 Target Id

OnboardingSpecialist

#### 2.5.3.3 Message

5. Renders validation view with profile data, product sample table, and download links.

#### 2.5.3.4 Sequence Number

5

#### 2.5.3.5 Type

🔹 UI Update

#### 2.5.3.6 Is Synchronous

❌ No

#### 2.5.3.7 Return Message



#### 2.5.3.8 Has Return

❌ No

#### 2.5.3.9 Is Activation

❌ No

#### 2.5.3.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | UI Render |
| Method | N/A |
| Parameters | MigrationBatchDetailsDTO |
| Authentication | N/A |
| Error Handling | Display error message if API call fails. |
| Performance | LCP < 2.5s |

### 2.5.4.0 User Interaction

#### 2.5.4.1 Source Id

OnboardingSpecialist

#### 2.5.4.2 Target Id

REPO-FE-ADMIN

#### 2.5.4.3 Message

6. Reviews data and clicks 'Approve Migration'.

#### 2.5.4.4 Sequence Number

6

#### 2.5.4.5 Type

🔹 User Interaction

#### 2.5.4.6 Is Synchronous

✅ Yes

#### 2.5.4.7 Return Message



#### 2.5.4.8 Has Return

❌ No

#### 2.5.4.9 Is Activation

✅ Yes

#### 2.5.4.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | UI Event |
| Method | onClick |
| Parameters | batchId |
| Authentication | N/A |
| Error Handling | N/A |
| Performance | N/A |

### 2.5.5.0 API Request

#### 2.5.5.1 Source Id

REPO-FE-ADMIN

#### 2.5.5.2 Target Id

REPO-BE-GATEWAY

#### 2.5.5.3 Message

7. POST /api/v1/migration-batches/{batchId}/approve

#### 2.5.5.4 Sequence Number

7

#### 2.5.5.5 Type

🔹 API Request

#### 2.5.5.6 Is Synchronous

✅ Yes

#### 2.5.5.7 Return Message

200 OK: { status: 'Approved' }

#### 2.5.5.8 Has Return

✅ Yes

#### 2.5.5.9 Is Activation

✅ Yes

#### 2.5.5.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS/REST |
| Method | POST |
| Parameters | Path: batchId |
| Authentication | JWT Bearer Token required. Role: 'Onboarding Speci... |
| Error Handling | Handle 401, 403, 404, 409 Conflict (if already pro... |
| Performance | P95 < 500ms |

#### 2.5.5.11 Nested Interactions

- {'sourceId': 'REPO-BE-GATEWAY', 'targetId': 'REPO-BE-VENDOR-CATALOG', 'message': '8. [Proxy] POST /migration-batches/{batchId}/approve', 'sequenceNumber': 8, 'type': 'Service Call', 'isSynchronous': True, 'returnMessage': "{ status: 'Approved' }", 'hasReturn': True, 'isActivation': True, 'technicalDetails': {'protocol': 'HTTP', 'method': 'POST', 'parameters': 'batchId', 'authentication': 'Forwarded JWT / mTLS', 'errorHandling': 'Propagate errors upstream.', 'performance': 'P95 < 450ms'}, 'nestedInteractions': [{'sourceId': 'REPO-BE-VENDOR-CATALOG', 'targetId': 'REPO-INFRA-DB', 'message': "9. UPDATE migration_batches SET status = 'Approved', approved_by = {userId}, approved_at = NOW() WHERE id = {batchId};", 'sequenceNumber': 9, 'type': 'Database Query', 'isSynchronous': True, 'returnMessage': 'Update result', 'hasReturn': True, 'isActivation': True, 'technicalDetails': {'protocol': 'TCP/IP', 'method': 'UPDATE', 'parameters': 'batchId, userId', 'authentication': 'Database credentials.', 'errorHandling': 'Transaction must be atomic. Rollback on failure.', 'performance': 'Query < 50ms'}}, {'sourceId': 'REPO-BE-VENDOR-CATALOG', 'targetId': 'REPO-BE-AUDIT', 'message': '10. POST /audit-logs', 'sequenceNumber': 10, 'type': 'Async Service Call', 'isSynchronous': False, 'returnMessage': '', 'hasReturn': False, 'isActivation': True, 'technicalDetails': {'protocol': 'Message Queue (SQS) or Async HTTP', 'method': 'LogEvent', 'parameters': "AuditEvent DTO: { actorId, action: 'MIGRATION_APPROVED', targetId: batchId }", 'authentication': 'Service-to-service IAM role.', 'errorHandling': 'Use Dead-Letter Queue for message delivery failures.', 'performance': 'Fire-and-forget; should not block the user-facing response.'}}]}

### 2.5.6.0 UI Update

#### 2.5.6.1 Source Id

REPO-FE-ADMIN

#### 2.5.6.2 Target Id

OnboardingSpecialist

#### 2.5.6.3 Message

11. Displays 'Migration Approved' success notification.

#### 2.5.6.4 Sequence Number

11

#### 2.5.6.5 Type

🔹 UI Update

#### 2.5.6.6 Is Synchronous

❌ No

#### 2.5.6.7 Return Message



#### 2.5.6.8 Has Return

❌ No

#### 2.5.6.9 Is Activation

❌ No

#### 2.5.6.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | UI Render |
| Method | Toast Notification |
| Parameters | Success message |
| Authentication | N/A |
| Error Handling | N/A |
| Performance | N/A |

## 2.6.0.0 Notes

### 2.6.1.0 Content

#### 2.6.1.1 Content



```
ALTERNATIVE FLOW: Rejecting Migration
Step 6a: User clicks 'Reject Migration', UI displays modal.
Step 7a: POST /api/v1/migration-batches/{batchId}/reject with body { reason: '...' }.
Step 9a: DB Update: SET status = 'Rejected', rejection_reason = '...'.
Step 10a: Audit log is created for 'MIGRATION_REJECTED'.
Step 11a: UI shows 'Migration Rejected' notification.
```

#### 2.6.1.2 Position

bottom

#### 2.6.1.3 Participant Id

REPO-FE-ADMIN

#### 2.6.1.4 Sequence Number

11

### 2.6.2.0 Content

#### 2.6.2.1 Content

BUSINESS RULE: A vendor's status cannot be changed to 'Active' unless their latest migration_batch has status 'Approved'. This logic is enforced within the Vendor & Catalog Service.

#### 2.6.2.2 Position

bottom

#### 2.6.2.3 Participant Id

REPO-BE-VENDOR-CATALOG

#### 2.6.2.4 Sequence Number

9

### 2.6.3.0 Content

#### 2.6.3.1 Content

SECURITY: Download links for source/error files must be pre-signed S3 URLs generated on-demand by the Vendor & Catalog service to prevent unauthorized access to the S3 bucket.

#### 2.6.3.2 Position

bottom

#### 2.6.3.3 Participant Id

REPO-BE-VENDOR-CATALOG

#### 2.6.3.4 Sequence Number

4

## 2.7.0.0 Implementation Guidance

| Property | Value |
|----------|-------|
| Security Requirements | Access to all endpoints must be protected by Role-... |
| Performance Targets | The initial data validation view (including a 20-p... |
| Error Handling Strategy | The backend must perform validation to ensure a re... |
| Testing Considerations | E2E tests (Cypress) are required for the happy pat... |
| Monitoring Requirements | Monitor the latency and error rates for the `/migr... |
| Deployment Considerations | This feature introduces new API endpoints and a ne... |

