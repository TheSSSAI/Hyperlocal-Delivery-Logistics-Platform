# 1 Id

REPO-BE-CATLG

# 2 Name

platform-api-vendor-catalog

# 3 Description

This microservice repository manages all data related to vendors and their offerings. Its responsibilities include vendor profiles, business hours, license details, the product catalog (products and categories), and real-time inventory management. It provides the core data needed for the customer's product discovery experience and is a critical component for vendors to manage their store. This service is designed for a high-read, moderate-write workload. Its dependencies are updated to use the new granular shared libraries.

# 4 Type

🔹 Application Services

# 5 Namespace

Platform.Services.VendorCatalog

# 6 Output Path

services/vendor-catalog

# 7 Framework

NestJS

# 8 Language

TypeScript

# 9 Technology

NestJS, PostgreSQL, Redis

# 10 Thirdparty Libraries

- csv-parse

# 11 Layer Ids

- application-services

# 12 Dependencies

- REPO-LIB-CONTRACTS
- REPO-LIB-OBSERVABILITY

# 13 Requirements

## 13.1 Requirement Id

### 13.1.1 Requirement Id

REQ-1-006

## 13.2.0 Requirement Id

### 13.2.1 Requirement Id

REQ-1-068

# 14.0.0 Generate Tests

✅ Yes

# 15.0.0 Generate Documentation

✅ Yes

# 16.0.0 Architecture Style

Microservices

# 17.0.0 Architecture Map

- application-services

# 18.0.0 Components Map

- Vendor & Catalog Service (Manages Vendor Profiles, Products, Categories, Inventory)

# 19.0.0 Requirements Map

- REQ-1-006
- REQ-1-068
- REQ-1-025
- REQ-1-050
- REQ-1-069
- REQ-1-070

# 20.0.0 Decomposition Rationale

## 20.1.0 Operation Type

UNCHANGED

## 20.2.0 Source Repository

self

## 20.3.0 Decomposition Reasoning

This repository represents the well-defined 'Vendor & Catalog' bounded context from DDD. Separating vendor and product data from transactional order data allows for independent scaling and data modeling. For example, this service's database can be optimized for read-heavy product browsing using read replicas and caching, a different pattern from the write-heavy order service.

## 20.4.0 Extracted Responsibilities

*No items available*

## 20.5.0 Reusability Scope

- Serves as the single source of truth for all product and vendor information.

## 20.6.0 Development Benefits

- Clear ownership of the vendor and product domain for a dedicated team.
- Can be scaled independently to handle high traffic from browsing customers.

# 21.0.0 Dependency Contracts

## 21.1.0 Repo-Be-Order

### 21.1.1 Required Interfaces

- {'interface': 'OrderCancelledEvent', 'methods': [], 'events': ["Listens for 'order.cancelled' to revert stock levels."], 'properties': []}

### 21.1.2 Integration Pattern

Event-driven via SNS/SQS.

### 21.1.3 Communication Protocol

Async Messaging

# 22.0.0 Exposed Contracts

## 22.1.0 Public Interfaces

- {'interface': 'ICatalogService', 'methods': ['getProductsByVendor(vendorId: string): Promise<ProductDTO[]>', 'updateInventory(updates: InventoryUpdateDTO[]): Promise<void>'], 'events': ["Publishes 'InventoryUpdated' event."], 'properties': [], 'consumers': ['REPO-API-GATEWAY', 'REPO-BE-ORDER']}

# 23.0.0 Integration Patterns

| Property | Value |
|----------|-------|
| Dependency Injection | Standard NestJS DI. |
| Event Communication | Consumes events like 'OrderCancelled' to manage in... |
| Data Flow | Serves product data via API. Manages inventory wri... |
| Error Handling | Handles optimistic locking or race conditions duri... |
| Async Patterns | Uses a background job for bulk CSV catalog imports... |

# 24.0.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | Standard RESTful API implementation. |
| Performance Considerations | Implement caching (e.g., Redis) for frequently acc... |
| Security Considerations | Ensure a vendor can only manage their own catalog ... |
| Testing Approach | Integration tests for inventory update logic and C... |

# 25.0.0 Scope Boundaries

## 25.1.0 Must Implement

- CRUD for Vendor Profiles, Products, Categories.
- Real-time inventory management.
- Vendor business hours and availability logic.
- Bulk CSV import/export of catalog.

## 25.2.0 Must Not Implement

- Order processing or payment logic.

## 25.3.0 Extension Points

- Support for product variations and options.
- Integration with vendor's external POS/ERP systems (explicitly out of scope for V1 per REQ-1-005).

## 25.4.0 Validation Rules

- Validate product data (e.g., price > 0).

