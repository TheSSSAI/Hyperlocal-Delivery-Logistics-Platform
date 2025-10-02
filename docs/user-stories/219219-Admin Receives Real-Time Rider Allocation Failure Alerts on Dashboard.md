# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | ADM-019 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Admin Receives Real-Time Rider Allocation Failure ... |
| As A User Story | As an Administrator, I want to receive a prominent... |
| User Persona | Administrator / Operations Manager responsible for... |
| Business Value | Enables proactive operational intervention to redu... |
| Functional Area | Platform & Administrative Features |
| Story Theme | Operational Monitoring & Incident Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Alert Generation on Allocation Failure

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

an Administrator is logged into the admin dashboard with an active session

### 3.1.5 When

an order's status transitions to 'Allocation Failed' as per the failure protocol in REQ-FUN-018 (i.e., after 3 attempts over 5 minutes)

### 3.1.6 Then

a new, visually distinct high-priority alert appears in the dashboard's notification center within 5 seconds of the event.

### 3.1.7 Validation Notes

Test via an E2E scenario where rider allocation is forced to fail. Verify the alert appears on the UI. The real-time delivery should leverage the WSS protocol specified in REQ-INT-004.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Alert Content and Details

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

a rider allocation failure alert is displayed on the dashboard

### 3.2.5 When

the Administrator views the alert

### 3.2.6 Then

the alert must contain the Order ID, Vendor Name, Customer's operational zone, and the timestamp of the failure.

### 3.2.7 Validation Notes

Verify the payload sent via WebSocket contains all the required fields and the UI component renders them correctly.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Alert Interaction and Navigation

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

an Administrator is viewing the list of active alerts

### 3.3.5 When

the Administrator clicks on a specific allocation failure alert

### 3.3.6 Then

they are navigated directly to the detailed management page for that specific order, enabling immediate intervention as per ADM-020.

### 3.3.7 Validation Notes

Use a Cypress test to click the alert element and assert that the URL changes to the correct order detail page.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Alert Dismissal and Auditing

### 3.4.3 Scenario Type

Alternative_Flow

### 3.4.4 Given

an allocation failure alert is visible to all logged-in Administrators

### 3.4.5 When

one Administrator dismisses the alert

### 3.4.6 Then

the alert is removed from the active alert list for ALL Administrators to prevent duplicate effort.

### 3.4.7 And

the dismissal action is logged in the immutable audit trail (REQ-NFR-008), capturing the administrator's ID, the Order ID, and a timestamp.

### 3.4.8 Validation Notes

Log in as two different admins. Have Admin A dismiss the alert and verify it disappears for Admin B in real-time. Check the audit log database/service for the corresponding entry.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Handling Multiple Concurrent Failures

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

the dashboard's notification center already contains one or more active alerts

### 3.5.5 When

a new, distinct order fails rider allocation

### 3.5.6 Then

the new alert is added to the list of alerts without affecting the existing ones.

### 3.5.7 And

the unread alert count badge on the notification icon is updated correctly.

### 3.5.8 Validation Notes

Trigger two separate allocation failures in quick succession and verify both alerts appear correctly and the count is '2'.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Automatic Alert Removal on Resolution

### 3.6.3 Scenario Type

Edge_Case

### 3.6.4 Given

an active allocation failure alert exists for an order in the 'Allocation Failed' state

### 3.6.5 When

the order is resolved by being either cancelled or manually assigned

### 3.6.6 Then

the corresponding alert is automatically removed from the dashboard's notification center.

### 3.6.7 Validation Notes

Trigger an allocation failure, verify the alert appears, then use admin tools to cancel the order and verify the alert is removed automatically.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A persistent notification icon/bell in the main dashboard header.
- A badge on the notification icon displaying the count of unread high-priority alerts.
- A dropdown/panel that lists active alerts when the icon is clicked.
- A 'Dismiss' or 'Acknowledge' button for each alert item.
- Visual indicators (e.g., red color, warning icon) to signify high priority.

## 4.2.0 User Interactions

- Clicking the notification icon toggles the alert list visibility.
- Clicking an alert item navigates the user to the relevant order page.
- Clicking the 'Dismiss' button removes the alert and triggers an API call.

## 4.3.0 Display Requirements

- Alerts should be displayed in reverse chronological order (newest first).
- The dashboard should update in real-time without requiring a page refresh.

## 4.4.0 Accessibility Needs

- Alerts must be announced by screen readers.
- Color indicators must be accompanied by text or icons for color-blind users, adhering to WCAG 2.1 AA.
- All interactive elements (icon, alert items, buttons) must be keyboard-navigable.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-ADM-019-01

### 5.1.2 Rule Description

An alert is generated only when an order enters the 'Allocation Failed' state as defined in REQ-FUN-018.

### 5.1.3 Enforcement Point

Order Management Service, upon state transition.

### 5.1.4 Violation Handling

No alert is generated for other order states.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-ADM-019-02

### 5.2.2 Rule Description

An alert, once acknowledged by any administrator, is considered resolved and removed from the active queue for all other administrators.

### 5.2.3 Enforcement Point

Notification Service, upon receiving a dismissal request.

### 5.2.4 Violation Handling

N/A. This is the primary logic.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

REQ-FUN-018

#### 6.1.1.2 Dependency Reason

This story depends on the Rider Allocation service defining and emitting an event when an order's state transitions to 'Allocation Failed'.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-020

#### 6.1.2.2 Dependency Reason

Functionally coupled. The alert must link to the order intervention page developed in this story to be actionable.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

REQ-NFR-008

#### 6.1.3.2 Dependency Reason

The system audit trail must be implemented to log the dismissal of alerts.

## 6.2.0.0 Technical Dependencies

- A real-time communication channel (Secure WebSocket as per REQ-INT-004) must be established between the backend and the admin dashboard.
- An event bus (AWS SQS/SNS as per REQ-ARC-001) for inter-service communication.
- The Order Management microservice must publish an 'OrderAllocationFailed' event.

## 6.3.0.0 Data Dependencies

- Requires access to Order data (ID, Vendor, Zone) and Admin user session data for authorization.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- P99 latency for alert delivery (from event emission to UI display) must be under 5 seconds.

## 7.2.0.0 Security

- Only users with the 'Administrator' role can view or interact with these alerts.
- WebSocket connections must be authenticated and authorized using the user's session token (JWT).

## 7.3.0.0 Usability

- The alert must be non-intrusive but clearly visible, ensuring it gets attention without disrupting other tasks.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- Must function correctly on all modern web browsers supported by the admin dashboard (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires implementation of a real-time, event-driven notification system using WebSockets.
- Backend state management is needed to track active/dismissed alerts for all admins.
- Frontend state management (e.g., Redux Toolkit) to handle real-time updates to the UI.
- Requires robust integration between the Order Management service, the event bus, a new Notification service, and the Admin Frontend.

## 8.3.0.0 Technical Risks

- Potential for message delivery failure in the real-time layer. A fallback mechanism (like periodic polling) could be considered but is out of scope for the initial implementation.
- Managing WebSocket connection state and authentication at scale can be complex.

## 8.4.0.0 Integration Points

- Subscribes to 'OrderAllocationFailed' events from the Order Management service via an SNS topic.
- Pushes messages to the Admin Frontend via an API Gateway WebSocket API.
- Writes to the Audit Log service/database upon alert dismissal.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- A single order fails allocation, and the alert is correctly displayed and dismissed.
- Multiple orders fail allocation, and all alerts are displayed.
- An admin dismisses an alert, and it disappears for another concurrently logged-in admin.
- An order is cancelled after an alert is generated, and the alert is auto-removed.

## 9.3.0.0 Test Data Needs

- Admin user accounts.
- A mechanism to reliably trigger the 'Allocation Failed' state for a test order, possibly by mocking the rider service to reject all tasks.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- Cypress for E2E tests.
- AWS console or CLI to verify SQS/SNS message flow.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in the staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >80% coverage for the new logic.
- E2E automated tests for the alert lifecycle (creation, interaction, dismissal) are passing.
- The real-time performance requirement (<5s delivery) has been verified.
- Security checks for role-based access to alerts have been validated.
- UI/UX has been reviewed and approved by the product owner.
- Relevant documentation (e.g., on the notification system architecture) has been updated.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is blocked by the completion of the event-emitting part of REQ-FUN-018.
- Should be planned in the same or subsequent sprint as ADM-020 to deliver the complete admin workflow for handling failed orders.

## 11.4.0.0 Release Impact

This is a critical feature for operational stability and is required for go-live in any new zone to ensure service reliability.

