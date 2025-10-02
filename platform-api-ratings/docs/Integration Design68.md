# 1 Integration Specifications

## 1.1 Extraction Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-api-ratings |
| Extraction Timestamp | 2024-05-24T10:30:00Z |
| Mapping Validation Score | 100% |
| Context Completeness Score | 100% |
| Implementation Readiness Level | High |

## 1.2 Relevant Requirements

### 1.2.1 Requirement Id

#### 1.2.1.1 Requirement Id

REQ-1-063

#### 1.2.1.2 Requirement Text

The rating system shall allow customers to provide separate feedback for the vendor and the rider. For each, the customer must be able to provide a star rating from 1 to 5 and an optional text review.

#### 1.2.1.3 Validation Criteria

- On the rating screen, verify there are two distinct sections: one for the vendor and one for the rider.
- Verify each section has a 1-5 star selection component and a text input field.
- Successfully submit a rating with stars for both and a text review for one.
- Verify the submitted data is stored correctly against the order, vendor, and rider.

#### 1.2.1.4 Implementation Implications

- The service must expose an API endpoint to accept rating submissions.
- The data model must differentiate between a reviewee being a 'vendor' or a 'rider'.
- The database schema must accommodate a 1-5 integer rating and an optional text field.

#### 1.2.1.5 Extraction Reasoning

This is a core functional requirement that defines the primary data model and write-path (submission) responsibility of the platform-api-ratings service.

### 1.2.2.0 Requirement Id

#### 1.2.2.1 Requirement Id

REQ-1-064

#### 1.2.2.2 Requirement Text

The system shall automatically calculate and display the average star rating for each vendor on their public-facing profile. The system shall also calculate the average star rating for each rider, which must be visible to Administrators in the admin dashboard.

#### 1.2.2.3 Validation Criteria

- Submit several ratings for a vendor and verify the displayed average rating is calculated correctly.
- Submit several ratings for a rider and verify their average rating is calculated correctly in the admin dashboard.

#### 1.2.2.4 Implementation Implications

- The service must implement logic to calculate aggregate average ratings.
- This calculation should be triggered after a new rating is submitted.
- To maintain performance and decoupling, the service should publish an event with the updated average rating for other services (Vendor, Logistics) to consume, rather than having them call this service for the data.

#### 1.2.2.5 Extraction Reasoning

This requirement defines the key data aggregation and outbound communication (event publishing) function of the service, which is a primary reason for its decomposition.

### 1.2.3.0 Requirement Id

#### 1.2.3.1 Requirement Id

REQ-1-105

#### 1.2.3.2 Requirement Text

Communication between microservices shall primarily be asynchronous using a message bus (AWS SQS/SNS) to ensure decoupling and resilience.

#### 1.2.3.3 Validation Criteria

- Review the order processing flow. Verify that after initial placement, subsequent steps like notifying the vendor are handled via asynchronous messages.

#### 1.2.3.4 Implementation Implications

- The service must be designed as an event consumer (listening for 'OrderDelivered' events) and an event producer (publishing 'RatingSubmitted' events).
- This architectural mandate reinforces the need for asynchronous integration patterns.

#### 1.2.3.5 Extraction Reasoning

This architectural requirement dictates the primary communication patterns (event-driven) that this service must use to interact with other backend services, ensuring a loosely coupled system.

## 1.3.0.0 Relevant Components

- {'component_name': 'Ratings Service', 'component_specification': 'This microservice is the system of record for all user-generated ratings and reviews. It handles submission of feedback for vendors and riders, calculates aggregate scores, and provides this data to other parts of the platform via both a synchronous API and asynchronous events. Its scope is strictly limited to ratings and reviews.', 'implementation_requirements': ['Implement a RESTful API for submitting and querying ratings.', "Use a PostgreSQL database with a dedicated 'RatingReview' table as defined in DB Diagram ID 42.", "Implement an event consumer for 'OrderDeliveredEvent' to track which orders are eligible for rating.", "Implement an event publisher for 'RatingSubmittedEvent' to notify other services of updated average ratings.", 'Implement authorization logic to ensure a customer can only rate an order they placed and only after it is delivered, likely requiring a synchronous call to the Order service for validation.'], 'architectural_context': "This component resides in the 'Application Services Layer' and acts as the system of record for all user feedback, representing the 'Ratings' Bounded Context in a Domain-Driven Design.", 'extraction_reasoning': 'The repository directly implements this architectural component, which was decomposed from the original, broader communications service to isolate its specific data and workload patterns.'}

## 1.4.0.0 Architectural Layers

- {'layer_name': 'Application Services Layer (Microservices)', 'layer_responsibilities': "This layer implements the core business logic and workflows of the platform. Services in this layer own and manage a specific subset of the application's data, expose APIs, and communicate with other services asynchronously.", 'layer_constraints': ['Services must be independently deployable.', 'Services should communicate asynchronously via the Messaging Layer where possible to ensure decoupling.'], 'implementation_patterns': ['Domain-Driven Design (DDD)', 'Event-Driven Architecture', 'RESTful API'], 'extraction_reasoning': "The platform-api-ratings repository is explicitly mapped to this layer and its description perfectly aligns with the layer's responsibilities and patterns."}

## 1.5.0.0 Dependency Interfaces

### 1.5.1.0 Interface Name

#### 1.5.1.1 Interface Name

IOrderDeliveredEventConsumer

#### 1.5.1.2 Source Repository

platform-api-orders

#### 1.5.1.3 Method Contracts

- {'method_name': 'handleOrderDeliveredEvent', 'method_signature': 'handle(payload: OrderDeliveredEvent)', 'method_purpose': "To listen for an order completion event, which makes the order eligible for rating. This handler creates a 'RateableOrder' record to track eligibility.", 'integration_context': "Consumed asynchronously when the Order service publishes that an order has reached the 'Delivered' state."}

#### 1.5.1.4 Integration Pattern

Event-Driven (Pub/Sub)

#### 1.5.1.5 Communication Protocol

Asynchronous via AWS SNS/SQS with a JSON payload defined in REPO-LIB-CONTRACTS.

#### 1.5.1.6 Extraction Reasoning

This is the primary trigger for the service's workflow, enabling the rating feature in a decoupled manner as mandated by the event-driven architecture.

### 1.5.2.0 Interface Name

#### 1.5.2.1 Interface Name

IOrderAuthorizationAPI

#### 1.5.2.2 Source Repository

platform-api-orders

#### 1.5.2.3 Method Contracts

- {'method_name': 'verifyOrderOwnership', 'method_signature': 'GET /internal/orders/{orderId}/ownership/{customerId}', 'method_purpose': 'To synchronously verify that the customer attempting to submit a rating is the same customer who placed the order.', 'integration_context': "Called by the Ratings service's authorization guard as a final security check before persisting a new rating."}

#### 1.5.2.4 Integration Pattern

Synchronous RPC via Service Mesh

#### 1.5.2.5 Communication Protocol

HTTPS/REST

#### 1.5.2.6 Extraction Reasoning

This synchronous dependency is necessary to fulfill the security requirement of ensuring only the legitimate customer can rate an order, providing an authoritative check against the source of truth for orders.

### 1.5.3.0 Interface Name

#### 1.5.3.1 Interface Name

Shared Libraries

#### 1.5.3.2 Source Repository

platform-lib-contracts, platform-lib-observability

#### 1.5.3.3 Method Contracts

*No items available*

#### 1.5.3.4 Integration Pattern

Library Consumption (NPM Package)

#### 1.5.3.5 Communication Protocol

N/A (Compile-time dependency)

#### 1.5.3.6 Extraction Reasoning

This service, like all others, depends on `platform-lib-contracts` for shared DTOs/event schemas and `platform-lib-observability` for standardized logging, metrics, and tracing, which are foundational cross-cutting concerns.

## 1.6.0.0 Exposed Interfaces

### 1.6.1.0 Interface Name

#### 1.6.1.1 Interface Name

IRatingServiceAPI

#### 1.6.1.2 Consumer Repositories

- platform-mobile-customer
- platform-web-vendor
- platform-web-admin

#### 1.6.1.3 Method Contracts

##### 1.6.1.3.1 Method Name

###### 1.6.1.3.1.1 Method Name

submitRating

###### 1.6.1.3.1.2 Method Signature

POST /api/v1/ratings (Body: CreateRatingDto)

###### 1.6.1.3.1.3 Method Purpose

Allows an authenticated customer to submit a rating for a specific vendor or rider associated with a completed order.

###### 1.6.1.3.1.4 Implementation Requirements

Must perform authorization to ensure the JWT's user ID matches the customer on the order (using IOrderAuthorizationAPI). Must validate that the order is eligible for rating. Must prevent duplicate ratings. Must publish a 'RatingSubmittedEvent' upon successful persistence.

##### 1.6.1.3.2.0 Method Name

###### 1.6.1.3.2.1 Method Name

getVendorRatings

###### 1.6.1.3.2.2 Method Signature

GET /api/v1/vendors/{vendorId}/ratings?page=1&limit=10

###### 1.6.1.3.2.3 Method Purpose

Retrieves a paginated list of all ratings and reviews for a specific vendor.

###### 1.6.1.3.2.4 Implementation Requirements

The response must anonymize the reviewer's personal information. The query should be optimized for pagination and filtering.

##### 1.6.1.3.3.0 Method Name

###### 1.6.1.3.3.1 Method Name

getRiderRatings

###### 1.6.1.3.3.2 Method Signature

GET /api/v1/riders/{riderId}/ratings?page=1&limit=10

###### 1.6.1.3.3.3 Method Purpose

Retrieves a paginated list of all ratings and reviews for a specific rider.

###### 1.6.1.3.3.4 Implementation Requirements

This endpoint must be protected and accessible only to 'Administrator' roles.

#### 1.6.1.4.0.0 Service Level Requirements

- P95 latency for all GET requests must be under 200ms.
- P95 latency for the POST (submit) request must be under 500ms.

#### 1.6.1.5.0.0 Implementation Constraints

- All user-generated text (reviews) must be sanitized to prevent XSS attacks.
- API must adhere to the platform's versioning scheme (e.g., /api/v1/).

#### 1.6.1.6.0.0 Extraction Reasoning

This synchronous API is the primary interface for frontend applications to submit and view rating data, directly fulfilling requirements REQ-1-063 and REQ-1-064.

### 1.6.2.0.0.0 Interface Name

#### 1.6.2.1.0.0 Interface Name

IRatingEventPublisher

#### 1.6.2.2.0.0 Consumer Repositories

- platform-api-vendor-catalog
- platform-api-logistics

#### 1.6.2.3.0.0 Method Contracts

- {'method_name': 'publishRatingSubmittedEvent', 'method_signature': 'publish(event: RatingSubmittedEvent)', 'method_purpose': "To notify other services that a new rating has been submitted and a user's average rating has been updated.", 'implementation_requirements': "The event payload must contain the `revieweeId`, `revieweeType` ('vendor' or 'rider'), `newAverageRating`, and `newRatingCount`."}

#### 1.6.2.4.0.0 Service Level Requirements

*No items available*

#### 1.6.2.5.0.0 Implementation Constraints

*No items available*

#### 1.6.2.6.0.0 Extraction Reasoning

This asynchronous interface is essential for the decoupled architecture (REQ-1-105). It allows the Vendor and Logistics services to update their denormalized average rating data without needing to call the Ratings service, which is a more scalable and resilient pattern.

## 1.7.0.0.0.0 Technology Context

### 1.7.1.0.0.0 Framework Requirements

The service must be built using NestJS on Node.js v18.18+ and written in TypeScript, connecting to a PostgreSQL v15.4+ database.

### 1.7.2.0.0.0 Integration Technologies

- AWS SQS/SNS for consuming and publishing asynchronous events.
- PostgreSQL for persistence, using the schema defined in DB Diagram ID 42.
- REST/HTTPS for synchronous API communication.
- Redis for caching aggregate scores to improve read performance.

### 1.7.3.0.0.0 Performance Constraints

The service must be optimized for a write-heavy workload during rating submissions and a read-heavy workload for profile views. Caching of aggregate scores (average ratings) is recommended to reduce database load.

### 1.7.4.0.0.0 Security Requirements

Endpoints must be secured via JWT and RBAC. Authorization logic is critical to ensure a customer can only rate an order they placed. All user-generated content must be sanitized.

## 1.8.0.0.0.0 Extraction Validation

| Property | Value |
|----------|-------|
| Mapping Completeness Check | The repository's mappings to requirements (REQ-1-0... |
| Cross Reference Validation | All cross-references are consistent. The requireme... |
| Implementation Readiness Assessment | The repository is implementation-ready. The techno... |
| Quality Assurance Confirmation | The extracted context has been systematically anal... |

