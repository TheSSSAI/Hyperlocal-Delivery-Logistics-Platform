# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-015 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider Updates Order Status to 'Arrived at Store' |
| As A User Story | As a delivery rider who has accepted a task, I wan... |
| User Persona | Delivery Rider |
| Business Value | Provides real-time order tracking for the customer... |
| Functional Area | Rider-Facing Features |
| Story Theme | Delivery Execution & Status Updates |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Happy Path: Rider successfully updates status

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a rider is assigned to an active order with the status 'In Transit to Store'

### 3.1.5 When

the rider taps the 'Arrived at Store' button on their active task screen

### 3.1.6 Then

the system updates the order status to 'Arrived at Store', a timestamp for this event is recorded in the database, and the rider's app UI transitions to the 'Pickup' screen, displaying the 'Picked Up' button.

### 3.1.7 Validation Notes

Verify the order status change in the database via an admin tool or API call. Confirm the UI on the rider app changes as expected.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Customer is notified of rider's arrival

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

an order's status has been successfully updated to 'Arrived at Store'

### 3.2.5 When

the status update event is processed by the backend

### 3.2.6 Then

a push notification is sent to the customer with a message like 'Your rider has arrived at the store.'

### 3.2.7 Validation Notes

This can be verified by checking the notification service logs or using a test customer account to receive the notification.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Action is idempotent

### 3.3.3 Scenario Type

Edge_Case

### 3.3.4 Given

the order status is already 'Arrived at Store'

### 3.3.5 When

the system receives another request to update the status to 'Arrived at Store' for the same order

### 3.3.6 Then

the system should not change the state or return an error, and the original 'arrived_at_store' timestamp should be preserved.

### 3.3.7 Validation Notes

The UI should prevent this by disabling the button after the first successful tap, but the backend API must be robust enough to handle duplicate calls.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Network connection is unavailable

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

a rider is on the active task screen

### 3.4.5 When

the rider taps the 'Arrived at Store' button while their device is offline

### 3.4.6 Then

the app must display a clear error message (e.g., 'No internet connection. Retrying...') and queue the status update to be sent automatically once connectivity is restored.

### 3.4.7 Validation Notes

Test by enabling airplane mode on a test device, performing the action, and then re-enabling connectivity to see if the update is sent.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Backend server error occurs

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

a rider taps the 'Arrived at Store' button

### 3.5.5 When

the backend API returns a 5xx server error

### 3.5.6 Then

the app must display a user-friendly error message (e.g., 'Failed to update status. Please try again.') and the button must remain active for a retry.

### 3.5.7 Validation Notes

Use a tool like Postman or a mock server to simulate a 500 error response from the API and verify the app's behavior.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Attempting to update an order in a final state

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

an order has already been marked as 'Cancelled' or 'Delivered'

### 3.6.5 When

the backend receives a request to update its status to 'Arrived at Store'

### 3.6.6 Then

the backend must reject the request with a 409 Conflict status code and the rider's app should sync to reflect the order's final state.

### 3.6.7 Validation Notes

Manually set an order's status to 'Cancelled' in the database, then attempt to trigger the 'Arrived at Store' API call for that order.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A prominent, easily tappable button labeled 'Arrived at Store' on the active delivery task screen.
- A loading indicator/spinner to provide feedback after the button is tapped.
- An error message display area (e.g., a toast or snackbar) for connection or server errors.

## 4.2.0 User Interactions

- A single tap on the 'Arrived at Store' button triggers the status update.
- After a successful update, the button should be replaced by the next action button in the workflow (e.g., 'Picked Up').

## 4.3.0 Display Requirements

- The current order status should be clearly visible to the rider at all times.

## 4.4.0 Accessibility Needs

- The button must meet WCAG 2.1 AA standards for tap target size and color contrast.

# 5.0.0 Business Rules

- {'rule_id': 'BR-RDR-01', 'rule_description': "A rider can only mark an order as 'Arrived at Store' if the order is currently assigned to them and is in the 'In Transit to Store' state.", 'enforcement_point': 'Backend API (Order Management Service)', 'violation_handling': 'The API will return a 403 Forbidden or 409 Conflict error if the rule is violated.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-012

#### 6.1.1.2 Dependency Reason

A rider must be able to accept a task before they can arrive at the store.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

RDR-014

#### 6.1.2.2 Dependency Reason

This story defines the overall delivery execution flow and UI where the 'Arrived at Store' button will be placed.

## 6.2.0.0 Technical Dependencies

- Order Management microservice must expose a secure endpoint to update order status.
- Notification microservice must be able to consume an event and send a push notification to the customer.
- Authentication system (AWS Cognito) must be in place to secure the API endpoint.

## 6.3.0.0 Data Dependencies

- The `orders` data model must support a status field (e.g., an enum) and a timestamp field for `arrived_at_store_at`.

## 6.4.0.0 External Dependencies

- Firebase Cloud Messaging (FCM) or a similar push notification service must be integrated for customer notifications.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The P95 latency for the status update API call must be under 1000ms.
- The customer notification should be triggered within 2 seconds of the successful status update.

## 7.2.0.0 Security

- The API endpoint for updating order status must be authenticated and authorized, ensuring only the assigned rider can update their specific order.
- All communication must be over HTTPS/WSS.

## 7.3.0.0 Usability

- The action must be completable with a single tap to minimize distraction for the rider.

## 7.4.0.0 Accessibility

- Compliance with WCAG 2.1 Level AA for the rider application UI elements.

## 7.5.0.0 Compatibility

- The feature must function correctly on supported iOS and Android versions.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Low

## 8.2.0.0 Complexity Factors

- Requires coordinated changes in the rider mobile app (frontend) and the Order Management service (backend).
- Involves an asynchronous event publication for notifications.
- Client-side logic for offline handling adds minor complexity.

## 8.3.0.0 Technical Risks

- Implementing a robust offline-first strategy for the rider app can be challenging. The initial implementation may rely on a simple retry mechanism.
- Potential for race conditions if an order is cancelled by another actor (e.g., admin, customer) at the same moment the rider updates the status.

## 8.4.0.0 Integration Points

- Rider App -> API Gateway -> Order Management Service
- Order Management Service -> Message Bus (SQS/SNS) -> Notification Service

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- Verify successful status update and UI transition.
- Verify customer notification is sent.
- Test offline behavior: tap button, go online, verify update is sent.
- Test server error behavior and retry mechanism.
- Test unauthorized access attempt from a different rider.

## 9.3.0.0 Test Data Needs

- Test accounts for a rider and a customer.
- An order created and assigned to the test rider, in the 'In Transit to Store' state.

## 9.4.0.0 Testing Tools

- Jest & React Testing Library for frontend unit tests.
- Jest for backend unit/integration tests.
- Cypress or Appium for E2E testing.
- Postman for direct API testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code for both frontend and backend has been peer-reviewed and merged.
- Unit and integration tests are written and achieve >80% code coverage.
- E2E tests covering the happy path and key error conditions are passing.
- The API endpoint is documented in the OpenAPI specification.
- The feature has been verified on both iOS and Android physical test devices.
- Any related technical documentation has been updated.
- Product Owner has reviewed and accepted the feature.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

2

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a core feature of the delivery workflow and a blocker for subsequent delivery steps.
- Requires both frontend (React Native) and backend (NestJS) developer availability.

## 11.4.0.0 Release Impact

This feature is essential for the Minimum Viable Product (MVP) launch.

