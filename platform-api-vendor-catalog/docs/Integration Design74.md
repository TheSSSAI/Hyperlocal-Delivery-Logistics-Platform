# 1 Integration Specifications

## 1.1 Extraction Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-api-vendor-catalog |
| Extraction Timestamp | 2024-05-24T10:00:00Z |
| Mapping Validation Score | 100% |
| Context Completeness Score | 100% |
| Implementation Readiness Level | High |

## 1.2 Relevant Requirements

### 1.2.1 Requirement Id

#### 1.2.1.1 Requirement Id

REQ-1-006

#### 1.2.1.2 Requirement Text

The system shall provide a self-contained inventory management module within the vendor-facing dashboard, allowing vendors to manage their product catalog and stock levels directly on the platform.

#### 1.2.1.3 Validation Criteria

- Verify that the vendor dashboard includes features to add, edit, and delete products.
- Verify that vendors can update stock quantities for their products.

#### 1.2.1.4 Implementation Implications

- The service must expose secure CRUD API endpoints for products, including a method to update stock quantity.
- The database schema must include a products table with a stock_quantity column.

#### 1.2.1.5 Extraction Reasoning

This is a core functional requirement directly assigned to this repository's scope of managing the product catalog and inventory.

### 1.2.2.0 Requirement Id

#### 1.2.2.1 Requirement Id

REQ-1-068

#### 1.2.2.2 Requirement Text

The vendor dashboard shall include a catalog management module. This module must allow vendors to perform CRUD (Create, Read, Update, Delete) operations on their product categories and individual products. The product creation/editing form must include fields for product name, description, price, an image upload, and a numerical stock quantity.

#### 1.2.2.3 Validation Criteria

- As a vendor, successfully create a new product category.
- Successfully add a new product with all required fields (name, price, stock, etc.) to that category.
- Successfully edit the details of an existing product.
- Successfully delete a product.

#### 1.2.2.4 Implementation Implications

- The service must provide distinct CRUD API endpoints for both Product and ProductCategory entities.
- The Product entity management logic must handle all specified fields, including image uploads, which requires integration with an object storage service like S3.

#### 1.2.2.5 Extraction Reasoning

This requirement elaborates on REQ-1-006, defining the full scope of catalog management that this repository must implement.

### 1.2.3.0 Requirement Id

#### 1.2.3.1 Requirement Id

REQ-1-025

#### 1.2.3.2 Requirement Text

The system shall provide fields in the vendor profile for storing mandatory license information, including the license number and expiry date, for vendors in regulated categories (e.g., food, pharmaceuticals). All create, update, or delete operations on this license information must be recorded in an audit log.

#### 1.2.3.3 Validation Criteria

- In the vendor dashboard, verify the presence of fields for license number and expiry date.
- Enter and save license information for a vendor.
- Check the audit log to confirm that the creation of the license record was logged.

#### 1.2.3.4 Implementation Implications

- The database schema must include a VendorLicense table with a one-to-many relationship to VendorProfile.
- The service must expose CRUD endpoints for license information.
- The service must publish an event or call an audit service API upon any modification of license data.

#### 1.2.3.5 Extraction Reasoning

This requirement falls under the repository's responsibility for managing 'vendor profiles' and their associated compliance data.

### 1.2.4.0 Requirement Id

#### 1.2.4.1 Requirement Id

REQ-1-050

#### 1.2.4.2 Requirement Text

The system shall display a stock status indicator on each product listing. The status must be one of 'Available', 'Limited Stock', or 'Out of Stock'. The system must prevent customers from adding any item marked as 'Out of Stock' to their shopping cart.

#### 1.2.4.3 Validation Criteria

- View a product with zero stock and verify its status is 'Out of Stock'.
- Attempt to add an 'Out of Stock' item to the cart and verify the action is blocked.

#### 1.2.4.4 Implementation Implications

- The service's API for fetching products must return a calculated stock_status field based on stock_quantity and a configurable threshold.
- This service is the source of truth for inventory checks that other services (like Order Management) will perform.

#### 1.2.4.5 Extraction Reasoning

This repository manages inventory data, making it the source of truth for deriving and exposing the product stock status to consumer applications.

### 1.2.5.0 Requirement Id

#### 1.2.5.1 Requirement Id

REQ-1-069

#### 1.2.5.2 Requirement Text

The catalog management module shall support bulk operations for products via a CSV file. Vendors must be able to export their entire catalog to a CSV file. They must also be able to import a CSV file to add or update products. The import process must validate the CSV for required columns and correct data types (e.g., price must be a number). If any rows fail validation, the system must generate and provide a downloadable error report detailing the failed rows and the reason for failure.

#### 1.2.5.3 Validation Criteria

- As a vendor, export the current product catalog and verify a valid CSV file is downloaded.
- Upload a CSV with invalid data, verify valid products are created/updated, and confirm a downloadable error report is generated.

#### 1.2.5.4 Implementation Implications

- Requires an API endpoint to initiate the upload (e.g., providing a pre-signed S3 URL).
- Requires an asynchronous worker (e.g., Lambda or EKS pod) to process the CSV file, perform validation, and execute bulk database operations.
- Requires logic to generate and store a corresponding error report CSV in S3.

#### 1.2.5.5 Extraction Reasoning

This requirement details a core feature of the catalog management functionality owned by this repository.

### 1.2.6.0 Requirement Id

#### 1.2.6.1 Requirement Id

REQ-1-070

#### 1.2.6.2 Requirement Text

The system shall allow vendors to manage their store's availability. Vendors must be able to define their opening and closing times for each day of the week. The system shall prevent customers from placing orders from a store outside its set business hours. Additionally, the vendor dashboard must feature a master toggle switch that allows the vendor to immediately set their store status to 'Offline' or 'Online', overriding the scheduled hours.

#### 1.2.6.3 Validation Criteria

- Set a vendor's closing time to 5 PM. At 5:01 PM, attempt to place an order as a customer and verify it is blocked.
- During business hours, use the master switch to take the store 'Offline'.
- Verify that customers can no longer place orders from that store.

#### 1.2.6.4 Implementation Implications

- The database schema must support storing business hours (VendorBusinessHour) and a master availability flag (isOnline on VendorProfile).
- The service must expose an API to manage these settings.
- The service must expose a calculated, real-time availability status for consumption by other services like Search and Order Management.

#### 1.2.6.5 Extraction Reasoning

This requirement is a key part of vendor profile management, which is a primary responsibility of this repository.

## 1.3.0.0 Relevant Components

- {'component_name': 'Vendor & Catalog Service', 'component_specification': 'Manages all data related to vendors and their offerings. Its responsibilities include vendor profiles, business hours, license details, the product catalog (products and categories), and real-time inventory management. It serves as the single source of truth for all product and vendor information for the entire platform.', 'implementation_requirements': ["Implement CRUD APIs for VendorProfile, VendorLicense, ProductCategory, and Product entities based on the 'Vendor & Catalog Service ER Diagram'.", 'Provide a transactional API for updating product inventory that handles race conditions.', 'Implement an asynchronous worker for processing bulk CSV catalog imports.', "Expose a calculated 'availability' status for vendors based on their master toggle and daily business hours.", 'Implement caching (Redis) for frequently accessed vendor and product data to improve read performance.'], 'architectural_context': "This component is a core microservice within the 'Application Services' layer, representing the 'Vendor & Catalog' bounded context from Domain-Driven Design.", 'extraction_reasoning': 'The repository platform-api-vendor-catalog is the direct implementation of this component, as stated in the repository definition and components_map.'}

## 1.4.0.0 Architectural Layers

- {'layer_name': 'Application Services', 'layer_responsibilities': 'This layer contains the core business logic of the platform, composed of independently deployable services organized around business capabilities (Bounded Contexts) as per DDD principles. Services in this layer own their data and expose APIs for consumption by the API Gateway or other services.', 'layer_constraints': ['Services must communicate asynchronously via the Messaging Layer where possible.', 'Services must enforce business rules and data validation.', 'Services are responsible for integrating with third-party services relevant to their domain.'], 'implementation_patterns': ['Microservices', 'Domain-Driven Design (DDD)', 'Event-Driven Architecture'], 'extraction_reasoning': "The repository platform-api-vendor-catalog is explicitly mapped to the 'application-services' layer and fully aligns with its responsibilities and constraints."}

## 1.5.0.0 Dependency Interfaces

### 1.5.1.0 Interface Name

#### 1.5.1.1 Interface Name

IOrderEventsConsumer

#### 1.5.1.2 Source Repository

platform-api-orders

#### 1.5.1.3 Method Contracts

- {'method_name': 'handleOrderCancelledEvent', 'method_signature': 'handleEvent(payload: { orderId: string, items: [{ productId: string, quantity: number }] })', 'method_purpose': "To consume the 'OrderCancelledEvent' and revert the stock levels for the products contained within the cancelled order.", 'integration_context': 'This event is consumed asynchronously from an SQS queue whenever an order is cancelled. It serves as a compensating action to restore inventory that was previously reserved or considered sold.'}

#### 1.5.1.4 Integration Pattern

Event-Driven (Choreography)

#### 1.5.1.5 Communication Protocol

Asynchronous messaging via AWS SNS/SQS. The service will have a dedicated SQS queue subscribed to the 'order-events' SNS topic.

#### 1.5.1.6 Extraction Reasoning

The repository definition explicitly states it listens for 'order.cancelled' to revert stock. This is a critical dependency for maintaining inventory consistency.

### 1.5.2.0 Interface Name

#### 1.5.2.1 Interface Name

ISharedContracts

#### 1.5.2.2 Source Repository

platform-lib-contracts

#### 1.5.2.3 Method Contracts

*No items available*

#### 1.5.2.4 Integration Pattern

Library Import

#### 1.5.2.5 Communication Protocol

N/A (Compile-time dependency)

#### 1.5.2.6 Extraction Reasoning

As a microservice in the ecosystem, this repository must depend on the shared contracts library to ensure type safety and consistent data structures for all its DTOs and event payloads, aligning with the project's architectural principles.

### 1.5.3.0 Interface Name

#### 1.5.3.1 Interface Name

IObservability

#### 1.5.3.2 Source Repository

platform-lib-observability

#### 1.5.3.3 Method Contracts

*No items available*

#### 1.5.3.4 Integration Pattern

Library Import

#### 1.5.3.5 Communication Protocol

N/A (Compile-time dependency)

#### 1.5.3.6 Extraction Reasoning

To comply with system-wide observability standards (REQ-1-108, REQ-1-110), this repository must integrate the shared observability library for structured logging, metrics, and distributed tracing.

## 1.6.0.0 Exposed Interfaces

### 1.6.1.0 Interface Name

#### 1.6.1.1 Interface Name

IVendorManagementAPI

#### 1.6.1.2 Consumer Repositories

- platform-web-vendor
- platform-web-admin

#### 1.6.1.3 Method Contracts

##### 1.6.1.3.1 Method Name

###### 1.6.1.3.1.1 Method Name

updateVendorProfile

###### 1.6.1.3.1.2 Method Signature

PATCH /api/v1/vendors/{vendorId}

###### 1.6.1.3.1.3 Method Purpose

Allows an authenticated vendor to update their store profile, business hours, and availability status.

###### 1.6.1.3.1.4 Implementation Requirements

The endpoint must perform an ownership check to ensure the JWT's user ID corresponds to the vendor being updated. Must invalidate relevant caches on success.

##### 1.6.1.3.2.0 Method Name

###### 1.6.1.3.2.1 Method Name

manageVendorLicenses

###### 1.6.1.3.2.2 Method Signature

POST, PUT, DELETE /api/v1/vendors/{vendorId}/licenses

###### 1.6.1.3.2.3 Method Purpose

Provides full CRUD for managing a vendor's compliance licenses as per REQ-1-025.

###### 1.6.1.3.2.4 Implementation Requirements

All operations must be audited. Must perform ownership checks.

##### 1.6.1.3.3.0 Method Name

###### 1.6.1.3.3.1 Method Name

manageProductCatalog

###### 1.6.1.3.3.2 Method Signature

POST, PUT, DELETE /api/v1/vendors/{vendorId}/products/{productId}

###### 1.6.1.3.3.3 Method Purpose

Provides full CRUD for managing products in a vendor's catalog as per REQ-1-068.

###### 1.6.1.3.3.4 Implementation Requirements

Must perform ownership checks. Must publish 'ProductUpdated' events to the message bus for consumption by services like Search.

##### 1.6.1.3.4.0 Method Name

###### 1.6.1.3.4.1 Method Name

initiateBulkImport

###### 1.6.1.3.4.2 Method Signature

POST /api/v1/vendors/{vendorId}/catalog/import

###### 1.6.1.3.4.3 Method Purpose

Generates a pre-signed S3 URL for the vendor dashboard to upload a CSV file for bulk import, as per REQ-1-069.

###### 1.6.1.3.4.4 Implementation Requirements

Returns a URL and a job ID for tracking the asynchronous import process.

#### 1.6.1.4.0.0 Service Level Requirements

- P95 latency for all CRUD operations must be < 200ms.
- The service must maintain 99.9% uptime.

#### 1.6.1.5.0.0 Implementation Constraints

- The service is the single source of truth for all vendor profile and product catalog data.

#### 1.6.1.6.0.0 Extraction Reasoning

This interface exposes all the necessary CRUD and management functionalities required by the vendor and admin dashboards to fulfill their respective user stories and requirements.

### 1.6.2.0.0.0 Interface Name

#### 1.6.2.1.0.0 Interface Name

ICustomerFacingAPI

#### 1.6.2.2.0.0 Consumer Repositories

- platform-mobile-customer

#### 1.6.2.3.0.0 Method Contracts

##### 1.6.2.3.1.0 Method Name

###### 1.6.2.3.1.1 Method Name

getVendorDetails

###### 1.6.2.3.1.2 Method Signature

GET /api/v1/vendors/{vendorId}

###### 1.6.2.3.1.3 Method Purpose

Fetches the public profile of a vendor, including store name, address, rating, and product catalog for display in the customer app.

###### 1.6.2.3.1.4 Implementation Requirements

This endpoint must be highly performant and heavily cached (using Redis) to support high read traffic. It should not expose any sensitive vendor PII.

##### 1.6.2.3.2.0 Method Name

###### 1.6.2.3.2.1 Method Name

getVendorAvailability

###### 1.6.2.3.2.2 Method Signature

GET /api/v1/vendors/{vendorId}/availability

###### 1.6.2.3.2.3 Method Purpose

Provides the real-time orderability status of a vendor, calculated from their master toggle and business hours, for consumption by client apps.

###### 1.6.2.3.2.4 Implementation Requirements

This endpoint must have very low latency as it will be called frequently during product discovery and checkout.

#### 1.6.2.4.0.0 Service Level Requirements

- P95 latency for `getVendorDetails` must be < 200ms.

#### 1.6.2.5.0.0 Implementation Constraints

*No items available*

#### 1.6.2.6.0.0 Extraction Reasoning

This interface provides the read-only, public data required by the customer-facing mobile application for product and vendor discovery. The data is optimized and cached for high-volume read access.

### 1.6.3.0.0.0 Interface Name

#### 1.6.3.1.0.0 Interface Name

IInternalInventoryAPI

#### 1.6.3.2.0.0 Consumer Repositories

- platform-api-orders

#### 1.6.3.3.0.0 Method Contracts

- {'method_name': 'checkAndReserveStock', 'method_signature': 'POST /internal/inventory/reserve', 'method_purpose': 'Performs a final, transactional check on item availability and reserves stock for an order before payment is initiated, fulfilling REQ-1-055.', 'implementation_requirements': 'This is a critical, synchronous endpoint. The implementation MUST use transactional database locking (e.g., SELECT ... FOR UPDATE) to prevent race conditions and overselling. It must be idempotent.'}

#### 1.6.3.4.0.0 Service Level Requirements

- P95 latency must be < 100ms due to its blocking nature in the checkout flow.
- Must be highly available (>= 99.95%) as it is a single point of failure for order placement.

#### 1.6.3.5.0.0 Implementation Constraints

- This internal API is not exposed via the public API Gateway and is only accessible through the service mesh.

#### 1.6.3.6.0.0 Extraction Reasoning

This specialized, high-performance internal interface is required to fulfill the critical synchronous dependency of the Order Management service for real-time inventory checks, as identified in the repository's dependency analysis.

## 1.7.0.0.0.0 Technology Context

### 1.7.1.0.0.0 Framework Requirements

The service must be implemented using NestJS on Node.js v18.18+ with TypeScript. It will connect to a PostgreSQL v15.4+ database for persistence and Redis for caching.

### 1.7.2.0.0.0 Integration Technologies

- NestJS standard dependency injection for internal modules.
- AWS SQS for consuming asynchronous events like OrderCancelledEvent.
- AWS S3 for storing uploaded files (product images, CSVs) via pre-signed URLs.
- csv-parse library for handling bulk catalog imports.

### 1.7.3.0.0.0 Performance Constraints

Implement caching with Redis for vendor profiles and product catalogs to meet low-latency read requirements. Utilize database read replicas as specified in REQ-1-100 to scale read-heavy traffic from customer browsing.

### 1.7.4.0.0.0 Security Requirements

API endpoints must enforce that an authenticated vendor can only perform CRUD operations on their own profile, categories, and products. This authorization check is critical for all write operations.

## 1.8.0.0.0.0 Extraction Validation

| Property | Value |
|----------|-------|
| Mapping Completeness Check | All requirements listed in the repository's requir... |
| Cross Reference Validation | The repository's responsibilities align perfectly ... |
| Implementation Readiness Assessment | The context is sufficient for implementation. Key ... |
| Quality Assurance Confirmation | The analysis is complete and has been systematical... |

