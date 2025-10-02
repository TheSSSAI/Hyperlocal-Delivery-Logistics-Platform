# 1 Id

REPO-FE-VEND

# 2 Name

platform-web-vendor

# 3 Description

This repository contains the React.js source code for the vendor-facing web dashboard. It is the primary interface for vendors to manage their entire presence on the platform, including their store profile, business hours, product catalog, and inventory levels. A key function is the real-time management of incoming orders, allowing vendors to accept or reject them. This dashboard is designed for desktop and tablet use, focusing on efficient data entry and management workflows, such as bulk product uploads. Its dependencies have been updated to use the new shared UI and API client libraries.

# 4 Type

🔹 Application Services

# 5 Namespace

Platform.Web.Vendor

# 6 Output Path

apps/web-vendor

# 7 Framework

React.js

# 8 Language

TypeScript

# 9 Technology

React.js, Vite, TanStack Query

# 10 Thirdparty Libraries

- react-data-grid
- axios

# 11 Layer Ids

- presentation

# 12 Dependencies

- REPO-UI-COMPONENTS
- REPO-API-CLIENT

# 13 Requirements

## 13.1 Requirement Id

### 13.1.1 Requirement Id

REQ-1-002

## 13.2.0 Requirement Id

### 13.2.1 Requirement Id

REQ-1-010

# 14.0.0 Generate Tests

✅ Yes

# 15.0.0 Generate Documentation

✅ Yes

# 16.0.0 Architecture Style

Microservices

# 17.0.0 Architecture Map

- presentation

# 18.0.0 Components Map

- Vendor Web Dashboard (React.js)

# 19.0.0 Requirements Map

- REQ-1-002
- REQ-1-010
- REQ-1-006
- REQ-1-065
- REQ-1-068
- REQ-1-070

# 20.0.0 Decomposition Rationale

## 20.1.0 Operation Type

UNCHANGED

## 20.2.0 Source Repository

self

## 20.3.0 Decomposition Reasoning

The repository's purpose as a standalone vendor dashboard is preserved. By abstracting common components and API logic into shared libraries, the vendor dashboard codebase becomes more focused on the complex business logic of catalog, inventory, and order management, making it easier to maintain and extend.

## 20.4.0 Extracted Responsibilities

- Shared UI components are now consumed from REPO-UI-COMPONENTS.
- API data fetching logic is now handled by REPO-API-CLIENT.

## 20.5.0 Reusability Scope

- N/A - This is a top-level application.

## 20.6.0 Development Benefits

- Allows the team to focus on building efficient and powerful data management tools for vendors.
- Faster and more consistent UI development.

# 21.0.0 Dependency Contracts

## 21.1.0 Repo-Api-Client

### 21.1.1 Required Interfaces

- {'interface': 'IApiClient', 'methods': ['getProducts()', 'updateProduct(product: ProductDTO)', 'getIncomingOrders()'], 'events': [], 'properties': []}

### 21.1.2 Integration Pattern

Library consumption (NPM package).

### 21.1.3 Communication Protocol

N/A

# 22.0.0 Exposed Contracts

## 22.1.0 Public Interfaces

*No items available*

# 23.0.0 Integration Patterns

| Property | Value |
|----------|-------|
| Dependency Injection | N/A |
| Event Communication | Uses WebSockets or polling to receive new order no... |
| Data Flow | Data-grid and form-heavy application. Utilizes a c... |
| Error Handling | Provides granular, field-level error feedback on f... |
| Async Patterns | Manages asynchronous state for data fetching, cach... |

# 24.0.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | Use a robust library for data tables and forms to ... |
| Performance Considerations | Optimize rendering of large lists of products and ... |
| Security Considerations | Role-based access control should be enforced on th... |
| Testing Approach | Integration tests for complex user workflows like ... |

# 25.0.0 Scope Boundaries

## 25.1.0 Must Implement

- Vendor onboarding and profile management.
- CRUD for products and categories.
- Inventory and stock level management.
- Incoming order management (accept/reject).
- Financial reporting.

## 25.2.0 Must Not Implement

- Any customer, rider, or admin-specific functionality.

## 25.3.0 Extension Points

- Advanced analytics and sales dashboards.
- Promotions and discount management.

## 25.4.0 Validation Rules

- Comprehensive client-side validation for all product and profile forms.

