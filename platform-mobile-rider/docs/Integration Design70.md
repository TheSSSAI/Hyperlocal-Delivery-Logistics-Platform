# 1 Integration Specifications

## 1.1 Extraction Metadata

| Property | Value |
|----------|-------|
| Repository Id | platform-mobile-rider |
| Extraction Timestamp | 2024-05-24T10:00:00Z |
| Mapping Validation Score | 100% |
| Context Completeness Score | 98% |
| Implementation Readiness Level | High |

## 1.2 Relevant Requirements

### 1.2.1 Requirement Id

#### 1.2.1.1 Requirement Id

REQ-1-011

#### 1.2.1.2 Requirement Text

The system shall implement a 'Rider' user role with the following permissions: Create, Read, and Update their own user profile; Read-only access to the details of assigned delivery tasks; Update access to the status of their assigned deliveries (e.g., picked up, delivered); and Read-only access to ratings and reviews of their own performance.

#### 1.2.1.3 Validation Criteria

- Log in as a Rider and verify the ability to edit their profile information.
- Verify that a Rider can view the details of a delivery task assigned to them.
- Verify that a Rider can update the delivery status through the app.
- Verify that a Rider can view their performance ratings.

#### 1.2.1.4 Implementation Implications

- The application must include a dedicated user profile section with editable forms.
- A task management module is required to display assigned deliveries and their details.
- The core user flow must revolve around a state machine for delivery status updates, driven by user interaction.
- A screen to display performance metrics and past reviews is needed.

#### 1.2.1.5 Extraction Reasoning

This is the foundational requirement defining the core purpose and permission model of the rider application.

### 1.2.2.0 Requirement Id

#### 1.2.2.1 Requirement Id

REQ-1-071

#### 1.2.2.2 Requirement Text

The rider application shall feature a status toggle for riders to set themselves as 'Online' or 'Offline'. When a task is offered, the rider's screen must display the vendor's name and address, the customer's address, the estimated travel distance, and the earnings for the delivery. The rider must be given 'Accept' and 'Reject' options and a configurable time limit (default: 60 seconds) to respond.

#### 1.2.2.3 Validation Criteria

- Set a rider's status to 'Online' and verify they are offered a new task.
- On the task offer screen, verify all required information (vendor, customer, distance, earnings) is displayed.
- Successfully accept a task.
- Let another task offer time out and verify it is automatically rejected.

#### 1.2.2.4 Implementation Implications

- The main screen must feature a prominent, stateful 'Online/Offline' toggle that communicates with the backend.
- A dedicated UI must be implemented for the task offer, which requires real-time data push from the server (via WebSocket or push notification).
- The task offer screen needs to integrate with a mapping service to display route/distance information.
- Client-side logic is needed to handle the acceptance timer and trigger actions on acceptance, rejection, or timeout.

#### 1.2.2.5 Extraction Reasoning

This requirement details the primary workflow for how a rider becomes available for work and interacts with new task offers, which is a core function of the application.

### 1.2.3.0 Requirement Id

#### 1.2.3.1 Requirement Id

REQ-1-072

#### 1.2.3.2 Requirement Text

The rider application shall provide integrated map-based navigation to guide the rider to the pickup location and then to the drop-off location. The application must provide distinct, single-tap buttons for the rider to update the order status sequentially through the key delivery milestones: Arrived at Store, Picked Up, Arrived at Destination, and Delivered.

#### 1.2.3.3 Validation Criteria

- Accept a task and verify a navigation interface is displayed, initially routing to the vendor.
- Tap the 'Arrived at Store' button and verify the status updates.
- Tap the 'Picked Up' button. Verify the status updates and the navigation now routes to the customer.
- Tap 'Arrived at Destination' and 'Delivered' in sequence, verifying the status updates correctly at each step.

#### 1.2.3.4 Implementation Implications

- Requires deep integration with a mapping SDK (e.g., Mapbox Navigation SDK) to provide in-app turn-by-turn navigation.
- A stateful UI for the active delivery task must be built, presenting the correct action button based on the current order status.
- Each button tap triggers an API call to the backend to update the order's state in the finite state machine.

#### 1.2.3.5 Extraction Reasoning

This requirement defines the entire delivery execution flow within the app, from navigation to final status update.

### 1.2.4.0 Requirement Id

#### 1.2.4.1 Requirement Id

REQ-1-076

#### 1.2.4.2 Requirement Text

The rider application shall provide comprehensive financial management tools. For COD orders, it must clearly display the exact cash amount to be collected. The app must maintain and display a running total of 'cash-in-hand' from all completed COD orders. A dedicated 'Earnings' section must provide a detailed breakdown of earnings by delivery, tips, and total earnings, with views for daily and weekly periods.

#### 1.2.4.3 Validation Criteria

- Accept a COD order and verify the app shows the correct collection amount.
- Complete the COD order and verify the 'cash-in-hand' total increases by the order amount.
- Navigate to the 'Earnings' section and verify the delivery fee is listed.
- Verify the earnings can be viewed as a daily and weekly summary.

#### 1.2.4.4 Implementation Implications

- The active delivery screen must be enhanced to show a 'Cash to Collect' amount for COD orders.
- A dedicated 'Earnings' or 'Wallet' section is required with multiple views for earnings breakdown, cash balance, and historical statements.
- The app must fetch and display data from the backend financial module.

#### 1.2.4.5 Extraction Reasoning

This requirement specifies all financial tracking and reporting features for the rider, which is critical for rider satisfaction and transparency.

### 1.2.5.0 Requirement Id

#### 1.2.5.1 Requirement Id

REQ-1-089

#### 1.2.5.2 Requirement Text

The mobile applications shall request necessary hardware permissions from the user. GPS access is required for both customer and rider apps. Camera access is required for the rider app (for POD). If a user denies a required permission, the application must handle it gracefully by displaying a message that explains why the permission is needed for a specific feature to function.

#### 1.2.5.3 Validation Criteria

- On first use of a location-based feature, verify the app prompts for GPS permission.
- Deny the permission. Verify the app shows an explanatory message instead of crashing.
- As a rider, attempt to complete a photo POD without camera permission. Verify the app explains that camera access is needed.

#### 1.2.5.4 Implementation Implications

- The app must use a permissions library to request and check for GPS and Camera permissions at the appropriate points in the user flow.
- Specific UI screens must be designed and built to handle cases where permission is denied, guiding the user to the device settings.

#### 1.2.5.5 Extraction Reasoning

This is a critical non-functional and usability requirement that dictates how the application must interact with the mobile OS for core features like navigation and Proof of Delivery.

### 1.2.6.0 Requirement Id

#### 1.2.6.1 Requirement Id

REQ-1-111

#### 1.2.6.2 Requirement Text

The project shall be implemented using the following mandated technology stack: Frontend (Mobile): React Native v0.73+; ... Backend: Node.js v18.18+ with NestJS (TypeScript); ... Third-Parties: Razorpay, Mapbox, FCM.

#### 1.2.6.3 Validation Criteria

- Review package.json files to confirm frontend and backend framework versions.

#### 1.2.6.4 Implementation Implications

- The entire application must be built using React Native.
- The application must integrate with the Mapbox SDK for all mapping and navigation features.
- The application must integrate with the Firebase Cloud Messaging (FCM) SDK for push notifications.

#### 1.2.6.5 Extraction Reasoning

This technical requirement dictates the entire technology stack for the repository, including the framework and key third-party integrations.

## 1.3.0.0 Relevant Components

- {'component_name': 'Rider Mobile App (React Native)', 'component_specification': 'The primary user interface for delivery riders, providing all tools necessary for their operational workflow. This includes authentication, availability management, task lifecycle (offer, accept/reject, navigation, status updates, POD), financial tracking, and communication.', 'implementation_requirements': ['Implement a secure OTP-based login and registration flow.', "Develop a main dashboard with an 'Online/Offline' toggle that controls the rider's availability.", 'Build a real-time task offer screen that displays key details and allows for acceptance or rejection within a time limit.', 'Integrate the Mapbox Navigation SDK for in-app turn-by-turn navigation to both vendor and customer locations.', 'Create a stateful active delivery screen with sequential buttons for status updates (Arrived at Store, Picked Up, etc.).', 'Integrate with native camera and GPS hardware for Proof of Delivery and live location tracking.', "Implement a dedicated 'Earnings' section to display cash-in-hand, daily/weekly earnings summaries, and downloadable statements.", 'Build a real-time chat interface for communication with customers on active orders.', 'Implement offline support for viewing cached data and queuing status updates.'], 'architectural_context': "This is a client application in the 'Presentation Layer'. It communicates with the backend exclusively through the API Gateway, consuming RESTful APIs (via an API client library) and connecting to a WebSocket endpoint for real-time events.", 'extraction_reasoning': 'This is the sole, primary component that defines the entire purpose and scope of the platform-mobile-rider repository.'}

## 1.4.0.0 Architectural Layers

- {'layer_name': 'Presentation Layer (Clients)', 'layer_responsibilities': "This layer is responsible for providing the user interfaces for all user classes. For this repository, its responsibility is to be the client application for the 'Rider' user class, rendering data from the backend, managing client-side state, handling user interactions, and integrating with device hardware.", 'layer_constraints': ['Must be built using React Native as per REQ-1-111.', 'Must communicate with the backend only through the defined API Gateway endpoints and WebSocket channels.', 'Must not contain business logic that belongs in the backend services (e.g., rider allocation, commission calculation).', 'Must handle user authentication and session management using JWTs provided by the backend.'], 'implementation_patterns': ['State Management (e.g., Redux, Zustand) for managing application state.', 'Component-Based UI development.', 'Secure Storage for JWT refresh tokens (Keychain/Keystore).', 'Background Services for continuous GPS location tracking.', 'Offline-First Caching for key data like profile and order history.'], 'extraction_reasoning': "This repository exclusively implements a component within the Presentation Layer, making the layer's definition, responsibilities, and constraints directly applicable to all development within this repo."}

## 1.5.0.0 Dependency Interfaces

### 1.5.1.0 Interface Name

#### 1.5.1.1 Interface Name

IBackendApiClient

#### 1.5.1.2 Source Repository

REPO-API-CLIENT

#### 1.5.1.3 Method Contracts

##### 1.5.1.3.1 Method Name

###### 1.5.1.3.1.1 Method Name

registerRider(payload)

###### 1.5.1.3.1.2 Method Signature

POST /api/v1/auth/register/rider

###### 1.5.1.3.1.3 Method Purpose

Submits the rider's registration data, including uploaded document references.

###### 1.5.1.3.1.4 Integration Context

Called at the final step of the multi-page registration flow (RDR-001).

##### 1.5.1.3.2.0 Method Name

###### 1.5.1.3.2.1 Method Name

requestLoginOtp(mobileNumber)

###### 1.5.1.3.2.2 Method Signature

POST /api/v1/auth/login/otp

###### 1.5.1.3.2.3 Method Purpose

Requests an OTP to be sent to the rider's mobile for login.

###### 1.5.1.3.2.4 Integration Context

Called from the login screen when the rider enters their mobile number.

##### 1.5.1.3.3.0 Method Name

###### 1.5.1.3.3.1 Method Name

verifyLoginOtp(mobileNumber, otp)

###### 1.5.1.3.3.2 Method Signature

POST /api/v1/auth/login/verify

###### 1.5.1.3.3.3 Method Purpose

Verifies the OTP and returns JWTs upon successful authentication.

###### 1.5.1.3.3.4 Integration Context

Called from the OTP entry screen to complete the login process.

##### 1.5.1.3.4.0 Method Name

###### 1.5.1.3.4.1 Method Name

setAvailabilityStatus(status: 'Online' | 'Offline')

###### 1.5.1.3.4.2 Method Signature

PATCH /api/v1/rider/me/status

###### 1.5.1.3.4.3 Method Purpose

Updates the rider's availability status in the backend.

###### 1.5.1.3.4.4 Integration Context

Called when the rider toggles their online/offline switch on the main dashboard.

##### 1.5.1.3.5.0 Method Name

###### 1.5.1.3.5.1 Method Name

acceptTask(taskId)

###### 1.5.1.3.5.2 Method Signature

POST /api/v1/tasks/{taskId}/accept

###### 1.5.1.3.5.3 Method Purpose

Accepts a new delivery task offer.

###### 1.5.1.3.5.4 Integration Context

Called when the rider taps 'Accept' on the task offer screen.

##### 1.5.1.3.6.0 Method Name

###### 1.5.1.3.6.1 Method Name

rejectTask(taskId)

###### 1.5.1.3.6.2 Method Signature

POST /api/v1/tasks/{taskId}/reject

###### 1.5.1.3.6.3 Method Purpose

Rejects a new delivery task offer.

###### 1.5.1.3.6.4 Integration Context

Called when the rider taps 'Reject' on the task offer screen.

##### 1.5.1.3.7.0 Method Name

###### 1.5.1.3.7.1 Method Name

updateTaskStatus(taskId, status, location?)

###### 1.5.1.3.7.2 Method Signature

PATCH /api/v1/tasks/{taskId}/status

###### 1.5.1.3.7.3 Method Purpose

Updates the status of an active delivery task (e.g., Arrived, Picked Up).

###### 1.5.1.3.7.4 Integration Context

Called sequentially during the delivery execution flow.

##### 1.5.1.3.8.0 Method Name

###### 1.5.1.3.8.1 Method Name

submitPhotoPod(taskId, photoS3Key, location)

###### 1.5.1.3.8.2 Method Signature

POST /api/v1/tasks/{taskId}/pod/photo

###### 1.5.1.3.8.3 Method Purpose

Submits a photo as Proof of Delivery.

###### 1.5.1.3.8.4 Integration Context

Called at the delivery completion step for orders requiring photo POD.

##### 1.5.1.3.9.0 Method Name

###### 1.5.1.3.9.1 Method Name

submitOtpPod(taskId, otp, location)

###### 1.5.1.3.9.2 Method Signature

POST /api/v1/tasks/{taskId}/pod/otp

###### 1.5.1.3.9.3 Method Purpose

Validates a customer-provided OTP as Proof of Delivery.

###### 1.5.1.3.9.4 Integration Context

Called at the delivery completion step for orders requiring OTP POD.

##### 1.5.1.3.10.0 Method Name

###### 1.5.1.3.10.1 Method Name

getEarningsSummary()

###### 1.5.1.3.10.2 Method Signature

GET /api/v1/rider/me/earnings

###### 1.5.1.3.10.3 Method Purpose

Fetches the rider's earnings summary and cash-in-hand balance.

###### 1.5.1.3.10.4 Integration Context

Called when the rider navigates to the 'Earnings' screen.

#### 1.5.1.4.0.0 Integration Pattern

Library consumption. The rider app will import and use a pre-built API client from the REPO-API-CLIENT repository.

#### 1.5.1.5.0.0 Communication Protocol

HTTPS with JSON payloads.

#### 1.5.1.6.0.0 Extraction Reasoning

This is the primary dependency for all state-changing and data-fetching interactions with the backend, as defined in the repository's dependency contract. The methods are expanded to cover all required functionalities derived from user stories.

### 1.5.2.0.0.0 Interface Name

#### 1.5.2.1.0.0 Interface Name

IRealtimeService

#### 1.5.2.2.0.0 Source Repository

platform-api-logistics, platform-api-chat

#### 1.5.2.3.0.0 Method Contracts

##### 1.5.2.3.1.0 Method Name

###### 1.5.2.3.1.1 Method Name

on('newTaskOffer')

###### 1.5.2.3.1.2 Method Signature

Event containing full task details: vendor, customer, route, earnings.

###### 1.5.2.3.1.3 Method Purpose

Receives a new delivery task offer from the server in real-time.

###### 1.5.2.3.1.4 Integration Context

The app must listen for this event when the rider is 'Online' and idle.

##### 1.5.2.3.2.0 Method Name

###### 1.5.2.3.2.1 Method Name

on('orderCancelled')

###### 1.5.2.3.2.2 Method Signature

Event containing the orderId that was cancelled.

###### 1.5.2.3.2.3 Method Purpose

Notifies the rider that an offered or accepted task has been cancelled.

###### 1.5.2.3.2.4 Integration Context

The app must listen for this and update its UI to remove the task.

##### 1.5.2.3.3.0 Method Name

###### 1.5.2.3.3.1 Method Name

on('newChatMessage')

###### 1.5.2.3.3.2 Method Signature

Event containing message details: senderId, text, timestamp.

###### 1.5.2.3.3.3 Method Purpose

Receives a new chat message from the customer.

###### 1.5.2.3.3.4 Integration Context

The app listens for this when a chat window for an active order is open.

##### 1.5.2.3.4.0 Method Name

###### 1.5.2.3.4.1 Method Name

emit('sendLocationUpdate')

###### 1.5.2.3.4.2 Method Signature

Payload containing latitude, longitude, timestamp, and accuracy.

###### 1.5.2.3.4.3 Method Purpose

Sends the rider's current location to the server for live tracking.

###### 1.5.2.3.4.4 Integration Context

Emitted periodically (e.g., every 5-10 seconds) by a background service when the rider is on an active task.

##### 1.5.2.3.5.0 Method Name

###### 1.5.2.3.5.1 Method Name

emit('sendChatMessage')

###### 1.5.2.3.5.2 Method Signature

Payload containing orderId and message text.

###### 1.5.2.3.5.3 Method Purpose

Sends a chat message to the customer.

###### 1.5.2.3.5.4 Integration Context

Emitted when the rider sends a message from the chat UI.

#### 1.5.2.4.0.0 Integration Pattern

WebSocket client-server communication.

#### 1.5.2.5.0.0 Communication Protocol

Secure WebSockets (WSS). The connection must be authenticated by passing a JWT.

#### 1.5.2.6.0.0 Extraction Reasoning

The application requires real-time capabilities for receiving task offers, managing chat, and sending location updates, which cannot be efficiently handled by REST. This interface is consumed from the backend's real-time services (Logistics and Chat).

### 1.5.3.0.0.0 Interface Name

#### 1.5.3.1.0.0 Interface Name

Shared Libraries

#### 1.5.3.2.0.0 Source Repository

REPO-UI-COMPONENTS, REPO-LIB-CONTRACTS

#### 1.5.3.3.0.0 Method Contracts

*No items available*

#### 1.5.3.4.0.0 Integration Pattern

Library consumption (NPM Packages).

#### 1.5.3.5.0.0 Communication Protocol

N/A (Compile-time dependency)

#### 1.5.3.6.0.0 Extraction Reasoning

To ensure architectural consistency, reduce code duplication, and enforce type safety, the rider app must consume shared libraries. REPO-UI-COMPONENTS will provide standardized UI elements (Buttons, Inputs, etc.), and REPO-LIB-CONTRACTS will provide all TypeScript types for DTOs and event payloads.

## 1.6.0.0.0.0 Exposed Interfaces

*No items available*

## 1.7.0.0.0.0 Technology Context

### 1.7.1.0.0.0 Framework Requirements

The application must be built using React Native v0.73+ and TypeScript. State management can be handled by Redux Toolkit or Zustand.

### 1.7.2.0.0.0 Integration Technologies

- Mapbox Navigation SDK: For all in-app mapping and turn-by-turn navigation features.
- Firebase Cloud Messaging (FCM) SDK: For receiving push notifications, primarily for new task offers when the app is in the background.
- WebSocket Client (e.g., Socket.IO client): For real-time communication with the backend.
- React Native Background Geolocation Library: A specialized, high-reliability library is required for continuous, battery-efficient background location tracking.

### 1.7.3.0.0.0 Performance Constraints

Battery consumption is a critical performance constraint due to continuous background GPS usage. The location tracking implementation must be heavily optimized. The app must remain responsive and performant on a wide range of low-to-mid-range Android devices.

### 1.7.4.0.0.0 Security Requirements

Rider's Personally Identifiable Information (PII) and financial details (bank account) must be stored securely on the device using Keychain (iOS) or Keystore (Android). All API communication must use HTTPS/WSS. Session management must be done via short-lived JWT access tokens and securely stored refresh tokens.

## 1.8.0.0.0.0 Extraction Validation

| Property | Value |
|----------|-------|
| Mapping Completeness Check | All core functionalities described in the repo def... |
| Cross Reference Validation | Cross-referencing confirmed alignment between the ... |
| Implementation Readiness Assessment | The repository is ready for implementation, contin... |
| Quality Assurance Confirmation | All thinking checkpoints were systematically compl... |

