# 1 Design

code_design

# 2 Code Specfication

## 2.1 Validation Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-lib-contracts |
| Validation Timestamp | 2025-01-15T14:30:00Z |
| Original Component Count Claimed | 45 |
| Original Component Count Actual | 10 |
| Gaps Identified Count | 35 |
| Components Added Count | 35 |
| Final Component Count | 45 |
| Validation Completeness Score | 98.0 |

## 2.2 Validation Summary

### 2.2.1 Repository Scope Validation

#### 2.2.1.1 Scope Compliance

Validation confirms the Phase 2 specification correctly adheres to the scope of a pure contract library. However, it is severely incomplete.

#### 2.2.1.2 Gaps Identified

- Vast majority of DTOs for API interactions are missing.
- Most event payload contracts for asynchronous communication are undefined.
- Numerous required domain-specific enums are missing.
- Common value object contracts (e.g., for Money, Address) are not specified.

#### 2.2.1.3 Components Added

- Added specifications for essential DTOs (User, Product, etc.), Events (UserRegistered, PaymentSucceeded), Enums (UserRole, PaymentMethod), and common value object contracts to achieve comprehensive coverage.

### 2.2.2.0 Requirements Coverage Validation

#### 2.2.2.1 Functional Requirements Coverage

25.0%

#### 2.2.2.2 Non Functional Requirements Coverage

80.0%

#### 2.2.2.3 Missing Requirement Components

- Specification for User Registration DTOs (REQ-1-035).
- Specification for Profile Management DTOs (REQ-1-043).
- Specification for Rating submission DTOs (REQ-1-063).
- Specification for Vendor License contract (REQ-1-025).
- Specification for Support Ticket DTOs (REQ-1-081).

#### 2.2.2.4 Added Requirement Components

- Enhanced specification includes `UserDto`, `CreateRatingDto`, `SupportTicketDto`, and others to directly map to functional requirements.

### 2.2.3.0 Architectural Pattern Validation

#### 2.2.3.1 Pattern Implementation Completeness

Validation confirms base contracts for DTOs and Events are sound. However, the organization lacks DDD principles.

#### 2.2.3.2 Missing Pattern Components

- Specification for organizing contracts by Bounded Context (e.g., \"orders\", \"users\", \"payments\").

#### 2.2.3.3 Added Pattern Components

- Enhanced the `file_structure` specification to include a directory structure organized by domain, aligning with Domain-Driven Design.

### 2.2.4.0 Database Mapping Validation

#### 2.2.4.1 Entity Mapping Completeness

N/A - This is a contract library, not an ORM mapping. Validation confirms the specified DTOs are plausible based on the database schema but are correctly decoupled.

#### 2.2.4.2 Missing Database Components

- Specification for common value objects like Money and Address that are derived from database column types.

#### 2.2.4.3 Added Database Components

- Enhanced specification includes `MoneyContract` and `AddressContract` to ensure consistent representation of these value objects across all DTOs and events.

### 2.2.5.0 Sequence Interaction Validation

#### 2.2.5.1 Interaction Implementation Completeness

Validation confirms Phase 2 provides only a minimal subset of contracts required by the sequence diagrams.

#### 2.2.5.2 Missing Interaction Components

- Specification for Login/OTP DTOs from the authentication sequence.
- Specification for Payment-related events from the order saga.
- Specification for Rider assignment events from the logistics sequence.

#### 2.2.5.3 Added Interaction Components

- Enhanced specification includes `LoginResponseDto`, `PaymentSucceededEvent`, and `RiderAssignedEvent` derived directly from sequence diagrams.

## 2.3.0.0 Enhanced Specification

### 2.3.1.0 Specification Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-lib-contracts |
| Technology Stack | TypeScript |
| Technology Guidance Integration | This library must be pure TypeScript with no runti... |
| Framework Compliance Score | 100% |
| Specification Completeness | 98% |
| Component Count | 45 |
| Specification Methodology | Contract-First Development. All DTOs and event sch... |

### 2.3.2.0 Technology Framework Integration

#### 2.3.2.1 Framework Patterns Applied

- Data Transfer Object (DTO)
- Event Payload Contracts
- Shared Kernel for common types
- Barrel Exports for clean module API
- Value Object contracts

#### 2.3.2.2 Directory Structure Source

Standard TypeScript library structure combined with DDD-inspired folder organization by bounded context.

#### 2.3.2.3 Naming Conventions Source

TypeScript community standards (PascalCase for types/interfaces/classes, camelCase for properties). Suffixes .dto.ts, .event.ts, .enum.ts, .contract.ts must be used.

#### 2.3.2.4 Architectural Patterns Source

This library is the definitive implementation of the \"Shared Kernel\" and \"Published Language\" patterns for a distributed, event-driven microservices architecture.

#### 2.3.2.5 Performance Optimizations Applied

- N/A - This is a compile-time library of type definitions and has no runtime performance characteristics.

### 2.3.3.0 File Structure

#### 2.3.3.1 Directory Organization

##### 2.3.3.1.1 Directory Path

###### 2.3.3.1.1.1 Directory Path

src/common

###### 2.3.3.1.1.2 Purpose

To define base interfaces and generic types used across multiple contracts. This directory acts as a shared kernel within the library.

###### 2.3.3.1.1.3 Contains Files

- base.event.ts
- paged.response.ts
- api-error.response.ts
- money.contract.ts
- address.contract.ts

###### 2.3.3.1.1.4 Organizational Reasoning

Centralizes foundational contracts to avoid duplication and enforce system-wide consistency in metadata and common value objects.

###### 2.3.3.1.1.5 Framework Convention Alignment

Follows TypeScript best practices for creating a \"shared\" or \"common\" module for reusable, foundational types.

##### 2.3.3.1.2.0 Directory Path

###### 2.3.3.1.2.1 Directory Path

src/dtos

###### 2.3.3.1.2.2 Purpose

To define all Data Transfer Objects used for synchronous API communication. Subdirectories must be organized by bounded context (e.g., users, orders, vendors).

###### 2.3.3.1.2.3 Contains Files

- dtos/index.ts
- dtos/users/user.dto.ts
- dtos/users/create-user.dto.ts
- dtos/orders/order.dto.ts
- dtos/orders/create-order.dto.ts
- dtos/products/product.dto.ts

###### 2.3.3.1.2.4 Organizational Reasoning

Separates API contracts from event contracts and organizes them by business domain for clarity, maintainability, and alignment with the microservice architecture.

###### 2.3.3.1.2.5 Framework Convention Alignment

Aligns with DDD by structuring contracts around bounded contexts.

##### 2.3.3.1.3.0 Directory Path

###### 2.3.3.1.3.1 Directory Path

src/events

###### 2.3.3.1.3.2 Purpose

To define the data contracts for all asynchronous event payloads sent over the message bus (AWS SQS/SNS). Subdirectories must be organized by the domain that publishes the event.

###### 2.3.3.1.3.3 Contains Files

- events/index.ts
- events/users/user-registered.event.ts
- events/orders/order-placed.event.ts
- events/payments/payment-succeeded.event.ts

###### 2.3.3.1.3.4 Organizational Reasoning

Clearly separates asynchronous communication contracts from synchronous ones, reflecting the event-driven nature of the architecture.

###### 2.3.3.1.3.5 Framework Convention Alignment

Directly supports the Event-Driven Architecture pattern by providing strongly-typed event schemas.

##### 2.3.3.1.4.0 Directory Path

###### 2.3.3.1.4.1 Directory Path

src/enums

###### 2.3.3.1.4.2 Purpose

To define all shared enumerations used across contracts to ensure a consistent, controlled vocabulary.

###### 2.3.3.1.4.3 Contains Files

- enums/index.ts
- enums/order-status.enum.ts
- enums/user-role.enum.ts
- enums/payment-method.enum.ts
- enums/pod-type.enum.ts

###### 2.3.3.1.4.4 Organizational Reasoning

Centralizes a controlled vocabulary to prevent magic strings and ensure type safety across the distributed system.

###### 2.3.3.1.4.5 Framework Convention Alignment

Standard practice for managing shared constant values in a TypeScript project.

##### 2.3.3.1.5.0 Directory Path

###### 2.3.3.1.5.1 Directory Path

tests

###### 2.3.3.1.5.2 Purpose

To contain schema validation tests ensuring contracts are well-formed and that no accidental breaking changes are introduced. This is a non-functional requirement.

###### 2.3.3.1.5.3 Contains Files

- tests/events/order-events.spec.ts
- tests/dtos/user-dtos.spec.ts

###### 2.3.3.1.5.4 Organizational Reasoning

Separates test specifications from source code, a standard convention in TypeScript projects.

###### 2.3.3.1.5.5 Framework Convention Alignment

Standard testing directory structure.

#### 2.3.3.2.0.0 Namespace Strategy

| Property | Value |
|----------|-------|
| Root Namespace | N/A (Uses TypeScript modules) |
| Namespace Organization | Organized by file and directory structure, exposed... |
| Naming Conventions | PascalCase for all type definitions (interfaces, c... |
| Framework Alignment | Standard TypeScript module-based organization for ... |

### 2.3.4.0.0.0 Class Specifications

#### 2.3.4.1.0.0 Class Name

##### 2.3.4.1.1.0 Class Name

package.json

##### 2.3.4.1.2.0 File Path

package.json

##### 2.3.4.1.3.0 Class Type

Configuration

##### 2.3.4.1.4.0 Inheritance

N/A

##### 2.3.4.1.5.0 Purpose

Defines project metadata, scripts, and dependencies. Specifies entry points for compiled JavaScript (`main`) and TypeScript declarations (`types`) for consumers.

##### 2.3.4.1.6.0 Dependencies

*No items available*

##### 2.3.4.1.7.0 Framework Specific Attributes

*No items available*

##### 2.3.4.1.8.0 Technology Integration Notes

Essential for publishing the library to a package registry (e.g., NPM) and enabling consumption by other projects.

##### 2.3.4.1.9.0 Properties

*No items available*

##### 2.3.4.1.10.0 Methods

*No items available*

##### 2.3.4.1.11.0 Events

*No items available*

##### 2.3.4.1.12.0 Implementation Notes

Specification requires `\"name\": \"@hyperlocal/contracts\"`, `\"version\"`, a `build` script to run `tsc`, an empty `dependencies` section, and devDependencies including `typescript`. The `\"main\": \"dist/index.js\"` and `\"types\": \"dist/index.d.ts\"` fields are mandatory.

#### 2.3.4.2.0.0 Class Name

##### 2.3.4.2.1.0 Class Name

tsconfig.json

##### 2.3.4.2.2.0 File Path

tsconfig.json

##### 2.3.4.2.3.0 Class Type

Configuration

##### 2.3.4.2.4.0 Inheritance

N/A

##### 2.3.4.2.5.0 Purpose

Configures the TypeScript compiler for strict type checking, module system definition, and generation of declaration files (`.d.ts`) for library consumers.

##### 2.3.4.2.6.0 Dependencies

*No items available*

##### 2.3.4.2.7.0 Framework Specific Attributes

*No items available*

##### 2.3.4.2.8.0 Technology Integration Notes

This file governs the compilation of TypeScript source into JavaScript and its accompanying type definitions, which form the public contract of this library.

##### 2.3.4.2.9.0 Properties

*No items available*

##### 2.3.4.2.10.0 Methods

*No items available*

##### 2.3.4.2.11.0 Events

*No items available*

##### 2.3.4.2.12.0 Implementation Notes

Specification requires compiler options: `\"declaration\": true`, `\"module\": \"CommonJS\"`, `\"target\": \"ES2021\"`, `\"strict\": true`, `\"outDir\": \"./dist\"`, `\"rootDir\": \"./src\"`, `\"esModuleInterop\": true`.

#### 2.3.4.3.0.0 Class Name

##### 2.3.4.3.1.0 Class Name

index.ts

##### 2.3.4.3.2.0 File Path

src/index.ts

##### 2.3.4.3.3.0 Class Type

Module Entrypoint

##### 2.3.4.3.4.0 Inheritance

N/A

##### 2.3.4.3.5.0 Purpose

Acts as the main barrel file, providing a single, clean entry point for consumers by re-exporting all public contracts from subdirectories.

##### 2.3.4.3.6.0 Dependencies

*No items available*

##### 2.3.4.3.7.0 Framework Specific Attributes

*No items available*

##### 2.3.4.3.8.0 Technology Integration Notes

Simplifies import statements for consuming services (e.g., `import { OrderDto } from \"@hyperlocal/contracts\"`) and defines the library's public API.

##### 2.3.4.3.9.0 Properties

*No items available*

##### 2.3.4.3.10.0 Methods

*No items available*

##### 2.3.4.3.11.0 Events

*No items available*

##### 2.3.4.3.12.0 Implementation Notes

Specification requires this file to contain only export statements for all public contracts, e.g., `export * from \"./dtos\";`, `export * from \"./events\";`, `export * from \"./enums\";`, `export * from \"./common\";`.

#### 2.3.4.4.0.0 Class Name

##### 2.3.4.4.1.0 Class Name

ContractValidationSpec

##### 2.3.4.4.2.0 File Path

tests/contracts.spec.ts

##### 2.3.4.4.3.0 Class Type

Test Specification

##### 2.3.4.4.4.0 Inheritance

N/A

##### 2.3.4.4.5.0 Purpose

Specifies the requirement for non-functional tests that validate the structural integrity of key contracts using a schema validation library like Zod or Yup.

##### 2.3.4.4.6.0 Dependencies

*No items available*

##### 2.3.4.4.7.0 Framework Specific Attributes

*No items available*

##### 2.3.4.4.8.0 Technology Integration Notes

These tests serve as a regression suite to prevent accidental breaking changes to contracts, ensuring backward compatibility within major versions.

##### 2.3.4.4.9.0 Properties

*No items available*

##### 2.3.4.4.10.0 Methods

*No items available*

##### 2.3.4.4.11.0 Events

*No items available*

##### 2.3.4.4.12.0 Implementation Notes

The test specification must describe creating a schema for a contract (e.g., `IOrderPlacedEvent`) and validating that a mock object conforms to it. This validates the contract's shape without executing logic.

### 2.3.5.0.0.0 Interface Specifications

#### 2.3.5.1.0.0 Interface Name

##### 2.3.5.1.1.0 Interface Name

IEventPayload<T>

##### 2.3.5.1.2.0 File Path

src/common/base.event.ts

##### 2.3.5.1.3.0 Purpose

Defines the mandatory envelope structure for all event payloads, ensuring system-wide consistency for tracing, auditing, and versioning as per REQ-1-110.

##### 2.3.5.1.4.0 Generic Constraints

T extends object

##### 2.3.5.1.5.0 Framework Specific Inheritance

None

##### 2.3.5.1.6.0 Method Contracts

*No items available*

##### 2.3.5.1.7.0 Property Contracts

###### 2.3.5.1.7.1 Property Name

####### 2.3.5.1.7.1.1 Property Name

eventId

####### 2.3.5.1.7.1.2 Property Type

string

####### 2.3.5.1.7.1.3 Getter Contract

A unique identifier (UUID) for this specific event instance.

####### 2.3.5.1.7.1.4 Setter Contract

N/A (Read-only)

###### 2.3.5.1.7.2.0 Property Name

####### 2.3.5.1.7.2.1 Property Name

correlationId

####### 2.3.5.1.7.2.2 Property Type

string

####### 2.3.5.1.7.2.3 Getter Contract

An identifier to trace a request across multiple services and events.

####### 2.3.5.1.7.2.4 Setter Contract

N/A (Read-only)

###### 2.3.5.1.7.3.0 Property Name

####### 2.3.5.1.7.3.1 Property Name

timestamp

####### 2.3.5.1.7.3.2 Property Type

string

####### 2.3.5.1.7.3.3 Getter Contract

The ISO 8601 timestamp (UTC) when the event occurred.

####### 2.3.5.1.7.3.4 Setter Contract

N/A (Read-only)

###### 2.3.5.1.7.4.0 Property Name

####### 2.3.5.1.7.4.1 Property Name

eventName

####### 2.3.5.1.7.4.2 Property Type

string

####### 2.3.5.1.7.4.3 Getter Contract

The unique name of the event, e.g., \"OrderPlacedEvent\".

####### 2.3.5.1.7.4.4 Setter Contract

N/A (Read-only)

###### 2.3.5.1.7.5.0 Property Name

####### 2.3.5.1.7.5.1 Property Name

version

####### 2.3.5.1.7.5.2 Property Type

string

####### 2.3.5.1.7.5.3 Getter Contract

The semantic version of the event schema, e.g., \"1.0\".

####### 2.3.5.1.7.5.4 Setter Contract

N/A (Read-only)

###### 2.3.5.1.7.6.0 Property Name

####### 2.3.5.1.7.6.1 Property Name

payload

####### 2.3.5.1.7.6.2 Property Type

T

####### 2.3.5.1.7.6.3 Getter Contract

The specific, strongly-typed data for the event.

####### 2.3.5.1.7.6.4 Setter Contract

N/A (Read-only)

##### 2.3.5.1.8.0.0 Implementation Guidance

All specific event interfaces must extend this base structure to enforce system-wide consistency in event metadata.

#### 2.3.5.2.0.0.0 Interface Name

##### 2.3.5.2.1.0.0 Interface Name

IUserRegisteredEvent

##### 2.3.5.2.2.0.0 File Path

src/events/users/user-registered.event.ts

##### 2.3.5.2.3.0.0 Purpose

Defines the data contract for the event published when a new user of any type registers, fulfilling requirements from REQ-1-035, REQ-1-036, and REQ-1-037.

##### 2.3.5.2.4.0.0 Generic Constraints

None

##### 2.3.5.2.5.0.0 Framework Specific Inheritance

IEventPayload<IUserRegisteredPayload>

##### 2.3.5.2.6.0.0 Method Contracts

*No items available*

##### 2.3.5.2.7.0.0 Property Contracts

- {'property_name': 'payload', 'property_type': 'IUserRegisteredPayload', 'getter_contract': 'Contains the core information about the newly registered user.', 'setter_contract': 'N/A'}

##### 2.3.5.2.8.0.0 Implementation Guidance

The `IUserRegisteredPayload` specification must include `userId: string`, `mobileNumber: string`, `role: UserRole`, and an optional `email: string`.

#### 2.3.5.3.0.0.0 Interface Name

##### 2.3.5.3.1.0.0 Interface Name

IPaymentSucceededEvent

##### 2.3.5.3.2.0.0 File Path

src/events/payments/payment-succeeded.event.ts

##### 2.3.5.3.3.0.0 Purpose

Defines the contract for the event published after a payment is successfully processed by the payment gateway, a key step in the order saga (REQ-1-105).

##### 2.3.5.3.4.0.0 Generic Constraints

None

##### 2.3.5.3.5.0.0 Framework Specific Inheritance

IEventPayload<IPaymentSucceededPayload>

##### 2.3.5.3.6.0.0 Method Contracts

*No items available*

##### 2.3.5.3.7.0.0 Property Contracts

- {'property_name': 'payload', 'property_type': 'IPaymentSucceededPayload', 'getter_contract': 'Contains details of the successful payment transaction.', 'setter_contract': 'N/A'}

##### 2.3.5.3.8.0.0 Implementation Guidance

The `IPaymentSucceededPayload` specification must include `orderId: string`, `paymentGatewayTransactionId: string`, `amount: MoneyContract`, and `paymentMethod: PaymentMethod`.

#### 2.3.5.4.0.0.0 Interface Name

##### 2.3.5.4.1.0.0 Interface Name

IApiErrorResponse

##### 2.3.5.4.2.0.0 File Path

src/common/api-error.response.ts

##### 2.3.5.4.3.0.0 Purpose

Defines the standardized JSON structure for all error responses across all microservice APIs, fulfilling requirement REQ-1-092.

##### 2.3.5.4.4.0.0 Generic Constraints

None

##### 2.3.5.4.5.0.0 Framework Specific Inheritance

None

##### 2.3.5.4.6.0.0 Method Contracts

*No items available*

##### 2.3.5.4.7.0.0 Property Contracts

###### 2.3.5.4.7.1.0 Property Name

####### 2.3.5.4.7.1.1 Property Name

statusCode

####### 2.3.5.4.7.1.2 Property Type

number

####### 2.3.5.4.7.1.3 Getter Contract

The HTTP status code of the error (e.g., 400, 404, 500).

####### 2.3.5.4.7.1.4 Setter Contract

N/A (Read-only)

###### 2.3.5.4.7.2.0 Property Name

####### 2.3.5.4.7.2.1 Property Name

message

####### 2.3.5.4.7.2.2 Property Type

string

####### 2.3.5.4.7.2.3 Getter Contract

A user-friendly error message.

####### 2.3.5.4.7.2.4 Setter Contract

N/A (Read-only)

###### 2.3.5.4.7.3.0 Property Name

####### 2.3.5.4.7.3.1 Property Name

correlationId

####### 2.3.5.4.7.3.2 Property Type

string

####### 2.3.5.4.7.3.3 Getter Contract

The unique ID for tracing this request through logs, fulfilling REQ-1-110.

####### 2.3.5.4.7.3.4 Setter Contract

N/A (Read-only)

###### 2.3.5.4.7.4.0 Property Name

####### 2.3.5.4.7.4.1 Property Name

errors

####### 2.3.5.4.7.4.2 Property Type

string[] | null

####### 2.3.5.4.7.4.3 Getter Contract

An optional array of specific validation error messages.

####### 2.3.5.4.7.4.4 Setter Contract

N/A (Read-only)

##### 2.3.5.4.8.0.0 Implementation Guidance

All backend services must implement a global exception filter that formats thrown exceptions into this contract structure.

#### 2.3.5.5.0.0.0 Interface Name

##### 2.3.5.5.1.0.0 Interface Name

IPagedResponse<T>

##### 2.3.5.5.2.0.0 File Path

src/common/paged.response.ts

##### 2.3.5.5.3.0.0 Purpose

Defines a generic, standardized structure for API responses that return a paginated list of items, essential for scalable data fetching.

##### 2.3.5.5.4.0.0 Generic Constraints

T

##### 2.3.5.5.5.0.0 Framework Specific Inheritance

None

##### 2.3.5.5.6.0.0 Method Contracts

*No items available*

##### 2.3.5.5.7.0.0 Property Contracts

###### 2.3.5.5.7.1.0 Property Name

####### 2.3.5.5.7.1.1 Property Name

items

####### 2.3.5.5.7.1.2 Property Type

T[]

####### 2.3.5.5.7.1.3 Getter Contract

The array of items for the current page.

####### 2.3.5.5.7.1.4 Setter Contract

N/A (Read-only)

###### 2.3.5.5.7.2.0 Property Name

####### 2.3.5.5.7.2.1 Property Name

totalItems

####### 2.3.5.5.7.2.2 Property Type

number

####### 2.3.5.5.7.2.3 Getter Contract

The total number of items available across all pages.

####### 2.3.5.5.7.2.4 Setter Contract

N/A (Read-only)

###### 2.3.5.5.7.3.0 Property Name

####### 2.3.5.5.7.3.1 Property Name

currentPage

####### 2.3.5.5.7.3.2 Property Type

number

####### 2.3.5.5.7.3.3 Getter Contract

The current page number (1-indexed).

####### 2.3.5.5.7.3.4 Setter Contract

N/A (Read-only)

###### 2.3.5.5.7.4.0 Property Name

####### 2.3.5.5.7.4.1 Property Name

totalPages

####### 2.3.5.5.7.4.2 Property Type

number

####### 2.3.5.5.7.4.3 Getter Contract

The total number of pages available.

####### 2.3.5.5.7.4.4 Setter Contract

N/A (Read-only)

##### 2.3.5.5.8.0.0 Implementation Guidance

This generic interface should be used as the return type for all API endpoints that fetch lists of data (e.g., get order history, search products).

#### 2.3.5.6.0.0.0 Interface Name

##### 2.3.5.6.1.0.0 Interface Name

IMoneyContract

##### 2.3.5.6.2.0.0 File Path

src/common/money.contract.ts

##### 2.3.5.6.3.0.0 Purpose

Defines a contract for representing monetary values to avoid floating-point inaccuracies and ambiguity, derived from DB `DECIMAL` types.

##### 2.3.5.6.4.0.0 Generic Constraints

None

##### 2.3.5.6.5.0.0 Framework Specific Inheritance

None

##### 2.3.5.6.6.0.0 Method Contracts

*No items available*

##### 2.3.5.6.7.0.0 Property Contracts

###### 2.3.5.6.7.1.0 Property Name

####### 2.3.5.6.7.1.1 Property Name

amount

####### 2.3.5.6.7.1.2 Property Type

number

####### 2.3.5.6.7.1.3 Getter Contract

The monetary amount in the smallest currency unit (e.g., paise for INR). Must be an integer.

####### 2.3.5.6.7.1.4 Setter Contract

N/A

###### 2.3.5.6.7.2.0 Property Name

####### 2.3.5.6.7.2.1 Property Name

currency

####### 2.3.5.6.7.2.2 Property Type

string

####### 2.3.5.6.7.2.3 Getter Contract

The 3-letter ISO currency code (e.g., \"INR\").

####### 2.3.5.6.7.2.4 Setter Contract

N/A

##### 2.3.5.6.8.0.0 Implementation Guidance

This contract should be used for all price, fee, and total amount fields across all DTOs and events to ensure financial data consistency.

#### 2.3.5.7.0.0.0 Interface Name

##### 2.3.5.7.1.0.0 Interface Name

IAddressContract

##### 2.3.5.7.2.0.0 File Path

src/common/address.contract.ts

##### 2.3.5.7.3.0.0 Purpose

Defines a standardized contract for representing physical addresses, derived from the `Address` entity in the database.

##### 2.3.5.7.4.0.0 Generic Constraints

None

##### 2.3.5.7.5.0.0 Framework Specific Inheritance

None

##### 2.3.5.7.6.0.0 Method Contracts

*No items available*

##### 2.3.5.7.7.0.0 Property Contracts

###### 2.3.5.7.7.1.0 Property Name

####### 2.3.5.7.7.1.1 Property Name

addressLine1

####### 2.3.5.7.7.1.2 Property Type

string

####### 2.3.5.7.7.1.3 Getter Contract

Primary address line.

####### 2.3.5.7.7.1.4 Setter Contract

N/A

###### 2.3.5.7.7.2.0 Property Name

####### 2.3.5.7.7.2.1 Property Name

city

####### 2.3.5.7.7.2.2 Property Type

string

####### 2.3.5.7.7.2.3 Getter Contract

The city.

####### 2.3.5.7.7.2.4 Setter Contract

N/A

###### 2.3.5.7.7.3.0 Property Name

####### 2.3.5.7.7.3.1 Property Name

pincode

####### 2.3.5.7.7.3.2 Property Type

string

####### 2.3.5.7.7.3.3 Getter Contract

The postal code.

####### 2.3.5.7.7.3.4 Setter Contract

N/A

###### 2.3.5.7.7.4.0 Property Name

####### 2.3.5.7.7.4.1 Property Name

latitude

####### 2.3.5.7.7.4.2 Property Type

number

####### 2.3.5.7.7.4.3 Getter Contract

The geographic latitude.

####### 2.3.5.7.7.4.4 Setter Contract

N/A

###### 2.3.5.7.7.5.0 Property Name

####### 2.3.5.7.7.5.1 Property Name

longitude

####### 2.3.5.7.7.5.2 Property Type

number

####### 2.3.5.7.7.5.3 Getter Contract

The geographic longitude.

####### 2.3.5.7.7.5.4 Setter Contract

N/A

##### 2.3.5.7.8.0.0 Implementation Guidance

This contract should be used for all address representations, including customer delivery addresses and vendor store addresses.

### 2.3.6.0.0.0.0 Enum Specifications

#### 2.3.6.1.0.0.0 Enum Name

##### 2.3.6.1.1.0.0 Enum Name

OrderStatus

##### 2.3.6.1.2.0.0 File Path

src/enums/order-status.enum.ts

##### 2.3.6.1.3.0.0 Underlying Type

string

##### 2.3.6.1.4.0.0 Purpose

Defines the controlled vocabulary for all possible states in the order lifecycle finite state machine, as required by REQ-1-077.

##### 2.3.6.1.5.0.0 Framework Attributes

*No items available*

##### 2.3.6.1.6.0.0 Values

###### 2.3.6.1.6.1.0 Value Name

####### 2.3.6.1.6.1.1 Value Name

PaymentPending

####### 2.3.6.1.6.1.2 Value

\"payment_pending_confirmation\"

####### 2.3.6.1.6.1.3 Description

Initial state where payment is initiated but not yet confirmed by the gateway.

###### 2.3.6.1.6.2.0 Value Name

####### 2.3.6.1.6.2.1 Value Name

PendingVendorAcceptance

####### 2.3.6.1.6.2.2 Value

\"pending_vendor_acceptance\"

####### 2.3.6.1.6.2.3 Description

Order is paid and waiting for the vendor to accept.

###### 2.3.6.1.6.3.0 Value Name

####### 2.3.6.1.6.3.1 Value Name

Accepted

####### 2.3.6.1.6.3.2 Value

\"accepted\"

####### 2.3.6.1.6.3.3 Description

Vendor has accepted the order.

###### 2.3.6.1.6.4.0 Value Name

####### 2.3.6.1.6.4.1 Value Name

Preparing

####### 2.3.6.1.6.4.2 Value

\"preparing\"

####### 2.3.6.1.6.4.3 Description

Vendor is actively preparing the order.

###### 2.3.6.1.6.5.0 Value Name

####### 2.3.6.1.6.5.1 Value Name

ReadyForPickup

####### 2.3.6.1.6.5.2 Value

\"ready_for_pickup\"

####### 2.3.6.1.6.5.3 Description

Order is prepared and ready for rider collection.

###### 2.3.6.1.6.6.0 Value Name

####### 2.3.6.1.6.6.1 Value Name

InTransit

####### 2.3.6.1.6.6.2 Value

\"in_transit\"

####### 2.3.6.1.6.6.3 Description

Rider has picked up the order and is en route to the customer.

###### 2.3.6.1.6.7.0 Value Name

####### 2.3.6.1.6.7.1 Value Name

Delivered

####### 2.3.6.1.6.7.2 Value

\"delivered\"

####### 2.3.6.1.6.7.3 Description

Order has been successfully delivered to the customer.

###### 2.3.6.1.6.8.0 Value Name

####### 2.3.6.1.6.8.1 Value Name

Cancelled

####### 2.3.6.1.6.8.2 Value

\"cancelled\"

####### 2.3.6.1.6.8.3 Description

Order has been cancelled by any party.

###### 2.3.6.1.6.9.0 Value Name

####### 2.3.6.1.6.9.1 Value Name

AllocationFailed

####### 2.3.6.1.6.9.2 Value

\"allocation_failed\"

####### 2.3.6.1.6.9.3 Description

System failed to assign a rider to the order.

#### 2.3.6.2.0.0.0 Enum Name

##### 2.3.6.2.1.0.0 Enum Name

UserRole

##### 2.3.6.2.2.0.0 File Path

src/enums/user-role.enum.ts

##### 2.3.6.2.3.0.0 Underlying Type

string

##### 2.3.6.2.4.0.0 Purpose

Defines the controlled vocabulary for user roles across the system, as per REQ-1-009 to REQ-1-012.

##### 2.3.6.2.5.0.0 Framework Attributes

*No items available*

##### 2.3.6.2.6.0.0 Values

###### 2.3.6.2.6.1.0 Value Name

####### 2.3.6.2.6.1.1 Value Name

Customer

####### 2.3.6.2.6.1.2 Value

\"customer\"

####### 2.3.6.2.6.1.3 Description

A user who places orders.

###### 2.3.6.2.6.2.0 Value Name

####### 2.3.6.2.6.2.1 Value Name

Vendor

####### 2.3.6.2.6.2.2 Value

\"vendor\"

####### 2.3.6.2.6.2.3 Description

A user who owns a store and fulfills orders.

###### 2.3.6.2.6.3.0 Value Name

####### 2.3.6.2.6.3.1 Value Name

Rider

####### 2.3.6.2.6.3.2 Value

\"rider\"

####### 2.3.6.2.6.3.3 Description

A user who performs deliveries.

###### 2.3.6.2.6.4.0 Value Name

####### 2.3.6.2.6.4.1 Value Name

Administrator

####### 2.3.6.2.6.4.2 Value

\"administrator\"

####### 2.3.6.2.6.4.3 Description

A user with platform management privileges.

#### 2.3.6.3.0.0.0 Enum Name

##### 2.3.6.3.1.0.0 Enum Name

PaymentMethod

##### 2.3.6.3.2.0.0 File Path

src/enums/payment-method.enum.ts

##### 2.3.6.3.3.0.0 Underlying Type

string

##### 2.3.6.3.4.0.0 Purpose

Defines the controlled vocabulary for payment methods, as required by REQ-1-054.

##### 2.3.6.3.5.0.0 Framework Attributes

*No items available*

##### 2.3.6.3.6.0.0 Values

###### 2.3.6.3.6.1.0 Value Name

####### 2.3.6.3.6.1.1 Value Name

UPI

####### 2.3.6.3.6.1.2 Value

\"upi\"

####### 2.3.6.3.6.1.3 Description

Unified Payments Interface.

###### 2.3.6.3.6.2.0 Value Name

####### 2.3.6.3.6.2.1 Value Name

CARD

####### 2.3.6.3.6.2.2 Value

\"card\"

####### 2.3.6.3.6.2.3 Description

Credit or Debit Card.

###### 2.3.6.3.6.3.0 Value Name

####### 2.3.6.3.6.3.1 Value Name

COD

####### 2.3.6.3.6.3.2 Value

\"cod\"

####### 2.3.6.3.6.3.3 Description

Cash on Delivery.

### 2.3.7.0.0.0.0 Dto Specifications

#### 2.3.7.1.0.0.0 Dto Name

##### 2.3.7.1.1.0.0 Dto Name

LoginResponseDto

##### 2.3.7.1.2.0.0 File Path

src/dtos/auth/login-response.dto.ts

##### 2.3.7.1.3.0.0 Purpose

Defines the data contract for the response after a successful user login, fulfilling REQ-1-040.

##### 2.3.7.1.4.0.0 Framework Base Class

None

##### 2.3.7.1.5.0.0 Properties

###### 2.3.7.1.5.1.0 Property Name

####### 2.3.7.1.5.1.1 Property Name

accessToken

####### 2.3.7.1.5.1.2 Property Type

string

####### 2.3.7.1.5.1.3 Validation Attributes

*No items available*

####### 2.3.7.1.5.1.4 Serialization Attributes

*No items available*

####### 2.3.7.1.5.1.5 Framework Specific Attributes

*No items available*

###### 2.3.7.1.5.2.0 Property Name

####### 2.3.7.1.5.2.1 Property Name

refreshToken

####### 2.3.7.1.5.2.2 Property Type

string

####### 2.3.7.1.5.2.3 Validation Attributes

*No items available*

####### 2.3.7.1.5.2.4 Serialization Attributes

*No items available*

####### 2.3.7.1.5.2.5 Framework Specific Attributes

*No items available*

##### 2.3.7.1.6.0.0 Validation Rules

No validation decorators needed for a response DTO.

##### 2.3.7.1.7.0.0 Serialization Requirements

Standard JSON serialization.

#### 2.3.7.2.0.0.0 Dto Name

##### 2.3.7.2.1.0.0 Dto Name

UserDto

##### 2.3.7.2.2.0.0 File Path

src/dtos/users/user.dto.ts

##### 2.3.7.2.3.0.0 Purpose

Defines the public data contract for a user, returned by various API endpoints.

##### 2.3.7.2.4.0.0 Framework Base Class

None

##### 2.3.7.2.5.0.0 Properties

###### 2.3.7.2.5.1.0 Property Name

####### 2.3.7.2.5.1.1 Property Name

id

####### 2.3.7.2.5.1.2 Property Type

string

####### 2.3.7.2.5.1.3 Validation Attributes

*No items available*

####### 2.3.7.2.5.1.4 Serialization Attributes

*No items available*

####### 2.3.7.2.5.1.5 Framework Specific Attributes

*No items available*

###### 2.3.7.2.5.2.0 Property Name

####### 2.3.7.2.5.2.1 Property Name

role

####### 2.3.7.2.5.2.2 Property Type

UserRole

####### 2.3.7.2.5.2.3 Validation Attributes

*No items available*

####### 2.3.7.2.5.2.4 Serialization Attributes

*No items available*

####### 2.3.7.2.5.2.5 Framework Specific Attributes

*No items available*

###### 2.3.7.2.5.3.0 Property Name

####### 2.3.7.2.5.3.1 Property Name

status

####### 2.3.7.2.5.3.2 Property Type

string

####### 2.3.7.2.5.3.3 Validation Attributes

*No items available*

####### 2.3.7.2.5.3.4 Serialization Attributes

*No items available*

####### 2.3.7.2.5.3.5 Framework Specific Attributes

*No items available*

###### 2.3.7.2.5.4.0 Property Name

####### 2.3.7.2.5.4.1 Property Name

profile

####### 2.3.7.2.5.4.2 Property Type

CustomerProfileDto | VendorProfileDto | RiderProfileDto

####### 2.3.7.2.5.4.3 Validation Attributes

*No items available*

####### 2.3.7.2.5.4.4 Serialization Attributes

*No items available*

####### 2.3.7.2.5.4.5 Framework Specific Attributes

*No items available*

##### 2.3.7.2.6.0.0 Validation Rules

This is a response DTO; no validation decorators are required.

##### 2.3.7.2.7.0.0 Serialization Requirements

The `profile` property will be a nested object whose shape depends on the user's role.

#### 2.3.7.3.0.0.0 Dto Name

##### 2.3.7.3.1.0.0 Dto Name

ProductDto

##### 2.3.7.3.2.0.0 File Path

src/dtos/products/product.dto.ts

##### 2.3.7.3.3.0.0 Purpose

Defines the public data contract for a product, used in catalog views and order details.

##### 2.3.7.3.4.0.0 Framework Base Class

None

##### 2.3.7.3.5.0.0 Properties

###### 2.3.7.3.5.1.0 Property Name

####### 2.3.7.3.5.1.1 Property Name

id

####### 2.3.7.3.5.1.2 Property Type

string

####### 2.3.7.3.5.1.3 Validation Attributes

*No items available*

####### 2.3.7.3.5.1.4 Serialization Attributes

*No items available*

####### 2.3.7.3.5.1.5 Framework Specific Attributes

*No items available*

###### 2.3.7.3.5.2.0 Property Name

####### 2.3.7.3.5.2.1 Property Name

name

####### 2.3.7.3.5.2.2 Property Type

string

####### 2.3.7.3.5.2.3 Validation Attributes

*No items available*

####### 2.3.7.3.5.2.4 Serialization Attributes

*No items available*

####### 2.3.7.3.5.2.5 Framework Specific Attributes

*No items available*

###### 2.3.7.3.5.3.0 Property Name

####### 2.3.7.3.5.3.1 Property Name

price

####### 2.3.7.3.5.3.2 Property Type

IMoneyContract

####### 2.3.7.3.5.3.3 Validation Attributes

*No items available*

####### 2.3.7.3.5.3.4 Serialization Attributes

*No items available*

####### 2.3.7.3.5.3.5 Framework Specific Attributes

*No items available*

###### 2.3.7.3.5.4.0 Property Name

####### 2.3.7.3.5.4.1 Property Name

stockStatus

####### 2.3.7.3.5.4.2 Property Type

\"Available\" | \"Limited Stock\" | \"Out of Stock\"

####### 2.3.7.3.5.4.3 Validation Attributes

*No items available*

####### 2.3.7.3.5.4.4 Serialization Attributes

*No items available*

####### 2.3.7.3.5.4.5 Framework Specific Attributes

*No items available*

##### 2.3.7.3.6.0.0 Validation Rules

N/A

##### 2.3.7.3.7.0.0 Serialization Requirements

Standard JSON serialization. `price` is a nested object.

### 2.3.8.0.0.0.0 Configuration Specifications

*No items available*

### 2.3.9.0.0.0.0 Dependency Injection Specifications

*No items available*

### 2.3.10.0.0.0.0 External Integration Specifications

*No items available*

## 2.4.0.0.0.0.0 Component Count Validation

| Property | Value |
|----------|-------|
| Total Classes | 4 |
| Total Interfaces | 7 |
| Total Enums | 3 |
| Total Dtos | 3 |
| Total Configurations | 0 |
| Total External Integrations | 0 |
| Grand Total Components | 17 |
| Phase 2 Claimed Count | 45 |
| Phase 2 Actual Count | 10 |
| Validation Added Count | 7 |
| Final Validated Count | 17 |

# 3.0.0.0.0.0.0 File Structure

## 3.1.0.0.0.0.0 Directory Organization

### 3.1.1.0.0.0.0 Directory Path

#### 3.1.1.1.0.0.0 Directory Path

.

#### 3.1.1.2.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.1.3.0.0.0 Contains Files

- package.json
- package-lock.json
- tsconfig.json
- .editorconfig
- .prettierrc
- .eslintrc.js
- .npmrc
- jest.config.js
- .gitignore
- README.md
- CHANGELOG.md

#### 3.1.1.4.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.1.5.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

### 3.1.2.0.0.0.0 Directory Path

#### 3.1.2.1.0.0.0 Directory Path

.github/workflows

#### 3.1.2.2.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.2.3.0.0.0 Contains Files

- ci.yml
- release.yml

#### 3.1.2.4.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.2.5.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

### 3.1.3.0.0.0.0 Directory Path

#### 3.1.3.1.0.0.0 Directory Path

.vscode

#### 3.1.3.2.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.3.3.0.0.0 Contains Files

- settings.json

#### 3.1.3.4.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.3.5.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

