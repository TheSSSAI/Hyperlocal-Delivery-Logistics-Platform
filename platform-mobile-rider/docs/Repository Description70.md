# 1 Id

REPO-FE-RIDER

# 2 Name

platform-mobile-rider

# 3 Description

This repository contains the React Native source code for the rider-facing mobile application. Its core responsibility is to be the primary tool for delivery riders, enabling them to set their availability, receive and accept delivery tasks, navigate to pickup and drop-off locations using integrated maps, update order statuses, and track their earnings. This application requires deep integration with device hardware like GPS for continuous background location tracking and the camera for proof-of-delivery. Its dependencies have been updated to consume the new, granular shared libraries, streamlining its development and ensuring consistency.

# 4 Type

🔹 Application Services

# 5 Namespace

Platform.Mobile.Rider

# 6 Output Path

apps/mobile-rider

# 7 Framework

React Native

# 8 Language

TypeScript

# 9 Technology

React Native, Redux/Zustand

# 10 Thirdparty Libraries

- react-native-maps
- react-native-background-geolocation

# 11 Layer Ids

- presentation

# 12 Dependencies

- REPO-UI-COMPONENTS
- REPO-API-CLIENT

# 13 Requirements

## 13.1 Requirement Id

### 13.1.1 Requirement Id

REQ-1-002

## 13.2.0 Requirement Id

### 13.2.1 Requirement Id

REQ-1-011

# 14.0.0 Generate Tests

✅ Yes

# 15.0.0 Generate Documentation

✅ Yes

# 16.0.0 Architecture Style

Microservices

# 17.0.0 Architecture Map

- presentation

# 18.0.0 Components Map

- Rider Mobile App (React Native)

# 19.0.0 Requirements Map

- REQ-1-002
- REQ-1-011
- REQ-1-071
- REQ-1-072
- REQ-1-076

# 20.0.0 Decomposition Rationale

## 20.1.0 Operation Type

UNCHANGED

## 20.2.0 Source Repository

self

## 20.3.0 Decomposition Reasoning

The repository's focus as the dedicated rider application is maintained. The internal architecture is improved by offloading shared UI and API logic to the newly created shared libraries, allowing the rider app team to focus on the unique challenges of their domain, such as background location services, battery optimization, and offline capabilities.

## 20.4.0 Extracted Responsibilities

- Shared UI components are now consumed from REPO-UI-COMPONENTS.
- API data fetching logic is now handled by REPO-API-CLIENT.

## 20.5.0 Reusability Scope

- N/A - This is a top-level application.

## 20.6.0 Development Benefits

- Focused development on rider-specific workflows and hardware integrations.
- Reduced codebase complexity.

# 21.0.0 Dependency Contracts

## 21.1.0 Repo-Api-Client

### 21.1.1 Required Interfaces

- {'interface': 'IApiClient', 'methods': ['getAssignedTasks()', 'updateTaskStatus(taskId: string, status: string)'], 'events': [], 'properties': []}

### 21.1.2 Integration Pattern

Library consumption (NPM package).

### 21.1.3 Communication Protocol

N/A

# 22.0.0 Exposed Contracts

## 22.1.0 Public Interfaces

*No items available*

# 23.0.0 Integration Patterns

| Property | Value |
|----------|-------|
| Dependency Injection | N/A |
| Event Communication | Uses WebSockets for real-time task offers and loca... |
| Data Flow | Receives tasks via push notifications/WebSockets, ... |
| Error Handling | Robust handling of network connectivity loss and G... |
| Async Patterns | Manages background processes for location tracking... |

# 24.0.0 Technology Guidance

| Property | Value |
|----------|-------|
| Framework Specific | Must use a reliable background geolocation library... |
| Performance Considerations | Battery consumption is a critical concern; locatio... |
| Security Considerations | Securely store rider's personal and financial info... |
| Testing Approach | Heavy focus on E2E testing on physical devices to ... |

# 25.0.0 Scope Boundaries

## 25.1.0 Must Implement

- Rider onboarding and profile management.
- Toggling online/offline status.
- Accepting/rejecting delivery tasks.
- Map-based navigation.
- Proof of Delivery (Photo/OTP).
- Earnings tracking.

## 25.2.0 Must Not Implement

- Any customer, vendor, or admin-specific functionality.

## 25.3.0 Extension Points

- Incentive and bonus features.
- Performance analytics.

## 25.4.0 Validation Rules

*No items available*

