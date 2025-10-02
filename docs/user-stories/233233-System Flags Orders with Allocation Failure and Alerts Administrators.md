# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | SYS-003 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | System Flags Orders with Allocation Failure and Al... |
| As A User Story | As the System (Rider Logistics Service), I want to... |
| User Persona | System (Automated Process), Administrator (Recipie... |
| Business Value | Prevents orders from getting stuck in an unresolva... |
| Functional Area | Rider Logistics & Order Management |
| Story Theme | Order Fulfillment Resilience |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Order status is updated to 'Allocation Failed' after configurable attempts and timeout

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

An order is in the 'Ready for Pickup' state and the rider allocation process is active.

### 3.1.5 And

The order's event log must contain an entry for the state change, including the reason 'Rider allocation failed after 3 attempts.'

### 3.1.6 When

The system fails to secure a rider after the 3rd attempt, and the 5-minute window has elapsed.

### 3.1.7 Then

The order's status must be atomically updated to 'Allocation Failed' in the Order Management service.

### 3.1.8 Validation Notes

Verify the order status in the database and check the order's event log via API or database query.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

A high-priority alert is triggered for administrators upon allocation failure

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

An order's status has just been changed to 'Allocation Failed'.

### 3.2.5 When

The state transition is successfully committed.

### 3.2.6 Then

A high-priority alert event is published to the notification system (e.g., SNS topic for critical alerts).

### 3.2.7 And

The alert payload must contain at least the Order ID, Vendor ID, Customer ID, the operational zone, and the timestamp of the failure.

### 3.2.8 Validation Notes

Monitor the notification system (e.g., CloudWatch logs for the SNS topic, or a test webhook endpoint) to confirm the alert is generated with the correct payload.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Allocation process stops for orders in 'Allocation Failed' state

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

An order's status is 'Allocation Failed'.

### 3.3.5 When

The Rider Logistics service scans for orders needing a rider.

### 3.3.6 Then

The service must explicitly ignore this order and make no further attempts to assign it to a rider.

### 3.3.7 Validation Notes

In a test environment, after an order fails, confirm that no new rider assignment events are triggered for that Order ID by checking application logs.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Allocation succeeds before failure threshold is met

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

An order is in the 'Ready for Pickup' state.

### 3.4.5 And

No failure alert is generated.

### 3.4.6 When

The 3rd rider accepts the assignment within their allotted time.

### 3.4.7 Then

The order's status proceeds to the next state (e.g., 'In Transit').

### 3.4.8 Validation Notes

Run an E2E test where a mock rider accepts the task on the final attempt and verify the order status and absence of an admin alert.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

System handles failure to send an alert gracefully

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

An order meets the criteria for allocation failure.

### 3.5.5 And

The system should trigger a separate monitoring alarm (e.g., via Prometheus/Grafana) for the high rate of notification failures.

### 3.5.6 When

The system changes the order status to 'Allocation Failed' and attempts to send an alert.

### 3.5.7 Then

The order status update to 'Allocation Failed' must succeed.

### 3.5.8 Validation Notes

Use a mock notification service that returns a 500 error. Verify the order status is updated correctly and check the logs for the specific error message.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Admin Dashboard: A notification/alert panel for critical issues.
- Admin Dashboard: A filterable list/view for orders with the 'Allocation Failed' status.

## 4.2.0 User Interactions

- Administrator must be able to click on an 'Allocation Failed' alert to navigate directly to the corresponding order's detail page for manual intervention.

## 4.3.0 Display Requirements

- The alert on the admin dashboard must clearly display the Order ID and time of failure.
- The order detail page for a failed order must prominently display the 'Allocation Failed' status and the reason.

## 4.4.0 Accessibility Needs

- Alerts on the admin dashboard must be accessible via screen readers and keyboard navigation.

# 5.0.0 Business Rules

- {'rule_id': 'BR-SYS-003-01', 'rule_description': 'An order allocation is considered a failure if a rider is not secured after 3 assignment attempts over a 5-minute period.', 'enforcement_point': 'Rider Logistics Service, during the rider assignment process.', 'violation_handling': "The order status is changed to 'Allocation Failed' and an alert is triggered."}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

REQ-FUN-018

#### 6.1.1.2 Dependency Reason

The core rider allocation algorithm, including logic for offering tasks to riders, must be implemented first.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

REQ-FUN-017

#### 6.1.2.2 Dependency Reason

The order state machine must be defined and implemented, with 'Allocation Failed' added as a valid terminal or intermediate state.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

REQ-REP-002

#### 6.1.3.2 Dependency Reason

The monitoring and alerting infrastructure (e.g., Prometheus, Grafana, SNS) must be in place to receive and process the generated alerts.

## 6.2.0.0 Technical Dependencies

- Order Management Service: Must expose an API or event listener to update an order's status.
- Rider Logistics Service: Must contain the stateful logic to track assignment attempts and timers.
- Notification Service/Infrastructure: An SNS topic or equivalent message bus for dispatching critical alerts.

## 6.3.0.0 Data Dependencies

- The 'orders' table must have its status enum updated to include 'Allocation Failed'.
- The 'order_events' table must be able to log this specific failure event.

## 6.4.0.0 External Dependencies

- None

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The process of checking for failure conditions should add less than 5ms of latency to the allocation loop.
- The state update and alert generation must complete within 200ms after the failure condition is confirmed.

## 7.2.0.0 Security

- The alert payload sent to the notification system must not contain sensitive customer PII beyond what is necessary for identification (e.g., Customer ID, not name or address).

## 7.3.0.0 Usability

- The resulting alert for the administrator must be clear, concise, and actionable.

## 7.4.0.0 Accessibility

- N/A for this backend story, but applies to the UI that consumes the alert.

## 7.5.0.0 Compatibility

- N/A

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires state management for tracking attempts and timers, potentially using Redis for distributed locks or counters.
- Involves cross-service communication (Rider Logistics -> Order Management -> Notification Service), which must be reliable and idempotent.
- Race conditions must be handled, e.g., an admin manually intervening at the exact moment the system flags the order as failed.
- Configuration for thresholds (attempts, time) must be externalized and dynamically loadable.

## 8.3.0.0 Technical Risks

- Potential for inconsistent state between services if the event-driven communication fails. A Saga pattern or a reconciliation job might be needed for robustness.
- If Redis or a similar in-memory store is used for tracking, its availability becomes critical for the allocation process.

## 8.4.0.0 Integration Points

- Rider Logistics Service -> Message Bus (SQS/SNS)
- Message Bus -> Order Management Service (to update status)
- Message Bus -> Notification Service (to trigger alert)

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- Verify order fails after exactly 3 rejections.
- Verify order does not fail if accepted on the 3rd attempt.
- Verify the timeout logic correctly fails an order even with fewer than 3 attempts if 5 minutes pass.
- Verify the alert payload structure and content.
- Simulate notification service failure and confirm the system's graceful degradation.

## 9.3.0.0 Test Data Needs

- An order in 'Ready for Pickup' state.
- At least 3 mock riders in the same zone who can be programmed to reject tasks.
- Configuration values for failure thresholds.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- A message bus testing utility (e.g., localstack for SQS/SNS).
- Cypress or a similar framework for E2E tests, with backend hooks to simulate rider rejections.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in the staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >80% coverage for the new logic.
- E2E tests simulating the failure scenario are implemented and passing.
- The new configuration parameters (attempts, timeout) are documented in the service's configuration guide.
- The order state machine diagram and relevant technical documentation are updated.
- The alert is successfully received and displayed correctly on the staging admin dashboard.
- Story has been deployed and verified in the staging environment without regressions.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a critical feature for operational stability. It should be prioritized before launching in a new zone.
- Coordination may be required if the Order Management and Rider Logistics services are owned by different teams.
- The team needs access to a staging environment that mirrors the production alerting infrastructure.

## 11.4.0.0 Release Impact

Improves the reliability of the order fulfillment process. Reduces the need for manual monitoring of stuck orders and enables faster support response to delivery issues.

