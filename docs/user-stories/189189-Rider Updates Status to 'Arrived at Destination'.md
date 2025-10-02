# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-018 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider Updates Status to 'Arrived at Destination' |
| As A User Story | As a Rider, I want to tap a button to update the o... |
| User Persona | Rider: A user responsible for picking up orders fr... |
| Business Value | Provides crucial real-time updates to the customer... |
| Functional Area | Rider-Facing Features |
| Story Theme | Delivery Execution & Status Updates |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

RDR-018-AC-01

### 3.1.2 Scenario

Happy Path: Rider successfully updates status upon arrival

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in Rider with an active order in the 'In Transit' state

### 3.1.5 When

I tap the 'Arrived at Destination' button on the order details screen

### 3.1.6 Then

The system must update the order status to 'Arrived at Destination' AND a push notification stating 'Your rider has arrived!' must be sent to the customer AND the rider's app UI must transition to the Proof of Delivery screen AND an immutable event must be logged in the order's history with the new status, a timestamp, and the rider's current GPS coordinates.

### 3.1.7 Validation Notes

Verify the order status change in the database. Confirm the customer receives the push notification. Check the rider app UI changes. Query the order event log for the new entry.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

RDR-018-AC-02

### 3.2.2 Scenario

Error Condition: Status update fails due to no network connectivity

### 3.2.3 Scenario Type

Error_Condition

### 3.2.4 Given

I am a logged-in Rider with an active order in the 'In Transit' state and my device has no internet connection

### 3.2.5 When

I tap the 'Arrived at Destination' button

### 3.2.6 Then

The app must display a non-blocking 'No connection, retrying...' message AND the status update action (with the original tap timestamp and GPS data) must be queued locally AND the app must automatically attempt to sync the update once network connectivity is restored.

### 3.2.7 Validation Notes

Use network throttling tools to simulate offline mode. Verify the UI feedback. After restoring the network, confirm the backend receives the update with the original timestamp, not the sync time.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

RDR-018-AC-03

### 3.3.2 Scenario

Edge Case: Rider attempts to mark arrival when far from the destination

### 3.3.3 Scenario Type

Edge_Case

### 3.3.4 Given

I am a logged-in Rider with an active order in the 'In Transit' state

### 3.3.5 When

I tap the 'Arrived at Destination' button while my GPS location is more than 500 meters from the customer's address

### 3.3.6 Then

The app must display a confirmation dialog: 'You seem far from the destination. Are you sure you have arrived?' with 'Yes' and 'No' options AND the status update should only proceed if I tap 'Yes'.

### 3.3.7 Validation Notes

Use a GPS mocking tool to simulate being far from the delivery address. Verify the confirmation prompt appears and that the status is not updated if 'No' is selected.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

RDR-018-AC-04

### 3.4.2 Scenario

System Performance: API response for status update is fast

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

I am a logged-in Rider with an active order and a stable internet connection

### 3.4.5 When

I tap the 'Arrived at Destination' button

### 3.4.6 Then

The API call to the backend must complete with a 95th percentile latency of under 200ms, as per REQ-NFR-001.

### 3.4.7 Validation Notes

Monitor API performance metrics in Grafana/CloudWatch during load testing to verify latency.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

RDR-018-AC-05

### 3.5.2 Scenario

Security: Unauthorized status update is prevented

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

An order is in the 'In Transit' state and assigned to Rider A

### 3.5.5 When

A malicious user or another rider (Rider B) attempts to call the API to update the order's status to 'Arrived at Destination'

### 3.5.6 Then

The API must reject the request with an 'Unauthorized' (403) error.

### 3.5.7 Validation Notes

Attempt to call the API endpoint using authentication tokens from a different rider or user role. Verify the 403 response.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A prominent, easily tappable 'Arrived at Destination' button on the active delivery screen.
- A confirmation dialog for the geofencing check.
- A non-blocking toast or snackbar for network error feedback.

## 4.2.0 User Interactions

- A single tap on the button initiates the status update.
- The button should show a loading state/spinner to provide immediate feedback after being tapped.
- Upon successful update, the screen should automatically transition to the next logical step (Proof of Delivery).

## 4.3.0 Display Requirements

- The current order status must always be clearly visible.
- The UI for the next step (e.g., 'Capture Photo' or 'Enter OTP') must be presented clearly after this action is completed.

## 4.4.0 Accessibility Needs

- The button must have a sufficient touch target size (min 44x44dp).
- The button text must be clear and have sufficient color contrast, compliant with WCAG 2.1 AA standards.

# 5.0.0 Business Rules

- {'rule_id': 'BR-RDR-STATUS-SEQ', 'rule_description': "The order status must be 'In Transit' before it can be changed to 'Arrived at Destination'.", 'enforcement_point': 'Backend API (Order Management Service)', 'violation_handling': "The API will reject the request with a 'Bad Request' (400) or 'Conflict' (409) error if the current state is incorrect."}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-016

#### 6.1.1.2 Dependency Reason

This story sets the order status to 'In Transit', which is the required precondition for RDR-018.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

REQ-FUN-014

#### 6.1.2.2 Dependency Reason

Defines the overall delivery execution flow and status update mechanism that this story is a part of.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

RDR-022

#### 6.1.3.2 Dependency Reason

The UI for photo-based Proof of Delivery must be ready, as it is the next step in the workflow after arrival.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

RDR-023

#### 6.1.4.2 Dependency Reason

The UI for OTP-based Proof of Delivery must be ready, as it is an alternative next step in the workflow.

## 6.2.0.0 Technical Dependencies

- Order Management Service: Must have a secure endpoint to update order status.
- Notification Service (FCM): Must be integrated to send push notifications to customers.
- Rider App's Offline Queueing Mechanism: Must be implemented to handle network failures.
- Real-time Communication Service (WebSockets): Required to push the status update to the customer's app.

## 6.3.0.0 Data Dependencies

- The order record must exist and be in the correct state ('In Transit').
- Accurate customer delivery coordinates are required for the geofencing check.

## 6.4.0.0 External Dependencies

- Firebase Cloud Messaging (FCM) for push notifications must be operational.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- API P95 latency must be < 200ms (REQ-NFR-001).
- The client-side action (tap to UI confirmation) should complete in under 1 second on a 4G connection.

## 7.2.0.0 Security

- The API endpoint must be protected and require authentication.
- Authorization logic must ensure only the assigned rider can update the order status.
- All communication must be over HTTPS/WSS (REQ-INT-004).

## 7.3.0.0 Usability

- The action must be achievable with a single tap.
- Feedback to the rider (loading, success, error) must be immediate and clear.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA for mobile applications.

## 7.5.0.0 Compatibility

- Functionality must be consistent across supported iOS and Android versions.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Implementing a robust offline-first queuing mechanism on the mobile client.
- Client-side geofencing logic requires careful handling of GPS permissions and accuracy.
- Coordinating multiple system effects: database update, customer notification, and real-time UI push to the customer app.

## 8.3.0.0 Technical Risks

- Inaccurate GPS data could lead to false positives/negatives for the geofencing check.
- Race conditions if the rider's app tries to sync multiple queued updates out of order upon regaining connectivity.

## 8.4.0.0 Integration Points

- Backend: Order Management Service API.
- Backend: Notification Service.
- Client: Device GPS hardware API.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Usability

## 9.2.0.0 Test Scenarios

- Full E2E flow from 'In Transit' -> 'Arrived' -> 'Delivered'.
- Simulate network loss before, during, and after tapping the button.
- Mock GPS coordinates inside and outside the geofence radius to test the confirmation prompt.
- Verify notification delivery and content on a customer device.

## 9.3.0.0 Test Data Needs

- Test rider accounts with assigned orders in the 'In Transit' state.
- Test customer accounts linked to those orders.
- Orders with delivery addresses in various locations for geofencing tests.

## 9.4.0.0 Testing Tools

- Cypress or similar for E2E testing.
- Charles Proxy or device network throttling for simulating poor connectivity.
- GPS mocking tools for location-based testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria are validated and passing in a staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >80% code coverage.
- Automated E2E tests for the happy path and key error conditions are passing.
- The feature has been manually tested on representative iOS and Android devices.
- Performance of the status update API is confirmed to be within SLOs.
- Security checks (authorization) have been verified.
- Relevant documentation (e.g., API spec) has been updated.
- The feature is deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a core feature in the delivery workflow and a dependency for the Proof of Delivery stories.
- Requires coordinated effort between mobile and backend developers.
- The offline handling logic may require significant testing effort.

## 11.4.0.0 Release Impact

- This feature is critical for the end-to-end delivery functionality and must be included in the initial pilot launch.

