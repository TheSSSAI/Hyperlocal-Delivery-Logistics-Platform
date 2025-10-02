# Hyperlocal Platform Contracts (@hyperlocal/contracts)

## 1. Overview

This repository is the single source of truth for all cross-component data contracts within the Hyperlocal Platform's microservices ecosystem. It contains TypeScript interfaces, classes, and enums for:

-   **Data Transfer Objects (DTOs):** The shape of data for all synchronous API requests and responses.
-   **Event Payloads:** The shape of data for all asynchronous messages sent over the event bus (AWS SQS/SNS).
-   **Shared Enums:** Controlled vocabularies for common types like `OrderStatus`, `UserRole`, etc.

**Architectural Purpose:** This library serves as a limited **Shared Kernel** and implements the **Published Language** pattern from Domain-Driven Design. Its sole responsibility is to define the shape of data. It contains **NO business logic** and has **ZERO runtime dependencies**.

This strict separation ensures:
-   **Type Safety:** Enables compile-time validation of integration points between services.
-   **Decoupling:** Services depend on stable contracts, not on each other's internal implementations.
-   **Architectural Integrity:** Prevents contract violations and promotes a consistent data model across the distributed system.

## 2. Installation

This package is published to a private NPM registry (AWS CodeArtifact). To install it in another project, first configure your `.npmrc` to point to the correct registry, then install as usual:

```bash
npm install @hyperlocal/contracts
```

## 3. Usage

Import contracts directly into your TypeScript projects (e.g., NestJS microservices, React frontends).

### Example: Using an API DTO

```typescript
// In an API controller (e.g., NestJS)
import { OrderDto, CreateOrderDto } from '@hyperlocal/contracts';

@Post()
async create(@Body() createOrderDto: CreateOrderDto): Promise<OrderDto> {
  // ... implementation
}
```

### Example: Using an Event Payload

```typescript
// In an event-driven service
import { OrderPlacedEvent } from '@hyperlocal/contracts';

// Event consumer
public async handleOrderPlaced(event: OrderPlacedEvent): Promise<void> {
  const { orderId, customerId } = event.payload;
  // ... implementation
}
```

## 4. Development

### Prerequisites
- Node.js (v18.18+ recommended)
- NPM

### Setup
1. Clone the repository.
2. Install dependencies: `npm install`

### Key Scripts
- `npm run build`: Compiles TypeScript source to `dist/`.
- `npm run test`: Runs all tests using Jest.
- `npm run lint`: Lints the codebase for style and consistency issues.
- `npm run format`: Formats the code using Prettier.

## 5. Governance and Versioning

This library is a critical shared dependency. Changes must be managed with extreme care.

### Versioning Policy
This project strictly adheres to **Semantic Versioning (SemVer)**.

-   **MAJOR** version change (e.g., 1.x.x -> 2.0.0): For any **breaking change**. This includes removing a field, renaming a field, or changing a field's type in any contract.
-   **MINOR** version change (e.g., 1.1.x -> 1.2.0): For adding new, **non-breaking functionality**. This includes adding a new optional field to a contract or adding a new contract.
-   **PATCH** version change (e.g., 1.1.1 -> 1.1.2): For bug fixes that do not affect the contract schemas (e.g., fixing a typo in a comment).

### Contribution Workflow
1. Create a feature branch from `main`.
2. Make your changes, ensuring to add or update tests.
3. Run `npm run lint` and `npm run test` to ensure all checks pass.
4. Open a Pull Request against the `main` branch.
5. The PR must be reviewed and approved by at least one platform architect.
6. Once merged, the `release.yml` workflow will automatically publish a new version to the private registry if a new version tag is pushed.