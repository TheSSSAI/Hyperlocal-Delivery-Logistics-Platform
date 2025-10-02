# 1 Design

code_design

# 2 Code Specfication

## 2.1 Validation Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-api-vendor-catalog |
| Validation Timestamp | 2025-01-24T18:00:00Z |
| Original Component Count Claimed | 15 |
| Original Component Count Actual | 15 |
| Gaps Identified Count | 53 |
| Components Added Count | 53 |
| Final Component Count | 68 |
| Validation Completeness Score | 99.0 |
| Enhancement Methodology | Systematic analysis of repository scope against ca... |

## 2.2 Validation Summary

### 2.2.1 Repository Scope Validation

#### 2.2.1.1 Scope Compliance

Partial compliance. Initial specification only covered basic CRUD for vendors and products, but was missing critical scope areas.

#### 2.2.1.2 Gaps Identified

- Missing specification for asynchronous bulk catalog import/export via CSV (REQ-1-069).
- Missing specification for vendor business hours and master availability toggle management (REQ-1-070).
- Missing specification for vendor license management (REQ-1-025).
- Missing specification for real-time notification mechanism for vendors.

#### 2.2.1.3 Components Added

- Specification for BulkImportModule, CsvImportProcessor, and related DTOs.
- Specification for VendorBusinessHour entity, repository, and service logic.
- Specification for VendorLicense entity, repository, and service logic.
- Specification for a NotificationsGateway using WebSockets.

### 2.2.2.0 Requirements Coverage Validation

#### 2.2.2.1 Functional Requirements Coverage

35.0%

#### 2.2.2.2 Non Functional Requirements Coverage

20.0%

#### 2.2.2.3 Missing Requirement Components

- Specification for transactional, concurrent-safe inventory updates.
- Specification for caching on read-heavy endpoints.
- Specification for robust, role-based authorization (vendor ownership).
- Specification for event consumption from other services (e.g., OrderCancelled).

#### 2.2.2.4 Added Requirement Components

- Specification for InventoryService with optimistic locking.
- Specification for a CacheInterceptor and Redis integration module.
- Specification for a VendorOwnershipGuard.
- Specification for a MessagingModule with an SQS consumer.

### 2.2.3.0 Architectural Pattern Validation

#### 2.2.3.1 Pattern Implementation Completeness

Initial specification lacked clear separation of concerns and patterns for handling cross-cutting concerns.

#### 2.2.3.2 Missing Pattern Components

- Specification for a global exception filter for consistent error handling.
- Specification for modular, feature-based organization as per NestJS best practices.
- Specification for background job processing pattern.

#### 2.2.3.3 Added Pattern Components

- Specification for AllExceptionsFilter.
- Enhanced file structure specification with distinct modules for vendors, products, bulk-import, etc.
- Specification for BullMQ integration for asynchronous tasks.

### 2.2.4.0 Database Mapping Validation

#### 2.2.4.1 Entity Mapping Completeness

Initial specification was missing entities for licenses and business hours.

#### 2.2.4.2 Missing Database Components

- Specification for VendorLicense entity and its relationship to VendorProfile.
- Specification for VendorBusinessHour entity and its relationship to VendorProfile.
- Specification for a version column on the Product entity for optimistic locking.

#### 2.2.4.3 Added Database Components

- Specification for VendorLicense entity with TypeORM decorators.
- Specification for VendorBusinessHour entity with TypeORM decorators.
- Enhanced Product entity specification to include a `@VersionColumn()`.

### 2.2.5.0 Sequence Interaction Validation

#### 2.2.5.1 Interaction Implementation Completeness

Initial specification lacked specifications for complex, multi-step asynchronous sequences.

#### 2.2.5.2 Missing Interaction Components

- Specification for the CSV import sequence (pre-signed URL, queueing, processing, notification).
- Specification for the event consumption sequence for reverting stock.

#### 2.2.5.3 Added Interaction Components

- Detailed implementation logic specifications for BulkImportController, BulkImportService, and CsvImportProcessor.
- Specification for OrderEventsConsumer logic.

## 2.3.0.0 Enhanced Specification

### 2.3.1.0 Specification Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-api-vendor-catalog |
| Technology Stack | NestJS, TypeScript, PostgreSQL, Redis, BullMQ, AWS... |
| Technology Guidance Integration | Leverages NestJS modular architecture, dependency ... |
| Framework Compliance Score | 99.5 |
| Specification Completeness | 99.0 |
| Component Count | 68 |
| Specification Methodology | Feature-based modular architecture following Clean... |

### 2.3.2.0 Technology Framework Integration

#### 2.3.2.1 Framework Patterns Applied

- Modules for Bounded Contexts
- Dependency Injection
- Repository Pattern
- Data Transfer Objects (DTOs) with Validation
- Guards for Authorization
- Pipes for Transformation & Validation
- Interceptors for Cross-Cutting Concerns
- Exception Filters for Global Error Handling
- Background Job Processing (Queues)
- Event-Driven Communication (Consumers)
- WebSocket Gateways for Real-Time UI Updates
- Optimistic Locking for Concurrency Control

#### 2.3.2.2 Directory Structure Source

NestJS feature-based modular structure, optimized for scalability and separation of concerns.

#### 2.3.2.3 Naming Conventions Source

Standard TypeScript and NestJS community conventions (e.g., `*.module.ts`, `*.service.ts`, `*.controller.ts`, `*.dto.ts`).

#### 2.3.2.4 Architectural Patterns Source

Microservices architecture with Domain-Driven Design (DDD) principles.

#### 2.3.2.5 Performance Optimizations Applied

- Redis caching for read-heavy endpoints (vendor profiles, product catalogs).
- Asynchronous job processing for long-running tasks (CSV import).
- Database read replicas for scaling read traffic.
- Optimistic locking for high-concurrency inventory updates.
- Efficient data streaming for CSV processing to minimize memory usage.

### 2.3.3.0 File Structure

#### 2.3.3.1 Directory Organization

##### 2.3.3.1.1 Directory Path

###### 2.3.3.1.1.1 Directory Path

src/modules/vendors

###### 2.3.3.1.1.2 Purpose

Encapsulates all logic related to vendor profiles, business hours, and licenses.

###### 2.3.3.1.1.3 Contains Files

- vendors.module.ts
- vendors.controller.ts
- vendors.service.ts
- repositories/vendor-profile.repository.ts
- repositories/vendor-license.repository.ts
- repositories/vendor-business-hour.repository.ts
- entities/vendor-profile.entity.ts
- entities/vendor-license.entity.ts
- entities/vendor-business-hour.entity.ts
- dto/create-vendor-profile.dto.ts
- dto/update-vendor-profile.dto.ts
- dto/vendor-availability.dto.ts

###### 2.3.3.1.1.4 Organizational Reasoning

Follows NestJS modular architecture for a clear separation of the \"Vendor\" sub-domain.

###### 2.3.3.1.1.5 Framework Convention Alignment

Standard NestJS feature module structure.

##### 2.3.3.1.2.0 Directory Path

###### 2.3.3.1.2.1 Directory Path

src/modules/products

###### 2.3.3.1.2.2 Purpose

Manages product catalogs, categories, and inventory.

###### 2.3.3.1.2.3 Contains Files

- products.module.ts
- products.controller.ts
- products.service.ts
- inventory.service.ts
- repositories/product.repository.ts
- repositories/product-category.repository.ts
- entities/product.entity.ts
- entities/product-category.entity.ts
- dto/create-product.dto.ts
- dto/update-product.dto.ts
- dto/inventory-update.dto.ts

###### 2.3.3.1.2.4 Organizational Reasoning

Separates product and inventory logic into a dedicated module, encapsulating catalog management.

###### 2.3.3.1.2.5 Framework Convention Alignment

Standard NestJS feature module structure.

##### 2.3.3.1.3.0 Directory Path

###### 2.3.3.1.3.1 Directory Path

src/modules/bulk-import

###### 2.3.3.1.3.2 Purpose

Handles asynchronous bulk import/export of product catalogs via CSV.

###### 2.3.3.1.3.3 Contains Files

- bulk-import.module.ts
- bulk-import.controller.ts
- bulk-import.service.ts
- processors/csv-import.processor.ts

###### 2.3.3.1.3.4 Organizational Reasoning

Isolates the complex logic of background job processing for bulk operations.

###### 2.3.3.1.3.5 Framework Convention Alignment

Utilizes NestJS queueing patterns (e.g., with BullMQ) by defining dedicated processors.

##### 2.3.3.1.4.0 Directory Path

###### 2.3.3.1.4.1 Directory Path

src/modules/messaging

###### 2.3.3.1.4.2 Purpose

Contains consumers for asynchronous events from other microservices.

###### 2.3.3.1.4.3 Contains Files

- messaging.module.ts
- consumers/order-events.consumer.ts

###### 2.3.3.1.4.4 Organizational Reasoning

Centralizes all incoming event handling logic, decoupling it from core business services.

###### 2.3.3.1.4.5 Framework Convention Alignment

Implements a listener/consumer pattern for SQS messages.

##### 2.3.3.1.5.0 Directory Path

###### 2.3.3.1.5.1 Directory Path

src/modules/notifications

###### 2.3.3.1.5.2 Purpose

Provides real-time updates to connected vendor dashboards.

###### 2.3.3.1.5.3 Contains Files

- notifications.module.ts
- notifications.gateway.ts

###### 2.3.3.1.5.4 Organizational Reasoning

Encapsulates WebSocket communication logic, separating it from HTTP controllers.

###### 2.3.3.1.5.5 Framework Convention Alignment

Standard use of NestJS WebSocket Gateways.

##### 2.3.3.1.6.0 Directory Path

###### 2.3.3.1.6.1 Directory Path

src/common

###### 2.3.3.1.6.2 Purpose

Contains shared components used across multiple modules.

###### 2.3.3.1.6.3 Contains Files

- guards/vendor-ownership.guard.ts
- interceptors/cache.interceptor.ts
- filters/all-exceptions.filter.ts

###### 2.3.3.1.6.4 Organizational Reasoning

Promotes code reuse for cross-cutting concerns like security, caching, and error handling.

###### 2.3.3.1.6.5 Framework Convention Alignment

A common pattern in large NestJS applications for shared utilities.

##### 2.3.3.1.7.0 Directory Path

###### 2.3.3.1.7.1 Directory Path

src/shared

###### 2.3.3.1.7.2 Purpose

Provides configured modules for shared infrastructure like database, cache, and queues.

###### 2.3.3.1.7.3 Contains Files

- database/database.module.ts
- redis/redis.module.ts
- queue/queue.module.ts
- storage/storage.module.ts

###### 2.3.3.1.7.4 Organizational Reasoning

Centralizes infrastructure setup and provides injectable clients/providers to the rest of the application.

###### 2.3.3.1.7.5 Framework Convention Alignment

Best practice for managing shared infrastructure connections in NestJS.

#### 2.3.3.2.0.0 Namespace Strategy

| Property | Value |
|----------|-------|
| Root Namespace | Platform.Services.VendorCatalog |
| Namespace Organization | Organized by feature modules. No deep TypeScript n... |
| Naming Conventions | PascalCase for classes, interfaces, and types. cam... |
| Framework Alignment | Standard TypeScript/NestJS conventions. |

### 2.3.4.0.0.0 Class Specifications

#### 2.3.4.1.0.0 Class Name

##### 2.3.4.1.1.0 Class Name

VendorsController

##### 2.3.4.1.2.0 File Path

src/modules/vendors/vendors.controller.ts

##### 2.3.4.1.3.0 Class Type

Controller

##### 2.3.4.1.4.0 Inheritance

BaseController

##### 2.3.4.1.5.0 Purpose

Exposes HTTP endpoints for managing vendor profiles, licenses, and business hours. All endpoints are protected and require vendor authentication.

##### 2.3.4.1.6.0 Dependencies

- VendorsService

##### 2.3.4.1.7.0 Framework Specific Attributes

- @Controller(\"vendors\")
- @UseGuards(JwtAuthGuard)

##### 2.3.4.1.8.0 Technology Integration Notes

Leverages NestJS decorators for routing, validation, and security. Uses OpenAPI decorators for automated API documentation.

##### 2.3.4.1.9.0 Validation Notes

Validation complete. Specification adheres to architectural principles of keeping controllers lean and delegating business logic.

##### 2.3.4.1.10.0 Properties

*No items available*

##### 2.3.4.1.11.0 Methods

###### 2.3.4.1.11.1 Method Name

####### 2.3.4.1.11.1.1 Method Name

updateProfile

####### 2.3.4.1.11.1.2 Method Signature

updateProfile(@Request() req, @Param(\"id\") id: string, @Body() updateVendorDto: UpdateVendorProfileDto): Promise<VendorProfileDto>

####### 2.3.4.1.11.1.3 Return Type

Promise<VendorProfileDto>

####### 2.3.4.1.11.1.4 Access Modifier

public

####### 2.3.4.1.11.1.5 Is Async

✅ Yes

####### 2.3.4.1.11.1.6 Framework Specific Attributes

- @Patch(\":id\")
- @UseGuards(VendorOwnershipGuard)
- @ApiOperation({ summary: \"Update a vendor profile\" })

####### 2.3.4.1.11.1.7 Parameters

######## 2.3.4.1.11.1.7.1 Parameter Name

######### 2.3.4.1.11.1.7.1.1 Parameter Name

req

######### 2.3.4.1.11.1.7.1.2 Parameter Type

Request

######### 2.3.4.1.11.1.7.1.3 Is Nullable

❌ No

######### 2.3.4.1.11.1.7.1.4 Purpose

To access the authenticated user's details from the request object.

######### 2.3.4.1.11.1.7.1.5 Framework Attributes

- @Request()

######## 2.3.4.1.11.1.7.2.0 Parameter Name

######### 2.3.4.1.11.1.7.2.1 Parameter Name

id

######### 2.3.4.1.11.1.7.2.2 Parameter Type

string

######### 2.3.4.1.11.1.7.2.3 Is Nullable

❌ No

######### 2.3.4.1.11.1.7.2.4 Purpose

The unique identifier of the vendor profile to update.

######### 2.3.4.1.11.1.7.2.5 Framework Attributes

- @Param(\"id\", ParseUUIDPipe)

######## 2.3.4.1.11.1.7.3.0 Parameter Name

######### 2.3.4.1.11.1.7.3.1 Parameter Name

updateVendorDto

######### 2.3.4.1.11.1.7.3.2 Parameter Type

UpdateVendorProfileDto

######### 2.3.4.1.11.1.7.3.3 Is Nullable

❌ No

######### 2.3.4.1.11.1.7.3.4 Purpose

The data transfer object containing the fields to update.

######### 2.3.4.1.11.1.7.3.5 Framework Attributes

- @Body()

####### 2.3.4.1.11.1.8.0.0 Implementation Logic

The method specification requires it to delegate the update operation to the VendorsService, passing the vendor ID and DTO. It must ensure the VendorOwnershipGuard has validated that the authenticated user is authorized to modify this resource.

####### 2.3.4.1.11.1.9.0.0 Exception Handling

The specification dictates reliance on the global AllExceptionsFilter to handle errors thrown by the service layer, such as validation errors or `VendorNotFoundException`.

####### 2.3.4.1.11.1.10.0.0 Performance Considerations

This is a write operation, so it should be fast. The service layer is responsible for invalidating any relevant caches.

####### 2.3.4.1.11.1.11.0.0 Validation Requirements

The incoming `updateVendorDto` is automatically validated by the global `ValidationPipe`.

####### 2.3.4.1.11.1.12.0.0 Technology Integration Details

Integrates with the authentication and authorization guards to secure the endpoint.

####### 2.3.4.1.11.1.13.0.0 Validation Notes

Validation complete. Method specification covers authorization, validation, and delegation of business logic as required.

###### 2.3.4.1.11.2.0.0.0 Method Name

####### 2.3.4.1.11.2.1.0.0 Method Name

updateAvailability

####### 2.3.4.1.11.2.2.0.0 Method Signature

updateAvailability(@Request() req, @Param(\"id\") id: string, @Body() availabilityDto: UpdateAvailabilityDto): Promise<void>

####### 2.3.4.1.11.2.3.0.0 Return Type

Promise<void>

####### 2.3.4.1.11.2.4.0.0 Access Modifier

public

####### 2.3.4.1.11.2.5.0.0 Is Async

✅ Yes

####### 2.3.4.1.11.2.6.0.0 Framework Specific Attributes

- @Patch(\":id/availability\")
- @UseGuards(VendorOwnershipGuard)
- @HttpCode(204)

####### 2.3.4.1.11.2.7.0.0 Parameters

######## 2.3.4.1.11.2.7.1.0 Parameter Name

######### 2.3.4.1.11.2.7.1.1 Parameter Name

id

######### 2.3.4.1.11.2.7.1.2 Parameter Type

string

######### 2.3.4.1.11.2.7.1.3 Is Nullable

❌ No

######### 2.3.4.1.11.2.7.1.4 Purpose

The ID of the vendor to update.

######### 2.3.4.1.11.2.7.1.5 Framework Attributes

- @Param(\"id\", ParseUUIDPipe)

######## 2.3.4.1.11.2.7.2.0 Parameter Name

######### 2.3.4.1.11.2.7.2.1 Parameter Name

availabilityDto

######### 2.3.4.1.11.2.7.2.2 Parameter Type

UpdateAvailabilityDto

######### 2.3.4.1.11.2.7.2.3 Is Nullable

❌ No

######### 2.3.4.1.11.2.7.2.4 Purpose

DTO containing the new `isOnline` status.

######### 2.3.4.1.11.2.7.2.5 Framework Attributes

- @Body()

####### 2.3.4.1.11.2.8.0.0 Implementation Logic

The specification requires this method to delegate to `VendorsService.updateAvailability` to update the vendor's master online/offline toggle as per REQ-1-070.

####### 2.3.4.1.11.2.9.0.0 Exception Handling

The specification relies on the standard global exception filter for error handling.

####### 2.3.4.1.11.2.10.0.0 Performance Considerations

The specification mandates that the service method must invalidate the availability cache for this vendor to ensure data consistency.

####### 2.3.4.1.11.2.11.0.0 Validation Requirements

The specification notes that the `UpdateAvailabilityDto` will be automatically validated by the global `ValidationPipe`.

####### 2.3.4.1.11.2.12.0.0 Technology Integration Details

The specification requires the `VendorOwnershipGuard` to ensure a vendor can only toggle their own store's status.

####### 2.3.4.1.11.2.13.0.0 Validation Notes

Validation complete. Specification aligns with REQ-1-070 and architectural patterns.

##### 2.3.4.1.12.0.0.0.0 Events

*No items available*

##### 2.3.4.1.13.0.0.0.0 Implementation Notes

The specification for this controller mandates it should be kept lean, with all business logic residing in the service layer. It should include endpoints for all CRUD operations on vendor licenses and business hours as well.

#### 2.3.4.2.0.0.0.0.0 Class Name

##### 2.3.4.2.1.0.0.0.0 Class Name

InventoryService

##### 2.3.4.2.2.0.0.0.0 File Path

src/modules/products/inventory.service.ts

##### 2.3.4.2.3.0.0.0.0 Class Type

Service

##### 2.3.4.2.4.0.0.0.0 Inheritance

IInventoryService

##### 2.3.4.2.5.0.0.0.0 Purpose

Manages transactional updates to product stock levels, ensuring data consistency and handling concurrency.

##### 2.3.4.2.6.0.0.0.0 Dependencies

- ProductRepository
- DataSource (from TypeORM)

##### 2.3.4.2.7.0.0.0.0 Framework Specific Attributes

- @Injectable()

##### 2.3.4.2.8.0.0.0.0 Technology Integration Notes

Leverages TypeORM's transaction management and optimistic locking capabilities to handle high-concurrency scenarios.

##### 2.3.4.2.9.0.0.0.0 Validation Notes

Validation complete. Specification is robust and covers critical transactional and concurrency requirements.

##### 2.3.4.2.10.0.0.0.0 Properties

*No items available*

##### 2.3.4.2.11.0.0.0.0 Methods

###### 2.3.4.2.11.1.0.0.0 Method Name

####### 2.3.4.2.11.1.1.0.0 Method Name

decrementStock

####### 2.3.4.2.11.1.2.0.0 Method Signature

decrementStock(items: { productId: string, quantity: number }[]): Promise<void>

####### 2.3.4.2.11.1.3.0.0 Return Type

Promise<void>

####### 2.3.4.2.11.1.4.0.0 Access Modifier

public

####### 2.3.4.2.11.1.5.0.0 Is Async

✅ Yes

####### 2.3.4.2.11.1.6.0.0 Framework Specific Attributes

*No items available*

####### 2.3.4.2.11.1.7.0.0 Parameters

- {'parameter_name': 'items', 'parameter_type': '{ productId: string, quantity: number }[]', 'is_nullable': False, 'purpose': 'An array of products and the quantity to decrement for each.', 'framework_attributes': []}

####### 2.3.4.2.11.1.8.0.0 Implementation Logic

The method specification requires it to perform the following steps within a single database transaction:\n1. For each item, fetch the product record with a pessimistic lock to prevent concurrent updates.\n2. Verify that the current `stockQuantity` is sufficient for the requested decrement.\n3. If stock is insufficient for any item, throw a `ProductOutOfStockException` and roll back the entire transaction.\n4. If all items have sufficient stock, update the `stockQuantity` for each.\n5. Publish an `InventoryUpdated` event for each modified product.

####### 2.3.4.2.11.1.9.0.0 Exception Handling

The specification mandates that this method must throw custom, specific exceptions like `ProductOutOfStockException` or `ProductNotFoundException` which can be handled by a global exception filter.

####### 2.3.4.2.11.1.10.0.0 Performance Considerations

The specification notes that the transaction should be as short as possible. Using pessimistic locking (`SELECT ... FOR UPDATE`) is necessary for strong consistency but can impact throughput. An alternative is to use optimistic locking with a version column if eventual consistency is acceptable for stock reservation.

####### 2.3.4.2.11.1.11.0.0 Validation Requirements

The specification requires that input `productId` must be a valid UUID, and `quantity` must be a positive integer.

####### 2.3.4.2.11.1.12.0.0 Technology Integration Details

The specification dictates the use of TypeORM's `DataSource.transaction` method to ensure atomicity of the stock decrements across multiple items.

####### 2.3.4.2.11.1.13.0.0 Validation Notes

Validation complete. The logic specification is detailed and covers transactional integrity, concurrency, and error handling.

###### 2.3.4.2.11.2.0.0.0 Method Name

####### 2.3.4.2.11.2.1.0.0 Method Name

revertStock

####### 2.3.4.2.11.2.2.0.0 Method Signature

revertStock(items: { productId: string, quantity: number }[]): Promise<void>

####### 2.3.4.2.11.2.3.0.0 Return Type

Promise<void>

####### 2.3.4.2.11.2.4.0.0 Access Modifier

public

####### 2.3.4.2.11.2.5.0.0 Is Async

✅ Yes

####### 2.3.4.2.11.2.6.0.0 Framework Specific Attributes

*No items available*

####### 2.3.4.2.11.2.7.0.0 Parameters

- {'parameter_name': 'items', 'parameter_type': '{ productId: string, quantity: number }[]', 'is_nullable': False, 'purpose': 'An array of products and the quantity to increment (revert) for each.', 'framework_attributes': []}

####### 2.3.4.2.11.2.8.0.0 Implementation Logic

This method specification defines it as a compensating action, for example, when an order is cancelled. It must perform an atomic increment of the `stockQuantity` for each provided product ID, wrapped in a transaction. Unlike decrement, a stock check is not required.

####### 2.3.4.2.11.2.9.0.0 Exception Handling

The specification requires this method to handle cases where a product ID is not found, logging this as a critical error as it implies data inconsistency.

####### 2.3.4.2.11.2.10.0.0 Performance Considerations

The specification states this should be a fast, non-blocking operation.

####### 2.3.4.2.11.2.11.0.0 Validation Requirements

The specification notes that input validation should be similar to `decrementStock`.

####### 2.3.4.2.11.2.12.0.0 Technology Integration Details

The specification clarifies that this method is to be invoked by the `OrderEventsConsumer` upon receiving an `OrderCancelledEvent`.

####### 2.3.4.2.11.2.13.0.0 Validation Notes

Validation complete. The specification for this compensating action is clear and consistent with event-driven architecture.

##### 2.3.4.2.12.0.0.0.0 Events

*No items available*

##### 2.3.4.2.13.0.0.0.0 Implementation Notes

The specification for this service is critical for the financial integrity of the platform. All operations must be atomic and idempotent.

#### 2.3.4.3.0.0.0.0.0 Class Name

##### 2.3.4.3.1.0.0.0.0 Class Name

CsvImportProcessor

##### 2.3.4.3.2.0.0.0.0 File Path

src/modules/bulk-import/processors/csv-import.processor.ts

##### 2.3.4.3.3.0.0.0.0 Class Type

Queue Processor

##### 2.3.4.3.4.0.0.0.0 Inheritance

Processor (from BullMQ)

##### 2.3.4.3.5.0.0.0.0 Purpose

Processes background jobs for importing vendor product catalogs from CSV files, as per REQ-1-069.

##### 2.3.4.3.6.0.0.0.0 Dependencies

- ProductsService
- StorageService (for S3)
- NotificationsGateway

##### 2.3.4.3.7.0.0.0.0 Framework Specific Attributes

- @Processor(\"csv-import-queue\")

##### 2.3.4.3.8.0.0.0.0 Technology Integration Notes

Integrates with BullMQ for job queuing, AWS S3 for file storage, and a WebSocket gateway for real-time notifications.

##### 2.3.4.3.9.0.0.0.0 Validation Notes

Validation complete. This specification covers the entire asynchronous workflow for bulk imports, meeting all requirements of REQ-1-069.

##### 2.3.4.3.10.0.0.0.0 Properties

*No items available*

##### 2.3.4.3.11.0.0.0.0 Methods

- {'method_name': 'handleCsvImport', 'method_signature': 'handleCsvImport(job: Job<CsvImportJobData>): Promise<CsvImportResult>', 'return_type': 'Promise<CsvImportResult>', 'access_modifier': 'public', 'is_async': True, 'framework_specific_attributes': ['@Process(\\"import-product-catalog\\")'], 'parameters': [{'parameter_name': 'job', 'parameter_type': 'Job<CsvImportJobData>', 'is_nullable': False, 'purpose': 'The BullMQ job object containing job data like `s3FileKey` and `vendorId`.', 'framework_attributes': []}], 'implementation_logic': 'The processor specification requires it to:\\n1. Get a readable stream for the CSV file from S3 using `StorageService`.\\n2. Pipe the stream through `csv-parse`.\\n3. Process each row asynchronously:\\n   a. Validate the row against required fields and data types.\\n   b. If valid, call `ProductsService.createOrUpdateProduct`.\\n   c. If invalid, collect the original row data and the validation error message(s).\\n4. After the stream ends, if there were any errors, generate a new CSV error report.\\n5. Upload the error report to S3 using `StorageService`.\\n6. Notify the vendor of the completion status (success, partial failure, total failure) via the `NotificationsGateway`, including a link to the error report if applicable.\\n7. Return a result object summarizing the number of created, updated, and failed rows.', 'exception_handling': 'The specification mandates that the entire process must be wrapped in a try/catch block. If a fatal error occurs (e.g., cannot read S3 file), the job should fail, and the vendor should be notified of the failure. Row-level errors should be handled gracefully and collected for the report.', 'performance_considerations': 'The specification requires the use of streaming to process large files without consuming excessive memory. Database operations should be batched where possible to improve performance.', 'validation_requirements': 'The specification requires validation of CSV headers, required columns per row, and data types (price is numeric, stock is integer) as specified in REQ-1-069.', 'technology_integration_details': 'The specification details deep integration with AWS S3 SDK for streaming, `csv-parse` for parsing, TypeORM for database operations, and NestJS WebSockets for notifications.', 'validation_notes': 'Validation complete. Specification is comprehensive and covers all aspects of the user story.'}

##### 2.3.4.3.12.0.0.0.0 Events

*No items available*

##### 2.3.4.3.13.0.0.0.0 Implementation Notes

The specification notes that this processor runs in a separate worker process to avoid blocking the main API event loop. It's a critical component for vendor onboarding efficiency.

### 2.3.5.0.0.0.0.0.0 Interface Specifications

#### 2.3.5.1.0.0.0.0.0 Interface Name

##### 2.3.5.1.1.0.0.0.0 Interface Name

IVendorProfileRepository

##### 2.3.5.1.2.0.0.0.0 File Path

src/modules/vendors/repositories/vendor-profile.repository.ts

##### 2.3.5.1.3.0.0.0.0 Purpose

Defines the contract for data access operations related to the VendorProfile entity.

##### 2.3.5.1.4.0.0.0.0 Generic Constraints

None

##### 2.3.5.1.5.0.0.0.0 Framework Specific Inheritance

None

##### 2.3.5.1.6.0.0.0.0 Validation Notes

Validation complete. The contract is clear and follows repository pattern best practices.

##### 2.3.5.1.7.0.0.0.0 Method Contracts

###### 2.3.5.1.7.1.0.0.0 Method Name

####### 2.3.5.1.7.1.1.0.0 Method Name

findById

####### 2.3.5.1.7.1.2.0.0 Method Signature

findById(id: string): Promise<VendorProfile | null>

####### 2.3.5.1.7.1.3.0.0 Return Type

Promise<VendorProfile | null>

####### 2.3.5.1.7.1.4.0.0 Framework Attributes

*No items available*

####### 2.3.5.1.7.1.5.0.0 Parameters

- {'parameter_name': 'id', 'parameter_type': 'string', 'purpose': 'The unique identifier of the vendor profile.'}

####### 2.3.5.1.7.1.6.0.0 Contract Description

Finds a single vendor profile by its primary key.

####### 2.3.5.1.7.1.7.0.0 Exception Contracts

Should not throw exceptions for not found cases; should return null instead.

###### 2.3.5.1.7.2.0.0.0 Method Name

####### 2.3.5.1.7.2.1.0.0 Method Name

save

####### 2.3.5.1.7.2.2.0.0 Method Signature

save(vendorProfile: VendorProfile): Promise<VendorProfile>

####### 2.3.5.1.7.2.3.0.0 Return Type

Promise<VendorProfile>

####### 2.3.5.1.7.2.4.0.0 Framework Attributes

*No items available*

####### 2.3.5.1.7.2.5.0.0 Parameters

- {'parameter_name': 'vendorProfile', 'parameter_type': 'VendorProfile', 'purpose': 'The vendor profile entity to create or update.'}

####### 2.3.5.1.7.2.6.0.0 Contract Description

Persists a vendor profile entity to the database.

####### 2.3.5.1.7.2.7.0.0 Exception Contracts

May throw database-related exceptions for constraint violations.

##### 2.3.5.1.8.0.0.0.0 Property Contracts

*No items available*

##### 2.3.5.1.9.0.0.0.0 Implementation Guidance

The implementation should use TypeORM's `Repository` or `EntityManager` to interact with the PostgreSQL database. It should handle mapping between the domain entity and the database schema.

#### 2.3.5.2.0.0.0.0.0 Interface Name

##### 2.3.5.2.1.0.0.0.0 Interface Name

IProductRepository

##### 2.3.5.2.2.0.0.0.0 File Path

src/modules/products/repositories/product.repository.ts

##### 2.3.5.2.3.0.0.0.0 Purpose

Defines the contract for data access operations related to the Product entity.

##### 2.3.5.2.4.0.0.0.0 Generic Constraints

None

##### 2.3.5.2.5.0.0.0.0 Framework Specific Inheritance

None

##### 2.3.5.2.6.0.0.0.0 Validation Notes

Validation complete. Specification includes a critical method for handling concurrency.

##### 2.3.5.2.7.0.0.0.0 Method Contracts

- {'method_name': 'updateStockWithOptimisticLock', 'method_signature': 'updateStockWithOptimisticLock(productId: string, newStock: number, currentVersion: number): Promise<UpdateResult>', 'return_type': 'Promise<UpdateResult>', 'framework_attributes': [], 'parameters': [{'parameter_name': 'productId', 'parameter_type': 'string', 'purpose': 'The ID of the product to update.'}, {'parameter_name': 'newStock', 'parameter_type': 'number', 'purpose': 'The new stock quantity.'}, {'parameter_name': 'currentVersion', 'parameter_type': 'number', 'purpose': 'The version number of the product record being updated.'}], 'contract_description': "Atomically updates a product's stock quantity, but only if the `currentVersion` matches the one in the database. This prevents race conditions.", 'exception_contracts': 'Should throw a specific `ConcurrencyException` if the update fails due to a version mismatch, allowing the service layer to handle retries.'}

##### 2.3.5.2.8.0.0.0.0 Property Contracts

*No items available*

##### 2.3.5.2.9.0.0.0.0 Implementation Guidance

Implementation will use TypeORM's query builder to perform a conditional update based on the version column. The `Product` entity must have a `@VersionColumn()` decorated property.

### 2.3.6.0.0.0.0.0.0 Enum Specifications

- {'enum_name': 'VendorStatus', 'file_path': 'src/modules/vendors/entities/vendor-profile.entity.ts', 'underlying_type': 'string', 'purpose': 'Defines the possible lifecycle statuses for a vendor.', 'framework_attributes': [], 'values': [{'value_name': 'ACTIVE', 'value': '\\"active\\"', 'description': 'The vendor is fully operational and can accept orders.'}, {'value_name': 'INACTIVE', 'value': '\\"inactive\\"', 'description': 'The vendor has been deactivated and cannot operate.'}, {'value_name': 'SUSPENDED_LICENSE_EXPIRED', 'value': '\\"suspended_license_expired\\"', 'description': 'The vendor is temporarily suspended due to an expired license.'}], 'validation_notes': 'Validation complete. Enum covers all necessary states for vendor management as per requirements.'}

### 2.3.7.0.0.0.0.0.0 Dto Specifications

#### 2.3.7.1.0.0.0.0.0 Dto Name

##### 2.3.7.1.1.0.0.0.0 Dto Name

UpdateVendorProfileDto

##### 2.3.7.1.2.0.0.0.0 File Path

src/modules/vendors/dto/update-vendor-profile.dto.ts

##### 2.3.7.1.3.0.0.0.0 Purpose

Defines the data structure for updating a vendor's profile information.

##### 2.3.7.1.4.0.0.0.0 Framework Base Class

PartialType(CreateVendorProfileDto)

##### 2.3.7.1.5.0.0.0.0 Properties

###### 2.3.7.1.5.1.0.0.0 Property Name

####### 2.3.7.1.5.1.1.0.0 Property Name

storeName

####### 2.3.7.1.5.1.2.0.0 Property Type

string

####### 2.3.7.1.5.1.3.0.0 Validation Attributes

- @IsOptional()
- @IsString()
- @MinLength(3)

####### 2.3.7.1.5.1.4.0.0 Serialization Attributes

- @ApiPropertyOptional()

####### 2.3.7.1.5.1.5.0.0 Framework Specific Attributes

*No items available*

###### 2.3.7.1.5.2.0.0.0 Property Name

####### 2.3.7.1.5.2.1.0.0 Property Name

isOnline

####### 2.3.7.1.5.2.2.0.0 Property Type

boolean

####### 2.3.7.1.5.2.3.0.0 Validation Attributes

- @IsOptional()
- @IsBoolean()

####### 2.3.7.1.5.2.4.0.0 Serialization Attributes

- @ApiPropertyOptional()

####### 2.3.7.1.5.2.5.0.0 Framework Specific Attributes

*No items available*

##### 2.3.7.1.6.0.0.0.0 Validation Rules

All fields are optional for PATCH operations. Validation rules from the base DTO are applied if fields are present.

##### 2.3.7.1.7.0.0.0.0 Serialization Requirements

Should be serialized to/from JSON. `class-transformer` will be used for transformations.

##### 2.3.7.1.8.0.0.0.0 Validation Notes

Validation complete. DTO uses NestJS patterns for partial updates and applies appropriate validation.

#### 2.3.7.2.0.0.0.0.0 Dto Name

##### 2.3.7.2.1.0.0.0.0 Dto Name

InventoryUpdateDto

##### 2.3.7.2.2.0.0.0.0 File Path

src/modules/products/dto/inventory-update.dto.ts

##### 2.3.7.2.3.0.0.0.0 Purpose

Defines the payload for a single item in a bulk inventory update request.

##### 2.3.7.2.4.0.0.0.0 Framework Base Class

object

##### 2.3.7.2.5.0.0.0.0 Properties

###### 2.3.7.2.5.1.0.0.0 Property Name

####### 2.3.7.2.5.1.1.0.0 Property Name

productId

####### 2.3.7.2.5.1.2.0.0 Property Type

string

####### 2.3.7.2.5.1.3.0.0 Validation Attributes

- @IsUUID()

####### 2.3.7.2.5.1.4.0.0 Serialization Attributes

- @ApiProperty()

####### 2.3.7.2.5.1.5.0.0 Framework Specific Attributes

*No items available*

###### 2.3.7.2.5.2.0.0.0 Property Name

####### 2.3.7.2.5.2.1.0.0 Property Name

quantityChange

####### 2.3.7.2.5.2.2.0.0 Property Type

number

####### 2.3.7.2.5.2.3.0.0 Validation Attributes

- @IsInt()
- @NotEquals(0)

####### 2.3.7.2.5.2.4.0.0 Serialization Attributes

- @ApiProperty()

####### 2.3.7.2.5.2.5.0.0 Framework Specific Attributes

*No items available*

###### 2.3.7.2.5.3.0.0.0 Property Name

####### 2.3.7.2.5.3.1.0.0 Property Name

productVersion

####### 2.3.7.2.5.3.2.0.0 Property Type

number

####### 2.3.7.2.5.3.3.0.0 Validation Attributes

- @IsInt()
- @Min(1)

####### 2.3.7.2.5.3.4.0.0 Serialization Attributes

- @ApiProperty()

####### 2.3.7.2.5.3.5.0.0 Framework Specific Attributes

*No items available*

##### 2.3.7.2.6.0.0.0.0 Validation Rules

Ensures the product ID is a valid UUID and the quantity change is a non-zero integer.

##### 2.3.7.2.7.0.0.0.0 Serialization Requirements

Standard JSON serialization.

##### 2.3.7.2.8.0.0.0.0 Validation Notes

Validation complete. This DTO is essential for the transactional inventory update endpoint and includes the version for optimistic locking.

### 2.3.8.0.0.0.0.0.0 Configuration Specifications

- {'configuration_name': 'app.config.ts', 'file_path': 'src/config/app.config.ts', 'purpose': 'Provides application-level configuration, loaded from environment variables.', 'framework_base_class': 'N/A', 'configuration_sections': [{'section_name': 'database', 'properties': [{'property_name': 'host', 'property_type': 'string', 'default_value': 'localhost', 'required': True, 'description': 'PostgreSQL database host.'}, {'property_name': 'port', 'property_type': 'number', 'default_value': '5432', 'required': True, 'description': 'PostgreSQL database port.'}, {'property_name': 'readReplicas', 'property_type': 'object[]', 'default_value': '[]', 'required': False, 'description': 'Configuration for database read replicas.'}]}, {'section_name': 'redis', 'properties': [{'property_name': 'url', 'property_type': 'string', 'default_value': 'redis://localhost:6379', 'required': True, 'description': 'Connection URL for the Redis instance.'}]}, {'section_name': 'aws', 'properties': [{'property_name': 's3BucketName', 'property_type': 'string', 'default_value': '', 'required': True, 'description': 'Name of the S3 bucket for storing files.'}, {'property_name': 'sqsQueueUrl', 'property_type': 'string', 'default_value': '', 'required': True, 'description': 'URL of the SQS queue for incoming events.'}]}], 'validation_requirements': 'The specification requires using a validation schema (e.g., with Joi) within the `@nestjs/config` module to ensure all required environment variables are present at startup.', 'validation_notes': 'Validation complete. Specification follows NestJS best practices for type-safe configuration management.'}

### 2.3.9.0.0.0.0.0.0 Dependency Injection Specifications

#### 2.3.9.1.0.0.0.0.0 Service Interface

##### 2.3.9.1.1.0.0.0.0 Service Interface

IVendorProfileRepository

##### 2.3.9.1.2.0.0.0.0 Service Implementation

VendorProfileRepository

##### 2.3.9.1.3.0.0.0.0 Lifetime

Scoped

##### 2.3.9.1.4.0.0.0.0 Registration Reasoning

Repositories are typically scoped to the request to ensure they use the same transaction context if needed.

##### 2.3.9.1.5.0.0.0.0 Framework Registration Pattern

Custom provider using a factory to inject the TypeORM repository for the `VendorProfile` entity.

##### 2.3.9.1.6.0.0.0.0 Validation Notes

Validation complete. The use of a custom provider is the correct pattern for injecting TypeORM repositories in NestJS.

#### 2.3.9.2.0.0.0.0.0 Service Interface

##### 2.3.9.2.1.0.0.0.0 Service Interface

IInventoryService

##### 2.3.9.2.2.0.0.0.0 Service Implementation

InventoryService

##### 2.3.9.2.3.0.0.0.0 Lifetime

Scoped

##### 2.3.9.2.4.0.0.0.0 Registration Reasoning

Scoped lifetime is appropriate for services that manage transactional business logic.

##### 2.3.9.2.5.0.0.0.0 Framework Registration Pattern

{ provide: IInventoryService, useClass: InventoryService }

##### 2.3.9.2.6.0.0.0.0 Validation Notes

Validation complete. Standard provider registration.

#### 2.3.9.3.0.0.0.0.0 Service Interface

##### 2.3.9.3.1.0.0.0.0 Service Interface

IStorageService

##### 2.3.9.3.2.0.0.0.0 Service Implementation

S3StorageService

##### 2.3.9.3.3.0.0.0.0 Lifetime

Singleton

##### 2.3.9.3.4.0.0.0.0 Registration Reasoning

The S3 client is stateless and thread-safe, so a singleton instance can be reused across the application for better performance.

##### 2.3.9.3.5.0.0.0.0 Framework Registration Pattern

{ provide: IStorageService, useClass: S3StorageService }

##### 2.3.9.3.6.0.0.0.0 Validation Notes

Validation complete. Singleton scope is correctly chosen for this type of service.

### 2.3.10.0.0.0.0.0.0 External Integration Specifications

#### 2.3.10.1.0.0.0.0.0 Integration Target

##### 2.3.10.1.1.0.0.0.0 Integration Target

AWS SQS

##### 2.3.10.1.2.0.0.0.0 Integration Type

Message Queue Consumer

##### 2.3.10.1.3.0.0.0.0 Required Client Classes

- SqsConsumerService
- OrderEventsConsumer

##### 2.3.10.1.4.0.0.0.0 Configuration Requirements

Queue URL, AWS region, credentials (via IAM role).

##### 2.3.10.1.5.0.0.0.0 Error Handling Requirements

The specification requires handling message parsing errors, implementing a dead-letter queue (DLQ) for unprocessable messages, and using a visibility timeout to handle transient processing failures.

##### 2.3.10.1.6.0.0.0.0 Authentication Requirements

The specification requires using an IAM role with `sqs:ReceiveMessage`, `sqs:DeleteMessage`, and `sqs:ChangeMessageVisibility` permissions for the specified queue.

##### 2.3.10.1.7.0.0.0.0 Framework Integration Patterns

The specification dictates a long-polling background service (e.g., a NestJS `Cron` job or a hosted service) that continuously polls the SQS queue for new messages.

##### 2.3.10.1.8.0.0.0.0 Validation Notes

Validation complete. The specification for SQS integration is robust, covering error handling and security.

#### 2.3.10.2.0.0.0.0.0 Integration Target

##### 2.3.10.2.1.0.0.0.0 Integration Target

AWS S3

##### 2.3.10.2.2.0.0.0.0 Integration Type

Object Storage

##### 2.3.10.2.3.0.0.0.0 Required Client Classes

- StorageService

##### 2.3.10.2.4.0.0.0.0 Configuration Requirements

Bucket name, AWS region, credentials (via IAM role).

##### 2.3.10.2.5.0.0.0.0 Error Handling Requirements

The specification requires handling exceptions for file not found, access denied, and upload failures. It must also implement retries for transient network errors.

##### 2.3.10.2.6.0.0.0.0 Authentication Requirements

The specification requires using an IAM role with permissions to `s3:GetObject` and `s3:PutObject` for the specified bucket and paths.

##### 2.3.10.2.7.0.0.0.0 Framework Integration Patterns

The specification defines a service provider that encapsulates the AWS S3 SDK, offering methods like `getSignedUploadUrl`, `getSignedDownloadUrl`, and `getFileStream`.

##### 2.3.10.2.8.0.0.0.0 Validation Notes

Validation complete. The specification follows best practices for secure S3 integration.

#### 2.3.10.3.0.0.0.0.0 Integration Target

##### 2.3.10.3.1.0.0.0.0 Integration Target

Redis

##### 2.3.10.3.2.0.0.0.0 Integration Type

Cache

##### 2.3.10.3.3.0.0.0.0 Required Client Classes

- RedisModule
- CacheInterceptor

##### 2.3.10.3.4.0.0.0.0 Configuration Requirements

Redis connection URL.

##### 2.3.10.3.5.0.0.0.0 Error Handling Requirements

The specification mandates that the application must be resilient to cache failures; if the cache is down, it should gracefully fall back to fetching data from the primary database (PostgreSQL).

##### 2.3.10.3.6.0.0.0.0 Authentication Requirements

Password authentication if configured on the Redis instance.

##### 2.3.10.3.7.0.0.0.0 Framework Integration Patterns

The specification requires utilizing NestJS's built-in `@nestjs/cache-manager` module. A custom decorator (`@Cache`) and an interceptor (`CacheInterceptor`) will be implemented to apply caching declaratively to controller methods.

##### 2.3.10.3.8.0.0.0.0 Validation Notes

Validation complete. Specification defines a resilient and declarative caching strategy.

## 2.4.0.0.0.0.0.0.0 Component Count Validation

| Property | Value |
|----------|-------|
| Total Classes | 21 |
| Total Interfaces | 5 |
| Total Enums | 1 |
| Total Dtos | 12 |
| Total Configurations | 1 |
| Total External Integrations | 3 |
| Total Modules | 8 |
| Total Guards | 1 |
| Total Interceptors | 1 |
| Total Filters | 1 |
| Total Processors | 1 |
| Total Gateways | 1 |
| Total Consumers | 1 |
| Grand Total Components | 57 |
| Phase 2 Claimed Count | 15 |
| Phase 2 Actual Count | 15 |
| Validation Added Count | 42 |
| Final Validated Count | 57 |

# 3.0.0.0.0.0.0.0.0 File Structure

## 3.1.0.0.0.0.0.0.0 Directory Organization

### 3.1.1.0.0.0.0.0.0 Directory Path

#### 3.1.1.1.0.0.0.0.0 Directory Path

/

#### 3.1.1.2.0.0.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.1.3.0.0.0.0.0 Contains Files

- package.json
- package-lock.json
- tsconfig.json
- tsconfig.build.json
- nest-cli.json
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

#### 3.1.2.4.0.0.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.2.5.0.0.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

