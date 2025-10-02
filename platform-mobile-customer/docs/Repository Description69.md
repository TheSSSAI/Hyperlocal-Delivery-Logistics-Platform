# 1 Id

REPO-FE-CUST

# 2 Name

platform-mobile-customer

# 3 Description

This repository contains the complete React Native source code for the customer-facing mobile application. Its primary responsibility is to provide the user interface and experience for customers to discover local vendors, browse products, place orders, make payments, track live deliveries, and provide ratings. This application is a core component of the three-sided marketplace, serving as the primary touchpoint for the consumer user class. It integrates with the backend via the centralized API Gateway. Its dependencies on shared libraries have been updated to consume the new, granular components for UI consistency and API access.

# 4 Type

🔹 Application Services

# 5 Namespace

Platform.Mobile.Customer

# 6 Output Path

apps/mobile-customer

# 7 Framework

React Native

# 8 Language

TypeScript

# 9 Technology

React Native, Redux/Zustand

# 10 Thirdparty Libraries

- react-native-maps
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

REQ-1-009

# 14.0.0 Generate Tests

✅ Yes

# 15.0.0 Generate Documentation

✅ Yes

# 16.0.0 Architecture Style

Microservices

# 17.0.0 Architecture Map

- presentation

# 18.0.0 Components Map

- Customer Mobile App (React Native)

# 19.0.0 Requirements Map

- REQ-1-002
- REQ-1-009
- REQ-1-047
- REQ-1-052
- REQ-1-059

# 20.0.0 Decomposition Rationale

## 20.1.0 Operation Type

UNCHANGED

## 20.2.0 Source Repository

self

## 20.3.0 Decomposition Reasoning

The repository's core responsibility as a standalone customer application remains unchanged. However, its internal structure is optimized by extracting shared logic into 'platform-ui-components' and 'platform-api-client', reducing its codebase size, eliminating duplicated code, and improving maintainability.

## 20.4.0 Extracted Responsibilities

- Shared UI components are now consumed from REPO-UI-COMPONENTS.
- API data fetching logic is now handled by REPO-API-CLIENT.

## 20.5.0 Reusability Scope

- N/A - This is a top-level application.

## 20.6.0 Development Benefits

- The development team can focus purely on customer-facing features and user experience.
- Builds are faster due to a smaller, more focused codebase.

# 21.0.0 Dependency Contracts

## 21.1.0 Repo-Api-Client

### 21.1.1 Required Interfaces

- {'interface': 'IApiClient', 'methods': ['searchProducts(query: string)', 'createOrder(payload: CreateOrderDTO)'], 'events': [], 'properties': []}

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
| Event Communication | Uses WebSocket connection for real-time tracking a... |
| Data Flow | Follows a standard mobile app data flow: User Acti... |
| Error Handling | Displays user-friendly error messages based on res... |
| Async Patterns | Extensive use of async/await for API calls and Pro... |

# 24.0.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | Leverage React Native's platform-specific APIs for... |
| Performance Considerations | Optimize list rendering with FlatList. Minimize bu... |
| Security Considerations | Use secure storage for JWTs. Implement certificate... |
| Testing Approach | Unit tests for business logic, component tests wit... |

# 25.0.0 Scope Boundaries

## 25.1.0 Must Implement

- User registration and login.
- Product discovery and search.
- Cart and order placement.
- Live delivery tracking.
- Rating submission.

## 25.2.0 Must Not Implement

- Any vendor, rider, or admin-specific functionality.

## 25.3.0 Extension Points

- Integration of new payment methods.
- Introduction of promotional features.

## 25.4.0 Validation Rules

- Client-side validation for user input forms.

