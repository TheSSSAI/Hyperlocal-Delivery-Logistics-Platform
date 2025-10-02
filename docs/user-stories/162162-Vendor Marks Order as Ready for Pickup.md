# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | VND-021 |
| Elaboration Date | 2024-05-22 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Vendor Marks Order as Ready for Pickup |
| As A User Story | As a Vendor, I want to mark an order as 'Ready for... |
| User Persona | A Vendor user (e.g., store manager, kitchen staff)... |
| Business Value | This action is the critical trigger for the logist... |
| Functional Area | Vendor-Facing Features |
| Story Theme | Vendor Order Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Happy Path: Vendor successfully marks an order as ready for pickup

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a Vendor is logged into the Vendor Dashboard and is viewing an order with the status 'Preparing'

### 3.1.5 When

the Vendor clicks the 'Ready for Pickup' button for that order

### 3.1.6 Then

the system updates the order's status to 'Ready for Pickup', the UI on the dashboard reflects this new status, an 'OrderReadyForPickup' event is published to the message bus to trigger the rider allocation service, and an entry is added to the immutable order event log capturing the state change, timestamp, and actor.

### 3.1.7 Validation Notes

Verify via UI change. Check database for order status update. Check message bus (e.g., SQS) for the new event. Query the order event log table for the new record.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

UI Feedback: Button provides immediate feedback on click

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

a Vendor is viewing an order in the 'Preparing' state

### 3.2.5 When

the Vendor clicks the 'Ready for Pickup' button

### 3.2.6 Then

the button immediately enters a disabled/loading state to prevent multiple clicks and provide visual feedback that the action is being processed.

### 3.2.7 Validation Notes

Manually test the UI interaction. The button should become unresponsive for the duration of the API call.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Alternative Path: Action is available for 'Accepted' status

### 3.3.3 Scenario Type

Alternative_Flow

### 3.3.4 Given

a Vendor is viewing an order with the status 'Accepted'

### 3.3.5 When

the Vendor clicks the 'Ready for Pickup' button

### 3.3.6 Then

the system successfully updates the order's status to 'Ready for Pickup' and triggers the rider allocation process.

### 3.3.7 Validation Notes

This covers cases where a vendor might skip the 'Preparing' state for very quick orders. The flow should be identical to AC-001.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Error Condition: Action is not available for incorrect order statuses

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

a Vendor is viewing an order with a status of 'Pending Vendor Acceptance', 'In Transit', 'Delivered', or 'Cancelled'

### 3.4.5 When

the Vendor views the order details

### 3.4.6 Then

the 'Ready for Pickup' button must not be visible or must be in a permanently disabled state.

### 3.4.7 Validation Notes

Create test orders in each of these states and verify the button is not actionable in the UI.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Error Condition: Network failure on status update

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

a Vendor clicks the 'Ready for Pickup' button

### 3.5.5 When

the API call to the backend fails due to a network error (e.g., loss of internet connection)

### 3.5.6 Then

the UI displays a non-blocking error message (e.g., 'Failed to update order. Please check your connection and try again.'), the order status in the UI remains 'Preparing', and the button returns to an active state allowing for a retry.

### 3.5.7 Validation Notes

Use browser developer tools to simulate network failure and verify the UI response.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Edge Case: User double-clicks the button

### 3.6.3 Scenario Type

Edge_Case

### 3.6.4 Given

a Vendor is viewing an order in the 'Preparing' state

### 3.6.5 When

the Vendor clicks the 'Ready for Pickup' button multiple times in quick succession

### 3.6.6 Then

the system must process the state change only once, and the backend endpoint must be idempotent.

### 3.6.7 Validation Notes

Verify that only one 'OrderReadyForPickup' event is generated and only one entry is added to the order event log. The UI should prevent this via immediate button disabling (AC-002).

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A clearly labeled button, e.g., 'Ready for Pickup', on the active order card/details view.
- A visual indicator (e.g., status tag) on the order that displays the current status ('Preparing', 'Ready for Pickup', etc.).
- A loading spinner or indicator for the button's disabled state.
- A non-modal toast or snackbar for displaying success or error messages.

## 4.2.0 User Interactions

- Clicking the 'Ready for Pickup' button triggers the state change.
- The button must be disabled during the API call to prevent duplicate submissions.
- The order may visually move from a 'Preparing' section to a 'Waiting for Pickup' section on the main dashboard view.

## 4.3.0 Display Requirements

- The order status must update in real-time on the dashboard upon successful completion of the action.

## 4.4.0 Accessibility Needs

- The button must be keyboard-focusable and operable.
- The loading state should be announced by screen readers.
- Error and success messages must be accessible via ARIA live regions.

# 5.0.0 Business Rules

- {'rule_id': 'BR-VND-021-01', 'rule_description': "An order can only be marked 'Ready for Pickup' if its current status is 'Accepted' or 'Preparing'.", 'enforcement_point': 'Backend API: The Order Management service must validate the current order state before allowing the transition.', 'violation_handling': "If the rule is violated, the API must return a 409 Conflict error with a message like 'Order is not in a state that can be marked as ready for pickup'."}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

VND-017

#### 6.1.1.2 Dependency Reason

An order must first be accepted by a vendor before it can be prepared and marked as ready for pickup. This story relies on the 'Accepted' status being available.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

REQ-FUN-017

#### 6.1.2.2 Dependency Reason

This story requires the existence of the order lifecycle management system and the immutable order event log to record the state transition.

## 6.2.0.0 Technical Dependencies

- Order Management Microservice: Must expose a secure, idempotent API endpoint to update the order status.
- Message Bus (AWS SQS/SNS): Must be configured to handle the 'OrderReadyForPickup' event.
- Vendor Web Dashboard Frontend: Must have the UI components to display the order and the action button.

## 6.3.0.0 Data Dependencies

- An 'Order' data model with a state machine that defines valid transitions, including 'Preparing' -> 'Ready for Pickup'.

## 6.4.0.0 External Dependencies

- This story triggers the Rider Allocation process (REQ-FUN-018), creating a dependency on the Rider Logistics service to be ready to consume the 'OrderReadyForPickup' event.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The P95 latency for the API call to update the order status must be under 200ms as per REQ-NFR-001.
- The time from the successful API response to the UI reflecting the change must be under 100ms.

## 7.2.0.0 Security

- The API endpoint must be authenticated and authorized, ensuring only the vendor assigned to the order can perform this action.
- The action must be logged in an audit trail as per REQ-NFR-008.

## 7.3.0.0 Usability

- The action must be prominent and intuitive for vendors managing multiple orders under time pressure.

## 7.4.0.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards as per REQ-INT-001.

## 7.5.0.0 Compatibility

- The feature must function correctly on all supported modern web browsers for the Vendor Dashboard.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires coordination between multiple microservices (Order Management, Rider Logistics, Notifications) via an event-driven architecture.
- The API endpoint must be designed to be idempotent to handle network retries and prevent duplicate events.
- Implementing a robust state machine in the Order Management service to enforce valid transitions adds complexity.
- Consideration of the Transactional Outbox pattern is needed to ensure atomicity between updating the database and publishing the event.

## 8.3.0.0 Technical Risks

- Failure to publish the event after a successful database commit could leave an order stranded, with no rider ever being allocated. This risk must be mitigated (e.g., via Transactional Outbox or a reconciliation job).
- An incorrect event contract (payload) could cause the downstream Rider Logistics service to fail.

## 8.4.0.0 Integration Points

- Order Management Service API (for the frontend call).
- AWS SQS/SNS (for publishing the 'OrderReadyForPickup' event).
- Rider Logistics Service (as the consumer of the event).

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- Verify a vendor can mark an 'Accepted' order as ready.
- Verify a vendor can mark a 'Preparing' order as ready.
- Verify the button is disabled for an 'In Transit' order.
- Simulate an API failure and verify the UI handles the error correctly.
- Verify via a downstream listener or mock that the 'OrderReadyForPickup' event is correctly published upon successful status change.

## 9.3.0.0 Test Data Needs

- Test accounts for vendors.
- Orders in various states: 'Accepted', 'Preparing', 'In Transit', 'Delivered', 'Cancelled'.

## 9.4.0.0 Testing Tools

- Jest and React Testing Library for frontend unit/integration tests.
- Jest for backend unit/integration tests.
- Cypress for end-to-end testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and passing with at least 80% code coverage.
- An automated end-to-end test for the happy path scenario has been created and is passing.
- The event contract for 'OrderReadyForPickup' is documented and shared with the consuming team.
- The state transition logic is validated against the order state machine diagram.
- Performance of the API endpoint meets the specified NFRs.
- The feature has been verified by QA and a Product Owner.
- All related documentation (e.g., API docs, runbooks) has been updated.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

3

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a critical-path story for the core order fulfillment workflow.
- Requires alignment with the team building the Rider Logistics service on the event schema before backend work can be completed.

## 11.4.0.0 Release Impact

This feature is essential for a minimum viable product (MVP) launch. The platform cannot fulfill orders without it.

