# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | SYS-002 |
| Elaboration Date | 2025-01-24 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | System Re-assigns Rejected or Timed-Out Rider Task... |
| As A User Story | As a platform operator (represented by the System)... |
| User Persona | System (Automated Process) |
| Business Value | Increases delivery success rate and operational ef... |
| Functional Area | Rider Logistics & Order Fulfillment |
| Story Theme | Automated Dispatch and Logistics |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Rider explicitly rejects a task

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

An order is in state 'Ready for Pickup' and has been offered to Rider A

### 3.1.5 When

Rider A actively rejects the task via their application

### 3.1.6 Then

The task offer is immediately revoked from Rider A's interface, the system logs the rejection event against Rider A's profile, the allocation algorithm is re-triggered to find the next-best rider (excluding Rider A), and the task is offered to the new rider (Rider B).

### 3.1.7 Validation Notes

Verify via API logs that the rejection from Rider A is received and the new offer to Rider B is sent. The order's internal state should reflect a new assignment attempt.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Rider task offer times out

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

An order has been offered to Rider A with a configured acceptance timer (e.g., 60 seconds)

### 3.2.5 When

The acceptance timer expires without any action from Rider A

### 3.2.6 Then

The task offer is automatically revoked from Rider A's interface, the system logs the timeout event, the allocation algorithm is re-triggered (excluding Rider A), and the task is offered to the next-best rider (Rider B).

### 3.2.7 Validation Notes

Requires a test environment where time can be manipulated or a short timer can be configured. Verify that after the timer duration, the re-assignment logic is triggered.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Re-assignment fails after maximum attempts

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

An order task has been re-assigned the maximum number of times (e.g., 3 attempts) and the final rider has just rejected or timed out

### 3.3.5 When

The system attempts to re-assign the task for the final time and fails

### 3.3.6 Then

The order's status is updated to 'Allocation Failed', the re-assignment process for this order is terminated, and a high-priority alert is generated for administrator review.

### 3.3.7 Validation Notes

Configure the max attempts to a low number (e.g., 2) in a test environment. Simulate two consecutive rejections and verify the order status changes to 'Allocation Failed' and an alert is triggered.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

No other riders are available for re-assignment

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

An order task has been rejected by Rider A

### 3.4.5 When

The re-assignment logic runs but finds no other 'Online' and eligible riders within the operational zone

### 3.4.6 Then

The system waits for a short, configurable interval before retrying the search for an available rider, up to the maximum attempt limit defined in the failure protocol (REQ-FUN-018).

### 3.4.7 Validation Notes

Test in an environment with only one rider online. Have that rider reject the task and verify the system enters a retry loop before eventually failing as per AC-003.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Order is cancelled while a rider is deciding

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

An order task has been offered to Rider A and their acceptance timer is active

### 3.5.5 When

The customer or vendor cancels the order

### 3.5.6 Then

The task offer is immediately revoked from Rider A's application, and the entire re-assignment process for this order is terminated.

### 3.5.7 Validation Notes

While a task offer is pending with a mock rider, trigger an order cancellation via API and verify the task offer is removed and no further assignment attempts are made.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Rider goes offline while task offer is pending

### 3.6.3 Scenario Type

Edge_Case

### 3.6.4 Given

An order task has been offered to Rider A and their acceptance timer is active

### 3.6.5 When

Rider A sets their status to 'Offline'

### 3.6.6 Then

The system treats this as an implicit rejection, and the re-assignment process is triggered immediately.

### 3.6.7 Validation Notes

While a task offer is pending with a mock rider, trigger a status change to 'Offline' for that rider and verify the re-assignment logic runs instantly.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- This is a backend-focused story. No new UI elements are required.

## 4.2.0 User Interactions

- The existing 'Accept'/'Reject' buttons on the rider's task offer screen serve as triggers.
- When a task is rejected or times out, the offer screen must be removed from the rider's view.

## 4.3.0 Display Requirements

- The new rider receiving the re-assigned task should see the standard task offer screen with no indication that it's a re-assignment.

## 4.4.0 Accessibility Needs

- Not applicable for this backend story.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-SYS-002-01

### 5.1.2 Rule Description

A rider who rejects or times out on a specific order task cannot be offered the same task again during the same allocation cycle.

### 5.1.3 Enforcement Point

During the rider selection phase of the allocation algorithm.

### 5.1.4 Violation Handling

The algorithm must maintain and consult an exclusion list for the current order.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-SYS-002-02

### 5.2.2 Rule Description

The system must attempt to find a rider for a configurable number of attempts over a configurable time window before escalating to 'Allocation Failed' state, as per REQ-FUN-018.

### 5.2.3 Enforcement Point

Within the Rider Logistics service's state machine for order assignment.

### 5.2.4 Violation Handling

The order status is changed to 'Allocation Failed' and an alert is triggered.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

REQ-FUN-018

#### 6.1.1.2 Dependency Reason

This story relies on the existence of the core rider allocation algorithm to select the 'next best' rider.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

RDR-013

#### 6.1.2.2 Dependency Reason

The explicit 'Reject' action by a rider, which is a primary trigger for this story, must be implemented.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

ADM-016

#### 6.1.3.2 Dependency Reason

The configurable acceptance timer, which is the implicit rejection trigger, must be available.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

SYS-003

#### 6.1.4.2 Dependency Reason

The failure path of this story (max attempts reached) transitions the order to the state handled by SYS-003.

## 6.2.0.0 Technical Dependencies

- Rider Logistics Microservice
- Order Management Microservice
- Real-time Notification Service (e.g., WebSockets via Socket.IO)
- A scalable timer/scheduler mechanism (e.g., AWS SQS Delay Queues or a Redis-based scheduler)

## 6.3.0.0 Data Dependencies

- Real-time rider status and location data.
- Order state data from the Order Management service.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The latency between a rejection/timeout event and the new task offer being sent to the next rider must be under 2 seconds.
- The state management system must handle at least 100 concurrent re-assignment events per minute without degradation.

## 7.2.0.0 Security

- The system must prevent race conditions where a single task could be offered to or accepted by more than one rider simultaneously. State transitions must be atomic.

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

- Requires robust, distributed state management to track assignment attempts and timers for thousands of concurrent orders.
- Implementation of a scalable timer mechanism is non-trivial and cannot rely on simple in-process schedulers.
- Requires careful orchestration between multiple microservices (Orders, Logistics, Notifications).
- Handling of race conditions (e.g., rider rejects at the exact moment of timeout) requires idempotent logic.

## 8.3.0.0 Technical Risks

- The chosen timer solution may not scale as expected under heavy load, leading to delayed re-assignments.
- A failure in the state management store (e.g., Redis) could lead to stuck orders if not handled with proper resiliency patterns.

## 8.4.0.0 Integration Points

- Listens for events from the Rider Application (rejection).
- Calls the core allocation algorithm within the Rider Logistics service.
- Publishes events to the Notification service to push offers to riders.
- Updates state in the Order Management service.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Performance

## 9.2.0.0 Test Scenarios

- Verify re-assignment on explicit rejection.
- Verify re-assignment on timer expiration.
- Verify the exclusion list prevents re-offering to the same rider.
- Verify the 'Allocation Failed' state is reached after max retries.
- Verify the system correctly handles the case of no other riders being available.
- Verify the process is terminated correctly upon order cancellation.

## 9.3.0.0 Test Data Needs

- Test accounts for multiple riders with configurable online/offline statuses.
- A mechanism to simulate rider rejections and timeouts via API.
- Orders in the 'Ready for Pickup' state.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- A framework for integration testing microservices (e.g., Pact or Supertest).
- Cypress for E2E tests.
- A load testing tool like k6 or JMeter to test the performance of the re-assignment loop.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >80% coverage for the new logic.
- Automated E2E tests for the happy path and primary failure path are implemented and passing.
- Performance testing confirms the re-assignment latency is within the specified NFR.
- Comprehensive logging is implemented to trace the entire assignment/re-assignment lifecycle of an order.
- Technical documentation for the state machine and timer mechanism is created or updated.
- Story has been deployed and verified in the staging environment by QA.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a critical-path story for the core delivery loop. It is dependent on the initial allocation logic being complete.
- Requires a developer with experience in distributed systems, state management, and asynchronous processing.

## 11.4.0.0 Release Impact

Essential for MVP launch. Without this feature, the system is not resilient to rider unavailability, leading to a high rate of failed deliveries and requiring constant manual intervention.

