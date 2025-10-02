# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | SYS-001 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | System Auto-Rejects Unattended Vendor Orders |
| As A User Story | As a Platform Administrator, I want the system to ... |
| User Persona | System (acting on behalf of Platform Administrator... |
| Business Value | Improves customer experience by preventing indefin... |
| Functional Area | Order Management |
| Story Theme | Order Lifecycle Automation |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

A prepaid order is automatically rejected after the default timeout period.

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

A customer has placed a prepaid order, its status is 'Pending Vendor Acceptance', and the vendor acceptance time limit is configured to the default of 5 minutes.

### 3.1.5 When

5 minutes pass without the vendor accepting or rejecting the order.

### 3.1.6 Then

The system must automatically change the order status to 'Cancelled', trigger a notification to the customer about the cancellation, initiate a full refund to the original payment method, and record an event in the order's immutable log with 'System' as the actor and 'Vendor Timeout' as the reason.

### 3.1.7 Validation Notes

Verify the order status in the database is 'Cancelled'. Check the notification logs for the customer alert. Verify a refund transaction has been initiated via the payment gateway API logs. Check the order event log for the system-triggered entry.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

A Cash on Delivery (COD) order is automatically rejected.

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

A customer has placed a COD order, its status is 'Pending Vendor Acceptance', and the vendor acceptance time limit is 5 minutes.

### 3.2.5 When

5 minutes pass without the vendor acting on the order.

### 3.2.6 Then

The system must change the order status to 'Cancelled', notify the customer, and record the event in the order log. The system must NOT initiate any refund process.

### 3.2.7 Validation Notes

Verify the order status is 'Cancelled' and confirm that no refund-related API calls were made to the payment service.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

The auto-rejection process is cancelled if the vendor accepts the order.

### 3.3.3 Scenario Type

Edge_Case

### 3.3.4 Given

An order is in 'Pending Vendor Acceptance' and the 5-minute auto-rejection timer is active.

### 3.3.5 When

The vendor manually accepts the order before the 5-minute timer expires.

### 3.3.6 Then

The order status must change to 'Accepted', and the scheduled auto-rejection task for this order must be cancelled and must not execute.

### 3.3.7 Validation Notes

Place an order, have the vendor accept it at T-minus 10 seconds, wait for another minute, and confirm the order status remains 'Accepted' and was not changed to 'Cancelled'.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

The auto-rejection process is cancelled if the vendor rejects the order.

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

An order is in 'Pending Vendor Acceptance' and the 5-minute auto-rejection timer is active.

### 3.4.5 When

The vendor manually rejects the order before the 5-minute timer expires.

### 3.4.6 Then

The order status must change to 'Cancelled' (by the vendor), and the scheduled auto-rejection task for this order must be cancelled and must not execute.

### 3.4.7 Validation Notes

Place an order, have the vendor reject it, and confirm the order event log shows the vendor as the actor, not the system.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

The system uses a custom, administrator-configured timeout value.

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

An administrator has configured the vendor acceptance time limit to 3 minutes.

### 3.5.5 When

A new order is placed and 3 minutes pass without vendor action.

### 3.5.6 Then

The system must automatically reject the order exactly after the 3-minute custom period.

### 3.5.7 Validation Notes

Set the configuration value to 3 minutes. Place an order and verify it is cancelled at the 3-minute mark, not the 5-minute default.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Failure to send a customer notification does not block order cancellation.

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

An order's acceptance timer has expired and the external notification service (FCM/SNS) is unavailable.

### 3.6.5 When

The system attempts to auto-reject the order.

### 3.6.6 Then

The order status must still be successfully changed to 'Cancelled' and the refund (if applicable) must be initiated. The system must log the failure to send the notification for later retry or alerting.

### 3.6.7 Validation Notes

Using a mock service, simulate a failure from the notification service and verify the order state is still updated correctly in the database and the error is logged.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- This is a backend story. No new UI elements are created.

## 4.2.0 User Interactions

- No direct user interaction. This is a system-automated process.

## 4.3.0 Display Requirements

- Customer App: The order in the order history must display the status 'Cancelled'.
- Vendor Dashboard: The timed-out order must be removed from the 'New Orders' queue.
- Admin Dashboard: The order event log must show the cancellation event with 'System' as the actor.

## 4.4.0 Accessibility Needs

- Not applicable for this backend story.

# 5.0.0 Business Rules

- {'rule_id': 'BR-SYS-001', 'rule_description': "An order in 'Pending Vendor Acceptance' state must be actioned by the vendor within the administrator-configured time limit.", 'enforcement_point': 'Order Management Service, triggered by a time-based mechanism.', 'violation_handling': "The order is automatically transitioned to the 'Cancelled' state."}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

REQ-FUN-010

#### 6.1.1.2 Dependency Reason

Requires the existence of the vendor order management flow, including the 'Pending Vendor Acceptance' state.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

REQ-FUN-017

#### 6.1.2.2 Dependency Reason

Requires the order lifecycle state machine, including the 'Cancelled' state and the refund processing logic.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

REQ-FUN-014

#### 6.1.3.2 Dependency Reason

Requires the administrator's ability to configure the timeout value that this story will use.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

REQ-INT-003

#### 6.1.4.2 Dependency Reason

Requires the notification system to be in place to alert the customer of the cancellation.

## 6.2.0.0 Technical Dependencies

- Order Management microservice
- A reliable, persistent scheduling mechanism (e.g., AWS SQS with Delay Seconds, or a Redis-based scheduler)
- Notification microservice
- Payments & Settlements microservice (for refunds)

## 6.3.0.0 Data Dependencies

- Access to order data, specifically its current status and creation timestamp.
- Access to the platform configuration for the vendor acceptance timeout value.

## 6.4.0.0 External Dependencies

- External notification providers (FCM, SNS)
- External payment gateway (Razorpay) for initiating refunds.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The mechanism for detecting timed-out orders must be scalable and not degrade database performance as the number of concurrent pending orders increases.
- The time from expiry to the order status being updated should be less than 10 seconds.

## 7.2.0.0 Security

- The process must have the correct permissions to modify order status and trigger notifications/refunds, but no more.

## 7.3.0.0 Usability

- Not applicable.

## 7.4.0.0 Accessibility

- Not applicable.

## 7.5.0.0 Compatibility

- Not applicable.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires a robust, persistent, and scalable time-based job execution mechanism.
- Involves orchestration across multiple microservices (Orders, Notifications, Payments).
- Must handle race conditions where a vendor acts on an order at the exact moment the timeout expires.
- Requires robust error handling for external service failures (notifications, payments).

## 8.3.0.0 Technical Risks

- Using a simple cron job that scans the database could lead to performance bottlenecks at scale.
- A stateless implementation could lose track of timers during a system restart, leading to missed cancellations.

## 8.4.0.0 Integration Points

- Order Database: To check and update order status.
- Configuration Service/DB: To fetch the timeout value.
- Message Bus (SQS/SNS): To trigger notifications and refund processes asynchronously.
- Payment Service API: To initiate refunds.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- Verify successful auto-rejection for both prepaid and COD orders.
- Verify the timer is correctly cancelled upon manual vendor acceptance/rejection.
- Verify that a non-default timeout configuration is respected.
- Simulate and verify correct behavior during notification or payment service failures.

## 9.3.0.0 Test Data Needs

- Test accounts for customers, vendors, and admins.
- Ability to place both prepaid and COD orders.
- Mechanism to modify the timeout configuration value in the test environment.
- Mock services for external dependencies (notifications, payments) to simulate failures.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- Supertest or similar for integration/API tests.
- Cypress for E2E tests.
- AWS SDK mocks for testing interactions with SQS/SNS.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one other engineer
- Unit and integration tests implemented with >80% coverage for the new logic
- The automated process is deployed and verified in the staging environment
- Logging is in place to monitor the success and failure of auto-rejections
- Documentation for the configuration and behavior of this feature is updated in the operational runbook

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational feature for ensuring a good customer experience and should be prioritized early in the development of the order lifecycle.
- Requires coordination between developers working on the Order, Notification, and Payment services.

## 11.4.0.0 Release Impact

- Critical for public launch. The platform cannot go live without a mechanism to handle unresponsive vendors.

