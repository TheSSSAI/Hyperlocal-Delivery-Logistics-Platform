# 1 Integration Specifications

## 1.1 Extraction Metadata

| Property | Value |
|----------|-------|
| Repository Id | REPO-FE-VEND |
| Extraction Timestamp | 2024-05-24T10:00:00Z |
| Mapping Validation Score | 100% |
| Context Completeness Score | 98% |
| Implementation Readiness Level | High |

## 1.2 Relevant Requirements

### 1.2.1 Requirement Id

#### 1.2.1.1 Requirement Id

REQ-1-002

#### 1.2.1.2 Requirement Text

The system shall provide four distinct client applications: a mobile application for Customers, a web-based dashboard for Vendors, a mobile application for Riders, and a web-based dashboard for platform Administrators.

#### 1.2.1.3 Validation Criteria

- Confirm the existence and accessibility of a vendor web dashboard.

#### 1.2.1.4 Implementation Implications

- This repository is the sole implementation of the vendor-facing web application.
- The application must be built as a Single Page Application (SPA) using the specified React.js framework.
- Must be designed for desktop and tablet screen sizes primarily.

#### 1.2.1.5 Extraction Reasoning

This is the foundational requirement that mandates the existence and purpose of this repository as the vendor web dashboard.

### 1.2.2.0 Requirement Id

#### 1.2.2.1 Requirement Id

REQ-1-010

#### 1.2.2.2 Requirement Text

The system shall implement a 'Vendor' user role with the following permissions: Create, Read, and Update their own store profile, product catalog, and inventory levels; Read and Update access to the status of orders assigned to their store; and Read-only access to ratings and reviews submitted for their store.

#### 1.2.2.3 Validation Criteria

- Log in as a Vendor and verify the ability to edit store details and manage products/inventory.
- Verify that a Vendor can view incoming orders and update their status (e.g., accept, reject, preparing).
- Verify that a Vendor can view ratings and reviews left by customers.

#### 1.2.2.4 Implementation Implications

- The application must implement dedicated UI sections (routes) for store profile management, catalog/inventory management, order management, and viewing reviews.
- Requires API client methods for CRUD operations on products, categories, and store profiles, as well as fetching and updating order statuses.
- UI must be role-aware, ensuring a vendor cannot access data belonging to other vendors.

#### 1.2.2.5 Extraction Reasoning

This requirement defines the core functional scope of the vendor dashboard, dictating the primary features that must be implemented in this repository.

### 1.2.3.0 Requirement Id

#### 1.2.3.1 Requirement Id

REQ-1-068

#### 1.2.3.2 Requirement Text

The vendor dashboard shall include a catalog management module. This module must allow vendors to perform CRUD (Create, Read, Update, Delete) operations on their product categories and individual products. The product creation/editing form must include fields for product name, description, price, an image upload, and a numerical stock quantity.

#### 1.2.3.3 Validation Criteria

- As a vendor, successfully create a new product category.
- Successfully add a new product with all required fields (name, price, stock, etc.) to that category.
- Successfully edit the details of an existing product.
- Successfully delete a product.

#### 1.2.3.4 Implementation Implications

- A data-centric UI is required, likely utilizing components from REPO-UI-COMPONENTS for displaying the product catalog.
- Implementation of forms is necessary for creating and editing products and categories.
- Requires API client methods for full CRUD on products and categories.

#### 1.2.3.5 Extraction Reasoning

This requirement provides specific details for the product catalog management feature, a key responsibility of this repository.

### 1.2.4.0 Requirement Id

#### 1.2.4.1 Requirement Id

REQ-1-065

#### 1.2.4.2 Requirement Text

The vendor dashboard shall display new incoming orders in a dedicated section. Each order must show key details like the list of items, customer information (name, address), and any special instructions. The interface must provide clear 'Accept' and 'Reject' buttons. A configurable timer (defaulting to 5 minutes) shall be displayed, indicating the time remaining for the vendor to take action.

#### 1.2.4.3 Validation Criteria

- Place a new order.
- Log in as the vendor and verify the new order appears on the dashboard with all required details and Accept/Reject buttons.
- Verify a countdown timer is visible and starts from 5 minutes.

#### 1.2.4.4 Implementation Implications

- The application must establish a real-time communication channel (WebSocket) to receive new order notifications without polling.
- A dedicated UI component is needed to display incoming orders, incorporating a visual countdown timer.
- State management must handle the list of active orders and their timers.

#### 1.2.4.5 Extraction Reasoning

This requirement defines the critical real-time order management workflow, a primary function of the vendor dashboard that dictates specific UI and communication patterns.

## 1.3.0.0 Relevant Components

- {'component_name': 'Vendor Web Dashboard', 'component_specification': 'This is the primary user-facing application for vendors. It is a Single Page Application (SPA) responsible for rendering all interfaces related to store management, product and catalog CRUD, inventory control, real-time order management, and viewing financial reports and customer feedback. It consumes data from backend services via the API Client library.', 'implementation_requirements': ['Must be built with React.js v18.2+ and Vite, as per REQ-1-111.', 'Must use the TanStack Query library for all server state management.', 'Must consume the shared UI component library (REPO-UI-COMPONENTS) for all visual elements.', 'Must integrate the shared API client library (REPO-API-CLIENT) for all communication with backend services.', 'Must implement a WebSocket client to connect to the real-time notification service for new orders.'], 'architectural_context': "This component constitutes the entirety of the vendor-facing 'Presentation Layer'. It interacts with backend services exclusively through the API Gateway.", 'extraction_reasoning': 'This is the top-level component that encapsulates the entire scope and purpose of the REPO-FE-VEND repository.'}

## 1.4.0.0 Architectural Layers

- {'layer_name': 'Presentation Layer', 'layer_responsibilities': "Provide the user interface for the 'Vendor' user role, render data received from the backend, manage client-side state and user interactions, and handle the vendor's authentication flow.", 'layer_constraints': ['Must be a web-based application optimized for desktop and tablet.', 'Must not contain any business logic that is not directly related to user interface presentation.', 'All backend communication must be routed through the shared API client library.'], 'implementation_patterns': ['Single Page Application (SPA)', 'Component-Based Architecture (React)', 'Client-Side State Management (TanStack Query)'], 'extraction_reasoning': "The REPO-FE-VEND repository is explicitly mapped to the 'Presentation Layer', and its entire codebase exists to fulfill the responsibilities of this architectural layer for the vendor user class."}

## 1.5.0.0 Dependency Interfaces

### 1.5.1.0 Interface Name

#### 1.5.1.1 Interface Name

IApiClient

#### 1.5.1.2 Source Repository

REPO-API-CLIENT

#### 1.5.1.3 Method Contracts

##### 1.5.1.3.1 Method Name

###### 1.5.1.3.1.1 Method Name

verifyOtp

###### 1.5.1.3.1.2 Method Signature

verifyOtp(payload: VerifyOtpDTO): Promise<AuthTokensDTO>

###### 1.5.1.3.1.3 Method Purpose

Authenticates the vendor and retrieves JWTs.

###### 1.5.1.3.1.4 Integration Context

Called from the login screen to complete the authentication flow.

##### 1.5.1.3.2.0 Method Name

###### 1.5.1.3.2.1 Method Name

updateStoreProfile

###### 1.5.1.3.2.2 Method Signature

updateStoreProfile(vendorId: string, payload: UpdateStoreProfileDTO): Promise<void>

###### 1.5.1.3.2.3 Method Purpose

Updates the vendor's core profile information, including business hours and availability.

###### 1.5.1.3.2.4 Integration Context

Called from the 'Store Settings' page when a vendor saves changes.

##### 1.5.1.3.3.0 Method Name

###### 1.5.1.3.3.1 Method Name

createProduct

###### 1.5.1.3.3.2 Method Signature

createProduct(payload: CreateProductDTO): Promise<ProductDTO>

###### 1.5.1.3.3.3 Method Purpose

Creates a new product in the vendor's catalog.

###### 1.5.1.3.3.4 Integration Context

Called from the 'Add Product' form.

##### 1.5.1.3.4.0 Method Name

###### 1.5.1.3.4.1 Method Name

acceptOrder

###### 1.5.1.3.4.2 Method Signature

acceptOrder(orderId: string, payload: AcceptOrderDTO): Promise<void>

###### 1.5.1.3.4.3 Method Purpose

Accepts an incoming order and provides the estimated preparation time.

###### 1.5.1.3.4.4 Integration Context

Called from the order management dashboard when a vendor accepts a new order.

##### 1.5.1.3.5.0 Method Name

###### 1.5.1.3.5.1 Method Name

getFinancialStatements

###### 1.5.1.3.5.2 Method Signature

getFinancialStatements(month: string, year: string): Promise<StatementDTO>

###### 1.5.1.3.5.3 Method Purpose

Fetches a vendor's financial statement for a given month.

###### 1.5.1.3.5.4 Integration Context

Called from the 'Financials' page to enable statement downloads.

#### 1.5.1.4.0.0 Integration Pattern

Library Consumption

#### 1.5.1.5.0.0 Communication Protocol

N/A (Library handles underlying HTTPS/REST communication)

#### 1.5.1.6.0.0 Extraction Reasoning

This is a mandatory dependency as defined in the repository mapping. It abstracts all backend API communication, providing typed methods for all required features like authentication, profile management, catalog CRUD, and order management.

### 1.5.2.0.0.0 Interface Name

#### 1.5.2.1.0.0 Interface Name

ISharedUIProvider

#### 1.5.2.2.0.0 Source Repository

REPO-UI-COMPONENTS

#### 1.5.2.3.0.0 Method Contracts

*No items available*

#### 1.5.2.4.0.0 Integration Pattern

Library Consumption

#### 1.5.2.5.0.0 Communication Protocol

N/A (Component library)

#### 1.5.2.6.0.0 Extraction Reasoning

This dependency is explicitly defined in the repository's decomposition rationale. It is crucial for maintaining design consistency and accelerating UI development by providing a set of pre-built, reusable components such as DataTable, ModalDialog, and Button, which are required by multiple vendor user stories.

### 1.5.3.0.0.0 Interface Name

#### 1.5.3.1.0.0 Interface Name

IRealtimeEvents

#### 1.5.3.2.0.0 Source Repository

platform-api-chat, platform-api-orders (via API Gateway)

#### 1.5.3.3.0.0 Method Contracts

##### 1.5.3.3.1.0 Method Name

###### 1.5.3.3.1.1 Method Name

on('new_order')

###### 1.5.3.3.1.2 Method Signature

on('new_order', (payload: OrderSummaryDTO) => void)

###### 1.5.3.3.1.3 Method Purpose

Receives a new incoming order in real-time.

###### 1.5.3.3.1.4 Integration Context

Used on the main order dashboard to display new orders without polling, as required by REQ-1-065 and VND-016.

##### 1.5.3.3.2.0 Method Name

###### 1.5.3.3.2.1 Method Name

on('order_cancelled')

###### 1.5.3.3.2.2 Method Signature

on('order_cancelled', (payload: { orderId: string }) => void)

###### 1.5.3.3.2.3 Method Purpose

Receives a notification that an order has been cancelled by the customer or system.

###### 1.5.3.3.2.4 Integration Context

Used to remove a pending order from the vendor's queue in real-time.

##### 1.5.3.3.3.0 Method Name

###### 1.5.3.3.3.1 Method Name

on('new_chat_message')

###### 1.5.3.3.3.2 Method Signature

on('new_chat_message', (payload: ChatMessageDTO) => void)

###### 1.5.3.3.3.3 Method Purpose

Receives a new chat message from a customer regarding an active order.

###### 1.5.3.3.3.4 Integration Context

Used in the chat component to display new messages in real-time, fulfilling VND-024.

##### 1.5.3.3.4.0 Method Name

###### 1.5.3.3.4.1 Method Name

emit('send_chat_message')

###### 1.5.3.3.4.2 Method Signature

emit('send_chat_message', payload: { orderId: string, message: string })

###### 1.5.3.3.4.3 Method Purpose

Sends a chat message from the vendor to the customer.

###### 1.5.3.3.4.4 Integration Context

Called from the chat component when the vendor sends a message.

#### 1.5.3.4.0.0 Integration Pattern

WebSocket Client

#### 1.5.3.5.0.0 Communication Protocol

WSS (Secure WebSocket)

#### 1.5.3.6.0.0 Extraction Reasoning

The application requires real-time capabilities for order management and chat, which cannot be handled efficiently by REST. This interface defines the contract for those asynchronous, server-pushed events as mandated by REQ-1-092.

### 1.5.4.0.0.0 Interface Name

#### 1.5.4.1.0.0 Interface Name

IPlatformDataContracts

#### 1.5.4.2.0.0 Source Repository

REPO-LIB-CONTRACTS

#### 1.5.4.3.0.0 Method Contracts

*No items available*

#### 1.5.4.4.0.0 Integration Pattern

Library Consumption

#### 1.5.4.5.0.0 Communication Protocol

N/A (Compile-time type definitions)

#### 1.5.4.6.0.0 Extraction Reasoning

This repository must consume the shared TypeScript types for all DTOs and event payloads to ensure end-to-end type safety between the frontend, the API client, and the backend services. This is a critical dependency for maintaining architectural integrity.

## 1.6.0.0.0.0 Exposed Interfaces

*No items available*

## 1.7.0.0.0.0 Technology Context

### 1.7.1.0.0.0 Framework Requirements

The application must be built using React.js (v18.2+) with Vite as the build tool. TypeScript is the required language. Global state and server-side data fetching must be managed by TanStack Query.

### 1.7.2.0.0.0 Integration Technologies

- axios (wrapped by REPO-API-CLIENT)
- socket.io-client (for WebSocket communication)
- AWS S3 (for direct file uploads using pre-signed URLs for bulk import)

### 1.7.3.0.0.0 Performance Constraints

Must optimize the rendering of large lists of products and orders. Implement client-side or server-side pagination for data grids where appropriate. Page load times (LCP) must be under 2.5 seconds as per REQ-1-093.

### 1.7.4.0.0.0 Security Requirements

All interactions must be authenticated via JWT, with tokens stored securely (e.g., in httpOnly cookies). The WebSocket connection must also be authenticated using the JWT. Client-side routing must be role-aware, hiding or disabling UI elements that the vendor is not permitted to access.

## 1.8.0.0.0.0 Extraction Validation

| Property | Value |
|----------|-------|
| Mapping Completeness Check | All repository mappings and requirements are valid... |
| Cross Reference Validation | All mappings are consistent with the cached contex... |
| Implementation Readiness Assessment | The repository is implementation-ready. The techno... |
| Quality Assurance Confirmation | The extracted context has been systematically anal... |

