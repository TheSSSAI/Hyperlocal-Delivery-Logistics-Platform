# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-010 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider Receives New Task Offer with Decision-Critic... |
| As A User Story | As an online Rider, I want to receive a clear and ... |
| User Persona | A registered Rider who has set their in-app status... |
| Business Value | Enables the core logistics loop by connecting avai... |
| Functional Area | Rider-Facing Features |
| Story Theme | Rider Task Management & Availability |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Happy Path: Rider receives and views a new task offer while app is open

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

A Rider is logged in, their status is 'Online', and the app is in the foreground

### 3.1.5 When

The rider allocation system assigns a new delivery task to them

### 3.1.6 Then

A full-screen modal or dedicated offer screen appears instantly, displaying the offer details, a countdown timer, and action buttons.

### 3.1.7 Validation Notes

Verify via WebSocket message or similar real-time communication. The UI must appear without requiring a push notification tap.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Happy Path: Rider receives a new task offer while app is in the background or closed

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

A Rider is logged in, their status is 'Online', and the app is in the background or terminated

### 3.2.5 When

The rider allocation system assigns a new delivery task to them

### 3.2.6 Then

The Rider's device receives a push notification with a distinct sound and a summary (e.g., 'New delivery offer! Earn an estimated ₹XX.'). Tapping the notification opens the app directly to the task offer screen.

### 3.2.7 Validation Notes

Test on physical iOS and Android devices to confirm notification delivery and deep-linking functionality.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Offer screen displays all required information for decision making

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

A Rider is viewing the task offer screen

### 3.3.5 When

The screen is rendered

### 3.3.6 Then

The screen must clearly display: 1. Vendor's name and address (pickup). 2. Customer's general delivery area (e.g., neighborhood, not full address). 3. Estimated total travel distance. 4. Estimated earnings for the task. 5. A visible countdown timer (default 60s). 6. 'Accept' and 'Reject' buttons.

### 3.3.7 Validation Notes

Verify all data points are present and correctly mapped from the backend payload.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Offer expires when the timer runs out

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

A Rider is viewing a task offer and has not taken any action

### 3.4.5 When

The countdown timer reaches zero

### 3.4.6 Then

The offer screen is automatically dismissed, the task is considered 'Rejected' by the system, and the system initiates re-assignment to another rider.

### 3.4.7 Validation Notes

The rider's app should return to the default 'Online' state, ready for another offer. The backend must log this as a 'timed_out' rejection.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Offer is rescinded while being viewed

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

A Rider is viewing a task offer

### 3.5.5 When

The underlying order is cancelled by the vendor or an administrator

### 3.5.6 Then

The offer screen is immediately dismissed with a clear message, such as 'This offer is no longer available'.

### 3.5.7 Validation Notes

Requires a real-time message from the backend to the client to trigger the UI change.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Rider has no network connectivity when offer is sent

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

A Rider is 'Online' but their device has no internet connection

### 3.6.5 When

The system attempts to assign them a task

### 3.6.6 Then

The system's allocation attempt for this rider should time out quickly, and the task should be re-assigned to the next available rider to avoid delivery delays.

### 3.6.7 Validation Notes

This is primarily a backend logic test. The allocation service should not be blocked waiting for an unreachable device.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Push Notification (system level)
- Full-screen modal or dedicated view for the offer
- Large, clear text for earnings and distance
- Visually prominent countdown timer (e.g., circular progress bar)
- Large, easily tappable 'Accept' and 'Reject' buttons

## 4.2.0 User Interactions

- Tapping a push notification deep-links into the app's offer screen.
- The offer screen requires an explicit 'Accept' or 'Reject' action from the user before the timer expires.
- The app should produce a distinct, urgent sound and/or vibration upon receiving an offer.

## 4.3.0 Display Requirements

- Vendor Name & Address
- Customer Delivery Area
- Estimated Distance (in km)
- Estimated Earnings (in ₹)
- Time remaining to accept

## 4.4.0 Accessibility Needs

- Text must have sufficient contrast (WCAG 2.1 AA).
- Buttons must have a minimum tap target size of 44x44 pixels.
- The notification sound should be configurable or respect the device's silent/DND modes.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-RDR-01

### 5.1.2 Rule Description

A rider can only be presented with one task offer at a time.

### 5.1.3 Enforcement Point

Rider Allocation Service

### 5.1.4 Violation Handling

The system must ensure a rider's status is 'Considering Offer' and filter them out of subsequent allocation runs until the current offer is resolved (accepted, rejected, timed out).

## 5.2.0 Rule Id

### 5.2.1 Rule Id

REQ-FUN-013

### 5.2.2 Rule Description

Rider must accept or reject the task within a configurable time limit (default: 60 seconds).

### 5.2.3 Enforcement Point

Client-side (UI timer) and Backend (state management)

### 5.2.4 Violation Handling

If no response is received, the offer is automatically considered rejected and re-assigned.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-009

#### 6.1.1.2 Dependency Reason

Rider must be able to set their status to 'Online' to be eligible for offers.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

VND-021

#### 6.1.2.2 Dependency Reason

Vendor marking an order 'Ready for Pickup' is the primary trigger for the rider allocation process.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

SYS-002

#### 6.1.3.2 Dependency Reason

Defines the system behavior for re-assigning a task after it is rejected or times out, which is a direct outcome of this story.

## 6.2.0.0 Technical Dependencies

- A functioning Rider Allocation algorithm (as per REQ-FUN-018).
- A centralized Notification Service integrated with Firebase Cloud Messaging (FCM) and Apple Push Notification Service (APNS).
- A real-time communication channel (e.g., WebSocket via Socket.IO) for instant offer delivery to foregrounded apps.

## 6.3.0.0 Data Dependencies

- Access to the rider's current status and location.
- Access to order details (pickup/dropoff locations) and calculated earnings.

## 6.4.0.0 External Dependencies

- Firebase Cloud Messaging (FCM) for Android push notifications.
- Apple Push Notification Service (APNS) for iOS push notifications.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- P99 latency from allocation decision to push notification dispatch must be < 1 second.
- The in-app offer screen must load and display within 500ms of being triggered.

## 7.2.0.0 Security

- The offer payload must only be delivered to the intended rider's device.
- API endpoints related to offers must be authenticated and authorized for the specific rider.

## 7.3.0.0 Usability

- The offer notification must be attention-grabbing and easily distinguishable from other notifications.
- The offer screen must be simple and allow for a decision with minimal cognitive load.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards for mobile applications.

## 7.5.0.0 Compatibility

- Must function correctly on the last two major versions of iOS and Android.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires robust, cross-platform push notification implementation (FCM/APNS).
- Involves real-time state management on both backend (offer status) and client (UI).
- Coordination between multiple microservices (Orders, Rider Logistics, Notifications) is required.
- Handling notification delivery and deep-linking for various app states (foreground, background, killed) is complex.

## 8.3.0.0 Technical Risks

- Push notification delivery is not guaranteed and can be delayed by OS-level battery optimizations or network conditions.
- Potential for race conditions if an order is cancelled at the exact moment an offer is being sent or accepted.

## 8.4.0.0 Integration Points

- Rider Logistics Service: Triggers the offer.
- Notification Service: Dispatches the push notification.
- Rider Mobile App: Receives the notification and displays the UI.
- API Gateway (WebSocket): For real-time communication with the mobile app.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Usability

## 9.2.0.0 Test Scenarios

- Verify offer reception in all app states (foreground, background, killed).
- Verify timer expiration correctly triggers rejection.
- Verify offer cancellation is handled correctly.
- Verify deep-linking from notification works as expected.
- Test on a variety of physical devices and network conditions (e.g., 4G, Wi-Fi).

## 9.3.0.0 Test Data Needs

- Test accounts for Riders with 'Online' status.
- Orders in a 'Ready for Pickup' state to trigger allocation.
- Configurable settings for the offer acceptance timer.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- Cypress or a similar framework for E2E tests.
- Firebase Console or similar tool to test push notification delivery.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing on both iOS and Android.
- Code reviewed and approved by at least one peer.
- Unit and integration tests implemented with >80% coverage.
- Automated E2E test for the happy path scenario is created and passing.
- UI/UX has been reviewed and approved by the design team.
- Performance metrics for notification dispatch and UI load time are met.
- Documentation for the notification payload and related APIs is created/updated.
- Story deployed and verified in the staging environment on physical devices.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a critical path story for the rider experience. It has dependencies on the backend allocation logic.
- Backend and frontend work can proceed in parallel, but requires a clearly defined API contract for the offer payload early in the sprint.

## 11.4.0.0 Release Impact

Blocks the ability for riders to perform deliveries. Must be included in the initial launch (MVP).

