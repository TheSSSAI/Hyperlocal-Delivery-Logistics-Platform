# 1 Overview

## 1.1 Diagram Id

SEQ-FF-003

## 1.2 Name

Customer Submits Rating and Review

## 1.3 Description

After an order is delivered, the customer is prompted to submit separate ratings and optional text reviews for the vendor/products and the delivery rider.

## 1.4 Type

🔹 FeatureFlow

## 1.5 Purpose

To collect feedback on vendor and rider performance, building trust and quality control within the marketplace.

## 1.6 Complexity

Low

## 1.7 Priority

🔴 High

## 1.8 Frequency

OnDemand

## 1.9 Participants

- REPO-FE-CUST
- REPO-BE-CHAT

## 1.10 Key Interactions

- Order is marked 'delivered'.
- Customer app prompts the user to leave a review.
- Customer submits a 1-5 star rating and optional text for the vendor.
- Customer submits a separate 1-5 star rating and optional text for the rider.
- The request is sent to the Ratings & Communication Service.
- The service validates the request and persists the ratings and reviews in the database.
- The service updates the average rating calculations for the vendor and rider.

## 1.11 Triggers

- An order is successfully delivered and the customer opens the app.

## 1.12 Outcomes

- New ratings and reviews are stored in the system.
- Vendor and rider average ratings are updated.

## 1.13 Business Rules

- Customers can only review orders they have completed (REQ-FUN-009).
- Separate ratings must be provided for the vendor and the rider (REQ-FUN-009).

## 1.14 Error Scenarios

- User tries to submit a review for an order that is not yet delivered.

## 1.15 Integration Points

- Consumes 'OrderDelivered' event to trigger the review prompt.

# 2.0 Details

## 2.1 Diagram Id

SEQ-FF-003-IMPL

## 2.2 Name

Implementation: Customer Submits Order Rating and Review

## 2.3 Description

Provides a detailed technical specification for the feature flow where a customer, after order delivery, submits ratings for both the vendor and the rider. The sequence covers client-side interaction, API gateway validation, backend service logic for validation and persistence, and database transactions, including the calculation of average ratings.

## 2.4 Participants

### 2.4.1 Client Application

#### 2.4.1.1 Repository Id

REPO-FE-CUST

#### 2.4.1.2 Display Name

Customer Mobile App

#### 2.4.1.3 Type

🔹 Client Application

#### 2.4.1.4 Technology

React Native v0.73+

#### 2.4.1.5 Order

1

#### 2.4.1.6 Style

| Property | Value |
|----------|-------|
| Shape | actor |
| Color | #1E90FF |
| Stereotype | «Frontend» |

### 2.4.2.0 API Gateway

#### 2.4.2.1 Repository Id

REPO-BE-API-GATEWAY

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
| Color | #FF8C00 |
| Stereotype | «Gateway» |

### 2.4.3.0 Microservice

#### 2.4.3.1 Repository Id

REPO-BE-COMMS

#### 2.4.3.2 Display Name

Ratings & Communication Service

#### 2.4.3.3 Type

🔹 Microservice

#### 2.4.3.4 Technology

NestJS on Node.js v18.18+

#### 2.4.3.5 Order

3

#### 2.4.3.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #9370DB |
| Stereotype | «Service» |

### 2.4.4.0 Database

#### 2.4.4.1 Repository Id

REPO-DB-POSTGRES

#### 2.4.4.2 Display Name

PostgreSQL Database

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
| Color | #32CD32 |
| Stereotype | «Database» |

## 2.5.0.0 Interactions

### 2.5.1.0 User Interaction

#### 2.5.1.1 Source Id

REPO-FE-CUST

#### 2.5.1.2 Target Id

REPO-FE-CUST

#### 2.5.1.3 Message

User is prompted to rate the delivered order upon opening the app or order details screen.

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

❌ No

#### 2.5.1.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | UI Event |
| Method | onOrderDeliveredPrompt |
| Parameters | orderId |
| Authentication | N/A |
| Error Handling | If prompt fails to show, a 'Rate Order' button rem... |
| Performance | UI must remain responsive. |

### 2.5.2.0 API Request

#### 2.5.2.1 Source Id

REPO-FE-CUST

#### 2.5.2.2 Target Id

REPO-BE-API-GATEWAY

#### 2.5.2.3 Message

POST /api/v1/ratings

#### 2.5.2.4 Sequence Number

2

#### 2.5.2.5 Type

🔹 API Request

#### 2.5.2.6 Is Synchronous

✅ Yes

#### 2.5.2.7 Return Message

201 Created | 400 | 401 | 403 | 404 | 409

#### 2.5.2.8 Has Return

✅ Yes

#### 2.5.2.9 Is Activation

✅ Yes

#### 2.5.2.10 Technical Details

##### 2.5.2.10.1 Protocol

HTTPS/TLS 1.2+

##### 2.5.2.10.2 Method

POST

##### 2.5.2.10.3 Parameters

| Property | Value |
|----------|-------|
| Headers | {'Authorization': 'Bearer <JWT>', 'Content-Type': 'application/json'} |
| Body | SubmitRatingDto: { orderId: string, vendorRating: ... |

##### 2.5.2.10.4 Authentication

JWT Bearer Token issued by Cognito.

##### 2.5.2.10.5 Error Handling

Client handles HTTP error codes gracefully, displaying user-friendly messages.

##### 2.5.2.10.6 Performance

Request-to-response should be within the app's standard timeout (e.g., 15s).

### 2.5.3.0.0 Service Invocation

#### 2.5.3.1.0 Source Id

REPO-BE-API-GATEWAY

#### 2.5.3.2.0 Target Id

REPO-BE-COMMS

#### 2.5.3.3.0 Message

Forward POST /ratings request

#### 2.5.3.4.0 Sequence Number

3

#### 2.5.3.5.0 Type

🔹 Service Invocation

#### 2.5.3.6.0 Is Synchronous

✅ Yes

#### 2.5.3.7.0 Return Message

Forwarded HTTP Response

#### 2.5.3.8.0 Has Return

✅ Yes

#### 2.5.3.9.0 Is Activation

✅ Yes

#### 2.5.3.10.0 Technical Details

##### 2.5.3.10.1 Protocol

HTTP

##### 2.5.3.10.2 Method

POST

##### 2.5.3.10.3 Parameters

| Property | Value |
|----------|-------|
| Headers | {'x-correlation-id': '<generated-uuid>', 'x-user-id': '<from-jwt>', 'x-user-role': 'Customer'} |
| Body | SubmitRatingDto |

##### 2.5.3.10.4 Authentication

JWT validation performed by API Gateway; user context is passed downstream.

##### 2.5.3.10.5 Error Handling

Routes to the configured NestJS service endpoint. Handles timeouts and internal routing errors.

##### 2.5.3.10.6 Performance

Latency overhead should be < 10ms.

### 2.5.4.0.0 Database Query

#### 2.5.4.1.0 Source Id

REPO-BE-COMMS

#### 2.5.4.2.0 Target Id

REPO-DB-POSTGRES

#### 2.5.4.3.0 Message

```sql
SELECT * FROM orders WHERE id = :orderId AND customerId = :jwtCustomerId AND status = 'delivered'
```

#### 2.5.4.4.0 Sequence Number

4

#### 2.5.4.5.0 Type

🔹 Database Query

#### 2.5.4.6.0 Is Synchronous

✅ Yes

#### 2.5.4.7.0 Return Message

Order Record | No Record Found

#### 2.5.4.8.0 Has Return

✅ Yes

#### 2.5.4.9.0 Is Activation

❌ No

#### 2.5.4.10.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | TCP/IP |
| Method | SQL SELECT |
| Parameters | orderId, jwtCustomerId |
| Authentication | Service uses credentials from AWS Secrets Manager. |
| Error Handling | If no record is found or status/customerId mismatc... |
| Performance | Query must use the primary key index on 'orders' t... |

### 2.5.5.0.0 Database Query

#### 2.5.5.1.0 Source Id

REPO-BE-COMMS

#### 2.5.5.2.0 Target Id

REPO-DB-POSTGRES

#### 2.5.5.3.0 Message

```sql
SELECT id FROM ratings WHERE orderId = :orderId
```

#### 2.5.5.4.0 Sequence Number

5

#### 2.5.5.5.0 Type

🔹 Database Query

#### 2.5.5.6.0 Is Synchronous

✅ Yes

#### 2.5.5.7.0 Return Message

Existing Rating ID(s) | No Records Found

#### 2.5.5.8.0 Has Return

✅ Yes

#### 2.5.5.9.0 Is Activation

❌ No

#### 2.5.5.10.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | TCP/IP |
| Method | SQL SELECT |
| Parameters | orderId |
| Authentication | Service uses credentials from AWS Secrets Manager. |
| Error Handling | If any records are found, throw a 409 Conflict err... |
| Performance | Query must use an index on the 'orderId' foreign k... |

### 2.5.6.0.0 Database Transaction

#### 2.5.6.1.0 Source Id

REPO-BE-COMMS

#### 2.5.6.2.0 Target Id

REPO-DB-POSTGRES

#### 2.5.6.3.0 Message

BEGIN TRANSACTION

#### 2.5.6.4.0 Sequence Number

6

#### 2.5.6.5.0 Type

🔹 Database Transaction

#### 2.5.6.6.0 Is Synchronous

✅ Yes

#### 2.5.6.7.0 Return Message

OK

#### 2.5.6.8.0 Has Return

✅ Yes

#### 2.5.6.9.0 Is Activation

❌ No

#### 2.5.6.10.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | TCP/IP |
| Method | BEGIN |
| Parameters | N/A |
| Authentication | N/A |
| Error Handling | On failure, the entire transaction will be rolled ... |
| Performance | N/A |

### 2.5.7.0.0 Database Write

#### 2.5.7.1.0 Source Id

REPO-BE-COMMS

#### 2.5.7.2.0 Target Id

REPO-DB-POSTGRES

#### 2.5.7.3.0 Message

```sql
INSERT INTO ratings (...) VALUES (...); INSERT INTO ratings (...)
```

#### 2.5.7.4.0 Sequence Number

7

#### 2.5.7.5.0 Type

🔹 Database Write

#### 2.5.7.6.0 Is Synchronous

✅ Yes

#### 2.5.7.7.0 Return Message

New Rating IDs

#### 2.5.7.8.0 Has Return

✅ Yes

#### 2.5.7.9.0 Is Activation

❌ No

#### 2.5.7.10.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | TCP/IP |
| Method | SQL INSERT |
| Parameters | Two records are created: one for vendor (targetTyp... |
| Authentication | N/A |
| Error Handling | Handled by transaction rollback. |
| Performance | Bulk insert or multi-statement query is preferred. |

### 2.5.8.0.0 Database Transaction

#### 2.5.8.1.0 Source Id

REPO-BE-COMMS

#### 2.5.8.2.0 Target Id

REPO-DB-POSTGRES

#### 2.5.8.3.0 Message

COMMIT TRANSACTION

#### 2.5.8.4.0 Sequence Number

8

#### 2.5.8.5.0 Type

🔹 Database Transaction

#### 2.5.8.6.0 Is Synchronous

✅ Yes

#### 2.5.8.7.0 Return Message

OK

#### 2.5.8.8.0 Has Return

✅ Yes

#### 2.5.8.9.0 Is Activation

❌ No

#### 2.5.8.10.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | TCP/IP |
| Method | COMMIT |
| Parameters | N/A |
| Authentication | N/A |
| Error Handling | A commit failure is a critical database error requ... |
| Performance | N/A |

### 2.5.9.0.0 Event Publication

#### 2.5.9.1.0 Source Id

REPO-BE-COMMS

#### 2.5.9.2.0 Target Id

REPO-BE-COMMS

#### 2.5.9.3.0 Message

[Async] Publish RatingSubmittedEvent

#### 2.5.9.4.0 Sequence Number

9

#### 2.5.9.5.0 Type

🔹 Event Publication

#### 2.5.9.6.0 Is Synchronous

❌ No

#### 2.5.9.7.0 Return Message



#### 2.5.9.8.0 Has Return

❌ No

#### 2.5.9.9.0 Is Activation

❌ No

#### 2.5.9.10.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | AWS SNS |
| Method | Publish |
| Parameters | Event payload includes vendorId, riderId, and the ... |
| Authentication | IAM Role |
| Error Handling | If publishing fails, log a critical error for late... |
| Performance | Asynchronous to avoid impacting API response time. |

## 2.6.0.0.0 Notes

### 2.6.1.0.0 Content

#### 2.6.1.1.0 Content

Updating average ratings for vendors and riders should be handled asynchronously by a separate consumer of the `RatingSubmittedEvent`. Performing this calculation within the synchronous API call could introduce latency and potential deadlocks at scale.

#### 2.6.1.2.0 Position

bottom

#### 2.6.1.3.0 Participant Id

REPO-BE-COMMS

#### 2.6.1.4.0 Sequence Number

9

### 2.6.2.0.0 Content

#### 2.6.2.1.0 Content

The trigger for the UI prompt is based on the client app receiving a notification or polling for order status updates. This sequence begins after the user decides to interact with that prompt.

#### 2.6.2.2.0 Position

top

#### 2.6.2.3.0 Participant Id

REPO-FE-CUST

#### 2.6.2.4.0 Sequence Number

1

## 2.7.0.0.0 Implementation Guidance

| Property | Value |
|----------|-------|
| Security Requirements | Access to the POST /api/v1/ratings endpoint is res... |
| Performance Targets | The end-to-end P95 latency for the API call (Inter... |
| Error Handling Strategy | The API must return precise HTTP status codes: 400... |
| Testing Considerations | Unit tests must cover all validation logic in the ... |
| Monitoring Requirements | Prometheus should track: `http_requests_total` (la... |
| Deployment Considerations | This feature can be deployed independently as part... |

