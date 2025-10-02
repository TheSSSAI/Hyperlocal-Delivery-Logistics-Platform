# 1 Integration Specifications

## 1.1 Extraction Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-api-logistics |
| Extraction Timestamp | 2024-05-24T10:00:00Z |
| Mapping Validation Score | 100% |
| Context Completeness Score | 100% |
| Implementation Readiness Level | High |

## 1.2 Relevant Requirements

### 1.2.1 Requirement Id

#### 1.2.1.1 Requirement Id

REQ-1-078

#### 1.2.1.2 Requirement Text

The system shall trigger the rider allocation process when a vendor updates an order's status to Ready for Pickup. The allocation algorithm must select the most suitable rider by considering multiple factors: rider's proximity to the vendor, rider's current number of active deliveries, the rider's historical performance rating, and the opportunity to batch the order with other deliveries heading in a similar direction. The system must also generate an optimized multi-stop route if orders are batched, using real-time traffic data from the integrated mapping service.

#### 1.2.1.3 Validation Criteria

- Mark an order as 'Ready for Pickup'.
- Verify the system attempts to find a nearby, available rider.
- In a test scenario with multiple riders, verify the system prioritizes the one that is closer and has a higher rating.
- In a scenario with two orders going in the same direction, verify the system attempts to assign both to the same rider and provides a batched route.

#### 1.2.1.4 Implementation Implications

- The service must consume an event indicating an order is 'Ready for Pickup'.
- The core logic is a complex algorithm requiring geospatial queries (PostGIS), access to rider performance data, and integration with a mapping service (Mapbox) for route optimization.
- Requires a performant data store (like Redis) for real-time rider location and availability.

#### 1.2.1.5 Extraction Reasoning

This requirement defines the primary responsibility of the Logistics service: the rider allocation algorithm. It is explicitly mapped in the repository definition and is the central piece of business logic for this microservice.

### 1.2.2.0 Requirement Id

#### 1.2.2.1 Requirement Id

REQ-1-059

#### 1.2.2.2 Requirement Text

The system shall provide live order tracking for customers. Once an order's status is updated to In Transit (picked up by a rider), the customer's order tracking screen must display a map view showing the rider's real-time location. The rider's position on the map must be updated automatically at an interval of 5 to 10 seconds.

#### 1.2.2.3 Validation Criteria

- As a rider, pick up an order and start moving.
- As the customer for that order, open the tracking screen.
- Verify a map is displayed showing the rider's icon.
- Verify the icon's position on the map updates periodically to reflect the rider's movement.

#### 1.2.2.4 Implementation Implications

- The service must ingest a high-frequency stream of location data from rider devices.
- It must broadcast this location data in real-time to the appropriate customer clients, likely via a WebSocket connection managed by the API Gateway.
- Requires a fast, scalable data store (like Redis GEO or Amazon Timestream) to handle live location data.

#### 1.2.2.5 Extraction Reasoning

This requirement is explicitly mapped and defines the live tracking responsibility of the Logistics service, a core feature that justifies its existence as a specialized, real-time service.

### 1.2.3.0 Requirement Id

#### 1.2.3.1 Requirement Id

REQ-1-079

#### 1.2.3.2 Requirement Text

The rider allocation system shall handle re-assignment. If an offered task is rejected by a rider or the acceptance timer expires, the system must immediately offer the task to the next-best available rider. This process shall be repeated up to a maximum of 3 attempts over a 5-minute period. If no rider accepts the task within these limits, the order status must be changed to Allocation Failed. This status change must trigger a notification to both the customer and the vendor, and generate a high-priority alert in the administrator dashboard.

#### 1.2.3.3 Validation Criteria

- Offer a task to Rider A and have them reject it. Verify the task is immediately offered to Rider B.
- Simulate a scenario where 3 riders reject the task over 5 minutes.
- Verify the order status changes to 'Allocation Failed'.

#### 1.2.3.4 Implementation Implications

- The allocation logic must be stateful, tracking attempts and timers for each order.
- It must publish a specific 'AllocationFailed' event upon failure, which other services will consume to notify users and admins.

#### 1.2.3.5 Extraction Reasoning

This requirement details the failure protocol for the core allocation algorithm (REQ-1-078), making it a critical part of the Logistics service's scope and error handling.

### 1.2.4.0 Requirement Id

#### 1.2.4.1 Requirement Id

REQ-1-080

#### 1.2.4.2 Requirement Text

The administrator dashboard shall provide comprehensive user and service area management. It must allow admins to view, search, and manage all user accounts, with functions to approve pending registrations, suspend, and deactivate accounts. The dashboard must also include a geofencing tool for admins to define operational zones by drawing polygons on a map. The system must enforce these zones by preventing any order where the delivery address falls outside a defined operational area.

#### 1.2.4.3 Validation Criteria

- Use the map tool to draw and save a new operational zone.
- As a customer, attempt to place an order for delivery to an address outside of any defined zone and verify the action is blocked.

#### 1.2.4.4 Implementation Implications

- The service must store and manage geofenced zones (polygons) using a geospatial database like PostGIS.
- It must expose an internal API to other services (like Order Management) to validate if a given point (delivery address) is within an active zone.

#### 1.2.4.5 Extraction Reasoning

This requirement defines the 'Operational Zone' management responsibility, which is explicitly listed in this repository's scope and is a core part of the logistics domain.

### 1.2.5.0 Requirement Id

#### 1.2.5.1 Requirement Id

REQ-1-074

#### 1.2.5.2 Requirement Text

The system shall support two distinct, configurable methods for Proof of Delivery (POD). Method 1: Photo Capture, where the rider takes a photo of the delivered package. Method 2: OTP Confirmation, where the rider enters a 4-digit OTP from the customer's app. The default POD method for prepaid orders shall be Photo Capture.

#### 1.2.5.3 Validation Criteria

- Verify an admin can configure the POD method for different order types.
- For a prepaid order, proceed to the final delivery step as a rider. Verify the app prompts for a photo capture.

#### 1.2.5.4 Implementation Implications

- The service must handle the submission and storage of POD data (e.g., photo URLs from S3, OTP confirmation events).
- This data must be associated with the delivery task and order for auditing and dispute resolution.

#### 1.2.5.5 Extraction Reasoning

This requirement is explicitly mapped and defines the 'Proof of Delivery (POD)' handling, which is a key part of the final stage of the delivery lifecycle managed by this service.

### 1.2.6.0 Requirement Id

#### 1.2.6.1 Requirement Id

REQ-1-075

#### 1.2.6.2 Requirement Text

The system must securely store the collected Proof of Delivery (either the captured photo or the OTP confirmation event) and associate it with the corresponding order record. This stored POD record must include metadata: a precise timestamp of when the POD was captured and the GPS coordinates of the rider's device at that moment.

#### 1.2.6.3 Validation Criteria

- Complete a delivery using photo POD.
- In the admin dashboard, view the order details and verify the captured photo is present.
- Verify the photo's metadata includes the correct timestamp and GPS location.

#### 1.2.6.4 Implementation Implications

- The database schema for delivery tasks must include fields for POD type, POD data (e.g., S3 key), timestamp, and a geospatial point for the location.
- The API must accept this metadata along with the POD submission from the rider's app.

#### 1.2.6.5 Extraction Reasoning

This requirement provides the specific implementation details for POD handling (REQ-1-074), making it directly relevant to the Logistics service's data model and API design.

## 1.3.0.0 Relevant Components

- {'component_name': 'Rider Logistics Service', 'component_specification': 'Manages all aspects of physical delivery logistics, including rider availability, automated task allocation, real-time location tracking for live orders, route optimization, and management of operational zones and Proof of Delivery.', 'implementation_requirements': ['Implement a stateful rider allocation algorithm considering proximity, rating, and load.', 'Develop a service to ingest high-frequency GPS data from riders and broadcast it via WebSockets.', 'Use PostgreSQL with the PostGIS extension to store and query geospatial data for operational zones and rider locations.', 'Use Redis for caching real-time rider availability and location data to ensure high-performance lookups during allocation.', 'Implement the allocation failure and re-assignment protocol as a state machine.', 'Provide an API for managing Proof of Delivery submissions.'], 'architectural_context': "Belongs to the 'Application Services Layer'. Acts as the core domain service for the logistics bounded context, encapsulating complex, computationally intensive business logic.", 'extraction_reasoning': "This component is the direct and sole implementation target of the platform-api-logistics repository, as explicitly defined in the repository's components_map."}

## 1.4.0.0 Architectural Layers

- {'layer_name': 'Application Services Layer', 'layer_responsibilities': "Implements the core business logic and workflows of the platform. Owns and manages a specific subset of the application's data and exposes APIs for consumption by other services or the API Gateway.", 'layer_constraints': ['Services should be organized around business capabilities (Bounded Contexts) as per DDD.', 'Services should communicate asynchronously where possible to ensure decoupling and resilience.'], 'implementation_patterns': ['Domain-Driven Design (DDD)', 'Microservices Architecture', 'Event-Driven Architecture'], 'extraction_reasoning': "This repository is explicitly mapped to the 'application-services' layer, and its role as a specialized business logic service for logistics aligns perfectly with this layer's responsibilities."}

## 1.5.0.0 Dependency Interfaces

### 1.5.1.0 Interface Name

#### 1.5.1.1 Interface Name

IOrderEventsConsumer

#### 1.5.1.2 Source Repository

REPO-BE-ORDER

#### 1.5.1.3 Method Contracts

- {'method_name': 'onOrderReadyForPickup', 'method_signature': 'handleEvent(payload: OrderReadyForPickupEvent)', 'method_purpose': "Listens for the 'order.ready_for_pickup' event to begin the rider allocation process for the specified order.", 'integration_context': 'Triggered by the Order Management service when a vendor marks an order as ready.'}

#### 1.5.1.4 Integration Pattern

Event-Driven (Choreography)

#### 1.5.1.5 Communication Protocol

Asynchronous messaging via AWS SNS/SQS. The Logistics service subscribes to an SNS topic where order events are published.

#### 1.5.1.6 Extraction Reasoning

The logistics workflow is initiated by an 'OrderReadyForPickupEvent' published by the Order Management service. This decouples the services, enhancing resilience and scalability as per REQ-1-105.

### 1.5.2.0 Interface Name

#### 1.5.2.1 Interface Name

IRiderProfileAPI

#### 1.5.2.2 Source Repository

REPO-BE-IDENT

#### 1.5.2.3 Method Contracts

- {'method_name': 'getRiderPerformance', 'method_signature': 'GET /internal/riders/{riderId}/performance -> { averageRating: number, acceptanceRate: number }', 'method_purpose': "To fetch a rider's performance metrics, which are a critical input for the allocation algorithm.", 'integration_context': 'Called synchronously by the allocation service when scoring potential riders for a task.'}

#### 1.5.2.4 Integration Pattern

Synchronous Request/Response

#### 1.5.2.5 Communication Protocol

HTTPS/REST via the service mesh (AWS App Mesh). The response data should be aggressively cached locally to minimize latency.

#### 1.5.2.6 Extraction Reasoning

The allocation algorithm (REQ-1-078) requires rider performance data, which is owned by the Identity & Access service. This defines the synchronous internal API call needed to retrieve that data.

### 1.5.3.0 Interface Name

#### 1.5.3.1 Interface Name

IMapboxAPI

#### 1.5.3.2 Source Repository

External (Mapbox)

#### 1.5.3.3 Method Contracts

##### 1.5.3.3.1 Method Name

###### 1.5.3.3.1.1 Method Name

getOptimizedRoute

###### 1.5.3.3.1.2 Method Signature

getDirections(waypoints: Waypoint[]): Promise<Route>

###### 1.5.3.3.1.3 Method Purpose

To calculate an optimized, traffic-aware route for a single or multi-stop delivery.

###### 1.5.3.3.1.4 Integration Context

Called by the allocation service to determine ETA and distance for a task offer, as required by REQ-1-078.

##### 1.5.3.3.2.0 Method Name

###### 1.5.3.3.2.1 Method Name

getDistanceMatrix

###### 1.5.3.3.2.2 Method Signature

getMatrix(sources: Coordinate[], destinations: Coordinate[]): Promise<Matrix>

###### 1.5.3.3.2.3 Method Purpose

To efficiently calculate travel times and distances between multiple origins and destinations.

###### 1.5.3.3.2.4 Integration Context

Used by the allocation algorithm to score multiple riders based on their proximity to a vendor.

#### 1.5.3.4.0.0 Integration Pattern

External API Call

#### 1.5.3.5.0.0 Communication Protocol

HTTPS/REST. All calls must be wrapped in resilience patterns (circuit breaker, retries with exponential backoff) as per REQ-1-028.

#### 1.5.3.6.0.0 Extraction Reasoning

This is the critical external dependency for all routing and geospatial calculations as mandated by REQ-1-090 and REQ-1-078.

### 1.5.4.0.0.0 Interface Name

#### 1.5.4.1.0.0 Interface Name

ISharedLibraries

#### 1.5.4.2.0.0 Source Repository

REPO-LIB-CONTRACTS, REPO-LIB-OBSERVABILITY

#### 1.5.4.3.0.0 Method Contracts

- {'method_name': 'N/A', 'method_signature': 'N/A - Consumes DTOs, interfaces, and utility functions.', 'method_purpose': 'To ensure consistent data structures (contracts) and standardized logging/tracing (observability) across the microservices ecosystem.', 'integration_context': "These are compile-time dependencies imported into the service's codebase."}

#### 1.5.4.4.0.0 Integration Pattern

Library Dependency / Dependency Injection

#### 1.5.4.5.0.0 Communication Protocol

In-process function calls

#### 1.5.4.6.0.0 Extraction Reasoning

All backend services must depend on these shared libraries to maintain architectural consistency, type safety, and standardized observability as per the project's cross-cutting concerns strategy.

## 1.6.0.0.0.0 Exposed Interfaces

### 1.6.1.0.0.0 Interface Name

#### 1.6.1.1.0.0 Interface Name

ILogisticsAdminAPI

#### 1.6.1.2.0.0 Consumer Repositories

- REPO-FE-ADMIN

#### 1.6.1.3.0.0 Method Contracts

##### 1.6.1.3.1.0 Method Name

###### 1.6.1.3.1.1 Method Name

createZone

###### 1.6.1.3.1.2 Method Signature

POST /api/v1/logistics/zones (body: CreateZoneDTO)

###### 1.6.1.3.1.3 Method Purpose

Allows an administrator to create a new operational zone by providing a name and a GeoJSON polygon.

###### 1.6.1.3.1.4 Implementation Requirements

Endpoint must be protected by an RBAC guard for 'Administrator' role. Must perform geospatial validation on the polygon.

##### 1.6.1.3.2.0 Method Name

###### 1.6.1.3.2.1 Method Name

getZones

###### 1.6.1.3.2.2 Method Signature

GET /api/v1/logistics/zones

###### 1.6.1.3.2.3 Method Purpose

Retrieves a list of all defined operational zones.

###### 1.6.1.3.2.4 Implementation Requirements

Endpoint must be protected by an RBAC guard for 'Administrator' role.

##### 1.6.1.3.3.0 Method Name

###### 1.6.1.3.3.1 Method Name

updateZone

###### 1.6.1.3.3.2 Method Signature

PUT /api/v1/logistics/zones/{zoneId}

###### 1.6.1.3.3.3 Method Purpose

Allows an administrator to update the name, shape, or status of an existing operational zone.

###### 1.6.1.3.3.4 Implementation Requirements

Endpoint must be protected by an RBAC guard for 'Administrator' role.

#### 1.6.1.4.0.0 Service Level Requirements

- P95 latency for all CRUD operations must be < 200ms.

#### 1.6.1.5.0.0 Implementation Constraints

- All modifications to zones must be logged in the admin audit trail.

#### 1.6.1.6.0.0 Extraction Reasoning

This interface fulfills REQ-1-080 by providing the necessary API endpoints for the admin dashboard to manage geofenced operational zones, which is a core responsibility of the Logistics service.

### 1.6.2.0.0.0 Interface Name

#### 1.6.2.1.0.0 Interface Name

IRiderTaskAPI

#### 1.6.2.2.0.0 Consumer Repositories

- REPO-FE-RIDER

#### 1.6.2.3.0.0 Method Contracts

##### 1.6.2.3.1.0 Method Name

###### 1.6.2.3.1.1 Method Name

acceptTask

###### 1.6.2.3.1.2 Method Signature

POST /api/v1/tasks/{taskId}/accept

###### 1.6.2.3.1.3 Method Purpose

Allows a rider to accept a delivery task that has been offered to them.

###### 1.6.2.3.1.4 Implementation Requirements

Must be idempotent. Must perform authorization to ensure the rider was offered this specific task.

##### 1.6.2.3.2.0 Method Name

###### 1.6.2.3.2.1 Method Name

rejectTask

###### 1.6.2.3.2.2 Method Signature

POST /api/v1/tasks/{taskId}/reject

###### 1.6.2.3.2.3 Method Purpose

Allows a rider to reject a delivery task offer.

###### 1.6.2.3.2.4 Implementation Requirements

Must trigger the re-assignment saga.

##### 1.6.2.3.3.0 Method Name

###### 1.6.2.3.3.1 Method Name

updateTaskStatus

###### 1.6.2.3.3.2 Method Signature

PATCH /api/v1/tasks/{taskId}/status (body: { status: 'ARRIVED_AT_STORE' | 'PICKED_UP' | ... })

###### 1.6.2.3.3.3 Method Purpose

Allows a rider to update the status of their active delivery task sequentially.

###### 1.6.2.3.3.4 Implementation Requirements

Must validate the state transition is valid. Must publish a 'DeliveryStatusUpdated' event.

##### 1.6.2.3.4.0 Method Name

###### 1.6.2.3.4.1 Method Name

submitProofOfDelivery

###### 1.6.2.3.4.2 Method Signature

POST /api/v1/tasks/{taskId}/pod (body: { podType: 'PHOTO' | 'OTP', podData: string, location: GeoPoint })

###### 1.6.2.3.4.3 Method Purpose

Allows a rider to submit the required Proof of Delivery data.

###### 1.6.2.3.4.4 Implementation Requirements

Must validate the POD data and store it along with metadata (timestamp, location) as per REQ-1-075.

#### 1.6.2.4.0.0 Service Level Requirements

- P95 latency for all task updates must be < 200ms.

#### 1.6.2.5.0.0 Implementation Constraints

*No items available*

#### 1.6.2.6.0.0 Extraction Reasoning

This interface provides the necessary API endpoints for the rider mobile app to interact with the delivery lifecycle, fulfilling requirements like REQ-1-071 (accept/reject) and REQ-1-072 (status updates).

### 1.6.3.0.0.0 Interface Name

#### 1.6.3.1.0.0 Interface Name

IRealtimeLogisticsGateway

#### 1.6.3.2.0.0 Consumer Repositories

- REPO-FE-CUST
- REPO-FE-RIDER

#### 1.6.3.3.0.0 Method Contracts

##### 1.6.3.3.1.0 Method Name

###### 1.6.3.3.1.1 Method Name

handleConnection

###### 1.6.3.3.1.2 Method Signature

handleConnection(client: Socket)

###### 1.6.3.3.1.3 Method Purpose

Authenticates a new WebSocket connection from a client (Rider or Customer) using a JWT passed in the handshake.

###### 1.6.3.3.1.4 Implementation Requirements

Must validate the JWT and join the client to relevant rooms (e.g., a customer joins 'order:{orderId}', a rider joins 'rider:{riderId}').

##### 1.6.3.3.2.0 Method Name

###### 1.6.3.3.2.1 Method Name

handleUpdateLocation (Inbound)

###### 1.6.3.3.2.2 Method Signature

on('updateLocation', (payload: { lat: number, lng: number, accuracy: number, timestamp: ISODate }))

###### 1.6.3.3.2.3 Method Purpose

Receives high-frequency GPS location updates from the rider's device.

###### 1.6.3.3.2.4 Implementation Requirements

Upon receipt, must update the rider's location in the Redis GEO cache and then broadcast it to the appropriate customer's room.

##### 1.6.3.3.3.0 Method Name

###### 1.6.3.3.3.1 Method Name

emitNewTaskOffer (Outbound to Rider)

###### 1.6.3.3.3.2 Method Signature

emit('newTaskOffer', (payload: TaskOfferDTO))

###### 1.6.3.3.3.3 Method Purpose

Pushes a new delivery task offer to a specific rider in real-time.

###### 1.6.3.3.3.4 Implementation Requirements

The payload must contain all information required by REQ-1-071 (vendor/customer info, distance, earnings).

##### 1.6.3.3.4.0 Method Name

###### 1.6.3.3.4.1 Method Name

emitRiderLocationUpdate (Outbound to Customer)

###### 1.6.3.3.4.2 Method Signature

emit('riderLocationUpdate', (payload: { lat: number, lng: number }))

###### 1.6.3.3.4.3 Method Purpose

Broadcasts the rider's updated location to the customer of the active order.

###### 1.6.3.3.4.4 Implementation Requirements

Must be sent to a specific, order-scoped room to ensure data privacy.

#### 1.6.3.4.0.0 Service Level Requirements

- P95 end-to-end latency for location updates must be < 2 seconds (REQ-1-061).

#### 1.6.3.5.0.0 Implementation Constraints

- Communication must use Secure WebSockets (WSS).
- The gateway must use a Redis adapter to support horizontal scaling across multiple pods.

#### 1.6.3.6.0.0 Extraction Reasoning

This interface is the central contract for all real-time functionalities of the Logistics service, including live tracking (REQ-1-059) and task offers (REQ-1-071), which are core to its purpose.

### 1.6.4.0.0.0 Interface Name

#### 1.6.4.1.0.0 Interface Name

ILogisticsEventsPublisher

#### 1.6.4.2.0.0 Consumer Repositories

- REPO-BE-ORDER
- REPO-BE-NOTIF
- REPO-BE-PAYMT

#### 1.6.4.3.0.0 Method Contracts

##### 1.6.4.3.1.0 Method Name

###### 1.6.4.3.1.1 Method Name

publishRiderAssigned

###### 1.6.4.3.1.2 Method Signature

publish(event: RiderAssignedEvent { orderId, riderId, ... })

###### 1.6.4.3.1.3 Method Purpose

Notifies the system that a rider has been successfully assigned to an order.

###### 1.6.4.3.1.4 Implementation Requirements

Consumed by the Order service to update its state and the Notification service to alert the customer.

##### 1.6.4.3.2.0 Method Name

###### 1.6.4.3.2.1 Method Name

publishAllocationFailed

###### 1.6.4.3.2.2 Method Signature

publish(event: AllocationFailedEvent { orderId, reason, ... })

###### 1.6.4.3.2.3 Method Purpose

Notifies the system that the allocation process has failed for an order.

###### 1.6.4.3.2.4 Implementation Requirements

Consumed by the Order service to update its state to 'Allocation Failed' and by the Notification service to alert administrators.

##### 1.6.4.3.3.0 Method Name

###### 1.6.4.3.3.1 Method Name

publishDeliveryCompleted

###### 1.6.4.3.3.2 Method Signature

publish(event: DeliveryCompletedEvent { orderId, riderId, distance, deliveredAt, ... })

###### 1.6.4.3.3.3 Method Purpose

Notifies the system that a delivery has been successfully completed.

###### 1.6.4.3.3.4 Implementation Requirements

Consumed by the Payments service to trigger settlement calculations for the rider's earnings.

#### 1.6.4.4.0.0 Service Level Requirements

*No items available*

#### 1.6.4.5.0.0 Implementation Constraints

*No items available*

#### 1.6.4.6.0.0 Extraction Reasoning

This interface defines the asynchronous, event-driven contract that the Logistics service uses to communicate key state changes back to the rest of the microservices ecosystem, ensuring loose coupling as per REQ-1-105.

## 1.7.0.0.0.0 Technology Context

### 1.7.1.0.0.0 Framework Requirements

The service must be built using NestJS in TypeScript. It must leverage PostgreSQL with the PostGIS extension for persistent storage of geospatial data (like operational zones) and use Redis for caching high-frequency, ephemeral data (like live rider locations).

### 1.7.2.0.0.0 Integration Technologies

- PostgreSQL with PostGIS
- Redis
- Mapbox SDK
- AWS SQS/SNS (for event consumption)

### 1.7.3.0.0.0 Performance Constraints

The rider allocation algorithm must be highly optimized for speed and efficiency. Real-time location lookups from Redis must be extremely fast to support the allocation logic. The service must handle a high volume of location updates from many concurrent riders.

### 1.7.4.0.0.0 Security Requirements

Rider location data is considered sensitive Personally Identifiable Information (PII) and must be handled with strict security controls. Access to location data must be authorized based on the context of an active order. All communication must be over secure channels.

## 1.8.0.0.0.0 Extraction Validation

| Property | Value |
|----------|-------|
| Mapping Completeness Check | All specified requirements in the repository defin... |
| Cross Reference Validation | The dependency on the OrderReadyForPickupEvent fro... |
| Implementation Readiness Assessment | High. The repository definition provides a clear s... |
| Quality Assurance Confirmation | The extracted context is a direct, validated mappi... |

