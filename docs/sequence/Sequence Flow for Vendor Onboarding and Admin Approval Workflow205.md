# 1 Overview

## 1.1 Diagram Id

SEQ-BP-001

## 1.2 Name

Vendor Onboarding and Admin Approval Workflow

## 1.3 Description

A prospective vendor initiates registration by submitting their business details and required documents. The account remains in a 'pending_verification' state until a platform administrator reviews the submission, verifies the documents, and manually approves the account, making it active.

## 1.4 Type

🔹 BusinessProcess

## 1.5 Purpose

To ensure that all vendors on the platform are legitimate, licensed, and meet the platform's standards before they can start selling, fulfilling REQ-FUN-001.

## 1.6 Complexity

Medium

## 1.7 Priority

🔴 High

## 1.8 Frequency

OnDemand

## 1.9 Participants

- REPO-FE-VEND
- REPO-BE-CATALOG
- REPO-BE-IDENTITY
- REPO-FE-ADMIN

## 1.10 Key Interactions

- Vendor submits registration form and uploads documents (e.g., GST, FSSAI) via Vendor Dashboard to an S3 pre-signed URL.
- Identity & Catalog services create vendor profile with 'pending_verification' status.
- A notification or task is created for the admin team.
- Admin views the pending vendor's profile and clicks a secure link to download documents from S3 in the Admin Dashboard.
- Admin clicks 'Approve' or 'Reject' on the dashboard.
- Catalog Service updates the vendor's status to 'active' or 'rejected' and logs this administrative action to the audit trail.
- The Notifications Service sends an email/push notification to the vendor about the status change.

## 1.11 Triggers

- A new vendor submits their registration application.

## 1.12 Outcomes

- The vendor's account is either approved and activated, or rejected with a reason.
- An immutable audit trail of the approval/rejection action is created (REQ-USR-001).

## 1.13 Business Rules

- Vendor account status must be 'pending_verification' until approved (REQ-FUN-001).
- Admin approval is a mandatory step for activation.
- Administrative actions that modify data must be logged in an audit trail (REQ-USR-001).

## 1.14 Error Scenarios

- Vendor uploads invalid, unreadable, or expired documents.
- Admin rejects the application due to incomplete information.

## 1.15 Integration Points

- Amazon S3 for secure storage of uploaded vendor documents.

# 2.0 Details

## 2.1 Diagram Id

SEQ-TRN-002

## 2.2 Name

Admin Validation of Migrated Vendor Data

## 2.3 Description

A comprehensive technical sequence detailing the process for an Onboarding Specialist to review, validate, and either approve or reject a vendor's migrated catalog data. This sequence covers fetching migration batch details, interacting with file storage for source file comparison, and the state-changing actions of approval or rejection, including the critical step of recording these actions in an immutable audit trail.

## 2.4 Participants

### 2.4.1 Client Application

#### 2.4.1.1 Repository Id

REPO-FE-ADMIN

#### 2.4.1.2 Display Name

Admin Web Dashboard

#### 2.4.1.3 Type

🔹 Client Application

#### 2.4.1.4 Technology

React.js v18.2+, Vite

#### 2.4.1.5 Order

1

#### 2.4.1.6 Style

| Property | Value |
|----------|-------|
| Shape | actor |
| Color | #D1E8FF |
| Stereotype | <<Frontend>> |

### 2.4.2.0 Microservice

#### 2.4.2.1 Repository Id

REPO-BE-CATALOG

#### 2.4.2.2 Display Name

Vendor & Catalog Service

#### 2.4.2.3 Type

🔹 Microservice

#### 2.4.2.4 Technology

NestJS (TypeScript)

#### 2.4.2.5 Order

2

#### 2.4.2.6 Style

| Property | Value |
|----------|-------|
| Shape | participant |
| Color | #FFF2CC |
| Stereotype | <<Backend>> |

## 2.5.0.0 Interactions

### 2.5.1.0 API Call

#### 2.5.1.1 Source Id

REPO-FE-ADMIN

#### 2.5.1.2 Target Id

REPO-BE-CATALOG

#### 2.5.1.3 Message

1. Request Migration Batch Details for Validation

#### 2.5.1.4 Sequence Number

1

#### 2.5.1.5 Type

🔹 API Call

#### 2.5.1.6 Is Synchronous

✅ Yes

#### 2.5.1.7 Return Message

2. Return Batch Details, Product Sample, and Pre-signed URLs

#### 2.5.1.8 Has Return

✅ Yes

#### 2.5.1.9 Is Activation

✅ Yes

#### 2.5.1.10 Technical Details

##### 2.5.1.10.1 Protocol

HTTPS

##### 2.5.1.10.2 Method

GET /api/v1/admin/vendors/{vendorId}/migration-batches/latest

##### 2.5.1.10.3 Parameters

- {'name': 'Authorization', 'in': 'header', 'description': "JWT Bearer Token with 'Onboarding Specialist' or 'Administrator' role.", 'schema': {'type': 'string'}}

##### 2.5.1.10.4 Authentication

JWT validation via API Gateway, RBAC check within service (REQ-USR-001).

##### 2.5.1.10.5 Error Handling

Returns 401 Unauthorized, 403 Forbidden (insufficient permissions), 404 Not Found (vendor or batch not found).

##### 2.5.1.10.6 Performance

P95 latency must be < 3 seconds as per story NFR.

#### 2.5.1.11.0 Nested Interactions

##### 2.5.1.11.1 Internal Logic

###### 2.5.1.11.1.1 Source Id

REPO-BE-CATALOG

###### 2.5.1.11.1.2 Target Id

REPO-BE-CATALOG

###### 2.5.1.11.1.3 Message

1a. Authorize Admin User (RBAC Check)

###### 2.5.1.11.1.4 Sequence Number

2

###### 2.5.1.11.1.5 Type

🔹 Internal Logic

###### 2.5.1.11.1.6 Is Synchronous

✅ Yes

###### 2.5.1.11.1.7 Has Return

❌ No

###### 2.5.1.11.1.8 Technical Details

| Property | Value |
|----------|-------|
| Protocol | Internal |
| Method | authService.validateRole(['ADMIN', 'ONBOARDING_SPE... |
| Authentication | Internal context propagation. |
| Error Handling | Throws ForbiddenException if validation fails. |

##### 2.5.1.11.2.0 Database Query

###### 2.5.1.11.2.1 Source Id

REPO-BE-CATALOG

###### 2.5.1.11.2.2 Target Id

REPO-BE-CATALOG

###### 2.5.1.11.2.3 Message

1b. Query Database for Migration Batch and Product Sample (AC-001)

###### 2.5.1.11.2.4 Sequence Number

3

###### 2.5.1.11.2.5 Type

🔹 Database Query

###### 2.5.1.11.2.6 Is Synchronous

✅ Yes

###### 2.5.1.11.2.7 Has Return

❌ No

###### 2.5.1.11.2.8 Technical Details

| Property | Value |
|----------|-------|
| Protocol | SQL/TCP |
| Method | SELECT * FROM migration_batches...; SELECT * FROM ... |
| Performance | Query must be optimized with indexes on `batch_id`... |

##### 2.5.1.11.3.0 AWS SDK Call

###### 2.5.1.11.3.1 Source Id

REPO-BE-CATALOG

###### 2.5.1.11.3.2 Target Id

REPO-BE-CATALOG

###### 2.5.1.11.3.3 Message

1c. Generate S3 Pre-signed URLs for source and error files (AC-005, AC-006)

###### 2.5.1.11.3.4 Sequence Number

4

###### 2.5.1.11.3.5 Type

🔹 AWS SDK Call

###### 2.5.1.11.3.6 Is Synchronous

✅ Yes

###### 2.5.1.11.3.7 Has Return

❌ No

###### 2.5.1.11.3.8 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS |
| Method | S3Client.getSignedUrl('getObject', ...) |
| Authentication | Service IAM role with S3 read permissions. |

### 2.5.2.0.0.0 API Call

#### 2.5.2.1.0.0 Source Id

REPO-FE-ADMIN

#### 2.5.2.2.0.0 Target Id

REPO-BE-CATALOG

#### 2.5.2.3.0.0 Message

3. [ALT: Approve Flow] Submit Migration Approval (AC-002)

#### 2.5.2.4.0.0 Sequence Number

5

#### 2.5.2.5.0.0 Type

🔹 API Call

#### 2.5.2.6.0.0 Is Synchronous

✅ Yes

#### 2.5.2.7.0.0 Return Message

4. Confirm Approval Success

#### 2.5.2.8.0.0 Has Return

✅ Yes

#### 2.5.2.9.0.0 Is Activation

✅ Yes

#### 2.5.2.10.0.0 Technical Details

##### 2.5.2.10.1.0 Protocol

HTTPS

##### 2.5.2.10.2.0 Method

POST /api/v1/admin/migration-batches/{batchId}/approve

##### 2.5.2.10.3.0 Parameters

- {'name': 'Authorization', 'in': 'header', 'description': "JWT Bearer Token with 'Onboarding Specialist' or 'Administrator' role.", 'schema': {'type': 'string'}}

##### 2.5.2.10.4.0 Authentication

JWT validation and RBAC check.

##### 2.5.2.10.5.0 Error Handling

Returns 401, 403, 404. Returns 409 Conflict if the batch is not in a 'pending_validation' state.

##### 2.5.2.10.6.0 Performance

P95 latency < 500ms.

#### 2.5.2.11.0.0 Nested Interactions

##### 2.5.2.11.1.0 Database Query

###### 2.5.2.11.1.1 Source Id

REPO-BE-CATALOG

###### 2.5.2.11.1.2 Target Id

REPO-BE-CATALOG

###### 2.5.2.11.1.3 Message

3a. [DB Transaction Start] Update Migration Batch Status

###### 2.5.2.11.1.4 Sequence Number

6

###### 2.5.2.11.1.5 Type

🔹 Database Query

###### 2.5.2.11.1.6 Is Synchronous

✅ Yes

###### 2.5.2.11.1.7 Has Return

❌ No

###### 2.5.2.11.1.8 Technical Details

| Property | Value |
|----------|-------|
| Protocol | SQL/TCP |
| Method | UPDATE migration_batches SET status = 'Approved', ... |
| Authentication | Database credentials from AWS Secrets Manager. |

##### 2.5.2.11.2.0 Database Query

###### 2.5.2.11.2.1 Source Id

REPO-BE-CATALOG

###### 2.5.2.11.2.2 Target Id

REPO-BE-CATALOG

###### 2.5.2.11.2.3 Message

3b. Record Approval Action to Immutable Audit Trail (REQ-NFR-008)

###### 2.5.2.11.2.4 Sequence Number

7

###### 2.5.2.11.2.5 Type

🔹 Database Query

###### 2.5.2.11.2.6 Is Synchronous

✅ Yes

###### 2.5.2.11.2.7 Has Return

❌ No

###### 2.5.2.11.2.8 Technical Details

####### 2.5.2.11.2.8.1 Protocol

SQL/TCP

####### 2.5.2.11.2.8.2 Method

```sql
INSERT INTO admin_audit_log (actor_id, action, target_entity, target_id, details, timestamp);
```

####### 2.5.2.11.2.8.3 Parameters

- {'name': 'details', 'value': "{ 'action': 'APPROVE_MIGRATION', 'batchId': '...', 'vendorId': '...' }"}

##### 2.5.2.11.3.0.0 Database Command

###### 2.5.2.11.3.1.0 Source Id

REPO-BE-CATALOG

###### 2.5.2.11.3.2.0 Target Id

REPO-BE-CATALOG

###### 2.5.2.11.3.3.0 Message

3c. [DB Transaction Commit]

###### 2.5.2.11.3.4.0 Sequence Number

8

###### 2.5.2.11.3.5.0 Type

🔹 Database Command

###### 2.5.2.11.3.6.0 Is Synchronous

✅ Yes

###### 2.5.2.11.3.7.0 Has Return

❌ No

### 2.5.3.0.0.0.0 API Call

#### 2.5.3.1.0.0.0 Source Id

REPO-FE-ADMIN

#### 2.5.3.2.0.0.0 Target Id

REPO-BE-CATALOG

#### 2.5.3.3.0.0.0 Message

5. [ALT: Reject Flow] Submit Migration Rejection with Reason (AC-004)

#### 2.5.3.4.0.0.0 Sequence Number

9

#### 2.5.3.5.0.0.0 Type

🔹 API Call

#### 2.5.3.6.0.0.0 Is Synchronous

✅ Yes

#### 2.5.3.7.0.0.0 Return Message

6. Confirm Rejection Success

#### 2.5.3.8.0.0.0 Has Return

✅ Yes

#### 2.5.3.9.0.0.0 Is Activation

✅ Yes

#### 2.5.3.10.0.0.0 Technical Details

##### 2.5.3.10.1.0.0 Protocol

HTTPS

##### 2.5.3.10.2.0.0 Method

POST /api/v1/admin/migration-batches/{batchId}/reject

##### 2.5.3.10.3.0.0 Parameters

###### 2.5.3.10.3.1.0 Authorization

####### 2.5.3.10.3.1.1 Name

Authorization

####### 2.5.3.10.3.1.2 In

header

####### 2.5.3.10.3.1.3 Description

JWT Bearer Token with 'Onboarding Specialist' or 'Administrator' role.

####### 2.5.3.10.3.1.4 Schema

######## 2.5.3.10.3.1.4.1 Type

🔹 string

###### 2.5.3.10.3.2.0.0 body

####### 2.5.3.10.3.2.1.0 Name

body

####### 2.5.3.10.3.2.2.0 In

body

####### 2.5.3.10.3.2.3.0 Schema

######## 2.5.3.10.3.2.3.1 Type

🔹 object

######## 2.5.3.10.3.2.3.2 Properties

| Property | Value |
|----------|-------|
| Reason | {'type': 'string', 'description': 'Mandatory reason for rejection.'} |

######## 2.5.3.10.3.2.3.3 Required

- reason

##### 2.5.3.10.4.0.0.0 Authentication

JWT validation and RBAC check.

##### 2.5.3.10.5.0.0.0 Error Handling

Returns 400 Bad Request if 'reason' is missing or empty (BR-TRN-002). Returns 401, 403, 404, 409.

##### 2.5.3.10.6.0.0.0 Performance

P95 latency < 500ms.

#### 2.5.3.11.0.0.0.0 Nested Interactions

##### 2.5.3.11.1.0.0.0 Database Query

###### 2.5.3.11.1.1.0.0 Source Id

REPO-BE-CATALOG

###### 2.5.3.11.1.2.0.0 Target Id

REPO-BE-CATALOG

###### 2.5.3.11.1.3.0.0 Message

5a. [DB Transaction Start] Update Migration Batch Status

###### 2.5.3.11.1.4.0.0 Sequence Number

10

###### 2.5.3.11.1.5.0.0 Type

🔹 Database Query

###### 2.5.3.11.1.6.0.0 Is Synchronous

✅ Yes

###### 2.5.3.11.1.7.0.0 Has Return

❌ No

###### 2.5.3.11.1.8.0.0 Technical Details

####### 2.5.3.11.1.8.1.0 Protocol

SQL/TCP

####### 2.5.3.11.1.8.2.0 Method

```sql
UPDATE migration_batches SET status = 'Rejected', rejection_reason = ?, rejected_by = ?, rejected_at = NOW() WHERE id = ?;
```

##### 2.5.3.11.2.0.0.0 Database Query

###### 2.5.3.11.2.1.0.0 Source Id

REPO-BE-CATALOG

###### 2.5.3.11.2.2.0.0 Target Id

REPO-BE-CATALOG

###### 2.5.3.11.2.3.0.0 Message

5b. Record Rejection Action to Immutable Audit Trail (REQ-NFR-008)

###### 2.5.3.11.2.4.0.0 Sequence Number

11

###### 2.5.3.11.2.5.0.0 Type

🔹 Database Query

###### 2.5.3.11.2.6.0.0 Is Synchronous

✅ Yes

###### 2.5.3.11.2.7.0.0 Has Return

❌ No

###### 2.5.3.11.2.8.0.0 Technical Details

####### 2.5.3.11.2.8.1.0 Protocol

SQL/TCP

####### 2.5.3.11.2.8.2.0 Method

```sql
INSERT INTO admin_audit_log (actor_id, action, target_entity, target_id, details, timestamp);
```

####### 2.5.3.11.2.8.3.0 Parameters

- {'name': 'details', 'value': "{ 'action': 'REJECT_MIGRATION', 'batchId': '...', 'vendorId': '...', 'reason': '...' }"}

##### 2.5.3.11.3.0.0.0 Database Command

###### 2.5.3.11.3.1.0.0 Source Id

REPO-BE-CATALOG

###### 2.5.3.11.3.2.0.0 Target Id

REPO-BE-CATALOG

###### 2.5.3.11.3.3.0.0 Message

5c. [DB Transaction Commit]

###### 2.5.3.11.3.4.0.0 Sequence Number

12

###### 2.5.3.11.3.5.0.0 Type

🔹 Database Command

###### 2.5.3.11.3.6.0.0 Is Synchronous

✅ Yes

###### 2.5.3.11.3.7.0.0 Has Return

❌ No

## 2.6.0.0.0.0.0.0 Notes

### 2.6.1.0.0.0.0.0 Content

#### 2.6.1.1.0.0.0.0 Content

Business Rule (BR-TRN-001): The Vendor & Catalog Service must prevent a vendor's primary status from being set to 'Active' unless their latest migration batch has a status of 'Approved'. This logic is enforced in the vendor status update endpoint.

#### 2.6.1.2.0.0.0.0 Position

bottom

#### 2.6.1.3.0.0.0.0 Participant Id

REPO-BE-CATALOG

#### 2.6.1.4.0.0.0.0 Sequence Number

4

### 2.6.2.0.0.0.0.0 Content

#### 2.6.2.1.0.0.0.0 Content

UI Flow: Upon fetching data in Step 2, the frontend renders the validation view. The user then performs an action (approve/reject), which triggers either Step 3 or Step 5. The two ALT flows are mutually exclusive.

#### 2.6.2.2.0.0.0.0 Position

top

#### 2.6.2.3.0.0.0.0 Participant Id

REPO-FE-ADMIN

#### 2.6.2.4.0.0.0.0 Sequence Number

3

## 2.7.0.0.0.0.0.0 Implementation Guidance

| Property | Value |
|----------|-------|
| Security Requirements | Access to all endpoints must be strictly controlle... |
| Performance Targets | The initial data loading (Step 1-2) must complete ... |
| Error Handling Strategy | The backend must use distinct HTTP status codes fo... |
| Testing Considerations | End-to-end tests (Cypress) are critical for both t... |
| Monitoring Requirements | Monitor the latency and error rates (4xx, 5xx) of ... |
| Deployment Considerations | This feature requires a database migration to add ... |

