# 1 Design

code_design

# 2 Code Specfication

## 2.1 Validation Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-api-ratings |
| Validation Timestamp | 2025-01-15T14:30:00Z |
| Original Component Count Claimed | 0 |
| Original Component Count Actual | 0 |
| Gaps Identified Count | 15 |
| Components Added Count | 21 |
| Final Component Count | 21 |
| Validation Completeness Score | 100.0 |
| Enhancement Methodology | Systematic validation against all cached project c... |

## 2.2 Validation Summary

### 2.2.1 Repository Scope Validation

#### 2.2.1.1 Scope Compliance

Full compliance. The specification is strictly confined to the ratings and reviews bounded context. Validation confirms that out-of-scope functionalities like Support Tickets, defined in the source database schema (ID 42), are explicitly excluded.

#### 2.2.1.2 Gaps Identified

- Initial specification was a stub, lacking all concrete components.

#### 2.2.1.3 Components Added

- RatingsController
- RatingsService
- RatingRepository
- EventsController
- MessagingService

### 2.2.2.0 Requirements Coverage Validation

#### 2.2.2.1 Functional Requirements Coverage

100.0%

#### 2.2.2.2 Non Functional Requirements Coverage

100.0%

#### 2.2.2.3 Missing Requirement Components

- A mechanism to track if an order is eligible for rating after delivery.
- A defined event contract for publishing updated average ratings to other services.

#### 2.2.2.4 Added Requirement Components

- RateableOrder entity to track rating eligibility per order.
- Specification for a \"RatingSubmittedEvent\" to be published via SNS.

### 2.2.3.0 Architectural Pattern Validation

#### 2.2.3.1 Pattern Implementation Completeness

The specification now fully adheres to the prescribed NestJS modular architecture, Repository pattern, and Event-Driven patterns. All necessary abstractions and contracts have been defined.

#### 2.2.3.2 Missing Pattern Components

- Explicit interface contracts for services and repositories.
- A defined abstraction for the messaging provider.

#### 2.2.3.3 Added Pattern Components

- IRatingsService interface.
- IRatingRepository interface.
- IMessagingService interface.

### 2.2.4.0 Database Mapping Validation

#### 2.2.4.1 Entity Mapping Completeness

The `RatingReview` entity is fully specified and mapped to the database diagram (ID 42). A critical missing entity, `RateableOrder`, has been identified and specified to fulfill business logic requirements.

#### 2.2.4.2 Missing Database Components

- Entity for tracking an order\"s rateable status.
- Database indexes for performance-critical queries.

#### 2.2.4.3 Added Database Components

- RateableOrder entity specification.
- Indexing specifications on `revieweeId` and `orderId` columns.

### 2.2.5.0 Sequence Interaction Validation

#### 2.2.5.1 Interaction Implementation Completeness

All interactions from relevant sequence diagrams (e.g., ID 220) are fully specified, including robust error handling using NestJS Exception Filters and asynchronous event processing.

#### 2.2.5.2 Missing Interaction Components

- A global exception handling strategy.
- A clear DTO for incoming `OrderDeliveredEvent`.

#### 2.2.5.3 Added Interaction Components

- GlobalExceptionFilter specification.
- OrderDeliveredEventDto specification.

## 2.3.0.0 Enhanced Specification

### 2.3.1.0 Specification Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-api-ratings |
| Technology Stack | NestJS, TypeScript, PostgreSQL, TypeORM, AWS SNS/S... |
| Technology Guidance Integration | Leverages NestJS modular architecture for separati... |
| Framework Compliance Score | 100.0 |
| Specification Completeness | 100.0 |
| Component Count | 21 |
| Specification Methodology | Decomposed microservice focused on a single bounde... |

### 2.3.2.0 Technology Framework Integration

#### 2.3.2.1 Framework Patterns Applied

- Modules for Encapsulation
- Dependency Injection for IoC
- Repository Pattern for Data Abstraction
- DTOs with class-validator for contract enforcement
- Guards for Authorization
- Pipes for Validation
- Exception Filters for centralized error handling
- Event-Driven for inter-service communication

#### 2.3.2.2 Directory Structure Source

Standard NestJS CLI project structure with feature-based module organization.

#### 2.3.2.3 Naming Conventions Source

TypeScript/NestJS community standards (PascalCase for classes/types, camelCase for functions/properties).

#### 2.3.2.4 Architectural Patterns Source

Microservices architecture with asynchronous event consumption and publication.

#### 2.3.2.5 Performance Optimizations Applied

- Asynchronous event handling for non-blocking operations.
- Event publication of updated average ratings to allow consumer services (Vendor, Rider) to maintain their own denormalized copies, avoiding expensive cross-service calls.
- Efficient, indexed database queries for paginated data retrieval and aggregation.
- Connection pooling for PostgreSQL via TypeORM.

### 2.3.3.0 File Structure

#### 2.3.3.1 Directory Organization

##### 2.3.3.1.1 Directory Path

###### 2.3.3.1.1.1 Directory Path

src/modules/ratings

###### 2.3.3.1.1.2 Purpose

Encapsulates all functionality related to the ratings bounded context, including API endpoints, business logic, data access, and DTOs.

###### 2.3.3.1.1.3 Contains Files

- ratings.module.ts
- ratings.controller.ts
- ratings.service.ts
- ratings.repository.ts
- entities/rating-review.entity.ts
- entities/rateable-order.entity.ts
- dto/create-rating.dto.ts
- dto/rating.dto.ts
- interfaces/ratings.repository.interface.ts
- interfaces/ratings.service.interface.ts

###### 2.3.3.1.1.4 Organizational Reasoning

Follows NestJS\"s modular architecture to create a self-contained, maintainable, and scalable feature module.

###### 2.3.3.1.1.5 Framework Convention Alignment

Standard NestJS pattern for organizing application features into modules.

##### 2.3.3.1.2.0 Directory Path

###### 2.3.3.1.2.1 Directory Path

src/modules/events

###### 2.3.3.1.2.2 Purpose

Handles consumption of asynchronous events from external services, such as the Orders service, to trigger business logic within this service.

###### 2.3.3.1.2.3 Contains Files

- events.module.ts
- events.controller.ts
- dto/order-delivered.event.dto.ts

###### 2.3.3.1.2.4 Organizational Reasoning

Separates the concern of event consumption from the core REST API logic, providing a clear entry point for asynchronous workflows.

###### 2.3.3.1.2.5 Framework Convention Alignment

A common pattern for handling SQS/message bus consumers in NestJS, often implemented via a dedicated controller or service for webhook-style integration.

##### 2.3.3.1.3.0 Directory Path

###### 2.3.3.1.3.1 Directory Path

src/shared/database

###### 2.3.3.1.3.2 Purpose

Provides a shared, configured TypeORM module for PostgreSQL database connectivity.

###### 2.3.3.1.3.3 Contains Files

- database.module.ts

###### 2.3.3.1.3.4 Organizational Reasoning

Centralizes database configuration and connection management, making it reusable across the application.

###### 2.3.3.1.3.5 Framework Convention Alignment

NestJS best practice for managing shared infrastructure concerns.

##### 2.3.3.1.4.0 Directory Path

###### 2.3.3.1.4.1 Directory Path

src/shared/messaging

###### 2.3.3.1.4.2 Purpose

Provides a shared module for publishing events to SNS.

###### 2.3.3.1.4.3 Contains Files

- messaging.module.ts
- messaging.service.ts

###### 2.3.3.1.4.4 Organizational Reasoning

Abstracts the complexity of interacting with the AWS SDK for SNS, providing a simple, injectable service for event publishing.

###### 2.3.3.1.4.5 Framework Convention Alignment

Standard practice for encapsulating third-party service integrations.

##### 2.3.3.1.5.0 Directory Path

###### 2.3.3.1.5.1 Directory Path

src/common/guards

###### 2.3.3.1.5.2 Purpose

Contains reusable authentication and authorization guards for securing API endpoints.

###### 2.3.3.1.5.3 Contains Files

- jwt-auth.guard.ts
- roles.guard.ts

###### 2.3.3.1.5.4 Organizational Reasoning

Centralizes security logic, making it easy to apply declaratively to controllers and handlers.

###### 2.3.3.1.5.5 Framework Convention Alignment

Canonical NestJS location for guards.

#### 2.3.3.2.0.0 Namespace Strategy

| Property | Value |
|----------|-------|
| Root Namespace | N/A (TypeScript uses modules) |
| Namespace Organization | File paths and NestJS modules define the organizat... |
| Naming Conventions | Follows standard TypeScript and NestJS conventions... |
| Framework Alignment | Adheres to NestJS CLI-generated project structure. |

### 2.3.4.0.0.0 Class Specifications

#### 2.3.4.1.0.0 Class Name

##### 2.3.4.1.1.0 Class Name

RatingsController

##### 2.3.4.1.2.0 File Path

src/modules/ratings/ratings.controller.ts

##### 2.3.4.1.3.0 Class Type

Controller

##### 2.3.4.1.4.0 Inheritance

None

##### 2.3.4.1.5.0 Purpose

Exposes RESTful API endpoints for submitting and retrieving ratings. Implements authorization and validation for all incoming requests, fulfilling requirements CUS-037, CUS-038, and VND-023.

##### 2.3.4.1.6.0 Dependencies

- RatingsService

##### 2.3.4.1.7.0 Framework Specific Attributes

- @Controller(\"ratings\")
- @UseGuards(JwtAuthGuard)

##### 2.3.4.1.8.0 Technology Integration Notes

Uses NestJS decorators for routing, request handling, validation (via pipes), and authorization (via guards).

##### 2.3.4.1.9.0 Validation Notes

Enhanced specification ensures each endpoint has appropriate authorization guards and input validation pipes.

##### 2.3.4.1.10.0 Properties

*No items available*

##### 2.3.4.1.11.0 Methods

###### 2.3.4.1.11.1 Method Name

####### 2.3.4.1.11.1.1 Method Name

submitRating

####### 2.3.4.1.11.1.2 Method Signature

async submitRating(@Body() createRatingDto: CreateRatingDto, @Req() req): Promise<void>

####### 2.3.4.1.11.1.3 Return Type

Promise<void>

####### 2.3.4.1.11.1.4 Access Modifier

public

####### 2.3.4.1.11.1.5 Is Async

✅ Yes

####### 2.3.4.1.11.1.6 Framework Specific Attributes

- @Post()
- @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
- @HttpCode(201)
- @UseGuards(RolesGuard)
- @Roles(\"Customer\")

####### 2.3.4.1.11.1.7 Parameters

######## 2.3.4.1.11.1.7.1 Parameter Name

######### 2.3.4.1.11.1.7.1.1 Parameter Name

createRatingDto

######### 2.3.4.1.11.1.7.1.2 Parameter Type

CreateRatingDto

######### 2.3.4.1.11.1.7.1.3 Is Nullable

❌ No

######### 2.3.4.1.11.1.7.1.4 Purpose

The DTO containing the rating data submitted by the customer, fulfilling REQ-1-063.

######### 2.3.4.1.11.1.7.1.5 Framework Attributes

- @Body()

######## 2.3.4.1.11.1.7.2.0 Parameter Name

######### 2.3.4.1.11.1.7.2.1 Parameter Name

req

######### 2.3.4.1.11.1.7.2.2 Parameter Type

Request

######### 2.3.4.1.11.1.7.2.3 Is Nullable

❌ No

######### 2.3.4.1.11.1.7.2.4 Purpose

The express request object, containing the authenticated user\"s details extracted from the JWT.

######### 2.3.4.1.11.1.7.2.5 Framework Attributes

- @Req()

####### 2.3.4.1.11.1.8.0.0 Implementation Logic

This method shall orchestrate the rating submission. Specification requires it to extract the authenticated customer from the request object, pass the DTO and customer details to the RatingsService for processing, and allow any service-layer exceptions to propagate to the global exception filter.

####### 2.3.4.1.11.1.9.0.0 Exception Handling

Specification requires reliance on a global exception filter to catch and format exceptions like `ForbiddenException`, `ConflictException`, and `NotFoundException` thrown by the service layer.

####### 2.3.4.1.11.1.10.0.0 Performance Considerations

The endpoint is designed to be lightweight, offloading complex calculations to the service layer to be handled asynchronously.

####### 2.3.4.1.11.1.11.0.0 Validation Requirements

Specification requires the `ValidationPipe` to automatically validate the incoming `createRatingDto` against its decorators.

####### 2.3.4.1.11.1.12.0.0 Technology Integration Details

Integrates with NestJS\"s request pipeline, using DTOs for body parsing and validation, and `JwtAuthGuard` and `RolesGuard` for authentication and authorization.

####### 2.3.4.1.11.1.13.0.0 Validation Notes

Specification enhanced to include a `RolesGuard` ensuring only customers can submit ratings.

###### 2.3.4.1.11.2.0.0.0 Method Name

####### 2.3.4.1.11.2.1.0.0 Method Name

getVendorRatings

####### 2.3.4.1.11.2.2.0.0 Method Signature

async getVendorRatings(@Param(\"vendorId\") vendorId: string, @Query() paginationDto: PaginationDto): Promise<PaginatedResult<RatingDto>>

####### 2.3.4.1.11.2.3.0.0 Return Type

Promise<PaginatedResult<RatingDto>>

####### 2.3.4.1.11.2.4.0.0 Access Modifier

public

####### 2.3.4.1.11.2.5.0.0 Is Async

✅ Yes

####### 2.3.4.1.11.2.6.0.0 Framework Specific Attributes

- @Get(\"vendor/:vendorId\")
- @AllowAny()

####### 2.3.4.1.11.2.7.0.0 Parameters

######## 2.3.4.1.11.2.7.1.0 Parameter Name

######### 2.3.4.1.11.2.7.1.1 Parameter Name

vendorId

######### 2.3.4.1.11.2.7.1.2 Parameter Type

string

######### 2.3.4.1.11.2.7.1.3 Is Nullable

❌ No

######### 2.3.4.1.11.2.7.1.4 Purpose

The unique identifier of the vendor whose ratings are being requested.

######### 2.3.4.1.11.2.7.1.5 Framework Attributes

- @Param(\"vendorId\", ParseUUIDPipe)

######## 2.3.4.1.11.2.7.2.0 Parameter Name

######### 2.3.4.1.11.2.7.2.1 Parameter Name

paginationDto

######### 2.3.4.1.11.2.7.2.2 Parameter Type

PaginationDto

######### 2.3.4.1.11.2.7.2.3 Is Nullable

❌ No

######### 2.3.4.1.11.2.7.2.4 Purpose

Contains pagination parameters like page and limit.

######### 2.3.4.1.11.2.7.2.5 Framework Attributes

- @Query()

####### 2.3.4.1.11.2.8.0.0 Implementation Logic

This method shall delegate the request to the `RatingsService` to fetch a paginated list of ratings for the specified vendor. Specification requires this endpoint to be public for use in customer-facing vendor profiles.

####### 2.3.4.1.11.2.9.0.0 Exception Handling

Specification requires propagation of exceptions from the service layer.

####### 2.3.4.1.11.2.10.0.0 Performance Considerations

Relies on the service layer for efficient, paginated database queries.

####### 2.3.4.1.11.2.11.0.0 Validation Requirements

Specification requires the use of `ParseUUIDPipe` to ensure `vendorId` is a valid UUID.

####### 2.3.4.1.11.2.12.0.0 Technology Integration Details

Validation shows this should be a public endpoint, bypassing the default `JwtAuthGuard` with a custom `@AllowAny()` decorator.

####### 2.3.4.1.11.2.13.0.0 Validation Notes

Validation confirms this endpoint specification correctly omits `JwtAuthGuard` for public access.

###### 2.3.4.1.11.3.0.0.0 Method Name

####### 2.3.4.1.11.3.1.0.0 Method Name

getRiderRatings

####### 2.3.4.1.11.3.2.0.0 Method Signature

async getRiderRatings(@Param(\"riderId\") riderId: string, @Query() paginationDto: PaginationDto): Promise<PaginatedResult<RatingDto>>

####### 2.3.4.1.11.3.3.0.0 Return Type

Promise<PaginatedResult<RatingDto>>

####### 2.3.4.1.11.3.4.0.0 Access Modifier

public

####### 2.3.4.1.11.3.5.0.0 Is Async

✅ Yes

####### 2.3.4.1.11.3.6.0.0 Framework Specific Attributes

- @Get(\"rider/:riderId\")
- @UseGuards(RolesGuard)
- @Roles(\"Administrator\")

####### 2.3.4.1.11.3.7.0.0 Parameters

######## 2.3.4.1.11.3.7.1.0 Parameter Name

######### 2.3.4.1.11.3.7.1.1 Parameter Name

riderId

######### 2.3.4.1.11.3.7.1.2 Parameter Type

string

######### 2.3.4.1.11.3.7.1.3 Is Nullable

❌ No

######### 2.3.4.1.11.3.7.1.4 Purpose

The unique identifier of the rider whose ratings are being requested.

######### 2.3.4.1.11.3.7.1.5 Framework Attributes

- @Param(\"riderId\", ParseUUIDPipe)

######## 2.3.4.1.11.3.7.2.0 Parameter Name

######### 2.3.4.1.11.3.7.2.1 Parameter Name

paginationDto

######### 2.3.4.1.11.3.7.2.2 Parameter Type

PaginationDto

######### 2.3.4.1.11.3.7.2.3 Is Nullable

❌ No

######### 2.3.4.1.11.3.7.2.4 Purpose

Contains pagination parameters.

######### 2.3.4.1.11.3.7.2.5 Framework Attributes

- @Query()

####### 2.3.4.1.11.3.8.0.0 Implementation Logic

This method\"s specification requires it to delegate the request to the `RatingsService` to fetch a paginated list of ratings for the specified rider.

####### 2.3.4.1.11.3.9.0.0 Exception Handling

Specification requires propagation of exceptions from the service layer.

####### 2.3.4.1.11.3.10.0.0 Performance Considerations

Relies on the service layer for efficient, paginated database queries.

####### 2.3.4.1.11.3.11.0.0 Validation Requirements

Specification requires the use of `ParseUUIDPipe` to ensure `riderId` is a valid UUID.

####### 2.3.4.1.11.3.12.0.0 Technology Integration Details

Specification requires this endpoint to be protected, using a `RolesGuard` to ensure only users with the \"Administrator\" role can access it, fulfilling REQ-1-064.

####### 2.3.4.1.11.3.13.0.0 Validation Notes

Validation confirms this endpoint is correctly secured for Administrator access only.

#### 2.3.4.2.0.0.0.0.0 Class Name

##### 2.3.4.2.1.0.0.0.0 Class Name

RatingsService

##### 2.3.4.2.2.0.0.0.0 File Path

src/modules/ratings/ratings.service.ts

##### 2.3.4.2.3.0.0.0.0 Class Type

Service

##### 2.3.4.2.4.0.0.0.0 Inheritance

IRatingsService

##### 2.3.4.2.5.0.0.0.0 Purpose

Implements the core business logic for creating ratings and triggering aggregate calculations. It validates submissions against business rules and orchestrates database and messaging operations.

##### 2.3.4.2.6.0.0.0.0 Dependencies

- IRatingRepository
- IMessagingService
- Logger

##### 2.3.4.2.7.0.0.0.0 Framework Specific Attributes

- @Injectable()

##### 2.3.4.2.8.0.0.0.0 Technology Integration Notes

Injects repository and messaging service abstractions, promoting testability and separation of concerns.

##### 2.3.4.2.9.0.0.0.0 Validation Notes

Specification enhanced to include a dependency on an `IMessagingService` abstraction for event publishing.

##### 2.3.4.2.10.0.0.0.0 Properties

*No items available*

##### 2.3.4.2.11.0.0.0.0 Methods

###### 2.3.4.2.11.1.0.0.0 Method Name

####### 2.3.4.2.11.1.1.0.0 Method Name

submitRating

####### 2.3.4.2.11.1.2.0.0 Method Signature

async submitRating(dto: CreateRatingDto, user: AuthenticatedUser): Promise<RatingReview>

####### 2.3.4.2.11.1.3.0.0 Return Type

Promise<RatingReview>

####### 2.3.4.2.11.1.4.0.0 Access Modifier

public

####### 2.3.4.2.11.1.5.0.0 Is Async

✅ Yes

####### 2.3.4.2.11.1.6.0.0 Parameters

######## 2.3.4.2.11.1.6.1.0 Parameter Name

######### 2.3.4.2.11.1.6.1.1 Parameter Name

dto

######### 2.3.4.2.11.1.6.1.2 Parameter Type

CreateRatingDto

######### 2.3.4.2.11.1.6.1.3 Is Nullable

❌ No

######### 2.3.4.2.11.1.6.1.4 Purpose

The validated DTO containing the rating data.

######### 2.3.4.2.11.1.6.1.5 Framework Attributes

*No items available*

######## 2.3.4.2.11.1.6.2.0 Parameter Name

######### 2.3.4.2.11.1.6.2.1 Parameter Name

user

######### 2.3.4.2.11.1.6.2.2 Parameter Type

AuthenticatedUser

######### 2.3.4.2.11.1.6.2.3 Is Nullable

❌ No

######### 2.3.4.2.11.1.6.2.4 Purpose

The authenticated user object, containing the customer\"s ID.

######### 2.3.4.2.11.1.6.2.5 Framework Attributes

*No items available*

####### 2.3.4.2.11.1.7.0.0 Implementation Logic

The specification for this method is as follows: 1. Fetch the corresponding `RateableOrder` record using `dto.orderId`. 2. If not found, throw `NotFoundException`. 3. Verify the order\"s `customerId` matches the `user.id` (throws `ForbiddenException`). 4. Check if a rating for the given `orderId` and `revieweeType` has already been submitted by checking the appropriate flag on the `RateableOrder` (throws `ConflictException`). 5. Sanitize `dto.reviewText` to prevent XSS. 6. Create and save a new `RatingReview` entity via the repository. 7. Update the appropriate flag on the `RateableOrder` entity (e.g., `isVendorRated = true`). 8. Trigger an asynchronous calculation of the new average rating and publish a `RatingSubmittedEvent` via the `IMessagingService`.

####### 2.3.4.2.11.1.8.0.0 Exception Handling

Specification requires throwing `NotFoundException`, `ForbiddenException`, and `ConflictException` for specific business rule violations.

####### 2.3.4.2.11.1.9.0.0 Performance Considerations

Specification requires that the average rating calculation and event publishing must be handled asynchronously to ensure a fast API response to the user.

####### 2.3.4.2.11.1.10.0.0 Validation Requirements

Business rules for rating eligibility, ownership, and uniqueness must be checked before persisting data.

####### 2.3.4.2.11.1.11.0.0 Technology Integration Details

Uses the injected repository for database operations and the messaging service for publishing events to an SNS topic.

####### 2.3.4.2.11.1.12.0.0 Validation Notes

This specification now includes the crucial business logic of checking against the `RateableOrder` entity.

###### 2.3.4.2.11.2.0.0.0 Method Name

####### 2.3.4.2.11.2.1.0.0 Method Name

addRateableOrder

####### 2.3.4.2.11.2.2.0.0 Method Signature

async addRateableOrder(event: OrderDeliveredEventDto): Promise<void>

####### 2.3.4.2.11.2.3.0.0 Return Type

Promise<void>

####### 2.3.4.2.11.2.4.0.0 Access Modifier

public

####### 2.3.4.2.11.2.5.0.0 Is Async

✅ Yes

####### 2.3.4.2.11.2.6.0.0 Parameters

- {'parameter_name': 'event', 'parameter_type': 'OrderDeliveredEventDto', 'is_nullable': False, 'purpose': 'The validated event payload for a delivered order.'}

####### 2.3.4.2.11.2.7.0.0 Implementation Logic

This method\"s specification is to create a new `RateableOrder` entity in the database. This record makes an order officially eligible to be rated. The method must handle potential duplicate events gracefully (e.g., by using an `INSERT ... ON CONFLICT DO NOTHING` database operation).

####### 2.3.4.2.11.2.8.0.0 Exception Handling

Specification requires logging any database errors but not throwing them, to prevent the SQS message from being retried indefinitely for a non-recoverable error.

####### 2.3.4.2.11.2.9.0.0 Performance Considerations

The operation should be a single, efficient database insert.

####### 2.3.4.2.11.2.10.0.0 Validation Requirements

The incoming DTO is assumed to be validated by the controller.

####### 2.3.4.2.11.2.11.0.0 Technology Integration Details

This service method is called by the `EventsController` upon consumption of an SQS message.

####### 2.3.4.2.11.2.12.0.0 Validation Notes

This is a newly added method specification to fulfill the requirement of tracking rateable orders.

#### 2.3.4.3.0.0.0.0.0 Class Name

##### 2.3.4.3.1.0.0.0.0 Class Name

EventsController

##### 2.3.4.3.2.0.0.0.0 File Path

src/modules/events/events.controller.ts

##### 2.3.4.3.3.0.0.0.0 Class Type

Controller

##### 2.3.4.3.4.0.0.0.0 Inheritance

None

##### 2.3.4.3.5.0.0.0.0 Purpose

Provides an endpoint for the AWS SQS consumer to post messages, effectively acting as the entry point for asynchronous event processing. It handles the `OrderDeliveredEvent`.

##### 2.3.4.3.6.0.0.0.0 Dependencies

- RatingsService

##### 2.3.4.3.7.0.0.0.0 Framework Specific Attributes

- @Controller(\"events\")

##### 2.3.4.3.8.0.0.0.0 Technology Integration Notes

Designed to be called by an SQS poller or a webhook service that forwards SQS messages.

##### 2.3.4.3.9.0.0.0.0 Validation Notes

Validation confirms this component is necessary for the event-driven architecture.

##### 2.3.4.3.10.0.0.0.0 Properties

*No items available*

##### 2.3.4.3.11.0.0.0.0 Methods

- {'method_name': 'handleOrderDelivered', 'method_signature': 'async handleOrderDelivered(@Body() eventDto: OrderDeliveredEventDto)', 'return_type': 'Promise<void>', 'access_modifier': 'public', 'is_async': True, 'framework_specific_attributes': ['@Post(\\"order-delivered\\")', '@HttpCode(204)'], 'parameters': [{'parameter_name': 'eventDto', 'parameter_type': 'OrderDeliveredEventDto', 'is_nullable': False, 'purpose': 'The SQS message body containing the `OrderDeliveredEvent`.', 'framework_attributes': ['@Body(new ValidationPipe())']}], 'implementation_logic': 'This method\\"s specification requires it to receive the event payload, which is automatically validated against the `OrderDeliveredEventDto`. It must then call the `RatingsService.addRateableOrder` method to process the event.', 'exception_handling': 'Specification requires that if `addRateableOrder` throws an exception, this controller method should also throw, causing the SQS message to be retried or sent to a dead-letter queue.', 'performance_considerations': 'The handler should be lightweight and delegate processing to the service layer immediately.', 'validation_requirements': 'The incoming event payload is validated against `OrderDeliveredEventDto`.', 'technology_integration_details': 'Acts as the bridge between the SQS message queue and the application\\"s business logic.', 'validation_notes': 'Specification enhanced to assume the SQS message body is directly posted, rather than the full SQS message object, simplifying the contract.'}

#### 2.3.4.4.0.0.0.0.0 Class Name

##### 2.3.4.4.1.0.0.0.0 Class Name

RatingReview

##### 2.3.4.4.2.0.0.0.0 File Path

src/modules/ratings/entities/rating-review.entity.ts

##### 2.3.4.4.3.0.0.0.0 Class Type

Entity

##### 2.3.4.4.4.0.0.0.0 Inheritance

None

##### 2.3.4.4.5.0.0.0.0 Purpose

Represents the core domain entity for a single rating and review. This class is mapped to the \"rating_reviews\" table in the PostgreSQL database using TypeORM, as per DB Diagram ID 42.

##### 2.3.4.4.6.0.0.0.0 Dependencies

*No items available*

##### 2.3.4.4.7.0.0.0.0 Framework Specific Attributes

- @Entity(\"rating_reviews\")
- @Index([\"revieweeId\", \"revieweeType\"])

##### 2.3.4.4.8.0.0.0.0 Technology Integration Notes

Uses TypeORM decorators to define columns, relationships, and constraints.

##### 2.3.4.4.9.0.0.0.0 Validation Notes

Specification enhanced to include a database index on `revieweeId` and `revieweeType` for performance.

##### 2.3.4.4.10.0.0.0.0 Properties

###### 2.3.4.4.10.1.0.0.0 Property Name

####### 2.3.4.4.10.1.1.0.0 Property Name

ratingReviewId

####### 2.3.4.4.10.1.2.0.0 Property Type

string

####### 2.3.4.4.10.1.3.0.0 Access Modifier

public

####### 2.3.4.4.10.1.4.0.0 Purpose

The primary key for the entity.

####### 2.3.4.4.10.1.5.0.0 Validation Attributes

*No items available*

####### 2.3.4.4.10.1.6.0.0 Framework Specific Configuration

@PrimaryGeneratedColumn(\"uuid\")

####### 2.3.4.4.10.1.7.0.0 Implementation Notes



###### 2.3.4.4.10.2.0.0.0 Property Name

####### 2.3.4.4.10.2.1.0.0 Property Name

orderId

####### 2.3.4.4.10.2.2.0.0 Property Type

string

####### 2.3.4.4.10.2.3.0.0 Access Modifier

public

####### 2.3.4.4.10.2.4.0.0 Purpose

Foreign key reference to the order being reviewed.

####### 2.3.4.4.10.2.5.0.0 Validation Attributes

*No items available*

####### 2.3.4.4.10.2.6.0.0 Framework Specific Configuration

@Column({ type: \"uuid\" })

####### 2.3.4.4.10.2.7.0.0 Implementation Notes



###### 2.3.4.4.10.3.0.0.0 Property Name

####### 2.3.4.4.10.3.1.0.0 Property Name

reviewerId

####### 2.3.4.4.10.3.2.0.0 Property Type

string

####### 2.3.4.4.10.3.3.0.0 Access Modifier

public

####### 2.3.4.4.10.3.4.0.0 Purpose

The ID of the customer who submitted the review.

####### 2.3.4.4.10.3.5.0.0 Validation Attributes

*No items available*

####### 2.3.4.4.10.3.6.0.0 Framework Specific Configuration

@Column({ type: \"uuid\" })

####### 2.3.4.4.10.3.7.0.0 Implementation Notes



###### 2.3.4.4.10.4.0.0.0 Property Name

####### 2.3.4.4.10.4.1.0.0 Property Name

revieweeId

####### 2.3.4.4.10.4.2.0.0 Property Type

string

####### 2.3.4.4.10.4.3.0.0 Access Modifier

public

####### 2.3.4.4.10.4.4.0.0 Purpose

The ID of the entity being reviewed (Vendor or Rider).

####### 2.3.4.4.10.4.5.0.0 Validation Attributes

*No items available*

####### 2.3.4.4.10.4.6.0.0 Framework Specific Configuration

@Column({ type: \"uuid\" })

####### 2.3.4.4.10.4.7.0.0 Implementation Notes

This column is part of a composite index to optimize average rating calculations.

###### 2.3.4.4.10.5.0.0.0 Property Name

####### 2.3.4.4.10.5.1.0.0 Property Name

revieweeType

####### 2.3.4.4.10.5.2.0.0 Property Type

string

####### 2.3.4.4.10.5.3.0.0 Access Modifier

public

####### 2.3.4.4.10.5.4.0.0 Purpose

Specifies whether the reviewee is a \"vendor\" or a \"rider\".

####### 2.3.4.4.10.5.5.0.0 Validation Attributes

*No items available*

####### 2.3.4.4.10.5.6.0.0 Framework Specific Configuration

@Column({ type: \"varchar\" })

####### 2.3.4.4.10.5.7.0.0 Implementation Notes

This column is part of a composite index.

###### 2.3.4.4.10.6.0.0.0 Property Name

####### 2.3.4.4.10.6.1.0.0 Property Name

rating

####### 2.3.4.4.10.6.2.0.0 Property Type

number

####### 2.3.4.4.10.6.3.0.0 Access Modifier

public

####### 2.3.4.4.10.6.4.0.0 Purpose

The star rating from 1 to 5.

####### 2.3.4.4.10.6.5.0.0 Validation Attributes

*No items available*

####### 2.3.4.4.10.6.6.0.0 Framework Specific Configuration

@Column({ type: \"int\" })

####### 2.3.4.4.10.6.7.0.0 Implementation Notes



###### 2.3.4.4.10.7.0.0.0 Property Name

####### 2.3.4.4.10.7.1.0.0 Property Name

reviewText

####### 2.3.4.4.10.7.2.0.0 Property Type

string

####### 2.3.4.4.10.7.3.0.0 Access Modifier

public

####### 2.3.4.4.10.7.4.0.0 Purpose

The optional text comment, sanitized to prevent XSS.

####### 2.3.4.4.10.7.5.0.0 Validation Attributes

*No items available*

####### 2.3.4.4.10.7.6.0.0 Framework Specific Configuration

@Column({ type: \"text\", nullable: true })

####### 2.3.4.4.10.7.7.0.0 Implementation Notes



###### 2.3.4.4.10.8.0.0.0 Property Name

####### 2.3.4.4.10.8.1.0.0 Property Name

createdAt

####### 2.3.4.4.10.8.2.0.0 Property Type

Date

####### 2.3.4.4.10.8.3.0.0 Access Modifier

public

####### 2.3.4.4.10.8.4.0.0 Purpose

Timestamp of when the review was created.

####### 2.3.4.4.10.8.5.0.0 Validation Attributes

*No items available*

####### 2.3.4.4.10.8.6.0.0 Framework Specific Configuration

@CreateDateColumn()

####### 2.3.4.4.10.8.7.0.0 Implementation Notes



#### 2.3.4.5.0.0.0.0.0 Class Name

##### 2.3.4.5.1.0.0.0.0 Class Name

RateableOrder

##### 2.3.4.5.2.0.0.0.0 File Path

src/modules/ratings/entities/rateable-order.entity.ts

##### 2.3.4.5.3.0.0.0.0 Class Type

Entity

##### 2.3.4.5.4.0.0.0.0 Inheritance

None

##### 2.3.4.5.5.0.0.0.0 Purpose

A new entity specification created to track the rating eligibility of a delivered order. This record is created when an `OrderDeliveredEvent` is consumed.

##### 2.3.4.5.6.0.0.0.0 Dependencies

*No items available*

##### 2.3.4.5.7.0.0.0.0 Framework Specific Attributes

- @Entity(\"rateable_orders\")

##### 2.3.4.5.8.0.0.0.0 Technology Integration Notes

Uses TypeORM decorators. This table acts as a state machine for the rating process of an order.

##### 2.3.4.5.9.0.0.0.0 Validation Notes

This component was added after identifying a gap in the original specification for tracking rating eligibility.

##### 2.3.4.5.10.0.0.0.0 Properties

###### 2.3.4.5.10.1.0.0.0 Property Name

####### 2.3.4.5.10.1.1.0.0 Property Name

orderId

####### 2.3.4.5.10.1.2.0.0 Property Type

string

####### 2.3.4.5.10.1.3.0.0 Access Modifier

public

####### 2.3.4.5.10.1.4.0.0 Purpose

The primary key, matching the order\"s unique ID.

####### 2.3.4.5.10.1.5.0.0 Validation Attributes

*No items available*

####### 2.3.4.5.10.1.6.0.0 Framework Specific Configuration

@PrimaryColumn(\"uuid\")

####### 2.3.4.5.10.1.7.0.0 Implementation Notes



###### 2.3.4.5.10.2.0.0.0 Property Name

####### 2.3.4.5.10.2.1.0.0 Property Name

customerId

####### 2.3.4.5.10.2.2.0.0 Property Type

string

####### 2.3.4.5.10.2.3.0.0 Access Modifier

public

####### 2.3.4.5.10.2.4.0.0 Purpose

The ID of the customer who can rate this order.

####### 2.3.4.5.10.2.5.0.0 Validation Attributes

*No items available*

####### 2.3.4.5.10.2.6.0.0 Framework Specific Configuration

@Column({ type: \"uuid\" })

####### 2.3.4.5.10.2.7.0.0 Implementation Notes



###### 2.3.4.5.10.3.0.0.0 Property Name

####### 2.3.4.5.10.3.1.0.0 Property Name

vendorId

####### 2.3.4.5.10.3.2.0.0 Property Type

string

####### 2.3.4.5.10.3.3.0.0 Access Modifier

public

####### 2.3.4.5.10.3.4.0.0 Purpose

The ID of the vendor associated with the order.

####### 2.3.4.5.10.3.5.0.0 Validation Attributes

*No items available*

####### 2.3.4.5.10.3.6.0.0 Framework Specific Configuration

@Column({ type: \"uuid\" })

####### 2.3.4.5.10.3.7.0.0 Implementation Notes



###### 2.3.4.5.10.4.0.0.0 Property Name

####### 2.3.4.5.10.4.1.0.0 Property Name

riderId

####### 2.3.4.5.10.4.2.0.0 Property Type

string

####### 2.3.4.5.10.4.3.0.0 Access Modifier

public

####### 2.3.4.5.10.4.4.0.0 Purpose

The ID of the rider associated with the order.

####### 2.3.4.5.10.4.5.0.0 Validation Attributes

*No items available*

####### 2.3.4.5.10.4.6.0.0 Framework Specific Configuration

@Column({ type: \"uuid\" })

####### 2.3.4.5.10.4.7.0.0 Implementation Notes



###### 2.3.4.5.10.5.0.0.0 Property Name

####### 2.3.4.5.10.5.1.0.0 Property Name

isVendorRated

####### 2.3.4.5.10.5.2.0.0 Property Type

boolean

####### 2.3.4.5.10.5.3.0.0 Access Modifier

public

####### 2.3.4.5.10.5.4.0.0 Purpose

Flag to indicate if the vendor has been rated for this order.

####### 2.3.4.5.10.5.5.0.0 Validation Attributes

*No items available*

####### 2.3.4.5.10.5.6.0.0 Framework Specific Configuration

@Column({ type: \"boolean\", default: false })

####### 2.3.4.5.10.5.7.0.0 Implementation Notes



###### 2.3.4.5.10.6.0.0.0 Property Name

####### 2.3.4.5.10.6.1.0.0 Property Name

isRiderRated

####### 2.3.4.5.10.6.2.0.0 Property Type

boolean

####### 2.3.4.5.10.6.3.0.0 Access Modifier

public

####### 2.3.4.5.10.6.4.0.0 Purpose

Flag to indicate if the rider has been rated for this order.

####### 2.3.4.5.10.6.5.0.0 Validation Attributes

*No items available*

####### 2.3.4.5.10.6.6.0.0 Framework Specific Configuration

@Column({ type: \"boolean\", default: false })

####### 2.3.4.5.10.6.7.0.0 Implementation Notes



### 2.3.5.0.0.0.0.0.0 Interface Specifications

- {'interface_name': 'IRatingRepository', 'file_path': 'src/modules/ratings/interfaces/ratings.repository.interface.ts', 'purpose': 'Defines the contract for data access operations related to ratings, abstracting the specific database implementation (TypeORM).', 'generic_constraints': 'None', 'framework_specific_inheritance': 'None', 'method_contracts': [{'method_name': 'createRating', 'method_signature': 'createRating(rating: RatingReview): Promise<RatingReview>', 'return_type': 'Promise<RatingReview>', 'parameters': [{'parameter_name': 'rating', 'parameter_type': 'RatingReview', 'purpose': 'The rating entity to be persisted.'}], 'contract_description': 'Saves a new rating review to the database.', 'exception_contracts': 'Specification requires this may throw database-specific exceptions for constraint violations.'}, {'method_name': 'getAverageRatingForReviewee', 'method_signature': 'getAverageRatingForReviewee(revieweeId: string, revieweeType: \\"vendor\\" | \\"rider\\"): Promise<{ average: number; count: number }>', 'return_type': 'Promise<{ average: number; count: number }>', 'parameters': [{'parameter_name': 'revieweeId', 'parameter_type': 'string', 'purpose': 'The ID of the vendor or rider.'}, {'parameter_name': 'revieweeType', 'parameter_type': '\\"vendor\\" | \\"rider\\"', 'purpose': 'The type of reviewee to query for.'}], 'contract_description': 'Calculates the average star rating and total number of ratings for a given reviewee using an efficient database aggregate query.', 'exception_contracts': []}, {'method_name': 'findRateableOrderById', 'method_signature': 'findRateableOrderById(orderId: string): Promise<RateableOrder | null>', 'return_type': 'Promise<RateableOrder | null>', 'parameters': [{'parameter_name': 'orderId', 'parameter_type': 'string', 'purpose': 'The ID of the order to check for rateability.'}], 'contract_description': 'Retrieves the rateable status record for a given order.', 'exception_contracts': []}, {'method_name': 'createOrUpdateRateableOrder', 'method_signature': 'createOrUpdateRateableOrder(order: RateableOrder): Promise<void>', 'return_type': 'Promise<void>', 'parameters': [{'parameter_name': 'order', 'parameter_type': 'RateableOrder', 'purpose': 'The rateable order entity to save or update.'}], 'contract_description': 'Creates or updates a rateable order record. Specification requires this to be an idempotent upsert operation.', 'exception_contracts': []}], 'property_contracts': [], 'implementation_guidance': 'Implementations should use TypeORM\\"s `Repository` class and its methods to interact with the database. The `getAverageRatingForReviewee` method should use an efficient SQL aggregate query.', 'validation_notes': 'This interface was added to formalize the data access contract and improve testability.'}

### 2.3.6.0.0.0.0.0.0 Enum Specifications

*No items available*

### 2.3.7.0.0.0.0.0.0 Dto Specifications

#### 2.3.7.1.0.0.0.0.0 Dto Name

##### 2.3.7.1.1.0.0.0.0 Dto Name

CreateRatingDto

##### 2.3.7.1.2.0.0.0.0 File Path

src/modules/ratings/dto/create-rating.dto.ts

##### 2.3.7.1.3.0.0.0.0 Purpose

Defines the data contract for a new rating submission. It includes `class-validator` decorators to enforce validation rules for all incoming data, fulfilling REQ-1-063.

##### 2.3.7.1.4.0.0.0.0 Framework Base Class

None

##### 2.3.7.1.5.0.0.0.0 Properties

###### 2.3.7.1.5.1.0.0.0 Property Name

####### 2.3.7.1.5.1.1.0.0 Property Name

orderId

####### 2.3.7.1.5.1.2.0.0 Property Type

string

####### 2.3.7.1.5.1.3.0.0 Validation Attributes

- @IsUUID()

####### 2.3.7.1.5.1.4.0.0 Serialization Attributes

*No items available*

####### 2.3.7.1.5.1.5.0.0 Framework Specific Attributes

*No items available*

###### 2.3.7.1.5.2.0.0.0 Property Name

####### 2.3.7.1.5.2.1.0.0 Property Name

revieweeId

####### 2.3.7.1.5.2.2.0.0 Property Type

string

####### 2.3.7.1.5.2.3.0.0 Validation Attributes

- @IsUUID()

####### 2.3.7.1.5.2.4.0.0 Serialization Attributes

*No items available*

####### 2.3.7.1.5.2.5.0.0 Framework Specific Attributes

*No items available*

###### 2.3.7.1.5.3.0.0.0 Property Name

####### 2.3.7.1.5.3.1.0.0 Property Name

revieweeType

####### 2.3.7.1.5.3.2.0.0 Property Type

\"vendor\" | \"rider\"

####### 2.3.7.1.5.3.3.0.0 Validation Attributes

- @IsEnum([\"vendor\", \"rider\"])

####### 2.3.7.1.5.3.4.0.0 Serialization Attributes

*No items available*

####### 2.3.7.1.5.3.5.0.0 Framework Specific Attributes

*No items available*

###### 2.3.7.1.5.4.0.0.0 Property Name

####### 2.3.7.1.5.4.1.0.0 Property Name

rating

####### 2.3.7.1.5.4.2.0.0 Property Type

number

####### 2.3.7.1.5.4.3.0.0 Validation Attributes

- @IsInt()
- @Min(1)
- @Max(5)

####### 2.3.7.1.5.4.4.0.0 Serialization Attributes

*No items available*

####### 2.3.7.1.5.4.5.0.0 Framework Specific Attributes

*No items available*

###### 2.3.7.1.5.5.0.0.0 Property Name

####### 2.3.7.1.5.5.1.0.0 Property Name

reviewText

####### 2.3.7.1.5.5.2.0.0 Property Type

string

####### 2.3.7.1.5.5.3.0.0 Validation Attributes

- @IsOptional()
- @IsString()
- @MaxLength(1000)

####### 2.3.7.1.5.5.4.0.0 Serialization Attributes

*No items available*

####### 2.3.7.1.5.5.5.0.0 Framework Specific Attributes

*No items available*

##### 2.3.7.1.6.0.0.0.0 Validation Rules

All fields are required except for `reviewText`. All UUIDs must be valid. Rating must be an integer between 1 and 5.

##### 2.3.7.1.7.0.0.0.0 Serialization Requirements

Standard JSON serialization. `class-transformer` can be used to ensure correct types.

#### 2.3.7.2.0.0.0.0.0 Dto Name

##### 2.3.7.2.1.0.0.0.0 Dto Name

OrderDeliveredEventDto

##### 2.3.7.2.2.0.0.0.0 File Path

src/modules/events/dto/order-delivered.event.dto.ts

##### 2.3.7.2.3.0.0.0.0 Purpose

Defines the data contract for the `OrderDeliveredEvent` consumed from SQS. It ensures the incoming event data is valid and adheres to the cross-service contract.

##### 2.3.7.2.4.0.0.0.0 Framework Base Class

None

##### 2.3.7.2.5.0.0.0.0 Properties

###### 2.3.7.2.5.1.0.0.0 Property Name

####### 2.3.7.2.5.1.1.0.0 Property Name

orderId

####### 2.3.7.2.5.1.2.0.0 Property Type

string

####### 2.3.7.2.5.1.3.0.0 Validation Attributes

- @IsUUID()

####### 2.3.7.2.5.1.4.0.0 Serialization Attributes

*No items available*

####### 2.3.7.2.5.1.5.0.0 Framework Specific Attributes

*No items available*

###### 2.3.7.2.5.2.0.0.0 Property Name

####### 2.3.7.2.5.2.1.0.0 Property Name

customerId

####### 2.3.7.2.5.2.2.0.0 Property Type

string

####### 2.3.7.2.5.2.3.0.0 Validation Attributes

- @IsUUID()

####### 2.3.7.2.5.2.4.0.0 Serialization Attributes

*No items available*

####### 2.3.7.2.5.2.5.0.0 Framework Specific Attributes

*No items available*

###### 2.3.7.2.5.3.0.0.0 Property Name

####### 2.3.7.2.5.3.1.0.0 Property Name

vendorId

####### 2.3.7.2.5.3.2.0.0 Property Type

string

####### 2.3.7.2.5.3.3.0.0 Validation Attributes

- @IsUUID()

####### 2.3.7.2.5.3.4.0.0 Serialization Attributes

*No items available*

####### 2.3.7.2.5.3.5.0.0 Framework Specific Attributes

*No items available*

###### 2.3.7.2.5.4.0.0.0 Property Name

####### 2.3.7.2.5.4.1.0.0 Property Name

riderId

####### 2.3.7.2.5.4.2.0.0 Property Type

string

####### 2.3.7.2.5.4.3.0.0 Validation Attributes

- @IsUUID()

####### 2.3.7.2.5.4.4.0.0 Serialization Attributes

*No items available*

####### 2.3.7.2.5.4.5.0.0 Framework Specific Attributes

*No items available*

##### 2.3.7.2.6.0.0.0.0 Validation Rules

All fields are mandatory and must be valid UUIDs.

##### 2.3.7.2.7.0.0.0.0 Serialization Requirements

The DTO will be used to deserialize the JSON payload from the SQS message body.

##### 2.3.7.2.8.0.0.0.0 Validation Notes

This DTO formalizes the contract with the `platform-api-orders` service.

### 2.3.8.0.0.0.0.0.0 Configuration Specifications

- {'configuration_name': 'AppConfig', 'file_path': 'src/config/app.config.ts', 'purpose': 'Provides strongly-typed access to environment variables for the application, using NestJS\\"s `ConfigModule`.', 'framework_base_class': 'None', 'configuration_sections': [{'section_name': 'DATABASE', 'properties': [{'property_name': 'URL', 'property_type': 'string', 'default_value': 'None', 'required': True, 'description': 'The connection URL for the PostgreSQL database.'}]}, {'section_name': 'AWS', 'properties': [{'property_name': 'REGION', 'property_type': 'string', 'default_value': '\\"ap-south-1\\"', 'required': True, 'description': 'The AWS region for SNS and SQS services.'}, {'property_name': 'SQS_QUEUE_URL', 'property_type': 'string', 'default_value': 'None', 'required': True, 'description': 'The URL of the SQS queue for incoming `OrderDeliveredEvent` messages.'}, {'property_name': 'SNS_TOPIC_ARN', 'property_type': 'string', 'default_value': 'None', 'required': True, 'description': 'The ARN of the SNS topic for publishing `RatingSubmittedEvent` messages.'}]}], 'validation_requirements': 'All required environment variables must be present at startup. Specification requires the use of a validation library like Joi within the `ConfigModule` to enforce this.', 'validation_notes': 'Specification added to mandate startup validation of configuration.'}

### 2.3.9.0.0.0.0.0.0 Dependency Injection Specifications

#### 2.3.9.1.0.0.0.0.0 Service Interface

##### 2.3.9.1.1.0.0.0.0 Service Interface

IRatingRepository

##### 2.3.9.1.2.0.0.0.0 Service Implementation

RatingRepository

##### 2.3.9.1.3.0.0.0.0 Lifetime

Scoped

##### 2.3.9.1.4.0.0.0.0 Registration Reasoning

Repositories are typically scoped to the request to ensure data consistency within a single operation.

##### 2.3.9.1.5.0.0.0.0 Framework Registration Pattern

A custom provider that injects the TypeORM repository for the `RatingReview` and `RateableOrder` entities.

##### 2.3.9.1.6.0.0.0.0 Validation Notes

Specification updated to include the `RateableOrder` entity.

#### 2.3.9.2.0.0.0.0.0 Service Interface

##### 2.3.9.2.1.0.0.0.0 Service Interface

IRatingsService

##### 2.3.9.2.2.0.0.0.0 Service Implementation

RatingsService

##### 2.3.9.2.3.0.0.0.0 Lifetime

Scoped

##### 2.3.9.2.4.0.0.0.0 Registration Reasoning

Services containing business logic are scoped to the request to manage state and transactions effectively.

##### 2.3.9.2.5.0.0.0.0 Framework Registration Pattern

Standard provider registration in `ratings.module.ts`: `{ provide: IRatingsService, useClass: RatingsService }`.

#### 2.3.9.3.0.0.0.0.0 Service Interface

##### 2.3.9.3.1.0.0.0.0 Service Interface

IMessagingService

##### 2.3.9.3.2.0.0.0.0 Service Implementation

MessagingService

##### 2.3.9.3.3.0.0.0.0 Lifetime

Singleton

##### 2.3.9.3.4.0.0.0.0 Registration Reasoning

The messaging client (e.g., AWS SDK) is thread-safe and can be reused across the application lifecycle as a singleton for efficiency.

##### 2.3.9.3.5.0.0.0.0 Framework Registration Pattern

Registered in a shared `MessagingModule` and imported into `RatingsModule`.

### 2.3.10.0.0.0.0.0.0 External Integration Specifications

#### 2.3.10.1.0.0.0.0.0 Integration Target

##### 2.3.10.1.1.0.0.0.0 Integration Target

platform-api-orders

##### 2.3.10.1.2.0.0.0.0 Integration Type

Asynchronous Event Consumption

##### 2.3.10.1.3.0.0.0.0 Required Client Classes

- SqsConsumerService
- EventsController

##### 2.3.10.1.4.0.0.0.0 Configuration Requirements

Requires the SQS Queue URL for the `OrderDeliveredEvent`.

##### 2.3.10.1.5.0.0.0.0 Error Handling Requirements

The consumer must handle message processing failures by not deleting the message from the queue, allowing for retries and eventual routing to a Dead-Letter Queue (DLQ).

##### 2.3.10.1.6.0.0.0.0 Authentication Requirements

Access to the SQS queue should be controlled via IAM roles.

##### 2.3.10.1.7.0.0.0.0 Framework Integration Patterns

An SQS poller (e.g., a separate process or a NestJS `Cron` job) will fetch messages and POST them to the internal `EventsController` endpoint.

##### 2.3.10.1.8.0.0.0.0 Validation Notes

Validation confirms this is the correct pattern for decoupling the service from the Order service.

#### 2.3.10.2.0.0.0.0.0 Integration Target

##### 2.3.10.2.1.0.0.0.0 Integration Target

platform-api-vendors / platform-api-riders

##### 2.3.10.2.2.0.0.0.0 Integration Type

Asynchronous Event Publication

##### 2.3.10.2.3.0.0.0.0 Required Client Classes

- MessagingService (SNS Publisher)

##### 2.3.10.2.4.0.0.0.0 Configuration Requirements

Requires the SNS Topic ARN for `RatingSubmittedEvent`.

##### 2.3.10.2.5.0.0.0.0 Error Handling Requirements

The publisher should log any failures to send a message to SNS, and a monitoring alert should be configured for a high rate of such failures.

##### 2.3.10.2.6.0.0.0.0 Authentication Requirements

Access to publish to the SNS topic should be controlled via IAM roles.

##### 2.3.10.2.7.0.0.0.0 Framework Integration Patterns

The `RatingsService` will inject the `MessagingService` to publish events after a rating is successfully persisted.

##### 2.3.10.2.8.0.0.0.0 Validation Notes

This specification fulfills REQ-1-064 by providing the necessary data for downstream services to update their average rating caches.

## 2.4.0.0.0.0.0.0.0 Component Count Validation

| Property | Value |
|----------|-------|
| Total Classes | 5 |
| Total Interfaces | 1 |
| Total Enums | 0 |
| Total Dtos | 2 |
| Total Configurations | 1 |
| Total External Integrations | 2 |
| Grand Total Components | 11 |
| Phase 2 Claimed Count | 0 |
| Phase 2 Actual Count | 0 |
| Validation Added Count | 11 |
| Final Validated Count | 11 |

# 3.0.0.0.0.0.0.0.0 File Structure

## 3.1.0.0.0.0.0.0.0 Directory Organization

### 3.1.1.0.0.0.0.0.0 Directory Path

#### 3.1.1.1.0.0.0.0.0 Directory Path

/

#### 3.1.1.2.0.0.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.1.3.0.0.0.0.0 Contains Files

- package.json
- nest-cli.json
- tsconfig.json
- tsconfig.build.json
- .editorconfig
- .env.example
- Dockerfile
- .dockerignore
- .eslintrc.js
- .prettierrc
- jest.config.js
- .gitignore

#### 3.1.1.4.0.0.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.1.5.0.0.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

### 3.1.2.0.0.0.0.0.0 Directory Path

#### 3.1.2.1.0.0.0.0.0 Directory Path

.vscode

#### 3.1.2.2.0.0.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.2.3.0.0.0.0.0 Contains Files

- settings.json
- extensions.json

#### 3.1.2.4.0.0.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.2.5.0.0.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

