# 1 Id

REPO-BE-RATINGS

# 2 Name

platform-api-ratings

# 3 Description

This new microservice repository is exclusively responsible for managing user-generated ratings and reviews. It was decomposed from the original 'platform-api-communications' repository to separate its distinct data aggregation and CRUD-based functionality. This service handles the submission of ratings for vendors and riders, calculates average ratings, and serves this data to be displayed on profiles. Its single responsibility is to be the system of record for all feedback. This separation allows it to be scaled and optimized for a write-heavy workload during rating submission and a read-heavy workload for profile views, without being affected by the real-time needs of the chat service.

# 4 Type

🔹 Application Services

# 5 Namespace

Platform.Services.Ratings

# 6 Output Path

services/ratings

# 7 Framework

NestJS

# 8 Language

TypeScript

# 9 Technology

NestJS, PostgreSQL

# 10 Thirdparty Libraries

*No items available*

# 11 Layer Ids

- application-services

# 12 Dependencies

- REPO-LIB-CONTRACTS
- REPO-LIB-OBSERVABILITY

# 13 Requirements

## 13.1 Requirement Id

### 13.1.1 Requirement Id

REQ-1-063

## 13.2.0 Requirement Id

### 13.2.1 Requirement Id

REQ-1-064

# 14.0.0 Generate Tests

✅ Yes

# 15.0.0 Generate Documentation

✅ Yes

# 16.0.0 Architecture Style

Microservices

# 17.0.0 Architecture Map

- application-services

# 18.0.0 Components Map

- Ratings & Communication Service

# 19.0.0 Requirements Map

- REQ-1-063
- REQ-1-064

# 20.0.0 Decomposition Rationale

## 20.1.0 Operation Type

NEW_DECOMPOSED

## 20.2.0 Source Repository

REPO-BE-COMMS

## 20.3.0 Decomposition Reasoning

The functionality of submitting reviews and calculating aggregate scores is a standard transactional, CRUD-based workload. Decomposing this from the stateful, real-time chat service simplifies the architecture of both. This service can be scaled based on simple HTTP request volume and its database can be optimized for aggregation queries, independent of the chat system's infrastructure.

## 20.4.0 Extracted Responsibilities

- Storing 1-5 star ratings for vendors and riders.
- Storing optional text reviews.
- Calculating and caching average ratings (REQ-1-064).

## 20.5.0 Reusability Scope

- Provides the core rating data for the entire platform.

## 20.6.0 Development Benefits

- A simple, focused service that is easy to develop and maintain.
- Clear ownership of the user feedback domain.

# 21.0.0 Dependency Contracts

## 21.1.0 Repo-Be-Order

### 21.1.1 Required Interfaces

- {'interface': 'OrderDeliveredEvent', 'methods': [], 'events': ["Listens for 'order.delivered' to validate that a rating can be submitted."], 'properties': []}

### 21.1.2 Integration Pattern

Event-driven via SNS/SQS for validation, and synchronous API calls for data retrieval.

### 21.1.3 Communication Protocol

Async & REST

# 22.0.0 Exposed Contracts

## 22.1.0 Public Interfaces

- {'interface': 'IRatingService', 'methods': ['submitRating(rating: SubmitRatingDTO): Promise<void>', 'getVendorRatings(vendorId: string): Promise<RatingDTO[]>'], 'events': [], 'properties': [], 'consumers': ['REPO-FE-CUST', 'REPO-FE-VEND']}

# 23.0.0 Integration Patterns

| Property | Value |
|----------|-------|
| Dependency Injection | Standard NestJS DI. |
| Event Communication | Consumes 'OrderDelivered' event to know when to pr... |
| Data Flow | Receives rating submissions via API, validates aga... |
| Error Handling | Handles validation errors (e.g., attempting to rat... |
| Async Patterns | Batch jobs can be used to periodically recalculate... |

# 24.0.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | Standard RESTful API implementation using NestJS c... |
| Performance Considerations | Consider caching average ratings to reduce databas... |
| Security Considerations | Ensure a user can only rate an order they particip... |
| Testing Approach | Integration tests for the rating submission and va... |

# 25.0.0 Scope Boundaries

## 25.1.0 Must Implement

- CRUD operations for ratings and reviews.
- Calculation of average scores.

## 25.2.0 Must Not Implement

- Real-time chat or support ticket functionality.

## 25.3.0 Extension Points

- Adding ratings for different aspects (e.g., packaging, item quality).

## 25.4.0 Validation Rules

- A rating can only be submitted for a completed order.

