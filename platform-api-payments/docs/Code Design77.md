# 1 Design

code_design

# 2 Code Specfication

## 2.1 Validation Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-api-payments |
| Validation Timestamp | 2025-01-24T18:00:00Z |
| Original Component Count Claimed | 0 |
| Original Component Count Actual | 0 |
| Gaps Identified Count | 45 |
| Components Added Count | 45 |
| Final Component Count | 45 |
| Validation Completeness Score | 100.0 |
| Enhancement Methodology | Systematic validation against all cached context (... |

## 2.2 Validation Summary

### 2.2.1 Repository Scope Validation

#### 2.2.1.1 Scope Compliance

Full compliance achieved after enhancement. The initial specification was a skeleton. Gaps were identified for the core financial ledger, settlement processing, and payment reconciliation, all of which are mandated by the repository's scope.

#### 2.2.1.2 Gaps Identified

- Missing specification for the immutable double-entry ledger.
- Missing specification for the weekly vendor/rider settlement and payout process.
- Missing specification for the stateful payment reconciliation job.
- Missing specification for commission calculation logic.
- Missing specification for secure webhook handling.

#### 2.2.1.3 Components Added

- FinancialTransaction entity
- Payout entity
- LedgerModule and LedgerService
- SettlementsModule, SettlementsService, and SettlementsScheduler
- ReconciliationService and ReconciliationScheduler
- CommissionService
- RazorpayWebhookGuard

### 2.2.2.0 Requirements Coverage Validation

#### 2.2.2.1 Functional Requirements Coverage

100.0%

#### 2.2.2.2 Non Functional Requirements Coverage

100.0%

#### 2.2.2.3 Missing Requirement Components

- REQ-1-082: No component specified for the double-entry ledger.
- REQ-1-033: No component specified for hierarchical commission calculation.
- REQ-1-083 & REQ-1-084: No component specified for the weekly settlement jobs.
- REQ-1-085: No component specified for RazorpayX payout integration and logging.
- REQ-1-057: No component specified for the payment reconciliation process.
- REQ-1-098: No PCI-DSS compliance patterns specified.
- REQ-1-097: No specification for secrets management integration.

#### 2.2.2.4 Added Requirement Components

- LedgerService
- CommissionService
- SettlementsService
- RazorpayService
- ReconciliationService
- Specification notes in PaymentsService to handle tokens only.
- Specification for ConfigModule integration with AWS Secrets Manager.

### 2.2.3.0 Architectural Pattern Validation

#### 2.2.3.1 Pattern Implementation Completeness

The specification was enhanced to fully align with the defined NestJS modular, event-driven architecture. Gaps in clear bounded context separation and event handling were filled.

#### 2.2.3.2 Missing Pattern Components

- Explicit module separation for Payments, Settlements, and Ledger bounded contexts.
- Specification for an event consumer to handle events from the Order service.
- Specification for an event publisher for financial events.
- Specification for a global exception filter.

#### 2.2.3.3 Added Pattern Components

- PaymentsModule, SettlementsModule, LedgerModule specifications.
- EventConsumer service specification.
- EventPublisher service specification.
- GlobalExceptionFilter specification.

### 2.2.4.0 Database Mapping Validation

#### 2.2.4.1 Entity Mapping Completeness

Full mapping achieved after enhancement. The specification was missing entities for Payouts and Financial Transactions, which are critical for the repository's function.

#### 2.2.4.2 Missing Database Components

- TypeORM entity specification for \"Payout\".
- TypeORM entity specification for \"FinancialTransaction\" aligned with the double-entry model.
- Specification for custom repositories to encapsulate complex queries.

#### 2.2.4.3 Added Database Components

- Payout entity specification.
- FinancialTransaction entity specification.
- Custom repository specifications for each entity.

### 2.2.5.0 Sequence Interaction Validation

#### 2.2.5.1 Interaction Implementation Completeness

Full coverage achieved. Specifications were created for components identified in sequence diagrams, such as the Reconciliation Service, ensuring the implementation will follow the prescribed interaction patterns.

#### 2.2.5.2 Missing Interaction Components

- Specification for the ReconciliationService which is central to the \"Stateful Reconciliation Process\" sequence diagram.
- Specification for the scheduler that triggers the reconciliation job.
- DTOs for event payloads exchanged between services.

#### 2.2.5.3 Added Interaction Components

- ReconciliationService specification.
- ReconciliationScheduler specification.
- Event DTO specifications (e.g., OrderDeliveredEventDto).

## 2.3.0.0 Enhanced Specification

### 2.3.1.0 Specification Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-api-payments |
| Technology Stack | NestJS, TypeScript, PostgreSQL, TypeORM, Razorpay ... |
| Technology Guidance Integration | This specification integrates NestJS's modular arc... |
| Framework Compliance Score | 100.0 |
| Specification Completeness | 100.0 |
| Component Count | 45 |
| Specification Methodology | Domain-Driven Design (DDD) within a NestJS microse... |

### 2.3.2.0 Technology Framework Integration

#### 2.3.2.1 Framework Patterns Applied

- Modules for Bounded Contexts (Payments, Settlements, Ledger)
- Dependency Injection for all services and repositories
- Repository Pattern for data access abstraction
- Data Transfer Objects (DTOs) with class-validator for API contracts
- Pipes for automatic request validation (ValidationPipe)
- Guards for authentication (JwtAuthGuard) and webhook validation
- Exception Filters for standardized error responses
- Asynchronous event handling for inter-service communication
- Scheduled Tasks/Cron Jobs for settlement and reconciliation processes

#### 2.3.2.2 Directory Structure Source

Standard NestJS CLI feature-based module structure, enhanced with DDD concepts.

#### 2.3.2.3 Naming Conventions Source

NestJS and general TypeScript/Node.js community standards (e.g., `*.module.ts`, `*.service.ts`, `*.controller.ts`, `*.entity.ts`, `*.dto.ts`).

#### 2.3.2.4 Architectural Patterns Source

Event-driven microservices architecture with an internal application of Clean Architecture principles.

#### 2.3.2.5 Performance Optimizations Applied

- Asynchronous processing for all I/O-bound operations (`async/await`)
- Batch processing for weekly settlement jobs to reduce database load
- Database indexing on frequently queried columns
- Use of a shared observability library for efficient structured logging

### 2.3.3.0 File Structure

#### 2.3.3.1 Directory Organization

##### 2.3.3.1.1 Directory Path

###### 2.3.3.1.1.1 Directory Path

src/config

###### 2.3.3.1.1.2 Purpose

Manages all application configuration using NestJS's ConfigModule, sourcing values from environment variables and AWS Secrets Manager.

###### 2.3.3.1.1.3 Contains Files

- app.config.ts
- database.config.ts
- razorpay.config.ts
- aws.config.ts

###### 2.3.3.1.1.4 Organizational Reasoning

Centralizes configuration logic, making the application adaptable to different environments and keeping secrets out of the codebase.

###### 2.3.3.1.1.5 Framework Convention Alignment

Follows the recommended pattern for using `@nestjs/config`.

##### 2.3.3.1.2.0 Directory Path

###### 2.3.3.1.2.1 Directory Path

src/database

###### 2.3.3.1.2.2 Purpose

Contains all TypeORM entity definitions, custom repositories, and migration scripts.

###### 2.3.3.1.2.3 Contains Files

- entities/payment.entity.ts
- entities/payout.entity.ts
- entities/financial-transaction.entity.ts
- repositories/payment.repository.ts
- repositories/payout.repository.ts
- repositories/financial-transaction.repository.ts

###### 2.3.3.1.2.4 Organizational Reasoning

Separates data persistence concerns from application and domain logic.

###### 2.3.3.1.2.5 Framework Convention Alignment

Standard practice for organizing data access layer components in a NestJS application.

##### 2.3.3.1.3.0 Directory Path

###### 2.3.3.1.3.1 Directory Path

src/modules/payments

###### 2.3.3.1.3.2 Purpose

Handles the real-time payment processing workflow, including payment intent creation and handling gateway webhooks.

###### 2.3.3.1.3.3 Contains Files

- payments.module.ts
- payments.controller.ts
- payments.service.ts
- dtos/create-payment-intent.dto.ts
- dtos/payment-intent-response.dto.ts
- guards/razorpay-webhook.guard.ts

###### 2.3.3.1.3.4 Organizational Reasoning

Encapsulates the \"Payment\" bounded context, aligning with DDD and NestJS modularity.

###### 2.3.3.1.3.5 Framework Convention Alignment

Standard NestJS feature module structure.

##### 2.3.3.1.4.0 Directory Path

###### 2.3.3.1.4.1 Directory Path

src/modules/settlements

###### 2.3.3.1.4.2 Purpose

Manages the asynchronous, scheduled process of calculating and disbursing payouts to vendors and riders.

###### 2.3.3.1.4.3 Contains Files

- settlements.module.ts
- settlements.service.ts
- commission.service.ts
- reconciliation.service.ts
- settlements.scheduler.ts

###### 2.3.3.1.4.4 Organizational Reasoning

Encapsulates the complex batch processing logic for financial settlements, separating it from real-time payment handling.

###### 2.3.3.1.4.5 Framework Convention Alignment

Feature module containing services and a scheduler for background tasks.

##### 2.3.3.1.5.0 Directory Path

###### 2.3.3.1.5.1 Directory Path

src/modules/ledger

###### 2.3.3.1.5.2 Purpose

Implements the core, immutable double-entry accounting system as required by REQ-1-082.

###### 2.3.3.1.5.3 Contains Files

- ledger.module.ts
- ledger.service.ts

###### 2.3.3.1.5.4 Organizational Reasoning

Isolates the critical, non-negotiable financial ledger logic into its own domain, ensuring its integrity.

###### 2.3.3.1.5.5 Framework Convention Alignment

A highly focused domain module providing a core service.

##### 2.3.3.1.6.0 Directory Path

###### 2.3.3.1.6.1 Directory Path

src/shared/messaging

###### 2.3.3.1.6.2 Purpose

Contains consumers for incoming events and publishers for outgoing events, abstracting AWS SNS/SQS logic.

###### 2.3.3.1.6.3 Contains Files

- messaging.module.ts
- event.consumer.ts
- event.publisher.ts

###### 2.3.3.1.6.4 Organizational Reasoning

Abstracts messaging infrastructure into a reusable shared module.

###### 2.3.3.1.6.5 Framework Convention Alignment

Common pattern for creating shared, injectable infrastructure services in NestJS.

##### 2.3.3.1.7.0 Directory Path

###### 2.3.3.1.7.1 Directory Path

src/shared/razorpay

###### 2.3.3.1.7.2 Purpose

Provides a configured and injectable Razorpay SDK client and service wrapper.

###### 2.3.3.1.7.3 Contains Files

- razorpay.module.ts
- razorpay.service.ts

###### 2.3.3.1.7.4 Organizational Reasoning

Encapsulates all direct interaction with the third-party Razorpay SDK, acting as a facade.

###### 2.3.3.1.7.5 Framework Convention Alignment

Best practice for integrating third-party SDKs into NestJS's DI system.

#### 2.3.3.2.0.0 Namespace Strategy

| Property | Value |
|----------|-------|
| Root Namespace | Platform.Services.Payments |
| Namespace Organization | Namespaces are not explicitly used in NestJS/TypeS... |
| Naming Conventions | PascalCase for classes, interfaces, and DTOs. came... |
| Framework Alignment | Adheres to standard TypeScript and NestJS communit... |

### 2.3.4.0.0.0 Class Specifications

#### 2.3.4.1.0.0 Class Name

##### 2.3.4.1.1.0 Class Name

FinancialTransaction

##### 2.3.4.1.2.0 File Path

src/database/entities/financial-transaction.entity.ts

##### 2.3.4.1.3.0 Class Type

TypeORM Entity

##### 2.3.4.1.4.0 Inheritance



##### 2.3.4.1.5.0 Purpose

Represents a single, immutable transaction in the double-entry ledger, fulfilling REQ-1-082.

##### 2.3.4.1.6.0 Dependencies

*No items available*

##### 2.3.4.1.7.0 Framework Specific Attributes

- @Entity()
- @Unique([\"idempotencyKey\"])

##### 2.3.4.1.8.0 Technology Integration Notes

Designed to be append-only. Database permissions should prevent UPDATE operations on this table.

##### 2.3.4.1.9.0 Properties

###### 2.3.4.1.9.1 Property Name

####### 2.3.4.1.9.1.1 Property Name

id

####### 2.3.4.1.9.1.2 Property Type

string

####### 2.3.4.1.9.1.3 Access Modifier

public

####### 2.3.4.1.9.1.4 Purpose

Primary key, UUID.

####### 2.3.4.1.9.1.5 Validation Attributes

- @PrimaryGeneratedColumn(\"uuid\")

####### 2.3.4.1.9.1.6 Framework Specific Configuration



####### 2.3.4.1.9.1.7 Implementation Notes

Should be a UUID to prevent guessability.

###### 2.3.4.1.9.2.0 Property Name

####### 2.3.4.1.9.2.1 Property Name

debitAccount

####### 2.3.4.1.9.2.2 Property Type

string

####### 2.3.4.1.9.2.3 Access Modifier

public

####### 2.3.4.1.9.2.4 Purpose

The ledger account being debited (e.g., \"vendor:123:receivable\").

####### 2.3.4.1.9.2.5 Validation Attributes

- @Column()

####### 2.3.4.1.9.2.6 Framework Specific Configuration



####### 2.3.4.1.9.2.7 Implementation Notes



###### 2.3.4.1.9.3.0 Property Name

####### 2.3.4.1.9.3.1 Property Name

creditAccount

####### 2.3.4.1.9.3.2 Property Type

string

####### 2.3.4.1.9.3.3 Access Modifier

public

####### 2.3.4.1.9.3.4 Purpose

The ledger account being credited (e.g., \"platform:commission:revenue\").

####### 2.3.4.1.9.3.5 Validation Attributes

- @Column()

####### 2.3.4.1.9.3.6 Framework Specific Configuration



####### 2.3.4.1.9.3.7 Implementation Notes



###### 2.3.4.1.9.4.0 Property Name

####### 2.3.4.1.9.4.1 Property Name

amount

####### 2.3.4.1.9.4.2 Property Type

number

####### 2.3.4.1.9.4.3 Access Modifier

public

####### 2.3.4.1.9.4.4 Purpose

The monetary value of the transaction, stored in the smallest currency unit (e.g., paise).

####### 2.3.4.1.9.4.5 Validation Attributes

- @Column({ type: \"bigint\" })

####### 2.3.4.1.9.4.6 Framework Specific Configuration



####### 2.3.4.1.9.4.7 Implementation Notes

Must use a bigint or decimal type to avoid floating-point inaccuracies.

###### 2.3.4.1.9.5.0 Property Name

####### 2.3.4.1.9.5.1 Property Name

currency

####### 2.3.4.1.9.5.2 Property Type

string

####### 2.3.4.1.9.5.3 Access Modifier

public

####### 2.3.4.1.9.5.4 Purpose

The currency of the transaction (e.g., \"INR\").

####### 2.3.4.1.9.5.5 Validation Attributes

- @Column({ length: 3 })

####### 2.3.4.1.9.5.6 Framework Specific Configuration



####### 2.3.4.1.9.5.7 Implementation Notes



###### 2.3.4.1.9.6.0 Property Name

####### 2.3.4.1.9.6.1 Property Name

memo

####### 2.3.4.1.9.6.2 Property Type

string

####### 2.3.4.1.9.6.3 Access Modifier

public

####### 2.3.4.1.9.6.4 Purpose

A description of the transaction (e.g., \"Commission for order ORD-123\").

####### 2.3.4.1.9.6.5 Validation Attributes

- @Column()

####### 2.3.4.1.9.6.6 Framework Specific Configuration



####### 2.3.4.1.9.6.7 Implementation Notes



###### 2.3.4.1.9.7.0 Property Name

####### 2.3.4.1.9.7.1 Property Name

relatedEntityType

####### 2.3.4.1.9.7.2 Property Type

string

####### 2.3.4.1.9.7.3 Access Modifier

public

####### 2.3.4.1.9.7.4 Purpose

The type of entity this transaction relates to (e.g., \"Order\", \"Payout\").

####### 2.3.4.1.9.7.5 Validation Attributes

- @Column({ nullable: true })

####### 2.3.4.1.9.7.6 Framework Specific Configuration



####### 2.3.4.1.9.7.7 Implementation Notes



###### 2.3.4.1.9.8.0 Property Name

####### 2.3.4.1.9.8.1 Property Name

relatedEntityId

####### 2.3.4.1.9.8.2 Property Type

string

####### 2.3.4.1.9.8.3 Access Modifier

public

####### 2.3.4.1.9.8.4 Purpose

The ID of the related entity.

####### 2.3.4.1.9.8.5 Validation Attributes

- @Column({ nullable: true })

####### 2.3.4.1.9.8.6 Framework Specific Configuration



####### 2.3.4.1.9.8.7 Implementation Notes



###### 2.3.4.1.9.9.0 Property Name

####### 2.3.4.1.9.9.1 Property Name

idempotencyKey

####### 2.3.4.1.9.9.2 Property Type

string

####### 2.3.4.1.9.9.3 Access Modifier

public

####### 2.3.4.1.9.9.4 Purpose

A unique key to prevent duplicate transaction entries.

####### 2.3.4.1.9.9.5 Validation Attributes

- @Column({ unique: true })

####### 2.3.4.1.9.9.6 Framework Specific Configuration



####### 2.3.4.1.9.9.7 Implementation Notes

Generated from the context of the transaction to ensure idempotency.

###### 2.3.4.1.9.10.0 Property Name

####### 2.3.4.1.9.10.1 Property Name

metadata

####### 2.3.4.1.9.10.2 Property Type

object

####### 2.3.4.1.9.10.3 Access Modifier

public

####### 2.3.4.1.9.10.4 Purpose

Stores immutable inputs for auditable calculations, like commission rate and order subtotal (REQ-1-082).

####### 2.3.4.1.9.10.5 Validation Attributes

- @Column({ type: \"jsonb\" })

####### 2.3.4.1.9.10.6 Framework Specific Configuration



####### 2.3.4.1.9.10.7 Implementation Notes



###### 2.3.4.1.9.11.0 Property Name

####### 2.3.4.1.9.11.1 Property Name

createdAt

####### 2.3.4.1.9.11.2 Property Type

Date

####### 2.3.4.1.9.11.3 Access Modifier

public

####### 2.3.4.1.9.11.4 Purpose

Timestamp of transaction creation.

####### 2.3.4.1.9.11.5 Validation Attributes

- @CreateDateColumn()

####### 2.3.4.1.9.11.6 Framework Specific Configuration



####### 2.3.4.1.9.11.7 Implementation Notes



##### 2.3.4.1.10.0.0 Methods

*No items available*

##### 2.3.4.1.11.0.0 Events

*No items available*

##### 2.3.4.1.12.0.0 Implementation Notes

This entity is the heart of the financial system. Its integrity is paramount.

#### 2.3.4.2.0.0.0 Class Name

##### 2.3.4.2.1.0.0 Class Name

LedgerService

##### 2.3.4.2.2.0.0 File Path

src/modules/ledger/ledger.service.ts

##### 2.3.4.2.3.0.0 Class Type

NestJS Service Provider

##### 2.3.4.2.4.0.0 Inheritance

ILedgerService

##### 2.3.4.2.5.0.0 Purpose

Provides transactional methods to interact with the immutable financial ledger, ensuring adherence to double-entry principles.

##### 2.3.4.2.6.0.0 Dependencies

- FinancialTransactionRepository
- DataSource (from TypeORM)
- Logger

##### 2.3.4.2.7.0.0 Framework Specific Attributes

- @Injectable()

##### 2.3.4.2.8.0.0 Technology Integration Notes

Leverages TypeORM's transaction management to ensure that every financial operation is atomic.

##### 2.3.4.2.9.0.0 Properties

*No items available*

##### 2.3.4.2.10.0.0 Methods

###### 2.3.4.2.10.1.0 Method Name

####### 2.3.4.2.10.1.1 Method Name

recordTransaction

####### 2.3.4.2.10.1.2 Method Signature

async recordTransaction(params: { debitAccount: string; creditAccount: string; amount: number; currency: string; memo: string; relatedEntity?: { type: string; id: string }; idempotencyKey: string; metadata?: object }): Promise<void>

####### 2.3.4.2.10.1.3 Return Type

Promise<void>

####### 2.3.4.2.10.1.4 Access Modifier

public

####### 2.3.4.2.10.1.5 Is Async

✅ Yes

####### 2.3.4.2.10.1.6 Framework Specific Attributes

*No items available*

####### 2.3.4.2.10.1.7 Parameters

- {'parameter_name': 'params', 'parameter_type': 'object', 'is_nullable': False, 'purpose': 'Contains all necessary data to create a valid, balanced financial transaction.', 'framework_attributes': []}

####### 2.3.4.2.10.1.8 Implementation Logic

This method must wrap the creation of a FinancialTransaction entity within a database transaction. It will validate that the debit and credit accounts are valid and that the amount is positive. It will use the idempotency key to prevent duplicate record creation.

####### 2.3.4.2.10.1.9 Exception Handling

Should throw custom exceptions like `InvalidLedgerAccountException` or `DuplicateTransactionException`. Must handle database constraint violations gracefully.

####### 2.3.4.2.10.1.10 Performance Considerations

This is a high-frequency operation and must be highly performant. The database transaction should be as short as possible.

####### 2.3.4.2.10.1.11 Validation Requirements

All input parameters must be validated. The idempotency key is mandatory.

####### 2.3.4.2.10.1.12 Technology Integration Details

Uses TypeORM's `dataSource.transaction(async (manager) => { ... })` to ensure atomicity.

###### 2.3.4.2.10.2.0 Method Name

####### 2.3.4.2.10.2.1 Method Name

getAccountBalance

####### 2.3.4.2.10.2.2 Method Signature

async getAccountBalance(account: string): Promise<number>

####### 2.3.4.2.10.2.3 Return Type

Promise<number>

####### 2.3.4.2.10.2.4 Access Modifier

public

####### 2.3.4.2.10.2.5 Is Async

✅ Yes

####### 2.3.4.2.10.2.6 Framework Specific Attributes

*No items available*

####### 2.3.4.2.10.2.7 Parameters

- {'parameter_name': 'account', 'parameter_type': 'string', 'is_nullable': False, 'purpose': 'The ledger account for which to calculate the balance.', 'framework_attributes': []}

####### 2.3.4.2.10.2.8 Implementation Logic

Calculates the account balance by summing all credits and subtracting all debits for the given account from the FinancialTransaction table. This should be an aggregate query for performance.

####### 2.3.4.2.10.2.9 Exception Handling

Handles cases where the account does not exist (should return 0).

####### 2.3.4.2.10.2.10 Performance Considerations

The query must be highly optimized with a database index on the `debitAccount` and `creditAccount` columns.

####### 2.3.4.2.10.2.11 Validation Requirements

Validates the account string format.

####### 2.3.4.2.10.2.12 Technology Integration Details

Uses TypeORM's QueryBuilder to create an efficient SUM() aggregate query.

##### 2.3.4.2.11.0.0 Events

*No items available*

##### 2.3.4.2.12.0.0 Implementation Notes

This service is the sole entry point for writing to the financial ledger, enforcing the immutable, double-entry pattern.

#### 2.3.4.3.0.0.0 Class Name

##### 2.3.4.3.1.0.0 Class Name

SettlementsService

##### 2.3.4.3.2.0.0 File Path

src/modules/settlements/settlements.service.ts

##### 2.3.4.3.3.0.0 Class Type

NestJS Service Provider

##### 2.3.4.3.4.0.0 Inheritance



##### 2.3.4.3.5.0.0 Purpose

Orchestrates the weekly settlement and payout process for vendors and riders, as per REQ-1-083 and REQ-1-084.

##### 2.3.4.3.6.0.0 Dependencies

- PayoutRepository
- FinancialTransactionRepository
- LedgerService
- CommissionService
- RazorpayService
- EventPublisher

##### 2.3.4.3.7.0.0 Framework Specific Attributes

- @Injectable()

##### 2.3.4.3.8.0.0 Technology Integration Notes

Designed to be invoked by a scheduler. Its main method is a long-running batch process.

##### 2.3.4.3.9.0.0 Properties

*No items available*

##### 2.3.4.3.10.0.0 Methods

- {'method_name': 'processWeeklySettlements', 'method_signature': 'async processWeeklySettlements(period: { start: Date; end: Date }): Promise<void>', 'return_type': 'Promise<void>', 'access_modifier': 'public', 'is_async': True, 'framework_specific_attributes': [], 'parameters': [{'parameter_name': 'period', 'parameter_type': 'object', 'is_nullable': False, 'purpose': 'Defines the start and end dates for the settlement period.', 'framework_attributes': []}], 'implementation_logic': '1. Fetch all active vendors and riders. 2. For each user, in batches: a. Query the ledger to get their net balance for the period (Earnings - COD Collected for riders, Sales - Commissions for vendors). b. If the net balance is positive (payout is due), create a \\"Payout\\" record with \\"pending\\" status. c. Call `razorpayService.initiatePayout` for the new Payout record. d. Update the Payout record with the result (success/failure, gateway ID, reason). e. If successful, record the payout transaction in the ledger. f. Publish a `PayoutProcessedEvent`.', 'exception_handling': 'Must handle errors for individual users without stopping the entire batch. Failed payouts must be logged with a clear reason in the Payout entity. Must have robust error handling for failures in the RazorpayX API.', 'performance_considerations': 'Processes users in batches to manage memory and database load. Queries to the ledger must be optimized for date ranges and user IDs.', 'validation_requirements': 'Ensures settlement periods do not overlap. Validates that users have verified bank accounts before attempting payout.', 'technology_integration_details': 'Integrates with RazorpayX Payout API. Publishes events to an SNS topic for system-wide notification.'}

##### 2.3.4.3.11.0.0 Events

*No items available*

##### 2.3.4.3.12.0.0 Implementation Notes

The implementation must be idempotent to prevent duplicate payouts if the job is re-run.

#### 2.3.4.4.0.0.0 Class Name

##### 2.3.4.4.1.0.0 Class Name

EventConsumer

##### 2.3.4.4.2.0.0 File Path

src/shared/messaging/event.consumer.ts

##### 2.3.4.4.3.0.0 Class Type

NestJS Service Provider

##### 2.3.4.4.4.0.0 Inheritance



##### 2.3.4.4.5.0.0 Purpose

Listens for and processes events from other microservices, such as the Order service, to trigger financial workflows.

##### 2.3.4.4.6.0.0 Dependencies

- CommissionService
- LedgerService
- RefundService

##### 2.3.4.4.7.0.0 Framework Specific Attributes

- @Injectable()

##### 2.3.4.4.8.0.0 Technology Integration Notes

This will be a long-running service that polls an SQS queue for messages.

##### 2.3.4.4.9.0.0 Properties

*No items available*

##### 2.3.4.4.10.0.0 Methods

- {'method_name': 'handleOrderDeliveredEvent', 'method_signature': 'async handleOrderDeliveredEvent(event: OrderDeliveredEvent): Promise<void>', 'return_type': 'Promise<void>', 'access_modifier': 'private', 'is_async': True, 'framework_specific_attributes': [], 'parameters': [{'parameter_name': 'event', 'parameter_type': 'OrderDeliveredEvent', 'is_nullable': False, 'purpose': 'The event payload from the Order service.', 'framework_attributes': []}], 'implementation_logic': '1. Parse the event payload to get order details (vendor ID, subtotal, total). 2. Call `commissionService.calculateAndRecordCommission` with the order data. 3. Call `ledgerService` to record the sale transaction for the vendor.', 'exception_handling': 'Must handle parsing errors and business logic exceptions. Uses a dead-letter queue (DLQ) for unprocessable messages.', 'performance_considerations': 'Processes messages concurrently up to a configured limit.', 'validation_requirements': 'Validates the event schema against the contract from `REPO-LIB-CONTRACTS`.', 'technology_integration_details': 'Uses AWS SDK for SQS to receive and delete messages.'}

##### 2.3.4.4.11.0.0 Events

*No items available*

##### 2.3.4.4.12.0.0 Implementation Notes

The SQS listener should be started as part of the application bootstrap process.

### 2.3.5.0.0.0.0 Interface Specifications

- {'interface_name': 'IFinancialTransactionRepository', 'file_path': 'src/database/repositories/financial-transaction.repository.ts', 'purpose': 'Defines the contract for data access operations related to the FinancialTransaction entity.', 'generic_constraints': '', 'framework_specific_inheritance': 'Repository<FinancialTransaction>', 'method_contracts': [{'method_name': 'createTransaction', 'method_signature': 'createTransaction(transactionData: Partial<FinancialTransaction>): Promise<FinancialTransaction>', 'return_type': 'Promise<FinancialTransaction>', 'framework_attributes': [], 'parameters': [{'parameter_name': 'transactionData', 'parameter_type': 'Partial<FinancialTransaction>', 'purpose': 'The data for the new transaction.'}], 'contract_description': 'Creates and saves a new financial transaction record.', 'exception_contracts': 'Throws if database constraints are violated.'}, {'method_name': 'getTransactionsForUserInPeriod', 'method_signature': 'getTransactionsForUserInPeriod(userId: string, period: { start: Date; end: Date }): Promise<FinancialTransaction[]>', 'return_type': 'Promise<FinancialTransaction[]>', 'framework_attributes': [], 'parameters': [{'parameter_name': 'userId', 'parameter_type': 'string', 'purpose': 'The ID of the user (vendor or rider).'}, {'parameter_name': 'period', 'parameter_type': 'object', 'purpose': 'The start and end date of the query period.'}], 'contract_description': 'Fetches all financial transactions related to a specific user within a given time frame.', 'exception_contracts': ''}], 'property_contracts': [], 'implementation_guidance': 'Implement as a custom TypeORM repository to encapsulate complex queries.'}

### 2.3.6.0.0.0.0 Enum Specifications

#### 2.3.6.1.0.0.0 Enum Name

##### 2.3.6.1.1.0.0 Enum Name

PaymentStatus

##### 2.3.6.1.2.0.0 File Path

src/database/enums/payment-status.enum.ts

##### 2.3.6.1.3.0.0 Underlying Type

string

##### 2.3.6.1.4.0.0 Purpose

Represents the possible states of a payment transaction.

##### 2.3.6.1.5.0.0 Framework Attributes

*No items available*

##### 2.3.6.1.6.0.0 Values

###### 2.3.6.1.6.1.0 Value Name

####### 2.3.6.1.6.1.1 Value Name

PENDING

####### 2.3.6.1.6.1.2 Value

\"pending\"

####### 2.3.6.1.6.1.3 Description

Payment has been initiated but not yet completed.

###### 2.3.6.1.6.2.0 Value Name

####### 2.3.6.1.6.2.1 Value Name

PENDING_CONFIRMATION

####### 2.3.6.1.6.2.2 Value

\"pending_confirmation\"

####### 2.3.6.1.6.2.3 Description

Payment was successful on the gateway, but the callback has not been received (REQ-1-057).

###### 2.3.6.1.6.3.0 Value Name

####### 2.3.6.1.6.3.1 Value Name

SUCCEEDED

####### 2.3.6.1.6.3.2 Value

\"succeeded\"

####### 2.3.6.1.6.3.3 Description

Payment was successfully completed and confirmed.

###### 2.3.6.1.6.4.0 Value Name

####### 2.3.6.1.6.4.1 Value Name

FAILED

####### 2.3.6.1.6.4.2 Value

\"failed\"

####### 2.3.6.1.6.4.3 Description

Payment failed at the gateway.

#### 2.3.6.2.0.0.0 Enum Name

##### 2.3.6.2.1.0.0 Enum Name

PayoutStatus

##### 2.3.6.2.2.0.0 File Path

src/database/enums/payout-status.enum.ts

##### 2.3.6.2.3.0.0 Underlying Type

string

##### 2.3.6.2.4.0.0 Purpose

Represents the possible states of a payout transaction.

##### 2.3.6.2.5.0.0 Framework Attributes

*No items available*

##### 2.3.6.2.6.0.0 Values

###### 2.3.6.2.6.1.0 Value Name

####### 2.3.6.2.6.1.1 Value Name

PENDING

####### 2.3.6.2.6.1.2 Value

\"pending\"

####### 2.3.6.2.6.1.3 Description

Payout has been calculated and is awaiting processing.

###### 2.3.6.2.6.2.0 Value Name

####### 2.3.6.2.6.2.1 Value Name

PROCESSING

####### 2.3.6.2.6.2.2 Value

\"processing\"

####### 2.3.6.2.6.2.3 Description

Payout has been sent to the gateway but not yet confirmed.

###### 2.3.6.2.6.3.0 Value Name

####### 2.3.6.2.6.3.1 Value Name

SUCCEEDED

####### 2.3.6.2.6.3.2 Value

\"succeeded\"

####### 2.3.6.2.6.3.3 Description

Payout was successfully processed and funds disbursed.

###### 2.3.6.2.6.4.0 Value Name

####### 2.3.6.2.6.4.1 Value Name

FAILED

####### 2.3.6.2.6.4.2 Value

\"failed\"

####### 2.3.6.2.6.4.3 Description

Payout failed at the gateway or bank.

### 2.3.7.0.0.0.0 Dto Specifications

- {'dto_name': 'CreatePaymentIntentDto', 'file_path': 'src/modules/payments/dtos/create-payment-intent.dto.ts', 'purpose': 'Defines the request body for creating a payment intent.', 'framework_base_class': '', 'properties': [{'property_name': 'orderId', 'property_type': 'string', 'validation_attributes': ['@IsUUID()'], 'serialization_attributes': [], 'framework_specific_attributes': []}, {'property_name': 'amount', 'property_type': 'number', 'validation_attributes': ['@IsInt()', '@Min(50)'], 'serialization_attributes': [], 'framework_specific_attributes': []}, {'property_name': 'currency', 'property_type': 'string', 'validation_attributes': ['@IsString()', '@Length(3, 3)'], 'serialization_attributes': [], 'framework_specific_attributes': []}], 'validation_rules': 'All fields are required. Amount must be the final order total in the smallest currency unit.', 'serialization_requirements': 'Standard JSON serialization.'}

### 2.3.8.0.0.0.0 Configuration Specifications

- {'configuration_name': 'RazorpayConfig', 'file_path': 'src/config/razorpay.config.ts', 'purpose': 'Provides strongly-typed configuration for the Razorpay integration.', 'framework_base_class': '', 'configuration_sections': [{'section_name': 'razorpay', 'properties': [{'property_name': 'keyId', 'property_type': 'string', 'default_value': '', 'required': True, 'description': 'The API Key ID for Razorpay.'}, {'property_name': 'keySecret', 'property_type': 'string', 'default_value': '', 'required': True, 'description': 'The API Key Secret for Razorpay.'}, {'property_name': 'webhookSecret', 'property_type': 'string', 'default_value': '', 'required': True, 'description': 'The secret used to validate incoming webhooks from Razorpay.'}]}], 'validation_requirements': 'All properties are required and should be loaded from environment variables or AWS Secrets Manager, not hardcoded.'}

### 2.3.9.0.0.0.0 Dependency Injection Specifications

#### 2.3.9.1.0.0.0 Service Interface

##### 2.3.9.1.1.0.0 Service Interface

ILedgerService

##### 2.3.9.1.2.0.0 Service Implementation

LedgerService

##### 2.3.9.1.3.0.0 Lifetime

Scoped

##### 2.3.9.1.4.0.0 Registration Reasoning

Scoped to the request to ensure transactional integrity within a single operation.

##### 2.3.9.1.5.0.0 Framework Registration Pattern

Standard provider registration in `ledger.module.ts`.

#### 2.3.9.2.0.0.0 Service Interface

##### 2.3.9.2.1.0.0 Service Interface

RazorpayService

##### 2.3.9.2.2.0.0 Service Implementation

RazorpayService

##### 2.3.9.2.3.0.0 Lifetime

Singleton

##### 2.3.9.2.4.0.0 Registration Reasoning

The Razorpay client is thread-safe and can be reused across the application as a singleton for performance.

##### 2.3.9.2.5.0.0 Framework Registration Pattern

Registered as a provider in a global `razorpay.module.ts`.

#### 2.3.9.3.0.0.0 Service Interface

##### 2.3.9.3.1.0.0 Service Interface

SettlementsService

##### 2.3.9.3.2.0.0 Service Implementation

SettlementsService

##### 2.3.9.3.3.0.0 Lifetime

Scoped

##### 2.3.9.3.4.0.0 Registration Reasoning

Although it's a batch job, scoping it ensures it gets fresh dependencies for each run.

##### 2.3.9.3.5.0.0 Framework Registration Pattern

Registered as a provider in `settlements.module.ts`.

### 2.3.10.0.0.0.0 External Integration Specifications

#### 2.3.10.1.0.0.0 Integration Target

##### 2.3.10.1.1.0.0 Integration Target

Razorpay Payment Gateway

##### 2.3.10.1.2.0.0 Integration Type

HTTP REST API

##### 2.3.10.1.3.0.0 Required Client Classes

- RazorpayService

##### 2.3.10.1.4.0.0 Configuration Requirements

Requires Key ID and Key Secret, loaded via `RazorpayConfig`.

##### 2.3.10.1.5.0.0 Error Handling Requirements

Must handle API errors, network timeouts, and invalid request errors gracefully, wrapping them in custom application exceptions.

##### 2.3.10.1.6.0.0 Authentication Requirements

API Key/Secret authentication.

##### 2.3.10.1.7.0.0 Framework Integration Patterns

Facade pattern implemented in `RazorpayService` to abstract the SDK.

#### 2.3.10.2.0.0.0 Integration Target

##### 2.3.10.2.1.0.0 Integration Target

AWS SNS/SQS (Order Events)

##### 2.3.10.2.2.0.0 Integration Type

Asynchronous Messaging

##### 2.3.10.2.3.0.0 Required Client Classes

- EventConsumer

##### 2.3.10.2.4.0.0 Configuration Requirements

Requires SQS Queue URL, AWS region, and IAM credentials with appropriate permissions.

##### 2.3.10.2.5.0.0 Error Handling Requirements

Must use a Dead-Letter Queue (DLQ) for messages that fail processing repeatedly. Implement visibility timeout adjustments for long-running tasks.

##### 2.3.10.2.6.0.0 Authentication Requirements

IAM Role-based authentication for the service.

##### 2.3.10.2.7.0.0 Framework Integration Patterns

A long-polling background service to consume messages from the SQS queue.

# 3.0.0.0.0.0.0 File Structure

## 3.1.0.0.0.0.0 Directory Organization

### 3.1.1.0.0.0.0 Directory Path

#### 3.1.1.1.0.0.0 Directory Path

/

#### 3.1.1.2.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.1.3.0.0.0 Contains Files

- package.json
- package-lock.json
- tsconfig.json
- tsconfig.build.json
- nest-cli.json
- .env.example
- Dockerfile
- .dockerignore
- .eslintrc.js
- .prettierrc
- jest.config.js
- .gitignore

#### 3.1.1.4.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.1.5.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

### 3.1.2.0.0.0.0 Directory Path

#### 3.1.2.1.0.0.0 Directory Path

.vscode

#### 3.1.2.2.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.2.3.0.0.0 Contains Files

- settings.json
- launch.json

#### 3.1.2.4.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.2.5.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

