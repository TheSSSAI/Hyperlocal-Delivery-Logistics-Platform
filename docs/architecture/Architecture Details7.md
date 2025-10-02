# 1 Style

Microservices

# 2 Patterns

## 2.1 Cloud-Native

### 2.1.1 Name

Cloud-Native

### 2.1.2 Description

Designing and running applications to take full advantage of the cloud computing model. This involves using managed services, containerization, and dynamic orchestration to build resilient, manageable, and observable systems.

### 2.1.3 Benefits

- High availability and fault tolerance through Multi-AZ deployments.
- Elastic scalability using autoscaling for both compute and containers.
- Reduced operational overhead by leveraging managed AWS services (RDS, EKS, SQS, SNS).
- Faster deployment cycles through CI/CD pipelines and Infrastructure as Code.

### 2.1.4 Applicability

#### 2.1.4.1 Scenarios

- Building systems on a specific cloud provider like AWS as mandated by REQ-1-007.
- Systems requiring high uptime and scalability to handle fluctuating loads.

## 2.2.0.0 Domain-Driven Design (DDD)

### 2.2.1.0 Name

Domain-Driven Design (DDD)

### 2.2.2.0 Description

An approach to software development that focuses on modeling the software to match a domain according to input from that domain's experts. Service boundaries for microservices are defined around these domain models (Bounded Contexts).

### 2.2.3.0 Benefits

- Creates a common, ubiquitous language between developers and domain experts.
- Leads to a more logical and maintainable microservice architecture by defining clear boundaries (REQ-1-104).
- Aligns service responsibilities with core business capabilities, reducing coupling.
- Encapsulates complex business logic within the correct service.

### 2.2.4.0 Applicability

#### 2.2.4.1 Scenarios

- Complex systems with non-trivial business rules, like a three-sided marketplace.
- Defining service boundaries in a microservices architecture as specified in REQ-1-104.

## 2.3.0.0 API Gateway

### 2.3.1.0 Name

API Gateway

### 2.3.2.0 Description

A single entry point for all client requests, which routes them to the appropriate backend microservice. It can also handle cross-cutting concerns like authentication, rate limiting, and logging.

### 2.3.3.0 Benefits

- Provides a unified interface for diverse clients (mobile, web) instead of exposing individual microservices.
- Centralizes cross-cutting concerns like authentication (JWT validation) and security policies.
- Simplifies client-side code by abstracting the backend microservice architecture.
- Enables request routing, composition, and protocol translation in one place.

### 2.3.4.0 Tradeoffs

- Can become a development bottleneck if not managed properly.
- Introduces a single point of failure if not made highly available.

### 2.3.5.0 Applicability

#### 2.3.5.1 Scenarios

- Microservices architectures where clients need to interact with multiple services (REQ-1-106).
- Providing a secure, managed access layer for public-facing APIs.

## 2.4.0.0 Event-Driven Architecture

### 2.4.1.0 Name

Event-Driven Architecture

### 2.4.2.0 Description

A paradigm where system components communicate asynchronously by producing and consuming events. This promotes loose coupling and resilience.

### 2.4.3.0 Benefits

- Enables loose coupling and high cohesion between microservices (REQ-1-105).
- Improves scalability and resilience, as services can operate independently.
- Allows for easy addition of new services that react to existing events without changing the producer service.
- Facilitates handling of long-running or background processes.

### 2.4.4.0 Applicability

#### 2.4.4.1 Scenarios

- Asynchronous communication between microservices using a message bus like AWS SQS/SNS (REQ-1-105).
- Implementing distributed transactions using patterns like Saga.

## 2.5.0.0 Saga

### 2.5.1.0 Name

Saga

### 2.5.2.0 Description

A pattern for managing data consistency across microservices in a distributed transaction. It uses a sequence of local transactions, where each transaction updates data in a single service and publishes an event that triggers the next transaction in the saga.

### 2.5.3.0 Benefits

- Maintains data consistency across multiple services without using distributed locking or 2PC.
- Avoids tight coupling between services.
- Each service has atomic control over its own data.
- Enables robust rollback and compensation logic for failed transactions.

### 2.5.4.0 Tradeoffs

- Increased complexity in design and implementation compared to atomic transactions.
- Requires careful design of compensating transactions to handle failures.

### 2.5.5.0 Applicability

#### 2.5.5.1 Scenarios

- Managing distributed transactions that span multiple services, such as the order creation process (REQ-1-105).

## 2.6.0.0 Service Mesh

### 2.6.1.0 Name

Service Mesh

### 2.6.2.0 Description

A dedicated infrastructure layer for handling service-to-service communication. It provides reliable, secure, and observable communication through a proxy (sidecar) deployed alongside each service instance.

### 2.6.3.0 Benefits

- Offloads network communication logic (retries, circuit breakers, timeouts) from application code (REQ-1-106).
- Provides deep observability into inter-service traffic, including latency and error rates.
- Enables advanced traffic management features like canary deployments and A/B testing.
- Secures inter-service communication using mutual TLS (mTLS).

### 2.6.4.0 Applicability

#### 2.6.4.1 Scenarios

- Managing and securing communication between a large number of microservices as mandated by REQ-1-106.
- Implementing resilience patterns like circuit breakers and retries at the infrastructure level.

# 3.0.0.0 Layers

## 3.1.0.0 Presentation Layer (Clients)

### 3.1.1.0 Id

presentation

### 3.1.2.0 Name

Presentation Layer (Clients)

### 3.1.3.0 Description

This layer comprises the four distinct client applications that provide the user interfaces for Customers, Vendors, Riders, and Administrators. Each application is tailored to the specific needs and device type of its user class.

### 3.1.4.0 Technologystack

React Native v0.73+, React.js v18.2+ with Vite

### 3.1.5.0 Language

TypeScript/JavaScript

### 3.1.6.0 Type

🔹 Presentation

### 3.1.7.0 Responsibilities

- Provide user interfaces for each user role (REQ-1-002).
- Render data received from the backend via the API Gateway.
- Manage client-side state and user interactions.
- Handle user authentication flow (e.g., storing JWTs securely).
- Request hardware permissions like GPS and Camera as needed (REQ-1-089).
- Implement basic offline support for cached data (REQ-1-087).

### 3.1.8.0 Components

- Customer Mobile App (React Native)
- Rider Mobile App (React Native)
- Vendor Web Dashboard (React.js)
- Administrator Web Dashboard (React.js)

### 3.1.9.0 Dependencies

- {'layerId': 'api-gateway', 'type': 'Required'}

## 3.2.0.0 API Gateway Layer

### 3.2.1.0 Id

api-gateway

### 3.2.2.0 Name

API Gateway Layer

### 3.2.3.0 Description

A managed, centralized entry point that routes all client requests to the appropriate backend microservices. It enforces security, rate limiting, and other cross-cutting policies.

### 3.2.4.0 Technologystack

Amazon API Gateway

### 3.2.5.0 Language

N/A

### 3.2.6.0 Type

🔹 APIGateway

### 3.2.7.0 Responsibilities

- Act as the single, public-facing entry point for all client applications (REQ-1-106).
- Route incoming HTTP/WSS requests to the correct internal microservice.
- Enforce authentication by validating JWTs issued by the Identity Service (REQ-1-096).
- Implement rate limiting and throttling to protect backend services.
- Generate and inject a `correlationId` into request headers for distributed tracing (REQ-1-110).
- Aggregate results from multiple services for certain client requests (BFF pattern).

### 3.2.8.0 Dependencies

- {'layerId': 'application-services', 'type': 'Required'}

## 3.3.0.0 Application Services Layer (Microservices)

### 3.3.1.0 Id

application-services

### 3.3.2.0 Name

Application Services Layer (Microservices)

### 3.3.3.0 Description

The core of the backend system, composed of independently deployable services organized around business capabilities (Bounded Contexts) as per DDD principles.

### 3.3.4.0 Technologystack

Node.js v18.18+, NestJS, Docker, Amazon EKS

### 3.3.5.0 Language

TypeScript

### 3.3.6.0 Type

🔹 ApplicationServices

### 3.3.7.0 Responsibilities

- Implement the core business logic and workflows of the platform.
- Own and manage a specific subset of the application's data.
- Expose RESTful APIs for consumption by the API Gateway or other services.
- Communicate with other services asynchronously via the Messaging Layer (REQ-1-105).
- Enforce business rules and data validation.
- Integrate with third-party services like payment gateways and mapping services (REQ-1-008).

### 3.3.8.0 Components

- Identity & Access Service (Manages User, Customer/Vendor/Rider Profiles, UserConsent, RBAC via AWS Cognito)
- Vendor & Catalog Service (Manages Vendor Profiles, Products, Categories, Inventory)
- Order Management Service (Manages Order lifecycle, Cart, Cancellations, Saga Orchestration)
- Rider Logistics Service (Manages Rider Allocation, Live Tracking, Operational Zones, POD)
- Payments & Settlements Service (Manages Payments, Refunds, Commissions, Payouts, Razorpay Integration)
- Ratings & Communication Service (Manages Ratings, Reviews, In-App Chat, Support Tickets)
- Notifications Service (Manages Push Notifications via FCM and SMS via AWS SNS)

### 3.3.9.0 Dependencies

#### 3.3.9.1 Required

##### 3.3.9.1.1 Layer Id

messaging

##### 3.3.9.1.2 Type

🔹 Required

#### 3.3.9.2.0 Required

##### 3.3.9.2.1 Layer Id

infrastructure

##### 3.3.9.2.2 Type

🔹 Required

## 3.4.0.0.0 Messaging Layer

### 3.4.1.0.0 Id

messaging

### 3.4.2.0.0 Name

Messaging Layer

### 3.4.3.0.0 Description

The asynchronous communication backbone of the microservices architecture. It decouples services, enabling event-driven workflows and improving system resilience and scalability.

### 3.4.4.0.0 Technologystack

AWS Simple Notification Service (SNS), AWS Simple Queue Service (SQS)

### 3.4.5.0.0 Language

N/A

### 3.4.6.0.0 Type

🔹 Messaging

### 3.4.7.0.0 Responsibilities

- Enable asynchronous, pub/sub communication between microservices (REQ-1-105).
- Guarantee message delivery for critical events (e.g., Order Placed, Payment Confirmed).
- Buffer requests to handle load spikes and prevent service overloads.
- Facilitate the choreography for Saga patterns to manage distributed transactions.

### 3.4.8.0.0 Components

- SNS Topics (e.g., `order-events`, `user-events`)
- SQS Queues (Subscribed to topics, one per consuming service for durability)

## 3.5.0.0.0 Infrastructure Layer

### 3.5.1.0.0 Id

infrastructure

### 3.5.2.0.0 Name

Infrastructure Layer

### 3.5.3.0.0 Description

Provides the foundational persistence, caching, and observability services that support the entire platform. This layer is primarily composed of managed AWS services to ensure reliability and scalability.

### 3.5.4.0.0 Technologystack

Amazon RDS for PostgreSQL v15.4+, Amazon ElastiCache (Redis), Amazon S3, AWS CloudWatch, Prometheus, Grafana

### 3.5.5.0.0 Language

N/A

### 3.5.6.0.0 Type

🔹 Infrastructure

### 3.5.7.0.0 Responsibilities

- Provide durable, relational data storage with high availability and backups (REQ-1-094).
- Provide in-memory caching for frequently accessed, low-volatility data (e.g., system config, product details).
- Provide object storage for unstructured data like user-uploaded documents and images.
- Collect and centralize structured logs from all microservices (REQ-1-108).
- Collect metrics for monitoring and alerting (REQ-1-108, REQ-1-109).
- Store application secrets and credentials securely (REQ-1-097).

### 3.5.8.0.0 Components

- Primary Database (PostgreSQL on RDS)
- Distributed Cache (Redis on ElastiCache)
- Object Storage (S3)
- Centralized Logging (CloudWatch Logs)
- Monitoring & Alerting (Prometheus, Grafana, Alertmanager)
- Secrets Management (AWS Secrets Manager)
- Identity Provider (AWS Cognito)

## 3.6.0.0.0 Cross-Cutting Concerns

### 3.6.1.0.0 Id

cross-cutting

### 3.6.2.0.0 Name

Cross-Cutting Concerns

### 3.6.3.0.0 Description

This logical layer represents functionalities that are applicable across multiple microservices. They are typically implemented as shared libraries, middleware, or through infrastructure-level tools like a service mesh.

### 3.6.4.0.0 Technologystack

AWS App Mesh, NestJS Middleware/Interceptors

### 3.6.5.0.0 Language

TypeScript

### 3.6.6.0.0 Type

🔹 CrossCutting

### 3.6.7.0.0 Responsibilities

- Provide secure and observable inter-service communication (managed by AWS App Mesh, REQ-1-106).
- Implement distributed request tracing by propagating a correlation ID (REQ-1-110).
- Standardize logging format and exception handling across all services.
- Enforce authorization and permission checks within each service.
- Manage application configuration and feature flags.

### 3.6.8.0.0 Components

- Service Mesh (AWS App Mesh for resilience and mTLS)
- Shared NPM libraries (for logging, DTOs, custom decorators)
- Centralized Configuration Management

