# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-016 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider Updates Order Status to 'Picked Up' / 'In Tr... |
| As A User Story | As a Rider, I want to confirm that I have collecte... |
| User Persona | A registered and verified Rider who has been assig... |
| Business Value | This action is a critical state transition in the ... |
| Functional Area | Rider-Facing Features |
| Story Theme | Delivery Execution & Status Updates |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Happy Path: Rider successfully confirms order pickup

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

A Rider is logged into the mobile app, has an active delivery task, and has already updated their status to 'Arrived at Store'

### 3.1.5 When

The Rider taps the 'Confirm Pickup' button on the active task screen

### 3.1.6 Then

The system MUST perform the following actions atomically: 1. The backend order status is updated from 'Ready for Pickup' to 'In Transit'. 2. An immutable event is recorded in the order's event log with the new state, timestamp, and Rider ID, as per REQ-FUN-017. 3. A push notification is sent to the Customer stating their order is on the way. 4. The live tracking feature (REQ-FUN-008) is activated for the Customer. 5. The Rider's app UI transitions to the delivery view, showing navigation to the customer's address (REQ-FUN-014). 6. The Vendor's dashboard is updated to reflect the order has been collected.

### 3.1.7 Validation Notes

Verify via API response, database state change, checking the order event log, receiving the push notification on a test customer device, and observing the UI changes on both Rider and Customer apps.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Error Condition: No network connectivity

### 3.2.3 Scenario Type

Error_Condition

### 3.2.4 Given

The Rider is on the active task screen but has no internet connection

### 3.2.5 When

The Rider taps the 'Confirm Pickup' button

### 3.2.6 Then

The app MUST display a non-blocking error message (e.g., a toast notification) like 'No internet connection. Status will be updated once online.' The app MUST queue the status update request and attempt to sync automatically when connectivity is restored. The UI should provide a visual indicator that the update is pending.

### 3.2.7 Validation Notes

Test by enabling airplane mode on the device. Tap the button and verify the UI feedback. Re-enable network and verify the status update is sent successfully without further user interaction.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Error Condition: Backend API failure

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

The Rider has network connectivity and is on the active task screen

### 3.3.5 When

The Rider taps the 'Confirm Pickup' button and the backend API returns a 5xx error

### 3.3.6 Then

The app MUST display a user-friendly error message like 'Could not update status. Please try again.' The app MUST NOT change the UI state permanently and should allow the rider to retry the action. The system should implement a client-side retry mechanism with exponential backoff for transient errors.

### 3.3.7 Validation Notes

Use a mock server or network interception tool to simulate a 503 Service Unavailable response. Verify the error message is displayed and the rider can retry the action.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Edge Case: Order was cancelled just before pickup

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

The Rider is on the active task screen, about to confirm pickup

### 3.4.5 When

The order is cancelled by the customer or administrator, and the Rider then taps the 'Confirm Pickup' button

### 3.4.6 Then

The backend API MUST reject the status update request with a clear error code indicating the order is in a final state (e.g., 'Cancelled'). The Rider's app MUST sync with the latest order status, display a prominent notification like 'This order has been cancelled', and remove the task from the active list.

### 3.4.7 Validation Notes

In a test environment, have an admin cancel the order while a test rider has the task open. The rider then attempts the action. Verify the app's response.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A prominent and easily tappable button labeled 'Confirm Pickup' or similar, available on the active task screen after 'Arrived at Store' is confirmed.

## 4.2.0 User Interactions

- Tapping the button provides immediate visual feedback (e.g., loading spinner).
- Upon success, the screen transitions to the next logical view: navigation to the customer's address.
- Error messages are displayed as non-intrusive overlays or toast notifications.

## 4.3.0 Display Requirements

- The active task screen must clearly show the vendor's details and the order ID before this action is taken.

## 4.4.0 Accessibility Needs

- The button must meet WCAG 2.1 AA standards for tap target size and color contrast.

# 5.0.0 Business Rules

- {'rule_id': 'BR-RDR-016-01', 'rule_description': "A Rider can only mark an order as 'Picked Up' if the order's current status is 'Ready for Pickup'.", 'enforcement_point': 'Backend API (Order Management Service)', 'violation_handling': 'The API request is rejected with a 409 Conflict status code and an error message indicating a state mismatch.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-015

#### 6.1.1.2 Dependency Reason

The Rider must first confirm arrival at the store before they can confirm pickup. This story represents the preceding step in the workflow.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

VND-021

#### 6.1.2.2 Dependency Reason

The Vendor must mark the order as 'Ready for Pickup' to make it available for collection. This state is the precondition for the Rider's action.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

CUS-028

#### 6.1.3.2 Dependency Reason

This story's successful completion is the trigger that activates the customer's live tracking map. The tracking feature depends on this 'In Transit' state.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

CUS-030

#### 6.1.4.2 Dependency Reason

This story triggers a status update notification to the customer, requiring the notification system to be in place.

## 6.2.0.0 Technical Dependencies

- Order Management microservice: To update and persist the order state.
- Notification service (FCM/SNS): To dispatch the push notification to the customer.
- Rider Logistics microservice: To begin broadcasting rider location data for tracking.
- API Gateway & AWS Cognito: For secure, authenticated, and authorized API calls.

## 6.3.0.0 Data Dependencies

- The order record must exist and be assigned to the specific rider attempting the action.

## 6.4.0.0 External Dependencies

- Firebase Cloud Messaging (FCM) or equivalent push notification service must be available and operational.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API endpoint for this status update must have a 95th percentile (P95) latency under 200ms as per REQ-NFR-001.
- The end-to-end time from the Rider tapping the button to the UI confirming success should be under 1.5 seconds on a stable 4G connection.

## 7.2.0.0 Security

- The API endpoint must be protected and accessible only by an authenticated user with a 'Rider' role.
- The system must perform an authorization check to ensure the authenticated rider is the one assigned to the specific order they are trying to update.
- All communication must be over HTTPS/TLS 1.2+ as per REQ-INT-004.

## 7.3.0.0 Usability

- The action must be achievable with a single tap to accommodate a rider who is busy and on the move.

## 7.4.0.0 Accessibility

- The UI must adhere to WCAG 2.1 Level AA guidelines.

## 7.5.0.0 Compatibility

- The feature must be fully functional on supported versions of iOS and Android.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Orchestration of multiple downstream events: database update, notification, triggering location service, and updating multiple clients (Customer, Vendor).
- Requirement for robust offline handling and state synchronization.
- Need for an atomic transaction or a Saga pattern to ensure data consistency across services if multiple microservices are updated.

## 8.3.0.0 Technical Risks

- Race conditions where a cancellation event occurs simultaneously with the pickup confirmation.
- Failure in one of the downstream systems (e.g., notification service) could lead to an inconsistent user experience. A decoupled, event-driven approach is recommended.

## 8.4.0.0 Integration Points

- Rider App -> API Gateway -> Order Management Service
- Order Management Service -> Message Bus (SQS/SNS)
- Message Bus -> Notification Service
- Message Bus -> Rider Logistics Service
- WebSocket Server -> Customer App & Vendor Dashboard

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Usability
- Network Condition Testing

## 9.2.0.0 Test Scenarios

- Verify successful pickup confirmation and all downstream effects.
- Test offline scenario: tap button, go online, verify automatic sync.
- Test API failure scenario with mocked server error.
- Test cancellation race condition.
- Verify that a rider cannot confirm pickup for an order not assigned to them.

## 9.3.0.0 Test Data Needs

- A registered Rider user.
- A registered Customer user.
- A registered Vendor user.
- An order created and progressed to the 'Ready for Pickup' state and assigned to the test Rider.

## 9.4.0.0 Testing Tools

- Jest (Unit/Integration)
- Cypress/Appium (E2E)
- Postman/Insomnia (API Testing)
- Network link conditioner for simulating poor connectivity.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >= 80% code coverage.
- Automated E2E test scenario for the happy path is created and passing.
- UI/UX has been reviewed and approved by the design team.
- Performance of the API endpoint is verified to be within the defined limits (P95 < 200ms).
- Security checks (authentication and authorization) are confirmed to be in place.
- Relevant documentation (e.g., API spec) has been updated.
- The feature has been successfully deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is a critical enabler for the entire live tracking feature set. It should be prioritized early in the development of the delivery execution module.
- Requires coordination between frontend (Rider app) and multiple backend services.

## 11.4.0.0 Release Impact

This is a core feature for the Minimum Viable Product (MVP). The platform cannot function without this essential order state transition.

