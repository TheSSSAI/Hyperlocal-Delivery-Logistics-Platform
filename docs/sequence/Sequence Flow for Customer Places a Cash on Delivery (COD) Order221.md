# 1 Overview

## 1.1 Diagram Id

SEQ-BP-004

## 1.2 Name

Customer Places a Cash on Delivery (COD) Order

## 1.3 Description

The end-to-end flow for a customer placing a COD order. This process bypasses the online payment gateway and incorporates the rider's cash collection responsibilities.

## 1.4 Type

🔹 BusinessProcess

## 1.5 Purpose

To process orders for customers who prefer to pay with cash upon delivery.

## 1.6 Complexity

Medium

## 1.7 Priority

🚨 Critical

## 1.8 Frequency

OnDemand

## 1.9 Participants

- REPO-FE-CUST
- REPO-BE-ORDER
- REPO-BE-CATALOG
- REPO-FE-VEND
- REPO-FE-RIDER

## 1.10 Key Interactions

- Customer selects 'Cash on Delivery' as the payment method.
- Order Service validates that the order total is below the configured COD limit.
- The order is created immediately with the status 'Pending Vendor Acceptance'.
- An 'OrderPlaced' event is published.
- When the rider delivers the order, their app displays the exact cash amount to collect.
- Rider collects cash and marks the order as 'Delivered'.
- The rider's 'cash-in-hand' total is updated in their app.

## 1.11 Triggers

- Customer selects 'COD' and places an order.

## 1.12 Outcomes

- A COD order is created and fulfilled.
- The rider is tasked with collecting the correct payment amount.

## 1.13 Business Rules

- COD is only available for orders below a configurable maximum value (REQ-BR-001).

## 1.14 Error Scenarios

- Customer does not have the exact cash amount.
- Order total exceeds the maximum allowed COD value.

## 1.15 Integration Points

- Rider's earnings and cash management module.

# 2.0 Details

## 2.1 Diagram Id

SEQ-BP-004-impl

## 2.2 Name

Implementation: Customer Places a Cash on Delivery (COD) Order

## 2.3 Description

Provides the detailed technical sequence for a customer placing a Cash on Delivery (COD) order. The sequence covers synchronous validation against business rules (COD limit, stock availability) and the asynchronous event-driven workflow that follows successful order placement, culminating in the rider's cash collection task.

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
| Stereotype | Frontend |

### 2.4.2.0 Microservice

#### 2.4.2.1 Repository Id

REPO-BE-ORDER

#### 2.4.2.2 Display Name

Order Management Service

#### 2.4.2.3 Type

🔹 Microservice

#### 2.4.2.4 Technology

NestJS on EKS

#### 2.4.2.5 Order

2

#### 2.4.2.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #D2691E |
| Stereotype | Backend |

### 2.4.3.0 Microservice

#### 2.4.3.1 Repository Id

REPO-BE-CATALOG

#### 2.4.3.2 Display Name

Vendor & Catalog Service

#### 2.4.3.3 Type

🔹 Microservice

#### 2.4.3.4 Technology

NestJS on EKS

#### 2.4.3.5 Order

3

#### 2.4.3.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #4682B4 |
| Stereotype | Backend |

### 2.4.4.0 Client Application

#### 2.4.4.1 Repository Id

REPO-FE-VEND

#### 2.4.4.2 Display Name

Vendor Web Dashboard

#### 2.4.4.3 Type

🔹 Client Application

#### 2.4.4.4 Technology

React.js + Vite

#### 2.4.4.5 Order

4

#### 2.4.4.6 Style

| Property | Value |
|----------|-------|
| Shape | boundary |
| Color | #2E8B57 |
| Stereotype | Frontend |

### 2.4.5.0 Client Application

#### 2.4.5.1 Repository Id

REPO-FE-RIDER

#### 2.4.5.2 Display Name

Rider Mobile App

#### 2.4.5.3 Type

🔹 Client Application

#### 2.4.5.4 Technology

React Native v0.73+

#### 2.4.5.5 Order

5

#### 2.4.5.6 Style

| Property | Value |
|----------|-------|
| Shape | actor |
| Color | #FF4500 |
| Stereotype | Frontend |

## 2.5.0.0 Interactions

### 2.5.1.0 API Request

#### 2.5.1.1 Source Id

REPO-FE-CUST

#### 2.5.1.2 Target Id

REPO-BE-ORDER

#### 2.5.1.3 Message

1. POST /api/v1/orders (Submit COD Order)

#### 2.5.1.4 Sequence Number

1

#### 2.5.1.5 Type

🔹 API Request

#### 2.5.1.6 Is Synchronous

✅ Yes

#### 2.5.1.7 Return Message

7a. 400 Bad Request (COD Limit Exceeded) OR 7b. 201 Created (Order Confirmed)

#### 2.5.1.8 Has Return

✅ Yes

#### 2.5.1.9 Is Activation

✅ Yes

#### 2.5.1.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS/1.1 |
| Method | POST |
| Parameters | Body: { cartId: string, deliveryAddressId: string,... |
| Authentication | JWT Bearer Token (Customer Role) |
| Error Handling | Client handles 4xx/5xx responses. Specifically dis... |
| Performance | P95 Latency < 500ms for entire synchronous flow (S... |

#### 2.5.1.11 Nested Interactions

##### 2.5.1.11.1 Internal API Call

###### 2.5.1.11.1.1 Source Id

REPO-BE-ORDER

###### 2.5.1.11.1.2 Target Id

REPO-BE-CATALOG

###### 2.5.1.11.1.3 Message

2. POST /api/v1/internal/products/validate-cart (Real-time stock & price check)

###### 2.5.1.11.1.4 Sequence Number

2

###### 2.5.1.11.1.5 Type

🔹 Internal API Call

###### 2.5.1.11.1.6 Is Synchronous

✅ Yes

###### 2.5.1.11.1.7 Return Message

3. Validation Response { isValid: boolean, items: [...], total: number } or Error

###### 2.5.1.11.1.8 Has Return

✅ Yes

###### 2.5.1.11.1.9 Is Activation

✅ Yes

###### 2.5.1.11.1.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTP (via Service Mesh) |
| Method | POST |
| Parameters | Body: { items: [{productId, quantity}] } |
| Authentication | mTLS via AWS App Mesh |
| Error Handling | Returns 400 if item is out of stock. Retry on 5xx ... |
| Performance | P95 Latency < 100ms. |

##### 2.5.1.11.2.0 Internal Logic

###### 2.5.1.11.2.1 Source Id

REPO-BE-ORDER

###### 2.5.1.11.2.2 Target Id

REPO-BE-ORDER

###### 2.5.1.11.2.3 Message

4. Validate Business Rule: Order total <= Max COD Limit (REQ-BR-001)

###### 2.5.1.11.2.4 Sequence Number

4

###### 2.5.1.11.2.5 Type

🔹 Internal Logic

###### 2.5.1.11.2.6 Is Synchronous

✅ Yes

###### 2.5.1.11.2.7 Return Message



###### 2.5.1.11.2.8 Has Return

❌ No

###### 2.5.1.11.2.9 Is Activation

❌ No

###### 2.5.1.11.2.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | N/A |
| Method | getConfigValue('max_cod_value') |
| Parameters | orderTotal from step 3 |
| Authentication | N/A |
| Error Handling | If validation fails, immediately halt processing a... |
| Performance | Sub-millisecond (reads from cached config). |

##### 2.5.1.11.3.0 Database Write

###### 2.5.1.11.3.1 Source Id

REPO-BE-ORDER

###### 2.5.1.11.3.2 Target Id

REPO-BE-ORDER

###### 2.5.1.11.3.3 Message

5. Persist Order to Database

###### 2.5.1.11.3.4 Sequence Number

5

###### 2.5.1.11.3.5 Type

🔹 Database Write

###### 2.5.1.11.3.6 Is Synchronous

✅ Yes

###### 2.5.1.11.3.7 Return Message



###### 2.5.1.11.3.8 Has Return

❌ No

###### 2.5.1.11.3.9 Is Activation

❌ No

###### 2.5.1.11.3.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | SQL/TCP |
| Method | INSERT INTO orders (...) VALUES (...) |
| Parameters | Order entity data with status set to 'Pending Vend... |
| Authentication | IAM DB Authentication |
| Error Handling | Transaction rollback on failure. Returns 500 to cl... |
| Performance | P95 Latency < 50ms. |

##### 2.5.1.11.4.0 Event Publication

###### 2.5.1.11.4.1 Source Id

REPO-BE-ORDER

###### 2.5.1.11.4.2 Target Id

REPO-BE-ORDER

###### 2.5.1.11.4.3 Message

6. Publish `OrderPlacedEvent` to SNS Topic 'order-events'

###### 2.5.1.11.4.4 Sequence Number

6

###### 2.5.1.11.4.5 Type

🔹 Event Publication

###### 2.5.1.11.4.6 Is Synchronous

❌ No

###### 2.5.1.11.4.7 Return Message



###### 2.5.1.11.4.8 Has Return

❌ No

###### 2.5.1.11.4.9 Is Activation

❌ No

###### 2.5.1.11.4.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | AWS SDK |
| Method | sns.publish() |
| Parameters | Payload contains { orderId, customerId, vendorId, ... |
| Authentication | IAM Role for EKS Pod |
| Error Handling | Failure to publish is logged critically but does n... |
| Performance | P95 Latency < 50ms. |

### 2.5.2.0.0.0 Async Notification

#### 2.5.2.1.0.0 Source Id

REPO-BE-ORDER

#### 2.5.2.2.0.0 Target Id

REPO-FE-VEND

#### 2.5.2.3.0.0 Message

8. [Async] WebSocket Push: `new_order`

#### 2.5.2.4.0.0 Sequence Number

8

#### 2.5.2.5.0.0 Type

🔹 Async Notification

#### 2.5.2.6.0.0 Is Synchronous

❌ No

#### 2.5.2.7.0.0 Return Message



#### 2.5.2.8.0.0 Has Return

❌ No

#### 2.5.2.9.0.0 Is Activation

❌ No

#### 2.5.2.10.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | WSS (Secure WebSocket) |
| Method | emit('new_order') |
| Parameters | Payload: { orderId, customerName, items, total } |
| Authentication | N/A (Represents effect of backend event consumptio... |
| Error Handling | Vendor dashboard has connection retry logic. |
| Performance | Latency < 2s from event publication. |

### 2.5.3.0.0.0 Async Notification

#### 2.5.3.1.0.0 Source Id

REPO-BE-ORDER

#### 2.5.3.2.0.0 Target Id

REPO-FE-RIDER

#### 2.5.3.3.0.0 Message

9. [Async] Assign Delivery Task with COD details

#### 2.5.3.4.0.0 Sequence Number

9

#### 2.5.3.5.0.0 Type

🔹 Async Notification

#### 2.5.3.6.0.0 Is Synchronous

❌ No

#### 2.5.3.7.0.0 Return Message



#### 2.5.3.8.0.0 Has Return

❌ No

#### 2.5.3.9.0.0 Is Activation

✅ Yes

#### 2.5.3.10.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | WSS (via Rider Logistics Service) |
| Method | emit('new_task') |
| Parameters | Payload: { taskId, orderId, pickupAddress, deliver... |
| Authentication | N/A (Represents effect of Rider Allocation process... |
| Error Handling | N/A |
| Performance | N/A |

### 2.5.4.0.0.0 UI Update

#### 2.5.4.1.0.0 Source Id

REPO-FE-RIDER

#### 2.5.4.2.0.0 Target Id

REPO-FE-RIDER

#### 2.5.4.3.0.0 Message

10. Display 'Cash to Collect: ₹X,XXX.XX' on delivery screen

#### 2.5.4.4.0.0 Sequence Number

10

#### 2.5.4.5.0.0 Type

🔹 UI Update

#### 2.5.4.6.0.0 Is Synchronous

✅ Yes

#### 2.5.4.7.0.0 Return Message



#### 2.5.4.8.0.0 Has Return

❌ No

#### 2.5.4.9.0.0 Is Activation

❌ No

#### 2.5.4.10.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | N/A |
| Method | render() |
| Parameters | cashToCollect from task payload |
| Authentication | N/A |
| Error Handling | UI component clearly highlights the amount. |
| Performance | Instant |

### 2.5.5.0.0.0 API Request

#### 2.5.5.1.0.0 Source Id

REPO-FE-RIDER

#### 2.5.5.2.0.0 Target Id

REPO-BE-ORDER

#### 2.5.5.3.0.0 Message

11. PATCH /api/v1/deliveries/{id}/complete (Mark Delivered)

#### 2.5.5.4.0.0 Sequence Number

11

#### 2.5.5.5.0.0 Type

🔹 API Request

#### 2.5.5.6.0.0 Is Synchronous

✅ Yes

#### 2.5.5.7.0.0 Return Message

12. 200 OK

#### 2.5.5.8.0.0 Has Return

✅ Yes

#### 2.5.5.9.0.0 Is Activation

✅ Yes

#### 2.5.5.10.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS/1.1 |
| Method | PATCH |
| Parameters | Body: { pod: { type: 'CASH_COLLECTED' }, timestamp... |
| Authentication | JWT Bearer Token (Rider Role) |
| Error Handling | Client handles 4xx/5xx responses; implements offli... |
| Performance | P95 Latency < 300ms. |

### 2.5.6.0.0.0 Event Publication

#### 2.5.6.1.0.0 Source Id

REPO-BE-ORDER

#### 2.5.6.2.0.0 Target Id

REPO-BE-ORDER

#### 2.5.6.3.0.0 Message

13. Publish `OrderDeliveredEvent` for COD order

#### 2.5.6.4.0.0 Sequence Number

13

#### 2.5.6.5.0.0 Type

🔹 Event Publication

#### 2.5.6.6.0.0 Is Synchronous

❌ No

#### 2.5.6.7.0.0 Return Message



#### 2.5.6.8.0.0 Has Return

❌ No

#### 2.5.6.9.0.0 Is Activation

❌ No

#### 2.5.6.10.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | AWS SDK |
| Method | sns.publish() |
| Parameters | Payload contains { orderId, riderId, paymentMethod... |
| Authentication | IAM Role for EKS Pod |
| Error Handling | Critical log on failure. Event will be reprocessed... |
| Performance | P95 Latency < 50ms. |

### 2.5.7.0.0.0 Async Notification

#### 2.5.7.1.0.0 Source Id

REPO-BE-ORDER

#### 2.5.7.2.0.0 Target Id

REPO-FE-RIDER

#### 2.5.7.3.0.0 Message

14. [Async] Update Rider's `cashInHand` total

#### 2.5.7.4.0.0 Sequence Number

14

#### 2.5.7.5.0.0 Type

🔹 Async Notification

#### 2.5.7.6.0.0 Is Synchronous

❌ No

#### 2.5.7.7.0.0 Return Message



#### 2.5.7.8.0.0 Has Return

❌ No

#### 2.5.7.9.0.0 Is Activation

❌ No

#### 2.5.7.10.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | WSS |
| Method | emit('balance_updated') |
| Parameters | N/A (Triggers a fresh data fetch from the client) |
| Authentication | N/A (Represents effect of Settlements service cons... |
| Error Handling | Client will periodically poll for balance if WebSo... |
| Performance | Visible to rider within 5 seconds of order complet... |

## 2.6.0.0.0.0 Notes

### 2.6.1.0.0.0 Content

#### 2.6.1.1.0.0 Content

Step 4: The Maximum COD Limit is a system-wide configuration managed by Administrators. It should be cached in the Order Service to avoid database lookups on every order.

#### 2.6.1.2.0.0 Position

top

#### 2.6.1.3.0.0 Participant Id

REPO-BE-ORDER

#### 2.6.1.4.0.0 Sequence Number

4

### 2.6.2.0.0.0 Content

#### 2.6.2.1.0.0 Content

Steps 8, 9, 14: These asynchronous notifications are initiated by backend services (e.g., Notifications, Rider Logistics, Settlements) consuming events from the SNS/SQS message bus. They are shown here to illustrate the end-to-end business process flow.

#### 2.6.2.2.0.0 Position

bottom

#### 2.6.2.3.0.0 Participant Id

*Not specified*

#### 2.6.2.4.0.0 Sequence Number

8

### 2.6.3.0.0.0 Content

#### 2.6.3.1.0.0 Content

Step 11: The endpoint for marking delivery complete might live in a dedicated Rider Logistics service, which then publishes an event consumed by the Order Service. Simplified here for clarity.

#### 2.6.3.2.0.0 Position

right

#### 2.6.3.3.0.0 Participant Id

REPO-BE-ORDER

#### 2.6.3.4.0.0 Sequence Number

11

## 2.7.0.0.0.0 Implementation Guidance

| Property | Value |
|----------|-------|
| Security Requirements | Role-Based Access Control must be enforced at the ... |
| Performance Targets | The synchronous order placement flow (steps 1-7) m... |
| Error Handling Strategy | If the COD limit check fails (Step 4), the API mus... |
| Testing Considerations | End-to-end tests must cover: 1) A successful COD o... |
| Monitoring Requirements | A key business metric `cod_orders_total` should be... |
| Deployment Considerations | The configurable `max_cod_value` must be managed v... |

