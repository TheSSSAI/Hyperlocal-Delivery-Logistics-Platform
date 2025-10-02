# 1 Id

REPO-API-CLIENT

# 2 Name

platform-api-client

# 3 Description

This new, decomposed library provides a fully-typed API client for interacting with the platform's backend API Gateway. It is generated from the OpenAPI specification which is published by the backend services. Extracted as a shared concern from the original frontend repositories, its sole purpose is to provide a consistent, type-safe, and robust way for all frontend applications to make API calls. It encapsulates the logic for handling authentication tokens (JWTs), setting request headers, and parsing responses, thereby removing boilerplate code from the client applications and reducing the risk of integration errors.

# 4 Type

🔹 Utility Library

# 5 Namespace

Platform.Core.ApiClient

# 6 Output Path

libs/api-client

# 7 Framework

None

# 8 Language

TypeScript

# 9 Technology

TypeScript, Axios, OpenAPI Generator

# 10 Thirdparty Libraries

- axios

# 11 Layer Ids

- presentation

# 12 Dependencies

- REPO-LIB-CONTRACTS

# 13 Requirements

- {'requirementId': 'REQ-1-101'}

# 14 Generate Tests

✅ Yes

# 15 Generate Documentation

✅ Yes

# 16 Architecture Style

Microservices

# 17 Architecture Map

- presentation

# 18 Components Map

*No items available*

# 19 Requirements Map

- REQ-1-101

# 20 Decomposition Rationale

## 20.1 Operation Type

NEW_DECOMPOSED

## 20.2 Source Repository

REPO-FE-CUST, REPO-FE-RIDER, REPO-FE-VEND, REPO-FE-ADMIN

## 20.3 Decomposition Reasoning

Created to centralize and standardize API communication logic. Without this library, each of the four frontend apps would implement its own data-fetching logic, leading to massive code duplication and potential inconsistencies in how authentication, errors, and retries are handled. This library ensures all frontends communicate with the backend in a uniform and reliable way.

## 20.4 Extracted Responsibilities

- API request/response handling
- JWT access/refresh token management
- Centralized API error handling
- Type definitions for API endpoints

## 20.5 Reusability Scope

- Consumed by all four frontend applications.

## 20.6 Development Benefits

- Provides frontend developers with a simple, fully-typed SDK for the backend.
- Abstracts away the complexity of HTTP requests and authentication.

# 21.0 Dependency Contracts

*No data available*

# 22.0 Exposed Contracts

## 22.1 Public Interfaces

- {'interface': 'IApiClient', 'methods': ['getOrderById(orderId: string): Promise<OrderDTO>', 'createOrder(payload: CreateOrderDTO): Promise<OrderDTO>'], 'events': [], 'properties': [], 'consumers': ['REPO-FE-CUST', 'REPO-FE-RIDER', 'REPO-FE-VEND', 'REPO-FE-ADMIN']}

# 23.0 Integration Patterns

| Property | Value |
|----------|-------|
| Dependency Injection | Can be provided via React Context to the component... |
| Event Communication | N/A |
| Data Flow | Fetches data from the API Gateway and returns it t... |
| Error Handling | Uses Axios interceptors to handle common HTTP erro... |
| Async Patterns | All methods are async and return Promises. |

# 24.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | The client should be framework-agnostic, but provi... |
| Performance Considerations | Should support request cancellation. |
| Security Considerations | Manages secure storage of JWTs on the client devic... |
| Testing Approach | Mocking API responses using tools like Mock Servic... |

# 25.0 Scope Boundaries

## 25.1 Must Implement

- Methods for all public API endpoints.
- Authentication header injection.
- Refresh token logic.

## 25.2 Must Not Implement

- Any UI or presentation logic.
- Application state management (e.g., Redux, Zustand).

## 25.3 Extension Points

- Can be configured with a base URL for different environments.

## 25.4 Validation Rules

*No items available*

