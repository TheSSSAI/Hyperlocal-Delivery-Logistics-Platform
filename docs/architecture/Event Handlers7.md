# 1 System Overview

## 1.1 Analysis Date

2025-06-13

## 1.2 Architecture Type

Event-Driven Microservices with Saga Pattern

## 1.3 Technology Stack

- AWS SNS
- AWS SQS
- Node.js (NestJS)
- Amazon EKS

## 1.4 Bounded Contexts

- Identity & Access
- Order Management
- Vendor & Catalog
- Rider Logistics
- Payments & Settlements
- Notifications

# 2.0 Project Specific Events

## 2.1 Event Id

### 2.1.1 Event Id

EVT-ORD-001

### 2.1.2 Event Name

OrderPlaced

### 2.1.3 Event Type

domain

### 2.1.4 Category

🔹 Order Management

### 2.1.5 Description

Triggered when a customer successfully confirms their order after payment validation. Initiates the order fulfillment saga.

### 2.1.6 Trigger Condition

Successful payment confirmation for items in a cart (REQ-1-056).

### 2.1.7 Source Context

Order Management Service

### 2.1.8 Target Contexts

- Vendor & Catalog Service
- Notifications Service

### 2.1.9 Payload

#### 2.1.9.1 Schema

##### 2.1.9.1.1 Order Id

string

##### 2.1.9.1.2 Customer Id

string

##### 2.1.9.1.3 Vendor Id

string

##### 2.1.9.1.4 Items

- object

##### 2.1.9.1.5 Total Amount

number

##### 2.1.9.1.6 Payment Method

string

#### 2.1.9.2.0 Required Fields

- orderId
- customerId
- vendorId
- items
- totalAmount

#### 2.1.9.3.0 Optional Fields

- paymentMethod

### 2.1.10.0.0 Frequency

high

### 2.1.11.0.0 Business Criticality

critical

### 2.1.12.0.0 Data Source

| Property | Value |
|----------|-------|
| Database | PostgreSQL |
| Table | Order |
| Operation | create |

### 2.1.13.0.0 Routing

| Property | Value |
|----------|-------|
| Routing Key | order.placed |
| Exchange | order-events (SNS Topic) |
| Queue | order-placed-for-vendor (SQS), order-placed-for-no... |

### 2.1.14.0.0 Consumers

#### 2.1.14.1.0 Service

##### 2.1.14.1.1 Service

Vendor & Catalog Service

##### 2.1.14.1.2 Handler

handleOrderPlaced

##### 2.1.14.1.3 Processing Type

async

#### 2.1.14.2.0 Service

##### 2.1.14.2.1 Service

Notifications Service

##### 2.1.14.2.2 Handler

notifyVendorOfNewOrder

##### 2.1.14.2.3 Processing Type

async

### 2.1.15.0.0 Dependencies

*No items available*

### 2.1.16.0.0 Error Handling

| Property | Value |
|----------|-------|
| Retry Strategy | Exponential Backoff |
| Dead Letter Queue | order-placed-dlq |
| Timeout Ms | 30000 |

## 2.2.0.0.0 Event Id

### 2.2.1.0.0 Event Id

EVT-ORD-002

### 2.2.2.0.0 Event Name

OrderAcceptedByVendor

### 2.2.3.0.0 Event Type

domain

### 2.2.4.0.0 Category

🔹 Order Management

### 2.2.5.0.0 Description

Triggered when a vendor accepts a new order. Continues the order fulfillment saga.

### 2.2.6.0.0 Trigger Condition

Vendor clicks 'Accept' on a new order (REQ-1-065).

### 2.2.7.0.0 Source Context

Vendor & Catalog Service

### 2.2.8.0.0 Target Contexts

- Order Management Service
- Notifications Service

### 2.2.9.0.0 Payload

#### 2.2.9.1.0 Schema

| Property | Value |
|----------|-------|
| Order Id | string |
| Vendor Id | string |
| Estimated Preparation Time | string |

#### 2.2.9.2.0 Required Fields

- orderId
- vendorId
- estimatedPreparationTime

#### 2.2.9.3.0 Optional Fields

*No items available*

### 2.2.10.0.0 Frequency

high

### 2.2.11.0.0 Business Criticality

critical

### 2.2.12.0.0 Data Source

| Property | Value |
|----------|-------|
| Database | PostgreSQL |
| Table | Order |
| Operation | update |

### 2.2.13.0.0 Routing

| Property | Value |
|----------|-------|
| Routing Key | order.accepted |
| Exchange | order-events (SNS Topic) |
| Queue | order-accepted-for-oms (SQS), order-accepted-for-n... |

### 2.2.14.0.0 Consumers

#### 2.2.14.1.0 Service

##### 2.2.14.1.1 Service

Order Management Service

##### 2.2.14.1.2 Handler

updateOrderStatusToAccepted

##### 2.2.14.1.3 Processing Type

async

#### 2.2.14.2.0 Service

##### 2.2.14.2.1 Service

Notifications Service

##### 2.2.14.2.2 Handler

notifyCustomerOrderAccepted

##### 2.2.14.2.3 Processing Type

async

### 2.2.15.0.0 Dependencies

- EVT-ORD-001

### 2.2.16.0.0 Error Handling

| Property | Value |
|----------|-------|
| Retry Strategy | Exponential Backoff |
| Dead Letter Queue | order-accepted-dlq |
| Timeout Ms | 30000 |

## 2.3.0.0.0 Event Id

### 2.3.1.0.0 Event Id

EVT-ORD-003

### 2.3.2.0.0 Event Name

OrderReadyForPickup

### 2.3.3.0.0 Event Type

integration

### 2.3.4.0.0 Category

🔹 Order Logistics

### 2.3.5.0.0 Description

Triggered when a vendor marks an order as ready. This is a critical integration event that initiates the rider allocation process.

### 2.3.6.0.0 Trigger Condition

Vendor updates order status to 'Ready for Pickup' (REQ-1-078).

### 2.3.7.0.0 Source Context

Vendor & Catalog Service

### 2.3.8.0.0 Target Contexts

- Rider Logistics Service
- Order Management Service

### 2.3.9.0.0 Payload

#### 2.3.9.1.0 Schema

##### 2.3.9.1.1 Order Id

string

##### 2.3.9.1.2 Vendor Id

string

##### 2.3.9.1.3 Pickup Location

###### 2.3.9.1.3.1 Latitude

number

###### 2.3.9.1.3.2 Longitude

number

##### 2.3.9.1.4.0 Delivery Location

###### 2.3.9.1.4.1 Latitude

number

###### 2.3.9.1.4.2 Longitude

number

#### 2.3.9.2.0.0 Required Fields

- orderId
- vendorId
- pickupLocation
- deliveryLocation

#### 2.3.9.3.0.0 Optional Fields

*No items available*

### 2.3.10.0.0.0 Frequency

high

### 2.3.11.0.0.0 Business Criticality

critical

### 2.3.12.0.0.0 Data Source

| Property | Value |
|----------|-------|
| Database | PostgreSQL |
| Table | Order |
| Operation | update |

### 2.3.13.0.0.0 Routing

| Property | Value |
|----------|-------|
| Routing Key | order.ready_for_pickup |
| Exchange | order-events (SNS Topic) |
| Queue | order-ready-for-logistics (SQS), order-ready-for-o... |

### 2.3.14.0.0.0 Consumers

#### 2.3.14.1.0.0 Service

##### 2.3.14.1.1.0 Service

Rider Logistics Service

##### 2.3.14.1.2.0 Handler

initiateRiderAllocation

##### 2.3.14.1.3.0 Processing Type

async

#### 2.3.14.2.0.0 Service

##### 2.3.14.2.1.0 Service

Order Management Service

##### 2.3.14.2.2.0 Handler

updateOrderStatusToReady

##### 2.3.14.2.3.0 Processing Type

async

### 2.3.15.0.0.0 Dependencies

- EVT-ORD-002

### 2.3.16.0.0.0 Error Handling

| Property | Value |
|----------|-------|
| Retry Strategy | Exponential Backoff |
| Dead Letter Queue | order-ready-dlq |
| Timeout Ms | 60000 |

## 2.4.0.0.0.0 Event Id

### 2.4.1.0.0.0 Event Id

EVT-LOG-001

### 2.4.2.0.0.0 Event Name

RiderAssigned

### 2.4.3.0.0.0 Event Type

integration

### 2.4.4.0.0.0 Category

🔹 Order Logistics

### 2.4.5.0.0.0 Description

Triggered by the logistics service when a rider accepts a delivery task. Notifies other services of the assignment.

### 2.4.6.0.0.0 Trigger Condition

A rider accepts a delivery task within the time limit (REQ-1-071).

### 2.4.7.0.0.0 Source Context

Rider Logistics Service

### 2.4.8.0.0.0 Target Contexts

- Order Management Service
- Notifications Service

### 2.4.9.0.0.0 Payload

#### 2.4.9.1.0.0 Schema

| Property | Value |
|----------|-------|
| Order Id | string |
| Rider Id | string |
| Estimated Delivery Time | datetime |

#### 2.4.9.2.0.0 Required Fields

- orderId
- riderId

#### 2.4.9.3.0.0 Optional Fields

- estimatedDeliveryTime

### 2.4.10.0.0.0 Frequency

high

### 2.4.11.0.0.0 Business Criticality

critical

### 2.4.12.0.0.0 Data Source

| Property | Value |
|----------|-------|
| Database | PostgreSQL |
| Table | DeliveryTask |
| Operation | update |

### 2.4.13.0.0.0 Routing

| Property | Value |
|----------|-------|
| Routing Key | logistics.rider_assigned |
| Exchange | logistics-events (SNS Topic) |
| Queue | rider-assigned-for-oms (SQS), rider-assigned-for-n... |

### 2.4.14.0.0.0 Consumers

#### 2.4.14.1.0.0 Service

##### 2.4.14.1.1.0 Service

Order Management Service

##### 2.4.14.1.2.0 Handler

updateOrderStatusToInTransit

##### 2.4.14.1.3.0 Processing Type

async

#### 2.4.14.2.0.0 Service

##### 2.4.14.2.1.0 Service

Notifications Service

##### 2.4.14.2.2.0 Handler

notifyCustomerRiderAssigned

##### 2.4.14.2.3.0 Processing Type

async

### 2.4.15.0.0.0 Dependencies

- EVT-ORD-003

### 2.4.16.0.0.0 Error Handling

| Property | Value |
|----------|-------|
| Retry Strategy | Exponential Backoff |
| Dead Letter Queue | logistics-rider-assigned-dlq |
| Timeout Ms | 30000 |

## 2.5.0.0.0.0 Event Id

### 2.5.1.0.0.0 Event Id

EVT-ORD-004

### 2.5.2.0.0.0 Event Name

OrderDelivered

### 2.5.3.0.0.0 Event Type

domain

### 2.5.4.0.0.0 Category

🔹 Order Management

### 2.5.5.0.0.0 Description

Triggered when a rider confirms delivery. This event completes the primary order saga and initiates financial settlement processes.

### 2.5.6.0.0.0 Trigger Condition

Rider successfully submits Proof of Delivery (REQ-1-072).

### 2.5.7.0.0.0 Source Context

Rider Logistics Service

### 2.5.8.0.0.0 Target Contexts

- Order Management Service
- Payments & Settlements Service
- Notifications Service

### 2.5.9.0.0.0 Payload

#### 2.5.9.1.0.0 Schema

| Property | Value |
|----------|-------|
| Order Id | string |
| Rider Id | string |
| Delivered At | datetime |
| Pod Type | string |

#### 2.5.9.2.0.0 Required Fields

- orderId
- riderId
- deliveredAt

#### 2.5.9.3.0.0 Optional Fields

- podType

### 2.5.10.0.0.0 Frequency

high

### 2.5.11.0.0.0 Business Criticality

critical

### 2.5.12.0.0.0 Data Source

| Property | Value |
|----------|-------|
| Database | PostgreSQL |
| Table | DeliveryTask |
| Operation | update |

### 2.5.13.0.0.0 Routing

| Property | Value |
|----------|-------|
| Routing Key | order.delivered |
| Exchange | order-events (SNS Topic) |
| Queue | order-delivered-for-settlements (SQS), order-deliv... |

### 2.5.14.0.0.0 Consumers

#### 2.5.14.1.0.0 Service

##### 2.5.14.1.1.0 Service

Payments & Settlements Service

##### 2.5.14.1.2.0 Handler

initiateCommissionAndPayoutCalculation

##### 2.5.14.1.3.0 Processing Type

async

#### 2.5.14.2.0.0 Service

##### 2.5.14.2.1.0 Service

Order Management Service

##### 2.5.14.2.2.0 Handler

updateOrderStatusToDelivered

##### 2.5.14.2.3.0 Processing Type

async

#### 2.5.14.3.0.0 Service

##### 2.5.14.3.1.0 Service

Notifications Service

##### 2.5.14.3.2.0 Handler

promptCustomerForRating

##### 2.5.14.3.3.0 Processing Type

async

### 2.5.15.0.0.0 Dependencies

- EVT-LOG-001

### 2.5.16.0.0.0 Error Handling

| Property | Value |
|----------|-------|
| Retry Strategy | Exponential Backoff |
| Dead Letter Queue | order-delivered-dlq |
| Timeout Ms | 30000 |

## 2.6.0.0.0.0 Event Id

### 2.6.1.0.0.0 Event Id

EVT-ORD-005

### 2.6.2.0.0.0 Event Name

OrderCancelled

### 2.6.3.0.0.0 Event Type

domain

### 2.6.4.0.0.0 Category

🔹 Order Management

### 2.6.5.0.0.0 Description

Triggered when an order is cancelled by a customer, vendor, or the system. Initiates compensation actions in the saga (e.g., refund).

### 2.6.6.0.0.0 Trigger Condition

Customer cancels (REQ-1-031), vendor rejects (REQ-1-065), or system auto-rejects (REQ-1-067).

### 2.6.7.0.0.0 Source Context

Order Management Service

### 2.6.8.0.0.0 Target Contexts

- Payments & Settlements Service
- Vendor & Catalog Service
- Notifications Service

### 2.6.9.0.0.0 Payload

#### 2.6.9.1.0.0 Schema

| Property | Value |
|----------|-------|
| Order Id | string |
| Reason | string |
| Cancelled By | string |

#### 2.6.9.2.0.0 Required Fields

- orderId
- reason
- cancelledBy

#### 2.6.9.3.0.0 Optional Fields

*No items available*

### 2.6.10.0.0.0 Frequency

medium

### 2.6.11.0.0.0 Business Criticality

important

### 2.6.12.0.0.0 Data Source

| Property | Value |
|----------|-------|
| Database | PostgreSQL |
| Table | Order |
| Operation | update |

### 2.6.13.0.0.0 Routing

| Property | Value |
|----------|-------|
| Routing Key | order.cancelled |
| Exchange | order-events (SNS Topic) |
| Queue | order-cancelled-for-settlements (SQS), order-cance... |

### 2.6.14.0.0.0 Consumers

#### 2.6.14.1.0.0 Service

##### 2.6.14.1.1.0 Service

Payments & Settlements Service

##### 2.6.14.1.2.0 Handler

processRefund

##### 2.6.14.1.3.0 Processing Type

async

#### 2.6.14.2.0.0 Service

##### 2.6.14.2.1.0 Service

Vendor & Catalog Service

##### 2.6.14.2.2.0 Handler

revertStockLevels

##### 2.6.14.2.3.0 Processing Type

async

#### 2.6.14.3.0.0 Service

##### 2.6.14.3.1.0 Service

Notifications Service

##### 2.6.14.3.2.0 Handler

notifyPartiesOfCancellation

##### 2.6.14.3.3.0 Processing Type

async

### 2.6.15.0.0.0 Dependencies

*No items available*

### 2.6.16.0.0.0 Error Handling

| Property | Value |
|----------|-------|
| Retry Strategy | Linear |
| Dead Letter Queue | order-cancelled-dlq |
| Timeout Ms | 30000 |

# 3.0.0.0.0.0 Event Types And Schema Design

## 3.1.0.0.0.0 Essential Event Types

### 3.1.1.0.0.0 Event Name

#### 3.1.1.1.0.0 Event Name

OrderPlaced

#### 3.1.1.2.0.0 Category

🔹 domain

#### 3.1.1.3.0.0 Description

Initiates the order fulfillment saga.

#### 3.1.1.4.0.0 Priority

🔴 high

### 3.1.2.0.0.0 Event Name

#### 3.1.2.1.0.0 Event Name

OrderReadyForPickup

#### 3.1.2.2.0.0 Category

🔹 integration

#### 3.1.2.3.0.0 Description

Decouples Order Management from Rider Logistics.

#### 3.1.2.4.0.0 Priority

🔴 high

### 3.1.3.0.0.0 Event Name

#### 3.1.3.1.0.0 Event Name

RiderAssigned

#### 3.1.3.2.0.0 Category

🔹 integration

#### 3.1.3.3.0.0 Description

Notifies relevant parties about the assigned rider.

#### 3.1.3.4.0.0 Priority

🔴 high

### 3.1.4.0.0.0 Event Name

#### 3.1.4.1.0.0 Event Name

OrderDelivered

#### 3.1.4.2.0.0 Category

🔹 domain

#### 3.1.4.3.0.0 Description

Completes the order saga and triggers financial processes.

#### 3.1.4.4.0.0 Priority

🔴 high

### 3.1.5.0.0.0 Event Name

#### 3.1.5.1.0.0 Event Name

OrderCancelled

#### 3.1.5.2.0.0 Category

🔹 domain

#### 3.1.5.3.0.0 Description

Initiates compensating transactions like refunds.

#### 3.1.5.4.0.0 Priority

🟡 medium

## 3.2.0.0.0.0 Schema Design

| Property | Value |
|----------|-------|
| Format | JSON |
| Reasoning | Native support in the specified technology stack (... |
| Consistency Approach | A standardized event envelope will be used, contai... |

## 3.3.0.0.0.0 Schema Evolution

| Property | Value |
|----------|-------|
| Backward Compatibility | ✅ |
| Forward Compatibility | ❌ |
| Strategy | Additive changes only (new optional fields). For b... |

## 3.4.0.0.0.0 Event Structure

### 3.4.1.0.0.0 Standard Fields

- eventId
- correlationId
- timestamp
- eventVersion
- eventType
- sourceService

### 3.4.2.0.0.0 Metadata Requirements

- correlationId is mandatory for end-to-end tracing as per REQ-1-110.

# 4.0.0.0.0.0 Event Routing And Processing

## 4.1.0.0.0.0 Routing Mechanisms

- {'type': 'SNS Fan-out to SQS', 'description': "A central SNS topic for each domain (e.g., 'order-events') broadcasts events. Each interested microservice subscribes via its own dedicated SQS queue, ensuring durable, decoupled, and parallel processing.", 'useCase': 'Decoupling services like Order Management, Notifications, and Payments as per REQ-1-105.'}

## 4.2.0.0.0.0 Processing Patterns

- {'pattern': 'saga', 'applicableScenarios': ['Order Fulfillment Lifecycle (Placement -> Acceptance -> Pickup -> Delivery)', 'Order Cancellation (Initiate refund, revert stock)'], 'implementation': 'Choreography-based Saga. Each service listens for events from other services and performs its local transaction before publishing a new event. This aligns with REQ-1-105.'}

## 4.3.0.0.0.0 Filtering And Subscription

### 4.3.1.0.0.0 Filtering Mechanism

SNS Subscription Policies

### 4.3.2.0.0.0 Subscription Model

Pub/Sub

### 4.3.3.0.0.0 Routing Keys

- order.placed
- order.accepted
- order.ready_for_pickup
- order.delivered
- order.cancelled
- logistics.rider_assigned

## 4.4.0.0.0.0 Handler Isolation

| Property | Value |
|----------|-------|
| Required | ✅ |
| Approach | Each event consumer (handler) runs in its own cont... |
| Reasoning | Prevents cascading failures and allows services to... |

## 4.5.0.0.0.0 Delivery Guarantees

| Property | Value |
|----------|-------|
| Level | at-least-once |
| Justification | Financial and order state transitions are critical... |
| Implementation | Leveraging AWS SQS default delivery guarantees. Co... |

# 5.0.0.0.0.0 Event Storage And Replay

## 5.1.0.0.0.0 Persistence Requirements

| Property | Value |
|----------|-------|
| Required | ✅ |
| Duration | 7 Years for Order events |
| Reasoning | The 'OrderStatusHistory' table (REQ-1-077) and 'Fi... |

## 5.2.0.0.0.0 Event Sourcing

### 5.2.1.0.0.0 Necessary

✅ Yes

### 5.2.2.0.0.0 Justification

Required for the Order aggregate to meet REQ-1-077, which mandates an immutable event log for every state transition. This is implemented via the 'OrderStatusHistory' table rather than a dedicated event store to reduce complexity.

### 5.2.3.0.0.0 Scope

- Order Management

## 5.3.0.0.0.0 Technology Options

- {'technology': 'PostgreSQL Table (OrderStatusHistory)', 'suitability': 'high', 'reasoning': 'Meets the requirement for an immutable log (REQ-1-077) without introducing the complexity of a dedicated event store technology like EventStoreDB or Kafka, which is beyond the essential needs.'}

## 5.4.0.0.0.0 Replay Capabilities

### 5.4.1.0.0.0 Required

✅ Yes

### 5.4.2.0.0.0 Scenarios

- Rebuilding an order's state for support/debugging.
- Disaster recovery for a specific order's state.

### 5.4.3.0.0.0 Implementation

A utility script to read from the 'OrderStatusHistory' table for a given orderId and reconstruct its state.

## 5.5.0.0.0.0 Retention Policy

| Property | Value |
|----------|-------|
| Strategy | Selective Archiving |
| Duration | 90 days for chat logs, 7 years for financial/order... |
| Archiving Approach | Use PostgreSQL partitioning and AWS S3 Glacier for... |

# 6.0.0.0.0.0 Dead Letter Queue And Error Handling

## 6.1.0.0.0.0 Dead Letter Strategy

| Property | Value |
|----------|-------|
| Approach | Each primary SQS processing queue will be configur... |
| Queue Configuration | A maxReceiveCount of 3 will be set on the primary ... |
| Processing Logic | Messages in the DLQ will not be automatically repr... |

## 6.2.0.0.0.0 Retry Policies

- {'errorType': 'Transient Errors (e.g., network timeout, database deadlock)', 'maxRetries': 3, 'backoffStrategy': 'exponential', 'delayConfiguration': 'Initial delay of 1 second, multiplier of 2.'}

## 6.3.0.0.0.0 Poison Message Handling

| Property | Value |
|----------|-------|
| Detection Mechanism | A message that fails processing 3 times and is mov... |
| Handling Strategy | Manual inspection, analysis, and potential fixing ... |
| Alerting Required | ✅ |

## 6.4.0.0.0.0 Error Notification

### 6.4.1.0.0.0 Channels

- AWS CloudWatch Alarms -> PagerDuty/Slack

### 6.4.2.0.0.0 Severity

critical

### 6.4.3.0.0.0 Recipients

- On-call SRE Team

## 6.5.0.0.0.0 Recovery Procedures

- {'scenario': 'Failed event processing due to a bug in a consumer service.', 'procedure': '1. Pause the SQS queue to stop further processing. 2. Deploy a fix for the consumer. 3. Manually inspect and, if necessary, correct the data affected by the failed message. 4. Redrive the message from the DLQ back to the main queue. 5. Resume the SQS queue.', 'automationLevel': 'semi-automated'}

# 7.0.0.0.0.0 Event Versioning Strategy

## 7.1.0.0.0.0 Schema Evolution Approach

| Property | Value |
|----------|-------|
| Strategy | Additive Schema Changes with Version Number |
| Versioning Scheme | Semantic versioning (e.g., 1.0, 1.1) |
| Migration Strategy | Consumers must be backward compatible and able to ... |

## 7.2.0.0.0.0 Compatibility Requirements

| Property | Value |
|----------|-------|
| Backward Compatible | ✅ |
| Forward Compatible | ❌ |
| Reasoning | Ensures that deploying a new producer does not bre... |

## 7.3.0.0.0.0 Version Identification

| Property | Value |
|----------|-------|
| Mechanism | Event property |
| Location | payload |
| Format | `eventVersion`: `1.0` |

## 7.4.0.0.0.0 Consumer Upgrade Strategy

| Property | Value |
|----------|-------|
| Approach | Tolerant Reader pattern. Consumers must ignore pro... |
| Rollout Strategy | Rolling updates for consumer services. |
| Rollback Procedure | Standard service rollback via Kubernetes deploymen... |

## 7.5.0.0.0.0 Schema Registry

| Property | Value |
|----------|-------|
| Required | ❌ |
| Technology | N/A |
| Governance | A centrally managed document or Git repository wil... |

# 8.0.0.0.0.0 Event Monitoring And Observability

## 8.1.0.0.0.0 Monitoring Capabilities

### 8.1.1.0.0.0 Capability

#### 8.1.1.1.0.0 Capability

Queue Depth Monitoring

#### 8.1.1.2.0.0 Justification

A growing queue indicates a processing bottleneck or consumer failure, a key metric from REQ-1-109.

#### 8.1.1.3.0.0 Implementation

AWS CloudWatch Metric for ApproximateNumberOfMessagesVisible on each SQS queue.

### 8.1.2.0.0.0 Capability

#### 8.1.2.1.0.0 Capability

Event Processing Latency

#### 8.1.2.2.0.0 Justification

Tracks the time from event publication to consumption, crucial for performance monitoring.

#### 8.1.2.3.0.0 Implementation

Include a 'publishedAt' timestamp in the event metadata and calculate the delta upon consumption. Push metric to Prometheus.

## 8.2.0.0.0.0 Tracing And Correlation

| Property | Value |
|----------|-------|
| Tracing Required | ✅ |
| Correlation Strategy | A unique `correlationId` is generated at the API G... |
| Trace Id Propagation | The `correlationId` will be passed in the metadata... |

## 8.3.0.0.0.0 Performance Metrics

### 8.3.1.0.0.0 Metric

#### 8.3.1.1.0.0 Metric

SQS Queue Depth

#### 8.3.1.2.0.0 Threshold

> 100 messages for more than 5 minutes

#### 8.3.1.3.0.0 Alerting

✅ Yes

### 8.3.2.0.0.0 Metric

#### 8.3.2.1.0.0 Metric

Event Processing P95 Latency

#### 8.3.2.2.0.0 Threshold

> 5000ms

#### 8.3.2.3.0.0 Alerting

✅ Yes

### 8.3.3.0.0.0 Metric

#### 8.3.3.1.0.0 Metric

DLQ Message Count

#### 8.3.3.2.0.0 Threshold

> 0 messages

#### 8.3.3.3.0.0 Alerting

✅ Yes

## 8.4.0.0.0.0 Event Flow Visualization

| Property | Value |
|----------|-------|
| Required | ✅ |
| Tooling | AWS X-Ray or Jaeger (via OpenTelemetry) |
| Scope | Visualize the entire saga flow for a single order,... |

## 8.5.0.0.0.0 Alerting Requirements

### 8.5.1.0.0.0 Condition

#### 8.5.1.1.0.0 Condition

Number of messages in DLQ > 0

#### 8.5.1.2.0.0 Severity

critical

#### 8.5.1.3.0.0 Response Time

< 15 minutes

#### 8.5.1.4.0.0 Escalation Path

- On-call Engineer
- Engineering Lead

### 8.5.2.0.0.0 Condition

#### 8.5.2.1.0.0 Condition

SQS Queue age of oldest message > 1 hour

#### 8.5.2.2.0.0 Severity

warning

#### 8.5.2.3.0.0 Response Time

< 1 hour

#### 8.5.2.4.0.0 Escalation Path

- On-call Engineer

# 9.0.0.0.0.0 Implementation Priority

## 9.1.0.0.0.0 Component

### 9.1.1.0.0.0 Component

Order Fulfillment Saga Events (OrderPlaced, OrderAccepted, OrderReadyForPickup, RiderAssigned, OrderDelivered)

### 9.1.2.0.0.0 Priority

🔴 high

### 9.1.3.0.0.0 Dependencies

*No items available*

### 9.1.4.0.0.0 Estimated Effort

High

## 9.2.0.0.0.0 Component

### 9.2.1.0.0.0 Component

DLQ and Alerting Configuration

### 9.2.2.0.0.0 Priority

🔴 high

### 9.2.3.0.0.0 Dependencies

- Order Fulfillment Saga Events

### 9.2.4.0.0.0 Estimated Effort

Medium

## 9.3.0.0.0.0 Component

### 9.3.1.0.0.0 Component

Idempotent Consumer Logic

### 9.3.2.0.0.0 Priority

🟡 medium

### 9.3.3.0.0.0 Dependencies

- Order Fulfillment Saga Events

### 9.3.4.0.0.0 Estimated Effort

Medium

## 9.4.0.0.0.0 Component

### 9.4.1.0.0.0 Component

Correlation ID Propagation

### 9.4.2.0.0.0 Priority

🟡 medium

### 9.4.3.0.0.0 Dependencies

*No items available*

### 9.4.4.0.0.0 Estimated Effort

Medium

# 10.0.0.0.0.0 Risk Assessment

## 10.1.0.0.0.0 Risk

### 10.1.1.0.0.0 Risk

Inconsistent data state due to a failure in the middle of a Saga.

### 10.1.2.0.0.0 Impact

high

### 10.1.3.0.0.0 Probability

medium

### 10.1.4.0.0.0 Mitigation

Implement robust compensating transactions (e.g., automated refunds for failed orders). Ensure idempotent consumers to allow safe retries.

## 10.2.0.0.0.0 Risk

### 10.2.1.0.0.0 Risk

Message processing delay causing poor user experience.

### 10.2.2.0.0.0 Impact

medium

### 10.2.3.0.0.0 Probability

medium

### 10.2.4.0.0.0 Mitigation

Configure autoscaling for consumer services based on SQS queue depth. Set up alerts for high queue latency.

# 11.0.0.0.0.0 Recommendations

## 11.1.0.0.0.0 Category

### 11.1.1.0.0.0 Category

🔹 Reliability

### 11.1.2.0.0.0 Recommendation

All event consumers MUST be designed to be idempotent. This is critical for achieving an effective at-least-once delivery system without causing data corruption on message redelivery.

### 11.1.3.0.0.0 Justification

AWS SQS provides at-least-once delivery, which means duplicates can occur. Without idempotency, a duplicate event could lead to double charges, duplicate notifications, or incorrect stock levels.

### 11.1.4.0.0.0 Priority

🔴 high

## 11.2.0.0.0.0 Category

### 11.2.1.0.0.0 Category

🔹 Observability

### 11.2.2.0.0.0 Recommendation

Strictly enforce the propagation of the `correlationId` across all events and internal API calls from day one.

### 11.2.3.0.0.0 Justification

As per REQ-1-110, this is the only effective way to trace a single user request through multiple asynchronous services, which is essential for debugging in a distributed system.

### 11.2.4.0.0.0 Priority

🔴 high

