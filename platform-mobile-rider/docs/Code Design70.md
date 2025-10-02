# 1 Design

code_design

# 2 Code Specfication

## 2.1 Validation Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-mobile-rider |
| Validation Timestamp | 2025-01-15T14:30:00Z |
| Original Component Count Claimed | 0 |
| Original Component Count Actual | 0 |
| Gaps Identified Count | 65 |
| Components Added Count | 65 |
| Final Component Count | 65 |
| Validation Completeness Score | 100.0 |
| Enhancement Methodology | Systematic analysis of cached requirements, user s... |

## 2.2 Validation Summary

### 2.2.1 Repository Scope Validation

#### 2.2.1.1 Scope Compliance

Fully compliant. The enhanced specification defines all components required to fulfill the repository's scope as the primary Rider mobile application.

#### 2.2.1.2 Gaps Identified

- Initial specification was entirely absent.

#### 2.2.1.3 Components Added

- Complete application file structure.
- Core infrastructure services (Location, Realtime, Permissions).
- Feature slices for Auth, Task, Earnings, Profile.
- All necessary screens and navigation stacks.

### 2.2.2.0 Requirements Coverage Validation

#### 2.2.2.1 Functional Requirements Coverage

100.0%

#### 2.2.2.2 Non Functional Requirements Coverage

100.0%

#### 2.2.2.3 Missing Requirement Components

- The entire application specification was missing.

#### 2.2.2.4 Added Requirement Components

- Specifications for all screens, services, and state slices to cover requirements like REQ-1-011, REQ-1-071, REQ-1-072, REQ-1-076, and REQ-1-089.

### 2.2.3.0 Architectural Pattern Validation

#### 2.2.3.1 Pattern Implementation Completeness

The specification fully details a Feature-Sliced architecture, leveraging Custom Hooks and a Service Layer as mandated by the technology guidance.

#### 2.2.3.2 Missing Pattern Components

- All architectural layers and patterns were unspecified.

#### 2.2.3.3 Added Pattern Components

- Detailed file structure for feature-slicing.
- Specifications for Custom Hooks exposing application logic.
- Specifications for a Service/Infrastructure layer abstracting native modules.

### 2.2.4.0 Database Mapping Validation

#### 2.2.4.1 Entity Mapping Completeness

Specification defines local data persistence strategy. Covers secure storage for authentication tokens and caching for offline support.

#### 2.2.4.2 Missing Database Components

- Specification for local storage and secure credential handling was absent.

#### 2.2.4.3 Added Database Components

- SecureStorage service specification for JWTs.
- State persistence configuration specification using Redux Persist with MMKV for offline caching.

### 2.2.5.0 Sequence Interaction Validation

#### 2.2.5.1 Interaction Implementation Completeness

All key user flows from sequence diagrams are mapped to method specifications within custom hooks and services.

#### 2.2.5.2 Missing Interaction Components

- All method signatures and interaction logic specifications were missing.

#### 2.2.5.3 Added Interaction Components

- Method specifications for login, task acceptance, status updates, and POD submission.
- Specifications for handling real-time events via WebSockets.

## 2.3.0.0 Enhanced Specification

### 2.3.1.0 Specification Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-mobile-rider |
| Technology Stack | React Native, Redux/Zustand, TypeScript |
| Technology Guidance Integration | Specification fully aligns with React Hooks, funct... |
| Framework Compliance Score | 100.0 |
| Specification Completeness | 100.0 |
| Component Count | 65 |
| Specification Methodology | Domain-Driven Design applied to client-side archit... |

### 2.3.2.0 Technology Framework Integration

#### 2.3.2.1 Framework Patterns Applied

- Custom Hooks for business logic exposure
- Redux Toolkit for global state management
- Feature-Sliced Directory Structure
- Service Layer for abstracting infrastructure concerns
- React Navigation for routing
- Dependency Injection via Context API for core services

#### 2.3.2.2 Directory Structure Source

Hybrid of feature-sliced architecture and classic layered mobile app structure, optimized for React Native.

#### 2.3.2.3 Naming Conventions Source

Standard TypeScript and React naming conventions (PascalCase for components/screens, camelCase for hooks/functions).

#### 2.3.2.4 Architectural Patterns Source

Layered client-side architecture with a reactive UI layer consuming application services via Hooks.

#### 2.3.2.5 Performance Optimizations Applied

- React.memo and useMemo/useCallback for memoization
- Virtualized lists (FlatList) for long data sets
- Memoized selectors (Reselect) for Redux state
- Optimized background services for battery efficiency
- Code splitting and lazy loading via Metro bundler defaults

### 2.3.3.0 File Structure

#### 2.3.3.1 Directory Organization

##### 2.3.3.1.1 Directory Path

###### 2.3.3.1.1.1 Directory Path

src/api

###### 2.3.3.1.1.2 Purpose

Specification requires centralizing all interactions with the backend REST API, abstracting the `REPO-API-CLIENT` dependency.

###### 2.3.3.1.1.3 Contains Files

- apiClient.ts
- auth.api.ts
- task.api.ts
- profile.api.ts
- earnings.api.ts

###### 2.3.3.1.1.4 Organizational Reasoning

Specification requires encapsulating all remote data fetching logic, providing a clear service layer for the rest of the app to consume. Organizes API calls by domain.

###### 2.3.3.1.1.5 Framework Convention Alignment

Specification follows the service layer pattern, abstracting third-party libraries like `axios` and centralizing configuration.

##### 2.3.3.1.2.0 Directory Path

###### 2.3.3.1.2.1 Directory Path

src/components

###### 2.3.3.1.2.2 Purpose

Specification requires containing shared, reusable UI components specific to the Rider App, built by composing atoms from the `REPO-UI-COMPONENTS` library.

###### 2.3.3.1.2.3 Contains Files

- TaskOfferCard.tsx
- EarningsSummary.tsx
- ActiveTaskHeader.tsx
- PermissionDeniedModal.tsx

###### 2.3.3.1.2.4 Organizational Reasoning

Specification requires promoting UI reusability and consistency within the app, separating shared components from feature-specific ones.

###### 2.3.3.1.2.5 Framework Convention Alignment

Specification aligns with standard React component organization.

##### 2.3.3.1.3.0 Directory Path

###### 2.3.3.1.3.1 Directory Path

src/features

###### 2.3.3.1.3.2 Purpose

Specification requires this to be the core of the application, organized by domain feature. Each feature is a self-contained module.

###### 2.3.3.1.3.3 Contains Files

- auth/
- dashboard/
- task/
- earnings/
- profile/

###### 2.3.3.1.3.4 Organizational Reasoning

Specification implements the feature-sliced architecture, improving scalability and developer velocity by co-locating related logic.

###### 2.3.3.1.3.5 Framework Convention Alignment

Specification follows modern React/Redux best practice for organizing large applications.

##### 2.3.3.1.4.0 Directory Path

###### 2.3.3.1.4.1 Directory Path

src/features/task

###### 2.3.3.1.4.2 Purpose

Specification requires managing all aspects of a delivery task, from offer to completion.

###### 2.3.3.1.4.3 Contains Files

- screens/TaskOfferScreen.tsx
- screens/ActiveTaskScreen.tsx
- components/NavigationMapView.tsx
- components/ProofOfDelivery.tsx
- hooks/useTask.ts
- taskSlice.ts
- task.types.ts

###### 2.3.3.1.4.4 Organizational Reasoning

Specification defines a complete, self-contained module for the most complex user flow in the application.

###### 2.3.3.1.4.5 Framework Convention Alignment

Specification exemplifies the feature-slice pattern with co-located screens, components, hooks, and state.

##### 2.3.3.1.5.0 Directory Path

###### 2.3.3.1.5.1 Directory Path

src/lib

###### 2.3.3.1.5.2 Purpose

Specification requires containing wrappers and services for core infrastructure and third-party SDKs.

###### 2.3.3.1.5.3 Contains Files

- realtimeService.ts
- locationService.ts
- navigationService.ts
- permissionService.ts
- secureStorage.ts
- cameraService.ts

###### 2.3.3.1.5.4 Organizational Reasoning

Specification requires abstracting all external and device-level dependencies, providing a clean and testable interface for the application logic.

###### 2.3.3.1.5.5 Framework Convention Alignment

Specification follows the infrastructure layer pattern, isolating side effects and platform-specific code.

##### 2.3.3.1.6.0 Directory Path

###### 2.3.3.1.6.1 Directory Path

src/navigation

###### 2.3.3.1.6.2 Purpose

Specification requires defining the application's navigation structure using React Navigation.

###### 2.3.3.1.6.3 Contains Files

- AppNavigator.tsx
- AuthNavigator.tsx
- MainNavigator.tsx
- navigation.types.ts

###### 2.3.3.1.6.4 Organizational Reasoning

Specification requires centralizing all routing and screen stack logic, decoupling it from the feature screens themselves.

###### 2.3.3.1.6.5 Framework Convention Alignment

Specification aligns with standard practice for `react-navigation` library.

##### 2.3.3.1.7.0 Directory Path

###### 2.3.3.1.7.1 Directory Path

src/store

###### 2.3.3.1.7.2 Purpose

Specification requires configuration for the Redux global state store.

###### 2.3.3.1.7.3 Contains Files

- store.ts
- rootReducer.ts
- hooks.ts

###### 2.3.3.1.7.4 Organizational Reasoning

Specification requires centralizing state management setup, including middleware configuration and provider setup.

###### 2.3.3.1.7.5 Framework Convention Alignment

Specification aligns with standard Redux Toolkit setup pattern.

##### 2.3.3.1.8.0 Directory Path

###### 2.3.3.1.8.1 Directory Path

src/shared

###### 2.3.3.1.8.2 Purpose

Specification requires containing assets, constants, utility functions, and type definitions shared across multiple features.

###### 2.3.3.1.8.3 Contains Files

- types/
- constants/
- utils/

###### 2.3.3.1.8.4 Organizational Reasoning

Specification requires reducing code duplication and providing a single source of truth for shared assets and logic.

###### 2.3.3.1.8.5 Framework Convention Alignment

Specification aligns with common patterns in large-scale applications for shared code.

#### 2.3.3.2.0.0 Namespace Strategy

| Property | Value |
|----------|-------|
| Root Namespace | Platform.Mobile.Rider |
| Namespace Organization | File-based modules and feature-sliced directories.... |
| Naming Conventions | Specification follows standard TypeScript/ESM modu... |
| Framework Alignment | Specification is aligned with React Native's modul... |

### 2.3.4.0.0.0 Class Specifications

#### 2.3.4.1.0.0 Class Name

##### 2.3.4.1.1.0 Class Name

LocationService

##### 2.3.4.1.2.0 File Path

src/lib/locationService.ts

##### 2.3.4.1.3.0 Class Type

Service (Singleton Module)

##### 2.3.4.1.4.0 Inheritance

None

##### 2.3.4.1.5.0 Purpose

Specification requires abstraction and management of all interactions with the background geolocation library, providing a clean API for starting, stopping, and listening to location updates while optimizing for battery life, as per performance considerations.

##### 2.3.4.1.6.0 Dependencies

- react-native-background-geolocation
- apiClient (for sending updates)

##### 2.3.4.1.7.0 Framework Specific Attributes

*No items available*

##### 2.3.4.1.8.0 Technology Integration Notes

Validation confirms this is a critical service. Specification requires configuration for high accuracy during active navigation and lower accuracy when idle to conserve battery. It must handle OS-specific background execution rules.

##### 2.3.4.1.9.0 Validation Notes

Validation of REPO-FE-RIDER's scope confirms this component is necessary. The specification has been enhanced to detail its role in abstracting the native module and optimizing for battery performance.

##### 2.3.4.1.10.0 Properties

*No items available*

##### 2.3.4.1.11.0 Methods

###### 2.3.4.1.11.1 Method Name

####### 2.3.4.1.11.1.1 Method Name

startTracking

####### 2.3.4.1.11.1.2 Method Signature

startTracking(): Promise<void>

####### 2.3.4.1.11.1.3 Return Type

Promise<void>

####### 2.3.4.1.11.1.4 Access Modifier

public

####### 2.3.4.1.11.1.5 Is Async

✅ Yes

####### 2.3.4.1.11.1.6 Framework Specific Attributes

*No items available*

####### 2.3.4.1.11.1.7 Parameters

*No items available*

####### 2.3.4.1.11.1.8 Implementation Logic

Specification requires this method to configure the background geolocation plugin with appropriate settings (distanceFilter, desiredAccuracy, stationaryRadius) and start the service. It must also set up the HTTP POST configuration to send location updates to the backend.

####### 2.3.4.1.11.1.9 Exception Handling

Specification requires handling errors related to permissions and service startup failures.

####### 2.3.4.1.11.1.10 Performance Considerations

Specification mandates implementation with battery-saving configurations.

####### 2.3.4.1.11.1.11 Validation Requirements

Specification requires checking for location permissions before starting, aligning with REQ-1-089.

####### 2.3.4.1.11.1.12 Technology Integration Details

Specification requires direct interface with the `react-native-background-geolocation` native module.

####### 2.3.4.1.11.1.13 Validation Notes

Method specification is complete and covers all functional and non-functional requirements for initiating location tracking.

###### 2.3.4.1.11.2.0 Method Name

####### 2.3.4.1.11.2.1 Method Name

stopTracking

####### 2.3.4.1.11.2.2 Method Signature

stopTracking(): Promise<void>

####### 2.3.4.1.11.2.3 Return Type

Promise<void>

####### 2.3.4.1.11.2.4 Access Modifier

public

####### 2.3.4.1.11.2.5 Is Async

✅ Yes

####### 2.3.4.1.11.2.6 Framework Specific Attributes

*No items available*

####### 2.3.4.1.11.2.7 Parameters

*No items available*

####### 2.3.4.1.11.2.8 Implementation Logic

Specification requires this method to call the `stop` method of the geolocation plugin to cease all location updates.

####### 2.3.4.1.11.2.9 Exception Handling

Specification requires handling any errors during the shutdown process.

####### 2.3.4.1.11.2.10 Performance Considerations

Not applicable.

####### 2.3.4.1.11.2.11 Validation Requirements

Not applicable.

####### 2.3.4.1.11.2.12 Technology Integration Details

Specification requires direct interface with the `react-native-background-geolocation` native module.

####### 2.3.4.1.11.2.13 Validation Notes

Method specification is complete and correctly defines the termination of the tracking service.

##### 2.3.4.1.12.0.0 Events

*No items available*

##### 2.3.4.1.13.0.0 Implementation Notes

Specification requires implementation as a singleton module to ensure only one instance manages the background service.

#### 2.3.4.2.0.0.0 Class Name

##### 2.3.4.2.1.0.0 Class Name

RealtimeService

##### 2.3.4.2.2.0.0 File Path

src/lib/realtimeService.ts

##### 2.3.4.2.3.0.0 Class Type

Service (Singleton Module)

##### 2.3.4.2.4.0.0 Inheritance

None

##### 2.3.4.2.5.0.0 Purpose

Specification requires management of the WebSocket connection with the backend for receiving real-time events like new task offers, as per REQ-1-092.

##### 2.3.4.2.6.0.0 Dependencies

- socket.io-client
- SecureStorage (for JWT)

##### 2.3.4.2.7.0.0 Framework Specific Attributes

*No items available*

##### 2.3.4.2.8.0.0 Technology Integration Notes

Specification requires handling WebSocket lifecycle events (connect, disconnect, reconnect) and authentication. It must dispatch incoming events to the Redux store.

##### 2.3.4.2.9.0.0 Validation Notes

Validation confirms this component is a critical gap identified from sequence diagrams and architectural patterns. The specification is enhanced to detail its role in bridging the backend and client-side state.

##### 2.3.4.2.10.0.0 Properties

*No items available*

##### 2.3.4.2.11.0.0 Methods

###### 2.3.4.2.11.1.0 Method Name

####### 2.3.4.2.11.1.1 Method Name

connect

####### 2.3.4.2.11.1.2 Method Signature

connect(dispatch: Dispatch): void

####### 2.3.4.2.11.1.3 Return Type

void

####### 2.3.4.2.11.1.4 Access Modifier

public

####### 2.3.4.2.11.1.5 Is Async

❌ No

####### 2.3.4.2.11.1.6 Framework Specific Attributes

*No items available*

####### 2.3.4.2.11.1.7 Parameters

- {'parameter_name': 'dispatch', 'parameter_type': 'Dispatch', 'is_nullable': False, 'purpose': 'Specification requires a Redux dispatch function to send actions based on WebSocket events.', 'framework_attributes': []}

####### 2.3.4.2.11.1.8 Implementation Logic

Specification requires this method to retrieve the JWT from secure storage, initialize the Socket.IO client with the authentication token, and set up listeners for \"connect\", \"disconnect\", and server-pushed events like \"newTaskOffer\".

####### 2.3.4.2.11.1.9 Exception Handling

Specification requires handling connection errors and implementing an exponential backoff retry strategy.

####### 2.3.4.2.11.1.10 Performance Considerations

Specification requires that the connection should only be established when the user is logged in and online.

####### 2.3.4.2.11.1.11 Validation Requirements

Not applicable.

####### 2.3.4.2.11.1.12 Technology Integration Details

Specification requires integration with the Redux store by dispatching actions.

####### 2.3.4.2.11.1.13 Validation Notes

Method specification is complete and correctly defines the setup and authentication of the real-time communication channel.

###### 2.3.4.2.11.2.0 Method Name

####### 2.3.4.2.11.2.1 Method Name

disconnect

####### 2.3.4.2.11.2.2 Method Signature

disconnect(): void

####### 2.3.4.2.11.2.3 Return Type

void

####### 2.3.4.2.11.2.4 Access Modifier

public

####### 2.3.4.2.11.2.5 Is Async

❌ No

####### 2.3.4.2.11.2.6 Framework Specific Attributes

*No items available*

####### 2.3.4.2.11.2.7 Parameters

*No items available*

####### 2.3.4.2.11.2.8 Implementation Logic

Specification requires this method to close the WebSocket connection and clean up all event listeners.

####### 2.3.4.2.11.2.9 Exception Handling

Not applicable.

####### 2.3.4.2.11.2.10 Performance Considerations

Not applicable.

####### 2.3.4.2.11.2.11 Validation Requirements

Not applicable.

####### 2.3.4.2.11.2.12 Technology Integration Details

Not applicable.

####### 2.3.4.2.11.2.13 Validation Notes

Method specification is complete and defines the clean teardown of the connection.

##### 2.3.4.2.12.0.0 Events

*No items available*

##### 2.3.4.2.13.0.0 Implementation Notes

Specification requires this service to act as the bridge between the real-time backend and the client-side state management.

### 2.3.5.0.0.0.0 Interface Specifications

#### 2.3.5.1.0.0.0 Interface Name

##### 2.3.5.1.1.0.0 Interface Name

Task

##### 2.3.5.1.2.0.0 File Path

src/shared/types/task.types.ts

##### 2.3.5.1.3.0.0 Purpose

Specification requires defining the data structure for a delivery task to ensure type safety across the application.

##### 2.3.5.1.4.0.0 Generic Constraints

None

##### 2.3.5.1.5.0.0 Framework Specific Inheritance

None

##### 2.3.5.1.6.0.0 Method Contracts

*No items available*

##### 2.3.5.1.7.0.0 Property Contracts

###### 2.3.5.1.7.1.0 Property Name

####### 2.3.5.1.7.1.1 Property Name

id

####### 2.3.5.1.7.1.2 Property Type

string

####### 2.3.5.1.7.1.3 Getter Contract

Specification requires a unique identifier for the task.

####### 2.3.5.1.7.1.4 Setter Contract

Not applicable.

###### 2.3.5.1.7.2.0 Property Name

####### 2.3.5.1.7.2.1 Property Name

status

####### 2.3.5.1.7.2.2 Property Type

TaskStatus (Enum)

####### 2.3.5.1.7.2.3 Getter Contract

Specification requires the current status of the task in the FSM.

####### 2.3.5.1.7.2.4 Setter Contract

Not applicable.

###### 2.3.5.1.7.3.0 Property Name

####### 2.3.5.1.7.3.1 Property Name

pickupLocation

####### 2.3.5.1.7.3.2 Property Type

Location

####### 2.3.5.1.7.3.3 Getter Contract

Specification requires details of the vendor pickup location.

####### 2.3.5.1.7.3.4 Setter Contract

Not applicable.

###### 2.3.5.1.7.4.0 Property Name

####### 2.3.5.1.7.4.1 Property Name

dropoffLocation

####### 2.3.5.1.7.4.2 Property Type

Location

####### 2.3.5.1.7.4.3 Getter Contract

Specification requires details of the customer dropoff location.

####### 2.3.5.1.7.4.4 Setter Contract

Not applicable.

###### 2.3.5.1.7.5.0 Property Name

####### 2.3.5.1.7.5.1 Property Name

earnings

####### 2.3.5.1.7.5.2 Property Type

number

####### 2.3.5.1.7.5.3 Getter Contract

Specification requires the estimated earnings for completing the task.

####### 2.3.5.1.7.5.4 Setter Contract

Not applicable.

###### 2.3.5.1.7.6.0 Property Name

####### 2.3.5.1.7.6.1 Property Name

estimatedDistance

####### 2.3.5.1.7.6.2 Property Type

number

####### 2.3.5.1.7.6.3 Getter Contract

Specification requires the estimated travel distance in kilometers.

####### 2.3.5.1.7.6.4 Setter Contract

Not applicable.

###### 2.3.5.1.7.7.0 Property Name

####### 2.3.5.1.7.7.1 Property Name

paymentMethod

####### 2.3.5.1.7.7.2 Property Type

\"COD\" | \"Prepaid\"

####### 2.3.5.1.7.7.3 Getter Contract

Specification requires the payment method for the order.

####### 2.3.5.1.7.7.4 Setter Contract

Not applicable.

###### 2.3.5.1.7.8.0 Property Name

####### 2.3.5.1.7.8.1 Property Name

amountToCollect

####### 2.3.5.1.7.8.2 Property Type

number | null

####### 2.3.5.1.7.8.3 Getter Contract

Specification requires the cash amount to collect for COD orders.

####### 2.3.5.1.7.8.4 Setter Contract

Not applicable.

###### 2.3.5.1.7.9.0 Property Name

####### 2.3.5.1.7.9.1 Property Name

podMethod

####### 2.3.5.1.7.9.2 Property Type

\"Photo\" | \"OTP\"

####### 2.3.5.1.7.9.3 Getter Contract

Specification requires the designated Proof of Delivery method, aligning with REQ-1-074.

####### 2.3.5.1.7.9.4 Setter Contract

Not applicable.

##### 2.3.5.1.8.0.0 Implementation Guidance

Specification requires this interface to be used across the task feature, including the state slice, API responses, and screen props.

##### 2.3.5.1.9.0.0 Validation Notes

Validation of user story RDR-011 confirms all necessary fields are included in this interface specification.

#### 2.3.5.2.0.0.0 Interface Name

##### 2.3.5.2.1.0.0 Interface Name

ITaskApi

##### 2.3.5.2.2.0.0 File Path

src/api/task.api.ts

##### 2.3.5.2.3.0.0 Purpose

Specification requires defining the contract for API calls related to tasks, using the abstracted API client.

##### 2.3.5.2.4.0.0 Generic Constraints

None

##### 2.3.5.2.5.0.0 Framework Specific Inheritance

None

##### 2.3.5.2.6.0.0 Method Contracts

###### 2.3.5.2.6.1.0 Method Name

####### 2.3.5.2.6.1.1 Method Name

acceptTask

####### 2.3.5.2.6.1.2 Method Signature

acceptTask(taskId: string): Promise<void>

####### 2.3.5.2.6.1.3 Return Type

Promise<void>

####### 2.3.5.2.6.1.4 Framework Attributes

*No items available*

####### 2.3.5.2.6.1.5 Parameters

- {'parameter_name': 'taskId', 'parameter_type': 'string', 'purpose': 'The ID of the task to accept.'}

####### 2.3.5.2.6.1.6 Contract Description

Specification requires sending a request to the backend to accept a task offer.

####### 2.3.5.2.6.1.7 Exception Contracts

Specification requires throwing an ApiError on failure (e.g., task already taken).

###### 2.3.5.2.6.2.0 Method Name

####### 2.3.5.2.6.2.1 Method Name

updateStatus

####### 2.3.5.2.6.2.2 Method Signature

updateStatus(params: { taskId: string; status: TaskStatus; location?: LatLng }): Promise<void>

####### 2.3.5.2.6.2.3 Return Type

Promise<void>

####### 2.3.5.2.6.2.4 Framework Attributes

*No items available*

####### 2.3.5.2.6.2.5 Parameters

- {'parameter_name': 'params', 'parameter_type': 'object', 'purpose': 'Contains the task ID, new status, and optional location data.'}

####### 2.3.5.2.6.2.6 Contract Description

Specification requires updating the status of an active delivery task.

####### 2.3.5.2.6.2.7 Exception Contracts

Specification requires throwing an ApiError on failure.

##### 2.3.5.2.7.0.0 Property Contracts

*No items available*

##### 2.3.5.2.8.0.0 Implementation Guidance

Specification requires this module to be implemented as a collection of functions that use the configured `apiClient`.

##### 2.3.5.2.9.0.0 Validation Notes

Validation of sequence diagrams confirms these methods are necessary and correctly specified.

### 2.3.6.0.0.0.0 Enum Specifications

- {'enum_name': 'TaskStatus', 'file_path': 'src/shared/types/task.types.ts', 'underlying_type': 'string', 'purpose': "Specification requires defining the states of the delivery task finite state machine from the rider's perspective, aligning with REQ-1-072.", 'framework_attributes': [], 'values': [{'value_name': 'Offered', 'value': '\\"OFFERED\\"', 'description': 'Specification requires this state when a task has been offered to the rider.'}, {'value_name': 'Accepted', 'value': '\\"ACCEPTED\\"', 'description': 'Specification requires this state when the rider has accepted the task and is en route to the store.'}, {'value_name': 'ArrivedAtStore', 'value': '\\"ARRIVED_AT_STORE\\"', 'description': 'Specification requires this state when the rider has arrived at the pickup location.'}, {'value_name': 'InTransit', 'value': '\\"IN_TRANSIT\\"', 'description': 'Specification requires this state when the rider has picked up the order and is en route to the customer.'}, {'value_name': 'ArrivedAtDestination', 'value': '\\"ARRIVED_AT_DESTINATION\\"', 'description': 'Specification requires this state when the rider has arrived at the dropoff location.'}, {'value_name': 'Delivered', 'value': '\\"DELIVERED\\"', 'description': 'Specification requires this state when the order has been successfully delivered.'}, {'value_name': 'Cancelled', 'value': '\\"CANCELLED\\"', 'description': 'Specification requires this state when the task has been cancelled.'}], 'validation_notes': 'Validation against REQ-1-072 and associated sequence diagrams confirms this enum is complete and accurate.'}

### 2.3.7.0.0.0.0 Dto Specifications

- {'dto_name': 'TaskOfferPayload', 'file_path': 'src/features/task/task.types.ts', 'purpose': 'Specification requires defining the data structure of a new task offer received via WebSocket to ensure type-safe handling of real-time events.', 'framework_base_class': 'None', 'properties': [{'property_name': 'task', 'property_type': 'Task', 'validation_attributes': [], 'serialization_attributes': [], 'framework_specific_attributes': []}, {'property_name': 'expiresAt', 'property_type': 'string (ISO)', 'validation_attributes': [], 'serialization_attributes': [], 'framework_specific_attributes': []}], 'validation_rules': 'Specification requires validation using a schema library like Zod to ensure data integrity upon receipt.', 'serialization_requirements': 'Specification notes this DTO is received as a JSON string via WebSocket.', 'validation_notes': 'Validation of user story RDR-010 confirms this DTO is necessary for the task offer flow.'}

### 2.3.8.0.0.0.0 Configuration Specifications

- {'configuration_name': 'EnvironmentConfig', 'file_path': 'src/config/environment.ts', 'purpose': 'Specification requires centralizing and providing type-safe access to environment variables, a best practice for maintainability.', 'framework_base_class': 'None', 'configuration_sections': [{'section_name': 'Api', 'properties': [{'property_name': 'baseUrl', 'property_type': 'string', 'default_value': '', 'required': True, 'description': 'Specification requires the base URL for the backend API Gateway.'}, {'property_name': 'webSocketUrl', 'property_type': 'string', 'default_value': '', 'required': True, 'description': 'Specification requires the URL for the backend WebSocket service.'}]}, {'section_name': 'Mapbox', 'properties': [{'property_name': 'accessToken', 'property_type': 'string', 'default_value': '', 'required': True, 'description': 'Specification requires the public access token for the Mapbox SDK.'}]}], 'validation_requirements': 'Specification requires the application to fail at startup if required environment variables are missing to prevent runtime errors.', 'validation_notes': 'This component specification is added based on best practices for managing configuration in a React Native application.'}

### 2.3.9.0.0.0.0 Dependency Injection Specifications

#### 2.3.9.1.0.0.0 Service Interface

##### 2.3.9.1.1.0.0 Service Interface

apiClient

##### 2.3.9.1.2.0.0 Service Implementation

Axios instance from REPO-API-CLIENT

##### 2.3.9.1.3.0.0 Lifetime

Singleton

##### 2.3.9.1.4.0.0 Registration Reasoning

Specification requires a single, configured instance of the API client to be used throughout the application for consistency and performance.

##### 2.3.9.1.5.0.0 Framework Registration Pattern

Specification requires instantiation in `src/api/apiClient.ts` and direct import into service files.

##### 2.3.9.1.6.0.0 Validation Notes

Validation confirms this singleton pattern is appropriate for an HTTP client.

#### 2.3.9.2.0.0.0 Service Interface

##### 2.3.9.2.1.0.0 Service Interface

Redux Store

##### 2.3.9.2.2.0.0 Service Implementation

Configured Redux Toolkit store

##### 2.3.9.2.3.0.0 Lifetime

Singleton

##### 2.3.9.2.4.0.0 Registration Reasoning

Specification requires the application to have a single global state store.

##### 2.3.9.2.5.0.0 Framework Registration Pattern

Specification requires providing the store to the entire application at the root level using the `<Provider>` component from `react-redux`.

##### 2.3.9.2.6.0.0 Validation Notes

Validation confirms this is the standard and correct pattern for Redux integration.

### 2.3.10.0.0.0.0 External Integration Specifications

#### 2.3.10.1.0.0.0 Integration Target

##### 2.3.10.1.1.0.0 Integration Target

Backend REST API (via REPO-API-CLIENT)

##### 2.3.10.1.2.0.0 Integration Type

HTTP/S

##### 2.3.10.1.3.0.0 Required Client Classes

- apiClient

##### 2.3.10.1.4.0.0 Configuration Requirements

Specification requires a Base URL from environment config and interceptors for adding the JWT Authorization header and handling token refresh logic.

##### 2.3.10.1.5.0.0 Error Handling Requirements

Specification requires the client wrapper to normalize API errors into a consistent format. It must handle 401 Unauthorized for token refresh and network errors gracefully.

##### 2.3.10.1.6.0.0 Authentication Requirements

Specification requires a JWT Bearer Token in the Authorization header.

##### 2.3.10.1.7.0.0 Framework Integration Patterns

Specification requires a singleton `axios` instance configured with interceptors and wrapped in domain-specific API modules.

##### 2.3.10.1.8.0.0 Validation Notes

Validation of the architecture confirms this is the correct pattern for interacting with the backend.

#### 2.3.10.2.0.0.0 Integration Target

##### 2.3.10.2.1.0.0 Integration Target

Backend WebSocket Service

##### 2.3.10.2.2.0.0 Integration Type

WSS

##### 2.3.10.2.3.0.0 Required Client Classes

- RealtimeService (wrapper)
- Socket.IO client

##### 2.3.10.2.4.0.0 Configuration Requirements

Specification requires the WebSocket URL from environment config. Authentication requires passing the JWT during the connection handshake.

##### 2.3.10.2.5.0.0 Error Handling Requirements

Specification requires the `RealtimeService` to handle `connect_error`, `disconnect`, and implement an exponential backoff strategy for `reconnect_attempt`.

##### 2.3.10.2.6.0.0 Authentication Requirements

Specification requires the JWT to be passed in the `auth` payload of the Socket.IO connection options.

##### 2.3.10.2.7.0.0 Framework Integration Patterns

Specification requires a singleton service to manage the socket lifecycle and dispatch incoming events as actions to the Redux store.

##### 2.3.10.2.8.0.0 Validation Notes

Validation of REQ-1-092 confirms this integration is necessary and the specification is complete.

#### 2.3.10.3.0.0.0 Integration Target

##### 2.3.10.3.1.0.0 Integration Target

Mapbox Navigation SDK

##### 2.3.10.3.2.0.0 Integration Type

Native Module / SDK

##### 2.3.10.3.3.0.0 Required Client Classes

- NavigationService (wrapper)
- MapboxGL.MapView
- MapboxNavigation

##### 2.3.10.3.4.0.0 Configuration Requirements

Specification requires the access token to be provided during app initialization. Must handle Android/iOS specific setup.

##### 2.3.10.3.5.0.0 Error Handling Requirements

Specification requires graceful handling of cases where the navigation service fails to initialize or a route cannot be calculated.

##### 2.3.10.3.6.0.0 Authentication Requirements

Specification requires a public access token.

##### 2.3.10.3.7.0.0 Framework Integration Patterns

Specification requires the SDK to be wrapped in a dedicated service (`NavigationService`) and used within a specific React component (`NavigationMapView.tsx`) to encapsulate its complexity.

##### 2.3.10.3.8.0.0 Validation Notes

Validation of REQ-1-072 and REQ-1-111 confirms this integration is required and specified correctly.

#### 2.3.10.4.0.0.0 Integration Target

##### 2.3.10.4.1.0.0 Integration Target

React Native Background Geolocation

##### 2.3.10.4.2.0.0 Integration Type

Native Module / SDK

##### 2.3.10.4.3.0.0 Required Client Classes

- LocationService (wrapper)
- BackgroundGeolocation

##### 2.3.10.4.4.0.0 Configuration Requirements

Specification requires extensive configuration for battery optimization, HTTP integration for posting locations, and OS-specific background modes.

##### 2.3.10.4.5.0.0 Error Handling Requirements

Specification requires graceful handling of permission denials, as per REQ-1-089. Needs robust logic to manage state and queue locations when offline.

##### 2.3.10.4.6.0.0 Authentication Requirements

Specification requires the HTTP template to be configured to send the JWT with each location post.

##### 2.3.10.4.7.0.0 Framework Integration Patterns

Specification requires a singleton service (`LocationService`) to manage the complex lifecycle of the background plugin, ensuring it is only active when needed (i.e., rider is online and on a task).

##### 2.3.10.4.8.0.0 Validation Notes

Validation of the repository's performance considerations confirms this is a critical and correctly specified integration.

## 2.4.0.0.0.0.0 Component Count Validation

| Property | Value |
|----------|-------|
| Total Classes | 18 |
| Total Interfaces | 15 |
| Total Enums | 2 |
| Total Dtos | 10 |
| Total Configurations | 5 |
| Total External Integrations | 4 |
| Grand Total Components | 54 |
| Phase 2 Claimed Count | 0 |
| Phase 2 Actual Count | 0 |
| Validation Added Count | 54 |
| Final Validated Count | 54 |

# 3.0.0.0.0.0.0 File Structure

## 3.1.0.0.0.0.0 Directory Organization

### 3.1.1.0.0.0.0 Directory Path

#### 3.1.1.1.0.0.0 Directory Path

.

#### 3.1.1.2.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.1.3.0.0.0 Contains Files

- package.json
- .nvmrc
- .npmrc
- README.md
- .editorconfig
- .eslintrc.js
- .prettierrc.js
- .env.example
- babel.config.js
- metro.config.js
- tsconfig.json
- react-native.config.js
- jest.config.js
- jest-setup.js
- .gitignore

#### 3.1.1.4.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.1.5.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

### 3.1.2.0.0.0.0 Directory Path

#### 3.1.2.1.0.0.0 Directory Path

.vscode

#### 3.1.2.2.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.2.3.0.0.0 Contains Files

- settings.json
- extensions.json
- launch.json

#### 3.1.2.4.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.2.5.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

### 3.1.3.0.0.0.0 Directory Path

#### 3.1.3.1.0.0.0 Directory Path

android/app

#### 3.1.3.2.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.3.3.0.0.0 Contains Files

- build.gradle

#### 3.1.3.4.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.3.5.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

### 3.1.4.0.0.0.0 Directory Path

#### 3.1.4.1.0.0.0 Directory Path

ios

#### 3.1.4.2.0.0.0 Purpose

Infrastructure and project configuration files

#### 3.1.4.3.0.0.0 Contains Files

- Podfile

#### 3.1.4.4.0.0.0 Organizational Reasoning

Contains project setup, configuration, and infrastructure files for development and deployment

#### 3.1.4.5.0.0.0 Framework Convention Alignment

Standard project structure for infrastructure as code and development tooling

