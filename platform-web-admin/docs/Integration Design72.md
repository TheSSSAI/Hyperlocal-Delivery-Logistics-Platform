# 1 Integration Specifications

## 1.1 Extraction Metadata

| Property | Value |
|----------|-------|
| Repository Id | REPO-FE-ADMIN |
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

- Confirm the existence and accessibility of an administrator web dashboard.

#### 1.2.1.4 Implementation Implications

- This repository must produce a Single Page Application (SPA) that serves as the administrative interface for the entire platform.
- The application must be accessible via modern web browsers on desktop and tablet devices.

#### 1.2.1.5 Extraction Reasoning

This is the primary requirement that defines the existence and purpose of the REPO-FE-ADMIN repository itself.

### 1.2.2.0 Requirement Id

#### 1.2.2.1 Requirement Id

REQ-1-012

#### 1.2.2.2 Requirement Text

The system shall implement an 'Administrator' user role with full Create, Read, Update, and Delete (CRUD) permissions across all data entities within the system, including but not limited to user profiles, orders, vendor stores, and system configurations.

#### 1.2.2.3 Validation Criteria

- Log in as an Administrator and verify the ability to view, create, edit, and delete records for customers, vendors, and riders.
- Verify that an Administrator can view and modify any order in the system.

#### 1.2.2.4 Implementation Implications

- The dashboard must contain UI screens (lists, detail views, forms) for every major data entity in the system.
- It must implement robust state management to handle complex data from multiple API endpoints.
- The UI must conditionally render actions based on fine-grained permissions if they exist within the 'Administrator' role.

#### 1.2.2.5 Extraction Reasoning

This requirement dictates the core functional scope of the admin dashboard, defining its primary purpose as the central management tool for all platform data.

### 1.2.3.0 Requirement Id

#### 1.2.3.1 Requirement Id

REQ-1-080

#### 1.2.3.2 Requirement Text

The administrator dashboard shall provide comprehensive user and service area management. It must allow admins to view, search, and manage all user accounts, with functions to approve pending registrations, suspend, and deactivate accounts. The dashboard must also include a geofencing tool for admins to define operational zones by drawing polygons on a map.

#### 1.2.3.3 Validation Criteria

- As an admin, search for a user and successfully suspend their account.
- Use the map tool to draw and save a new operational zone.
- As a customer, attempt to place an order for delivery to an address outside of any defined zone and verify the action is blocked.

#### 1.2.3.4 Implementation Implications

- Requires implementation of a data-dense user management screen using components like DataTable, SearchBar, and Pagination.
- A specialized, complex component for map-based geofencing must be built, integrating with a mapping library like Mapbox.
- The UI must support workflows for approving/rejecting user registrations and suspending/deactivating accounts.

#### 1.2.3.5 Extraction Reasoning

This requirement specifies two major, complex features (user management and geofencing) that are central responsibilities of the admin dashboard.

### 1.2.4.0 Requirement Id

#### 1.2.4.1 Requirement Id

REQ-1-014

#### 1.2.4.2 Requirement Text

For critical delete operations initiated by an Administrator (e.g., deleting a user account, deleting a vendor store), the user interface shall enforce a two-step confirmation process. The user must first initiate the delete action and then explicitly confirm their choice in a subsequent modal or dialog box before the action is executed.

#### 1.2.4.3 Validation Criteria

- As an Administrator, attempt to delete a critical data entity.
- Verify that a confirmation dialog appears asking for a second confirmation.

#### 1.2.4.4 Implementation Implications

- A reusable 'ModalDialog' component with a 'critical-delete' variant must be implemented or consumed from the shared UI library.
- This modal should require a confirmation action, such as typing the name of the entity to be deleted, to enable the final delete button.

#### 1.2.4.5 Extraction Reasoning

This is a critical UI/UX and safety requirement that must be implemented within the admin dashboard's user interface to prevent accidental data loss.

### 1.2.5.0 Requirement Id

#### 1.2.5.1 Requirement Id

REQ-1-107

#### 1.2.5.2 Requirement Text

The system shall provide role-specific reporting capabilities. The admin dashboard must offer reports on sales, delivery metrics, vendor performance, and rider performance. All reports generated from the web dashboards must be exportable in both CSV and PDF formats.

#### 1.2.5.3 Validation Criteria

- As an admin, generate a sales report for the last month.
- Verify that reports can be successfully downloaded as a CSV file and as a PDF file.

#### 1.2.5.4 Implementation Implications

- The application must include a dedicated 'Reporting' section.
- Data visualization components (charts, graphs) are required, leveraging the specified D3.js library.
- Functionality to trigger server-side or client-side generation and download of CSV and PDF files must be implemented.

#### 1.2.5.5 Extraction Reasoning

This requirement defines the business intelligence and analytics capabilities that are a major feature set of the admin dashboard.

## 1.3.0.0 Relevant Components

- {'component_name': 'Administrator Web Dashboard (React.js)', 'component_specification': 'The sole component of this repository. It is a comprehensive, internal Single Page Application (SPA) that serves as the central control panel for the entire platform. It provides administrators with the UIs to perform all management, configuration, moderation, and monitoring tasks defined in the requirements, such as user management, order intervention, geofencing, and viewing analytics.', 'implementation_requirements': ['Must be built using React.js and TypeScript, bootstrapped with Vite.', 'Must implement routing to handle different management sections (e.g., /users, /orders, /settings).', 'Must use the shared API client library (REPO-API-CLIENT) for all backend communication.', 'Must compose its UI using the shared component library (REPO-UI-COMPONENTS).', "Must handle authentication for the 'Administrator' role and manage session tokens (JWTs) securely."], 'architectural_context': "This component is one of the four main entry points in the 'Presentation Layer' of the microservices architecture.", 'extraction_reasoning': 'This is the primary and only component being built in this repository, as defined in its components_map.'}

## 1.4.0.0 Architectural Layers

- {'layer_name': 'Presentation Layer (Clients)', 'layer_responsibilities': 'This layer comprises the four distinct client applications that provide the user interfaces for Customers, Vendors, Riders, and Administrators. This repository is responsible for the Administrator client. Its duties include rendering data received from the backend, managing client-side state and user interactions, handling the user authentication flow, and requesting hardware permissions where necessary.', 'layer_constraints': ['Client applications must communicate with backend services only through the central API Gateway.', 'Client applications are responsible for their own state management and do not contain business-critical logic, which resides in the backend services.'], 'implementation_patterns': ['Single Page Application (SPA) for web dashboards.', 'Component-Based Architecture (React).'], 'extraction_reasoning': "The repository is explicitly mapped to the 'presentation' layer, making this architectural context essential for understanding its role and boundaries within the system."}

## 1.5.0.0 Dependency Interfaces

### 1.5.1.0 Interface Name

#### 1.5.1.1 Interface Name

IApiClient

#### 1.5.1.2 Source Repository

REPO-API-CLIENT

#### 1.5.1.3 Method Contracts

##### 1.5.1.3.1 Method Name

###### 1.5.1.3.1.1 Method Name

getUsers

###### 1.5.1.3.1.2 Method Signature

getUsers(params: { page: number, limit: number, role?: string, status?: string, search?: string }): Promise<PaginatedResult<UserDTO>>

###### 1.5.1.3.1.3 Method Purpose

Fetches a paginated and filtered list of all users on the platform.

###### 1.5.1.3.1.4 Integration Context

Called by the User Management page to populate the main data table.

##### 1.5.1.3.2.0 Method Name

###### 1.5.1.3.2.1 Method Name

suspendUser

###### 1.5.1.3.2.2 Method Signature

suspendUser(userId: string, reason: string): Promise<void>

###### 1.5.1.3.2.3 Method Purpose

Suspends a user's account for a specified reason.

###### 1.5.1.3.2.4 Integration Context

Called when an administrator confirms a user suspension action.

##### 1.5.1.3.3.0 Method Name

###### 1.5.1.3.3.1 Method Name

createZone

###### 1.5.1.3.3.2 Method Signature

createZone(payload: CreateZoneDTO): Promise<ZoneDTO>

###### 1.5.1.3.3.3 Method Purpose

Creates a new operational zone using GeoJSON polygon data.

###### 1.5.1.3.3.4 Integration Context

Called by the Geofencing Tool when an admin saves a new zone.

##### 1.5.1.3.4.0 Method Name

###### 1.5.1.3.4.1 Method Name

updateSystemConfig

###### 1.5.1.3.4.2 Method Signature

updateSystemConfig(config: SystemConfigDTO): Promise<void>

###### 1.5.1.3.4.3 Method Purpose

Updates a system-wide configuration value, such as the COD limit or cancellation fee.

###### 1.5.1.3.4.4 Integration Context

Called when an administrator saves a form in the 'System Settings' section.

##### 1.5.1.3.5.0 Method Name

###### 1.5.1.3.5.1 Method Name

getSalesReport

###### 1.5.1.3.5.2 Method Signature

getSalesReport(params: { startDate: string, endDate: string }): Promise<SalesReportDTO>

###### 1.5.1.3.5.3 Method Purpose

Fetches aggregated sales data for the reporting dashboard.

###### 1.5.1.3.5.4 Integration Context

Called by the Reporting page when a date range is selected.

#### 1.5.1.4.0.0 Integration Pattern

Library Consumption. The Admin Dashboard will import the API client as an NPM package and use its typed methods to interact with the backend, abstracting away direct HTTP requests.

#### 1.5.1.5.0.0 Communication Protocol

HTTPS/REST

#### 1.5.1.6.0.0 Extraction Reasoning

REPO-API-CLIENT is a critical dependency. This interface contract defines the primary mechanism for data fetching and mutation, and is explicitly mentioned in the repository's dependency contract. The methods shown are representative of the full admin-scoped API surface.

### 1.5.2.0.0.0 Interface Name

#### 1.5.2.1.0.0 Interface Name

IUIComponents

#### 1.5.2.2.0.0 Source Repository

REPO-UI-COMPONENTS

#### 1.5.2.3.0.0 Method Contracts

##### 1.5.2.3.1.0 Method Name

###### 1.5.2.3.1.1 Method Name

DataTable

###### 1.5.2.3.1.2 Method Signature

<DataTable data={...} columns={...} />

###### 1.5.2.3.1.3 Method Purpose

Renders complex, sortable, filterable, and paginated tables for managing large datasets like users, orders, and logs.

###### 1.5.2.3.1.4 Integration Context

Used as the core component for the User Management, Order List, and Audit Trail screens.

##### 1.5.2.3.2.0 Method Name

###### 1.5.2.3.2.1 Method Name

ModalDialog

###### 1.5.2.3.2.2 Method Signature

<ModalDialog variant='critical-delete' ... />

###### 1.5.2.3.2.3 Method Purpose

Provides overlay dialogs for forms and confirmations, including the two-step verification for critical delete operations.

###### 1.5.2.3.2.4 Integration Context

Used to implement REQ-1-014 for deleting users, vendors, etc.

##### 1.5.2.3.3.0 Method Name

###### 1.5.2.3.3.1 Method Name

DashboardWidget

###### 1.5.2.3.3.2 Method Signature

<DashboardWidget title='Sales' variant='kpi' ... />

###### 1.5.2.3.3.3 Method Purpose

Displays individual metrics or charts on the main dashboard and reporting pages.

###### 1.5.2.3.3.4 Integration Context

Used to build the screens for REQ-1-107 (Reporting) and ADM-018 (Real-Time Business Dashboard).

#### 1.5.2.4.0.0 Integration Pattern

Component Composition. The Admin Dashboard will import and compose these React components to build its user interface.

#### 1.5.2.5.0.0 Communication Protocol

N/A (Compile-time dependency).

#### 1.5.2.6.0.0 Extraction Reasoning

REPO-UI-COMPONENTS is a declared dependency. The Admin Dashboard is a UI application, and its implementation relies entirely on consuming and assembling a shared library of UI components.

### 1.5.3.0.0.0 Interface Name

#### 1.5.3.1.0.0 Interface Name

IRealTimeAlerts

#### 1.5.3.2.0.0 Source Repository

API Gateway (WebSocket)

#### 1.5.3.3.0.0 Method Contracts

##### 1.5.3.3.1.0 Method Name

###### 1.5.3.3.1.1 Method Name

on('allocation_failure')

###### 1.5.3.3.1.2 Method Signature

on('allocation_failure', (payload: AllocationFailureEvent) => void)

###### 1.5.3.3.1.3 Method Purpose

Receives a real-time alert when the system fails to assign a rider to an order.

###### 1.5.3.3.1.4 Integration Context

A global WebSocket client will listen for this event and trigger a UI notification or update the admin dashboard as per ADM-019.

##### 1.5.3.3.2.0 Method Name

###### 1.5.3.3.2.1 Method Name

on('system_health_degraded')

###### 1.5.3.3.2.2 Method Signature

on('system_health_degraded', (payload: SystemHealthEvent) => void)

###### 1.5.3.3.2.3 Method Purpose

Receives alerts about critical system health issues, such as high error rates or service unavailability.

###### 1.5.3.3.2.4 Integration Context

Used to update a system status indicator on the main admin dashboard.

#### 1.5.3.4.0.0 Integration Pattern

WebSocket Client

#### 1.5.3.5.0.0 Communication Protocol

WSS (Secure WebSocket)

#### 1.5.3.6.0.0 Extraction Reasoning

This interface is required to fulfill real-time monitoring requirements like ADM-019. The Admin Dashboard must establish a persistent, authenticated WebSocket connection to receive push-based alerts from the backend, ensuring immediate operational awareness without relying on polling.

### 1.5.4.0.0.0 Interface Name

#### 1.5.4.1.0.0 Interface Name

IMappingServiceSDK

#### 1.5.4.2.0.0 Source Repository

Mapbox GL JS

#### 1.5.4.3.0.0 Method Contracts

##### 1.5.4.3.1.0 Method Name

###### 1.5.4.3.1.1 Method Name

renderMap

###### 1.5.4.3.1.2 Method Signature

new mapboxgl.Map({ container, style, center, zoom })

###### 1.5.4.3.1.3 Method Purpose

Renders the base map canvas within a specified container element.

###### 1.5.4.3.1.4 Integration Context

Used as the foundational component for the Geofencing Tool.

##### 1.5.4.3.2.0 Method Name

###### 1.5.4.3.2.1 Method Name

drawPolygon

###### 1.5.4.3.2.2 Method Signature

new MapboxDraw({ controls: { polygon: true } })

###### 1.5.4.3.2.3 Method Purpose

Adds UI controls to the map that allow an administrator to draw, edit, and delete polygon shapes.

###### 1.5.4.3.2.4 Integration Context

Used within the Geofencing Tool to define operational zones as per REQ-1-080.

#### 1.5.4.4.0.0 Integration Pattern

SDK Integration

#### 1.5.4.5.0.0 Communication Protocol

N/A (Client-side library)

#### 1.5.4.6.0.0 Extraction Reasoning

This interface is required to implement the geofencing feature (REQ-1-080). The Admin Dashboard must directly integrate the Mapbox client-side SDK to provide the necessary interactive map and drawing functionalities.

## 1.6.0.0.0.0 Exposed Interfaces

*No items available*

## 1.7.0.0.0.0 Technology Context

### 1.7.1.0.0.0 Framework Requirements

The application must be built using React.js v18.2+ with TypeScript, using Vite for the build tooling. State management for server-side data should be handled declaratively with TanStack Query. Data visualization should use D3.js.

### 1.7.2.0.0.0 Integration Technologies

- oidc-client-ts: For handling the OAuth 2.0/OIDC authentication flow with AWS Cognito.
- Socket.IO Client: For managing the persistent WebSocket connection for real-time alerts.
- D3.js: Required for implementing the charting and data visualization features of the reporting dashboards.
- Mapbox GL JS (or a React wrapper): Required to implement the geofencing tool for operational zones as per REQ-1-080.

### 1.7.3.0.0.0 Performance Constraints

Must efficiently render and manage large datasets using techniques like list virtualization and server-side pagination/filtering/sorting. All data-heavy screens must remain responsive and not block the UI thread during data fetching.

### 1.7.4.0.0.0 Security Requirements

The application must securely manage JWTs (access and refresh tokens), ideally in memory to mitigate XSS risks. It must implement UI-level access control, hiding or disabling actions that the logged-in administrator is not permitted to perform (though the authoritative check is on the backend). All data must be fetched and sent over HTTPS/WSS.

## 1.8.0.0.0.0 Extraction Validation

| Property | Value |
|----------|-------|
| Mapping Completeness Check | The repository's purpose is fully accounted for by... |
| Cross Reference Validation | All mappings are consistent with the cached contex... |
| Implementation Readiness Assessment | Readiness is high. The technology stack is defined... |
| Quality Assurance Confirmation | The extracted context has been systematically anal... |

