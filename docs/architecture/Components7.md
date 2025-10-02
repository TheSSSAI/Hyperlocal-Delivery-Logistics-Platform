# 1 Components

## 1.1 Components

### 1.1.1 Customer Mobile Application

#### 1.1.1.1 Id

customer-mobile-app-001

#### 1.1.1.2 Name

Customer Mobile Application

#### 1.1.1.3 Description

The client application used by Customers to discover vendors, place orders, track deliveries, and manage their profile.

#### 1.1.1.4 Type

🔹 Client

#### 1.1.1.5 Dependencies

- api-gateway-001

#### 1.1.1.6 Properties

| Property | Value |
|----------|-------|
| Platform | iOS/Android |
| Version | 1.0.0 |

#### 1.1.1.7 Interfaces

*No items available*

#### 1.1.1.8 Technology

React Native v0.73+

#### 1.1.1.9 Resources

| Property | Value |
|----------|-------|
| Cpu | N/A (Client-side) |
| Memory | N/A (Client-side) |
| Storage | N/A (Client-side) |

#### 1.1.1.10 Configuration

*No data available*

#### 1.1.1.11 Health Check

*No data available*

#### 1.1.1.12 Responsible Features

- REQ-1-002
- REQ-1-035
- REQ-1-039
- REQ-1-043
- REQ-1-047
- REQ-1-048
- REQ-1-052
- REQ-1-059
- REQ-1-062
- REQ-1-089

#### 1.1.1.13 Security

##### 1.1.1.13.1 Requires Authentication

✅ Yes

##### 1.1.1.13.2 Requires Authorization

❌ No

##### 1.1.1.13.3 Allowed Roles

- CUSTOMER

### 1.1.2.0.0 Rider Mobile Application

#### 1.1.2.1.0 Id

rider-mobile-app-002

#### 1.1.2.2.0 Name

Rider Mobile Application

#### 1.1.2.3.0 Description

The client application used by Delivery Riders to manage their availability, accept delivery tasks, navigate, and track earnings.

#### 1.1.2.4.0 Type

🔹 Client

#### 1.1.2.5.0 Dependencies

- api-gateway-001

#### 1.1.2.6.0 Properties

| Property | Value |
|----------|-------|
| Platform | iOS/Android |
| Version | 1.0.0 |

#### 1.1.2.7.0 Interfaces

*No items available*

#### 1.1.2.8.0 Technology

React Native v0.73+

#### 1.1.2.9.0 Resources

| Property | Value |
|----------|-------|
| Cpu | N/A (Client-side) |
| Memory | N/A (Client-side) |
| Storage | N/A (Client-side) |

#### 1.1.2.10.0 Configuration

*No data available*

#### 1.1.2.11.0 Health Check

*No data available*

#### 1.1.2.12.0 Responsible Features

- REQ-1-002
- REQ-1-037
- REQ-1-045
- REQ-1-071
- REQ-1-072
- REQ-1-074
- REQ-1-076
- REQ-1-089

#### 1.1.2.13.0 Security

##### 1.1.2.13.1 Requires Authentication

✅ Yes

##### 1.1.2.13.2 Requires Authorization

❌ No

##### 1.1.2.13.3 Allowed Roles

- RIDER

### 1.1.3.0.0 Vendor Web Dashboard

#### 1.1.3.1.0 Id

vendor-web-dashboard-003

#### 1.1.3.2.0 Name

Vendor Web Dashboard

#### 1.1.3.3.0 Description

The web-based application for Vendors to manage their store profile, product catalog, inventory, and incoming orders.

#### 1.1.3.4.0 Type

🔹 Client

#### 1.1.3.5.0 Dependencies

- api-gateway-001

#### 1.1.3.6.0 Properties

| Property | Value |
|----------|-------|
| Platform | Web |
| Version | 1.0.0 |

#### 1.1.3.7.0 Interfaces

*No items available*

#### 1.1.3.8.0 Technology

React.js v18.2+ with Vite

#### 1.1.3.9.0 Resources

| Property | Value |
|----------|-------|
| Cpu | N/A (Client-side) |
| Memory | N/A (Client-side) |
| Storage | N/A (Client-side) |

#### 1.1.3.10.0 Configuration

*No data available*

#### 1.1.3.11.0 Health Check

*No data available*

#### 1.1.3.12.0 Responsible Features

- REQ-1-002
- REQ-1-006
- REQ-1-036
- REQ-1-044
- REQ-1-065
- REQ-1-068
- REQ-1-070
- REQ-1-107

#### 1.1.3.13.0 Security

##### 1.1.3.13.1 Requires Authentication

✅ Yes

##### 1.1.3.13.2 Requires Authorization

❌ No

##### 1.1.3.13.3 Allowed Roles

- VENDOR

### 1.1.4.0.0 Administrator Web Dashboard

#### 1.1.4.1.0 Id

admin-web-dashboard-004

#### 1.1.4.2.0 Name

Administrator Web Dashboard

#### 1.1.4.3.0 Description

The comprehensive web-based application for platform Administrators to manage users, operational zones, system configurations, and support tickets.

#### 1.1.4.4.0 Type

🔹 Client

#### 1.1.4.5.0 Dependencies

- api-gateway-001

#### 1.1.4.6.0 Properties

| Property | Value |
|----------|-------|
| Platform | Web |
| Version | 1.0.0 |

#### 1.1.4.7.0 Interfaces

*No items available*

#### 1.1.4.8.0 Technology

React.js v18.2+ with Vite

#### 1.1.4.9.0 Resources

| Property | Value |
|----------|-------|
| Cpu | N/A (Client-side) |
| Memory | N/A (Client-side) |
| Storage | N/A (Client-side) |

#### 1.1.4.10.0 Configuration

*No data available*

#### 1.1.4.11.0 Health Check

*No data available*

#### 1.1.4.12.0 Responsible Features

- REQ-1-002
- REQ-1-012
- REQ-1-014
- REQ-1-029
- REQ-1-030
- REQ-1-080
- REQ-1-107

#### 1.1.4.13.0 Security

##### 1.1.4.13.1 Requires Authentication

✅ Yes

##### 1.1.4.13.2 Requires Authorization

❌ No

##### 1.1.4.13.3 Allowed Roles

- ADMINISTRATOR

### 1.1.5.0.0 API Gateway

#### 1.1.5.1.0 Id

api-gateway-001

#### 1.1.5.2.0 Name

API Gateway

#### 1.1.5.3.0 Description

A single, managed entry point for all client applications. It handles request routing, authentication, rate limiting, and serves as the front door to the microservices backend.

#### 1.1.5.4.0 Type

🔹 Gateway

#### 1.1.5.5.0 Dependencies

- identity-access-service-101
- vendor-catalog-service-102
- order-management-service-103
- rider-logistics-service-104
- payments-settlements-service-105
- ratings-communication-service-106
- notifications-service-107

#### 1.1.5.6.0 Properties

| Property | Value |
|----------|-------|
| Provider | AWS |

#### 1.1.5.7.0 Interfaces

*No items available*

#### 1.1.5.8.0 Technology

Amazon API Gateway

#### 1.1.5.9.0 Resources

| Property | Value |
|----------|-------|
| Cpu | N/A (Managed Service) |
| Memory | N/A (Managed Service) |
| Network | Highly Available |

#### 1.1.5.10.0 Configuration

| Property | Value |
|----------|-------|
| Jwt Authorizer | Integrated with AWS Cognito |
| Rate Limit | 1000 requests/second |
| Burst Limit | 500 requests |

#### 1.1.5.11.0 Health Check

*No data available*

#### 1.1.5.12.0 Responsible Features

- REQ-1-096
- REQ-1-106
- REQ-1-110

#### 1.1.5.13.0 Security

##### 1.1.5.13.1 Requires Authentication

✅ Yes

##### 1.1.5.13.2 Requires Authorization

✅ Yes

##### 1.1.5.13.3 Allowed Roles

*No items available*

### 1.1.6.0.0 Identity & Access Service

#### 1.1.6.1.0 Id

identity-access-service-101

#### 1.1.6.2.0 Name

Identity & Access Service

#### 1.1.6.3.0 Description

Manages all aspects of user identity, authentication, authorization, and profiles. Integrates with AWS Cognito for core identity provider functions.

#### 1.1.6.4.0 Type

🔹 Service

#### 1.1.6.5.0 Dependencies

- persistence-layer-201
- messaging-broker-202

#### 1.1.6.6.0 Properties

| Property | Value |
|----------|-------|
| Bounded Context | Identity and Access Management |

#### 1.1.6.7.0 Interfaces

- IUserRegistration
- IAuthentication
- IProfileManagement

#### 1.1.6.8.0 Technology

Node.js v18.18+ with NestJS

#### 1.1.6.9.0 Resources

##### 1.1.6.9.1 Cpu

1 vCPU

##### 1.1.6.9.2 Memory

2GB

#### 1.1.6.10.0 Configuration

##### 1.1.6.10.1 Cognito User Pool Id

env_var

##### 1.1.6.10.2 Jwt Issuer

env_var

#### 1.1.6.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

#### 1.1.6.12.0 Responsible Features

- REQ-1-009
- REQ-1-010
- REQ-1-011
- REQ-1-012
- REQ-1-021
- REQ-1-023
- REQ-1-035
- REQ-1-036
- REQ-1-037
- REQ-1-038
- REQ-1-039
- REQ-1-040
- REQ-1-096

#### 1.1.6.13.0 Security

##### 1.1.6.13.1 Requires Authentication

❌ No

##### 1.1.6.13.2 Requires Authorization

✅ Yes

##### 1.1.6.13.3 Allowed Roles

*No items available*

### 1.1.7.0.0 Vendor & Catalog Service

#### 1.1.7.1.0 Id

vendor-catalog-service-102

#### 1.1.7.2.0 Name

Vendor & Catalog Service

#### 1.1.7.3.0 Description

Manages vendor profiles, business hours, licenses, product catalogs, and real-time inventory levels.

#### 1.1.7.4.0 Type

🔹 Service

#### 1.1.7.5.0 Dependencies

- persistence-layer-201
- messaging-broker-202

#### 1.1.7.6.0 Properties

| Property | Value |
|----------|-------|
| Bounded Context | Vendor and Product Management |

#### 1.1.7.7.0 Interfaces

- IVendorProfile
- IProductCatalog
- IInventory

#### 1.1.7.8.0 Technology

Node.js v18.18+ with NestJS

#### 1.1.7.9.0 Resources

##### 1.1.7.9.1 Cpu

1 vCPU

##### 1.1.7.9.2 Memory

2GB

#### 1.1.7.10.0 Configuration

##### 1.1.7.10.1 S3 Bucket For Images

env_var

##### 1.1.7.10.2 Csv Import Max Rows

1000

#### 1.1.7.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

#### 1.1.7.12.0 Responsible Features

- REQ-1-006
- REQ-1-025
- REQ-1-026
- REQ-1-027
- REQ-1-044
- REQ-1-050
- REQ-1-051
- REQ-1-068
- REQ-1-069
- REQ-1-070

#### 1.1.7.13.0 Security

##### 1.1.7.13.1 Requires Authentication

✅ Yes

##### 1.1.7.13.2 Requires Authorization

✅ Yes

##### 1.1.7.13.3 Allowed Roles

- ADMINISTRATOR
- VENDOR

### 1.1.8.0.0 Order Management Service

#### 1.1.8.1.0 Id

order-management-service-103

#### 1.1.8.2.0 Name

Order Management Service

#### 1.1.8.3.0 Description

The core transactional service that manages the entire order lifecycle, from cart to completion. Orchestrates the order creation Saga.

#### 1.1.8.4.0 Type

🔹 Service

#### 1.1.8.5.0 Dependencies

- persistence-layer-201
- messaging-broker-202

#### 1.1.8.6.0 Properties

| Property | Value |
|----------|-------|
| Bounded Context | Order Fulfillment |

#### 1.1.8.7.0 Interfaces

- ICart
- IOrderPlacement
- IOrderLifecycle

#### 1.1.8.8.0 Technology

Node.js v18.18+ with NestJS

#### 1.1.8.9.0 Resources

##### 1.1.8.9.1 Cpu

2 vCPU

##### 1.1.8.9.2 Memory

4GB

#### 1.1.8.10.0 Configuration

##### 1.1.8.10.1 Vendor Acceptance Timeout

300s

##### 1.1.8.10.2 Cancellation Window

60s

#### 1.1.8.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

#### 1.1.8.12.0 Responsible Features

- REQ-1-031
- REQ-1-032
- REQ-1-052
- REQ-1-053
- REQ-1-055
- REQ-1-056
- REQ-1-065
- REQ-1-066
- REQ-1-067
- REQ-1-077
- REQ-1-105

#### 1.1.8.13.0 Security

##### 1.1.8.13.1 Requires Authentication

✅ Yes

##### 1.1.8.13.2 Requires Authorization

✅ Yes

##### 1.1.8.13.3 Allowed Roles

- CUSTOMER
- VENDOR
- ADMINISTRATOR

### 1.1.9.0.0 Rider Logistics Service

#### 1.1.9.1.0 Id

rider-logistics-service-104

#### 1.1.9.2.0 Name

Rider Logistics Service

#### 1.1.9.3.0 Description

Handles all delivery logistics, including rider allocation, live location tracking, route optimization, and Proof of Delivery.

#### 1.1.9.4.0 Type

🔹 Service

#### 1.1.9.5.0 Dependencies

- persistence-layer-201
- messaging-broker-202
- mapbox-api-302

#### 1.1.9.6.0 Properties

| Property | Value |
|----------|-------|
| Bounded Context | Delivery Logistics |

#### 1.1.9.7.0 Interfaces

- IRiderAllocation
- ILiveTracking
- IPod

#### 1.1.9.8.0 Technology

Node.js v18.18+ with NestJS

#### 1.1.9.9.0 Resources

##### 1.1.9.9.1 Cpu

2 vCPU

##### 1.1.9.9.2 Memory

4GB

#### 1.1.9.10.0 Configuration

##### 1.1.9.10.1 Rider Acceptance Timeout

60s

##### 1.1.9.10.2 Max Allocation Retries

3

#### 1.1.9.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

#### 1.1.9.12.0 Responsible Features

- REQ-1-059
- REQ-1-060
- REQ-1-074
- REQ-1-075
- REQ-1-078
- REQ-1-079
- REQ-1-080

#### 1.1.9.13.0 Security

##### 1.1.9.13.1 Requires Authentication

✅ Yes

##### 1.1.9.13.2 Requires Authorization

✅ Yes

##### 1.1.9.13.3 Allowed Roles

- RIDER
- ADMINISTRATOR
- CUSTOMER

### 1.1.10.0.0 Payments & Settlements Service

#### 1.1.10.1.0 Id

payments-settlements-service-105

#### 1.1.10.2.0 Name

Payments & Settlements Service

#### 1.1.10.3.0 Description

Manages all financial operations, including payment processing, refunds, commission calculations, and automated payouts to vendors and riders.

#### 1.1.10.4.0 Type

🔹 Service

#### 1.1.10.5.0 Dependencies

- persistence-layer-201
- messaging-broker-202
- razorpay-api-301

#### 1.1.10.6.0 Properties

| Property | Value |
|----------|-------|
| Bounded Context | Financials |

#### 1.1.10.7.0 Interfaces

- IPaymentProcessing
- IPayout
- ICommission

#### 1.1.10.8.0 Technology

Node.js v18.18+ with NestJS

#### 1.1.10.9.0 Resources

##### 1.1.10.9.1 Cpu

1 vCPU

##### 1.1.10.9.2 Memory

2GB

#### 1.1.10.10.0 Configuration

##### 1.1.10.10.1 Settlement Cycle

Weekly

##### 1.1.10.10.2 Default Commission Rate

15.0

#### 1.1.10.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

#### 1.1.10.12.0 Responsible Features

- REQ-1-020
- REQ-1-033
- REQ-1-034
- REQ-1-054
- REQ-1-057
- REQ-1-058
- REQ-1-082
- REQ-1-083
- REQ-1-084
- REQ-1-085

#### 1.1.10.13.0 Security

##### 1.1.10.13.1 Requires Authentication

✅ Yes

##### 1.1.10.13.2 Requires Authorization

✅ Yes

##### 1.1.10.13.3 Allowed Roles

- CUSTOMER
- ADMINISTRATOR

### 1.1.11.0.0 Ratings & Communication Service

#### 1.1.11.1.0 Id

ratings-communication-service-106

#### 1.1.11.2.0 Name

Ratings & Communication Service

#### 1.1.11.3.0 Description

Handles non-transactional user interactions such as ratings, reviews, in-app chat for active orders, and the helpdesk/support ticket system.

#### 1.1.11.4.0 Type

🔹 Service

#### 1.1.11.5.0 Dependencies

- persistence-layer-201
- messaging-broker-202

#### 1.1.11.6.0 Properties

| Property | Value |
|----------|-------|
| Bounded Context | User Engagement |

#### 1.1.11.7.0 Interfaces

- IRating
- IChat
- ISupportTicket

#### 1.1.11.8.0 Technology

Node.js v18.18+ with NestJS

#### 1.1.11.9.0 Resources

##### 1.1.11.9.1 Cpu

1 vCPU

##### 1.1.11.9.2 Memory

2GB

#### 1.1.11.10.0 Configuration

##### 1.1.11.10.1 Chat History Read Only Delay

0s after order completion

#### 1.1.11.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

#### 1.1.11.12.0 Responsible Features

- REQ-1-015
- REQ-1-062
- REQ-1-063
- REQ-1-064
- REQ-1-081

#### 1.1.11.13.0 Security

##### 1.1.11.13.1 Requires Authentication

✅ Yes

##### 1.1.11.13.2 Requires Authorization

✅ Yes

##### 1.1.11.13.3 Allowed Roles

- CUSTOMER
- VENDOR
- RIDER
- ADMINISTRATOR

### 1.1.12.0.0 Notifications Service

#### 1.1.12.1.0 Id

notifications-service-107

#### 1.1.12.2.0 Name

Notifications Service

#### 1.1.12.3.0 Description

A dedicated service responsible for sending all user-facing notifications, including push notifications (FCM) and SMS (SNS), by consuming events from other services.

#### 1.1.12.4.0 Type

🔹 Service

#### 1.1.12.5.0 Dependencies

- messaging-broker-202
- fcm-api-303
- aws-sns-api-304

#### 1.1.12.6.0 Properties

| Property | Value |
|----------|-------|
| Bounded Context | Notifications |

#### 1.1.12.7.0 Interfaces

- INotificationSender

#### 1.1.12.8.0 Technology

Node.js v18.18+ with NestJS

#### 1.1.12.9.0 Resources

##### 1.1.12.9.1 Cpu

0.5 vCPU

##### 1.1.12.9.2 Memory

1GB

#### 1.1.12.10.0 Configuration

*No data available*

#### 1.1.12.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 60 |
| Timeout | 10 |

#### 1.1.12.12.0 Responsible Features

- REQ-1-026
- REQ-1-046
- REQ-1-073
- REQ-1-090

#### 1.1.12.13.0 Security

##### 1.1.12.13.1 Requires Authentication

❌ No

##### 1.1.12.13.2 Requires Authorization

❌ No

##### 1.1.12.13.3 Allowed Roles

*No items available*

### 1.1.13.0.0 Persistence Layer

#### 1.1.13.1.0 Id

persistence-layer-201

#### 1.1.13.2.0 Name

Persistence Layer

#### 1.1.13.3.0 Description

The foundational data storage layer, comprising a relational database for transactional data, a distributed cache for performance, and object storage for files.

#### 1.1.13.4.0 Type

🔹 Infrastructure

#### 1.1.13.5.0 Dependencies

*No items available*

#### 1.1.13.6.0 Properties

*No data available*

#### 1.1.13.7.0 Interfaces

*No items available*

#### 1.1.13.8.0 Technology

Amazon RDS for PostgreSQL, Amazon ElastiCache (Redis), Amazon S3

#### 1.1.13.9.0 Resources

##### 1.1.13.9.1 Storage

Scalable

#### 1.1.13.10.0 Configuration

##### 1.1.13.10.1 Multi Az

✅ Yes

##### 1.1.13.10.2 Backup Retention

30 days

#### 1.1.13.11.0 Health Check

*No data available*

#### 1.1.13.12.0 Responsible Features

- REQ-1-094
- REQ-1-097

#### 1.1.13.13.0 Security

##### 1.1.13.13.1 Requires Authentication

❌ No

##### 1.1.13.13.2 Requires Authorization

❌ No

### 1.1.14.0.0 Messaging Broker

#### 1.1.14.1.0 Id

messaging-broker-202

#### 1.1.14.2.0 Name

Messaging Broker

#### 1.1.14.3.0 Description

The asynchronous communication backbone that enables the event-driven architecture, decoupling services and providing resilience.

#### 1.1.14.4.0 Type

🔹 Infrastructure

#### 1.1.14.5.0 Dependencies

*No items available*

#### 1.1.14.6.0 Properties

*No data available*

#### 1.1.14.7.0 Interfaces

*No items available*

#### 1.1.14.8.0 Technology

AWS SNS, AWS SQS

#### 1.1.14.9.0 Resources

##### 1.1.14.9.1 Throughput

Scalable

#### 1.1.14.10.0 Configuration

##### 1.1.14.10.1 Dead Letter Queues

Enabled for all consumer queues

#### 1.1.14.11.0 Health Check

*No data available*

#### 1.1.14.12.0 Responsible Features

- REQ-1-105

#### 1.1.14.13.0 Security

##### 1.1.14.13.1 Requires Authentication

❌ No

##### 1.1.14.13.2 Requires Authorization

❌ No

### 1.1.15.0.0 Observability Stack

#### 1.1.15.1.0 Id

observability-stack-203

#### 1.1.15.2.0 Name

Observability Stack

#### 1.1.15.3.0 Description

A collection of tools for monitoring, logging, tracing, and alerting, providing deep insights into system health and performance.

#### 1.1.15.4.0 Type

🔹 Infrastructure

#### 1.1.15.5.0 Dependencies

*No items available*

#### 1.1.15.6.0 Properties

*No data available*

#### 1.1.15.7.0 Interfaces

*No items available*

#### 1.1.15.8.0 Technology

Prometheus, Grafana, AWS CloudWatch, OpenTelemetry

#### 1.1.15.9.0 Resources

*No data available*

#### 1.1.15.10.0 Configuration

##### 1.1.15.10.1 Log Format

JSON

##### 1.1.15.10.2 Alert Manager Routing

Configured for on-call PagerDuty

#### 1.1.15.11.0 Health Check

*No data available*

#### 1.1.15.12.0 Responsible Features

- REQ-1-108
- REQ-1-109
- REQ-1-110

#### 1.1.15.13.0 Security

##### 1.1.15.13.1 Requires Authentication

✅ Yes

##### 1.1.15.13.2 Requires Authorization

✅ Yes

### 1.1.16.0.0 Razorpay API

#### 1.1.16.1.0 Id

razorpay-api-301

#### 1.1.16.2.0 Name

Razorpay API

#### 1.1.16.3.0 Description

External third-party integration for processing online payments and automating bulk payouts.

#### 1.1.16.4.0 Type

🔹 External

#### 1.1.16.5.0 Dependencies

*No items available*

#### 1.1.16.6.0 Properties

| Property | Value |
|----------|-------|
| Provider | Razorpay |

#### 1.1.16.7.0 Interfaces

- IPaymentGateway
- IPayoutGateway

#### 1.1.16.8.0 Technology

REST API

#### 1.1.16.9.0 Resources

*No data available*

#### 1.1.16.10.0 Configuration

*No data available*

#### 1.1.16.11.0 Health Check

*No data available*

#### 1.1.16.12.0 Responsible Features

- REQ-1-085
- REQ-1-090

#### 1.1.16.13.0 Security

##### 1.1.16.13.1 Requires Authentication

✅ Yes

### 1.1.17.0.0 Mapbox API

#### 1.1.17.1.0 Id

mapbox-api-302

#### 1.1.17.2.0 Name

Mapbox API

#### 1.1.17.3.0 Description

External third-party integration for all mapping services, including geocoding, routing, and rendering map tiles.

#### 1.1.17.4.0 Type

🔹 External

#### 1.1.17.5.0 Dependencies

*No items available*

#### 1.1.17.6.0 Properties

| Property | Value |
|----------|-------|
| Provider | Mapbox |

#### 1.1.17.7.0 Interfaces

- IMappingService

#### 1.1.17.8.0 Technology

REST API

#### 1.1.17.9.0 Resources

*No data available*

#### 1.1.17.10.0 Configuration

*No data available*

#### 1.1.17.11.0 Health Check

*No data available*

#### 1.1.17.12.0 Responsible Features

- REQ-1-090

#### 1.1.17.13.0 Security

##### 1.1.17.13.1 Requires Authentication

✅ Yes

### 1.1.18.0.0 Firebase Cloud Messaging (FCM) API

#### 1.1.18.1.0 Id

fcm-api-303

#### 1.1.18.2.0 Name

Firebase Cloud Messaging (FCM) API

#### 1.1.18.3.0 Description

External third-party integration for sending push notifications to mobile clients.

#### 1.1.18.4.0 Type

🔹 External

#### 1.1.18.5.0 Dependencies

*No items available*

#### 1.1.18.6.0 Properties

| Property | Value |
|----------|-------|
| Provider | Google Firebase |

#### 1.1.18.7.0 Interfaces

- IPushNotification

#### 1.1.18.8.0 Technology

REST API

#### 1.1.18.9.0 Resources

*No data available*

#### 1.1.18.10.0 Configuration

*No data available*

#### 1.1.18.11.0 Health Check

*No data available*

#### 1.1.18.12.0 Responsible Features

- REQ-1-090

#### 1.1.18.13.0 Security

##### 1.1.18.13.1 Requires Authentication

✅ Yes

### 1.1.19.0.0 AWS SNS API

#### 1.1.19.1.0 Id

aws-sns-api-304

#### 1.1.19.2.0 Name

AWS SNS API

#### 1.1.19.3.0 Description

External third-party integration for sending transactional SMS messages.

#### 1.1.19.4.0 Type

🔹 External

#### 1.1.19.5.0 Dependencies

*No items available*

#### 1.1.19.6.0 Properties

| Property | Value |
|----------|-------|
| Provider | AWS |

#### 1.1.19.7.0 Interfaces

- ISms

#### 1.1.19.8.0 Technology

AWS SDK

#### 1.1.19.9.0 Resources

*No data available*

#### 1.1.19.10.0 Configuration

*No data available*

#### 1.1.19.11.0 Health Check

*No data available*

#### 1.1.19.12.0 Responsible Features

- REQ-1-090

#### 1.1.19.13.0 Security

##### 1.1.19.13.1 Requires Authentication

✅ Yes

## 1.2.0.0.0 Configuration

| Property | Value |
|----------|-------|
| Environment | production |
| Logging Level | INFO |
| Deployment Strategy | Blue/Green via CI/CD |
| Orchestrator | Amazon EKS |

# 2.0.0.0.0 Component Relations

## 2.1.0.0.0 Architecture

### 2.1.1.0.0 Components

#### 2.1.1.1.0 Customer Mobile Application

##### 2.1.1.1.1 Id

customer-mobile-app-001

##### 2.1.1.1.2 Name

Customer Mobile Application

##### 2.1.1.1.3 Description

The primary mobile interface for Customers to discover vendors, place orders, track deliveries, and manage their profile.

##### 2.1.1.1.4 Type

🔹 ClientApplication

##### 2.1.1.1.5 Dependencies

- api-gateway-001

##### 2.1.1.1.6 Properties

| Property | Value |
|----------|-------|
| Platform | iOS & Android |

##### 2.1.1.1.7 Interfaces

- User Interface

##### 2.1.1.1.8 Technology

React Native v0.73+

##### 2.1.1.1.9 Resources

###### 2.1.1.1.9.1 Cpu

N/A (Client Device)

###### 2.1.1.1.9.2 Memory

N/A (Client Device)

##### 2.1.1.1.10.0 Configuration

*No data available*

##### 2.1.1.1.11.0 Health Check

*No data available*

##### 2.1.1.1.12.0 Responsible Features

- REQ-1-002
- REQ-1-009
- REQ-1-047
- REQ-1-048
- REQ-1-052
- REQ-1-059

##### 2.1.1.1.13.0 Security

###### 2.1.1.1.13.1 Requires Authentication

✅ Yes

###### 2.1.1.1.13.2 Requires Authorization

❌ No

#### 2.1.1.2.0.0 Rider Mobile Application

##### 2.1.1.2.1.0 Id

rider-mobile-app-002

##### 2.1.1.2.2.0 Name

Rider Mobile Application

##### 2.1.1.2.3.0 Description

The mobile application for Delivery Riders to manage their availability, accept tasks, navigate, update delivery status, and track earnings.

##### 2.1.1.2.4.0 Type

🔹 ClientApplication

##### 2.1.1.2.5.0 Dependencies

- api-gateway-001

##### 2.1.1.2.6.0 Properties

| Property | Value |
|----------|-------|
| Platform | iOS & Android |

##### 2.1.1.2.7.0 Interfaces

- User Interface

##### 2.1.1.2.8.0 Technology

React Native v0.73+

##### 2.1.1.2.9.0 Resources

###### 2.1.1.2.9.1 Cpu

N/A (Client Device)

###### 2.1.1.2.9.2 Memory

N/A (Client Device)

##### 2.1.1.2.10.0 Configuration

*No data available*

##### 2.1.1.2.11.0 Health Check

*No data available*

##### 2.1.1.2.12.0 Responsible Features

- REQ-1-002
- REQ-1-011
- REQ-1-071
- REQ-1-072
- REQ-1-076

##### 2.1.1.2.13.0 Security

###### 2.1.1.2.13.1 Requires Authentication

✅ Yes

###### 2.1.1.2.13.2 Requires Authorization

❌ No

#### 2.1.1.3.0.0 Vendor Web Dashboard

##### 2.1.1.3.1.0 Id

vendor-web-dashboard-003

##### 2.1.1.3.2.0 Name

Vendor Web Dashboard

##### 2.1.1.3.3.0 Description

A web-based dashboard for Vendors to manage their store profile, product catalog, inventory, incoming orders, and view financial reports.

##### 2.1.1.3.4.0 Type

🔹 ClientApplication

##### 2.1.1.3.5.0 Dependencies

- api-gateway-001

##### 2.1.1.3.6.0 Properties

| Property | Value |
|----------|-------|
| Platform | Web Browser |

##### 2.1.1.3.7.0 Interfaces

- User Interface

##### 2.1.1.3.8.0 Technology

React.js v18.2+ with Vite

##### 2.1.1.3.9.0 Resources

###### 2.1.1.3.9.1 Cpu

N/A (Client Device)

###### 2.1.1.3.9.2 Memory

N/A (Client Device)

##### 2.1.1.3.10.0 Configuration

*No data available*

##### 2.1.1.3.11.0 Health Check

*No data available*

##### 2.1.1.3.12.0 Responsible Features

- REQ-1-002
- REQ-1-010
- REQ-1-006
- REQ-1-065
- REQ-1-068
- REQ-1-070

##### 2.1.1.3.13.0 Security

###### 2.1.1.3.13.1 Requires Authentication

✅ Yes

###### 2.1.1.3.13.2 Requires Authorization

❌ No

#### 2.1.1.4.0.0 Administrator Web Dashboard

##### 2.1.1.4.1.0 Id

admin-web-dashboard-004

##### 2.1.1.4.2.0 Name

Administrator Web Dashboard

##### 2.1.1.4.3.0 Description

A comprehensive web-based dashboard for platform Administrators to manage users, operational zones, system configurations, and support tickets.

##### 2.1.1.4.4.0 Type

🔹 ClientApplication

##### 2.1.1.4.5.0 Dependencies

- api-gateway-001

##### 2.1.1.4.6.0 Properties

| Property | Value |
|----------|-------|
| Platform | Web Browser |

##### 2.1.1.4.7.0 Interfaces

- User Interface

##### 2.1.1.4.8.0 Technology

React.js v18.2+ with Vite

##### 2.1.1.4.9.0 Resources

###### 2.1.1.4.9.1 Cpu

N/A (Client Device)

###### 2.1.1.4.9.2 Memory

N/A (Client Device)

##### 2.1.1.4.10.0 Configuration

*No data available*

##### 2.1.1.4.11.0 Health Check

*No data available*

##### 2.1.1.4.12.0 Responsible Features

- REQ-1-002
- REQ-1-012
- REQ-1-080
- REQ-1-014
- REQ-1-107

##### 2.1.1.4.13.0 Security

###### 2.1.1.4.13.1 Requires Authentication

✅ Yes

###### 2.1.1.4.13.2 Requires Authorization

✅ Yes

###### 2.1.1.4.13.3 Allowed Roles

- ADMINISTRATOR

#### 2.1.1.5.0.0 API Gateway

##### 2.1.1.5.1.0 Id

api-gateway-001

##### 2.1.1.5.2.0 Name

API Gateway

##### 2.1.1.5.3.0 Description

The single, managed entry point for all client applications. It handles request routing, authentication, rate limiting, and serves as a facade for the backend microservices.

##### 2.1.1.5.4.0 Type

🔹 APIGateway

##### 2.1.1.5.5.0 Dependencies

- identity-service-101
- vendor-catalog-service-102
- order-management-service-103
- rider-logistics-service-104
- payments-settlements-service-105
- ratings-communication-service-106
- notifications-service-107

##### 2.1.1.5.6.0 Properties

| Property | Value |
|----------|-------|
| Versioning | URL Path (e.g., /api/v1/) |

##### 2.1.1.5.7.0 Interfaces

- REST API
- WebSocket API

##### 2.1.1.5.8.0 Technology

Amazon API Gateway

##### 2.1.1.5.9.0 Resources

###### 2.1.1.5.9.1 Cpu

N/A (Managed Service)

###### 2.1.1.5.9.2 Memory

N/A (Managed Service)

##### 2.1.1.5.10.0 Configuration

###### 2.1.1.5.10.1 Request Throttling

1000 rps

###### 2.1.1.5.10.2 Burst Limit

2000

##### 2.1.1.5.11.0 Health Check

*No data available*

##### 2.1.1.5.12.0 Responsible Features

- REQ-1-106
- REQ-1-092
- REQ-1-110

##### 2.1.1.5.13.0 Security

###### 2.1.1.5.13.1 Requires Authentication

✅ Yes

###### 2.1.1.5.13.2 Requires Authorization

✅ Yes

#### 2.1.1.6.0.0 Identity & Access Service

##### 2.1.1.6.1.0 Id

identity-service-101

##### 2.1.1.6.2.0 Name

Identity & Access Service

##### 2.1.1.6.3.0 Description

Manages user lifecycle, profiles (Customer, Vendor, Rider), authentication via AWS Cognito, Role-Based Access Control (RBAC), and user consent management (DPDP).

##### 2.1.1.6.4.0 Type

🔹 Microservice

##### 2.1.1.6.5.0 Dependencies

- message-broker-201
- aws-cognito-301
- postgres-db-302

##### 2.1.1.6.6.0 Properties

| Property | Value |
|----------|-------|
| Bounded Context | Identity & Access Management |

##### 2.1.1.6.7.0 Interfaces

- REST API (Internal)
- Event Publisher (e.g., UserRegistered, ProfileUpdated)

##### 2.1.1.6.8.0 Technology

Node.js v18.18+ with NestJS

##### 2.1.1.6.9.0 Resources

###### 2.1.1.6.9.1 Cpu

1 vCPU

###### 2.1.1.6.9.2 Memory

2GB

##### 2.1.1.6.10.0 Configuration

###### 2.1.1.6.10.1 Jwt Issuer

AWS Cognito

###### 2.1.1.6.10.2 Otp Validity

5 minutes

##### 2.1.1.6.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

##### 2.1.1.6.12.0 Responsible Features

- REQ-1-035
- REQ-1-036
- REQ-1-037
- REQ-1-039
- REQ-1-040
- REQ-1-096
- REQ-1-021
- REQ-1-023

##### 2.1.1.6.13.0 Security

###### 2.1.1.6.13.1 Requires Authentication

✅ Yes

###### 2.1.1.6.13.2 Requires Authorization

✅ Yes

#### 2.1.1.7.0.0 Vendor & Catalog Service

##### 2.1.1.7.1.0 Id

vendor-catalog-service-102

##### 2.1.1.7.2.0 Name

Vendor & Catalog Service

##### 2.1.1.7.3.0 Description

Manages vendor profiles, business hours, license information, product catalogs, and real-time inventory levels.

##### 2.1.1.7.4.0 Type

🔹 Microservice

##### 2.1.1.7.5.0 Dependencies

- message-broker-201
- postgres-db-302
- redis-cache-303
- s3-storage-304

##### 2.1.1.7.6.0 Properties

| Property | Value |
|----------|-------|
| Bounded Context | Vendor Management |

##### 2.1.1.7.7.0 Interfaces

- REST API (Internal)
- Event Publisher (e.g., InventoryUpdated, VendorStatusChanged)

##### 2.1.1.7.8.0 Technology

Node.js v18.18+ with NestJS

##### 2.1.1.7.9.0 Resources

###### 2.1.1.7.9.1 Cpu

1 vCPU

###### 2.1.1.7.9.2 Memory

2GB

##### 2.1.1.7.10.0 Configuration

###### 2.1.1.7.10.1 Max Image Size

5MB

###### 2.1.1.7.10.2 Csv Import Batch Size

1000

##### 2.1.1.7.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

##### 2.1.1.7.12.0 Responsible Features

- REQ-1-006
- REQ-1-010
- REQ-1-025
- REQ-1-044
- REQ-1-050
- REQ-1-068
- REQ-1-069
- REQ-1-070

##### 2.1.1.7.13.0 Security

###### 2.1.1.7.13.1 Requires Authentication

✅ Yes

###### 2.1.1.7.13.2 Requires Authorization

✅ Yes

#### 2.1.1.8.0.0 Order Management Service

##### 2.1.1.8.1.0 Id

order-management-service-103

##### 2.1.1.8.2.0 Name

Order Management Service

##### 2.1.1.8.3.0 Description

Handles the core order lifecycle, from cart management and order placement to state transitions. Orchestrates the order creation Saga.

##### 2.1.1.8.4.0 Type

🔹 Microservice

##### 2.1.1.8.5.0 Dependencies

- message-broker-201
- postgres-db-302

##### 2.1.1.8.6.0 Properties

| Property | Value |
|----------|-------|
| Bounded Context | Order Fulfillment |

##### 2.1.1.8.7.0 Interfaces

- REST API (Internal)
- Event Publisher (e.g., OrderPlaced, OrderCancelled)
- Event Consumer (e.g., PaymentConfirmed, RiderAssigned)

##### 2.1.1.8.8.0 Technology

Node.js v18.18+ with NestJS

##### 2.1.1.8.9.0 Resources

###### 2.1.1.8.9.1 Cpu

2 vCPU

###### 2.1.1.8.9.2 Memory

4GB

##### 2.1.1.8.10.0 Configuration

###### 2.1.1.8.10.1 Cancellation Window Seconds

60

###### 2.1.1.8.10.2 Vendor Acceptance Timeout Minutes

5

##### 2.1.1.8.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

##### 2.1.1.8.12.0 Responsible Features

- REQ-1-077
- REQ-1-105
- REQ-1-052
- REQ-1-056
- REQ-1-031
- REQ-1-032
- REQ-1-065

##### 2.1.1.8.13.0 Security

###### 2.1.1.8.13.1 Requires Authentication

✅ Yes

###### 2.1.1.8.13.2 Requires Authorization

✅ Yes

#### 2.1.1.9.0.0 Rider Logistics Service

##### 2.1.1.9.1.0 Id

rider-logistics-service-104

##### 2.1.1.9.2.0 Name

Rider Logistics Service

##### 2.1.1.9.3.0 Description

Manages rider availability, automated rider allocation, route optimization, live location tracking, and proof of delivery.

##### 2.1.1.9.4.0 Type

🔹 Microservice

##### 2.1.1.9.5.0 Dependencies

- message-broker-201
- postgres-db-302
- redis-cache-303
- s3-storage-304
- mapbox-integration-402

##### 2.1.1.9.6.0 Properties

| Property | Value |
|----------|-------|
| Bounded Context | Delivery Logistics |

##### 2.1.1.9.7.0 Interfaces

- REST API (Internal)
- WebSocket API (for live tracking)
- Event Publisher (e.g., RiderAssigned, DeliveryStatusUpdated)
- Event Consumer (e.g., OrderReadyForPickup)

##### 2.1.1.9.8.0 Technology

Node.js v18.18+ with NestJS

##### 2.1.1.9.9.0 Resources

###### 2.1.1.9.9.1 Cpu

2 vCPU

###### 2.1.1.9.9.2 Memory

4GB

##### 2.1.1.9.10.0 Configuration

###### 2.1.1.9.10.1 Max Allocation Attempts

3

###### 2.1.1.9.10.2 Location Update Interval Seconds

10

##### 2.1.1.9.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

##### 2.1.1.9.12.0 Responsible Features

- REQ-1-078
- REQ-1-079
- REQ-1-059
- REQ-1-080
- REQ-1-074
- REQ-1-075
- REQ-1-004

##### 2.1.1.9.13.0 Security

###### 2.1.1.9.13.1 Requires Authentication

✅ Yes

###### 2.1.1.9.13.2 Requires Authorization

✅ Yes

#### 2.1.1.10.0.0 Payments & Settlements Service

##### 2.1.1.10.1.0 Id

payments-settlements-service-105

##### 2.1.1.10.2.0 Name

Payments & Settlements Service

##### 2.1.1.10.3.0 Description

Handles all monetary transactions, including payment processing, refunds, commission calculation, and automated payouts to vendors and riders.

##### 2.1.1.10.4.0 Type

🔹 Microservice

##### 2.1.1.10.5.0 Dependencies

- message-broker-201
- postgres-db-302
- razorpay-integration-401

##### 2.1.1.10.6.0 Properties

| Property | Value |
|----------|-------|
| Bounded Context | Financial Management |

##### 2.1.1.10.7.0 Interfaces

- REST API (Internal)
- Event Publisher (e.g., PaymentConfirmed, PayoutProcessed)
- Event Consumer (e.g., OrderCompleted, RefundRequested)

##### 2.1.1.10.8.0 Technology

Node.js v18.18+ with NestJS

##### 2.1.1.10.9.0 Resources

###### 2.1.1.10.9.1 Cpu

1 vCPU

###### 2.1.1.10.9.2 Memory

2GB

##### 2.1.1.10.10.0 Configuration

###### 2.1.1.10.10.1 Default Commission Rate

15.0

###### 2.1.1.10.10.2 Payout Schedule

WEEKLY_T_PLUS_2

##### 2.1.1.10.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

##### 2.1.1.10.12.0 Responsible Features

- REQ-1-082
- REQ-1-083
- REQ-1-084
- REQ-1-085
- REQ-1-054
- REQ-1-057
- REQ-1-033

##### 2.1.1.10.13.0 Security

###### 2.1.1.10.13.1 Requires Authentication

✅ Yes

###### 2.1.1.10.13.2 Requires Authorization

✅ Yes

#### 2.1.1.11.0.0 Ratings & Communication Service

##### 2.1.1.11.1.0 Id

ratings-communication-service-106

##### 2.1.1.11.2.0 Name

Ratings & Communication Service

##### 2.1.1.11.3.0 Description

Manages the ratings and review system, in-app chat for active orders, and the helpdesk support ticket module.

##### 2.1.1.11.4.0 Type

🔹 Microservice

##### 2.1.1.11.5.0 Dependencies

- message-broker-201
- postgres-db-302

##### 2.1.1.11.6.0 Properties

| Property | Value |
|----------|-------|
| Bounded Context | User Interaction |

##### 2.1.1.11.7.0 Interfaces

- REST API (Internal)
- WebSocket API (for chat)
- Event Consumer (e.g., OrderDelivered)

##### 2.1.1.11.8.0 Technology

Node.js v18.18+ with NestJS

##### 2.1.1.11.9.0 Resources

###### 2.1.1.11.9.1 Cpu

1 vCPU

###### 2.1.1.11.9.2 Memory

2GB

##### 2.1.1.11.10.0 Configuration

###### 2.1.1.11.10.1 Chat History Retention Days

90

##### 2.1.1.11.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 30 |
| Timeout | 5 |

##### 2.1.1.11.12.0 Responsible Features

- REQ-1-062
- REQ-1-063
- REQ-1-064
- REQ-1-081
- REQ-1-015

##### 2.1.1.11.13.0 Security

###### 2.1.1.11.13.1 Requires Authentication

✅ Yes

###### 2.1.1.11.13.2 Requires Authorization

✅ Yes

#### 2.1.1.12.0.0 Notifications Service

##### 2.1.1.12.1.0 Id

notifications-service-107

##### 2.1.1.12.2.0 Name

Notifications Service

##### 2.1.1.12.3.0 Description

A centralized service responsible for sending all user-facing notifications, including push notifications via FCM and SMS via AWS SNS.

##### 2.1.1.12.4.0 Type

🔹 Microservice

##### 2.1.1.12.5.0 Dependencies

- message-broker-201
- fcm-integration-403
- sns-integration-404

##### 2.1.1.12.6.0 Properties

| Property | Value |
|----------|-------|
| Bounded Context | Notifications |

##### 2.1.1.12.7.0 Interfaces

- Event Consumer (e.g., OrderStatusUpdated, LicenseExpiringSoon, PayoutFailed)

##### 2.1.1.12.8.0 Technology

Node.js v18.18+ with NestJS

##### 2.1.1.12.9.0 Resources

###### 2.1.1.12.9.1 Cpu

0.5 vCPU

###### 2.1.1.12.9.2 Memory

1GB

##### 2.1.1.12.10.0 Configuration

###### 2.1.1.12.10.1 Sms Sender Id

PLATFRM

##### 2.1.1.12.11.0 Health Check

| Property | Value |
|----------|-------|
| Path | /health |
| Interval | 60 |
| Timeout | 10 |

##### 2.1.1.12.12.0 Responsible Features

- REQ-1-008
- REQ-1-026
- REQ-1-073
- REQ-1-046

##### 2.1.1.12.13.0 Security

###### 2.1.1.12.13.1 Requires Authentication

❌ No

###### 2.1.1.12.13.2 Requires Authorization

❌ No

#### 2.1.1.13.0.0 Message Broker

##### 2.1.1.13.1.0 Id

message-broker-201

##### 2.1.1.13.2.0 Name

Message Broker

##### 2.1.1.13.3.0 Description

The asynchronous communication backbone for the microservices architecture, enabling event-driven workflows and decoupling services.

##### 2.1.1.13.4.0 Type

🔹 Messaging

##### 2.1.1.13.5.0 Dependencies

*No items available*

##### 2.1.1.13.6.0 Properties

| Property | Value |
|----------|-------|
| Pattern | Pub/Sub |

##### 2.1.1.13.7.0 Interfaces

- SNS Topics
- SQS Queues

##### 2.1.1.13.8.0 Technology

AWS SNS, AWS SQS

##### 2.1.1.13.9.0 Resources

###### 2.1.1.13.9.1 Cpu

N/A (Managed Service)

###### 2.1.1.13.9.2 Memory

N/A (Managed Service)

##### 2.1.1.13.10.0 Configuration

###### 2.1.1.13.10.1 Message Retention Period

4 days

##### 2.1.1.13.11.0 Health Check

*No data available*

##### 2.1.1.13.12.0 Responsible Features

- REQ-1-105

##### 2.1.1.13.13.0 Security

*No data available*

#### 2.1.1.14.0.0 Service Mesh

##### 2.1.1.14.1.0 Id

service-mesh-202

##### 2.1.1.14.2.0 Name

Service Mesh

##### 2.1.1.14.3.0 Description

Infrastructure layer for managing and securing inter-service communication. Implements resilience patterns like retries and circuit breakers.

##### 2.1.1.14.4.0 Type

🔹 ServiceMesh

##### 2.1.1.14.5.0 Dependencies

*No items available*

##### 2.1.1.14.6.0 Properties

*No data available*

##### 2.1.1.14.7.0 Interfaces

*No items available*

##### 2.1.1.14.8.0 Technology

AWS App Mesh

##### 2.1.1.14.9.0 Resources

###### 2.1.1.14.9.1 Cpu

N/A (Sidecar Proxy)

###### 2.1.1.14.9.2 Memory

N/A (Sidecar Proxy)

##### 2.1.1.14.10.0 Configuration

###### 2.1.1.14.10.1 Retry Policy

3 attempts

###### 2.1.1.14.10.2 Circuit Breaker Threshold

5 consecutive failures

##### 2.1.1.14.11.0 Health Check

*No data available*

##### 2.1.1.14.12.0 Responsible Features

- REQ-1-106
- REQ-1-028

##### 2.1.1.14.13.0 Security

###### 2.1.1.14.13.1 Protocol

mTLS

#### 2.1.1.15.0.0 Observability Stack

##### 2.1.1.15.1.0 Id

observability-stack-203

##### 2.1.1.15.2.0 Name

Observability Stack

##### 2.1.1.15.3.0 Description

A suite of tools for centralized logging, metrics collection, monitoring dashboards, distributed tracing, and automated alerting.

##### 2.1.1.15.4.0 Type

🔹 Observability

##### 2.1.1.15.5.0 Dependencies

*No items available*

##### 2.1.1.15.6.0 Properties

*No data available*

##### 2.1.1.15.7.0 Interfaces

*No items available*

##### 2.1.1.15.8.0 Technology

Prometheus, Grafana, AWS CloudWatch Logs, OpenTelemetry

##### 2.1.1.15.9.0 Resources

###### 2.1.1.15.9.1 Cpu

N/A (Managed/Hosted)

###### 2.1.1.15.9.2 Memory

N/A (Managed/Hosted)

##### 2.1.1.15.10.0 Configuration

###### 2.1.1.15.10.1 Log Retention

90 days active, 1 year archive

###### 2.1.1.15.10.2 Metrics Scrape Interval

30s

##### 2.1.1.15.11.0 Health Check

*No data available*

##### 2.1.1.15.12.0 Responsible Features

- REQ-1-108
- REQ-1-109
- REQ-1-110

##### 2.1.1.15.13.0 Security

*No data available*

### 2.1.2.0.0.0 Configuration

| Property | Value |
|----------|-------|
| Environment | production |
| Logging Level | INFO |
| Database Url | jdbc:postgresql://rds.ap-south-1.amazonaws.com/pla... |
| Cache Ttl | 600 |
| Deployment Region | ap-south-1 |

