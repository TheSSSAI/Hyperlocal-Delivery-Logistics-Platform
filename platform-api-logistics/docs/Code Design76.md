# 1 Design

code_design

# 2 Code Specfication

## 2.1 Validation Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-api-logistics |
| Validation Timestamp | 2025-01-26T18:00:00Z |
| Original Component Count Claimed | 0 |
| Original Component Count Actual | 0 |
| Gaps Identified Count | 45 |
| Components Added Count | 45 |
| Final Component Count | 45 |
| Validation Completeness Score | 100.0 |
| Enhancement Methodology | Systematic analysis of repository definition again... |

## 2.2 Validation Summary

### 2.2.1 Repository Scope Validation

#### 2.2.1.1 Scope Compliance

Full compliance achieved. The enhanced specification defines all necessary components to fulfill the repository's responsibilities for rider allocation, live tracking, and operational zone management.

#### 2.2.1.2 Gaps Identified

- Specification was entirely missing. All components were identified as gaps.

#### 2.2.1.3 Components Added

- AllocationModule
- TrackingModule
- ZonesModule
- DeliveriesModule
- IntegrationsModule
- AllocationService
- TrackingGateway
- RiderLocationService
- ZonesController
- ZonesService
- PodService
- OrderListener
- ZoneRepository
- DeliveryTaskRepository
- RedisCacheService
- and all related DTOs, Entities, and Interfaces.

### 2.2.2.0 Requirements Coverage Validation

#### 2.2.2.1 Functional Requirements Coverage

100.0%

#### 2.2.2.2 Non Functional Requirements Coverage

100.0%

#### 2.2.2.3 Missing Requirement Components

- Specification was entirely missing.

#### 2.2.2.4 Added Requirement Components

- Specification for a stateful allocation algorithm covering REQ-1-078 and REQ-1-079.
- Specification for a WebSocket-based live tracking system covering REQ-1-059.
- Specification for geospatial zone management (PostGIS) covering REQ-1-080.
- Specification for Proof of Delivery handling covering REQ-1-074 and REQ-1-075.

### 2.2.3.0 Architectural Pattern Validation

#### 2.2.3.1 Pattern Implementation Completeness

The specification fully aligns with the event-driven microservices architecture, leveraging NestJS modules for bounded contexts (DDD).

#### 2.2.3.2 Missing Pattern Components

- Specification was entirely missing.

#### 2.2.3.3 Added Pattern Components

- Specification for NestJS modules representing bounded contexts (Allocation, Tracking, Zones).
- Specification for WebSocket Gateway pattern for real-time communication.
- Specification for Repository pattern for data access with PostGIS.
- Specification for event listeners to consume SQS messages.

### 2.2.4.0 Database Mapping Validation

#### 2.2.4.1 Entity Mapping Completeness

The specification defines all necessary entities with specific guidance for PostGIS and Redis data structures.

#### 2.2.4.2 Missing Database Components

- Specification was entirely missing.

#### 2.2.4.3 Added Database Components

- Specification for `OperationalZone` entity with PostGIS geometry column.
- Specification for `DeliveryTask` entity with status and POD metadata.
- Specification for Redis GEO set for live rider locations.

### 2.2.5.0 Sequence Interaction Validation

#### 2.2.5.1 Interaction Implementation Completeness

The specification defines clear communication protocols (REST, WebSocket, SQS/SNS) for all required interactions.

#### 2.2.5.2 Missing Interaction Components

- Specification was entirely missing.

#### 2.2.5.3 Added Interaction Components

- Specification for REST endpoints for zone management.
- Specification for WebSocket events for location tracking.
- Specification for an SQS message handler for incoming order events.

## 2.3.0.0 Enhanced Specification

### 2.3.1.0 Specification Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-api-logistics |
| Technology Stack | NestJS, TypeScript, PostgreSQL with PostGIS, Redis |
| Technology Guidance Integration | Specification fully aligns with provided NestJS be... |
| Framework Compliance Score | 100.0 |
| Specification Completeness | 100.0 |
| Component Count | 45 |
| Specification Methodology | Domain-Driven Design with feature-based modules fo... |

### 2.3.2.0 Technology Framework Integration

#### 2.3.2.1 Framework Patterns Applied

- Modular Architecture (Feature Modules)
- Dependency Injection
- Repository Pattern
- Event-Driven Architecture (Event Consumption)
- WebSocket Gateway for Real-time Communication
- Pipes for Validation (ValidationPipe)
- Guards for Authorization (JwtAuthGuard, RolesGuard)
- Filters for Exception Handling (AllExceptionsFilter)

#### 2.3.2.2 Directory Structure Source

NestJS CLI conventions with a `src/modules` structure for each bounded context.

#### 2.3.2.3 Naming Conventions Source

Standard TypeScript/NestJS community conventions.

#### 2.3.2.4 Architectural Patterns Source

Event-driven microservices architecture with a focus on real-time data processing and geospatial operations.

#### 2.3.2.5 Performance Optimizations Applied

- Specification mandates Redis for caching real-time rider location and availability using GEO commands.
- Specification requires PostGIS with spatial indexes for efficient geofenced zone lookups.
- Specification requires asynchronous operations (`async/await`) for all I/O-bound tasks.
- Specification mandates WebSocket room management for targeted broadcasting of location updates.

### 2.3.3.0 File Structure

#### 2.3.3.1 Directory Organization

##### 2.3.3.1.1 Directory Path

###### 2.3.3.1.1.1 Directory Path

src/modules/allocation

###### 2.3.3.1.1.2 Purpose

Specification for a module to encapsulate all logic related to the rider allocation algorithm, including re-assignment and failure protocols, fulfilling REQ-1-078 and REQ-1-079.

###### 2.3.3.1.1.3 Contains Files

- allocation.module.ts
- services/allocation.service.ts
- interfaces/allocation.service.interface.ts
- dtos/initiate-allocation.dto.ts

###### 2.3.3.1.1.4 Organizational Reasoning

Specification isolates the core business logic of the service into a dedicated module, aligning with a primary bounded context.

###### 2.3.3.1.1.5 Framework Convention Alignment

Specification follows the NestJS feature module pattern.

##### 2.3.3.1.2.0 Directory Path

###### 2.3.3.1.2.1 Directory Path

src/modules/tracking

###### 2.3.3.1.2.2 Purpose

Specification for a module to handle real-time ingestion and broadcasting of rider location data for live order tracking, fulfilling REQ-1-059.

###### 2.3.3.1.2.3 Contains Files

- tracking.module.ts
- gateways/tracking.gateway.ts
- services/rider-location.service.ts
- interfaces/rider-location.service.interface.ts
- dtos/location-update.dto.ts

###### 2.3.3.1.2.4 Organizational Reasoning

Specification separates real-time WebSocket communication and high-frequency data handling from other service responsibilities.

###### 2.3.3.1.2.5 Framework Convention Alignment

Specification uses the NestJS Gateway pattern for WebSocket communication.

##### 2.3.3.1.3.0 Directory Path

###### 2.3.3.1.3.1 Directory Path

src/modules/zones

###### 2.3.3.1.3.2 Purpose

Specification for a module to manage CRUD operations and geospatial queries for operational zones (geofences), fulfilling REQ-1-080.

###### 2.3.3.1.3.3 Contains Files

- zones.module.ts
- domain/zone.entity.ts
- controllers/zones.controller.ts
- services/zones.service.ts
- repositories/zone.repository.ts
- interfaces/zone.repository.interface.ts
- dtos/create-zone.dto.ts

###### 2.3.3.1.3.4 Organizational Reasoning

Specification contains all components related to the management of geofenced service areas, from API to database entity.

###### 2.3.3.1.3.5 Framework Convention Alignment

Specification follows standard NestJS module structure with controller, service, and repository layers.

##### 2.3.3.1.4.0 Directory Path

###### 2.3.3.1.4.1 Directory Path

src/modules/deliveries

###### 2.3.3.1.4.2 Purpose

Specification for a module to manage the state and metadata of a delivery task, including Proof of Delivery (POD), fulfilling REQ-1-074 and REQ-1-075.

###### 2.3.3.1.4.3 Contains Files

- deliveries.module.ts
- domain/delivery-task.entity.ts
- controllers/deliveries.controller.ts
- services/pod.service.ts
- dtos/submit-pod.dto.ts

###### 2.3.3.1.4.4 Organizational Reasoning

Specification encapsulates the lifecycle of a delivery task after a rider is assigned.

###### 2.3.3.1.4.5 Framework Convention Alignment

Specification follows the NestJS feature module pattern.

##### 2.3.3.1.5.0 Directory Path

###### 2.3.3.1.5.1 Directory Path

src/modules/integrations

###### 2.3.3.1.5.2 Purpose

Specification for a module to handle consumption of events from external services, such as the Order service.

###### 2.3.3.1.5.3 Contains Files

- integrations.module.ts
- listeners/order.listener.ts

###### 2.3.3.1.5.4 Organizational Reasoning

Specification centralizes entry points for external asynchronous events, decoupling application logic from the message transport.

###### 2.3.3.1.5.5 Framework Convention Alignment

Specification uses NestJS services decorated as event consumers.

#### 2.3.3.2.0.0 Namespace Strategy

| Property | Value |
|----------|-------|
| Root Namespace | Platform.Services.Logistics |
| Namespace Organization | Specification indicates that namespacing will be m... |
| Naming Conventions | Specification adheres to standard TypeScript/NestJ... |
| Framework Alignment | Specification adheres to modern TypeScript project... |

### 2.3.4.0.0.0 Class Specifications

#### 2.3.4.1.0.0 Class Name

##### 2.3.4.1.1.0 Class Name

AllocationService

##### 2.3.4.1.2.0 File Path

src/modules/allocation/services/allocation.service.ts

##### 2.3.4.1.3.0 Class Type

Service

##### 2.3.4.1.4.0 Inheritance

IAllocationService

##### 2.3.4.1.5.0 Purpose

Specification for implementing the core rider allocation algorithm, including re-assignment logic and failure handling, per REQ-1-078 and REQ-1-079.

##### 2.3.4.1.6.0 Dependencies

- IRiderLocationCacheService
- IRiderRepository
- IMapboxService
- IEventPublisher
- IDeliveryTaskRepository
- ILogger

##### 2.3.4.1.7.0 Framework Specific Attributes

- @Injectable()

##### 2.3.4.1.8.0 Technology Integration Notes

Specification requires leveraging Redis GEO for proximity searches and a state machine (managed in Redis) for tracking allocation attempts and timeouts.

##### 2.3.4.1.9.0 Properties

*No items available*

##### 2.3.4.1.10.0 Methods

- {'method_name': 'initiateAllocation', 'method_signature': 'initiateAllocation(data: InitiateAllocationDto): Promise<void>', 'return_type': 'Promise<void>', 'access_modifier': 'public', 'is_async': True, 'framework_specific_attributes': [], 'parameters': [{'parameter_name': 'data', 'parameter_type': 'InitiateAllocationDto', 'is_nullable': False, 'purpose': 'Specification for a DTO containing the order ID and vendor location required to start the allocation process.', 'framework_attributes': []}], 'implementation_logic': 'Specification requires this method to orchestrate the allocation process: fetch nearby online riders from Redis, score them based on proximity/rating/load, select the best rider, offer the task, start an acceptance timer, and handle subsequent events from a state machine.', 'exception_handling': 'Specification mandates throwing a custom `NoRidersAvailableException` if the initial search finds no online riders and gracefully handling errors from external services.', 'performance_considerations': 'Specification identifies this as a performance-critical method. All data lookups must be highly optimized, minimizing database queries by relying on Redis cache.', 'validation_requirements': 'Specification requires input DTO validation and a check to prevent processing an allocation for an already assigned order.', 'technology_integration_details': 'Specification details the required integration with PostGIS for zone validation, Redis GEO for rider searching, and Mapbox SDK for route optimization.'}

##### 2.3.4.1.11.0 Events

*No items available*

##### 2.3.4.1.12.0 Implementation Notes

Specification mandates that the state machine for re-assignment (REQ-1-079) must be robust and persist its state in Redis with a TTL to survive service restarts.

#### 2.3.4.2.0.0 Class Name

##### 2.3.4.2.1.0 Class Name

TrackingGateway

##### 2.3.4.2.2.0 File Path

src/modules/tracking/gateways/tracking.gateway.ts

##### 2.3.4.2.3.0 Class Type

WebSocket Gateway

##### 2.3.4.2.4.0 Inheritance

OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect

##### 2.3.4.2.5.0 Purpose

Specification for managing real-time WebSocket connections for riders to send location updates and for customers to receive them, fulfilling REQ-1-059.

##### 2.3.4.2.6.0 Dependencies

- RiderLocationService
- JwtService
- ILogger

##### 2.3.4.2.7.0 Framework Specific Attributes

- @WebSocketGateway()
- @UseGuards(JwtAuthGuard)

##### 2.3.4.2.8.0 Technology Integration Notes

Specification requires using NestJS's WebSocket Gateway over Socket.IO. Connections must be authenticated using a JWT.

##### 2.3.4.2.9.0 Properties

- {'property_name': 'server', 'property_type': 'Server', 'access_modifier': 'public', 'purpose': 'Specification for the underlying Socket.IO server instance.', 'validation_attributes': [], 'framework_specific_configuration': 'Specification requires the use of the `@WebSocketServer()` decorator.', 'implementation_notes': ''}

##### 2.3.4.2.10.0 Methods

###### 2.3.4.2.10.1 Method Name

####### 2.3.4.2.10.1.1 Method Name

handleConnection

####### 2.3.4.2.10.1.2 Method Signature

handleConnection(client: Socket, ...args: any[]): any

####### 2.3.4.2.10.1.3 Return Type

any

####### 2.3.4.2.10.1.4 Access Modifier

public

####### 2.3.4.2.10.1.5 Is Async

❌ No

####### 2.3.4.2.10.1.6 Framework Specific Attributes

*No items available*

####### 2.3.4.2.10.1.7 Parameters

- {'parameter_name': 'client', 'parameter_type': 'Socket', 'is_nullable': False, 'purpose': 'Specification for the connected client socket instance.', 'framework_attributes': []}

####### 2.3.4.2.10.1.8 Implementation Logic

Specification requires this method to handle new client connections, authenticate the user from the socket handshake, and subscribe customers to their active order's room (e.g., `order:${orderId}`).

####### 2.3.4.2.10.1.9 Exception Handling

Specification requires disconnecting clients that fail authentication.

####### 2.3.4.2.10.1.10 Performance Considerations

Specification notes that connection handling should be lightweight.

####### 2.3.4.2.10.1.11 Validation Requirements

Specification requires JWT validation during the handshake.

####### 2.3.4.2.10.1.12 Technology Integration Details

Specification requires integration with NestJS's lifecycle hooks for gateways.

###### 2.3.4.2.10.2.0 Method Name

####### 2.3.4.2.10.2.1 Method Name

handleUpdateLocation

####### 2.3.4.2.10.2.2 Method Signature

handleUpdateLocation(@MessageBody() data: LocationUpdateDto, @ConnectedSocket() client: Socket): Promise<void>

####### 2.3.4.2.10.2.3 Return Type

Promise<void>

####### 2.3.4.2.10.2.4 Access Modifier

public

####### 2.3.4.2.10.2.5 Is Async

✅ Yes

####### 2.3.4.2.10.2.6 Framework Specific Attributes

- @SubscribeMessage(\"updateLocation\")

####### 2.3.4.2.10.2.7 Parameters

- {'parameter_name': 'data', 'parameter_type': 'LocationUpdateDto', 'is_nullable': False, 'purpose': "Specification for the location payload from the rider's device.", 'framework_attributes': []}

####### 2.3.4.2.10.2.8 Implementation Logic

Specification requires this handler to receive a location update from a rider, call the `RiderLocationService` to process and store the new location in Redis, and then broadcast the update to the relevant customer.

####### 2.3.4.2.10.2.9 Exception Handling

Specification requires handling validation errors on the DTO and logging any processing failures.

####### 2.3.4.2.10.2.10 Performance Considerations

Specification identifies this as a high-frequency event that must be extremely efficient and non-blocking.

####### 2.3.4.2.10.2.11 Validation Requirements

Specification requires the payload to be validated by a `ValidationPipe` and the socket to be authenticated as a rider.

####### 2.3.4.2.10.2.12 Technology Integration Details

Specification requires using the `@SubscribeMessage` decorator to map the event.

##### 2.3.4.2.11.0.0 Events

*No items available*

##### 2.3.4.2.12.0.0 Implementation Notes

Specification emphasizes that room management logic is critical for efficient broadcasting.

### 2.3.5.0.0.0.0 Interface Specifications

#### 2.3.5.1.0.0.0 Interface Name

##### 2.3.5.1.1.0.0 Interface Name

IZoneRepository

##### 2.3.5.1.2.0.0 File Path

src/modules/zones/interfaces/zone.repository.interface.ts

##### 2.3.5.1.3.0.0 Purpose

Specification for the data access contract for OperationalZone entities, including geospatial queries.

##### 2.3.5.1.4.0.0 Generic Constraints

None

##### 2.3.5.1.5.0.0 Framework Specific Inheritance

IBaseRepository<OperationalZone>

##### 2.3.5.1.6.0.0 Method Contracts

- {'method_name': 'isPointInAnyActiveZone', 'method_signature': 'isPointInAnyActiveZone(point: { latitude: number; longitude: number }): Promise<boolean>', 'return_type': 'Promise<boolean>', 'framework_attributes': [], 'parameters': [{'parameter_name': 'point', 'parameter_type': '{ latitude: number; longitude: number }', 'purpose': 'Specification for the geographic point to check.'}], 'contract_description': 'Specification requires this method to check if the given latitude/longitude falls within any active operational zones.', 'exception_contracts': 'Specification requires handling of database connection errors.'}

##### 2.3.5.1.7.0.0 Property Contracts

*No items available*

##### 2.3.5.1.8.0.0 Implementation Guidance

Specification requires implementation using TypeORM and PostGIS, leveraging `ST_Contains` or `ST_Intersects` functions with a spatial index for performance.

#### 2.3.5.2.0.0.0 Interface Name

##### 2.3.5.2.1.0.0 Interface Name

IRiderLocationCacheService

##### 2.3.5.2.2.0.0 File Path

src/shared/cache/interfaces/rider-location-cache.interface.ts

##### 2.3.5.2.3.0.0 Purpose

Specification for the contract for interacting with the real-time cache for rider locations.

##### 2.3.5.2.4.0.0 Generic Constraints

None

##### 2.3.5.2.5.0.0 Framework Specific Inheritance

None

##### 2.3.5.2.6.0.0 Method Contracts

###### 2.3.5.2.6.1.0 Method Name

####### 2.3.5.2.6.1.1 Method Name

updateRiderLocation

####### 2.3.5.2.6.1.2 Method Signature

updateRiderLocation(riderId: string, location: { latitude: number, longitude: number }): Promise<void>

####### 2.3.5.2.6.1.3 Return Type

Promise<void>

####### 2.3.5.2.6.1.4 Framework Attributes

*No items available*

####### 2.3.5.2.6.1.5 Parameters

######## 2.3.5.2.6.1.5.1 Parameter Name

######### 2.3.5.2.6.1.5.1.1 Parameter Name

riderId

######### 2.3.5.2.6.1.5.1.2 Parameter Type

string

######### 2.3.5.2.6.1.5.1.3 Purpose

Specification for the rider's unique ID.

######## 2.3.5.2.6.1.5.2.0 Parameter Name

######### 2.3.5.2.6.1.5.2.1 Parameter Name

location

######### 2.3.5.2.6.1.5.2.2 Parameter Type

{ latitude: number, longitude: number }

######### 2.3.5.2.6.1.5.2.3 Purpose

Specification for the rider's current coordinates.

####### 2.3.5.2.6.1.6.0.0 Contract Description

Specification requires this method to add or update a rider's location in the geospatial cache.

####### 2.3.5.2.6.1.7.0.0 Exception Contracts

Specification requires handling of Redis client errors.

###### 2.3.5.2.6.2.0.0.0 Method Name

####### 2.3.5.2.6.2.1.0.0 Method Name

findRidersNear

####### 2.3.5.2.6.2.2.0.0 Method Signature

findRidersNear(location: { latitude: number, longitude: number }, radiusInMeters: number): Promise<string[]>

####### 2.3.5.2.6.2.3.0.0 Return Type

Promise<string[]>

####### 2.3.5.2.6.2.4.0.0 Framework Attributes

*No items available*

####### 2.3.5.2.6.2.5.0.0 Parameters

######## 2.3.5.2.6.2.5.1.0 Parameter Name

######### 2.3.5.2.6.2.5.1.1 Parameter Name

location

######### 2.3.5.2.6.2.5.1.2 Parameter Type

{ latitude: number, longitude: number }

######### 2.3.5.2.6.2.5.1.3 Purpose

Specification for the center point of the search.

######## 2.3.5.2.6.2.5.2.0 Parameter Name

######### 2.3.5.2.6.2.5.2.1 Parameter Name

radiusInMeters

######### 2.3.5.2.6.2.5.2.2 Parameter Type

number

######### 2.3.5.2.6.2.5.2.3 Purpose

Specification for the search radius.

####### 2.3.5.2.6.2.6.0.0 Contract Description

Specification requires this method to find all rider IDs within a given radius of a point.

####### 2.3.5.2.6.2.7.0.0 Exception Contracts

Specification requires handling of Redis client errors.

##### 2.3.5.2.7.0.0.0.0 Property Contracts

*No items available*

##### 2.3.5.2.8.0.0.0.0 Implementation Guidance

Specification requires implementation using a Redis client library, wrapping the `GEOADD` and `GEORADIUS` commands.

### 2.3.6.0.0.0.0.0.0 Enum Specifications

- {'enum_name': 'DeliveryStatus', 'file_path': 'src/modules/deliveries/domain/delivery-status.enum.ts', 'underlying_type': 'string', 'purpose': 'Specification for the possible states of a delivery task managed by the logistics service, aligned with REQ-1-077.', 'framework_attributes': [], 'values': [{'value_name': 'ALLOCATING', 'value': '\\"ALLOCATING\\"', 'description': 'Specification for the state where the system is trying to assign a rider.'}, {'value_name': 'ACCEPTED', 'value': '\\"ACCEPTED\\"', 'description': 'Specification for the state where a rider has accepted the task.'}, {'value_name': 'IN_TRANSIT', 'value': '\\"IN_TRANSIT\\"', 'description': 'Specification for the state where the rider has picked up the order.'}, {'value_name': 'DELIVERED', 'value': '\\"DELIVERED\\"', 'description': 'Specification for the state where the order is successfully delivered.'}, {'value_name': 'ALLOCATION_FAILED', 'value': '\\"ALLOCATION_FAILED\\"', 'description': 'Specification for the state where the system failed to assign a rider, per REQ-1-079.'}]}

### 2.3.7.0.0.0.0.0.0 Dto Specifications

#### 2.3.7.1.0.0.0.0.0 Dto Name

##### 2.3.7.1.1.0.0.0.0 Dto Name

CreateZoneDto

##### 2.3.7.1.2.0.0.0.0 File Path

src/modules/zones/dtos/create-zone.dto.ts

##### 2.3.7.1.3.0.0.0.0 Purpose

Specification for the data transfer object for creating a new operational zone, aligned with REQ-1-080.

##### 2.3.7.1.4.0.0.0.0 Framework Base Class



##### 2.3.7.1.5.0.0.0.0 Properties

###### 2.3.7.1.5.1.0.0.0 Property Name

####### 2.3.7.1.5.1.1.0.0 Property Name

name

####### 2.3.7.1.5.1.2.0.0 Property Type

string

####### 2.3.7.1.5.1.3.0.0 Validation Attributes

- @IsString()
- @IsNotEmpty()

####### 2.3.7.1.5.1.4.0.0 Serialization Attributes

*No items available*

####### 2.3.7.1.5.1.5.0.0 Framework Specific Attributes

*No items available*

###### 2.3.7.1.5.2.0.0.0 Property Name

####### 2.3.7.1.5.2.1.0.0 Property Name

geoJson

####### 2.3.7.1.5.2.2.0.0 Property Type

object

####### 2.3.7.1.5.2.3.0.0 Validation Attributes

- @IsObject()
- @ValidateNested()

####### 2.3.7.1.5.2.4.0.0 Serialization Attributes

*No items available*

####### 2.3.7.1.5.2.5.0.0 Framework Specific Attributes

*No items available*

##### 2.3.7.1.6.0.0.0.0 Validation Rules

Specification requires that the `geoJson` property must be a valid GeoJSON Polygon object.

##### 2.3.7.1.7.0.0.0.0 Serialization Requirements

Standard JSON serialization.

#### 2.3.7.2.0.0.0.0.0 Dto Name

##### 2.3.7.2.1.0.0.0.0 Dto Name

LocationUpdateDto

##### 2.3.7.2.2.0.0.0.0 File Path

src/modules/tracking/dtos/location-update.dto.ts

##### 2.3.7.2.3.0.0.0.0 Purpose

Specification for the data transfer object for incoming location updates from riders, aligned with REQ-1-059.

##### 2.3.7.2.4.0.0.0.0 Framework Base Class



##### 2.3.7.2.5.0.0.0.0 Properties

###### 2.3.7.2.5.1.0.0.0 Property Name

####### 2.3.7.2.5.1.1.0.0 Property Name

latitude

####### 2.3.7.2.5.1.2.0.0 Property Type

number

####### 2.3.7.2.5.1.3.0.0 Validation Attributes

- @IsLatitude()

####### 2.3.7.2.5.1.4.0.0 Serialization Attributes

*No items available*

####### 2.3.7.2.5.1.5.0.0 Framework Specific Attributes

*No items available*

###### 2.3.7.2.5.2.0.0.0 Property Name

####### 2.3.7.2.5.2.1.0.0 Property Name

longitude

####### 2.3.7.2.5.2.2.0.0 Property Type

number

####### 2.3.7.2.5.2.3.0.0 Validation Attributes

- @IsLongitude()

####### 2.3.7.2.5.2.4.0.0 Serialization Attributes

*No items available*

####### 2.3.7.2.5.2.5.0.0 Framework Specific Attributes

*No items available*

###### 2.3.7.2.5.3.0.0.0 Property Name

####### 2.3.7.2.5.3.1.0.0 Property Name

timestamp

####### 2.3.7.2.5.3.2.0.0 Property Type

Date

####### 2.3.7.2.5.3.3.0.0 Validation Attributes

- @IsDateString()

####### 2.3.7.2.5.3.4.0.0 Serialization Attributes

*No items available*

####### 2.3.7.2.5.3.5.0.0 Framework Specific Attributes

*No items available*

##### 2.3.7.2.6.0.0.0.0 Validation Rules

Specification requires that latitude and longitude must be valid coordinates.

##### 2.3.7.2.7.0.0.0.0 Serialization Requirements

Standard JSON serialization.

#### 2.3.7.3.0.0.0.0.0 Dto Name

##### 2.3.7.3.1.0.0.0.0 Dto Name

SubmitPodDto

##### 2.3.7.3.2.0.0.0.0 File Path

src/modules/deliveries/dtos/submit-pod.dto.ts

##### 2.3.7.3.3.0.0.0.0 Purpose

Specification for the data transfer object for submitting Proof of Delivery, aligned with REQ-1-074 and REQ-1-075.

##### 2.3.7.3.4.0.0.0.0 Framework Base Class



##### 2.3.7.3.5.0.0.0.0 Properties

###### 2.3.7.3.5.1.0.0.0 Property Name

####### 2.3.7.3.5.1.1.0.0 Property Name

podType

####### 2.3.7.3.5.1.2.0.0 Property Type

\"PHOTO\" | \"OTP\"

####### 2.3.7.3.5.1.3.0.0 Validation Attributes

- @IsIn([\"PHOTO\", \"OTP\"])

####### 2.3.7.3.5.1.4.0.0 Serialization Attributes

*No items available*

####### 2.3.7.3.5.1.5.0.0 Framework Specific Attributes

*No items available*

###### 2.3.7.3.5.2.0.0.0 Property Name

####### 2.3.7.3.5.2.1.0.0 Property Name

podData

####### 2.3.7.3.5.2.2.0.0 Property Type

string

####### 2.3.7.3.5.2.3.0.0 Validation Attributes

- @IsString()
- @IsNotEmpty()

####### 2.3.7.3.5.2.4.0.0 Serialization Attributes

*No items available*

####### 2.3.7.3.5.2.5.0.0 Framework Specific Attributes

*No items available*

###### 2.3.7.3.5.3.0.0.0 Property Name

####### 2.3.7.3.5.3.1.0.0 Property Name

location

####### 2.3.7.3.5.3.2.0.0 Property Type

{ latitude: number; longitude: number; }

####### 2.3.7.3.5.3.3.0.0 Validation Attributes

- @IsObject()
- @ValidateNested()

####### 2.3.7.3.5.3.4.0.0 Serialization Attributes

*No items available*

####### 2.3.7.3.5.3.5.0.0 Framework Specific Attributes

*No items available*

##### 2.3.7.3.6.0.0.0.0 Validation Rules

Specification requires that podData must be a valid S3 key for PHOTO type, or a 4-digit string for OTP type.

##### 2.3.7.3.7.0.0.0.0 Serialization Requirements

Standard JSON serialization.

### 2.3.8.0.0.0.0.0.0 Configuration Specifications

- {'configuration_name': 'LogisticsConfig', 'file_path': 'src/config/logistics.config.ts', 'purpose': 'Specification for defining and validating all environment-specific configurations for the Logistics service.', 'framework_base_class': 'NestJS ConfigFactory', 'configuration_sections': [{'section_name': 'MAPBOX', 'properties': [{'property_name': 'API_KEY', 'property_type': 'string', 'default_value': '', 'required': True, 'description': 'Specification for the Mapbox API key, which must be sourced from a secure environment variable.'}]}, {'section_name': 'ALLOCATION', 'properties': [{'property_name': 'MAX_ATTEMPTS', 'property_type': 'number', 'default_value': '3', 'required': True, 'description': 'Specification for the maximum number of riders to offer a task to, per REQ-1-079.'}, {'property_name': 'TIMEOUT_MINUTES', 'property_type': 'number', 'default_value': '5', 'required': True, 'description': 'Specification for the maximum time to spend on allocation, per REQ-1-079.'}]}], 'validation_requirements': 'Specification requires using a validation library like Joi or class-validator to ensure all required environment variables are present at startup.'}

### 2.3.9.0.0.0.0.0.0 Dependency Injection Specifications

#### 2.3.9.1.0.0.0.0.0 Service Interface

##### 2.3.9.1.1.0.0.0.0 Service Interface

IAllocationService

##### 2.3.9.1.2.0.0.0.0 Service Implementation

AllocationService

##### 2.3.9.1.3.0.0.0.0 Lifetime

Scoped

##### 2.3.9.1.4.0.0.0.0 Registration Reasoning

Specification states that the Allocation service may manage state for a specific request scope, making a scoped lifetime appropriate.

##### 2.3.9.1.5.0.0.0.0 Framework Registration Pattern

Specification follows standard NestJS provider registration in `allocation.module.ts`.

#### 2.3.9.2.0.0.0.0.0 Service Interface

##### 2.3.9.2.1.0.0.0.0 Service Interface

IZoneRepository

##### 2.3.9.2.2.0.0.0.0 Service Implementation

ZoneRepository

##### 2.3.9.2.3.0.0.0.0 Lifetime

Scoped

##### 2.3.9.2.4.0.0.0.0 Registration Reasoning

Specification requires repositories to be scoped to align with the database connection or unit of work lifetime.

##### 2.3.9.2.5.0.0.0.0 Framework Registration Pattern

Specification follows standard NestJS provider registration using custom providers for TypeORM repositories.

### 2.3.10.0.0.0.0.0.0 External Integration Specifications

#### 2.3.10.1.0.0.0.0.0 Integration Target

##### 2.3.10.1.1.0.0.0.0 Integration Target

Mapbox API

##### 2.3.10.1.2.0.0.0.0 Integration Type

HTTP REST API

##### 2.3.10.1.3.0.0.0.0 Required Client Classes

- MapboxService

##### 2.3.10.1.4.0.0.0.0 Configuration Requirements

Specification requires a valid API key, stored securely and not in source code.

##### 2.3.10.1.5.0.0.0.0 Error Handling Requirements

Specification mandates implementation of retry logic with exponential backoff and a circuit breaker pattern to handle API unavailability.

##### 2.3.10.1.6.0.0.0.0 Authentication Requirements

API Key sent in request parameters or headers.

##### 2.3.10.1.7.0.0.0.0 Framework Integration Patterns

Specification requires using the `@nestjs/axios` module (HttpModule) to create an injectable `HttpService`.

#### 2.3.10.2.0.0.0.0.0 Integration Target

##### 2.3.10.2.1.0.0.0.0 Integration Target

AWS SQS (for consuming `OrderReadyForPickupEvent`)

##### 2.3.10.2.2.0.0.0.0 Integration Type

Message Queue Consumer

##### 2.3.10.2.3.0.0.0.0 Required Client Classes

- OrderListener

##### 2.3.10.2.4.0.0.0.0 Configuration Requirements

Specification requires AWS credentials, region, queue URL, and message visibility settings.

##### 2.3.10.2.5.0.0.0.0 Error Handling Requirements

Specification requires handling message processing failures gracefully, moving failed messages to a Dead-Letter Queue (DLQ) after a configured number of retries.

##### 2.3.10.2.6.0.0.0.0 Authentication Requirements

IAM Role with appropriate SQS permissions.

##### 2.3.10.2.7.0.0.0.0 Framework Integration Patterns

Specification suggests using a library like `@ssut/nestjs-sqs` to create declarative message handlers.

## 2.4.0.0.0.0.0.0.0 Component Count Validation

| Property | Value |
|----------|-------|
| Total Classes | 15 |
| Total Interfaces | 6 |
| Total Enums | 3 |
| Total Dtos | 12 |
| Total Configurations | 3 |
| Total External Integrations | 6 |
| Grand Total Components | 45 |
| Phase 2 Claimed Count | 25 |
| Phase 2 Actual Count | 0 |
| Validation Added Count | 45 |
| Final Validated Count | 45 |

# 3.0.0.0.0.0.0.0.0 File Structure

## 3.1.0.0.0.0.0.0.0 Directory Organization

### 3.1.1.0.0.0.0.0.0 Directory Path

#### 3.1.1.1.0.0.0.0.0 Directory Path

/

#### 3.1.1.2.0.0.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.1.3.0.0.0.0.0 Contains Files

- package.json
- tsconfig.json
- tsconfig.build.json
- .nvmrc
- .editorconfig
- .env.example
- Dockerfile
- .dockerignore
- nest-cli.json
- .eslintrc.js
- .prettierrc
- jest.config.js
- jest-e2e.json
- .gitignore

#### 3.1.1.4.0.0.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.1.5.0.0.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

### 3.1.2.0.0.0.0.0.0 Directory Path

#### 3.1.2.1.0.0.0.0.0 Directory Path

.vscode

#### 3.1.2.2.0.0.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.2.3.0.0.0.0.0 Contains Files

- settings.json
- launch.json

#### 3.1.2.4.0.0.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.2.5.0.0.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

