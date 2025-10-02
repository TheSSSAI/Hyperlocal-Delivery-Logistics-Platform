# 1 Overview

## 1.1 Diagram Id

SEQ-SF-001

## 1.2 Name

API Request Authorization with RBAC

## 1.3 Description

Details the process of how an incoming API request from an authenticated user is authorized based on their assigned role before being processed by a microservice.

## 1.4 Type

🔹 SecurityFlow

## 1.5 Purpose

To enforce the principle of least privilege and ensure users can only access the data and perform the actions permitted for their role, as defined in REQ-USR-001.

## 1.6 Complexity

Medium

## 1.7 Priority

🚨 Critical

## 1.8 Frequency

OnDemand

## 1.9 Participants

- REPO-FE-CUST
- API-GATEWAY
- REPO-BE-ORDER

## 1.10 Key Interactions

- A Customer App makes a request to GET /api/v1/orders/{orderId} with a valid JWT in the Authorization header.
- The Amazon API Gateway intercepts the request.
- The Gateway's Cognito authorizer validates the JWT's signature, issuer, and expiration.
- The request is forwarded to the Order Service.
- A global authorization guard in the NestJS service extracts the 'userId' and 'role' claims from the JWT payload.
- The guard first checks if the 'Customer' role is allowed to access this endpoint.
- The guard then performs record-level security, querying the order and checking if the userId from the token matches the 'customerId' on the requested order record.
- If both checks pass, the request proceeds to the controller. If not, a 403 Forbidden or 404 Not Found error is returned.

## 1.11 Triggers

- Any API call to a protected endpoint that requires specific permissions.

## 1.12 Outcomes

- The user's request is either processed successfully or rejected with an appropriate authorization error (403 or 404).

## 1.13 Business Rules

- A Role-Based Access Control (RBAC) model must be implemented and enforced at the API Gateway and microservice levels (REQ-NFR-003).
- A Customer user role shall be able to read their own orders (REQ-USR-001).
- An Administrator user role shall have full CRUD access on all system data (REQ-USR-001).

## 1.14 Error Scenarios

- A user tries to access an endpoint their role is not configured for (e.g., a customer trying to access an admin endpoint).
- A customer tries to fetch the details of another customer's order by guessing the ID.

## 1.15 Integration Points

- AWS Cognito (as the JWT issuer).
- NestJS Guards for implementing authorization logic.

# 2.0 Details

## 2.1 Diagram Id

SEQ-SF-001

## 2.2 Name

API Request Authorization with RBAC (Defense in Depth)

## 2.3 Description

Provides a detailed technical implementation of a multi-layered security authorization flow for an API request, demonstrating the 'Defense in Depth' and 'Zero Trust' patterns. The sequence covers JWT validation at the API Gateway via AWS Cognito, followed by role-based and record-level ownership checks within the NestJS microservice, as mandated by REQ-NFR-003 and REQ-USR-001.

## 2.4 Participants

### 2.4.1 Client Application

#### 2.4.1.1 Repository Id

REPO-FE-CUST

#### 2.4.1.2 Display Name

Customer Mobile App

#### 2.4.1.3 Type

🔹 Client Application

#### 2.4.1.4 Technology

React Native

#### 2.4.1.5 Order

1

#### 2.4.1.6 Style

| Property | Value |
|----------|-------|
| Shape | actor |
| Color | #1E90FF |
| Stereotype | Frontend |

### 2.4.2.0 API Gateway

#### 2.4.2.1 Repository Id

API-GATEWAY

#### 2.4.2.2 Display Name

Amazon API Gateway

#### 2.4.2.3 Type

🔹 API Gateway

#### 2.4.2.4 Technology

AWS API Gateway

#### 2.4.2.5 Order

2

#### 2.4.2.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #FF8C00 |
| Stereotype | Gateway |

### 2.4.3.0 Identity Provider

#### 2.4.3.1 Repository Id

AWS-COGNITO

#### 2.4.3.2 Display Name

AWS Cognito

#### 2.4.3.3 Type

🔹 Identity Provider

#### 2.4.3.4 Technology

AWS Cognito

#### 2.4.3.5 Order

3

#### 2.4.3.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #FF4500 |
| Stereotype | Security |

### 2.4.4.0 Application Service

#### 2.4.4.1 Repository Id

REPO-BE-ORDER

#### 2.4.4.2 Display Name

Order Service

#### 2.4.4.3 Type

🔹 Application Service

#### 2.4.4.4 Technology

NestJS (Node.js)

#### 2.4.4.5 Order

4

#### 2.4.4.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #32CD32 |
| Stereotype | Microservice |

### 2.4.5.0 Database

#### 2.4.5.1 Repository Id

REPO-BE-ORDER-DB

#### 2.4.5.2 Display Name

Order Database

#### 2.4.5.3 Type

🔹 Database

#### 2.4.5.4 Technology

PostgreSQL

#### 2.4.5.5 Order

5

#### 2.4.5.6 Style

| Property | Value |
|----------|-------|
| Shape | database |
| Color | #8A2BE2 |
| Stereotype | Persistence |

## 2.5.0.0 Interactions

### 2.5.1.0 APIRequest

#### 2.5.1.1 Source Id

REPO-FE-CUST

#### 2.5.1.2 Target Id

API-GATEWAY

#### 2.5.1.3 Message

1. Request Order Details

#### 2.5.1.4 Sequence Number

1

#### 2.5.1.5 Type

🔹 APIRequest

#### 2.5.1.6 Is Synchronous

✅ Yes

#### 2.5.1.7 Return Message

16. Returns 200 OK with Order Data

#### 2.5.1.8 Has Return

✅ Yes

#### 2.5.1.9 Is Activation

✅ Yes

#### 2.5.1.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS/1.1 |
| Method | GET /api/v1/orders/a1b2c3d4 |
| Parameters | Authorization: Bearer <JWT> |
| Authentication | Bearer Token (JWT) |
| Error Handling | Client-side handling of 4xx/5xx responses. |
| Performance | End-to-end latency should be < 500ms (P95). |

### 2.5.2.0 SecurityCheckpoint

#### 2.5.2.1 Source Id

API-GATEWAY

#### 2.5.2.2 Target Id

AWS-COGNITO

#### 2.5.2.3 Message

2. Validate JWT (Cognito Authorizer)

#### 2.5.2.4 Sequence Number

2

#### 2.5.2.5 Type

🔹 SecurityCheckpoint

#### 2.5.2.6 Is Synchronous

✅ Yes

#### 2.5.2.7 Return Message

3. Returns JWT claims on success

#### 2.5.2.8 Has Return

✅ Yes

#### 2.5.2.9 Is Activation

✅ Yes

#### 2.5.2.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | Internal AWS API Call |
| Method | Verify JWT Signature, Issuer, Expiration |
| Parameters | JWT from Authorization header |
| Authentication | IAM Role |
| Error Handling | If validation fails, API Gateway immediately retur... |
| Performance | Latency < 20ms |

### 2.5.3.0 InternalRequest

#### 2.5.3.1 Source Id

API-GATEWAY

#### 2.5.3.2 Target Id

REPO-BE-ORDER

#### 2.5.3.3 Message

4. Forward Authorized Request

#### 2.5.3.4 Sequence Number

4

#### 2.5.3.5 Type

🔹 InternalRequest

#### 2.5.3.6 Is Synchronous

✅ Yes

#### 2.5.3.7 Return Message

15. Returns 200 OK with Order Data

#### 2.5.3.8 Has Return

✅ Yes

#### 2.5.3.9 Is Activation

✅ Yes

#### 2.5.3.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTP |
| Method | GET /orders/a1b2c3d4 |
| Parameters | Headers include decoded JWT claims (x-user-id, x-u... |
| Authentication | Request is from a trusted source within the VPC. |
| Error Handling | App Mesh handles retries on transient network erro... |
| Performance | VPC latency < 5ms |

### 2.5.4.0 InternalProcessing

#### 2.5.4.1 Source Id

REPO-BE-ORDER

#### 2.5.4.2 Target Id

REPO-BE-ORDER

#### 2.5.4.3 Message

5. [AuthGuard] Intercept & Extract Claims

#### 2.5.4.4 Sequence Number

5

#### 2.5.4.5 Type

🔹 InternalProcessing

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
| Protocol | In-process call |
| Method | NestJS Guard `canActivate()` method |
| Parameters | Incoming request object with headers |
| Authentication | N/A |
| Error Handling | If headers are missing, throws an Internal Server ... |
| Performance | Latency < 1ms |

### 2.5.5.0 SecurityCheckpoint

#### 2.5.5.1 Source Id

REPO-BE-ORDER

#### 2.5.5.2 Target Id

REPO-BE-ORDER

#### 2.5.5.3 Message

6. [RolesGuard] Perform Role-Level Check

#### 2.5.5.4 Sequence Number

6

#### 2.5.5.5 Type

🔹 SecurityCheckpoint

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
| Protocol | In-process call |
| Method | Check if user role ('Customer') is present in `@Ro... |
| Parameters | role: 'Customer' |
| Authentication | N/A |
| Error Handling | If role is not allowed, throws `ForbiddenException... |
| Performance | Latency < 1ms |

### 2.5.6.0 DataAccess

#### 2.5.6.1 Source Id

REPO-BE-ORDER

#### 2.5.6.2 Target Id

REPO-BE-ORDER-DB

#### 2.5.6.3 Message

7. Fetch Order for Ownership Verification

#### 2.5.6.4 Sequence Number

7

#### 2.5.6.5 Type

🔹 DataAccess

#### 2.5.6.6 Is Synchronous

✅ Yes

#### 2.5.6.7 Return Message

8. Returns Order Record

#### 2.5.6.8 Has Return

✅ Yes

#### 2.5.6.9 Is Activation

✅ Yes

#### 2.5.6.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | TCP/IP |
| Method | SELECT * FROM orders WHERE id = $1 LIMIT 1; |
| Parameters | orderId: 'a1b2c3d4' |
| Authentication | Database credentials from AWS Secrets Manager. |
| Error Handling | Database connection errors are caught and logged. |
| Performance | Query time < 10ms (requires index on `id` column). |

### 2.5.7.0 SecurityCheckpoint

#### 2.5.7.1 Source Id

REPO-BE-ORDER

#### 2.5.7.2 Target Id

REPO-BE-ORDER

#### 2.5.7.3 Message

9. [OwnershipGuard] Perform Record-Level Check

#### 2.5.7.4 Sequence Number

9

#### 2.5.7.5 Type

🔹 SecurityCheckpoint

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
| Protocol | In-process call |
| Method | Compare token `userId` with `order.customerId` fro... |
| Parameters | userId from token, customerId from DB record |
| Authentication | N/A |
| Error Handling | If IDs do not match or order not found, throws `No... |
| Performance | Latency < 1ms |

### 2.5.8.0 InternalProcessing

#### 2.5.8.1 Source Id

REPO-BE-ORDER

#### 2.5.8.2 Target Id

REPO-BE-ORDER

#### 2.5.8.3 Message

10. Authorization successful, proceed to Controller

#### 2.5.8.4 Sequence Number

10

#### 2.5.8.5 Type

🔹 InternalProcessing

#### 2.5.8.6 Is Synchronous

✅ Yes

#### 2.5.8.7 Return Message



#### 2.5.8.8 Has Return

❌ No

#### 2.5.8.9 Is Activation

❌ No

#### 2.5.8.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | In-process call |
| Method | Guard returns `true`. |
| Parameters | N/A |
| Authentication | N/A |
| Error Handling | N/A |
| Performance | N/A |

### 2.5.9.0 BusinessLogic

#### 2.5.9.1 Source Id

REPO-BE-ORDER

#### 2.5.9.2 Target Id

REPO-BE-ORDER

#### 2.5.9.3 Message

11. [OrderController] Execute Business Logic

#### 2.5.9.4 Sequence Number

11

#### 2.5.9.5 Type

🔹 BusinessLogic

#### 2.5.9.6 Is Synchronous

✅ Yes

#### 2.5.9.7 Return Message

14. Returns prepared Order DTO

#### 2.5.9.8 Has Return

✅ Yes

#### 2.5.9.9 Is Activation

❌ No

#### 2.5.9.10 Nested Interactions

- {'sourceId': 'REPO-BE-ORDER', 'targetId': 'REPO-BE-ORDER-DB', 'message': '12. Fetch additional related data (e.g., items)', 'sequenceNumber': 12, 'type': 'DataAccess', 'isSynchronous': True, 'returnMessage': '13. Returns Order Items', 'hasReturn': True, 'isActivation': True, 'technicalDetails': {'protocol': 'TCP/IP', 'method': 'SELECT * FROM order_items WHERE order_id = $1;', 'parameters': "orderId: 'a1b2c3d4'", 'authentication': 'Database credentials.', 'errorHandling': 'Standard DB error handling.', 'performance': 'Query time < 15ms'}}

## 2.6.0.0 Notes

### 2.6.1.0 Content

#### 2.6.1.1 Content

Failure Case 1: If JWT validation fails (step 2), the API Gateway immediately responds with '401 Unauthorized'. The request never reaches the Order Service.

#### 2.6.1.2 Position

TopRight

#### 2.6.1.3 Participant Id

API-GATEWAY

#### 2.6.1.4 Sequence Number

2

### 2.6.2.0 Content

#### 2.6.2.1 Content

Failure Case 2: If the Role-Level Check fails (step 6), the Order Service responds with '403 Forbidden'. This happens if a Customer tries to access an admin-only endpoint.

#### 2.6.2.2 Position

BottomRight

#### 2.6.2.3 Participant Id

REPO-BE-ORDER

#### 2.6.2.4 Sequence Number

6

### 2.6.3.0 Content

#### 2.6.3.1 Content

Failure Case 3: If the Record-Level Check fails (step 9), the Order Service responds with '404 Not Found'. This prevents attackers from confirming the existence of order IDs that do not belong to them.

#### 2.6.3.2 Position

BottomRight

#### 2.6.3.3 Participant Id

REPO-BE-ORDER

#### 2.6.3.4 Sequence Number

9

## 2.7.0.0 Implementation Guidance

| Property | Value |
|----------|-------|
| Security Requirements | 1. **API Gateway Authorizer**: Configure a Lambda ... |
| Performance Targets | The entire authorization chain (API Gateway valida... |
| Error Handling Strategy | A global NestJS `ExceptionFilter` should be used t... |
| Testing Considerations | - **Unit Tests**: Test the `AuthGuard` logic in is... |
| Monitoring Requirements | 1. **CloudWatch Alarms**: Create alarms on the rat... |
| Deployment Considerations | The API Gateway configuration, including the autho... |

