# 1 Overview

## 1.1 Diagram Id

SEQ-UJ-002

## 1.2 Name

Data Migration Validation by Onboarding Team

## 1.3 Description

An internal Onboarding Specialist reviews the results of a bulk data import for a new vendor. They compare a sample of the migrated data against the original source file within the Admin Dashboard and then either approve it to go live or reject it.

## 1.4 Type

🔹 UserJourney

## 1.5 Purpose

To ensure data integrity for new vendors and prevent incorrect information from being published on the platform, as required by the data migration validation strategy (REQ-TRN-002).

## 1.6 Complexity

Medium

## 1.7 Priority

🔴 High

## 1.8 Frequency

OnDemand

## 1.9 Participants

- REPO-FE-ADMIN
- REPO-BE-CATALOG

## 1.10 Key Interactions

- Onboarding Specialist logs into the Admin Dashboard.
- They navigate to a vendor's profile whose catalog has recently been imported via CSV.
- They access the 'Migration Validation' view for the specific import batch.
- The UI displays vendor details and a sample of at least 20 migrated products.
- The specialist clicks a link to download the original source CSV file from S3 for comparison.
- If the import had partial failures, a warning and a link to the error report are displayed.
- After confirming data accuracy, the specialist clicks 'Approve Migration'.
- The Catalog Service updates the migration batch status to 'Approved' and records this action in the immutable audit trail.

## 1.11 Triggers

- A vendor's bulk catalog import has completed, requiring manual verification before activation.

## 1.12 Outcomes

- The data migration is formally approved, allowing the vendor to be activated.
- Or, the migration is rejected, requiring the vendor to submit a corrected file.

## 1.13 Business Rules

- A migration must be explicitly approved via this process before a vendor's status can be changed to 'Active' (BR-TRN-001).
- A reason is mandatory when rejecting a data migration (BR-TRN-002).

## 1.14 Error Scenarios

- Specialist finds discrepancies and rejects the migration, providing a reason in a modal.
- The import had partial failures, and the specialist reviews the error report before deciding.

## 1.15 Integration Points

- Amazon S3 to retrieve the original source file and any generated error reports.
- Audit Log Service to record the approval/rejection action (REQ-NFR-008).

# 2.0 Details

## 2.1 Diagram Id

SEQ-UJ-002-IMPL

## 2.2 Name

Implementation: Data Migration Validation by Onboarding Team

## 2.3 Description

Technical sequence for an Onboarding Specialist validating a vendor's bulk data import via the Admin Dashboard. This includes fetching migration batch details, comparing with the source file from S3, and executing an approval or rejection action, which is recorded in an immutable audit log.

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
| Color | #90A4AE |
| Stereotype | User |

### 2.4.2.0 Frontend Application

#### 2.4.2.1 Repository Id

REPO-FE-ADMIN

#### 2.4.2.2 Display Name

Admin Dashboard

#### 2.4.2.3 Type

🔹 Frontend Application

#### 2.4.2.4 Technology

React.js v18.2+, Vite, React Query

#### 2.4.2.5 Order

2

#### 2.4.2.6 Style

| Property | Value |
|----------|-------|
| Shape | boundary |
| Color | #42A5F5 |
| Stereotype | Client |

### 2.4.3.0 Microservice

#### 2.4.3.1 Repository Id

REPO-BE-CATALOG

#### 2.4.3.2 Display Name

Vendor & Catalog Service

#### 2.4.3.3 Type

🔹 Microservice

#### 2.4.3.4 Technology

NestJS v10.3+, PostgreSQL v15.4, TypeORM

#### 2.4.3.5 Order

3

#### 2.4.3.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #26A69A |
| Stereotype | Backend |

## 2.5.0.0 Interactions

### 2.5.1.0 User Interaction

#### 2.5.1.1 Source Id

OnboardingSpecialist

#### 2.5.1.2 Target Id

REPO-FE-ADMIN

#### 2.5.1.3 Message

1. Navigates to Vendor Profile -> 'Migration Validation' view for a specific batch.

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
| Protocol | UI Navigation |
| Method | React Router navigation to /vendors/:vendorId/migr... |
| Parameters | URL parameters: vendorId, batchId |
| Authentication | Assumes an active, authenticated session (JWT pres... |
| Error Handling | React Router handles invalid routes with a 'Not Fo... |
| Performance | Page transition should be immediate. |

### 2.5.2.0 API Call

#### 2.5.2.1 Source Id

REPO-FE-ADMIN

#### 2.5.2.2 Target Id

REPO-BE-CATALOG

#### 2.5.2.3 Message

2. [useEffect/useQuery] GET /api/v1/migrations/:batchId/validation-details

#### 2.5.2.4 Sequence Number

2

#### 2.5.2.5 Type

🔹 API Call

#### 2.5.2.6 Is Synchronous

✅ Yes

#### 2.5.2.7 Return Message

3. 200 OK with ValidationDetailsDTO

#### 2.5.2.8 Has Return

✅ Yes

#### 2.5.2.9 Is Activation

✅ Yes

#### 2.5.2.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS |
| Method | GET |
| Parameters | batchId (from URL) |
| Authentication | JWT Bearer token sent in 'Authorization' header. R... |
| Error Handling | 403 Forbidden (insufficient permissions), 404 Not ... |
| Performance | SLA: P95 < 200ms. Backend uses pagination for prod... |

### 2.5.3.0 User Interaction

#### 2.5.3.1 Source Id

OnboardingSpecialist

#### 2.5.3.2 Target Id

REPO-FE-ADMIN

#### 2.5.3.3 Message

4. Clicks 'Download Source File' link.

#### 2.5.3.4 Sequence Number

4

#### 2.5.3.5 Type

🔹 User Interaction

#### 2.5.3.6 Is Synchronous

✅ Yes

#### 2.5.3.7 Return Message



#### 2.5.3.8 Has Return

❌ No

#### 2.5.3.9 Is Activation

❌ No

#### 2.5.3.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | UI Event |
| Method | onClick |
| Parameters | N/A |
| Authentication | N/A |
| Error Handling | Button is disabled until download URL is fetched. |
| Performance | N/A |

### 2.5.4.0 API Call

#### 2.5.4.1 Source Id

REPO-FE-ADMIN

#### 2.5.4.2 Target Id

REPO-BE-CATALOG

#### 2.5.4.3 Message

5. GET /api/v1/migrations/:batchId/source-file-url

#### 2.5.4.4 Sequence Number

5

#### 2.5.4.5 Type

🔹 API Call

#### 2.5.4.6 Is Synchronous

✅ Yes

#### 2.5.4.7 Return Message

6. 200 OK with { presignedUrl: '...' }

#### 2.5.4.8 Has Return

✅ Yes

#### 2.5.4.9 Is Activation

✅ Yes

#### 2.5.4.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS |
| Method | GET |
| Parameters | batchId |
| Authentication | JWT Bearer token. |
| Error Handling | 404 if file not found in S3, 500 for S3 API errors... |
| Performance | Backend generates a short-lived, pre-signed S3 GET... |

### 2.5.5.0 Browser Action

#### 2.5.5.1 Source Id

REPO-FE-ADMIN

#### 2.5.5.2 Target Id

OnboardingSpecialist

#### 2.5.5.3 Message

7. Initiates browser download from the received pre-signed S3 URL.

#### 2.5.5.4 Sequence Number

7

#### 2.5.5.5 Type

🔹 Browser Action

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
| Method | Browser GET |
| Parameters | Pre-signed URL query parameters. |
| Authentication | Handled by S3 via pre-signed URL. |
| Error Handling | Browser handles download errors. |
| Performance | Direct download from S3 for high performance, bypa... |

### 2.5.6.0 User Interaction

#### 2.5.6.1 Source Id

OnboardingSpecialist

#### 2.5.6.2 Target Id

REPO-FE-ADMIN

#### 2.5.6.3 Message

8. After reviewing, clicks 'Approve Migration' button.

#### 2.5.6.4 Sequence Number

8

#### 2.5.6.5 Type

🔹 User Interaction

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
| Protocol | UI Event |
| Method | onClick |
| Parameters | N/A |
| Authentication | N/A |
| Error Handling | UI shows a loading spinner and disables the button... |
| Performance | Immediate visual feedback. |

### 2.5.7.0 API Call

#### 2.5.7.1 Source Id

REPO-FE-ADMIN

#### 2.5.7.2 Target Id

REPO-BE-CATALOG

#### 2.5.7.3 Message

9. PUT /api/v1/migrations/:batchId/approve

#### 2.5.7.4 Sequence Number

9

#### 2.5.7.5 Type

🔹 API Call

#### 2.5.7.6 Is Synchronous

✅ Yes

#### 2.5.7.7 Return Message

12. 200 OK

#### 2.5.7.8 Has Return

✅ Yes

#### 2.5.7.9 Is Activation

✅ Yes

#### 2.5.7.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS |
| Method | PUT |
| Parameters | Empty request body. |
| Authentication | JWT Bearer token. RBAC check for role. |
| Error Handling | 409 Conflict if batch is not in a valid state for ... |
| Performance | P95 < 200ms. |

#### 2.5.7.11 Nested Interactions

##### 2.5.7.11.1 Database Operation

###### 2.5.7.11.1.1 Source Id

REPO-BE-CATALOG

###### 2.5.7.11.1.2 Target Id

REPO-BE-CATALOG

###### 2.5.7.11.1.3 Message

10. Updates migration batch status to 'Approved' in PostgreSQL within a transaction.

###### 2.5.7.11.1.4 Sequence Number

10

###### 2.5.7.11.1.5 Type

🔹 Database Operation

###### 2.5.7.11.1.6 Is Synchronous

✅ Yes

###### 2.5.7.11.1.7 Return Message



###### 2.5.7.11.1.8 Has Return

❌ No

###### 2.5.7.11.1.9 Is Activation

❌ No

###### 2.5.7.11.1.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | SQL |
| Method | UPDATE |
| Parameters | SET status = 'APPROVED' WHERE id = :batchId |
| Authentication | DB connection credentials from AWS Secrets Manager... |
| Error Handling | Transaction will be rolled back on failure. |
| Performance | Indexed query for fast update. |

##### 2.5.7.11.2.0 Asynchronous Message

###### 2.5.7.11.2.1 Source Id

REPO-BE-CATALOG

###### 2.5.7.11.2.2 Target Id

REPO-BE-CATALOG

###### 2.5.7.11.2.3 Message

11. Publishes 'MigrationApproved' event to Audit Log Service (fire-and-forget).

###### 2.5.7.11.2.4 Sequence Number

11

###### 2.5.7.11.2.5 Type

🔹 Asynchronous Message

###### 2.5.7.11.2.6 Is Synchronous

❌ No

###### 2.5.7.11.2.7 Return Message



###### 2.5.7.11.2.8 Has Return

❌ No

###### 2.5.7.11.2.9 Is Activation

❌ No

###### 2.5.7.11.2.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | AWS SNS/SQS |
| Method | Publish Event |
| Parameters | Event payload: { batchId, approvedByUserId, timest... |
| Authentication | IAM role-based access to SNS topic. |
| Error Handling | Handled by SNS/SQS retry and DLQ mechanism. |
| Performance | Low latency publish operation. |

### 2.5.8.0.0.0 UI Update

#### 2.5.8.1.0.0 Source Id

REPO-FE-ADMIN

#### 2.5.8.2.0.0 Target Id

OnboardingSpecialist

#### 2.5.8.3.0.0 Message

13. Displays 'Migration Approved' success notification.

#### 2.5.8.4.0.0 Sequence Number

13

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

| Property | Value |
|----------|-------|
| Protocol | UI Render |
| Method | Toast/Notification component |
| Parameters | N/A |
| Authentication | N/A |
| Error Handling | N/A |
| Performance | Immediate. |

## 2.6.0.0.0.0 Notes

### 2.6.1.0.0.0 Content

#### 2.6.1.1.0.0 Content

Rejection Flow: If the specialist clicks 'Reject', the UI shows a modal. The subsequent PUT request to /api/v1/migrations/:batchId/reject includes a mandatory 'reason' field in the body, as per BR-TRN-002.

#### 2.6.1.2.0.0 Position

bottom

#### 2.6.1.3.0.0 Participant Id

REPO-FE-ADMIN

#### 2.6.1.4.0.0 Sequence Number

8

### 2.6.2.0.0.0 Content

#### 2.6.2.1.0.0 Content

Partial Failure Display: If the GET request in step 2 returns 'hasErrors: true' and an 'errorReportUrl', the UI must render a warning and a link to download the error report via the same pre-signed URL mechanism as the source file.

#### 2.6.2.2.0.0 Position

top

#### 2.6.2.3.0.0 Participant Id

REPO-FE-ADMIN

#### 2.6.2.4.0.0 Sequence Number

3

### 2.6.3.0.0.0 Content

#### 2.6.3.1.0.0 Content

Audit Trail: As per REQ-NFR-008, all state-changing actions (approve/reject) MUST be recorded in an immutable audit trail. This is implemented via an asynchronous event publication to decouple the core service from the audit service and improve resilience.

#### 2.6.3.2.0.0 Position

bottom

#### 2.6.3.3.0.0 Participant Id

REPO-BE-CATALOG

#### 2.6.3.4.0.0 Sequence Number

11

## 2.7.0.0.0.0 Implementation Guidance

| Property | Value |
|----------|-------|
| Security Requirements | Backend API endpoints must be protected by RBAC, a... |
| Performance Targets | The initial validation page load (API call in step... |
| Error Handling Strategy | The frontend (React Query) should handle API error... |
| Testing Considerations | E2E tests (Cypress) should cover the happy path (a... |
| Monitoring Requirements | Monitor the latency and error rate of all `/api/v1... |
| Deployment Considerations | This feature depends on the successful implementat... |

