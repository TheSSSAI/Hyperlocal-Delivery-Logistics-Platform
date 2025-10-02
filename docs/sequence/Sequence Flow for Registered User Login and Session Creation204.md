# 1 Overview

## 1.1 Diagram Id

SEQ-AUTH-001

## 1.2 Name

Registered User Login and Session Creation

## 1.3 Description

A registered user logs into any of the platform's applications using their mobile number and an OTP. Upon successful authentication, the system issues a short-lived JWT access token and a long-lived refresh token to establish a secure session, as per REQ-FUN-002.

## 1.4 Type

🔹 AuthenticationFlow

## 1.5 Purpose

To securely authenticate users and manage their session lifecycle using industry-standard tokens.

## 1.6 Complexity

Medium

## 1.7 Priority

🚨 Critical

## 1.8 Frequency

OnDemand

## 1.9 Participants

- REPO-FE-CUST
- REPO-FE-VEND
- REPO-FE-RIDER
- REPO-BE-IDENTITY

## 1.10 Key Interactions

- User enters their registered mobile number in a client application.
- Identity Service receives the request, applies rate limiting, and triggers an OTP to be sent to the registered number.
- User submits the OTP received via SMS.
- Identity Service validates the OTP against the stored value and increments the attempt counter.
- Upon success, the Identity Service (via AWS Cognito) issues a JWT access token and a refresh token.
- Client application securely stores the tokens (e.g., in secure storage/keychain).

## 1.11 Triggers

- A registered user initiates the login process from any client application.

## 1.12 Outcomes

- The user is successfully authenticated.
- The client application receives valid JWTs to make authenticated API calls.
- The user's session is established, with login process completing within 3 seconds (REQ-FUN-002).

## 1.13 Business Rules

- Rate limiting is applied to OTP generation requests (REQ-FUN-002).
- Account is temporarily locked after 5 consecutive failed OTP attempts (REQ-FUN-002).
- Refresh tokens must be stored securely on the client and are invalidated on logout (REQ-FUN-002).

## 1.14 Error Scenarios

- User enters a mobile number not found in the system.
- User exceeds OTP attempt limit, locking the account.
- OTP validation fails due to incorrect entry or expiry.

## 1.15 Integration Points

- AWS Cognito for user authentication and token issuance (REQ-NFR-003).

# 2.0 Details

## 2.1 Diagram Id

SEQ-TRN-002

## 2.2 Name

Vendor Data Migration Validation and Approval

## 2.3 Description

Technical sequence for an Onboarding Specialist to validate migrated vendor data via the Admin Dashboard. The process covers fetching validation data, comparing it with source files, and executing an approval or rejection, which updates the system state and triggers an immutable audit log event, as per requirements TRN-002 and NFR-008.

## 2.4 Participants

### 2.4.1 Human Actor

#### 2.4.1.1 Repository Id

OnboardingSpecialist

#### 2.4.1.2 Display Name

Onboarding Specialist

#### 2.4.1.3 Type

🔹 Human Actor

#### 2.4.1.4 Technology

N/A

#### 2.4.1.5 Order

1

#### 2.4.1.6 Style

| Property | Value |
|----------|-------|
| Shape | actor |
| Color | #9063CD |
| Stereotype | User |

### 2.4.2.0 Web Application

#### 2.4.2.1 Repository Id

REPO-FE-ADMIN

#### 2.4.2.2 Display Name

Admin Web Dashboard

#### 2.4.2.3 Type

🔹 Web Application

#### 2.4.2.4 Technology

React.js v18.2+, Vite

#### 2.4.2.5 Order

2

#### 2.4.2.6 Style

| Property | Value |
|----------|-------|
| Shape | boundary |
| Color | #1E90FF |
| Stereotype | Frontend |

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
| Color | #FF8C00 |
| Stereotype | Gateway |

### 2.4.4.0 Microservice

#### 2.4.4.1 Repository Id

REPO-BE-VENDOR

#### 2.4.4.2 Display Name

Vendor & Catalog Service

#### 2.4.4.3 Type

🔹 Microservice

#### 2.4.4.4 Technology

NestJS v10.3+, Node.js v18.18+

#### 2.4.4.5 Order

4

#### 2.4.4.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #32CD32 |
| Stereotype | Service |

### 2.4.5.0 Database

#### 2.4.5.1 Repository Id

REPO-DB-POSTGRES

#### 2.4.5.2 Display Name

Persistence Layer

#### 2.4.5.3 Type

🔹 Database

#### 2.4.5.4 Technology

PostgreSQL v15.4 on RDS

#### 2.4.5.5 Order

5

#### 2.4.5.6 Style

| Property | Value |
|----------|-------|
| Shape | database |
| Color | #4682B4 |
| Stereotype | Database |

### 2.4.6.0 Storage

#### 2.4.6.1 Repository Id

REPO-STORE-S3

#### 2.4.6.2 Display Name

Object Storage

#### 2.4.6.3 Type

🔹 Storage

#### 2.4.6.4 Technology

Amazon S3

#### 2.4.6.5 Order

6

#### 2.4.6.6 Style

| Property | Value |
|----------|-------|
| Shape | database |
| Color | #DC143C |
| Stereotype | Storage |

### 2.4.7.0 Microservice

#### 2.4.7.1 Repository Id

REPO-BE-AUDIT

#### 2.4.7.2 Display Name

Audit Log Service

#### 2.4.7.3 Type

🔹 Microservice

#### 2.4.7.4 Technology

NestJS (Consuming SNS/SQS events)

#### 2.4.7.5 Order

7

#### 2.4.7.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #808080 |
| Stereotype | Service |

## 2.5.0.0 Interactions

### 2.5.1.0 User Interaction

#### 2.5.1.1 Source Id

OnboardingSpecialist

#### 2.5.1.2 Target Id

REPO-FE-ADMIN

#### 2.5.1.3 Message

1. Navigates to Vendor Management and selects a vendor with a 'Pending Validation' migration batch.

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

REPO-GW-API

#### 2.5.2.3 Message

2. Requests migration validation data for the vendor's latest batch.

#### 2.5.2.4 Sequence Number

2

#### 2.5.2.5 Type

🔹 API Call

#### 2.5.2.6 Is Synchronous

✅ Yes

#### 2.5.2.7 Return Message

Returns JSON with migration batch details, product sample, and file URLs.

#### 2.5.2.8 Has Return

✅ Yes

#### 2.5.2.9 Is Activation

✅ Yes

#### 2.5.2.10 Technical Details

##### 2.5.2.10.1 Protocol

HTTPS/REST

##### 2.5.2.10.2 Method

GET /api/v1/vendors/{vendorId}/migration-batches/latest/validation

##### 2.5.2.10.3 Parameters

- {'name': 'vendorId', 'type': 'string', 'in': 'path'}

##### 2.5.2.10.4 Authentication

JWT Bearer Token from user session.

##### 2.5.2.10.5 Error Handling

Handles 401, 403, 404, 5xx responses.

##### 2.5.2.10.6 Performance

###### 2.5.2.10.6.1 Sla Ms

200

### 2.5.3.0.0.0 Service Call

#### 2.5.3.1.0.0 Source Id

REPO-GW-API

#### 2.5.3.2.0.0 Target Id

REPO-BE-VENDOR

#### 2.5.3.3.0.0 Message

3. Forwards authenticated request.

#### 2.5.3.4.0.0 Sequence Number

3

#### 2.5.3.5.0.0 Type

🔹 Service Call

#### 2.5.3.6.0.0 Is Synchronous

✅ Yes

#### 2.5.3.7.0.0 Return Message

Returns migration validation data.

#### 2.5.3.8.0.0 Has Return

✅ Yes

#### 2.5.3.9.0.0 Is Activation

✅ Yes

#### 2.5.3.10.0.0 Technical Details

##### 2.5.3.10.1.0 Protocol

HTTPS

##### 2.5.3.10.2.0 Method

GET

##### 2.5.3.10.3.0 Parameters

*No items available*

##### 2.5.3.10.4.0 Authentication

JWT passed through; service performs RBAC check.

##### 2.5.3.10.5.0 Error Handling

Throws specific exceptions for 'NotFound' or 'Forbidden' to be mapped to HTTP status codes.

##### 2.5.3.10.6.0 Performance

*No data available*

#### 2.5.3.11.0.0 Nested Interactions

##### 2.5.3.11.1.0 Database Query

###### 2.5.3.11.1.1 Source Id

REPO-BE-VENDOR

###### 2.5.3.11.1.2 Target Id

REPO-DB-POSTGRES

###### 2.5.3.11.1.3 Message

3a. Fetches migration batch record and a sample of associated products.

###### 2.5.3.11.1.4 Sequence Number

4

###### 2.5.3.11.1.5 Type

🔹 Database Query

###### 2.5.3.11.1.6 Is Synchronous

✅ Yes

###### 2.5.3.11.1.7 Return Message

Returns batch metadata and product rows.

###### 2.5.3.11.1.8 Has Return

✅ Yes

###### 2.5.3.11.1.9 Is Activation

❌ No

###### 2.5.3.11.1.10 Technical Details

####### 2.5.3.11.1.10.1 Protocol

SQL

####### 2.5.3.11.1.10.2 Method

```sql
SELECT
```

####### 2.5.3.11.1.10.3 Parameters

- vendor_id
- limit: 20

####### 2.5.3.11.1.10.4 Authentication

Database credentials via AWS Secrets Manager.

####### 2.5.3.11.1.10.5 Error Handling

Connection pooling and retry logic for transient errors.

####### 2.5.3.11.1.10.6 Performance

######## 2.5.3.11.1.10.6.1 Sla Ms

50

##### 2.5.3.11.2.0.0.0 SDK Call

###### 2.5.3.11.2.1.0.0 Source Id

REPO-BE-VENDOR

###### 2.5.3.11.2.2.0.0 Target Id

REPO-STORE-S3

###### 2.5.3.11.2.3.0.0 Message

3b. Generates pre-signed URLs for source and error report files.

###### 2.5.3.11.2.4.0.0 Sequence Number

5

###### 2.5.3.11.2.5.0.0 Type

🔹 SDK Call

###### 2.5.3.11.2.6.0.0 Is Synchronous

✅ Yes

###### 2.5.3.11.2.7.0.0 Return Message

Returns temporary, secure download URLs.

###### 2.5.3.11.2.8.0.0 Has Return

✅ Yes

###### 2.5.3.11.2.9.0.0 Is Activation

❌ No

###### 2.5.3.11.2.10.0.0 Technical Details

####### 2.5.3.11.2.10.1.0 Protocol

AWS SDK

####### 2.5.3.11.2.10.2.0 Method

getSignedUrl

####### 2.5.3.11.2.10.3.0 Parameters

- bucket
- key
- expiresIn: 3600

####### 2.5.3.11.2.10.4.0 Authentication

IAM Role for the service.

####### 2.5.3.11.2.10.5.0 Error Handling

Handles exceptions for non-existent S3 objects.

####### 2.5.3.11.2.10.6.0 Performance

######## 2.5.3.11.2.10.6.1 Sla Ms

100

### 2.5.4.0.0.0.0.0 UI Render

#### 2.5.4.1.0.0.0.0 Source Id

REPO-FE-ADMIN

#### 2.5.4.2.0.0.0.0 Target Id

OnboardingSpecialist

#### 2.5.4.3.0.0.0.0 Message

4. Renders 'Migration Validation' view with data and download links. Displays a warning if import had errors.

#### 2.5.4.4.0.0.0.0 Sequence Number

6

#### 2.5.4.5.0.0.0.0 Type

🔹 UI Render

#### 2.5.4.6.0.0.0.0 Is Synchronous

✅ Yes

#### 2.5.4.7.0.0.0.0 Return Message



#### 2.5.4.8.0.0.0.0 Has Return

❌ No

#### 2.5.4.9.0.0.0.0 Is Activation

❌ No

#### 2.5.4.10.0.0.0.0 Technical Details

*No data available*

### 2.5.5.0.0.0.0.0 User Interaction

#### 2.5.5.1.0.0.0.0 Source Id

OnboardingSpecialist

#### 2.5.5.2.0.0.0.0 Target Id

REPO-FE-ADMIN

#### 2.5.5.3.0.0.0.0 Message

5. ALT[Approve Path]: Reviews data, confirms accuracy, and clicks 'Approve Migration'.

#### 2.5.5.4.0.0.0.0 Sequence Number

7

#### 2.5.5.5.0.0.0.0 Type

🔹 User Interaction

#### 2.5.5.6.0.0.0.0 Is Synchronous

✅ Yes

#### 2.5.5.7.0.0.0.0 Return Message



#### 2.5.5.8.0.0.0.0 Has Return

❌ No

#### 2.5.5.9.0.0.0.0 Is Activation

❌ No

#### 2.5.5.10.0.0.0.0 Technical Details

*No data available*

### 2.5.6.0.0.0.0.0 API Call

#### 2.5.6.1.0.0.0.0 Source Id

REPO-FE-ADMIN

#### 2.5.6.2.0.0.0.0 Target Id

REPO-GW-API

#### 2.5.6.3.0.0.0.0 Message

6. Submits approval action for the migration batch.

#### 2.5.6.4.0.0.0.0 Sequence Number

8

#### 2.5.6.5.0.0.0.0 Type

🔹 API Call

#### 2.5.6.6.0.0.0.0 Is Synchronous

✅ Yes

#### 2.5.6.7.0.0.0.0 Return Message

200 OK on success.

#### 2.5.6.8.0.0.0.0 Has Return

✅ Yes

#### 2.5.6.9.0.0.0.0 Is Activation

✅ Yes

#### 2.5.6.10.0.0.0.0 Technical Details

##### 2.5.6.10.1.0.0.0 Protocol

HTTPS/REST

##### 2.5.6.10.2.0.0.0 Method

POST /api/v1/migration-batches/{batchId}/approve

##### 2.5.6.10.3.0.0.0 Parameters

- {'name': 'batchId', 'type': 'string', 'in': 'path'}

##### 2.5.6.10.4.0.0.0 Authentication

JWT Bearer Token.

##### 2.5.6.10.5.0.0.0 Error Handling

Handles 400 (e.g., already approved), 403, 404, 5xx responses.

##### 2.5.6.10.6.0.0.0 Performance

###### 2.5.6.10.6.1.0.0 Sla Ms

200

### 2.5.7.0.0.0.0.0 Service Call

#### 2.5.7.1.0.0.0.0 Source Id

REPO-GW-API

#### 2.5.7.2.0.0.0.0 Target Id

REPO-BE-VENDOR

#### 2.5.7.3.0.0.0.0 Message

7. Forwards approval request.

#### 2.5.7.4.0.0.0.0 Sequence Number

9

#### 2.5.7.5.0.0.0.0 Type

🔹 Service Call

#### 2.5.7.6.0.0.0.0 Is Synchronous

✅ Yes

#### 2.5.7.7.0.0.0.0 Return Message

200 OK.

#### 2.5.7.8.0.0.0.0 Has Return

✅ Yes

#### 2.5.7.9.0.0.0.0 Is Activation

✅ Yes

#### 2.5.7.10.0.0.0.0 Technical Details

*No data available*

#### 2.5.7.11.0.0.0.0 Nested Interactions

##### 2.5.7.11.1.0.0.0 Database Query

###### 2.5.7.11.1.1.0.0 Source Id

REPO-BE-VENDOR

###### 2.5.7.11.1.2.0.0 Target Id

REPO-DB-POSTGRES

###### 2.5.7.11.1.3.0.0 Message

7a. Updates migration batch status to 'Approved' and records approver ID and timestamp.

###### 2.5.7.11.1.4.0.0 Sequence Number

10

###### 2.5.7.11.1.5.0.0 Type

🔹 Database Query

###### 2.5.7.11.1.6.0.0 Is Synchronous

✅ Yes

###### 2.5.7.11.1.7.0.0 Return Message

Success confirmation.

###### 2.5.7.11.1.8.0.0 Has Return

✅ Yes

###### 2.5.7.11.1.9.0.0 Is Activation

❌ No

###### 2.5.7.11.1.10.0.0 Technical Details

####### 2.5.7.11.1.10.1.0 Protocol

SQL

####### 2.5.7.11.1.10.2.0 Method

```sql
UPDATE
```

####### 2.5.7.11.1.10.3.0 Parameters

- status: 'Approved'
- approved_by: userId
- approved_at: NOW()

####### 2.5.7.11.1.10.4.0 Authentication

Database credentials.

####### 2.5.7.11.1.10.5.0 Error Handling

Uses database transaction to ensure atomicity.

####### 2.5.7.11.1.10.6.0 Performance

######## 2.5.7.11.1.10.6.1 Sla Ms

30

##### 2.5.7.11.2.0.0.0 Async Message

###### 2.5.7.11.2.1.0.0 Source Id

REPO-BE-VENDOR

###### 2.5.7.11.2.2.0.0 Target Id

REPO-BE-AUDIT

###### 2.5.7.11.2.3.0.0 Message

7b. Publishes 'MigrationBatchApproved' event.

###### 2.5.7.11.2.4.0.0 Sequence Number

11

###### 2.5.7.11.2.5.0.0 Type

🔹 Async Message

###### 2.5.7.11.2.6.0.0 Is Synchronous

❌ No

###### 2.5.7.11.2.7.0.0 Return Message



###### 2.5.7.11.2.8.0.0 Has Return

❌ No

###### 2.5.7.11.2.9.0.0 Is Activation

✅ Yes

###### 2.5.7.11.2.10.0.0 Technical Details

####### 2.5.7.11.2.10.1.0 Protocol

SNS/SQS

####### 2.5.7.11.2.10.2.0 Method

Publish

####### 2.5.7.11.2.10.3.0 Parameters

- {'name': 'payload', 'type': 'JSON', 'value': "{ eventType: 'MigrationBatchApproved', batchId: ..., actorId: ..., timestamp: ... }"}

####### 2.5.7.11.2.10.4.0 Authentication

IAM Role.

####### 2.5.7.11.2.10.5.0 Error Handling

Retry logic on publish failure.

####### 2.5.7.11.2.10.6.0 Performance

*No data available*

### 2.5.8.0.0.0.0.0 User Interaction

#### 2.5.8.1.0.0.0.0 Source Id

OnboardingSpecialist

#### 2.5.8.2.0.0.0.0 Target Id

REPO-FE-ADMIN

#### 2.5.8.3.0.0.0.0 Message

8. ALT[Reject Path]: Finds discrepancy, clicks 'Reject Migration', enters reason in modal and submits.

#### 2.5.8.4.0.0.0.0 Sequence Number

12

#### 2.5.8.5.0.0.0.0 Type

🔹 User Interaction

#### 2.5.8.6.0.0.0.0 Is Synchronous

✅ Yes

#### 2.5.8.7.0.0.0.0 Return Message



#### 2.5.8.8.0.0.0.0 Has Return

❌ No

#### 2.5.8.9.0.0.0.0 Is Activation

❌ No

#### 2.5.8.10.0.0.0.0 Technical Details

*No data available*

### 2.5.9.0.0.0.0.0 API Call

#### 2.5.9.1.0.0.0.0 Source Id

REPO-FE-ADMIN

#### 2.5.9.2.0.0.0.0 Target Id

REPO-GW-API

#### 2.5.9.3.0.0.0.0 Message

9. Submits rejection action with reason.

#### 2.5.9.4.0.0.0.0 Sequence Number

13

#### 2.5.9.5.0.0.0.0 Type

🔹 API Call

#### 2.5.9.6.0.0.0.0 Is Synchronous

✅ Yes

#### 2.5.9.7.0.0.0.0 Return Message

200 OK on success.

#### 2.5.9.8.0.0.0.0 Has Return

✅ Yes

#### 2.5.9.9.0.0.0.0 Is Activation

✅ Yes

#### 2.5.9.10.0.0.0.0 Technical Details

##### 2.5.9.10.1.0.0.0 Protocol

HTTPS/REST

##### 2.5.9.10.2.0.0.0 Method

POST /api/v1/migration-batches/{batchId}/reject

##### 2.5.9.10.3.0.0.0 Parameters

###### 2.5.9.10.3.1.0.0 batchId

####### 2.5.9.10.3.1.1.0 Name

batchId

####### 2.5.9.10.3.1.2.0 Type

🔹 string

####### 2.5.9.10.3.1.3.0 In

path

###### 2.5.9.10.3.2.0.0 body

####### 2.5.9.10.3.2.1.0 Name

body

####### 2.5.9.10.3.2.2.0 Type

🔹 object

####### 2.5.9.10.3.2.3.0 In

body

####### 2.5.9.10.3.2.4.0 Schema

{ reason: string }

##### 2.5.9.10.4.0.0.0 Authentication

JWT Bearer Token.

##### 2.5.9.10.5.0.0.0 Error Handling

Handles 400 (reason missing), 403, 404, 5xx responses.

##### 2.5.9.10.6.0.0.0 Performance

###### 2.5.9.10.6.1.0.0 Sla Ms

200

### 2.5.10.0.0.0.0.0 Service Call

#### 2.5.10.1.0.0.0.0 Source Id

REPO-GW-API

#### 2.5.10.2.0.0.0.0 Target Id

REPO-BE-VENDOR

#### 2.5.10.3.0.0.0.0 Message

10. Forwards rejection request.

#### 2.5.10.4.0.0.0.0 Sequence Number

14

#### 2.5.10.5.0.0.0.0 Type

🔹 Service Call

#### 2.5.10.6.0.0.0.0 Is Synchronous

✅ Yes

#### 2.5.10.7.0.0.0.0 Return Message

200 OK.

#### 2.5.10.8.0.0.0.0 Has Return

✅ Yes

#### 2.5.10.9.0.0.0.0 Is Activation

✅ Yes

#### 2.5.10.10.0.0.0.0 Technical Details

##### 2.5.10.10.1.0.0.0 Protocol

HTTPS

##### 2.5.10.10.2.0.0.0 Method

POST

##### 2.5.10.10.3.0.0.0 Authentication

JWT validation and RBAC check.

##### 2.5.10.10.4.0.0.0 Error Handling

Validates presence of 'reason' field in request body.

##### 2.5.10.10.5.0.0.0 Performance

*No data available*

#### 2.5.10.11.0.0.0.0 Nested Interactions

##### 2.5.10.11.1.0.0.0 Database Query

###### 2.5.10.11.1.1.0.0 Source Id

REPO-BE-VENDOR

###### 2.5.10.11.1.2.0.0 Target Id

REPO-DB-POSTGRES

###### 2.5.10.11.1.3.0.0 Message

10a. Updates batch status to 'Rejected' and stores reason, actor ID, and timestamp.

###### 2.5.10.11.1.4.0.0 Sequence Number

15

###### 2.5.10.11.1.5.0.0 Type

🔹 Database Query

###### 2.5.10.11.1.6.0.0 Is Synchronous

✅ Yes

###### 2.5.10.11.1.7.0.0 Return Message

Success confirmation.

###### 2.5.10.11.1.8.0.0 Has Return

✅ Yes

###### 2.5.10.11.1.9.0.0 Is Activation

❌ No

###### 2.5.10.11.1.10.0.0 Technical Details

####### 2.5.10.11.1.10.1.0 Protocol

SQL

####### 2.5.10.11.1.10.2.0 Method

```sql
UPDATE
```

####### 2.5.10.11.1.10.3.0 Parameters

- status: 'Rejected'
- rejection_reason: ...
- rejected_by: userId
- rejected_at: NOW()

####### 2.5.10.11.1.10.4.0 Authentication

Database credentials.

####### 2.5.10.11.1.10.5.0 Error Handling

Uses database transaction.

####### 2.5.10.11.1.10.6.0 Performance

######## 2.5.10.11.1.10.6.1 Sla Ms

30

##### 2.5.10.11.2.0.0.0 Async Message

###### 2.5.10.11.2.1.0.0 Source Id

REPO-BE-VENDOR

###### 2.5.10.11.2.2.0.0 Target Id

REPO-BE-AUDIT

###### 2.5.10.11.2.3.0.0 Message

10b. Publishes 'MigrationBatchRejected' event.

###### 2.5.10.11.2.4.0.0 Sequence Number

16

###### 2.5.10.11.2.5.0.0 Type

🔹 Async Message

###### 2.5.10.11.2.6.0.0 Is Synchronous

❌ No

###### 2.5.10.11.2.7.0.0 Return Message



###### 2.5.10.11.2.8.0.0 Has Return

❌ No

###### 2.5.10.11.2.9.0.0 Is Activation

✅ Yes

###### 2.5.10.11.2.10.0.0 Technical Details

####### 2.5.10.11.2.10.1.0 Protocol

SNS/SQS

####### 2.5.10.11.2.10.2.0 Method

Publish

####### 2.5.10.11.2.10.3.0 Parameters

- {'name': 'payload', 'type': 'JSON', 'value': "{ eventType: 'MigrationBatchRejected', batchId: ..., actorId: ..., reason: ..., timestamp: ... }"}

####### 2.5.10.11.2.10.4.0 Authentication

IAM Role.

####### 2.5.10.11.2.10.5.0 Error Handling

Retry logic on publish failure.

####### 2.5.10.11.2.10.6.0 Performance

*No data available*

## 2.6.0.0.0.0.0.0 Notes

### 2.6.1.0.0.0.0.0 Content

#### 2.6.1.1.0.0.0.0 Content

File downloads are handled via pre-signed S3 URLs to ensure secure, direct access for the user without exposing the backend to the file transfer load.

#### 2.6.1.2.0.0.0.0 Position

bottom

#### 2.6.1.3.0.0.0.0 Participant Id

REPO-STORE-S3

#### 2.6.1.4.0.0.0.0 Sequence Number

5

### 2.6.2.0.0.0.0.0 Content

#### 2.6.2.1.0.0.0.0 Content

Auditing is handled asynchronously via an event-driven pattern. This decouples the core business logic from the auditing concern and improves resilience.

#### 2.6.2.2.0.0.0.0 Position

bottom

#### 2.6.2.3.0.0.0.0 Participant Id

REPO-BE-AUDIT

#### 2.6.2.4.0.0.0.0 Sequence Number

11

### 2.6.3.0.0.0.0.0 Content

#### 2.6.3.1.0.0.0.0 Content

The business rule BR-TRN-001 (vendor cannot be activated without an approved migration) is enforced in a separate workflow that consumes the final state of the migration batch.

#### 2.6.3.2.0.0.0.0 Position

bottom

#### 2.6.3.3.0.0.0.0 Participant Id

*Not specified*

#### 2.6.3.4.0.0.0.0 Sequence Number

*Not specified*

## 2.7.0.0.0.0.0.0 Implementation Guidance

| Property | Value |
|----------|-------|
| Security Requirements | Access to this entire workflow must be restricted ... |
| Performance Targets | The initial validation view, including the databas... |
| Error Handling Strategy | The backend API must perform comprehensive validat... |
| Testing Considerations | End-to-end tests (Cypress) are critical for valida... |
| Monitoring Requirements | Monitor the latency and error rates of the API end... |
| Deployment Considerations | This feature depends on the completion of bulk imp... |

