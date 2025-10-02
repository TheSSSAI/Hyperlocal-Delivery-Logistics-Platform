# 1 Overview

## 1.1 Diagram Id

SEQ-EH-001

## 1.2 Name

Payment Gateway Failure and Stateful Reconciliation

## 1.3 Description

Handles the scenario where a customer's payment is successful, but the payment gateway's confirmation callback to the platform fails or is significantly delayed. The system uses a stateful reconciliation process to prevent lost orders or financial discrepancies.

## 1.4 Type

🔹 ErrorHandling

## 1.5 Purpose

To ensure financial consistency and order reliability even when the external payment gateway integration is unreliable, as mandated by REQ-FUN-007.

## 1.6 Complexity

High

## 1.7 Priority

🚨 Critical

## 1.8 Frequency

OnDemand

## 1.9 Participants

- REPO-BE-PAYMENTS
- REPO-BE-ORDER

## 1.10 Key Interactions

- Payments Service sends a payment request to Razorpay and logs the internal transaction ID.
- Razorpay processes the payment but the webhook/callback to the Payments Service fails to arrive.
- The associated order is placed in a 'payment_pending_confirmation' state.
- A scheduled background job (e.g., Kubernetes CronJob) runs periodically, querying for orders in this state.
- For each such order, the job calls the Razorpay API using the stored transaction ID to get the definitive payment status.
- If payment is confirmed, the job updates the order status and publishes a 'PaymentConfirmed' event.
- If payment failed or expired, the order is moved to a 'Cancelled' state.

## 1.11 Triggers

- A payment confirmation callback from the payment gateway is not received within the expected timeframe (e.g., 10 minutes).

## 1.12 Outcomes

- The final, correct status of the payment is determined and the order is updated, preventing a lost order.
- Financial records remain consistent.

## 1.13 Business Rules

- All interactions with the payment gateway API must be logged with the associated transaction ID (REQ-FUN-007).
- A scheduled job must exist to periodically reconcile payments in the 'payment_pending_confirmation' state (REQ-FUN-007).

## 1.14 Error Scenarios

- Network failure prevents the callback from reaching the server.
- The payment gateway experiences a significant delay in sending webhooks.
- The reconciliation job fails and needs to be retried.

## 1.15 Integration Points

- Razorpay Payment Gateway API (specifically their transaction status query endpoint).

# 2.0 Details

## 2.1 Diagram Id

SEQ-EH-001-Reconciliation

## 2.2 Name

Implementation: Payment Gateway Failure and Stateful Reconciliation

## 2.3 Description

A comprehensive technical sequence diagram detailing the stateful reconciliation process for handling failed or delayed payment gateway callbacks. This sequence ensures financial consistency and order reliability by using a scheduled background job to query the definitive payment status from the external gateway and update the order state accordingly, fulfilling the resilience requirements of REQ-FUN-007.

## 2.4 Participants

### 2.4.1 Scheduler

#### 2.4.1.1 Repository Id

Scheduler:Kubernetes

#### 2.4.1.2 Display Name

Scheduler (K8s CronJob)

#### 2.4.1.3 Type

🔹 Scheduler

#### 2.4.1.4 Technology

Kubernetes CronJob

#### 2.4.1.5 Order

1

#### 2.4.1.6 Style

| Property | Value |
|----------|-------|
| Shape | actor |
| Color | #90CAF9 |
| Stereotype | System |

### 2.4.2.0 Application Service

#### 2.4.2.1 Repository Id

REPO-BE-PAYMENTS

#### 2.4.2.2 Display Name

Payments & Settlements Service

#### 2.4.2.3 Type

🔹 Application Service

#### 2.4.2.4 Technology

NestJS, PostgreSQL

#### 2.4.2.5 Order

2

#### 2.4.2.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #F48FB1 |
| Stereotype | Microservice |

### 2.4.3.0 Application Service

#### 2.4.3.1 Repository Id

REPO-BE-ORDER

#### 2.4.3.2 Display Name

Order Management Service

#### 2.4.3.3 Type

🔹 Application Service

#### 2.4.3.4 Technology

NestJS, PostgreSQL

#### 2.4.3.5 Order

3

#### 2.4.3.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #80CBC4 |
| Stereotype | Microservice |

### 2.4.4.0 External System

#### 2.4.4.1 Repository Id

External:Razorpay

#### 2.4.4.2 Display Name

Razorpay API

#### 2.4.4.3 Type

🔹 External System

#### 2.4.4.4 Technology

REST API

#### 2.4.4.5 Order

4

#### 2.4.4.6 Style

| Property | Value |
|----------|-------|
| Shape | boundary |
| Color | #FFCC80 |
| Stereotype | Third-Party |

### 2.4.5.0 Messaging

#### 2.4.5.1 Repository Id

MessageBroker:AWSSNS

#### 2.4.5.2 Display Name

Message Broker

#### 2.4.5.3 Type

🔹 Messaging

#### 2.4.5.4 Technology

AWS SNS/SQS

#### 2.4.5.5 Order

5

#### 2.4.5.6 Style

| Property | Value |
|----------|-------|
| Shape | queue |
| Color | #CE93D8 |
| Stereotype | Infrastructure |

## 2.5.0.0 Interactions

### 2.5.1.0 Scheduled Trigger

#### 2.5.1.1 Source Id

Scheduler:Kubernetes

#### 2.5.1.2 Target Id

REPO-BE-PAYMENTS

#### 2.5.1.3 Message

1. Trigger Reconciliation Job

#### 2.5.1.4 Sequence Number

1

#### 2.5.1.5 Type

🔹 Scheduled Trigger

#### 2.5.1.6 Is Synchronous

✅ Yes

#### 2.5.1.7 Return Message

HTTP 202 Accepted

#### 2.5.1.8 Has Return

✅ Yes

#### 2.5.1.9 Is Activation

✅ Yes

#### 2.5.1.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTP |
| Method | POST /internal/api/v1/jobs/reconcile-pending-payme... |
| Parameters | Payload: { "jobId": "uuid", "triggeredAt": "timest... |
| Authentication | Kubernetes Service Account Token (JWT) validated b... |
| Error Handling | K8s CronJob controller will retry on failure based... |
| Performance | Trigger frequency: Every 5 minutes. |

### 2.5.2.0 Internal API Call

#### 2.5.2.1 Source Id

REPO-BE-PAYMENTS

#### 2.5.2.2 Target Id

REPO-BE-ORDER

#### 2.5.2.3 Message

2. Fetch Orders in 'payment_pending_confirmation' state

#### 2.5.2.4 Sequence Number

2

#### 2.5.2.5 Type

🔹 Internal API Call

#### 2.5.2.6 Is Synchronous

✅ Yes

#### 2.5.2.7 Return Message

200 OK with Order[]

#### 2.5.2.8 Has Return

✅ Yes

#### 2.5.2.9 Is Activation

✅ Yes

#### 2.5.2.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTP |
| Method | GET /internal/api/v1/orders?status=payment_pending... |
| Parameters | Query parameters for status, pagination, and stale... |
| Authentication | Internal mTLS via Service Mesh (AWS App Mesh) |
| Error Handling | Retry with exponential backoff via Service Mesh on... |
| Performance | P95 latency < 100ms. Requires database index on 's... |

### 2.5.3.0 Loop

#### 2.5.3.1 Source Id

REPO-BE-PAYMENTS

#### 2.5.3.2 Target Id

REPO-BE-PAYMENTS

#### 2.5.3.3 Message

3. FOR EACH order in pending state:

#### 2.5.3.4 Sequence Number

3

#### 2.5.3.5 Type

🔹 Loop

#### 2.5.3.6 Is Synchronous

❌ No

#### 2.5.3.7 Return Message



#### 2.5.3.8 Has Return

❌ No

#### 2.5.3.9 Is Activation

❌ No

#### 2.5.3.10 Nested Interactions

##### 2.5.3.10.1 External API Call

###### 2.5.3.10.1.1 Source Id

REPO-BE-PAYMENTS

###### 2.5.3.10.1.2 Target Id

External:Razorpay

###### 2.5.3.10.1.3 Message

3.1. Query Definitive Payment Status

###### 2.5.3.10.1.4 Sequence Number

4

###### 2.5.3.10.1.5 Type

🔹 External API Call

###### 2.5.3.10.1.6 Is Synchronous

✅ Yes

###### 2.5.3.10.1.7 Return Message

200 OK with Payment Entity

###### 2.5.3.10.1.8 Has Return

✅ Yes

###### 2.5.3.10.1.9 Is Activation

✅ Yes

###### 2.5.3.10.1.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS |
| Method | GET /v1/payments/{razorpay_payment_id} |
| Parameters | Path parameter: `razorpay_payment_id` retrieved fr... |
| Authentication | Basic Authentication with API Key/Secret stored in... |
| Error Handling | Implements Circuit Breaker pattern. Retries on 5xx... |
| Performance | SLA: P95 latency < 1000ms. |

##### 2.5.3.10.2.0 Event Publication

###### 2.5.3.10.2.1 Source Id

REPO-BE-PAYMENTS

###### 2.5.3.10.2.2 Target Id

MessageBroker:AWSSNS

###### 2.5.3.10.2.3 Message

3.2. [IF status is 'captured'] Publish PaymentConfirmedEvent

###### 2.5.3.10.2.4 Sequence Number

5

###### 2.5.3.10.2.5 Type

🔹 Event Publication

###### 2.5.3.10.2.6 Is Synchronous

❌ No

###### 2.5.3.10.2.7 Return Message



###### 2.5.3.10.2.8 Has Return

❌ No

###### 2.5.3.10.2.9 Is Activation

✅ Yes

###### 2.5.3.10.2.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | AWS SDK (SNS) |
| Method | Publish |
| Parameters | Topic: `payment-events`. Payload: { eventType: 'Pa... |
| Authentication | IAM Role for EKS Pod |
| Error Handling | SDK handles retries. Failure to publish is a criti... |
| Performance | P95 latency < 50ms. |

##### 2.5.3.10.3.0 Event Publication

###### 2.5.3.10.3.1 Source Id

REPO-BE-PAYMENTS

###### 2.5.3.10.3.2 Target Id

MessageBroker:AWSSNS

###### 2.5.3.10.3.3 Message

3.3. [ELSE IF status is 'failed'] Publish PaymentFailedEvent

###### 2.5.3.10.3.4 Sequence Number

6

###### 2.5.3.10.3.5 Type

🔹 Event Publication

###### 2.5.3.10.3.6 Is Synchronous

❌ No

###### 2.5.3.10.3.7 Return Message



###### 2.5.3.10.3.8 Has Return

❌ No

###### 2.5.3.10.3.9 Is Activation

❌ No

###### 2.5.3.10.3.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | AWS SDK (SNS) |
| Method | Publish |
| Parameters | Topic: `payment-events`. Payload: { eventType: 'Pa... |
| Authentication | IAM Role for EKS Pod |
| Error Handling | SDK handles retries. Failure to publish is a criti... |
| Performance | P95 latency < 50ms. |

### 2.5.4.0.0.0 Event Consumption

#### 2.5.4.1.0.0 Source Id

MessageBroker:AWSSNS

#### 2.5.4.2.0.0 Target Id

REPO-BE-ORDER

#### 2.5.4.3.0.0 Message

4. Consume Payment Event

#### 2.5.4.4.0.0 Sequence Number

7

#### 2.5.4.5.0.0 Type

🔹 Event Consumption

#### 2.5.4.6.0.0 Is Synchronous

❌ No

#### 2.5.4.7.0.0 Return Message



#### 2.5.4.8.0.0 Has Return

❌ No

#### 2.5.4.9.0.0 Is Activation

✅ Yes

#### 2.5.4.10.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | AWS SDK (SQS) |
| Method | ReceiveMessage |
| Parameters | Listens on a dedicated SQS queue subscribed to the... |
| Authentication | IAM Role for EKS Pod |
| Error Handling | Consumer logic must be idempotent. On transient pr... |
| Performance | HPA scales consumers based on SQS queue depth. |

### 2.5.5.0.0.0 Database Transaction

#### 2.5.5.1.0.0 Source Id

REPO-BE-ORDER

#### 2.5.5.2.0.0 Target Id

REPO-BE-ORDER

#### 2.5.5.3.0.0 Message

5. Update Order Status in Database

#### 2.5.5.4.0.0 Sequence Number

8

#### 2.5.5.5.0.0 Type

🔹 Database Transaction

#### 2.5.5.6.0.0 Is Synchronous

✅ Yes

#### 2.5.5.7.0.0 Return Message

Commit

#### 2.5.5.8.0.0 Has Return

✅ Yes

#### 2.5.5.9.0.0 Is Activation

❌ No

#### 2.5.5.10.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | PostgreSQL Driver |
| Method | UPDATE orders SET status = ?, updatedAt = NOW() WH... |
| Parameters | On 'PaymentConfirmed', new status is 'pending_vend... |
| Authentication | IAM Database Authentication |
| Error Handling | On failure, the SQS message is not deleted and wil... |
| Performance | Database transaction must complete in < 50ms. |

## 2.6.0.0.0.0 Notes

### 2.6.1.0.0.0 Content

#### 2.6.1.1.0.0 Content

Initial State Trigger: An order enters the 'payment_pending_confirmation' state when the Payments Service initiates a transaction with Razorpay but does not receive the confirmation webhook within a predefined timeout (e.g., 2 minutes). This is the state that the reconciliation job is designed to resolve.

#### 2.6.1.2.0.0 Position

top-left

#### 2.6.1.3.0.0 Participant Id

*Not specified*

#### 2.6.1.4.0.0 Sequence Number

0

### 2.6.2.0.0.0 Content

#### 2.6.2.1.0.0 Content

Idempotency is CRITICAL for the reconciliation job. If the job is re-run on already processed orders, it must not produce duplicate events. This is handled by fetching only orders in the 'payment_pending_confirmation' state.

#### 2.6.2.2.0.0 Position

bottom-left

#### 2.6.2.3.0.0 Participant Id

REPO-BE-PAYMENTS

#### 2.6.2.4.0.0 Sequence Number

1

### 2.6.3.0.0.0 Content

#### 2.6.3.1.0.0 Content

The SQS event consumer in the Order Management Service must also be idempotent. It should check the current order status before applying an update to handle potential duplicate message delivery from SQS.

#### 2.6.3.2.0.0 Position

bottom-right

#### 2.6.3.3.0.0 Participant Id

REPO-BE-ORDER

#### 2.6.3.4.0.0 Sequence Number

7

## 2.7.0.0.0.0 Implementation Guidance

| Property | Value |
|----------|-------|
| Security Requirements | API Keys for Razorpay must be stored securely in A... |
| Performance Targets | Recovery Time Objective (RTO) for a lost order is ... |
| Error Handling Strategy | A comprehensive monitoring dashboard in Grafana is... |
| Testing Considerations | End-to-end testing must mock the Razorpay API to s... |
| Monitoring Requirements | Key Prometheus metrics to be implemented: `reconci... |
| Deployment Considerations | The reconciliation logic is deployed as part of th... |

