# 1 Overview

## 1.1 Diagram Id

SEQ-CF-003

## 1.2 Name

Automated Vendor License Expiry Check

## 1.3 Description

A scheduled, automated process that checks for vendor licenses nearing expiration, sends reminder notifications, and automatically prevents vendors with expired licenses from accepting new orders.

## 1.4 Type

🔹 ComplianceFlow

## 1.5 Purpose

To ensure platform compliance and prevent unlicensed vendors from operating.

## 1.6 Complexity

Medium

## 1.7 Priority

🔴 High

## 1.8 Frequency

Daily

## 1.9 Participants

- REPO-BE-CATALOG
- REPO-BE-NOTIFS

## 1.10 Key Interactions

- A daily scheduled job is triggered in the Vendor & Catalog Service.
- The job queries for all vendors whose licenses expire in 30, 15, or 7 days.
- For each match, it triggers the Notifications Service to send a reminder email/push notification to the vendor.
- The job also queries for vendors whose licenses are already expired.
- For expired vendors, it updates their store status to 'offline' or 'suspended'.
- This status change is logged in an audit trail.

## 1.11 Triggers

- A daily scheduled cron job.

## 1.12 Outcomes

- Vendors receive timely reminders to renew their licenses.
- Vendors with expired licenses are automatically prevented from taking new orders.
- The platform avoids regulatory risk.

## 1.13 Business Rules

- Reminders are sent 30, 15, and 7 days before expiry (REQ-CON-001).
- Vendors are automatically blocked from accepting orders if their license is expired (REQ-CON-001).

## 1.14 Error Scenarios

- The notification service fails to send a reminder.
- A vendor's status fails to update correctly.

## 1.15 Integration Points

- Scheduled job orchestrator (e.g., Kubernetes CronJob).

# 2.0 Details

## 2.1 Diagram Id

SEQ-TRN-002

## 2.2 Name

Onboarding Specialist Vendor Data Migration Validation

## 2.3 Description

A detailed sequence for the manual validation of migrated vendor data by an Onboarding Specialist. This sequence covers fetching migration data, downloading source files for comparison, and the critical path for approving a migration, which includes state updates and immutable audit logging. This is a security-sensitive and data-integrity critical flow.

## 2.4 Participants

### 2.4.1 Actor

#### 2.4.1.1 Repository Id

OnboardingSpecialist

#### 2.4.1.2 Display Name

Onboarding Specialist

#### 2.4.1.3 Type

🔹 Actor

#### 2.4.1.4 Technology

Human User

#### 2.4.1.5 Order

1

#### 2.4.1.6 Style

| Property | Value |
|----------|-------|
| Shape | actor |
| Color | #9A7B4F |
| Stereotype |  |

### 2.4.2.0 Client Application

#### 2.4.2.1 Repository Id

REPO-FE-ADMIN

#### 2.4.2.2 Display Name

Admin Web Dashboard

#### 2.4.2.3 Type

🔹 Client Application

#### 2.4.2.4 Technology

React.js v18.2+

#### 2.4.2.5 Order

2

#### 2.4.2.6 Style

| Property | Value |
|----------|-------|
| Shape | boundary |
| Color | #1E90FF |
| Stereotype | <<Frontend>> |

### 2.4.3.0 API Gateway

#### 2.4.3.1 Repository Id

REPO-GW-API

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
| Shape | component |
| Color | #FF4500 |
| Stereotype | <<Gateway>> |

### 2.4.4.0 Microservice

#### 2.4.4.1 Repository Id

REPO-BE-CATALOG

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
| Color | #2E8B57 |
| Stereotype | <<Service>> |

### 2.4.5.0 Infrastructure

#### 2.4.5.1 Repository Id

REPO-INFRA-S3

#### 2.4.5.2 Display Name

File Storage (S3)

#### 2.4.5.3 Type

🔹 Infrastructure

#### 2.4.5.4 Technology

Amazon S3

#### 2.4.5.5 Order

5

#### 2.4.5.6 Style

| Property | Value |
|----------|-------|
| Shape | database |
| Color | #8A2BE2 |
| Stereotype | <<Storage>> |

### 2.4.6.0 Microservice

#### 2.4.6.1 Repository Id

REPO-BE-AUDIT

#### 2.4.6.2 Display Name

Audit Log Service

#### 2.4.6.3 Type

🔹 Microservice

#### 2.4.6.4 Technology

NestJS

#### 2.4.6.5 Order

6

#### 2.4.6.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #A52A2A |
| Stereotype | <<Service>> |

## 2.5.0.0 Interactions

### 2.5.1.0 User Interaction

#### 2.5.1.1 Source Id

OnboardingSpecialist

#### 2.5.1.2 Target Id

REPO-FE-ADMIN

#### 2.5.1.3 Message

1. Navigates to Vendor Migration Validation page for a specific vendor batch.

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
| Method | onClick, onNavigate |
| Parameters | vendorId, migrationBatchId |
| Authentication | Assumes an active, authenticated UI session. |
| Error Handling | N/A |
| Performance | N/A |

### 2.5.2.0 API Request

#### 2.5.2.1 Source Id

REPO-FE-ADMIN

#### 2.5.2.2 Target Id

REPO-GW-API

#### 2.5.2.3 Message

2. GET /api/v1/migrations/{batchId}/validation

#### 2.5.2.4 Sequence Number

2

#### 2.5.2.5 Type

🔹 API Request

#### 2.5.2.6 Is Synchronous

✅ Yes

#### 2.5.2.7 Return Message

200 OK with ValidationDataDTO

#### 2.5.2.8 Has Return

✅ Yes

#### 2.5.2.9 Is Activation

✅ Yes

#### 2.5.2.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS |
| Method | GET |
| Parameters | Path: batchId. Headers: Authorization: Bearer <JWT... |
| Authentication | JWT Bearer Token is sent in Authorization header. |
| Error Handling | Handles 401/403/404/5xx responses from the gateway... |
| Performance | Page must load within 3 seconds. |

### 2.5.3.0 Service Invocation

#### 2.5.3.1 Source Id

REPO-GW-API

#### 2.5.3.2 Target Id

REPO-BE-CATALOG

#### 2.5.3.3 Message

3. Forwards GET request after auth check.

#### 2.5.3.4 Sequence Number

3

#### 2.5.3.5 Type

🔹 Service Invocation

#### 2.5.3.6 Is Synchronous

✅ Yes

#### 2.5.3.7 Return Message

Returns service response.

#### 2.5.3.8 Has Return

✅ Yes

#### 2.5.3.9 Is Activation

✅ Yes

#### 2.5.3.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS |
| Method | GET |
| Parameters | Full request object with validated JWT claims. |
| Authentication | Validates JWT signature and role claims ('Onboardi... |
| Error Handling | Routes valid requests; returns appropriate error c... |
| Performance | Adds < 50ms latency. |

### 2.5.4.0 Database Query

#### 2.5.4.1 Source Id

REPO-BE-CATALOG

#### 2.5.4.2 Target Id

REPO-BE-CATALOG

#### 2.5.4.3 Message

4. Retrieves migration batch details and product sample from database.

#### 2.5.4.4 Sequence Number

4

#### 2.5.4.5 Type

🔹 Database Query

#### 2.5.4.6 Is Synchronous

✅ Yes

#### 2.5.4.7 Return Message

Returns migration batch and product data.

#### 2.5.4.8 Has Return

✅ Yes

#### 2.5.4.9 Is Activation

❌ No

#### 2.5.4.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | SQL/TCP |
| Method | SELECT |
| Parameters | batchId. Queries `migration_batches` and `products... |
| Authentication | Uses pooled database credentials from AWS Secrets ... |
| Error Handling | Throws internal server error on query failure. |
| Performance | Queries must be optimized to return within 200ms. |

### 2.5.5.0 Service Response

#### 2.5.5.1 Source Id

REPO-BE-CATALOG

#### 2.5.5.2 Target Id

REPO-GW-API

#### 2.5.5.3 Message

5. Returns ValidationDataDTO (vendor info, product sample, file URLs).

#### 2.5.5.4 Sequence Number

5

#### 2.5.5.5 Type

🔹 Service Response

#### 2.5.5.6 Is Synchronous

✅ Yes

#### 2.5.5.7 Return Message



#### 2.5.5.8 Has Return

❌ No

#### 2.5.5.9 Is Activation

❌ No

#### 2.5.5.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS |
| Method | 200 OK |
| Parameters | JSON Body: { vendor: {...}, products: [...], sourc... |
| Authentication | N/A |
| Error Handling | Returns 404 if batchId is not found. |
| Performance | N/A |

### 2.5.6.0 API Response

#### 2.5.6.1 Source Id

REPO-GW-API

#### 2.5.6.2 Target Id

REPO-FE-ADMIN

#### 2.5.6.3 Message

6. Relays success response.

#### 2.5.6.4 Sequence Number

6

#### 2.5.6.5 Type

🔹 API Response

#### 2.5.6.6 Is Synchronous

✅ Yes

#### 2.5.6.7 Return Message



#### 2.5.6.8 Has Return

❌ No

#### 2.5.6.9 Is Activation

❌ No

#### 2.5.6.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS |
| Method | 200 OK |
| Parameters | JSON Body: ValidationDataDTO |
| Authentication | N/A |
| Error Handling | N/A |
| Performance | N/A |

### 2.5.7.0 User Interaction

#### 2.5.7.1 Source Id

OnboardingSpecialist

#### 2.5.7.2 Target Id

REPO-FE-ADMIN

#### 2.5.7.3 Message

7. Reviews data and clicks 'Approve Migration'.

#### 2.5.7.4 Sequence Number

7

#### 2.5.7.5 Type

🔹 User Interaction

#### 2.5.7.6 Is Synchronous

✅ Yes

#### 2.5.7.7 Return Message



#### 2.5.7.8 Has Return

❌ No

#### 2.5.7.9 Is Activation

❌ No

#### 2.5.7.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | UI Event |
| Method | onClick |
| Parameters | N/A |
| Authentication | N/A |
| Error Handling | UI button should be disabled until data loads. |
| Performance | N/A |

### 2.5.8.0 API Request

#### 2.5.8.1 Source Id

REPO-FE-ADMIN

#### 2.5.8.2 Target Id

REPO-GW-API

#### 2.5.8.3 Message

8. POST /api/v1/migrations/{batchId}/approve

#### 2.5.8.4 Sequence Number

8

#### 2.5.8.5 Type

🔹 API Request

#### 2.5.8.6 Is Synchronous

✅ Yes

#### 2.5.8.7 Return Message

200 OK

#### 2.5.8.8 Has Return

✅ Yes

#### 2.5.8.9 Is Activation

✅ Yes

#### 2.5.8.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS |
| Method | POST |
| Parameters | Path: batchId. Headers: Authorization: Bearer <JWT... |
| Authentication | JWT Bearer Token is sent in Authorization header. |
| Error Handling | Handles 401/403/404/5xx responses. Displays succes... |
| Performance | N/A |

### 2.5.9.0 Service Invocation

#### 2.5.9.1 Source Id

REPO-GW-API

#### 2.5.9.2 Target Id

REPO-BE-CATALOG

#### 2.5.9.3 Message

9. Forwards POST request after auth check.

#### 2.5.9.4 Sequence Number

9

#### 2.5.9.5 Type

🔹 Service Invocation

#### 2.5.9.6 Is Synchronous

✅ Yes

#### 2.5.9.7 Return Message

Returns service response.

#### 2.5.9.8 Has Return

✅ Yes

#### 2.5.9.9 Is Activation

✅ Yes

#### 2.5.9.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS |
| Method | POST |
| Parameters | Full request object with validated JWT claims. |
| Authentication | Re-validates JWT and role claims. |
| Error Handling | Returns error codes on failure. |
| Performance | Adds < 50ms latency. |

### 2.5.10.0 Database Transaction

#### 2.5.10.1 Source Id

REPO-BE-CATALOG

#### 2.5.10.2 Target Id

REPO-BE-CATALOG

#### 2.5.10.3 Message

10. Updates migration batch status to 'Approved' in database transaction.

#### 2.5.10.4 Sequence Number

10

#### 2.5.10.5 Type

🔹 Database Transaction

#### 2.5.10.6 Is Synchronous

✅ Yes

#### 2.5.10.7 Return Message

Transaction committed successfully.

#### 2.5.10.8 Has Return

✅ Yes

#### 2.5.10.9 Is Activation

❌ No

#### 2.5.10.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | SQL/TCP |
| Method | BEGIN; UPDATE...; COMMIT; |
| Parameters | UPDATE migration_batches SET status = 'Approved', ... |
| Authentication | Database connection credentials. |
| Error Handling | Rollbacks transaction on any failure. |
| Performance | Transaction should complete in < 100ms. |

#### 2.5.10.11 Nested Interactions

- {'sourceId': 'REPO-BE-CATALOG', 'targetId': 'REPO-BE-AUDIT', 'message': '10.1. Logs approval event to immutable audit trail.', 'sequenceNumber': 10.1, 'type': 'Asynchronous Service Invocation', 'isSynchronous': False, 'returnMessage': '', 'hasReturn': False, 'isActivation': True, 'technicalDetails': {'protocol': 'Message Queue (SQS/SNS) or direct HTTPS', 'method': 'POST /audit-logs', 'parameters': "Payload: { actorId: 'userId', action: 'APPROVE_MIGRATION', target: 'batchId', timestamp: '...', outcome: 'SUCCESS' }", 'authentication': 'mTLS or IAM role-based.', 'errorHandling': 'Uses Dead-Letter Queue (DLQ) for message failures.', 'performance': 'N/A (Async)'}}

### 2.5.11.0 Service Response

#### 2.5.11.1 Source Id

REPO-BE-CATALOG

#### 2.5.11.2 Target Id

REPO-GW-API

#### 2.5.11.3 Message

11. Returns 200 OK success response.

#### 2.5.11.4 Sequence Number

11

#### 2.5.11.5 Type

🔹 Service Response

#### 2.5.11.6 Is Synchronous

✅ Yes

#### 2.5.11.7 Return Message



#### 2.5.11.8 Has Return

❌ No

#### 2.5.11.9 Is Activation

❌ No

#### 2.5.11.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS |
| Method | 200 OK |
| Parameters | Empty JSON body. |
| Authentication | N/A |
| Error Handling | N/A |
| Performance | N/A |

### 2.5.12.0 API Response

#### 2.5.12.1 Source Id

REPO-GW-API

#### 2.5.12.2 Target Id

REPO-FE-ADMIN

#### 2.5.12.3 Message

12. Relays 200 OK.

#### 2.5.12.4 Sequence Number

12

#### 2.5.12.5 Type

🔹 API Response

#### 2.5.12.6 Is Synchronous

✅ Yes

#### 2.5.12.7 Return Message



#### 2.5.12.8 Has Return

❌ No

#### 2.5.12.9 Is Activation

❌ No

#### 2.5.12.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS |
| Method | 200 OK |
| Parameters | Empty JSON body. |
| Authentication | N/A |
| Error Handling | N/A |
| Performance | N/A |

## 2.6.0.0 Notes

### 2.6.1.0 Content

#### 2.6.1.1 Content

RBAC Enforcement (REQ-USR-001): Access to this entire flow is restricted to users with 'Onboarding Specialist' or 'Administrator' roles. Checks are performed at the API Gateway and re-verified at the Vendor & Catalog Service.

#### 2.6.1.2 Position

Top

#### 2.6.1.3 Participant Id

*Not specified*

#### 2.6.1.4 Sequence Number

*Not specified*

### 2.6.2.0 Content

#### 2.6.2.1 Content

Audit Trail (REQ-NFR-008): The approval action (Step 10.1) must be logged in a dedicated, immutable audit trail, capturing the actor, action, target, and timestamp. The same applies to rejection.

#### 2.6.2.2 Position

Bottom

#### 2.6.2.3 Participant Id

REPO-BE-AUDIT

#### 2.6.2.4 Sequence Number

10.1

### 2.6.3.0 Content

#### 2.6.3.1 Content

Rejection Flow (AC-003, AC-004): If the user clicks 'Reject', the frontend must display a modal to capture a mandatory reason. The API call would be POST /migrations/{batchId}/reject with a { reason: '...' } payload. The service must validate the presence of the reason.

#### 2.6.3.2 Position

Bottom

#### 2.6.3.3 Participant Id

*Not specified*

#### 2.6.3.4 Sequence Number

7

### 2.6.4.0 Content

#### 2.6.4.1 Content

File Download (AC-005): The frontend should provide links to download the source and error (if any) files. The backend generates secure, short-lived, pre-signed URLs from S3 to facilitate this without exposing file storage directly.

#### 2.6.4.2 Position

Middle

#### 2.6.4.3 Participant Id

REPO-INFRA-S3

#### 2.6.4.4 Sequence Number

4

## 2.7.0.0 Implementation Guidance

| Property | Value |
|----------|-------|
| Security Requirements | Role-Based Access Control must be strictly enforce... |
| Performance Targets | The initial page load for the validation view (Ste... |
| Error Handling Strategy | The backend must use specific HTTP status codes: 4... |
| Testing Considerations | End-to-end tests must cover: 1) A successful appro... |
| Monitoring Requirements | All approval and rejection events should be logged... |
| Deployment Considerations | This feature depends on the existence of the bulk ... |

