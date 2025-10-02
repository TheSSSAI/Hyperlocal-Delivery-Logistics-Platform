# 1 Id

REPO-BE-IDENT

# 2 Name

platform-api-identity

# 3 Description

This microservice repository is responsible for user identity, authentication, authorization, and profile management for all user types (Customer, Vendor, Rider, Admin). It handles user registration, OTP-based login, and the issuance of JWTs. It integrates with AWS Cognito to offload core identity provider functionality. This repository's scope is strictly limited to managing who the users are and what they are allowed to access. Its dependencies have been updated to use the new granular libraries for contracts and observability.

# 4 Type

🔹 Application Services

# 5 Namespace

Platform.Services.Identity

# 6 Output Path

services/identity

# 7 Framework

NestJS

# 8 Language

TypeScript

# 9 Technology

NestJS, AWS Cognito, PostgreSQL

# 10 Thirdparty Libraries

- aws-sdk

# 11 Layer Ids

- application-services

# 12 Dependencies

- REPO-LIB-CONTRACTS
- REPO-LIB-OBSERVABILITY

# 13 Requirements

## 13.1 Requirement Id

### 13.1.1 Requirement Id

REQ-1-096

## 13.2.0 Requirement Id

### 13.2.1 Requirement Id

REQ-1-039

# 14.0.0 Generate Tests

✅ Yes

# 15.0.0 Generate Documentation

✅ Yes

# 16.0.0 Architecture Style

Microservices

# 17.0.0 Architecture Map

- application-services

# 18.0.0 Components Map

- Identity & Access Service (Manages User, Customer/Vendor/Rider Profiles, UserConsent, RBAC via AWS Cognito)

# 19.0.0 Requirements Map

- REQ-1-096
- REQ-1-039
- REQ-1-040
- REQ-1-035
- REQ-1-036
- REQ-1-037

# 20.0.0 Decomposition Rationale

## 20.1.0 Operation Type

UNCHANGED

## 20.2.0 Source Repository

self

## 20.3.0 Decomposition Reasoning

The repository already represents a well-defined bounded context (Identity & Access) as per DDD principles. Its scope is clear and it has minimal business logic overlap with other services. Its internal structure is improved by consuming the new, focused shared libraries.

## 20.4.0 Extracted Responsibilities

*No items available*

## 20.5.0 Reusability Scope

- Serves as the central authentication and authorization point for the entire platform.

## 20.6.0 Development Benefits

- Isolates security-critical code into a single, hardened service.
- Can be developed and maintained by a team specializing in security and identity.

# 21.0.0 Dependency Contracts

## 21.1.0 Repo-Lib-Contracts

### 21.1.1 Required Interfaces

- {'interface': 'UserRegisteredEvent', 'methods': [], 'events': [], 'properties': []}

### 21.1.2 Integration Pattern

Library consumption.

### 21.1.3 Communication Protocol

N/A

# 22.0.0 Exposed Contracts

## 22.1.0 Public Interfaces

- {'interface': 'IAuthService', 'methods': ['loginWithOtp(phone: string, otp: string): Promise<JwtTokens>', 'registerCustomer(data: RegisterCustomerDTO): Promise<UserDTO>'], 'events': ['Publishes UserRegisteredEvent after successful registration.'], 'properties': [], 'consumers': ['REPO-API-GATEWAY']}

# 23.0.0 Integration Patterns

| Property | Value |
|----------|-------|
| Dependency Injection | Standard NestJS DI. |
| Event Communication | Publishes events (e.g., 'UserRegistered') to SNS t... |
| Data Flow | Receives registration/login requests, interacts wi... |
| Error Handling | Handles invalid credentials, duplicate user errors... |
| Async Patterns | N/A |

# 24.0.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | Use guards and strategies for authentication flow ... |
| Performance Considerations | Login and token validation endpoints must be highl... |
| Security Considerations | This is a security-critical service. Follow best p... |
| Testing Approach | Thorough integration testing of registration and l... |

# 25.0.0 Scope Boundaries

## 25.1.0 Must Implement

- User registration for all roles.
- OTP-based login.
- JWT issuance and refresh.
- User profile management (name, email, etc.).
- DPDP consent management (REQ-1-021).

## 25.2.0 Must Not Implement

- Any logic related to orders, products, or logistics.

## 25.3.0 Extension Points

- Adding new authentication methods (e.g., social login).

## 25.4.0 Validation Rules

- Enforce unique constraints on mobile numbers and emails.

