# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-013 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider Rejects a Delivery Task |
| As A User Story | As a Rider, I want to reject a new delivery task o... |
| User Persona | A registered and 'Online' Rider using the rider mo... |
| Business Value | Improves rider autonomy and satisfaction. Enables ... |
| Functional Area | Rider-Facing Features |
| Story Theme | Rider Task Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

RDR-013-AC-01

### 3.1.2 Scenario

Rider successfully rejects a task offer

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a Rider is logged in, 'Online', and has received a new delivery task offer on their screen

### 3.1.5 When

the Rider taps the 'Reject' button within the configured time limit (default: 60 seconds)

### 3.1.6 Then

the task offer screen is immediately dismissed from the Rider's app

### 3.1.7 And

the backend system immediately triggers the re-assignment process for the order (as per SYS-002).

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

RDR-013-AC-02

### 3.2.2 Scenario

Task offer timer expires without rider action

### 3.2.3 Scenario Type

Edge_Case

### 3.2.4 Given

a Rider has received a new delivery task offer

### 3.2.5 When

the Rider takes no action (neither accepts nor rejects) and the offer timer expires

### 3.2.6 Then

the task offer screen is automatically dismissed from the Rider's app

### 3.2.7 And

the backend system triggers the re-assignment process for the order.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

RDR-013-AC-03

### 3.3.2 Scenario

Rider rejects a task that is no longer available

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

a Rider is viewing a task offer

### 3.3.5 And

the task offer screen is dismissed, returning the rider to their idle 'Online' state.

### 3.3.6 When

the Rider taps the 'Reject' button

### 3.3.7 Then

the app displays a non-blocking notification (e.g., a toast message) stating 'This task is no longer available'

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

RDR-013-AC-04

### 3.4.2 Scenario

Rider attempts to reject a task with no network connectivity

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

a Rider is viewing a task offer and their device loses network connectivity

### 3.4.5 When

the Rider taps the 'Reject' button

### 3.4.6 Then

the app provides immediate visual feedback that the action is pending (e.g., a spinner on the button)

### 3.4.7 And

if the network is not restored before the server-side timer expires, the app state will sync upon reconnection to show the task is gone.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

RDR-013-AC-05

### 3.5.2 Scenario

Rejection event is logged for analytics

### 3.5.3 Scenario Type

Happy_Path

### 3.5.4 Given

a Rider has rejected a task offer (either explicitly or via timeout)

### 3.5.5 When

the backend processes the rejection

### 3.5.6 Then

an immutable event is logged with the rider ID, task ID, timestamp, and rejection reason ('explicit' or 'timeout')

### 3.5.7 And

this event is published to a message bus for consumption by analytics and performance monitoring services.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A clearly labeled 'Reject' button on the new task offer screen.
- A countdown timer visual element as defined in REQ-FUN-013.

## 4.2.0 User Interactions

- Tapping the 'Reject' button must provide immediate visual feedback (e.g., button press state).
- Upon successful rejection, the task offer view must be dismissed with a smooth transition.

## 4.3.0 Display Requirements

- The 'Reject' button must be visually distinct from the 'Accept' button (e.g., using color, style, or placement) to prevent accidental taps.

## 4.4.0 Accessibility Needs

- The 'Reject' button must meet WCAG 2.1 AA standards for tap target size and color contrast.
- The button must have a proper accessibility label for screen readers (e.g., 'Reject Delivery Task').

# 5.0.0 Business Rules

- {'rule_id': 'BR-RDR-01', 'rule_description': 'A rider must accept or reject a task within the administrator-configured time limit (default: 60 seconds). Failure to act is considered an implicit rejection.', 'enforcement_point': 'Rider Logistics Service (backend)', 'violation_handling': 'The task offer is revoked from the rider and the re-assignment process is initiated.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-010

#### 6.1.1.2 Dependency Reason

The mechanism and UI for offering a new task to a rider must exist before the option to reject it can be implemented.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

SYS-002

#### 6.1.2.2 Dependency Reason

The system's ability to re-assign a rejected task is the direct outcome of this story. The rejection event triggers the re-assignment logic.

## 6.2.0.0 Technical Dependencies

- Rider Logistics Microservice: Must expose an endpoint to handle the task rejection.
- API Gateway: Must route requests to the rejection endpoint.
- Message Bus (AWS SQS/SNS): Required for publishing the 'task_rejected' event for decoupling and analytics.

## 6.3.0.0 Data Dependencies

- An order must exist in the 'Ready for Pickup' state to trigger the task allocation process.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API call to reject a task must have a P95 latency of under 500ms.
- The time from backend receiving the rejection to initiating the re-assignment to the next rider must be under 1 second.

## 7.2.0.0 Security

- The task rejection API endpoint must be secured via JWT authentication.
- Authorization logic must ensure that a rider can only reject a task that has been explicitly offered to them.

## 7.3.0.0 Usability

- The rejection action must be a single, unambiguous tap.
- The system should not require the rider to provide a reason for rejection to ensure speed, but the rejection itself is logged.

## 7.4.0.0 Accessibility

- All UI elements must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- Functionality must be consistent across all supported versions of iOS and Android for the Rider App.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Low

## 8.2.0.0 Complexity Factors

- Frontend work is minimal (adding a button and handler).
- Backend requires a simple state-change endpoint.
- The main consideration is ensuring the event is published correctly to trigger the re-assignment saga/workflow.

## 8.3.0.0 Technical Risks

- Potential for race conditions if not handled carefully, where a task is timed out by the server at the same moment the rider rejects it. The system must handle this idempotently.

## 8.4.0.0 Integration Points

- Rider App -> API Gateway -> Rider Logistics Service
- Rider Logistics Service -> Message Bus (for analytics and re-assignment trigger)

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- Verify a rider can reject a task and is returned to the idle screen.
- Verify that when a task is rejected, it is immediately offered to another available test rider.
- Verify that if the timer expires, the task is offered to another rider.
- Simulate a network failure during a rejection attempt and verify the app's behavior.

## 9.3.0.0 Test Data Needs

- At least two active 'Online' rider accounts.
- A vendor account with an active store.
- A customer account to place an order.
- An order in the 'Ready for Pickup' state.

## 9.4.0.0 Testing Tools

- Cypress or similar for E2E testing.
- Jest/React Testing Library for frontend unit tests.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in the staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >80% code coverage for the new logic.
- E2E automated test case for the rejection happy path is created and passing.
- The 'Reject' button and its interactions meet UI/UX and accessibility standards.
- Performance of the rejection API endpoint is verified to be under the 500ms P95 threshold.
- Security checks confirm that a rider cannot reject a task not assigned to them.
- Relevant technical documentation (e.g., API spec) has been updated.
- Story has been successfully deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

2

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is part of the critical path for the order delivery lifecycle.
- It should be prioritized alongside 'RDR-012: Rider Accepts a Delivery Task' to provide the complete set of actions for a rider's initial interaction with a task.

## 11.4.0.0 Release Impact

This is a core feature required for the initial pilot launch. The delivery system cannot function effectively without it.

