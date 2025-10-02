# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | ADM-025 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Admin Reviews User Chat Logs for Support and Moder... |
| As A User Story | As an Administrator, I want to search for and view... |
| User Persona | Platform Administrator responsible for user suppor... |
| Business Value | Enables efficient dispute resolution, reduces frau... |
| Functional Area | Administration & Support |
| Story Theme | Platform Governance and User Support |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Admin successfully views chat log for an existing order with multiple chat threads

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

An Administrator is logged into the admin dashboard and is on the order details page for an order that has both Customer-Vendor and Customer-Rider chat histories

### 3.1.5 When

The Administrator clicks the 'View Chat Logs' action

### 3.1.6 Then

A modal or dedicated view opens, displaying the chat logs.

### 3.1.7 And

The interface is strictly read-only, with no input field to send new messages.

### 3.1.8 Validation Notes

Verify that both chat threads are accessible and that the content, sender, and timestamp for each message are correct. Confirm no message input field is present.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Admin views an order with no chat history

### 3.2.3 Scenario Type

Edge_Case

### 3.2.4 Given

An Administrator is viewing the details for a valid order where no chat messages were ever exchanged

### 3.2.5 When

The Administrator navigates to the chat log view for that order

### 3.2.6 Then

The system displays a clear message, such as 'No chat history found for this order.'

### 3.2.7 Validation Notes

Create an order in the test environment and complete it without any chat interaction. Verify that the specified message is displayed.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Admin views a chat log involving an anonymized user

### 3.3.3 Scenario Type

Edge_Case

### 3.3.4 Given

An Administrator is viewing the chat log for an order where a participant has since requested data erasure

### 3.3.5 When

The chat log is displayed

### 3.3.6 Then

All messages from the anonymized user show a generic placeholder like 'Deleted User' instead of their actual name.

### 3.3.7 And

The message content and timestamp remain visible as per the record.

### 3.3.8 Validation Notes

Requires a test user to be anonymized in the database according to REQ-CON-001. Verify that the user's PII is replaced in the chat view.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Admin attempts to view chat logs older than the retention period

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

An Administrator is viewing an order that was completed more than 90 days ago

### 3.4.5 When

The Administrator navigates to the chat log view for this order

### 3.4.6 Then

The system displays a message indicating that the logs are no longer available, e.g., 'Chat logs for this order have been permanently deleted as per data retention policies.'

### 3.4.7 Validation Notes

Requires test data for an order older than 90 days where chat logs have been purged according to REQ-NFR-007. Verify the correct message is shown.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

A non-admin user attempts to access the chat log API

### 3.5.3 Scenario Type

Security

### 3.5.4 Given

A user with a 'Vendor' or 'Rider' role is authenticated

### 3.5.5 When

The user attempts to make a direct API call to the endpoint for retrieving order chat logs

### 3.5.6 Then

The API returns a '403 Forbidden' status code.

### 3.5.7 Validation Notes

Use an API testing tool like Postman or Insomnia to make a request to the endpoint using authentication tokens from non-admin users.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Admin access to chat logs is recorded in the audit trail

### 3.6.3 Scenario Type

Security

### 3.6.4 Given

An Administrator is logged in

### 3.6.5 When

The Administrator successfully views the chat log for any order

### 3.6.6 Then

A new entry is created in the immutable audit trail.

### 3.6.7 And

The audit log entry contains the administrator's user ID, the action performed ('view_chat_log'), the target Order ID, a timestamp, and the outcome ('success').

### 3.6.8 Validation Notes

After performing the action in the UI, query the audit log database/system to confirm the corresponding entry was created with all required fields.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A 'View Chat Logs' button/link on the Admin Order Details page.
- A modal or a new view to display the chat history.
- Tabs or a dropdown to select between 'Customer-Vendor' and 'Customer-Rider' chat threads.
- A read-only message display area with distinct message bubbles for each participant.
- Text elements for sender's name/role and timestamp for each message.

## 4.2.0 User Interactions

- Admin clicks a button to open the chat view.
- Admin can scroll through the entire chat history.
- Admin can switch between different chat threads associated with the order.

## 4.3.0 Display Requirements

- The Order ID for which the chat is being viewed must be clearly displayed.
- Timestamps must be localized to Indian Standard Time (IST) as per REQ-INT-005.
- A clear message must be shown for orders with no chat history or for logs that have been purged.

## 4.4.0 Accessibility Needs

- The chat view must be keyboard navigable.
- Text must have sufficient contrast to meet WCAG 2.1 Level AA standards.
- Tabs for switching conversations must be clearly labeled for screen readers.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-ADM-CHAT-01

### 5.1.2 Rule Description

Access to user chat logs is restricted to users with the 'Administrator' role.

### 5.1.3 Enforcement Point

API Gateway and the Chat microservice.

### 5.1.4 Violation Handling

The system must return a 403 Forbidden error and log the unauthorized access attempt.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-ADM-CHAT-02

### 5.2.2 Rule Description

Chat logs are read-only for Administrators. They cannot add, edit, or delete messages.

### 5.2.3 Enforcement Point

The user interface and the backend API.

### 5.2.4 Violation Handling

The UI will not present any options for modification. Any direct API attempts to modify data will be rejected.

## 5.3.0 Rule Id

### 5.3.1 Rule Id

BR-DATA-RET-01

### 5.3.2 Rule Description

In-app chat logs must be permanently deleted 90 days after order completion, as per REQ-NFR-007.

### 5.3.3 Enforcement Point

A scheduled system job.

### 5.3.4 Violation Handling

If an admin attempts to access purged logs, the system will display a notification that the data is no longer available.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

REQ-FUN-020

#### 6.1.1.2 Dependency Reason

The core in-app chat functionality for users (Customer, Vendor, Rider) must be implemented and storing data before an admin can review it.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-005

#### 6.1.2.2 Dependency Reason

A basic admin dashboard with authentication and authorization for the 'Administrator' role must exist.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

A story for Admin to search and view order details

#### 6.1.3.2 Dependency Reason

This feature will be part of the order details view in the admin panel. The ability to find and open an order is a prerequisite.

## 6.2.0.0 Technical Dependencies

- Chat Service/Database: The system where chat messages are stored.
- Order Management Service: To fetch order details and link them to chats.
- Identity & Access Service (AWS Cognito): To enforce Role-Based Access Control (RBAC).
- Audit Trail Service: To log all administrative access events.

## 6.3.0.0 Data Dependencies

- Access to the chat message data store, linked by Order ID.
- Access to user data to display names/roles, and to identify anonymized users.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API response time for fetching chat logs for a typical order (e.g., <50 messages) should be under 500ms (P95).
- The UI should render the chat logs within 1 second of the API response.

## 7.2.0.0 Security

- All access to this feature must be authenticated and authorized for the 'Administrator' role.
- All data transfer must be over HTTPS/WSS.
- All administrative views of chat logs must be logged in an immutable audit trail as per REQ-NFR-008.

## 7.3.0.0 Usability

- The chat log must be easy to read, with clear distinction between participants.
- Navigation to and from the chat view should be intuitive.

## 7.4.0.0 Accessibility

- Must comply with Web Content Accessibility Guidelines (WCAG) 2.1 Level AA as per REQ-INT-001.

## 7.5.0.0 Compatibility

- The admin web dashboard must be responsive and function correctly on all modern web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires querying and joining data from multiple services (Orders, Users, Chat).
- Implementing the logic to correctly display anonymized user data.
- Frontend state management for displaying different chat threads (Customer-Vendor vs. Customer-Rider).
- Integration with the central audit logging service.

## 8.3.0.0 Technical Risks

- Performance degradation when loading orders with very long chat histories. Consider implementing pagination or lazy loading for the chat messages if this becomes an issue.
- Ensuring the data anonymization logic correctly scrubs PII without breaking the chat display.

## 8.4.0.0 Integration Points

- Admin Backend API -> Chat Service API
- Admin Backend API -> User Service API
- Admin Backend API -> Audit Service API
- Admin Frontend -> Admin Backend API

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Accessibility

## 9.2.0.0 Test Scenarios

- Verify an admin can view a chat log.
- Verify an admin sees a 'no history' message for orders without chats.
- Verify an admin can switch between vendor and rider chats.
- Verify messages from anonymized users are displayed correctly.
- Verify a non-admin user is blocked from accessing the API.
- Verify that viewing a chat log creates an audit trail entry.

## 9.3.0.0 Test Data Needs

- Test orders with no chat history.
- Test orders with both Customer-Vendor and Customer-Rider chat history.
- A test user account that has been anonymized.
- A test order older than 90 days to verify data retention policy enforcement.

## 9.4.0.0 Testing Tools

- Jest & React Testing Library for frontend unit tests.
- Jest for backend unit/integration tests.
- Cypress for E2E testing.
- Postman/Insomnia for API security testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Backend and frontend code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >= 80% code coverage.
- E2E tests for the primary happy path and key edge cases are automated and passing.
- Security checks confirm that only Administrators can access the feature and that access is audited.
- UI has been reviewed by a designer or product owner for usability and consistency.
- Feature is documented in the administrator's user guide.
- Verified by the Product Owner that the feature meets the business need.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a critical feature for the support team and should be prioritized for the initial launch or a very early release.
- Dependent on the completion of the core chat and admin order view functionalities.

## 11.4.0.0 Release Impact

Enables the operational support team to begin handling user disputes and moderation, which is essential for a healthy platform post-launch.

