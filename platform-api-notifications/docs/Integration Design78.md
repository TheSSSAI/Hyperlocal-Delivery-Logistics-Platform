# 1 Integration Specifications

## 1.1 Extraction Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-api-notifications |
| Extraction Timestamp | 2024-05-24T10:00:00Z |
| Mapping Validation Score | 100% |
| Context Completeness Score | 95% |
| Implementation Readiness Level | High |

## 1.2 Relevant Requirements

### 1.2.1 Requirement Id

#### 1.2.1.1 Requirement Id

REQ-1-090

#### 1.2.1.2 Requirement Text

The system shall integrate with the following specific third-party services: Razorpay for payment processing (using server-side SDKs), Mapbox for all mapping and location services, Firebase Cloud Messaging (FCM) for mobile push notifications, and AWS Simple Notification Service (SNS) for transactional SMS messages.

#### 1.2.1.3 Validation Criteria

- Verify that push notifications are routed through FCM.
- Verify that OTP SMS messages are sent via AWS SNS.

#### 1.2.1.4 Implementation Implications

- The service must implement the Firebase Admin SDK to send push notifications.
- The service must implement the AWS SDK for JavaScript (v3) to send SMS messages via SNS.
- Secure management of API keys for both FCM and AWS SNS is required, using AWS Secrets Manager.

#### 1.2.1.5 Extraction Reasoning

This requirement is the primary technical directive for the Notifications service, explicitly mandating the technologies (FCM and SNS) that this repository must implement.

### 1.2.2.0 Requirement Id

#### 1.2.2.1 Requirement Id

REQ-1-073

#### 1.2.2.2 Requirement Text

Each time a rider updates the delivery status (e.g., Picked Up, Arrived at Destination), the system shall automatically send a real-time push notification to the customer, informing them of the new status.

#### 1.2.2.3 Validation Criteria

- As a rider, tap the 'Picked Up' button.
- As the customer, verify a push notification is received with a message like 'Your order has been picked up'.

#### 1.2.2.4 Implementation Implications

- The service must subscribe to order lifecycle events published by the Order Management service.
- It must contain logic to map an event (e.g., 'OrderPickedUp') to a specific notification template.
- It needs to fetch the customer's device token to target the push notification.

#### 1.2.2.5 Extraction Reasoning

This is a core functional requirement that this service fulfills. It describes a specific business event that this service must listen for and act upon by sending a push notification.

### 1.2.3.0 Requirement Id

#### 1.2.3.1 Requirement Id

REQ-1-026

#### 1.2.3.2 Requirement Text

The system shall implement a scheduled job that automatically sends reminder notifications to vendors regarding their upcoming license expiry. These notifications must be sent at intervals of 30, 15, and 7 days before the stored expiry date.

#### 1.2.3.3 Validation Criteria

- Create a vendor with a license expiring in 31 days.
- Advance the system date by one day and verify that a 30-day reminder notification is sent.

#### 1.2.3.4 Implementation Implications

- The service must consume an event (e.g., 'VendorLicenseExpiryReminderDue') published by another service (likely Vendor & Catalog Service).
- It must have access to notification templates for license expiry reminders.
- It must be able to send notifications (Push/SMS/Email) to vendors.

#### 1.2.3.5 Extraction Reasoning

This requirement mandates the sending of notifications based on a business event. While another service determines *when* to send the reminder, this Notifications service is responsible for the actual *sending* of the message.

### 1.2.4.0 Requirement Id

#### 1.2.4.1 Requirement Id

REQ-1-046

#### 1.2.4.2 Requirement Text

The system shall automatically trigger a notification (e.g., SMS or email) to a user whenever a change is made to their sensitive Personally Identifiable Information (PII) or financial information. This includes changes to their email, phone number, or bank account details.

#### 1.2.4.3 Validation Criteria

- Change the email address for a customer account and verify a notification is sent to the old and/or new email address.
- Change the bank account details for a rider account and verify an SMS notification is sent to the rider's registered mobile number.

#### 1.2.4.4 Implementation Implications

- The service must consume events like 'UserSensitiveDataChanged' from the Identity & Access service.
- It must be capable of sending SMS messages for security alerts.
- Templates for these security-critical messages must be managed within this service.

#### 1.2.4.5 Extraction Reasoning

This is a key security requirement whose implementation falls to this service. It consumes a business event from the system and executes the notification dispatch, which is its core responsibility.

## 1.3.0.0 Relevant Components

- {'component_name': 'Notifications Service', 'component_specification': 'A centralized, event-driven utility microservice responsible for dispatching all user-facing notifications. It consumes business events from various services, formats the appropriate message using templates, and sends it via the designated channel (FCM for push, AWS SNS for SMS). It acts as an anti-corruption layer for external notification providers.', 'implementation_requirements': ['Must be a NestJS application.', 'Must integrate the Firebase Admin SDK for push notifications.', 'Must integrate the AWS SDK for JavaScript for SMS via SNS.', 'Must be configured as a consumer for multiple SQS queues, each subscribed to relevant SNS topics from other microservices.', 'Must have an internal mechanism for managing and rendering notification message templates.', 'Requires a secure method to fetch user contact details (device tokens, phone numbers) from the Identity & Access service.'], 'architectural_context': 'Belongs to the Application Services Layer. Functions as a stateless, scalable worker that is terminal in most business workflows (i.e., it consumes events but does not publish new business events).', 'extraction_reasoning': "The repository's name, description, and technology stack directly map to this component definition from the architecture, making it the canonical implementation of the Notifications Service."}

## 1.4.0.0 Architectural Layers

- {'layer_name': 'Application Services Layer', 'layer_responsibilities': 'This layer contains the core business logic of the platform, implemented as a set of independently deployable microservices. This repository is one such service, dedicated to the cross-cutting concern of notifications.', 'layer_constraints': ['Services should be loosely coupled, primarily communicating asynchronously via an event bus.', 'Services must be stateless where possible to facilitate horizontal scaling.', 'Services must not contain logic belonging to another bounded context.'], 'implementation_patterns': ['Domain-Driven Design (DDD)', 'Event-Driven Architecture', 'Microservices'], 'extraction_reasoning': "The repository is explicitly mapped to the 'application-services' layer and its design as a decoupled, event-driven microservice perfectly aligns with the responsibilities and constraints of this layer."}

## 1.5.0.0 Dependency Interfaces

### 1.5.1.0 Interface Name

#### 1.5.1.1 Interface Name

IOrderLifecycleEvents

#### 1.5.1.2 Source Repository

platform-api-orders

#### 1.5.1.3 Method Contracts

##### 1.5.1.3.1 Method Name

###### 1.5.1.3.1.1 Method Name

OrderAcceptedEvent

###### 1.5.1.3.1.2 Method Signature

Event payload containing at least { orderId, customerId, vendorId, estimatedPreparationTime }

###### 1.5.1.3.1.3 Method Purpose

To trigger a notification to the customer that their order is being prepared.

###### 1.5.1.3.1.4 Integration Context

Consumed when a vendor accepts a new order.

##### 1.5.1.3.2.0 Method Name

###### 1.5.1.3.2.1 Method Name

OrderPickedUpEvent

###### 1.5.1.3.2.2 Method Signature

Event payload containing at least { orderId, customerId, riderId }

###### 1.5.1.3.2.3 Method Purpose

To trigger a notification to the customer that their order is on the way.

###### 1.5.1.3.2.4 Integration Context

Consumed when a rider confirms pickup from the vendor.

##### 1.5.1.3.3.0 Method Name

###### 1.5.1.3.3.1 Method Name

OrderDeliveredEvent

###### 1.5.1.3.3.2 Method Signature

Event payload containing at least { orderId, customerId }

###### 1.5.1.3.3.3 Method Purpose

To trigger a notification to the customer confirming delivery and prompting for a rating.

###### 1.5.1.3.3.4 Integration Context

Consumed when a rider completes the delivery.

#### 1.5.1.4.0.0 Integration Pattern

Asynchronous Event Consumption

#### 1.5.1.5.0.0 Communication Protocol

AWS SNS/SQS

#### 1.5.1.6.0.0 Extraction Reasoning

The repository is defined as an event consumer that listens to order lifecycle events to fulfill requirements like REQ-1-073. This contract represents the primary event-driven dependency.

### 1.5.2.0.0.0 Interface Name

#### 1.5.2.1.0.0 Interface Name

IUserLifecycleEvents

#### 1.5.2.2.0.0 Source Repository

platform-api-identity

#### 1.5.2.3.0.0 Method Contracts

##### 1.5.2.3.1.0 Method Name

###### 1.5.2.3.1.1 Method Name

UserApprovedEvent

###### 1.5.2.3.1.2 Method Signature

Event payload containing at least { userId, userType }

###### 1.5.2.3.1.3 Method Purpose

To trigger a welcome/approval notification for a new Vendor or Rider.

###### 1.5.2.3.1.4 Integration Context

Consumed when an admin approves a pending registration.

##### 1.5.2.3.2.0 Method Name

###### 1.5.2.3.2.1 Method Name

UserSensitiveDataChangedEvent

###### 1.5.2.3.2.2 Method Signature

Event payload containing at least { userId, changedField: 'bank' | 'phone' }

###### 1.5.2.3.2.3 Method Purpose

To trigger a security alert to the user about a sensitive profile change.

###### 1.5.2.3.2.4 Integration Context

Consumed after a user successfully updates their bank details or phone number.

#### 1.5.2.4.0.0 Integration Pattern

Asynchronous Event Consumption

#### 1.5.2.5.0.0 Communication Protocol

AWS SNS/SQS

#### 1.5.2.6.0.0 Extraction Reasoning

The service needs to react to user lifecycle events to send security and onboarding notifications, as per REQ-1-046 and user stories like VND-003.

### 1.5.3.0.0.0 Interface Name

#### 1.5.3.1.0.0 Interface Name

IVendorComplianceEvents

#### 1.5.3.2.0.0 Source Repository

platform-api-vendor-catalog

#### 1.5.3.3.0.0 Method Contracts

- {'method_name': 'VendorLicenseExpiryReminderEvent', 'method_signature': 'Event payload containing at least { vendorId, licenseType, daysUntilExpiry }', 'method_purpose': 'To trigger a reminder notification to a vendor about their upcoming license expiry.', 'integration_context': 'Consumed when a scheduled job in the Vendor & Catalog service identifies a license nearing its expiry date.'}

#### 1.5.3.4.0.0 Integration Pattern

Asynchronous Event Consumption

#### 1.5.3.5.0.0 Communication Protocol

AWS SNS/SQS

#### 1.5.3.6.0.0 Extraction Reasoning

The service is responsible for dispatching license expiry reminders as mandated by REQ-1-026, which are triggered by events from the vendor service.

### 1.5.4.0.0.0 Interface Name

#### 1.5.4.1.0.0 Interface Name

IUserContactInfoAPI

#### 1.5.4.2.0.0 Source Repository

platform-api-identity

#### 1.5.4.3.0.0 Method Contracts

- {'method_name': 'getContactDetails', 'method_signature': 'GET /internal/users/{userId}/contact-details -> { mobileNumber: string, deviceTokens: string[] }', 'method_purpose': "To retrieve a user's phone number for SMS or device tokens for push notifications.", 'integration_context': 'Called synchronously by the Notifications service after consuming an event, just before dispatching a message.'}

#### 1.5.4.4.0.0 Integration Pattern

Synchronous Request/Response

#### 1.5.4.5.0.0 Communication Protocol

HTTPS/REST

#### 1.5.4.6.0.0 Extraction Reasoning

This is an implied but critical dependency. To send a notification to a user identified by `userId` in an event, the service must fetch their actual contact information from the authoritative source, which is the Identity & Access service.

## 1.6.0.0.0.0 Exposed Interfaces

*No items available*

## 1.7.0.0.0.0 Technology Context

### 1.7.1.0.0.0 Framework Requirements

The service must be built using NestJS on Node.js v18.18+, written in TypeScript. It will be containerized using Docker and deployed on Amazon EKS.

### 1.7.2.0.0.0 Integration Technologies

- Firebase Admin SDK: For sending push notifications via FCM.
- AWS SDK for JavaScript (SNS Client): For sending transactional SMS messages.
- AWS SDK for JavaScript (SQS Client): For consuming events from SQS queues.

### 1.7.3.0.0.0 Performance Constraints

The service must be able to handle a high throughput of events from the message bus. All external API calls to FCM and SNS must be non-blocking to maintain responsiveness. Event processing latency should be minimal to ensure timely notification delivery (e.g., < 5 seconds from event to dispatch).

### 1.7.4.0.0.0 Security Requirements

API keys and credentials for FCM and AWS SNS must be stored securely in AWS Secrets Manager and accessed via IAM roles. The service must not log any Personally Identifiable Information (PII) from the event payloads.

## 1.8.0.0.0.0 Extraction Validation

| Property | Value |
|----------|-------|
| Mapping Completeness Check | The repository's purpose is clearly defined and di... |
| Cross Reference Validation | The repository's dependencies, integration pattern... |
| Implementation Readiness Assessment | The context is sufficient for a development team t... |
| Quality Assurance Confirmation | The extracted context has been systematically vali... |

