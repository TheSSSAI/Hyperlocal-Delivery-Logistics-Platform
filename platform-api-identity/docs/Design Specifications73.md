# 1 Analysis Metadata

| Property | Value |
|----------|-------|
| Analysis Timestamp | 2023-10-27T11:00:00Z |
| Repository Component Id | platform-api-identity |
| Analysis Completeness Score | 100 |
| Critical Findings Count | 0 |
| Analysis Methodology | Systematic decomposition of cached context, cross-... |

# 2 Repository Analysis

## 2.1 Repository Definition

### 2.1.1 Scope Boundaries

- Primary: User identity management, authentication (OTP-based login), authorization (RBAC), and profile management for all user types (Customer, Vendor, Rider, Admin).
- Secondary: Manages user consent (DPDP Act), handles data erasure requests, maintains the administrator action audit trail, and manages a subset of system-wide configurations.
- Exclusions: Does not manage domain-specific data like product catalogs, orders, or delivery tasks. It only manages the user identity associated with those domains.

### 2.1.2 Technology Stack

- NestJS v10+ (TypeScript) with Node.js v18+
- PostgreSQL v15.4+ with PostGIS extension for address management.
- Amazon ElastiCache for Redis for OTP storage, rate limiting, and session management.
- AWS Cognito for core identity provider functionality and user pool management.
- AWS SNS for transactional SMS (OTP delivery).

### 2.1.3 Architectural Constraints

- Must operate as a standalone microservice within the defined 'Identity & Access' bounded context (DDD).
- All user authentication must be managed via a custom OTP flow integrated with AWS Cognito, which will be the issuer of all JWTs for the platform.
- Must publish domain events (e.g., UserSuspended, PIIChanged) asynchronously to a message bus (AWS SQS/SNS) to ensure loose coupling with other services.
- All PII data stored in its PostgreSQL database must be encrypted at rest.

### 2.1.4 Dependency Relationships

#### 2.1.4.1 External Service Integration: AWS Cognito

##### 2.1.4.1.1 Dependency Type

External Service Integration

##### 2.1.4.1.2 Target Component

AWS Cognito

##### 2.1.4.1.3 Integration Pattern

Direct SDK Integration

##### 2.1.4.1.4 Reasoning

REQ-1-096 mandates AWS Cognito for user authentication and identity management. The service will use the AWS SDK to orchestrate user creation, status changes, and custom auth flows, offloading core IdP responsibilities.

#### 2.1.4.2.0 External Service Integration: AWS SNS

##### 2.1.4.2.1 Dependency Type

External Service Integration

##### 2.1.4.2.2 Target Component

AWS SNS

##### 2.1.4.2.3 Integration Pattern

Direct SDK Integration

##### 2.1.4.2.4 Reasoning

REQ-1-090 specifies AWS SNS for transactional SMS. This service uses it to deliver OTPs for registration and login, as detailed in sequence ID 203.

#### 2.1.4.3.0 Infrastructure Dependency: Redis (Amazon ElastiCache)

##### 2.1.4.3.1 Dependency Type

Infrastructure Dependency

##### 2.1.4.3.2 Target Component

Redis (Amazon ElastiCache)

##### 2.1.4.3.3 Integration Pattern

Client Library (e.g., ioredis)

##### 2.1.4.3.4 Reasoning

Sequence ID 203 and REQ-1-041 require a high-performance cache for storing OTPs, failed login attempt counters, and account lockout flags to ensure security and performance.

#### 2.1.4.4.0 Event Publishing: Other Platform Microservices (e.g., Vendor, Rider)

##### 2.1.4.4.1 Dependency Type

Event Publishing

##### 2.1.4.4.2 Target Component

Other Platform Microservices (e.g., Vendor, Rider)

##### 2.1.4.4.3 Integration Pattern

Message Bus (SNS/SQS)

##### 2.1.4.4.4 Reasoning

REQ-1-105 specifies asynchronous communication. This service publishes events like 'UserSuspended' (sequence ID 212) so downstream services can react without being tightly coupled (e.g., Vendor service taking a store offline).

#### 2.1.4.5.0 Library Consumption: REPO-LIB-CONTRACTS

##### 2.1.4.5.1 Dependency Type

Library Consumption

##### 2.1.4.5.2 Target Component

REPO-LIB-CONTRACTS

##### 2.1.4.5.3 Integration Pattern

NPM Package Dependency

##### 2.1.4.5.4 Reasoning

The architecture map specifies this dependency to consume shared DTOs for events like 'UserRegisteredEvent', ensuring a consistent data contract across the distributed system.

### 2.1.5.0.0 Analysis Insights

The Identity & Access service is the security and data-privacy cornerstone of the entire platform. Its complexity is high due to the combination of a custom authentication flow, integration with AWS Cognito, strict PII handling requirements under the DPDP Act, and its role as a central event publisher for user lifecycle events. Its design must prioritize security, resilience, and data integrity above all else, using transactional and asynchronous patterns to maintain consistency.

# 3.0.0.0.0 Requirements Mapping

## 3.1.0.0.0 Functional Requirements

### 3.1.1.0.0 Requirement Id

#### 3.1.1.1.0 Requirement Id

REQ-1-035

#### 3.1.1.2.0 Requirement Description

The system shall provide a registration flow for new Customers using a mobile number and OTP verification.

#### 3.1.1.3.0 Implementation Implications

- Requires a '/auth/register/customer/request-otp' endpoint to generate and send an OTP.
- Requires a '/auth/register/customer/verify' endpoint to validate the OTP, create the user in Cognito, create a profile in PostgreSQL, and issue JWTs.
- Utilizes Redis to store the OTP hash and SNS to send the SMS.

#### 3.1.1.4.0 Required Components

- AuthController
- AuthService
- UserRepository
- CustomerProfileRepository

#### 3.1.1.5.0 Analysis Reasoning

This requirement defines the primary entry point for customers and is a core responsibility of the Identity service.

### 3.1.2.0.0 Requirement Id

#### 3.1.2.1.0 Requirement Id

REQ-1-039

#### 3.1.2.2.0 Requirement Description

The system shall provide a login mechanism for all registered users based on their mobile number and OTP.

#### 3.1.2.3.0 Implementation Implications

- Requires a generic '/auth/login/request-otp' endpoint.
- Requires a '/auth/login/verify' endpoint that integrates with a Cognito custom authentication flow to validate the OTP and have Cognito issue the final JWTs.
- Security features like rate limiting and account lockout (REQ-1-041) must be implemented here.

#### 3.1.2.4.0 Required Components

- AuthController
- AuthService
- RedisClient

#### 3.1.2.5.0 Analysis Reasoning

This is the primary authentication method for the platform, central to the service's purpose.

### 3.1.3.0.0 Requirement Id

#### 3.1.3.1.0 Requirement Id

REQ-1-013

#### 3.1.3.2.0 Requirement Description

The system shall implement a dedicated, immutable audit trail to log all data modification actions performed by users with the 'Administrator' role.

#### 3.1.3.3.0 Implementation Implications

- Requires an 'AuditLog' entity and a corresponding PostgreSQL table with append-only permissions at the DB level.
- Requires an 'AuditLogService' to encapsulate the write logic.
- Admin-facing methods in other services (e.g., 'AdminService.suspendUser') must call this service within a transaction to ensure atomicity.

#### 3.1.3.4.0 Required Components

- AuditLogService
- AuditLogRepository
- AdminService

#### 3.1.3.5.0 Analysis Reasoning

As the manager of Admins and the most security-critical service, this is the logical owner of the Admin audit trail.

### 3.1.4.0.0 Requirement Id

#### 3.1.4.1.0 Requirement Id

REQ-1-023

#### 3.1.4.2.0 Requirement Description

The system shall implement a 'right to erasure' function that anonymizes a user's PII in all associated records.

#### 3.1.4.3.0 Implementation Implications

- Requires a 'DELETE /users/me' endpoint.
- This endpoint will trigger a distributed Saga to ensure PII is anonymized across all microservices (Orders, Ratings, etc.).
- This service will anonymize its own data (User, CustomerProfile, Address tables) and publish an event to trigger the saga in other services.

#### 3.1.4.4.0 Required Components

- UsersController
- UsersService
- AnonymizationSagaOrchestrator

#### 3.1.4.5.0 Analysis Reasoning

This compliance requirement is tied directly to user identity and PII, which is the core domain of this service. It is the natural starting point for the erasure process.

## 3.2.0.0.0 Non Functional Requirements

### 3.2.1.0.0 Requirement Type

#### 3.2.1.1.0 Requirement Type

Security

#### 3.2.1.2.0 Requirement Specification

REQ-1-096: The system shall use AWS Cognito for user authentication and identity management. Authorization shall be managed via a Role-Based Access Control (RBAC) model.

#### 3.2.1.3.0 Implementation Impact

This is a foundational architectural decision. The service's primary responsibility is to act as a bridge between the application's needs (custom OTP flow) and Cognito's capabilities. It will create users in Cognito and enrich JWTs with application-specific roles/claims.

#### 3.2.1.4.0 Design Constraints

- Authentication logic is tightly coupled to the AWS Cognito SDK.
- The service must manage a mapping between its internal 'userId' and the Cognito 'sub' identifier.

#### 3.2.1.5.0 Analysis Reasoning

This NFR directly dictates the core technology for identity management, making it a central design constraint for this service.

### 3.2.2.0.0 Requirement Type

#### 3.2.2.1.0 Requirement Type

Performance

#### 3.2.2.2.0 Requirement Specification

REQ-1-042: The end-to-end user login process...shall have a P95 latency of less than 3 seconds.

#### 3.2.2.3.0 Implementation Impact

The entire OTP generation, SMS delivery, and OTP verification flow must be highly optimized. This justifies the use of Redis for session data to avoid slow database lookups and dependency on a low-latency SMS provider (SNS).

#### 3.2.2.4.0 Design Constraints

- Database lookups must use indexed columns (e.g., on mobile number).
- Interaction with external services (SNS, Cognito) must have aggressive timeouts.

#### 3.2.2.5.0 Analysis Reasoning

This performance requirement constrains the design of the authentication flow, mandating the use of caching and optimized queries.

### 3.2.3.0.0 Requirement Type

#### 3.2.3.1.0 Requirement Type

Compliance

#### 3.2.3.2.0 Requirement Specification

REQ-1-021: The system shall comply with India's DPDP Act, 2023...providing granular consent options.

#### 3.2.3.3.0 Implementation Impact

This requires a dedicated 'UserConsent' entity and table in the database. The service must expose API endpoints for clients to record, view, and update these consents. All changes must be auditable.

#### 3.2.3.4.0 Design Constraints

- The data model must be flexible to add new consent types in the future.
- Other services that perform actions based on consent (e.g., marketing emails) will need to query this service to check for user consent.

#### 3.2.3.5.0 Analysis Reasoning

This legal requirement translates directly into a core data model and API functionality within the Identity service.

## 3.3.0.0.0 Requirements Analysis Summary

The Identity & Access service is the implementation point for the majority of the platform's security, compliance, and user management requirements. Its responsibilities range from core transactional flows like registration and login to complex, distributed processes like data erasure. The NFRs for security and performance are paramount and dictate a technology stack centered around AWS Cognito, Redis, and an event-driven architecture.

# 4.0.0.0.0 Architecture Analysis

## 4.1.0.0.0 Architectural Patterns

### 4.1.1.0.0 Pattern Name

#### 4.1.1.1.0 Pattern Name

Domain-Driven Design (DDD)

#### 4.1.1.2.0 Pattern Application

The service is designed as the 'Identity & Access' Bounded Context. Its internal structure, entities (User, Address), and services (AuthService, UsersService) directly model the language and concepts of identity management.

#### 4.1.1.3.0 Required Components

- AuthModule
- UsersModule
- AdminModule
- UserRepository
- AddressRepository

#### 4.1.1.4.0 Implementation Strategy

NestJS modules will be used to encapsulate different subdomains within the bounded context. Services will act as the application layer, orchestrating domain logic and repository interactions.

#### 4.1.1.5.0 Analysis Reasoning

REQ-1-104 explicitly mandates a microservices architecture based on DDD principles. This service represents a clear and cohesive bounded context, making DDD a natural fit.

### 4.1.2.0.0 Pattern Name

#### 4.1.2.1.0 Pattern Name

Event-Driven Architecture

#### 4.1.2.2.0 Pattern Application

This service acts as a producer of critical user lifecycle events, such as 'UserRegistered', 'UserSuspended', and 'UserAnonymized'. These events are published to a message bus to inform other microservices.

#### 4.1.2.3.0 Required Components

- EventPublisherService
- SnsClient

#### 4.1.2.4.0 Implementation Strategy

After a state change is committed to the database, a dedicated service will publish the corresponding event DTO (from 'REPO-LIB-CONTRACTS') to an SNS topic. The Transactional Outbox pattern should be considered to guarantee atomicity between the DB write and event publication.

#### 4.1.2.5.0 Analysis Reasoning

REQ-1-105 mandates asynchronous communication to ensure decoupling. This service's events are critical triggers for workflows in other domains (e.g., a suspended vendor's store must be taken offline).

## 4.2.0.0.0 Integration Points

### 4.2.1.0.0 Integration Type

#### 4.2.1.1.0 Integration Type

External Service

#### 4.2.1.2.0 Target Components

- AWS Cognito
- AWS SNS

#### 4.2.1.3.0 Communication Pattern

Synchronous SDK Calls

#### 4.2.1.4.0 Interface Requirements

- Requires AWS SDK for JavaScript v3.
- Requires IAM credentials with appropriate permissions for Cognito User Pools and SNS Publish actions, managed via AWS Secrets Manager.

#### 4.2.1.5.0 Analysis Reasoning

These are direct dependencies mandated by the requirements (REQ-1-096, REQ-1-090) for core identity and notification functionality.

### 4.2.2.0.0 Integration Type

#### 4.2.2.1.0 Integration Type

Internal Service

#### 4.2.2.2.0 Target Components

- Order Management Service
- Vendor & Catalog Service
- Rider Logistics Service

#### 4.2.2.3.0 Communication Pattern

Asynchronous (Event Publication)

#### 4.2.2.4.0 Interface Requirements

- Publishes events with a defined contract (DTO) to an SNS topic.
- Consuming services will subscribe via SQS queues.

#### 4.2.2.5.0 Analysis Reasoning

This aligns with the event-driven architecture (REQ-1-105) to ensure services are decoupled and resilient.

## 4.3.0.0.0 Layering Strategy

| Property | Value |
|----------|-------|
| Layer Organization | The service follows a standard three-tier architec... |
| Component Placement | NestJS Controllers will handle HTTP requests route... |
| Analysis Reasoning | This is a standard, maintainable pattern that alig... |

# 5.0.0.0.0 Database Analysis

## 5.1.0.0.0 Entity Mappings

### 5.1.1.0.0 Entity Name

#### 5.1.1.1.0 Entity Name

User

#### 5.1.1.2.0 Database Table

User

#### 5.1.1.3.0 Required Properties

- userId (PK, UUID)
- mobileNumber (UK, VARCHAR)
- email (UK, VARCHAR)
- userType (ENUM)
- status (ENUM: 'active', 'suspended', 'pending_verification', 'deactivated')

#### 5.1.1.4.0 Relationship Mappings

- One-to-one with CustomerProfile
- One-to-many with Address
- One-to-many with UserConsent

#### 5.1.1.5.0 Access Patterns

- Frequent lookups by 'mobileNumber' during login/registration.
- Frequent lookups by 'userId' (from JWT) for authorization checks.

#### 5.1.1.6.0 Analysis Reasoning

This is the central entity of the service, derived from the 'Identity & Access Service ER Diagram'.

### 5.1.2.0.0 Entity Name

#### 5.1.2.1.0 Entity Name

Address

#### 5.1.2.2.0 Database Table

Address

#### 5.1.2.3.0 Required Properties

- addressId (PK, UUID)
- userId (FK)
- addressLine1, city, etc. (VARCHAR)
- location (GEOGRAPHY)

#### 5.1.2.4.0 Relationship Mappings

- Many-to-one with User

#### 5.1.2.5.0 Access Patterns

- CRUD operations scoped to a specific 'userId'.

#### 5.1.2.6.0 Analysis Reasoning

Implements the user address management feature (REQ-1-043). Requires the PostGIS extension for the 'location' field.

### 5.1.3.0.0 Entity Name

#### 5.1.3.1.0 Entity Name

AuditLog

#### 5.1.3.2.0 Database Table

AuditLog

#### 5.1.3.3.0 Required Properties

- auditLogId (PK, BIGSERIAL)
- adminId (FK to User)
- action (VARCHAR)
- changedData (JSONB)
- timestamp (TIMESTAMPTZ)

#### 5.1.3.4.0 Relationship Mappings

- Many-to-one with User (the admin)

#### 5.1.3.5.0 Access Patterns

- Append-only writes.
- Read queries filtered by 'adminId' and/or 'timestamp' range.

#### 5.1.3.6.0 Analysis Reasoning

Direct implementation of the immutable admin audit trail requirement (REQ-1-013).

## 5.2.0.0.0 Data Access Requirements

### 5.2.1.0.0 Operation Type

#### 5.2.1.1.0 Operation Type

Authentication

#### 5.2.1.2.0 Required Methods

- UserRepository.findByMobileNumber(mobile: string): Promise<User | null>
- UserRepository.updateStatus(userId: string, status: UserStatus): Promise<void>

#### 5.2.1.3.0 Performance Constraints

Lookups must be highly performant (<50ms) to meet overall login time requirements.

#### 5.2.1.4.0 Analysis Reasoning

These methods support the core registration and login flows, which are high-traffic and performance-sensitive.

### 5.2.2.0.0 Operation Type

#### 5.2.2.1.0 Operation Type

Profile Management

#### 5.2.2.2.0 Required Methods

- AddressRepository.create(userId: string, address: AddressDto): Promise<Address>
- AddressRepository.findAllByUserId(userId: string): Promise<Address[]>
- AddressRepository.delete(userId: string, addressId: string): Promise<void>

#### 5.2.2.3.0 Performance Constraints

Standard CRUD performance (<200ms P95).

#### 5.2.2.4.0 Analysis Reasoning

These methods support the user's ability to manage their saved addresses, a key feature of the customer profile.

## 5.3.0.0.0 Persistence Strategy

| Property | Value |
|----------|-------|
| Orm Configuration | The service will use a Node.js ORM (e.g., TypeORM ... |
| Migration Requirements | Database schema changes will be managed through au... |
| Analysis Reasoning | Using an ORM and automated migrations is a standar... |

# 6.0.0.0.0 Sequence Analysis

## 6.1.0.0.0 Interaction Patterns

### 6.1.1.0.0 Sequence Name

#### 6.1.1.1.0 Sequence Name

New Customer Registration

#### 6.1.1.2.0 Repository Role

Orchestrator

#### 6.1.1.3.0 Required Interfaces

- IRedisClient
- ISnsClient
- ICognitoClient
- IUserRepository

#### 6.1.1.4.0 Method Specifications

##### 6.1.1.4.1 Method Name

###### 6.1.1.4.1.1 Method Name

authService.requestRegistrationOtp(mobileNumber: string): Promise<void>

###### 6.1.1.4.1.2 Interaction Context

Called when a user submits their mobile number on the registration screen.

###### 6.1.1.4.1.3 Parameter Analysis

Accepts a string mobile number. Must be validated for format and uniqueness.

###### 6.1.1.4.1.4 Return Type Analysis

Returns a void promise. Success indicates OTP was sent; throws specific exceptions for duplicates or validation failures.

###### 6.1.1.4.1.5 Analysis Reasoning

This method implements the first step of the OTP-based registration flow from sequence ID 203.

##### 6.1.1.4.2.0 Method Name

###### 6.1.1.4.2.1 Method Name

authService.verifyAndRegister(mobileNumber: string, otp: string, consent: boolean): Promise<{ accessToken: string, refreshToken: string }>

###### 6.1.1.4.2.2 Interaction Context

Called when the user submits the received OTP to complete registration.

###### 6.1.1.4.2.3 Parameter Analysis

Accepts mobile number, OTP, and a boolean for consent. The OTP is verified against the hash stored in Redis.

###### 6.1.1.4.2.4 Return Type Analysis

Returns JWTs upon successful creation of the user in Cognito and the local DB. Throws exceptions for invalid OTP, expired OTP, or user creation failure.

###### 6.1.1.4.2.5 Analysis Reasoning

This method implements the final, state-changing step of the registration flow from sequence ID 203.

#### 6.1.1.5.0.0 Analysis Reasoning

The registration sequence (ID 203) clearly defines this service's role in orchestrating interactions between the client, Redis, SNS, Cognito, and its own database to securely onboard a new user.

### 6.1.2.0.0.0 Sequence Name

#### 6.1.2.1.0.0 Sequence Name

User Suspension by Admin

#### 6.1.2.2.0.0 Repository Role

Executor and Event Publisher

#### 6.1.2.3.0.0 Required Interfaces

- IUserRepository
- IAuditLogRepository
- ICognitoClient
- IEventPublisher

#### 6.1.2.4.0.0 Method Specifications

- {'method_name': 'adminService.suspendUser(actingAdminId: string, targetUserId: string, reason: string): Promise<void>', 'interaction_context': 'Called when an administrator initiates a user suspension from the admin dashboard.', 'parameter_analysis': "Accepts the admin's ID (from JWT), the target user's ID, and a mandatory reason for the suspension.", 'return_type_analysis': 'Returns a void promise. Any failure during the process (DB update, audit log, Cognito update) should cause the entire operation to fail and roll back.', 'analysis_reasoning': 'This implements the flow from sequence ID 212, ensuring the suspension is an atomic, auditable action that also notifies the rest of the system via an event.'}

#### 6.1.2.5.0.0 Analysis Reasoning

The user suspension sequence (ID 212) demonstrates the service's responsibility to handle critical administrative actions transactionally, ensuring data consistency, auditability, and system-wide notification through event publishing.

## 6.2.0.0.0.0 Communication Protocols

### 6.2.1.0.0.0 Protocol Type

#### 6.2.1.1.0.0 Protocol Type

RESTful API (HTTPS)

#### 6.2.1.2.0.0 Implementation Requirements

Exposed via NestJS controllers, with DTOs for request/response validation. All endpoints must be secured, with most requiring a valid JWT validated by a Cognito authorizer at the API Gateway.

#### 6.2.1.3.0.0 Analysis Reasoning

Standard protocol for synchronous request-response communication between clients (via API Gateway) and the microservice, as specified in REQ-1-092.

### 6.2.2.0.0.0 Protocol Type

#### 6.2.2.1.0.0 Protocol Type

Asynchronous Events (SNS/SQS)

#### 6.2.2.2.0.0 Implementation Requirements

The service will use the AWS SDK to publish JSON-serialized event DTOs to specific SNS topics. The event structure must conform to the shared contracts in 'REPO-LIB-CONTRACTS'.

#### 6.2.2.3.0.0 Analysis Reasoning

Mandated by REQ-1-105 for inter-service communication to ensure decoupling and resilience.

# 7.0.0.0.0.0 Critical Analysis Findings

*No items available*

# 8.0.0.0.0.0 Analysis Traceability

## 8.1.0.0.0.0 Cached Context Utilization

This analysis was performed by synthesizing information from all provided cache areas. Requirements (Functional & Non-Functional) defined the 'what'. The Architecture document defined the 'how' and 'where'. The Database schemas provided the detailed data model. Sequence diagrams illustrated the dynamic behavior and interactions. User stories provided the user-centric context and acceptance criteria.

## 8.2.0.0.0.0 Analysis Decision Trail

- Decision: Classify the repository as 'High Complexity' based on the intersection of security requirements, external dependencies (Cognito), and the need for distributed transactions (Saga).
- Decision: Specify the use of Redis for OTPs and rate limiting based on performance NFRs (REQ-1-042) and security NFRs (REQ-1-041).
- Decision: Mandate a transactional approach for all state-changing admin actions that also require an audit log entry, as derived from REQ-1-013 and sequence ID 212.
- Decision: Define the service as a primary event publisher for all user lifecycle events, based on the event-driven architecture pattern (REQ-1-105).

## 8.3.0.0.0.0 Assumption Validations

- Assumption: The PostGIS extension will be available and enabled on the PostgreSQL instance in all environments.
- Assumption: The AWS SDKs and credentials for Cognito, SNS, and SQS will be provided to the service's runtime environment securely (e.g., via IAM roles and Secrets Manager).
- Assumption: The API Gateway will be configured with a Cognito authorizer to pre-validate JWTs for most incoming requests.

## 8.4.0.0.0.0 Cross Reference Checks

- Verified that the entities in the 'Identity & Access Service ER Diagram' directly support the functional requirements for user profiles (CUS-006), addresses (CUS-007), and consent (CUS-042).
- Cross-referenced the 'New Customer Registration' sequence diagram (ID 203) with functional requirements REQ-1-035 (Registration) and REQ-1-039 (OTP Login) to confirm the implementation details matched.
- Validated that the technology stack specified in the repository definition (NestJS, Cognito, PostgreSQL) aligns with the master technology stack requirement (REQ-1-111) and the architecture specification (REQ-1-096).

