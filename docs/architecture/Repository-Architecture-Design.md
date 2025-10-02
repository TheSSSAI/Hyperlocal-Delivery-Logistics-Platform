# HyperLocal Marketplace Platform - Enterprise Architecture Documentation

## Executive Summary
This document outlines the enterprise architecture for the HyperLocal Marketplace Platform, a three-sided marketplace connecting local vendors, customers, and delivery riders. The solution is a cloud-native, event-driven system built on a microservices architecture, designed for high scalability, resilience, and operational efficiency. Key architectural decisions include the adoption of a TypeScript-centric technology stack (Node.js/NestJS, React/React Native), exclusive hosting on Amazon Web Services (AWS), and a strict decomposition of services based on Domain-Driven Design (DDD) principles. This architecture supports rapid, independent development by autonomous teams, ensures high availability through multi-AZ deployments, and meets stringent performance targets for a seamless real-time user experience. The business value is delivered through a robust, scalable foundation that can adapt to market demands while maintaining operational excellence and system integrity.

## Solution Architecture Overview
- **Technology Stack**: The platform utilizes a modern, cohesive technology stack: React Native for mobile clients, React.js for web dashboards, and Node.js with the NestJS framework for all backend microservices. The primary data store is Amazon RDS for PostgreSQL, supplemented by Amazon OpenSearch for advanced search capabilities and Redis for caching. The entire infrastructure is managed as code using Terraform.
- **Architectural Patterns**: The system is fundamentally a **Microservices Architecture** with service boundaries defined by business domains (Identity, Orders, Logistics, etc.), as mandated by REQ-1-104. It employs an **Event-Driven Architecture** using AWS SNS/SQS for asynchronous communication (REQ-1-105), which enables loose coupling and resilience. The **Saga pattern** is used to manage data consistency across distributed transactions, particularly for the order lifecycle. An **API Gateway** acts as the single entry point for all clients, providing a secure and managed facade for the backend services.
- **Integration Approach**: Client applications interact with the backend exclusively through the API Gateway via HTTPS/WSS. Internal microservices communicate primarily asynchronously through a message bus, publishing and subscribing to domain events. Critical external integrations for payments (Razorpay), mapping (Mapbox), and notifications (FCM) are encapsulated within specific microservices to isolate dependencies.

## Repository Architecture Strategy
- **Decomposition Approach**: The architecture evolved from an initial set of 14 repositories to a more granular and optimized structure of 21. This was achieved through a systematic decomposition of monolithic shared libraries and services. The original `platform-shared-libs` was broken down into focused libraries for `contracts`, `observability`, and `configuration`. The `platform-api-communications` service was split into `chat`, `ratings`, and `support` microservices to isolate their distinct technical requirements. Finally, reusable components were extracted from the four frontend applications into `platform-ui-components` and `platform-api-client` libraries.
- **Optimization Benefits**: This refined decomposition strategy yields significant benefits:
    - **Improved Team Autonomy**: Teams can develop, test, and deploy their services and libraries independently, reducing coordination overhead.
    - **Enhanced Code Reusability**: Shared libraries for UI components and API clients eliminate code duplication across the four frontend applications.
    - **Stronger Boundaries**: Versioned contract libraries (`platform-lib-contracts`) enforce stable interfaces between services, preventing breaking changes.
    - **Specialized Scaling**: Services with unique performance characteristics (e.g., real-time chat vs. CRUD-based ratings) can be scaled and optimized independently.
- **Development Workflow**: The repository structure supports a streamlined development workflow where teams aligned with business domains own their microservices end-to-end. Shared libraries are managed by a platform or core services team. Feature development can occur in parallel, and CI/CD pipelines managed by GitHub Actions ensure consistent builds, testing, and deployments to the EKS environments.

## System Architecture Diagrams

### Repository Dependency Architecture
mermaid
graph TD
    subgraph Users
        direction LR
        CU[Customer]:::actor
        VE[Vendor]:::actor
        RI[Rider]:::actor
        AD[Admin]:::actor
    end

    subgraph "Frontend Layer"
        direction LR
        FE_CUST["platform-mobile-customer<br>(React Native)"]:::fe
        FE_RIDER["platform-mobile-rider<br>(React Native)"]:::fe
        FE_VEND["platform-web-vendor<br>(React.js)"]:::fe
        FE_ADMIN["platform-web-admin<br>(React.js)"]:::fe
    end

    subgraph "Shared Frontend Libraries"
        direction LR
        LIB_UI["platform-ui-components"]:::lib
        LIB_API["platform-api-client"]:::lib
    end

    subgraph "API Gateway Layer"
        APIGW["API Gateway<br>(Amazon API Gateway)"]:::gateway
    end

    subgraph "Backend Microservices Layer"
        direction TB
        subgraph "Shared Backend Libraries"
            direction LR
            LIB_CON["platform-lib-contracts"]:::lib
            LIB_OBS["platform-lib-observability"]:::lib
        end
        
        subgraph "Application Services"
            direction LR
            SV_IDENT["Identity Service"]:::be
            SV_CATLG["Vendor & Catalog Service"]:::be
            SV_ORDER["Order Service"]:::be
            SV_LOGIS["Rider Logistics Service"]:::be
            SV_PAYMT["Payments Service"]:::be
            SV_CHAT["Chat Service"]:::be
            SV_RATINGS["Ratings Service"]:::be
            SV_NOTIF["Notifications Service"]:::be
        end
    end

    subgraph "Infrastructure & Data Layer"
        direction LR
        MSG["Message Bus<br>(SNS/SQS)"]:::infra
        DB["PostgreSQL DB<br>(Amazon RDS)"]:::db
        CACHE["Cache<br>(Redis)"]:::db
        SEARCH["Search Index<br>(OpenSearch)"]:::db
        S3["Object Storage<br>(S3)"]:::db
    end

    subgraph "External Services"
        direction LR
        EXT_PAY["Razorpay"]:::ext
        EXT_MAP["Mapbox"]:::ext
        EXT_FCM["FCM"]:::ext
    end

    %% Frontend Connections
    CU -->|Uses| FE_CUST
    RI -->|Uses| FE_RIDER
    VE -->|Uses| FE_VEND
    AD -->|Uses| FE_ADMIN

    FE_CUST -->|Consumes| LIB_UI & LIB_API
    FE_RIDER -->|Consumes| LIB_UI & LIB_API
    FE_VEND -->|Consumes| LIB_UI & LIB_API
    FE_ADMIN -->|Consumes| LIB_UI & LIB_API
    
    LIB_API -->|Imports| LIB_CON

    FE_CUST & FE_RIDER & FE_VEND & FE_ADMIN -->|API Calls (HTTPS/WSS)| APIGW

    %% Backend Connections
    APIGW -->|Routes to| SV_IDENT & SV_CATLG & SV_ORDER & SV_LOGIS & SV_PAYMT & SV_CHAT & SV_RATINGS

    SV_IDENT & SV_CATLG & SV_ORDER & SV_LOGIS & SV_PAYMT & SV_CHAT & SV_RATINGS & SV_NOTIF -->|Consumes| LIB_CON & LIB_OBS

    %% Data and Event Flow
    Application Services -->|Reads/Writes| DB & CACHE & S3 & SEARCH
    Application Services -->|Publishes Events| MSG
    MSG -->|Delivers Events| Application Services

    %% External Integrations
    SV_PAYMT -->|API Calls| EXT_PAY
    SV_LOGIS -->|API Calls| EXT_MAP
    SV_NOTIF -->|API Calls| EXT_FCM

    classDef actor fill:#C3B1E1,stroke:#333,stroke-width:2px;
    classDef fe fill:#A7C7E7,stroke:#333,stroke-width:2px;
    classDef lib fill:#FDFD96,stroke:#333,stroke-width:2px;
    classDef gateway fill:#F5C2C2,stroke:#333,stroke-width:2px;
    classDef be fill:#B2D8B2,stroke:#333,stroke-width:2px;
    classDef infra fill:#FFB347,stroke:#333,stroke-width:2px;
    classDef db fill:#D2B48C,stroke:#333,stroke-width:2px;
    classDef ext fill:#B3B3B3,stroke:#333,stroke-width:2px;


### Component Integration Patterns (Order Placement Saga)
mermaid
sequenceDiagram
    actor C as Customer App
    participant GW as API Gateway
    participant OS as Order Service
    participant PS as Payments Service
    participant VS as Vendor Service
    participant NS as Notifications Service
    participant MB as Message Bus (SNS/SQS)

    C->>+GW: POST /v1/orders (Submit cart)
    GW->>+OS: createOrder(dto)
    Note right of OS: Saga Starts. Order State: PENDING_PAYMENT
    OS->>+PS: createPaymentIntent(order)
    PS-->>-OS: paymentIntentDetails
    OS-->>-GW: { paymentUrl, ... }
    GW-->>-C: 201 Created { paymentUrl }
    
    C->>C: Handles payment via Razorpay
    Note over C: User completes payment externally

    Razorpay->>+PS: Webhook: Payment Success
    PS->>MB: Publishes [PaymentConfirmed] Event
    PS-->>-Razorpay: 200 OK
    
    MB->>+OS: Delivers [PaymentConfirmed] Event
    Note right of OS: Order State: PENDING_VENDOR_ACCEPTANCE
    OS->>MB: Publishes [OrderPlaced] Event
    OS-->>-MB: 

    MB->>+VS: Delivers [OrderPlaced] Event
    VS->>VS: Decrements Product Stock
    Note right of VS: Compensating Tx: Revert Stock
    VS-->>-MB: 

    MB->>+NS: Delivers [OrderPlaced] Event
    NS->>NS: Sends "Order Received" notification to Vendor
    NS-->>-MB: 


## Repository Catalog
- **platform-lib-contracts (REPO-LIB-CONTRACTS)**: (Model Library) TypeScript library defining all DTOs and event schemas. The single source of truth for data contracts.
- **platform-lib-observability (REPO-LIB-OBSERVABILITY)**: (Cross-Cutting Library) NestJS library standardizing structured logging, metrics, and tracing for all backend services.
- **platform-ui-components (REPO-UI-COMPONENTS)**: (Utility Library) React/React Native library of shared UI components, enforcing a consistent design system.
- **platform-api-client (REPO-API-CLIENT)**: (Utility Library) TypeScript library providing a typed client for the backend API Gateway, used by all frontend apps.
- **platform-mobile-customer (REPO-FE-CUST)**: (Application) The customer-facing React Native mobile app.
- **platform-mobile-rider (REPO-FE-RIDER)**: (Application) The rider-facing React Native mobile app.
- **platform-web-vendor (REPO-FE-VEND)**: (Application) The vendor-facing React.js web dashboard.
- **platform-web-admin (REPO-FE-ADMIN)**: (Application) The administrator-facing React.js web dashboard.
- **platform-api-identity (REPO-BE-IDENT)**: (Microservice) Manages user identity, authentication (OTP), authorization (JWT), and profiles.
- **platform-api-vendor-catalog (REPO-BE-CATLG)**: (Microservice) Manages vendor profiles, product catalogs, and real-time inventory.
- **platform-api-orders (REPO-BE-ORDER)**: (Microservice) Manages the entire order lifecycle and orchestrates the order creation Saga.
- **platform-api-logistics (REPO-BE-LOGIS)**: (Microservice) Manages rider allocation, live tracking, route optimization, and operational zones.
- **platform-api-payments (REPO-BE-PAYMT)**: (Microservice) Handles all financial transactions: payments, refunds, commissions, and settlements.
- **platform-api-chat (REPO-BE-CHAT)**: (Microservice) Manages real-time WebSocket-based chat between users for active orders.
- **platform-api-ratings (REPO-BE-RATINGS)**: (Microservice) Manages the submission and aggregation of ratings and reviews.
- **platform-api-notifications (REPO-BE-NOTIF)**: (Microservice) Centralized service for sending all push notifications (FCM) and SMS.
- **platform-iac (REPO-INF-IAC)**: (Infrastructure) Contains all Terraform code for provisioning and managing the AWS infrastructure.

## Integration Architecture
- **Client-Server Communication**: All frontend clients communicate with the backend via the **API Gateway** over secure protocols (HTTPS for REST, WSS for WebSockets). The `platform-api-client` library standardizes this communication, handling authentication (JWT Bearer tokens) and providing typed methods based on an OpenAPI specification.
- **Inter-Service Communication**: The backend follows an **Event-Driven Architecture**. Services are decoupled and communicate asynchronously by publishing events to **AWS SNS** topics and consuming them from dedicated **AWS SQS** queues. This Pub/Sub model is the backbone of the Saga pattern used for distributed transactions.
- **Data Contracts**: The `platform-lib-contracts` repository provides the strict, versioned schemas for all API DTOs and event payloads, ensuring compile-time safety and preventing integration issues between services.

## Technology Implementation Framework
- **Backend (NestJS)**: Services are built using NestJS's modular architecture. Dependency Injection is used extensively. `Guards` and `Strategies` are used to implement authentication flows. `TypeORM` is the standard for data access to the PostgreSQL database.
- **Frontend (React/React Native)**: Applications are built with a component-based architecture. State management is handled by a library like Zustand or Redux. Data fetching is managed through the `platform-api-client` and a data-fetching library like TanStack Query for caching and state synchronization.
- **Infrastructure (Terraform)**: All AWS resources are defined declaratively in the `platform-iac` repository, enabling automated, repeatable environment setups and promoting GitOps practices for infrastructure changes.

## Performance & Scalability Architecture
- **Compute Scalability**: All microservices are containerized with Docker and deployed on Amazon EKS. **Horizontal Pod Autoscalers (HPA)** are configured to scale services independently based on CPU and memory utilization, meeting the 10,000 concurrent user requirement (REQ-1-100).
- **Database Scalability**: The primary PostgreSQL database on RDS is configured with **Read Replicas** to offload read-heavy traffic from the Vendor & Catalog service, ensuring product discovery remains fast under load (REQ-1-100).
- **High Availability**: The entire system, including the EKS cluster and RDS database, is deployed in a **Multi-AZ configuration** to ensure fault tolerance and meet the 99.9% uptime SLA (REQ-1-016, REQ-1-099).
- **Performance Optimization**: A dedicated **Amazon OpenSearch** cluster is used for product search to meet the <500ms typo-tolerant search requirement (REQ-1-048). **Amazon ElastiCache for Redis** is used for caching frequently accessed data like user sessions and vendor profiles.

## Development & Deployment Strategy
- **Team Organization**: Development teams are aligned with the bounded contexts of the microservices (e.g., Orders Team, Logistics Team, Platform Team). This promotes ownership and deep domain expertise.
- **Development Workflow**: Teams work in parallel on their respective repositories. Pull requests are used for code review, with a peer approval requirement enforced by branch policies in GitHub (REQ-1-101). Changes in shared libraries are versioned and published to a private NPM registry.
- **Deployment Architecture**: **GitHub Actions** orchestrate the CI/CD pipeline. On a merge to the main branch, the pipeline builds a new Docker image, runs automated tests (unit, integration, vulnerability scans), pushes the image to Amazon ECR, and deploys the new version to the EKS cluster using a rolling update strategy to ensure zero downtime.

## Architecture Decision Records
- **ADR-001: Adopt Microservices Architecture**: Decided to use a microservices architecture over a monolith to support independent team development, specialized technology choices per service, and independent scaling, aligning with the platform's complexity and long-term growth strategy (REQ-1-104).
- **ADR-002: Utilize Event-Driven Communication**: Decided to use an asynchronous, event-driven model with AWS SNS/SQS as the primary means of inter-service communication. This decouples services, improves fault tolerance, and enables the use of the Saga pattern for distributed transactions (REQ-1-105).
- **ADR-003: Decompose Shared Repositories**: Decided to decompose monolithic shared libraries and services into smaller, more focused repositories. This enhances modularity, enforces strict versioning of contracts, allows for independent evolution of shared components, and improves the overall developer experience and system maintainability.
