# 1 Overview

## 1.1 Diagram Id

SEQ-CF-002

## 1.2 Name

User Data Erasure Request (DPDP Compliance)

## 1.3 Description

A user requests the deletion of their account, triggering the 'Right to Erasure' process. The system anonymizes the user's Personally Identifiable Information (PII) in historical records while preserving non-personal transactional data required for financial audits.

## 1.4 Type

🔹 ComplianceFlow

## 1.5 Purpose

To comply with India's Digital Personal Data Protection Act (DPDP), 2023, specifically the right to erasure, as detailed in REQ-CON-001.

## 1.6 Complexity

High

## 1.7 Priority

🔴 High

## 1.8 Frequency

OnDemand

## 1.9 Participants

- REPO-FE-CUST
- REPO-BE-IDENTITY
- REPO-BE-ORDER

## 1.10 Key Interactions

- User initiates account deletion from their profile settings.
- The UI informs the user about which transactional data will be retained in an anonymized form.
- Upon confirmation, a request is sent to the Identity Service.
- The Identity Service deactivates the user's account and publishes a 'UserErasureRequested' event.
- The Identity Service and Order Service consume this event.
- Each service initiates an asynchronous job that finds all records containing the user's PII.
- In the Users table, PII fields (name, phone, address) are overwritten with generic placeholders like 'Deleted User' or NULL.
- In historical Orders tables, fields like delivery_address and customer_name are similarly anonymized.
- Non-personal data like order items, amounts, timestamps, and foreign keys to anonymized users are preserved.

## 1.11 Triggers

- A user confirms their request for account and data erasure.

## 1.12 Outcomes

- The user's PII is permanently anonymized across the platform's databases.
- The user can no longer be identified from historical transaction data.
- The platform remains compliant with financial audit requirements.

## 1.13 Business Rules

- The right to erasure must be implemented by anonymizing PII, not by cascading deletes (REQ-CON-001).
- Non-personal transactional data must be preserved for financial audits (REQ-CON-001).
- The user must be informed about the data retention policy during the erasure process (REQ-CON-001).

## 1.14 Error Scenarios

- The anonymization job fails midway, requiring a robust retry or state-tracking mechanism to ensure completion.

## 1.15 Integration Points

- All microservices that store PII (Identity, Order Management, etc.) must subscribe to the erasure event.

# 2.0 Details

## 2.1 Diagram Id

SEQ-TRN-002

## 2.2 Name

Admin Onboarding Specialist Validates Migrated Vendor Data

## 2.3 Description

Implementation-ready sequence diagram detailing the process for an Onboarding Specialist to review, validate, and approve or reject a vendor's migrated catalog data. This flow ensures data integrity before a vendor is activated on the platform and satisfies the auditability requirements of REQ-NFR-008.

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
| Stereotype | User |

### 2.4.2.0 Frontend Application

#### 2.4.2.1 Repository Id

REPO-FE-ADMIN

#### 2.4.2.2 Display Name

Admin Web Dashboard

#### 2.4.2.3 Type

🔹 Frontend Application

#### 2.4.2.4 Technology

React.js, Vite

#### 2.4.2.5 Order

2

#### 2.4.2.6 Style

| Property | Value |
|----------|-------|
| Shape | boundary |
| Color | #1E90FF |
| Stereotype | FE |

### 2.4.3.0 API Gateway

#### 2.4.3.1 Repository Id

REPO-BE-API-GATEWAY

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
| Color | #FF8C00 |
| Stereotype | GW |

### 2.4.4.0 Microservice

#### 2.4.4.1 Repository Id

REPO-BE-VEND

#### 2.4.4.2 Display Name

Vendor & Catalog Service

#### 2.4.4.3 Type

🔹 Microservice

#### 2.4.4.4 Technology

NestJS, PostgreSQL

#### 2.4.4.5 Order

4

#### 2.4.4.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #2E8B57 |
| Stereotype | Service |

### 2.4.5.0 Microservice

#### 2.4.5.1 Repository Id

REPO-BE-AUDIT

#### 2.4.5.2 Display Name

Audit Log Service

#### 2.4.5.3 Type

🔹 Microservice

#### 2.4.5.4 Technology

NestJS, PostgreSQL

#### 2.4.5.5 Order

5

#### 2.4.5.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #A52A2A |
| Stereotype | Service |

### 2.4.6.0 Object Storage

#### 2.4.6.1 Repository Id

REPO-S3-FILES

#### 2.4.6.2 Display Name

File Storage (S3)

#### 2.4.6.3 Type

🔹 Object Storage

#### 2.4.6.4 Technology

Amazon S3

#### 2.4.6.5 Order

6

#### 2.4.6.6 Style

| Property | Value |
|----------|-------|
| Shape | database |
| Color | #4682B4 |
| Stereotype | Storage |

## 2.5.0.0 Interactions

### 2.5.1.0 User Interaction

#### 2.5.1.1 Source Id

OnboardingSpecialist

#### 2.5.1.2 Target Id

REPO-FE-ADMIN

#### 2.5.1.3 Message

1. Navigates to Vendor Profile and clicks 'Validate Migration' for the latest data import batch.

#### 2.5.1.4 Sequence Number

1

#### 2.5.1.5 Type

🔹 User Interaction

#### 2.5.1.6 Is Synchronous

✅ Yes

#### 2.5.1.7 Has Return

❌ No

#### 2.5.1.8 Is Activation

✅ Yes

### 2.5.2.0 API Request

#### 2.5.2.1 Source Id

REPO-FE-ADMIN

#### 2.5.2.2 Target Id

REPO-BE-API-GATEWAY

#### 2.5.2.3 Message

2. GET /v1/vendors/{vendorId}/migrations/latest

#### 2.5.2.4 Sequence Number

2

#### 2.5.2.5 Type

🔹 API Request

#### 2.5.2.6 Is Synchronous

✅ Yes

#### 2.5.2.7 Return Message

7. 200 OK with MigrationBatchDetailsDTO

#### 2.5.2.8 Has Return

✅ Yes

#### 2.5.2.9 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS/REST |
| Method | GET |
| Parameters | Path: vendorId |
| Authentication | Bearer {JWT} |
| Error Handling | Handle 401, 403, 404, 5xx responses. |
| Performance | P95 Latency < 300ms |

### 2.5.3.0 Internal Request

#### 2.5.3.1 Source Id

REPO-BE-API-GATEWAY

#### 2.5.3.2 Target Id

REPO-BE-VEND

#### 2.5.3.3 Message

3. Forward validated GET request.

#### 2.5.3.4 Sequence Number

3

#### 2.5.3.5 Type

🔹 Internal Request

#### 2.5.3.6 Is Synchronous

✅ Yes

#### 2.5.3.7 Return Message

6. Return MigrationBatchDetailsDTO

#### 2.5.3.8 Has Return

✅ Yes

#### 2.5.3.9 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTP |
| Method | GET |
| Parameters | User context from JWT |
| Authentication | mTLS via Service Mesh |
| Error Handling | Circuit breaker for service unavailability. |
| Performance | P95 Latency < 200ms |

#### 2.5.3.10 Nested Interactions

##### 2.5.3.10.1 Database Query

###### 2.5.3.10.1.1 Source Id

REPO-BE-VEND

###### 2.5.3.10.1.2 Target Id

REPO-BE-VEND

###### 2.5.3.10.1.3 Message

4. Retrieve Migration Batch details and a sample of associated products from PostgreSQL database.

###### 2.5.3.10.1.4 Sequence Number

4

###### 2.5.3.10.1.5 Type

🔹 Database Query

###### 2.5.3.10.1.6 Is Synchronous

✅ Yes

###### 2.5.3.10.1.7 Has Return

❌ No

###### 2.5.3.10.1.8 Technical Details

| Property | Value |
|----------|-------|
| Protocol | SQL |
| Method | SELECT |
| Parameters | vendorId, status='pending_validation' |
| Authentication | IAM DB Authentication |
| Error Handling | Handle query failures, connection errors. |
| Performance | Query time < 50ms |

##### 2.5.3.10.2.0 API Call

###### 2.5.3.10.2.1 Source Id

REPO-BE-VEND

###### 2.5.3.10.2.2 Target Id

REPO-S3-FILES

###### 2.5.3.10.2.3 Message

5. Generate pre-signed URLs for source and error report files using AWS SDK.

###### 2.5.3.10.2.4 Sequence Number

5

###### 2.5.3.10.2.5 Type

🔹 API Call

###### 2.5.3.10.2.6 Is Synchronous

✅ Yes

###### 2.5.3.10.2.7 Return Message

Pre-signed URLs with short TTL (e.g., 15 mins)

###### 2.5.3.10.2.8 Has Return

✅ Yes

###### 2.5.3.10.2.9 Technical Details

| Property | Value |
|----------|-------|
| Protocol | AWS SDK |
| Method | getSignedUrl |
| Parameters | Bucket, Key, ExpiresIn |
| Authentication | IAM Role for Service Account (IRSA) |
| Error Handling | Handle SDK errors, missing file keys. |
| Performance | P95 Latency < 100ms |

### 2.5.4.0.0.0 UI Update

#### 2.5.4.1.0.0 Source Id

REPO-FE-ADMIN

#### 2.5.4.2.0.0 Target Id

OnboardingSpecialist

#### 2.5.4.3.0.0 Message

8. Renders 'Migration Validation' view with data, sample products, and download links.

#### 2.5.4.4.0.0 Sequence Number

8

#### 2.5.4.5.0.0 Type

🔹 UI Update

#### 2.5.4.6.0.0 Is Synchronous

✅ Yes

#### 2.5.4.7.0.0 Has Return

❌ No

### 2.5.5.0.0.0 User Interaction

#### 2.5.5.1.0.0 Source Id

OnboardingSpecialist

#### 2.5.5.2.0.0 Target Id

REPO-FE-ADMIN

#### 2.5.5.3.0.0 Message

9. Reviews data, confirms accuracy, and clicks 'Approve Migration'.

#### 2.5.5.4.0.0 Sequence Number

9

#### 2.5.5.5.0.0 Type

🔹 User Interaction

#### 2.5.5.6.0.0 Is Synchronous

✅ Yes

#### 2.5.5.7.0.0 Has Return

❌ No

### 2.5.6.0.0.0 API Request

#### 2.5.6.1.0.0 Source Id

REPO-FE-ADMIN

#### 2.5.6.2.0.0 Target Id

REPO-BE-API-GATEWAY

#### 2.5.6.3.0.0 Message

10. PUT /v1/migrations/{batchId}/approve

#### 2.5.6.4.0.0 Sequence Number

10

#### 2.5.6.5.0.0 Type

🔹 API Request

#### 2.5.6.6.0.0 Is Synchronous

✅ Yes

#### 2.5.6.7.0.0 Return Message

15. 200 OK

#### 2.5.6.8.0.0 Has Return

✅ Yes

#### 2.5.6.9.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS/REST |
| Method | PUT |
| Parameters | Path: batchId |
| Authentication | Bearer {JWT} |
| Error Handling | Handle 401, 403, 404, 5xx responses. |
| Performance | P95 Latency < 500ms |

### 2.5.7.0.0.0 Internal Request

#### 2.5.7.1.0.0 Source Id

REPO-BE-API-GATEWAY

#### 2.5.7.2.0.0 Target Id

REPO-BE-VEND

#### 2.5.7.3.0.0 Message

11. Forward validated PUT request.

#### 2.5.7.4.0.0 Sequence Number

11

#### 2.5.7.5.0.0 Type

🔹 Internal Request

#### 2.5.7.6.0.0 Is Synchronous

✅ Yes

#### 2.5.7.7.0.0 Return Message

14. Return 200 OK

#### 2.5.7.8.0.0 Has Return

✅ Yes

#### 2.5.7.9.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTP |
| Method | PUT |
| Parameters | User context from JWT for audit |
| Authentication | mTLS via Service Mesh |
| Error Handling | Circuit breaker pattern. |
| Performance | P95 Latency < 400ms |

### 2.5.8.0.0.0 Database Update

#### 2.5.8.1.0.0 Source Id

REPO-BE-VEND

#### 2.5.8.2.0.0 Target Id

REPO-BE-VEND

#### 2.5.8.3.0.0 Message

12. Update migration batch status to 'Approved' in PostgreSQL.

#### 2.5.8.4.0.0 Sequence Number

12

#### 2.5.8.5.0.0 Type

🔹 Database Update

#### 2.5.8.6.0.0 Is Synchronous

✅ Yes

#### 2.5.8.7.0.0 Has Return

❌ No

#### 2.5.8.8.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | SQL |
| Method | UPDATE migration_batches SET status='Approved', ap... |
| Parameters | batchId, userId |
| Authentication | IAM DB Authentication |
| Error Handling | Transaction rollback on failure. |
| Performance | Query time < 30ms |

### 2.5.9.0.0.0 Async API Call

#### 2.5.9.1.0.0 Source Id

REPO-BE-VEND

#### 2.5.9.2.0.0 Target Id

REPO-BE-AUDIT

#### 2.5.9.3.0.0 Message

13. POST /v1/logs (Async)

#### 2.5.9.4.0.0 Sequence Number

13

#### 2.5.9.5.0.0 Type

🔹 Async API Call

#### 2.5.9.6.0.0 Is Synchronous

❌ No

#### 2.5.9.7.0.0 Has Return

❌ No

#### 2.5.9.8.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS/REST (or Message Queue) |
| Method | POST |
| Parameters | Body: AuditLogDTO { event: 'MigrationApproved', ac... |
| Authentication | mTLS via Service Mesh |
| Error Handling | Request is queued; consumer retries on failure. |
| Performance | Fire-and-forget; response not awaited. |

### 2.5.10.0.0.0 UI Update

#### 2.5.10.1.0.0 Source Id

REPO-FE-ADMIN

#### 2.5.10.2.0.0 Target Id

OnboardingSpecialist

#### 2.5.10.3.0.0 Message

16. Displays 'Migration Approved' success notification.

#### 2.5.10.4.0.0 Sequence Number

16

#### 2.5.10.5.0.0 Type

🔹 UI Update

#### 2.5.10.6.0.0 Is Synchronous

✅ Yes

#### 2.5.10.7.0.0 Has Return

❌ No

#### 2.5.10.8.0.0 Is Activation

❌ No

## 2.6.0.0.0.0 Notes

### 2.6.1.0.0.0 Content

#### 2.6.1.1.0.0 Content

File Download: The user's browser directly downloads the file from S3 using the pre-signed URL provided in Step 7. This traffic does not go through the application backend services.

#### 2.6.1.2.0.0 Position

bottom

#### 2.6.1.3.0.0 Participant Id

REPO-S3-FILES

#### 2.6.1.4.0.0 Sequence Number

8

### 2.6.2.0.0.0 Content

#### 2.6.2.1.0.0 Content

Rejection Flow (Alternative): If specialist clicks 'Reject', the UI presents a modal for a mandatory reason. The request to `/reject` includes this reason. The Vendor Service updates the status to 'Rejected', stores the reason, and fires a 'MigrationRejected' audit event.

#### 2.6.2.2.0.0 Position

bottom

#### 2.6.2.3.0.0 Participant Id

REPO-FE-ADMIN

#### 2.6.2.4.0.0 Sequence Number

9

### 2.6.3.0.0.0 Content

#### 2.6.3.1.0.0 Content

RBAC Enforcement: The API Gateway and Vendor Service must validate that the JWT belongs to a user with the 'Onboarding Specialist' or 'Administrator' role before processing any request.

#### 2.6.3.2.0.0 Position

top

#### 2.6.3.3.0.0 Participant Id

REPO-BE-API-GATEWAY

#### 2.6.3.4.0.0 Sequence Number

3

## 2.7.0.0.0.0 Implementation Guidance

| Property | Value |
|----------|-------|
| Security Requirements | Access to the validation endpoints must be strictl... |
| Performance Targets | The initial validation page load, including API ca... |
| Error Handling Strategy | If a migration batch is not found for the vendor, ... |
| Testing Considerations | E2E tests (Cypress) are required for the full vali... |
| Monitoring Requirements | Monitor the latency and error rate (4xx, 5xx) of t... |
| Deployment Considerations | The database schema changes for the `migration_bat... |

