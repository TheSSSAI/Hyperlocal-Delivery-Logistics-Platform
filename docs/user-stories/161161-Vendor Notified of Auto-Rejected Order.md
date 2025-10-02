# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | VND-020 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Vendor Notified of Auto-Rejected Order |
| As A User Story | As a vendor, I want to receive a clear and immedia... |
| User Persona | Vendor (Store Owner/Manager) |
| Business Value | Improves vendor operational awareness by closing t... |
| Functional Area | Vendor Order Management |
| Story Theme | Order Lifecycle Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Vendor receives real-time notification for auto-rejected order while online

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a vendor is logged into their web dashboard and viewing the 'New Orders' screen

### 3.1.5 When

a new order's acceptance timer (defined in REQ-FUN-010) expires without any action from the vendor

### 3.1.6 Then

the system updates the order's status to 'Cancelled' with a reason of 'Vendor Timeout'

### 3.1.7 And

a persistent notification is added to the vendor's notification center.

### 3.1.8 Validation Notes

Can be tested by setting a short acceptance time (e.g., 30 seconds) for a test vendor, placing an order, and observing the UI for the real-time update and notification.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Vendor sees notification for an order that was auto-rejected while they were offline

### 3.2.3 Scenario Type

Alternative_Flow

### 3.2.4 Given

a vendor is not logged into the dashboard

### 3.2.5 When

one of their new orders is automatically rejected by the system due to a timeout

### 3.2.6 And

the notification list must contain an entry for the auto-rejected order with its ID and reason.

### 3.2.7 Then

the vendor's notification center must display an 'unread' indicator

### 3.2.8 Validation Notes

Test by placing an order for a logged-out vendor, waiting for the timeout, and then having the vendor log in to check the notification center.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Notification details are accurate and provide context

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

a vendor has received a notification for an auto-rejected order

### 3.3.5 When

the vendor clicks on the notification

### 3.3.6 Then

they are navigated to the detailed view of that specific order

### 3.3.7 And

the reason for the status (e.g., 'Auto-rejected: No response within time limit') is clearly visible.

### 3.3.8 Validation Notes

Verify the notification links to the correct order and that the status and reason are displayed as expected on the order details page.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Vendor attempts to accept an order just as it is auto-rejected

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

a vendor is viewing a new order on their dashboard

### 3.4.5 When

the system's auto-rejection process for that order is triggered

### 3.4.6 And

the standard auto-rejection notification is still displayed.

### 3.4.7 Then

the vendor's 'Accept' action must fail

### 3.4.8 Validation Notes

This requires precise timing to test manually. An automated E2E test is preferred to simulate the race condition.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A notification center icon (e.g., a bell) in the main dashboard navigation.
- A badge on the notification icon to indicate unread notifications.
- A toast/snackbar component for displaying real-time, non-blocking alerts.
- A dedicated section on the Order Details page to display the cancellation reason.

## 4.2.0 User Interactions

- Clicking the notification center icon opens a list of recent notifications.
- Clicking a specific notification navigates the user to the relevant order's detail page.
- Toast notifications should be dismissible by the user or auto-dismiss after a few seconds.

## 4.3.0 Display Requirements

- Notification text must clearly state the action (auto-rejected) and identify the order (Order ID).
- The list of notifications should show the most recent ones first.

## 4.4.0 Accessibility Needs

- Toast notifications must use appropriate ARIA roles (e.g., 'alert' or 'status') to be announced by screen readers.
- Notification center must be keyboard navigable, per WCAG 2.1 Level AA standards.

# 5.0.0 Business Rules

- {'rule_id': 'BRV-001', 'rule_description': 'Notifications for auto-rejection are mandatory and cannot be disabled by the vendor.', 'enforcement_point': 'Notification Service', 'violation_handling': 'N/A. This is a system-enforced rule.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

SYS-001

#### 6.1.1.2 Dependency Reason

This story depends on the system's core logic to automatically reject an order after a timeout. The notification is triggered by the event from SYS-001.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

VND-016

#### 6.1.2.2 Dependency Reason

The vendor dashboard must be able to receive and display new orders for this workflow to be possible.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

ADM-014

#### 6.1.3.2 Dependency Reason

The configurable time limit for order acceptance, set by an admin, is the basis for the timeout trigger.

## 6.2.0.0 Technical Dependencies

- A real-time communication channel (e.g., WebSockets via Socket.IO as per REQ-TEC-001) between the backend and the vendor web dashboard.
- A backend Notification Service capable of generating and persisting notifications.
- An event-driven architecture where the Order Management Service publishes an 'OrderAutoRejected' event.

## 6.3.0.0 Data Dependencies

- The order record must have a field to store the cancellation reason.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The real-time notification must be delivered to an active vendor dashboard within 2 seconds of the auto-rejection event.
- The background job that triggers this flow must not degrade the performance of new order processing.

## 7.2.0.0 Security

- Notifications must be scoped to the specific vendor account; no cross-vendor data leakage is permitted.

## 7.3.0.0 Usability

- The notification must be clear and unambiguous, avoiding technical jargon.

## 7.4.0.0 Accessibility

- All UI elements related to notifications must comply with WCAG 2.1 Level AA.

## 7.5.0.0 Compatibility

- The notification feature must function correctly on all supported modern web browsers for the vendor dashboard.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires coordination between the Order Management service (which rejects the order) and a Notification service.
- Frontend implementation needs to handle real-time updates via WebSockets, including connection/disconnection logic.
- Handling the race condition described in AC-004 requires careful state management on both the frontend and backend (e.g., using atomic database transactions).

## 8.3.0.0 Technical Risks

- Potential for missed notifications if the WebSocket connection is unstable. A fallback mechanism (e.g., polling when the connection is re-established) should be considered.
- Scalability of the notification service as the number of concurrent vendors grows.

## 8.4.0.0 Integration Points

- Order Management Service: To listen for order rejection events.
- Notification Service: To create and dispatch the notification.
- Vendor Frontend Application: To receive and display the notification.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- Verify notification is received in real-time when dashboard is open.
- Verify notification is present in the notification center after logging in.
- Verify clicking the notification navigates to the correct order.
- Verify the error handling for the race condition (attempting to accept a just-cancelled order).
- Verify that no notification is sent if the vendor accepts or rejects the order within the time limit.

## 9.3.0.0 Test Data Needs

- A test vendor account.
- A test customer account.
- Ability to configure a short order acceptance time for the test vendor.

## 9.4.0.0 Testing Tools

- Jest and React Testing Library for frontend unit tests.
- Cypress for end-to-end testing.
- A mock WebSocket client for backend integration testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one other engineer
- Unit and integration tests implemented with at least 80% coverage for new code
- E2E tests for critical paths are implemented and passing
- User interface reviewed and approved by a UX designer or Product Owner
- Performance requirements (latency < 2s) verified under test conditions
- Security requirements (data scoping) validated via code review and testing
- API documentation (if any new endpoints were created) is updated
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

3

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is tightly coupled with SYS-001. It should be developed in the same sprint or the sprint immediately following SYS-001 to provide a complete feature to vendors.
- Requires both backend (event handling, notification logic) and frontend (UI for notification) development effort.

## 11.4.0.0 Release Impact

This is a core feature for vendor experience. Releasing the auto-rejection feature without this notification would lead to a poor user experience and should be avoided.

