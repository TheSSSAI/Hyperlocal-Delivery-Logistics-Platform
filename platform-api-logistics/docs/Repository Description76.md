# 1 Id

REPO-BE-LOGIS

# 2 Name

platform-api-logistics

# 3 Description

This microservice repository handles all aspects of physical delivery logistics. Its core responsibilities include managing rider availability, running the rider allocation algorithm to assign tasks, providing real-time location tracking for live orders, optimizing delivery routes, and managing operational zones via geofencing. It is a highly specialized service that integrates deeply with the third-party mapping provider (Mapbox). The logic is complex and computationally intensive, justifying its separation. Its dependencies have been updated to use the new granular shared libraries.

# 4 Type

🔹 Application Services

# 5 Namespace

Platform.Services.Logistics

# 6 Output Path

services/logistics

# 7 Framework

NestJS

# 8 Language

TypeScript

# 9 Technology

NestJS, PostgreSQL with PostGIS, Redis

# 10 Thirdparty Libraries

- @mapbox/mapbox-sdk

# 11 Layer Ids

- application-services

# 12 Dependencies

- REPO-LIB-CONTRACTS
- REPO-LIB-OBSERVABILITY

# 13 Requirements

## 13.1 Requirement Id

### 13.1.1 Requirement Id

REQ-1-078

## 13.2.0 Requirement Id

### 13.2.1 Requirement Id

REQ-1-059

# 14.0.0 Generate Tests

✅ Yes

# 15.0.0 Generate Documentation

✅ Yes

# 16.0.0 Architecture Style

Microservices

# 17.0.0 Architecture Map

- application-services

# 18.0.0 Components Map

- Rider Logistics Service (Manages Rider Allocation, Live Tracking, Operational Zones, POD)

# 19.0.0 Requirements Map

- REQ-1-078
- REQ-1-059
- REQ-1-079
- REQ-1-080
- REQ-1-074
- REQ-1-075

# 20.0.0 Decomposition Rationale

## 20.1.0 Operation Type

UNCHANGED

## 20.2.0 Source Repository

self

## 20.3.0 Decomposition Reasoning

Logistics is a classic, complex domain that forms a natural bounded context. Its requirements—real-time geospatial calculations, route optimization, and high-frequency location updates—are technologically distinct from other services. Isolating it allows for specialized technology choices (like the PostGIS extension for PostgreSQL) and performance tuning focused on its unique workload, without impacting the rest of the system.

## 20.4.0 Extracted Responsibilities

*No items available*

## 20.5.0 Reusability Scope

- The core allocation and routing algorithms could potentially be reused in other logistics-based systems.

## 20.6.0 Development Benefits

- A dedicated team can build deep expertise in logistics and geospatial technologies.
- The computationally intensive allocation algorithm can be scaled independently.

# 21.0.0 Dependency Contracts

## 21.1.0 Repo-Be-Order

### 21.1.1 Required Interfaces

- {'interface': 'OrderReadyForPickupEvent', 'methods': [], 'events': ["Listens for 'order.ready_for_pickup' to begin the rider allocation process."], 'properties': []}

### 21.1.2 Integration Pattern

Event-driven via SNS/SQS.

### 21.1.3 Communication Protocol

Async Messaging

# 22.0.0 Exposed Contracts

## 22.1.0 Public Interfaces

- {'interface': 'ILogisticsService', 'methods': ['getRiderLocation(riderId: string): Promise<LocationDTO>'], 'events': ["Publishes 'RiderAssigned' event.", "Publishes 'DeliveryStatusUpdated' events."], 'properties': [], 'consumers': ['REPO-API-GATEWAY']}

# 23.0.0 Integration Patterns

| Property | Value |
|----------|-------|
| Dependency Injection | Standard NestJS DI. |
| Event Communication | Consumes 'OrderReadyForPickup' to start its workfl... |
| Data Flow | Receives location updates from riders via WebSocke... |
| Error Handling | Manages the allocation failure protocol (REQ-1-079... |
| Async Patterns | The allocation process is asynchronous. |

# 24.0.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | Leverage geospatial libraries and PostGIS for effi... |
| Performance Considerations | The rider allocation algorithm must be highly opti... |
| Security Considerations | Rider location data is sensitive PII and must be h... |
| Testing Approach | Simulation-based testing for the allocation algori... |

# 25.0.0 Scope Boundaries

## 25.1.0 Must Implement

- Rider availability management.
- Automated rider allocation algorithm (REQ-1-078).
- Live location tracking via WebSockets.
- Proof of Delivery (POD) handling (REQ-1-074).
- Operational zone management (REQ-1-080).

## 25.2.0 Must Not Implement

- Order state management (beyond delivery statuses).
- Payment or commission calculations.

## 25.3.0 Extension Points

- Order batching for improved efficiency.
- Dynamic surge pricing based on rider availability.

## 25.4.0 Validation Rules

- Ensure delivery addresses are within defined operational zones.

