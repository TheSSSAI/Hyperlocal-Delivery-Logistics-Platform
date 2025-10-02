# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | CUS-035 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Customer Cancels Order with a Fee After Rider Assi... |
| As A User Story | As a customer who has placed an order, I want to c... |
| User Persona | Registered Customer who has placed an order that i... |
| Business Value | Provides a fair cancellation policy that balances ... |
| Functional Area | Order Management |
| Story Theme | Customer Order Lifecycle |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Successful cancellation of a prepaid order after rider assignment

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a customer has a prepaid order with a status of 'Accepted', 'Preparing', 'Ready for Pickup', or 'In Transit'

### 3.1.5 When

the customer navigates to the order tracking screen and taps the 'Cancel Order' button

### 3.1.6 And

the customer's order details screen updates to show the 'Cancelled' status, the fee applied, and the refund amount.

### 3.1.7 Then

the order status in the system is immediately updated to 'Cancelled'

### 3.1.8 Validation Notes

Verify the order status change in the database. Check notification logs for vendor and rider. Check payment gateway logs for the refund transaction. Verify the UI update on the customer's device.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Cancellation of a Cash on Delivery (COD) order after rider assignment

### 3.2.3 Scenario Type

Alternative_Flow

### 3.2.4 Given

a customer has a COD order with a status where a rider has been assigned

### 3.2.5 When

the customer confirms the cancellation via the confirmation modal

### 3.2.6 Then

the order status is updated to 'Cancelled'

### 3.2.7 And

the customer is notified that the fee will be added to their next order or must be cleared before placing a new one.

### 3.2.8 Validation Notes

Verify the customer's account in the database has an outstanding balance equal to the cancellation fee. The exact implementation of collecting this fee (e.g., blocking next order) depends on related stories.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Customer aborts the cancellation process

### 3.3.3 Scenario Type

Alternative_Flow

### 3.3.4 Given

the cancellation confirmation modal is displayed to the customer

### 3.3.5 When

the customer taps 'Keep Order' or closes the modal

### 3.3.6 Then

the modal is dismissed and the order status remains unchanged

### 3.3.7 And

the delivery process continues as normal.

### 3.3.8 Validation Notes

Verify that no state changes occur and no notifications are sent. The order should proceed without interruption.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

System handles refund processing failure

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

a customer has confirmed cancellation for a prepaid order

### 3.4.5 When

the system's attempt to process the partial refund via the payment gateway API fails

### 3.4.6 Then

the order status is still updated to 'Cancelled'

### 3.4.7 And

the customer is shown a message like 'Your order is cancelled. Your refund is being processed and will be credited within 24 hours.'

### 3.4.8 Validation Notes

Check the order's transaction log for the 'Refund_Failed' flag. Verify that an alert is logged or sent to the monitoring system (e.g., Prometheus Alertmanager).

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Cancellation is prevented if order is already delivered

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

a customer is on the cancellation confirmation screen

### 3.5.5 When

the order status is updated to 'Delivered' by the rider just before the customer confirms the cancellation

### 3.5.6 Then

the cancellation request fails

### 3.5.7 And

the order screen refreshes to show the 'Delivered' status.

### 3.5.8 Validation Notes

This requires testing a race condition. The cancellation API endpoint must perform a final status check before proceeding.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A 'Cancel Order' button on the active order tracking/details screen.
- A confirmation modal/dialog box.
- Confirmation buttons within the modal (e.g., 'Proceed with Cancellation', 'Keep Order').

## 4.2.0 User Interactions

- Tapping 'Cancel Order' must trigger the confirmation modal.
- The modal must require an explicit user action (tapping a button) to be dismissed.
- After cancellation, the order screen should automatically refresh to show the final status.

## 4.3.0 Display Requirements

- The confirmation modal must explicitly display the monetary value of the cancellation fee (e.g., '₹50').
- After cancellation, the order history must clearly show the 'Cancelled' status, the fee charged, and the refund amount.

## 4.4.0 Accessibility Needs

- All buttons and the modal must be accessible to screen readers with appropriate labels.
- The text must have sufficient contrast to meet WCAG 2.1 AA standards.

# 5.0.0 Business Rules

- {'rule_id': 'REQ-BR-003', 'rule_description': 'A fixed cancellation fee, configurable by an administrator, shall be applied if the cancellation occurs after a rider has been assigned to the order.', 'enforcement_point': 'During the order cancellation process, triggered by the customer.', 'violation_handling': 'N/A - This rule is enforced by the system logic.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

CUS-025

#### 6.1.1.2 Dependency Reason

A completed order with a successful online payment is required to test the partial refund functionality.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

CUS-028

#### 6.1.2.2 Dependency Reason

The UI for order tracking is the logical location for the 'Cancel Order' button.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

ADM-010

#### 6.1.3.2 Dependency Reason

The system must be able to fetch the configurable cancellation fee amount defined by this story.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

RDR-012

#### 6.1.4.2 Dependency Reason

The system needs a mechanism to assign a rider to an order, as this is the trigger condition for the fee.

## 6.2.0.0 Technical Dependencies

- Order Management Service: To handle order state transitions.
- Payment Service: To process partial refunds via the Razorpay API.
- Notification Service: To send alerts to vendors and riders.
- Rider Logistics Service: To de-allocate the rider from the cancelled task.

## 6.3.0.0 Data Dependencies

- Access to order data, including current status and payment details.
- Access to system configuration to retrieve the cancellation fee amount.

## 6.4.0.0 External Dependencies

- Razorpay Payment Gateway: The refund API must be available and integrated.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API call to process the cancellation must have a P95 latency of under 1000ms, as it involves coordination between services.

## 7.2.0.0 Security

- The cancellation API endpoint must be secured to ensure only the owner of the order can initiate cancellation.
- All financial transactions (refunds, fee application) must be logged in an immutable audit trail.

## 7.3.0.0 Usability

- The cancellation fee and the consequence of cancelling must be communicated unambiguously to the user before they confirm.

## 7.4.0.0 Accessibility

- Compliance with WCAG 2.1 Level AA for all UI elements.

## 7.5.0.0 Compatibility

- Functionality must be consistent across supported versions of iOS and Android.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires a distributed transaction (Saga pattern) to coordinate state changes across Order, Payment, and Rider services.
- Robust error handling is critical, especially for payment gateway failures.
- Handling race conditions where order status changes (e.g., to 'Delivered') during the cancellation attempt.
- Logic for managing cancellation fees for COD orders as a user account debt.

## 8.3.0.0 Technical Risks

- Potential for inconsistent state if one part of the cancellation saga fails (e.g., order is cancelled but refund fails). A retry mechanism with dead-letter queues and alerting is required.
- Dependency on the reliability and response time of the external payment gateway's refund API.

## 8.4.0.0 Integration Points

- Order Service -> Payment Service (initiate refund)
- Order Service -> Notification Service (send alerts)
- Order Service -> Rider Logistics Service (free up rider)

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Verify successful cancellation and partial refund for a prepaid order.
- Verify successful cancellation and fee application for a COD order.
- Verify the user can abort the cancellation flow without any side effects.
- Simulate a payment gateway refund failure and verify the system's error handling and alerting.
- Simulate a race condition by attempting to cancel an order that is simultaneously being marked as delivered.

## 9.3.0.0 Test Data Needs

- User accounts with placed orders (both prepaid and COD).
- Orders in various states: 'Accepted', 'Preparing', 'In Transit'.
- Mocked payment gateway responses for success and failure scenarios.

## 9.4.0.0 Testing Tools

- Jest (Unit/Integration)
- Cypress (E2E)
- Postman/Insomnia (API testing)

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in the staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >80% code coverage for the new logic.
- End-to-end automated tests for the happy path and key error conditions are implemented and passing.
- The UI has been reviewed and approved by the UX/UI designer.
- Security review passed; endpoint is properly authenticated and authorized.
- All related documentation (e.g., API specs, runbooks for handling refund failures) has been updated.
- The feature has been successfully deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- Requires coordination between frontend and multiple backend developers due to the cross-service nature of the feature.
- Access to a sandbox environment for the Razorpay payment gateway is essential for testing.
- The business logic for handling COD cancellation fees as a debt needs to be finalized with the Product Owner before implementation begins.

## 11.4.0.0 Release Impact

This is a critical feature for customer satisfaction and operational efficiency. It should be included in the next major release after thorough testing.

