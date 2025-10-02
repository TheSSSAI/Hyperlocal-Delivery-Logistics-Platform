# 1 Id

REPO-FE-ADMIN

# 2 Name

platform-web-admin

# 3 Description

This repository contains the React.js source code for the administrator-facing web dashboard. This is a powerful, internal tool that provides platform administrators with full oversight and control over the entire system. Its responsibilities include managing all user types (customers, vendors, riders), approving new vendor/rider registrations, configuring system-wide settings (like fees and operational zones), monitoring system health, managing support tickets, and viewing comprehensive reports. It is the central nervous system for platform operations. Its dependencies have been updated to use the new shared UI and API client libraries for consistency and efficiency.

# 4 Type

🔹 Application Services

# 5 Namespace

Platform.Web.Admin

# 6 Output Path

apps/web-admin

# 7 Framework

React.js

# 8 Language

TypeScript

# 9 Technology

React.js, Vite, TanStack Query, D3.js

# 10 Thirdparty Libraries

- react-admin
- d3

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

REQ-1-012

# 14.0.0 Generate Tests

✅ Yes

# 15.0.0 Generate Documentation

✅ Yes

# 16.0.0 Architecture Style

Microservices

# 17.0.0 Architecture Map

- presentation

# 18.0.0 Components Map

- Administrator Web Dashboard (React.js)

# 19.0.0 Requirements Map

- REQ-1-002
- REQ-1-012
- REQ-1-080
- REQ-1-014
- REQ-1-107

# 20.0.0 Decomposition Rationale

## 20.1.0 Operation Type

UNCHANGED

## 20.2.0 Source Repository

self

## 20.3.0 Decomposition Reasoning

The repository's focused role as the central admin tool is maintained. Abstraction of common UI and API logic into shared libraries allows the admin dashboard team to focus on building complex and powerful internal tools, such as data visualizations, geofencing interfaces, and detailed auditing views, without being burdened by reinventing basic components.

## 20.4.0 Extracted Responsibilities

- Shared UI components are now consumed from REPO-UI-COMPONENTS.
- API data fetching logic is now handled by REPO-API-CLIENT.

## 20.5.0 Reusability Scope

- N/A - This is a top-level application.

## 20.6.0 Development Benefits

- Rapid development of internal tooling and management interfaces.
- Maintains a clear separation between internal admin tools and public-facing applications.

# 21.0.0 Dependency Contracts

## 21.1.0 Repo-Api-Client

### 21.1.1 Required Interfaces

- {'interface': 'IApiClient', 'methods': ['getUsers(filter: UserFilter)', 'updateSystemConfig(config: SystemConfigDTO)', 'getAuditLogs()'], 'events': [], 'properties': []}

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
| Event Communication | N/A |
| Data Flow | Highly complex data fetching and mutation patterns... |
| Error Handling | Detailed error reporting for failed administrative... |
| Async Patterns | Manages a large amount of asynchronous state repre... |

# 24.0.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | Consider using a framework like 'react-admin' to a... |
| Performance Considerations | Efficiently handle and display large datasets with... |
| Security Considerations | Implements strict, fine-grained role-based access ... |
| Testing Approach | Workflow-based E2E tests for critical administrati... |

# 25.0.0 Scope Boundaries

## 25.1.0 Must Implement

- Full CRUD management for all users, orders, and vendors.
- System configuration management.
- Geofencing tools for operational zones.
- Reporting and analytics dashboards.
- Support ticket management.

## 25.2.0 Must Not Implement

- Any public-facing functionality.

## 25.3.0 Extension Points

- Integration with internal business intelligence (BI) tools.
- More advanced moderation and fraud detection tools.

## 25.4.0 Validation Rules

- Client-side validation to prevent invalid data entry for system configurations.

