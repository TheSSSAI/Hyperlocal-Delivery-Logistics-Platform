# 1 Overview

## 1.1 Diagram Id

SEQ-BP-002

## 1.2 Name

Customer Places a Prepaid Order (Saga Happy Path)

## 1.3 Description

The complete, end-to-end choreographed saga for a customer placing a successful prepaid order. This involves cart validation, inventory check, payment processing, order creation, and notifications to all parties, as per REQ-ARC-001.

## 1.4 Type

🔹 BusinessProcess

## 1.5 Purpose

To reliably and consistently process customer orders across multiple microservices, ensuring data integrity through a distributed transaction.

## 1.6 Complexity

Critical

## 1.7 Priority

🚨 Critical

## 1.8 Frequency

OnDemand

## 1.9 Participants

- REPO-FE-CUST
- REPO-BE-ORDER
- REPO-BE-CATALOG
- REPO-BE-PAYMENTS
- REPO-BE-NOTIFS
- REPO-FE-VEND

## 1.10 Key Interactions

- Customer proceeds to checkout.
- Order Service performs a final, real-time availability check with the Catalog Service (REQ-FUN-007).
- Order Service initiates a payment transaction with the Payments Service, which communicates with Razorpay to get a payment link/intent.
- Customer completes payment on the Razorpay UI.
- Razorpay sends a success webhook/callback to the Payments Service.
- Payments Service validates the callback, captures the payment, and publishes a 'PaymentConfirmed' event to SNS.
- Order Service consumes the event, creates the final order record, sets status to 'Pending Vendor Acceptance', and publishes an 'OrderPlaced' event to SNS.
- Notifications Service consumes 'OrderPlaced' and sends a real-time notification to the Vendor Dashboard.

## 1.11 Triggers

- Customer clicks 'Pay Now' for an order with an online payment method.

## 1.12 Outcomes

- A new order is created in the system with status 'Pending Vendor Acceptance'.
- Payment is successfully captured from the customer.
- The vendor is notified of a new incoming order.

## 1.13 Business Rules

- A final, real-time inventory check must be performed before payment (REQ-FUN-007).
- The Saga pattern must be used to manage data consistency across services (REQ-ARC-001).

## 1.14 Error Scenarios

- Inventory check fails because an item went out of stock; transaction is halted.
- Payment processing fails at the gateway.
- Payment confirmation callback is delayed or fails (handled by SEQ-EH-001).

## 1.15 Integration Points

- Razorpay Payment Gateway (REQ-INT-003).
- AWS SNS/SQS for event-driven communication (REQ-1-105).

# 2.0 Details

## 2.1 Diagram Id

SEQ-BP-002

## 2.2 Name

Implementation: Customer Places a Prepaid Order (Saga Happy Path)

## 2.3 Description

Provides a detailed technical specification for the choreographed saga handling a successful prepaid order. The sequence covers real-time inventory validation, payment intent creation, external payment gateway interaction via webhook, and event-driven state transitions across the Order, Payments, and Notifications services to ensure data consistency and notify the vendor.

## 2.4 Participants

### 2.4.1 Client Application

#### 2.4.1.1 Repository Id

REPO-FE-CUST

#### 2.4.1.2 Display Name

Customer App

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
| Stereotype | Client |

### 2.4.2.0 Microservice

#### 2.4.2.1 Repository Id

REPO-BE-ORDER

#### 2.4.2.2 Display Name

Order Service

#### 2.4.2.3 Type

🔹 Microservice

#### 2.4.2.4 Technology

NestJS on EKS

#### 2.4.2.5 Order

2

#### 2.4.2.6 Style

| Property | Value |
|----------|-------|
| Shape | participant |
| Color | #FF8C00 |
| Stereotype | Saga Orchestrator |

### 2.4.3.0 Microservice

#### 2.4.3.1 Repository Id

REPO-BE-CATALOG

#### 2.4.3.2 Display Name

Catalog Service

#### 2.4.3.3 Type

🔹 Microservice

#### 2.4.3.4 Technology

NestJS on EKS

#### 2.4.3.5 Order

3

#### 2.4.3.6 Style

| Property | Value |
|----------|-------|
| Shape | participant |
| Color | #32CD32 |
| Stereotype | Service |

### 2.4.4.0 Microservice

#### 2.4.4.1 Repository Id

REPO-BE-PAYMENTS

#### 2.4.4.2 Display Name

Payments Service

#### 2.4.4.3 Type

🔹 Microservice

#### 2.4.4.4 Technology

NestJS on EKS

#### 2.4.4.5 Order

4

#### 2.4.4.6 Style

| Property | Value |
|----------|-------|
| Shape | participant |
| Color | #9370DB |
| Stereotype | Service |

### 2.4.5.0 Microservice

#### 2.4.5.1 Repository Id

REPO-BE-NOTIFS

#### 2.4.5.2 Display Name

Notifications Service

#### 2.4.5.3 Type

🔹 Microservice

#### 2.4.5.4 Technology

NestJS on EKS

#### 2.4.5.5 Order

5

#### 2.4.5.6 Style

| Property | Value |
|----------|-------|
| Shape | participant |
| Color | #FFD700 |
| Stereotype | Service |

### 2.4.6.0 Client Application

#### 2.4.6.1 Repository Id

REPO-FE-VEND

#### 2.4.6.2 Display Name

Vendor Dashboard

#### 2.4.6.3 Type

🔹 Client Application

#### 2.4.6.4 Technology

React.js + Vite

#### 2.4.6.5 Order

6

#### 2.4.6.6 Style

| Property | Value |
|----------|-------|
| Shape | participant |
| Color | #4682B4 |
| Stereotype | Client |

## 2.5.0.0 Interactions

### 2.5.1.0 API_CALL

#### 2.5.1.1 Source Id

REPO-FE-CUST

#### 2.5.1.2 Target Id

REPO-BE-ORDER

#### 2.5.1.3 Message

1. POST /api/v1/orders/checkout

#### 2.5.1.4 Sequence Number

1

#### 2.5.1.5 Type

🔹 API_CALL

#### 2.5.1.6 Is Synchronous

✅ Yes

#### 2.5.1.7 Return Message

8. 200 OK with Payment Intent

#### 2.5.1.8 Has Return

✅ Yes

#### 2.5.1.9 Is Activation

✅ Yes

#### 2.5.1.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS/REST |
| Method | POST |
| Parameters | Body: { cartItems: [{ productId: string, quantity:... |
| Authentication | JWT Bearer Token validated by API Gateway Cognito ... |
| Error Handling | Returns 400 Bad Request on invalid payload. Return... |
| Performance | P95 Latency < 200ms (for the entire synchronous fl... |

### 2.5.2.0 API_CALL

#### 2.5.2.1 Source Id

REPO-BE-ORDER

#### 2.5.2.2 Target Id

REPO-BE-CATALOG

#### 2.5.2.3 Message

2. POST /api/v1/internal/products/check-availability

#### 2.5.2.4 Sequence Number

2

#### 2.5.2.5 Type

🔹 API_CALL

#### 2.5.2.6 Is Synchronous

✅ Yes

#### 2.5.2.7 Return Message

3. 200 OK { isAvailable: true }

#### 2.5.2.8 Has Return

✅ Yes

#### 2.5.2.9 Is Activation

✅ Yes

#### 2.5.2.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS/REST (via Service Mesh) |
| Method | POST |
| Parameters | Body: { items: [{ productId: string, quantity: num... |
| Authentication | mTLS via AWS App Mesh. |
| Error Handling | Returns 409 Conflict with { isAvailable: false, un... |
| Performance | Internal P95 Latency < 50ms. |

### 2.5.3.0 API_CALL

#### 2.5.3.1 Source Id

REPO-BE-ORDER

#### 2.5.3.2 Target Id

REPO-BE-PAYMENTS

#### 2.5.3.3 Message

4. POST /api/v1/internal/payments/create-intent

#### 2.5.3.4 Sequence Number

4

#### 2.5.3.5 Type

🔹 API_CALL

#### 2.5.3.6 Is Synchronous

✅ Yes

#### 2.5.3.7 Return Message

7. 200 OK { clientSecret, paymentProviderOrderId }

#### 2.5.3.8 Has Return

✅ Yes

#### 2.5.3.9 Is Activation

✅ Yes

#### 2.5.3.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS/REST (via Service Mesh) |
| Method | POST |
| Parameters | Body: { amount: number, currency: 'INR', orderRefe... |
| Authentication | mTLS via AWS App Mesh. |
| Error Handling | Returns 503 if payment gateway is unavailable (cir... |
| Performance | Internal P95 Latency < 100ms (excluding external c... |

#### 2.5.3.11 Nested Interactions

- {'sourceId': 'REPO-BE-PAYMENTS', 'targetId': 'service-razorpay', 'message': '5. (External) POST /v1/orders', 'sequenceNumber': 5, 'type': 'EXTERNAL_API_CALL', 'isSynchronous': True, 'returnMessage': '6. 200 OK { id, amount, currency, ... }', 'hasReturn': True, 'isActivation': False, 'technicalDetails': {'protocol': 'HTTPS/REST', 'method': 'POST', 'parameters': "Body: { amount: number, currency: 'INR', receipt: string }. As per Razorpay Orders API.", 'authentication': 'Basic Auth with Razorpay Key ID and Secret.', 'errorHandling': 'Circuit breaker (REQ-1-028) and retry logic implemented. On failure, bubble up 503 error.', 'performance': 'External dependency, monitored for latency > 1000ms.'}}

### 2.5.4.0 WEBHOOK_CALLBACK

#### 2.5.4.1 Source Id

service-razorpay

#### 2.5.4.2 Target Id

REPO-BE-PAYMENTS

#### 2.5.4.3 Message

9. (Webhook) POST /api/v1/webhooks/razorpay

#### 2.5.4.4 Sequence Number

9

#### 2.5.4.5 Type

🔹 WEBHOOK_CALLBACK

#### 2.5.4.6 Is Synchronous

❌ No

#### 2.5.4.7 Return Message



#### 2.5.4.8 Has Return

❌ No

#### 2.5.4.9 Is Activation

✅ Yes

#### 2.5.4.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS/REST |
| Method | POST |
| Parameters | Body: Razorpay 'payment.captured' event payload. |
| Authentication | Webhook signature validation using a shared secret... |
| Error Handling | Returns 200 OK to acknowledge receipt. If processi... |
| Performance | Webhook ingestion should be < 50ms. Heavy processi... |

#### 2.5.4.11 Nested Interactions

- {'sourceId': 'REPO-BE-PAYMENTS', 'targetId': 'REPO-BE-PAYMENTS', 'message': '10. Validate signature and capture payment', 'sequenceNumber': 10, 'type': 'INTERNAL_PROCESSING', 'isSynchronous': True, 'returnMessage': '', 'hasReturn': False, 'isActivation': False, 'technicalDetails': {'protocol': 'N/A', 'method': 'validateWebhookSignature(), updatePaymentStatusInDB()', 'parameters': 'Payload, Signature Header', 'authentication': 'N/A', 'errorHandling': 'If signature is invalid, log security warning and ignore. If DB update fails, rely on reconciliation job.', 'performance': 'Should complete within 100ms.'}}

### 2.5.5.0 EVENT_PUBLISH

#### 2.5.5.1 Source Id

REPO-BE-PAYMENTS

#### 2.5.5.2 Target Id

tech-aws-sqs-sns

#### 2.5.5.3 Message

11. Publish(Topic: payment-events)

#### 2.5.5.4 Sequence Number

11

#### 2.5.5.5 Type

🔹 EVENT_PUBLISH

#### 2.5.5.6 Is Synchronous

❌ No

#### 2.5.5.7 Return Message



#### 2.5.5.8 Has Return

❌ No

#### 2.5.5.9 Is Activation

❌ No

#### 2.5.5.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | AWS SDK for SNS |
| Method | sns.publish() |
| Parameters | Message: { eventType: 'PaymentConfirmed', payload:... |
| Authentication | IAM Role for EKS Pod. |
| Error Handling | SDK handles transient errors with retries. Persist... |
| Performance | Publish latency < 50ms. |

### 2.5.6.0 EVENT_CONSUME

#### 2.5.6.1 Source Id

tech-aws-sqs-sns

#### 2.5.6.2 Target Id

REPO-BE-ORDER

#### 2.5.6.3 Message

12. Consume(Event: PaymentConfirmed)

#### 2.5.6.4 Sequence Number

12

#### 2.5.6.5 Type

🔹 EVENT_CONSUME

#### 2.5.6.6 Is Synchronous

❌ No

#### 2.5.6.7 Return Message



#### 2.5.6.8 Has Return

❌ No

#### 2.5.6.9 Is Activation

✅ Yes

#### 2.5.6.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | AWS SDK for SQS |
| Method | SQS Polling |
| Parameters | Consumes 'PaymentConfirmed' event from its dedicat... |
| Authentication | IAM Role for EKS Pod. |
| Error Handling | Handler must be idempotent. On processing failure,... |
| Performance | Processing latency < 100ms. |

#### 2.5.6.11 Nested Interactions

- {'sourceId': 'REPO-BE-ORDER', 'targetId': 'REPO-BE-ORDER', 'message': '13. Finalize order and persist to DB', 'sequenceNumber': 13, 'type': 'DATABASE_WRITE', 'isSynchronous': True, 'returnMessage': '', 'hasReturn': False, 'isActivation': False, 'technicalDetails': {'protocol': 'PostgreSQL Wire Protocol', 'method': "INSERT INTO orders ...; UPDATE orders SET status = 'Pending Vendor Acceptance'", 'parameters': 'Order details from initial request and payment confirmation.', 'authentication': 'DB credentials from AWS Secrets Manager.', 'errorHandling': 'On failure, throws an exception causing SQS message to be retried.', 'performance': 'DB transaction < 50ms.'}}

### 2.5.7.0 EVENT_PUBLISH

#### 2.5.7.1 Source Id

REPO-BE-ORDER

#### 2.5.7.2 Target Id

tech-aws-sqs-sns

#### 2.5.7.3 Message

14. Publish(Topic: order-events)

#### 2.5.7.4 Sequence Number

14

#### 2.5.7.5 Type

🔹 EVENT_PUBLISH

#### 2.5.7.6 Is Synchronous

❌ No

#### 2.5.7.7 Return Message



#### 2.5.7.8 Has Return

❌ No

#### 2.5.7.9 Is Activation

❌ No

#### 2.5.7.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | AWS SDK for SNS |
| Method | sns.publish() |
| Parameters | Message: { eventType: 'OrderPlaced', payload: { or... |
| Authentication | IAM Role for EKS Pod. |
| Error Handling | SDK handles transient errors with retries. |
| Performance | Publish latency < 50ms. |

### 2.5.8.0 EVENT_CONSUME

#### 2.5.8.1 Source Id

tech-aws-sqs-sns

#### 2.5.8.2 Target Id

REPO-BE-NOTIFS

#### 2.5.8.3 Message

15. Consume(Event: OrderPlaced)

#### 2.5.8.4 Sequence Number

15

#### 2.5.8.5 Type

🔹 EVENT_CONSUME

#### 2.5.8.6 Is Synchronous

❌ No

#### 2.5.8.7 Return Message



#### 2.5.8.8 Has Return

❌ No

#### 2.5.8.9 Is Activation

✅ Yes

#### 2.5.8.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | AWS SDK for SQS |
| Method | SQS Polling |
| Parameters | Consumes 'OrderPlaced' event from its SQS queue. |
| Authentication | IAM Role for EKS Pod. |
| Error Handling | Idempotent handler. On failure, message is retried... |
| Performance | Processing latency < 50ms. |

### 2.5.9.0 REALTIME_PUSH

#### 2.5.9.1 Source Id

REPO-BE-NOTIFS

#### 2.5.9.2 Target Id

REPO-FE-VEND

#### 2.5.9.3 Message

16. (WebSocket) emit('new_order', { orderDetails })

#### 2.5.9.4 Sequence Number

16

#### 2.5.9.5 Type

🔹 REALTIME_PUSH

#### 2.5.9.6 Is Synchronous

❌ No

#### 2.5.9.7 Return Message



#### 2.5.9.8 Has Return

❌ No

#### 2.5.9.9 Is Activation

✅ Yes

#### 2.5.9.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | WSS (Secure WebSocket) |
| Method | emit |
| Parameters | Payload contains summarized order details necessar... |
| Authentication | WebSocket connection is authenticated with a JWT. |
| Error Handling | If emit fails, log error. Delivery is not guarante... |
| Performance | End-to-end notification latency < 2 seconds. |

## 2.6.0.0 Notes

### 2.6.1.0 Content

#### 2.6.1.1 Content

State Management: The Order Service maintains the authoritative state of the order. It transitions from a temporary 'Checkout' state to 'Pending Vendor Acceptance' only after the 'PaymentConfirmed' event is consumed.

#### 2.6.1.2 Position

top

#### 2.6.1.3 Participant Id

REPO-BE-ORDER

#### 2.6.1.4 Sequence Number

12

### 2.6.2.0 Content

#### 2.6.2.1 Content

Data Consistency: The Choreography-based Saga pattern ensures eventual consistency. If the 'OrderPlaced' event fails to be processed, the system relies on reconciliation jobs to fix the discrepancy between payment and order records.

#### 2.6.2.2 Position

bottom

#### 2.6.2.3 Participant Id

*Not specified*

#### 2.6.2.4 Sequence Number

14

### 2.6.3.0 Content

#### 2.6.3.1 Content

Business Rule: The inventory check in Step 2 is a critical business rule (REQ-FUN-007) that acts as a guard condition for the entire transaction. If it fails, the process is aborted before any payment is initiated.

#### 2.6.3.2 Position

middle

#### 2.6.3.3 Participant Id

REPO-BE-CATALOG

#### 2.6.3.4 Sequence Number

2

## 2.7.0.0 Implementation Guidance

| Property | Value |
|----------|-------|
| Security Requirements | The Razorpay webhook endpoint must be hardened aga... |
| Performance Targets | The end-to-end process from customer checkout clic... |
| Error Handling Strategy | This happy path diagram has a corresponding set of... |
| Testing Considerations | End-to-end testing must mock the Razorpay gateway ... |
| Monitoring Requirements | A Grafana dashboard must be created to monitor the... |
| Deployment Considerations | Event schema changes must be backward compatible. ... |

