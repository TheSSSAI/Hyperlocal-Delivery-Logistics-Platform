# 1 Overview

## 1.1 Diagram Id

SEQ-EH-002

## 1.2 Name

Rider Allocation Failure and Escalation

## 1.3 Description

Describes the error handling process when the system fails to assign a rider to an order after multiple attempts. The order is moved to a failed state, all parties are notified, and an alert is created for administrative intervention.

## 1.4 Type

🔹 ErrorHandling

## 1.5 Purpose

To gracefully handle scenarios with insufficient rider availability and ensure operational visibility into fulfillment failures.

## 1.6 Complexity

Medium

## 1.7 Priority

🔴 High

## 1.8 Frequency

OnDemand

## 1.9 Participants

- REPO-BE-LOGISTICS
- REPO-BE-ORDER
- REPO-BE-NOTIFS
- REPO-FE-ADMIN

## 1.10 Key Interactions

- Logistics Service fails to assign a rider after 3 attempts over 5 minutes.
- Logistics Service publishes an AllocationFailed event.
- Order Service consumes the event and updates the order status to 'Allocation Failed'.
- Notifications Service notifies the Customer and Vendor of the failure.
- A high-priority alert is created on the Admin Dashboard for manual intervention.

## 1.11 Triggers

- Rider allocation algorithm exhausts all retries without success (REQ-FUN-018).

## 1.12 Outcomes

- The order is marked as 'Allocation Failed'.
- Customer and Vendor are informed about the issue.
- An administrator is alerted to take manual action (e.g., cancel and refund).

## 1.13 Business Rules

- Failure is triggered after 3 attempts over a 5-minute period (REQ-FUN-018).

## 1.14 Error Scenarios

- Admin intervention is delayed, leading to poor customer experience.

## 1.15 Integration Points

- Admin Dashboard alerting system.

# 2.0 Details

## 2.1 Diagram Id

SEQ-EH-002

## 2.2 Name

Rider Allocation Failure and Escalation

## 2.3 Description

Implementation-ready sequence diagram detailing the error handling process when the system fails to assign a rider to an order. This sequence covers the detection of the failure condition, state transition of the order, asynchronous notification to all affected parties, and the creation of a high-priority alert for administrative intervention, in accordance with REQ-FUN-018.

## 2.4 Participants

### 2.4.1 Microservice

#### 2.4.1.1 Repository Id

REPO-BE-LOGISTICS

#### 2.4.1.2 Display Name

Rider Logistics Service

#### 2.4.1.3 Type

🔹 Microservice

#### 2.4.1.4 Technology

NestJS, PostgreSQL

#### 2.4.1.5 Order

1

#### 2.4.1.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #D35400 |
| Stereotype | «Service» |

### 2.4.2.0 Microservice

#### 2.4.2.1 Repository Id

REPO-BE-ORDER

#### 2.4.2.2 Display Name

Order Management Service

#### 2.4.2.3 Type

🔹 Microservice

#### 2.4.2.4 Technology

NestJS, PostgreSQL

#### 2.4.2.5 Order

2

#### 2.4.2.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #2980B9 |
| Stereotype | «Service» |

### 2.4.3.0 Microservice

#### 2.4.3.1 Repository Id

REPO-BE-NOTIFS

#### 2.4.3.2 Display Name

Notifications Service

#### 2.4.3.3 Type

🔹 Microservice

#### 2.4.3.4 Technology

NestJS

#### 2.4.3.5 Order

3

#### 2.4.3.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #8E44AD |
| Stereotype | «Service» |

### 2.4.4.0 Frontend Application

#### 2.4.4.1 Repository Id

REPO-FE-ADMIN

#### 2.4.4.2 Display Name

Admin Web Dashboard

#### 2.4.4.3 Type

🔹 Frontend Application

#### 2.4.4.4 Technology

React.js

#### 2.4.4.5 Order

4

#### 2.4.4.6 Style

| Property | Value |
|----------|-------|
| Shape | actor |
| Color | #34495E |
| Stereotype | «Client» |

## 2.5.0.0 Interactions

### 2.5.1.0 Internal State Transition

#### 2.5.1.1 Source Id

REPO-BE-LOGISTICS

#### 2.5.1.2 Target Id

REPO-BE-LOGISTICS

#### 2.5.1.3 Message

1. Detect Allocation Failure (Internal Process)

#### 2.5.1.4 Sequence Number

1

#### 2.5.1.5 Type

🔹 Internal State Transition

#### 2.5.1.6 Is Synchronous

✅ Yes

#### 2.5.1.7 Return Message



#### 2.5.1.8 Has Return

❌ No

#### 2.5.1.9 Is Activation

✅ Yes

#### 2.5.1.10 Technical Details

##### 2.5.1.10.1 Protocol

Internal Logic

##### 2.5.1.10.2 Method

AllocationAlgorithm.execute()

##### 2.5.1.10.3 Parameters

###### 2.5.1.10.3.1 orderId

####### 2.5.1.10.3.1.1 Name

orderId

####### 2.5.1.10.3.1.2 Type

🔹 UUID

###### 2.5.1.10.3.2.0 maxRetries

####### 2.5.1.10.3.2.1 Name

maxRetries

####### 2.5.1.10.3.2.2 Value

3

###### 2.5.1.10.3.3.0 timeout

####### 2.5.1.10.3.3.1 Name

timeout

####### 2.5.1.10.3.3.2 Value

5 minutes

##### 2.5.1.10.4.0.0 Authentication

N/A (Internal Process)

##### 2.5.1.10.5.0.0 Error Handling

The failure of this process is the trigger for this entire sequence. Logs must detail which riders were attempted and why they were rejected or timed out.

##### 2.5.1.10.6.0.0 Performance

###### 2.5.1.10.6.1.0 Latency

Monitored over 5 minutes as per REQ-FUN-018.

### 2.5.2.0.0.0.0 Asynchronous Event

#### 2.5.2.1.0.0.0 Source Id

REPO-BE-LOGISTICS

#### 2.5.2.2.0.0.0 Target Id

REPO-BE-ORDER

#### 2.5.2.3.0.0.0 Message

2. Publish `RiderAllocationFailed` Event

#### 2.5.2.4.0.0.0 Sequence Number

2

#### 2.5.2.5.0.0.0 Type

🔹 Asynchronous Event

#### 2.5.2.6.0.0.0 Is Synchronous

❌ No

#### 2.5.2.7.0.0.0 Return Message



#### 2.5.2.8.0.0.0 Has Return

❌ No

#### 2.5.2.9.0.0.0 Is Activation

❌ No

#### 2.5.2.10.0.0.0 Technical Details

##### 2.5.2.10.1.0.0 Protocol

AWS SNS

##### 2.5.2.10.2.0.0 Method

sns.publish()

##### 2.5.2.10.3.0.0 Parameters

###### 2.5.2.10.3.1.0 TopicArn

####### 2.5.2.10.3.1.1 Name

TopicArn

####### 2.5.2.10.3.1.2 Value

arn:aws:sns:ap-south-1:123456789012:logistics-events

###### 2.5.2.10.3.2.0 Message

####### 2.5.2.10.3.2.1 Name

Message

####### 2.5.2.10.3.2.2 Schema

######## 2.5.2.10.3.2.2.1 Event Id

UUID

######## 2.5.2.10.3.2.2.2 Correlation Id

UUID

######## 2.5.2.10.3.2.2.3 Timestamp

ISO8601

######## 2.5.2.10.3.2.2.4 Event Type

logistics.rider_allocation_failed

######## 2.5.2.10.3.2.2.5 Payload

| Property | Value |
|----------|-------|
| Order Id | UUID |
| Reason | string (e.g., 'No available riders found after 3 a... |
| Attempt Count | integer |
| Customer Id | UUID |
| Vendor Id | UUID |

##### 2.5.2.10.4.0.0.0 Authentication

AWS IAM Role

##### 2.5.2.10.5.0.0.0 Error Handling

Implement retry with exponential backoff on SNS publish failures. If publishing ultimately fails, create a critical alert for manual intervention.

##### 2.5.2.10.6.0.0.0 Performance

###### 2.5.2.10.6.1.0.0 Latency

< 100ms

### 2.5.3.0.0.0.0.0 Database Transaction

#### 2.5.3.1.0.0.0.0 Source Id

REPO-BE-ORDER

#### 2.5.3.2.0.0.0.0 Target Id

REPO-BE-ORDER

#### 2.5.3.3.0.0.0.0 Message

3. Consume Event & Update Order Status

#### 2.5.3.4.0.0.0.0 Sequence Number

3

#### 2.5.3.5.0.0.0.0 Type

🔹 Database Transaction

#### 2.5.3.6.0.0.0.0 Is Synchronous

✅ Yes

#### 2.5.3.7.0.0.0.0 Return Message



#### 2.5.3.8.0.0.0.0 Has Return

❌ No

#### 2.5.3.9.0.0.0.0 Is Activation

✅ Yes

#### 2.5.3.10.0.0.0.0 Technical Details

##### 2.5.3.10.1.0.0.0 Protocol

AWS SQS

##### 2.5.3.10.2.0.0.0 Method

OrderSaga.handleRiderAllocationFailed(event)

##### 2.5.3.10.3.0.0.0 Parameters

- {'name': 'event', 'description': 'SQS message containing the RiderAllocationFailed payload from step 2.'}

##### 2.5.3.10.4.0.0.0 Authentication

N/A (Internal Consumer)

##### 2.5.3.10.5.0.0.0 Error Handling

Consumer must be idempotent. On failure to update DB, message should be returned to queue for retry based on SQS redrive policy. After max retries, message moves to DLQ and fires a critical alert.

##### 2.5.3.10.6.0.0.0 Performance

###### 2.5.3.10.6.1.0.0 Latency

< 50ms for DB update.

#### 2.5.3.11.0.0.0.0 Nested Interactions

##### 2.5.3.11.1.0.0.0 Database Call

###### 2.5.3.11.1.1.0.0 Source Id

REPO-BE-ORDER

###### 2.5.3.11.1.2.0.0 Target Id

REPO-BE-ORDER

###### 2.5.3.11.1.3.0.0 Message

3a. [SQL] UPDATE `orders` SET `status` = 'Allocation Failed' WHERE `id` = :orderId

###### 2.5.3.11.1.4.0.0 Sequence Number

3a

###### 2.5.3.11.1.5.0.0 Type

🔹 Database Call

###### 2.5.3.11.1.6.0.0 Is Synchronous

✅ Yes

###### 2.5.3.11.1.7.0.0 Return Message

Success/Failure

###### 2.5.3.11.1.8.0.0 Has Return

✅ Yes

###### 2.5.3.11.1.9.0.0 Technical Details

####### 2.5.3.11.1.9.1.0 Protocol

PostgreSQL Driver

####### 2.5.3.11.1.9.2.0 Error Handling

On DB connection error, throw exception to trigger SQS retry. On constraint violation, log error and move to DLQ.

##### 2.5.3.11.2.0.0.0 Database Call

###### 2.5.3.11.2.1.0.0 Source Id

REPO-BE-ORDER

###### 2.5.3.11.2.2.0.0 Target Id

REPO-BE-ORDER

###### 2.5.3.11.2.3.0.0 Message

3b. [SQL] INSERT INTO `admin_alerts` (type, priority, entityId, message)

###### 2.5.3.11.2.4.0.0 Sequence Number

3b

###### 2.5.3.11.2.5.0.0 Type

🔹 Database Call

###### 2.5.3.11.2.6.0.0 Is Synchronous

✅ Yes

###### 2.5.3.11.2.7.0.0 Return Message

Success/Failure

###### 2.5.3.11.2.8.0.0 Has Return

✅ Yes

###### 2.5.3.11.2.9.0.0 Technical Details

####### 2.5.3.11.2.9.1.0 Protocol

PostgreSQL Driver

####### 2.5.3.11.2.9.2.0 Error Handling

This is a critical step for operational visibility. Failure should be logged with high severity.

### 2.5.4.0.0.0.0.0 Asynchronous Event Handling

#### 2.5.4.1.0.0.0.0 Source Id

REPO-BE-NOTIFS

#### 2.5.4.2.0.0.0.0 Target Id

REPO-BE-NOTIFS

#### 2.5.4.3.0.0.0.0 Message

4. Consume Event & Dispatch Notifications

#### 2.5.4.4.0.0.0.0 Sequence Number

4

#### 2.5.4.5.0.0.0.0 Type

🔹 Asynchronous Event Handling

#### 2.5.4.6.0.0.0.0 Is Synchronous

✅ Yes

#### 2.5.4.7.0.0.0.0 Return Message



#### 2.5.4.8.0.0.0.0 Has Return

❌ No

#### 2.5.4.9.0.0.0.0 Is Activation

✅ Yes

#### 2.5.4.10.0.0.0.0 Technical Details

##### 2.5.4.10.1.0.0.0 Protocol

AWS SQS

##### 2.5.4.10.2.0.0.0 Method

NotificationHandler.onRiderAllocationFailed(event)

##### 2.5.4.10.3.0.0.0 Parameters

- {'name': 'event', 'description': 'SQS message from a queue subscribed to the same SNS topic as the Order Service.'}

##### 2.5.4.10.4.0.0.0 Authentication

N/A (Internal Consumer)

##### 2.5.4.10.5.0.0.0 Error Handling

Idempotent consumer. Handles failures in downstream notification providers (FCM, etc.) gracefully with retries. Final failures are logged but do not halt the flow.

##### 2.5.4.10.6.0.0.0 Performance

###### 2.5.4.10.6.1.0.0 Latency

Dependent on external providers.

#### 2.5.4.11.0.0.0.0 Nested Interactions

- {'sourceId': 'REPO-BE-NOTIFS', 'targetId': 'REPO-BE-NOTIFS', 'message': '4a. Send Push Notification to Customer & Vendor', 'sequenceNumber': '4a', 'type': 'External API Call', 'isSynchronous': False, 'returnMessage': '', 'hasReturn': False, 'technicalDetails': {'protocol': 'HTTP/S', 'method': 'FcmService.send()', 'parameters': [{'name': 'payload', 'value': "{ title: 'Delivery Issue', body: 'We are unable to find a delivery partner for your order at the moment. Our team is looking into it.' }"}], 'errorHandling': 'Circuit breaker and retry logic for FCM API calls.'}}

### 2.5.5.0.0.0.0.0 WebSocket Push

#### 2.5.5.1.0.0.0.0 Source Id

REPO-BE-ORDER

#### 2.5.5.2.0.0.0.0 Target Id

REPO-FE-ADMIN

#### 2.5.5.3.0.0.0.0 Message

5. Push Real-time Alert to Admin Dashboard

#### 2.5.5.4.0.0.0.0 Sequence Number

5

#### 2.5.5.5.0.0.0.0 Type

🔹 WebSocket Push

#### 2.5.5.6.0.0.0.0 Is Synchronous

❌ No

#### 2.5.5.7.0.0.0.0 Return Message



#### 2.5.5.8.0.0.0.0 Has Return

❌ No

#### 2.5.5.9.0.0.0.0 Is Activation

❌ No

#### 2.5.5.10.0.0.0.0 Technical Details

##### 2.5.5.10.1.0.0.0 Protocol

WSS (Secure WebSocket)

##### 2.5.5.10.2.0.0.0 Method

socket.emit('new_alert')

##### 2.5.5.10.3.0.0.0 Parameters

- {'name': 'payload', 'schema': {'alertId': 'UUID', 'type': 'RIDER_ALLOCATION_FAILURE', 'priority': 'HIGH', 'orderId': 'UUID', 'message': "string (e.g., 'Order #12345 failed rider allocation.')", 'timestamp': 'ISO8601'}}

##### 2.5.5.10.4.0.0.0 Authentication

Admin user's JWT is used to authenticate the WebSocket session.

##### 2.5.5.10.5.0.0.0 Error Handling

The backend handles connection state. If the client is disconnected, the alert will still be persisted in the DB (step 3b) and will be visible on the next page load.

##### 2.5.5.10.6.0.0.0 Performance

###### 2.5.5.10.6.1.0.0 Latency

< 1 second for real-time update.

## 2.6.0.0.0.0.0.0 Notes

### 2.6.1.0.0.0.0.0 Content

#### 2.6.1.1.0.0.0.0 Content

The entire process from failure detection (step 1) to admin alert creation (step 3b) must be atomic within the respective services to maintain a consistent state.

#### 2.6.1.2.0.0.0.0 Position

top

#### 2.6.1.3.0.0.0.0 Participant Id

*Not specified*

#### 2.6.1.4.0.0.0.0 Sequence Number

*Not specified*

### 2.6.2.0.0.0.0.0 Content

#### 2.6.2.1.0.0.0.0 Content

The failure reason in the event payload is crucial for root cause analysis and potential automation improvements in the future.

#### 2.6.2.2.0.0.0.0 Position

bottom

#### 2.6.2.3.0.0.0.0 Participant Id

REPO-BE-LOGISTICS

#### 2.6.2.4.0.0.0.0 Sequence Number

2

### 2.6.3.0.0.0.0.0 Content

#### 2.6.3.1.0.0.0.0 Content

The admin dashboard should provide a direct link from the alert to the order details page for immediate action (e.g., contact customer, cancel/refund order).

#### 2.6.3.2.0.0.0.0 Position

bottom

#### 2.6.3.3.0.0.0.0 Participant Id

REPO-FE-ADMIN

#### 2.6.3.4.0.0.0.0 Sequence Number

5

## 2.7.0.0.0.0.0.0 Implementation Guidance

| Property | Value |
|----------|-------|
| Security Requirements | Communication between services is secured via mTLS... |
| Performance Targets | The Recovery Time Objective (RTO) for an administr... |
| Error Handling Strategy | The primary error handling is the sequence itself.... |
| Testing Considerations | In a staging environment, create a test scenario w... |
| Monitoring Requirements | A key business metric `rider_allocation_failure_ra... |
| Deployment Considerations | The SNS topic and SQS queues, along with their sub... |

