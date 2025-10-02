# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | ADM-023 |
| Elaboration Date | 2025-01-24 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Admin Views Order Event Log |
| As A User Story | As an Administrator, I want to view a complete, ch... |
| User Persona | An Administrator responsible for platform operatio... |
| Business Value | Reduces support resolution time, increases operati... |
| Functional Area | Platform & Administrative Features |
| Story Theme | Order Lifecycle Management & Support |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Viewing the event log for a successfully delivered order

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

an Administrator is logged into the admin dashboard and is viewing the details of an order that has been successfully delivered

### 3.1.5 When

the Administrator navigates to the 'Event Log' or 'Order History' section for that order

### 3.1.6 Then

a list of all events for that order is displayed in reverse chronological order (most recent first)

### 3.1.7 And

each event entry must display a precise timestamp (in IST), a human-readable event description, and the actor responsible (e.g., 'Customer: [Name]', 'Vendor: [Name]', 'Rider: [Name]', or 'System').

### 3.1.8 Validation Notes

Verify that all state transitions from REQ-FUN-017 are logged. The actor's name and ID should be available, possibly in a tooltip or expandable section.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Event log for a system-rejected order

### 3.2.3 Scenario Type

Alternative_Flow

### 3.2.4 Given

an Administrator is viewing an order that was automatically rejected because the vendor failed to accept it within the time limit

### 3.2.5 When

the Administrator views the event log for that order

### 3.2.6 Then

the log displays an 'Order Rejected' event

### 3.2.7 And

the event metadata includes the reason, such as 'Vendor acceptance timeout'.

### 3.2.8 Validation Notes

Test the scenario where a vendor lets the timer in REQ-FUN-010 expire. The log must reflect the automated nature of the action.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Event log for an order with rider allocation failure

### 3.3.3 Scenario Type

Alternative_Flow

### 3.3.4 Given

an Administrator is viewing an order where no rider accepted the delivery task after multiple attempts

### 3.3.5 When

the Administrator views the event log for that order

### 3.3.6 Then

the log displays multiple 'Rider Assignment Attempted' events with corresponding rider IDs

### 3.3.7 And

the actor for the 'Allocation Failed' event is 'System'.

### 3.3.8 Validation Notes

This tests the failure protocol from REQ-FUN-018. The log should provide enough detail to see which riders rejected the task.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Event log is read-only

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

an Administrator is viewing the event log for any order

### 3.4.5 When

they interact with the event log UI

### 3.4.6 Then

there are no controls (buttons, forms) to edit, modify, or delete any event log entry.

### 3.4.7 Validation Notes

The UI must enforce the 'immutable' nature of the log. Check the DOM for any input elements or edit-related event handlers.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Event log fails to load

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

an Administrator is attempting to view an order's event log

### 3.5.5 When

the backend API call to fetch the log data fails

### 3.5.6 Then

a user-friendly error message like 'Could not load order history. Please try again.' is displayed in place of the log.

### 3.5.7 Validation Notes

Use browser developer tools to simulate a 500 or network error on the API endpoint and verify the UI response.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Viewing event log with detailed metadata

### 3.6.3 Scenario Type

Happy_Path

### 3.6.4 Given

an Administrator is viewing the event log for an order

### 3.6.5 When

an event contains additional data, such as a status change from 'Preparing' to 'Ready for Pickup'

### 3.6.6 Then

the event entry displays the core information, with an option (e.g., a '+' icon or 'Details' link) to expand and view the associated metadata

### 3.6.7 And

the expanded view shows details like 'old_status: Preparing', 'new_status: Ready for Pickup'.

### 3.6.8 Validation Notes

Verify that structured metadata (JSONB) from the backend is parsed and displayed correctly in the UI.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A dedicated section or tab labeled 'Event Log' within the order details view.
- A timeline or vertically-stacked list to display log entries.
- Expand/collapse control for entries with detailed metadata.

## 4.2.0 User Interactions

- The view is strictly read-only.
- The list should be scrollable to handle long event histories.
- Clicking on an actor's name/ID could potentially link to that user's profile page (future enhancement).

## 4.3.0 Display Requirements

- Events must be in reverse chronological order.
- Each entry must clearly display: Timestamp (IST), Event Description, Actor.
- Timestamps must be formatted for readability (e.g., 'Jan 24, 2025, 02:30:15 PM IST').

## 4.4.0 Accessibility Needs

- The log should be implemented using semantic HTML (e.g., `<ol>` and `<li>` or `<table>`) to be navigable by screen readers.
- Sufficient color contrast for text and background elements.

# 5.0.0 Business Rules

- {'rule_id': 'BR-LOG-001', 'rule_description': 'All security-sensitive and financially significant events must be logged in the audit trail, as per REQ-NFR-008. The order event log is a specific implementation of this for the order lifecycle.', 'enforcement_point': 'Backend Order Management Service, on every state change or significant action.', 'violation_handling': 'A failure to log an event should trigger a high-priority system alert, as it indicates a critical failure in the audit process.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

REQ-FUN-017

#### 6.1.1.2 Dependency Reason

The event log is a direct record of the order lifecycle states and transitions defined in this requirement. The backend mechanism to capture these events must exist first.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-005

#### 6.1.2.2 Dependency Reason

This story assumes a pre-existing admin interface for finding and viewing individual orders. The event log will be a component within that view.

## 6.2.0.0 Technical Dependencies

- A backend mechanism (e.g., an append-only `order_events` table or an event sourcing system) to immutably store event data.
- A new, secured, and paginated API endpoint to fetch the event log for a specific order ID.

## 6.3.0.0 Data Dependencies

- The system must be able to resolve actor IDs (customer_id, vendor_id, rider_id) to human-readable names for display in the log.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The P95 latency for the API endpoint fetching the event log must be under 500ms.
- The event log UI must render completely within 2 seconds of being requested.

## 7.2.0.0 Security

- Access to the event log must be strictly limited to users with the 'Administrator' role, enforced at the API Gateway and microservice level (as per REQ-USR-001).
- The log should not display full PII; it should use identifiers like name and ID. Sensitive data (e.g., payment details) must be omitted from the log metadata.

## 7.3.0.0 Usability

- The log must be easy to scan and understand, allowing an admin to quickly diagnose a problem.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The admin web dashboard must be responsive and function correctly on all modern web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires backend implementation of an event capture and storage mechanism, which is a foundational piece of architecture.
- Requires a new, performant API endpoint with pagination.
- Frontend work to display the data in a clear, user-friendly format.

## 8.3.0.0 Technical Risks

- Risk of missing events if the logging mechanism is not implemented atomically with the state-changing operations.
- Potential for performance degradation if an order has an exceptionally large number of events (e.g., rapid-fire rider re-assignments).

## 8.4.0.0 Integration Points

- Order Management Service: Must generate and persist the events.
- API Gateway: Must expose the new endpoint for the admin dashboard.
- Identity Service: May be called to enrich actor IDs with names.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- Verify log entries for a complete, successful order.
- Verify log entries for a customer-cancelled order.
- Verify log entries for a vendor-rejected order.
- Verify log entries for a system-rejected (timeout) order.
- Verify log entries for an order with rider allocation failure.
- Verify UI response to API failure.
- Verify pagination for an order with >50 events.

## 9.3.0.0 Test Data Needs

- Test orders must be created in each of the terminal states (Delivered, Cancelled, Allocation Failed).
- A test order with a large number of events to test performance and UI scrolling/pagination.

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for frontend components.
- Cypress for E2E testing of the admin flow.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >80% coverage for new code
- E2E test scenario for viewing the event log is implemented and passing
- The new API endpoint is documented in the OpenAPI specification
- Performance and security requirements are verified
- The feature is deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational feature for administrative and support capabilities. It should be prioritized early in the development of the admin module.
- Dependent on the completion of the core order state machine (REQ-FUN-017).

## 11.4.0.0 Release Impact

Critical for enabling the support team to function effectively post-launch.

