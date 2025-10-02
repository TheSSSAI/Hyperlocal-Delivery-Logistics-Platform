# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | VND-022 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Vendor Cancels an Accepted Order |
| As A User Story | As a Vendor, I want to cancel an order I have alre... |
| User Persona | A registered and approved Vendor using the vendor-... |
| Business Value | Provides a necessary operational capability for ve... |
| Functional Area | Vendor Order Management |
| Story Theme | Order Lifecycle Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Vendor successfully cancels a prepaid order before rider pickup

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a Vendor is logged into the dashboard and is viewing an order with status 'Accepted' or 'Preparing' that was paid for online

### 3.1.5 When

the Vendor clicks the 'Cancel Order' button, selects a reason (e.g., 'Item out of stock') from a modal, and confirms the cancellation

### 3.1.6 Then

the system must: 1. Update the order status to 'Cancelled'. 2. Initiate a full refund to the customer's original payment method via the payment gateway. 3. Send a notification to the customer informing them of the cancellation and refund. 4. Log the cancellation event, including the reason, against the vendor's performance record. 5. If a rider was assigned, the system must cancel their delivery task and notify them.

### 3.1.7 Validation Notes

Verify in the admin panel that the order status is 'Cancelled'. Check payment gateway logs for a refund transaction. Verify customer receives a push notification/SMS. Check vendor performance metrics for a new cancellation entry. Verify the assigned rider's task is removed from their app.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Vendor successfully cancels a Cash on Delivery (COD) order

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

a Vendor is logged into the dashboard and is viewing a COD order with status 'Accepted' or 'Preparing'

### 3.2.5 When

the Vendor clicks the 'Cancel Order' button, selects a reason, and confirms

### 3.2.6 Then

the system must: 1. Update the order status to 'Cancelled'. 2. Send a notification to the customer informing them of the cancellation. 3. Log the cancellation event against the vendor's performance record. 4. If a rider was assigned, their task must be cancelled.

### 3.2.7 Validation Notes

Verify order status changes to 'Cancelled'. Confirm no refund transaction is initiated. Verify customer notification is sent. Check vendor performance metrics.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Vendor attempts to cancel an order that has already been picked up

### 3.3.3 Scenario Type

Edge_Case

### 3.3.4 Given

a Vendor is viewing an order with status 'In Transit' or 'Delivered'

### 3.3.5 When

the Vendor navigates to the order details page

### 3.3.6 Then

the 'Cancel Order' button must be disabled or not visible, preventing the cancellation action.

### 3.3.7 Validation Notes

Inspect the UI on the vendor dashboard for an order in the 'In Transit' state and confirm the cancellation control is not available for interaction.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Vendor cancels the cancellation action

### 3.4.3 Scenario Type

Alternative_Flow

### 3.4.4 Given

a Vendor has clicked the 'Cancel Order' button and the confirmation modal is displayed

### 3.4.5 When

the Vendor clicks the 'Close' or 'Keep Order' button in the modal

### 3.4.6 Then

the modal must close, and the order's status must remain unchanged.

### 3.4.7 Validation Notes

Perform the action and refresh the page to ensure the order status has not changed.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

System handles a failed refund attempt after vendor cancellation

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

a Vendor has confirmed the cancellation of a prepaid order

### 3.5.5 When

the system calls the payment gateway API to process the refund, and the API returns a failure

### 3.5.6 Then

the system must: 1. Still update the order status to 'Cancelled'. 2. Place the refund into a 'Refund Failed' state. 3. Create a high-priority alert for an administrator to investigate and manually process the refund.

### 3.5.7 Validation Notes

Simulate a payment gateway failure in a test environment. Verify the order is marked 'Cancelled' and an alert is visible in the admin dashboard or sent via the alerting system.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A clearly labeled 'Cancel Order' button on the order details view for eligible orders.
- A confirmation modal dialog that appears upon clicking the cancel button.
- A mandatory dropdown menu within the modal for selecting a reason for cancellation (e.g., 'Item Unavailable', 'Kitchen Overloaded', 'Customer Requested Cancellation', 'Other').
- A confirmation button (e.g., 'Confirm Cancellation') and a dismiss button (e.g., 'Go Back') within the modal.

## 4.2.0 User Interactions

- Clicking 'Cancel Order' opens the confirmation modal.
- The 'Confirm Cancellation' button is disabled until a reason is selected.
- Upon successful cancellation, the UI should provide immediate feedback (e.g., a toast notification) and update the order's appearance in the order list to reflect its 'Cancelled' status.

## 4.3.0 Display Requirements

- The order details page must clearly show the current status of the order.
- The cancellation reason selected by the vendor must be stored and visible in the order's event log in the admin dashboard.

## 4.4.0 Accessibility Needs

- The confirmation modal must be keyboard-navigable and screen-reader accessible, conforming to WCAG 2.1 AA standards.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-VND-CANCEL-01

### 5.1.2 Rule Description

Vendors can only cancel orders that are in the 'Accepted' or 'Preparing' state. Cancellation is not permitted once the order is 'Ready for Pickup' or has been picked up by a rider ('In Transit').

### 5.1.3 Enforcement Point

API endpoint for order cancellation and Vendor Dashboard UI.

### 5.1.4 Violation Handling

The API will return a 403 Forbidden or 400 Bad Request error with a clear message. The UI will disable or hide the cancellation button.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-VND-CANCEL-02

### 5.2.2 Rule Description

Every vendor-initiated cancellation must be logged as a negative performance incident against the vendor's record, as per REQ-FUN-017.

### 5.2.3 Enforcement Point

Order Management microservice upon successful cancellation.

### 5.2.4 Violation Handling

This is a system process; failure to log should trigger a system alert as it impacts business analytics.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

VND-017

#### 6.1.1.2 Dependency Reason

An order must be accepted by a vendor before the option to cancel it becomes relevant.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-023

#### 6.1.2.2 Dependency Reason

The system needs the order event log functionality to trace the cancellation action for support and debugging.

## 6.2.0.0 Technical Dependencies

- Order Management microservice to handle state transitions.
- Payments & Settlements microservice to process refunds (as per REQ-FUN-021).
- Notification service (FCM/SNS) to inform the customer and rider (as per REQ-INT-003).
- A service or module for tracking vendor performance metrics.

## 6.3.0.0 Data Dependencies

- Requires access to the order's current state and payment details (type and transaction ID for refunds).

## 6.4.0.0 External Dependencies

- Razorpay payment gateway API for processing refunds on prepaid orders (as per REQ-INT-003).

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API call to cancel an order and receive confirmation should complete in under 500ms.
- The downstream asynchronous events (refund, notification) should be triggered within 1 second of the cancellation.

## 7.2.0.0 Security

- The API endpoint must be secured and only accessible by an authenticated vendor user.
- The vendor must only be able to cancel orders belonging to their own store.

## 7.3.0.0 Usability

- The cancellation process must be intuitive and require explicit confirmation to prevent accidental cancellations.

## 7.4.0.0 Accessibility

- All UI elements must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The feature must function correctly on all supported modern web browsers for the Vendor Dashboard.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires orchestration across multiple microservices (Orders, Payments, Notifications, Rider Logistics).
- Implementing a Saga pattern (as per REQ-ARC-001) to manage the distributed transaction is crucial for data consistency and handling failures (e.g., a refund failing after the order is cancelled).
- Integration with the external payment gateway's refund API requires careful error handling and idempotency.
- Logic is needed to check the order state and conditionally cancel an assigned rider's task.

## 8.3.0.0 Technical Risks

- Potential for inconsistent state if the Saga pattern is not implemented correctly. For example, an order is cancelled, but the refund fails and is not correctly flagged for manual intervention.
- Failure in the payment gateway's refund API could lead to customer support issues.

## 8.4.0.0 Integration Points

- Order Service -> Payment Service (to trigger refund)
- Order Service -> Notification Service (to alert customer/rider)
- Order Service -> Rider Logistics Service (to cancel task)
- Order Service -> Vendor Performance Service (to log metric)
- Payment Service -> Razorpay API

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- Verify cancellation of a prepaid order and successful refund.
- Verify cancellation of a COD order.
- Verify UI prevents cancellation of an order in transit.
- Verify the compensating transaction logic in the Saga for a failed refund.
- Verify customer and rider notifications are sent correctly upon cancellation.

## 9.3.0.0 Test Data Needs

- Vendor accounts.
- Prepaid orders in 'Accepted' and 'Preparing' states.
- COD orders in 'Accepted' and 'Preparing' states.
- Orders in 'In Transit' state.
- Test payment credentials for the Razorpay sandbox environment.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- Cypress for E2E testing of the vendor dashboard flow.
- Postman or similar for API integration testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in the staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written with at least 80% coverage for the new logic.
- E2E tests for the cancellation flow are passing.
- The refund process has been successfully tested against the payment gateway's sandbox.
- The vendor performance metric is correctly logged and verifiable.
- All related documentation (e.g., API specs, runbooks) has been updated.
- Feature has been successfully deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story requires backend work across multiple services. It may require coordination between multiple developers or teams.
- Access to a stable payment gateway sandbox is required for testing.
- The implementation of the Saga pattern for this flow should be carefully designed before coding begins.

## 11.4.0.0 Release Impact

This is a critical feature for vendor operations and platform quality management. It should be included in the next major release after the core ordering flow is stable.

