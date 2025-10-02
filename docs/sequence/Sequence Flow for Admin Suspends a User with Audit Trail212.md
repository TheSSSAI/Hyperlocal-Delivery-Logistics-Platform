# 1 Overview

## 1.1 Diagram Id

SEQ-CF-001

## 1.2 Name

Admin Suspends a User with Audit Trail

## 1.3 Description

A platform administrator suspends a user's (e.g., a rider's) account. This action immediately revokes the user's access and is mandatorily recorded in a dedicated, immutable audit trail for compliance and security purposes.

## 1.4 Type

🔹 ComplianceFlow

## 1.5 Purpose

To provide administrators with the tools to manage the user base while ensuring all sensitive actions are tracked and auditable, as per REQ-USR-001 and REQ-NFR-008.

## 1.6 Complexity

Medium

## 1.7 Priority

🔴 High

## 1.8 Frequency

OnDemand

## 1.9 Participants

- REPO-FE-ADMIN
- REPO-BE-IDENTITY

## 1.10 Key Interactions

- Admin navigates to a user's profile in the Admin Dashboard and clicks 'Suspend'.
- A modal appears for two-step confirmation of this critical action.
- Admin confirms, and a request is sent to the Identity Service to change the user's status.
- The Identity Service validates the admin's permissions via RBAC.
- It updates the user's status to 'suspended' in the database.
- Crucially, the service writes an immutable entry to a dedicated 'audit_log' table containing: timestamp, admin's user ID (actor), the action ('user.suspend'), the target user's ID, and outcome.
- The Identity Service also triggers an invalidation of the user's active refresh tokens.

## 1.11 Triggers

- An administrator performs a user suspension action from the admin dashboard.

## 1.12 Outcomes

- The target user's account is suspended and they can no longer log in.
- A permanent, non-repudiable audit log of the action is created.

## 1.13 Business Rules

- Only users with the 'Administrator' role can suspend accounts (REQ-USR-001).
- All administrative actions that modify data must be logged in a dedicated, immutable audit trail (REQ-USR-001).
- Critical delete/suspend operations shall require a two-step confirmation process (REQ-USR-001).

## 1.14 Error Scenarios

- Admin attempts to suspend another admin account without sufficient privileges.
- The audit logging database write fails, causing the entire transaction to roll back.

## 1.15 Integration Points

- A dedicated, immutable audit logging database table.

# 2.0 Details

## 2.1 Diagram Id

SEQ-CF-001

## 2.2 Name

Implementation: Admin User Suspension with Immutable Audit Trail

## 2.3 Description

Provides a comprehensive technical specification for the user suspension flow initiated by an administrator. This sequence guarantees that any action modifying a user's status is transactionally coupled with the creation of an immutable audit record, fulfilling the compliance requirements of REQ-USR-001 and REQ-NFR-008. The entire operation is atomic; failure to write to the audit log results in a complete rollback of the user status change.

## 2.4 Participants

### 2.4.1 Human Actor

#### 2.4.1.1 Repository Id

actor-admin

#### 2.4.1.2 Display Name

Administrator

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
| Color | #90CAF9 |
| Stereotype | User |

### 2.4.2.0 Client Application

#### 2.4.2.1 Repository Id

REPO-FE-ADMIN

#### 2.4.2.2 Display Name

Admin Dashboard

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
| Color | #A5D6A7 |
| Stereotype | Web Frontend |

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
| Shape | component |
| Color | #FFCC80 |
| Stereotype | AWS Service |

### 2.4.4.0 Microservice

#### 2.4.4.1 Repository Id

REPO-BE-IDENTITY

#### 2.4.4.2 Display Name

Identity Service

#### 2.4.4.3 Type

🔹 Microservice

#### 2.4.4.4 Technology

NestJS v10.3+

#### 2.4.4.5 Order

4

#### 2.4.4.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #B39DDB |
| Stereotype | Backend Service |

### 2.4.5.0 Database

#### 2.4.5.1 Repository Id

REPO-DB-POSTGRESQL

#### 2.4.5.2 Display Name

Primary Database

#### 2.4.5.3 Type

🔹 Database

#### 2.4.5.4 Technology

PostgreSQL v15.4+

#### 2.4.5.5 Order

5

#### 2.4.5.6 Style

| Property | Value |
|----------|-------|
| Shape | database |
| Color | #EF9A9A |
| Stereotype | Data Store |

## 2.5.0.0 Interactions

### 2.5.1.0 User Interaction

#### 2.5.1.1 Source Id

actor-admin

#### 2.5.1.2 Target Id

REPO-FE-ADMIN

#### 2.5.1.3 Message

1. Initiates user suspension for `targetUserId` and confirms via two-step confirmation modal (REQ-USR-001).

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

##### 2.5.1.10.1 Protocol

UI Event

##### 2.5.1.10.2 Method

onClick

##### 2.5.1.10.3 Parameters

*No items available*

##### 2.5.1.10.4 Authentication

Requires active, authenticated admin session.

##### 2.5.1.10.5 Error Handling

UI displays an error toast if the subsequent API call fails.

##### 2.5.1.10.6 Performance

N/A

### 2.5.2.0.0 API Call

#### 2.5.2.1.0 Source Id

REPO-FE-ADMIN

#### 2.5.2.2.0 Target Id

REPO-BE-API-GATEWAY

#### 2.5.2.3.0 Message

2. Sends suspension request.

#### 2.5.2.4.0 Sequence Number

2

#### 2.5.2.5.0 Type

🔹 API Call

#### 2.5.2.6.0 Is Synchronous

✅ Yes

#### 2.5.2.7.0 Return Message

HTTP 204 No Content on success, or 4xx/5xx error.

#### 2.5.2.8.0 Has Return

✅ Yes

#### 2.5.2.9.0 Is Activation

✅ Yes

#### 2.5.2.10.0 Technical Details

##### 2.5.2.10.1 Protocol

HTTPS

##### 2.5.2.10.2 Method

PATCH /api/v1/users/{targetUserId}/status

##### 2.5.2.10.3 Parameters

###### 2.5.2.10.3.1 targetUserId

####### 2.5.2.10.3.1.1 Name

targetUserId

####### 2.5.2.10.3.1.2 In

path

####### 2.5.2.10.3.1.3 Schema

######## 2.5.2.10.3.1.3.1 Type

🔹 UUID

###### 2.5.2.10.3.2.0.0 body

####### 2.5.2.10.3.2.1.0 Name

body

####### 2.5.2.10.3.2.2.0 In

body

####### 2.5.2.10.3.2.3.0 Schema

######## 2.5.2.10.3.2.3.1 Type

🔹 object

######## 2.5.2.10.3.2.3.2 Properties

| Property | Value |
|----------|-------|
| Status | suspended |

###### 2.5.2.10.3.3.0.0 Authorization

####### 2.5.2.10.3.3.1.0 Name

Authorization

####### 2.5.2.10.3.3.2.0 In

header

####### 2.5.2.10.3.3.3.0 Value

Bearer <admin_jwt>

##### 2.5.2.10.4.0.0.0 Authentication

Admin's JWT is sent in the Authorization header.

##### 2.5.2.10.5.0.0.0 Error Handling

Handles 401, 403, 500 responses and displays appropriate user feedback.

##### 2.5.2.10.6.0.0.0 Performance

Request timeout set to 10 seconds.

### 2.5.3.0.0.0.0.0 Service Call

#### 2.5.3.1.0.0.0.0 Source Id

REPO-BE-API-GATEWAY

#### 2.5.3.2.0.0.0.0 Target Id

REPO-BE-IDENTITY

#### 2.5.3.3.0.0.0.0 Message

3. [Security] Validates admin JWT and forwards authorized request.

#### 2.5.3.4.0.0.0.0 Sequence Number

3

#### 2.5.3.5.0.0.0.0 Type

🔹 Service Call

#### 2.5.3.6.0.0.0.0 Is Synchronous

✅ Yes

#### 2.5.3.7.0.0.0.0 Return Message

Propagates HTTP 204 or error status from service.

#### 2.5.3.8.0.0.0.0 Has Return

✅ Yes

#### 2.5.3.9.0.0.0.0 Is Activation

✅ Yes

#### 2.5.3.10.0.0.0.0 Technical Details

##### 2.5.3.10.1.0.0.0 Protocol

HTTP

##### 2.5.3.10.2.0.0.0 Method

PATCH /users/{targetUserId}/status

##### 2.5.3.10.3.0.0.0 Parameters

###### 2.5.3.10.3.1.0.0 x-user-id

####### 2.5.3.10.3.1.1.0 Name

x-user-id

####### 2.5.3.10.3.1.2.0 In

header

####### 2.5.3.10.3.1.3.0 Description

Admin's user ID extracted from JWT claims.

###### 2.5.3.10.3.2.0.0 x-user-roles

####### 2.5.3.10.3.2.1.0 Name

x-user-roles

####### 2.5.3.10.3.2.2.0 In

header

####### 2.5.3.10.3.2.3.0 Description

Admin's roles (e.g., 'Administrator') from JWT claims.

##### 2.5.3.10.4.0.0.0 Authentication

Verifies JWT signature and expiry using AWS Cognito public keys. Rejects with 401 if invalid.

##### 2.5.3.10.5.0.0.0 Error Handling

Returns 401 on failed JWT validation. Returns 503 if downstream service is unavailable.

##### 2.5.3.10.6.0.0.0 Performance

P99 latency < 50ms.

### 2.5.4.0.0.0.0.0 Internal Logic

#### 2.5.4.1.0.0.0.0 Source Id

REPO-BE-IDENTITY

#### 2.5.4.2.0.0.0.0 Target Id

REPO-BE-IDENTITY

#### 2.5.4.3.0.0.0.0 Message

4. [Security Checkpoint] Enforces RBAC by verifying 'Administrator' role.

#### 2.5.4.4.0.0.0.0 Sequence Number

4

#### 2.5.4.5.0.0.0.0 Type

🔹 Internal Logic

#### 2.5.4.6.0.0.0.0 Is Synchronous

✅ Yes

#### 2.5.4.7.0.0.0.0 Return Message



#### 2.5.4.8.0.0.0.0 Has Return

❌ No

#### 2.5.4.9.0.0.0.0 Is Activation

✅ Yes

#### 2.5.4.10.0.0.0.0 Technical Details

##### 2.5.4.10.1.0.0.0 Protocol

In-process

##### 2.5.4.10.2.0.0.0 Method

rbac.guard.canActivate()

##### 2.5.4.10.3.0.0.0 Parameters

- 'suspend:user'
- context.headers['x-user-roles']

##### 2.5.4.10.4.0.0.0 Authentication

N/A

##### 2.5.4.10.5.0.0.0 Error Handling

If roles do not include 'Administrator', throws a `ForbiddenException`. This immediately stops the flow and returns an HTTP 403 response.

##### 2.5.4.10.6.0.0.0 Performance

Execution time < 1ms.

### 2.5.5.0.0.0.0.0 Database Operation

#### 2.5.5.1.0.0.0.0 Source Id

REPO-BE-IDENTITY

#### 2.5.5.2.0.0.0.0 Target Id

REPO-DB-POSTGRESQL

#### 2.5.5.3.0.0.0.0 Message

5. Begins a database transaction.

#### 2.5.5.4.0.0.0.0 Sequence Number

5

#### 2.5.5.5.0.0.0.0 Type

🔹 Database Operation

#### 2.5.5.6.0.0.0.0 Is Synchronous

✅ Yes

#### 2.5.5.7.0.0.0.0 Return Message

Transaction started.

#### 2.5.5.8.0.0.0.0 Has Return

✅ Yes

#### 2.5.5.9.0.0.0.0 Is Activation

✅ Yes

#### 2.5.5.10.0.0.0.0 Technical Details

##### 2.5.5.10.1.0.0.0 Protocol

SQL/TCP

##### 2.5.5.10.2.0.0.0 Method

BEGIN TRANSACTION

##### 2.5.5.10.3.0.0.0 Parameters

*No items available*

##### 2.5.5.10.4.0.0.0 Authentication

Uses credentials from AWS Secrets Manager.

##### 2.5.5.10.5.0.0.0 Error Handling

Throws a `DatabaseException` if a transaction cannot be started.

##### 2.5.5.10.6.0.0.0 Performance

P99 latency < 5ms.

### 2.5.6.0.0.0.0.0 Database Operation

#### 2.5.6.1.0.0.0.0 Source Id

REPO-BE-IDENTITY

#### 2.5.6.2.0.0.0.0 Target Id

REPO-DB-POSTGRESQL

#### 2.5.6.3.0.0.0.0 Message

6. Updates the user's status to 'suspended'.

#### 2.5.6.4.0.0.0.0 Sequence Number

6

#### 2.5.6.5.0.0.0.0 Type

🔹 Database Operation

#### 2.5.6.6.0.0.0.0 Is Synchronous

✅ Yes

#### 2.5.6.7.0.0.0.0 Return Message

1 row affected.

#### 2.5.6.8.0.0.0.0 Has Return

✅ Yes

#### 2.5.6.9.0.0.0.0 Technical Details

##### 2.5.6.9.1.0.0.0 Protocol

SQL/TCP

##### 2.5.6.9.2.0.0.0 Method

```sql
UPDATE "users" SET "status" = 'suspended', "updatedAt" = NOW() WHERE "id" = :targetUserId
```

##### 2.5.6.9.3.0.0.0 Parameters

- {'name': 'targetUserId', 'type': 'UUID'}

##### 2.5.6.9.4.0.0.0 Authentication

N/A (within transaction)

##### 2.5.6.9.5.0.0.0 Error Handling

Any database error will be caught, triggering a ROLLBACK.

##### 2.5.6.9.6.0.0.0 Performance

P99 latency < 20ms.

### 2.5.7.0.0.0.0.0 Database Operation

#### 2.5.7.1.0.0.0.0 Source Id

REPO-BE-IDENTITY

#### 2.5.7.2.0.0.0.0 Target Id

REPO-DB-POSTGRESQL

#### 2.5.7.3.0.0.0.0 Message

7. [Audit Requirement] Inserts an immutable record into the audit trail.

#### 2.5.7.4.0.0.0.0 Sequence Number

7

#### 2.5.7.5.0.0.0.0 Type

🔹 Database Operation

#### 2.5.7.6.0.0.0.0 Is Synchronous

✅ Yes

#### 2.5.7.7.0.0.0.0 Return Message

1 row affected.

#### 2.5.7.8.0.0.0.0 Has Return

✅ Yes

#### 2.5.7.9.0.0.0.0 Technical Details

##### 2.5.7.9.1.0.0.0 Protocol

SQL/TCP

##### 2.5.7.9.2.0.0.0 Method

```sql
INSERT INTO "audit_log" ("actorId", "action", "targetId", "targetType", "outcome", "details") VALUES (:adminUserId, 'user.suspend', :targetUserId, 'user', 'success', :detailsJson)
```

##### 2.5.7.9.3.0.0.0 Parameters

###### 2.5.7.9.3.1.0.0 adminUserId

####### 2.5.7.9.3.1.1.0 Name

adminUserId

####### 2.5.7.9.3.1.2.0 Type

🔹 UUID

####### 2.5.7.9.3.1.3.0 Source

x-user-id header

###### 2.5.7.9.3.2.0.0 targetUserId

####### 2.5.7.9.3.2.1.0 Name

targetUserId

####### 2.5.7.9.3.2.2.0 Type

🔹 UUID

###### 2.5.7.9.3.3.0.0 detailsJson

####### 2.5.7.9.3.3.1.0 Name

detailsJson

####### 2.5.7.9.3.3.2.0 Type

🔹 JSONB

####### 2.5.7.9.3.3.3.0 Value

{"reason": "Suspended by administrator."}

##### 2.5.7.9.4.0.0.0 Authentication

N/A (within transaction)

##### 2.5.7.9.5.0.0.0 Error Handling

CRITICAL: A failure in this operation (e.g., DB permissions error, constraint violation) MUST trigger a ROLLBACK of the entire transaction.

##### 2.5.7.9.6.0.0.0 Performance

P99 latency < 20ms.

### 2.5.8.0.0.0.0.0 Database Operation

#### 2.5.8.1.0.0.0.0 Source Id

REPO-BE-IDENTITY

#### 2.5.8.2.0.0.0.0 Target Id

REPO-DB-POSTGRESQL

#### 2.5.8.3.0.0.0.0 Message

8. Commits the atomic transaction.

#### 2.5.8.4.0.0.0.0 Sequence Number

8

#### 2.5.8.5.0.0.0.0 Type

🔹 Database Operation

#### 2.5.8.6.0.0.0.0 Is Synchronous

✅ Yes

#### 2.5.8.7.0.0.0.0 Return Message

Transaction committed.

#### 2.5.8.8.0.0.0.0 Has Return

✅ Yes

#### 2.5.8.9.0.0.0.0 Technical Details

##### 2.5.8.9.1.0.0.0 Protocol

SQL/TCP

##### 2.5.8.9.2.0.0.0 Method

COMMIT

##### 2.5.8.9.3.0.0.0 Parameters

*No items available*

##### 2.5.8.9.4.0.0.0 Authentication

N/A (within transaction)

##### 2.5.8.9.5.0.0.0 Error Handling

A failure to commit will trigger a final rollback attempt and result in an HTTP 500 error.

##### 2.5.8.9.6.0.0.0 Performance

P99 latency < 10ms.

### 2.5.9.0.0.0.0.0 Event Publication

#### 2.5.9.1.0.0.0.0 Source Id

REPO-BE-IDENTITY

#### 2.5.9.2.0.0.0.0 Target Id

REPO-BE-IDENTITY

#### 2.5.9.3.0.0.0.0 Message

9. [Async] Publishes `UserSuspended` event to invalidate active sessions.

#### 2.5.9.4.0.0.0.0 Sequence Number

9

#### 2.5.9.5.0.0.0.0 Type

🔹 Event Publication

#### 2.5.9.6.0.0.0.0 Is Synchronous

❌ No

#### 2.5.9.7.0.0.0.0 Return Message



#### 2.5.9.8.0.0.0.0 Has Return

❌ No

#### 2.5.9.9.0.0.0.0 Technical Details

##### 2.5.9.9.1.0.0.0 Protocol

AWS SNS

##### 2.5.9.9.2.0.0.0 Method

publish('user-events-topic')

##### 2.5.9.9.3.0.0.0 Parameters

- {'eventType': 'UserSuspended', 'payload': {'userId': 'targetUserId'}}

##### 2.5.9.9.4.0.0.0 Authentication

Service IAM Role

##### 2.5.9.9.5.0.0.0 Error Handling

Failure to publish is logged as a warning but does not fail the primary API request. A separate process should monitor for event publication failures.

##### 2.5.9.9.6.0.0.0 Performance

N/A

## 2.6.0.0.0.0.0.0 Notes

### 2.6.1.0.0.0.0.0 Content

#### 2.6.1.1.0.0.0.0 Content

The two-step confirmation UI flow (REQ-USR-001) is handled entirely within the Admin Dashboard before the API request is sent. It's a critical prerequisite for this sequence.

#### 2.6.1.2.0.0.0.0 Position

top-left

#### 2.6.1.3.0.0.0.0 Participant Id

REPO-FE-ADMIN

#### 2.6.1.4.0.0.0.0 Sequence Number

1

### 2.6.2.0.0.0.0.0 Content

#### 2.6.2.1.0.0.0.0 Content

Error Handling: If the INSERT into `audit_log` fails (Step 7), the Identity Service MUST issue a `ROLLBACK` command to the database, reverting the user status change from Step 6. An HTTP 500 is then returned to the client, ensuring system consistency.

#### 2.6.2.2.0.0.0.0 Position

bottom-right

#### 2.6.2.3.0.0.0.0 Participant Id

REPO-BE-IDENTITY

#### 2.6.2.4.0.0.0.0 Sequence Number

7

## 2.7.0.0.0.0.0.0 Implementation Guidance

| Property | Value |
|----------|-------|
| Security Requirements | The `audit_log` table must have highly restrictive... |
| Performance Targets | The entire synchronous transaction (Steps 5-8) mus... |
| Error Handling Strategy | The core of the strategy is the atomic database tr... |
| Testing Considerations | 1. Write an integration test that uses database mo... |
| Monitoring Requirements | 1. Create a Prometheus counter `admin_actions_tota... |
| Deployment Considerations | Any changes to the `audit_log` table schema must b... |

