# Platform API: Identity & Access Service

## Overview

The Identity & Access Service is a core microservice within the hyperlocal platform ecosystem. It is responsible for managing the lifecycle and authentication of all user types: Customers, Vendors, Riders, and Administrators.

Built with NestJS, this service provides a secure, scalable, and robust foundation for user identity, leveraging modern security practices and a clean, modular architecture.

### Key Responsibilities

-   **User Onboarding**: Handles registration for all user roles, with a focus on OTP-based mobile number verification.
-   **Authentication**: Implements a secure, passwordless OTP login flow, issuing JWTs for session management.
-   **Authorization**: Provides the foundation for Role-Based Access Control (RBAC) used throughout the platform.
-   **Profile Management**: Exposes endpoints for users to manage their personal information.
-   **Security**: Implements critical security features like rate limiting, account lockout, and audit logging for administrative actions.
-   **Compliance**: Manages user data privacy consents in alignment with regulations like the DPDP Act.

## Technology Stack

-   **Framework**: [NestJS](https://nestjs.com/) v10 with Fastify Adapter
-   **Language**: TypeScript
-   **Database**: PostgreSQL with TypeORM
-   **Authentication**: AWS Cognito (for identity federation & token signing)
-   **Caching/State**: Redis (for OTPs, rate limiting, and session data)
-   **Messaging**: AWS SNS (for SMS) and an event bus for inter-service communication

## Getting Started

### Prerequisites

-   Node.js (v18.18+ recommended)
-   pnpm, npm, or yarn
-   Docker and Docker Compose
-   Access to AWS for Cognito, SNS, and a PostgreSQL database (e.g., RDS)
-   Access to a Redis instance (e.g., ElastiCache)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository_url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd platform-api-identity
    ```
3.  Install dependencies:
    ```bash
    npm install
    # or yarn install, or pnpm install
    ```

### Environment Configuration

1.  Create a `.env` file in the root directory by copying the example:
    ```bash
    cp .env.example .env
    ```
2.  Fill in the required environment variables in your `.env` file. These will include credentials and endpoints for the database, Redis, AWS Cognito, and AWS SNS.

### Running the Application

-   **Development Mode (with hot-reloading):**
    ```bash
    npm run start:dev
    ```

-   **Production Mode:**
    ```bash
    npm run build
    npm run start:prod
    ```

The application will be available at `http://localhost:3000` (or the port specified in your `.env` file).

## Testing

-   **Run all unit and integration tests:**
    ```bash
    npm run test
    ```

-   **Run tests with coverage report:**
    ```bash
    npm run test:cov
    ```

-   **Run end-to-end tests:**
    ```bash
    npm run test:e2e
    ```

## API Documentation

This service's API is documented using the OpenAPI (Swagger) specification. When the application is running in a non-production environment, the documentation is available at `/api/docs`.

## Architectural Principles

This service adheres to the principles of **Clean Architecture** and **Domain-Driven Design (DDD)**.

-   **Modularity**: The codebase is organized into feature modules (e.g., `AuthModule`, `UsersModule`, `AdminModule`), each representing a distinct bounded context.
-   **Separation of Concerns**: Logic is separated into controllers (API layer), services (business logic), and repositories (data access), promoting maintainability and testability.
-   **Dependency Inversion**: High-level modules do not depend on low-level modules; both depend on abstractions. This is achieved through NestJS's powerful dependency injection system.

## Key Security Features

-   **OTP-based Authentication**: Secure, passwordless login flow.
-   **JWT Session Management**: Short-lived access tokens and long-lived, securely stored refresh tokens.
-   **Rate Limiting**: Protects against OTP generation abuse.
-   **Account Lockout**: Prevents brute-force attacks on OTP verification.
-   **RBAC**: Implemented via custom guards to protect sensitive endpoints.
-   **Global Exception Handling**: Ensures consistent and secure error responses.
-   **Input Validation**: Global pipes enforce strict validation on all incoming DTOs.