# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | ADM-004 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Admin Rejects a Vendor or Rider Registration with ... |
| As A User Story | As an Administrator, I want to reject a pending ve... |
| User Persona | Platform Administrator responsible for user onboar... |
| Business Value | Ensures platform integrity and compliance by onboa... |
| Functional Area | User Management |
| Story Theme | Admin Onboarding Workflow |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Happy Path: Admin successfully rejects a registration with a predefined reason

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

an Administrator is logged into the admin dashboard and is viewing the details of a user with a 'pending_verification' status

### 3.1.5 When

the Administrator clicks the 'Reject' button, selects a predefined reason (e.g., 'Invalid Document') from a modal, and clicks 'Confirm Rejection'

### 3.1.6 Then

the system must update the user's status to 'rejected', save the rejection reason against the user's record, log the action in the admin audit trail, and queue a notification to be sent to the user informing them of the rejection with the provided reason. The user should no longer appear in the 'pending_verification' list.

### 3.1.7 Validation Notes

Verify the user's status in the database is 'rejected'. Check the audit log for an entry corresponding to this action. Confirm a notification event is published to the message queue. Verify the user is removed from the pending registrations UI.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Admin rejects a registration with a custom reason

### 3.2.3 Scenario Type

Alternative_Flow

### 3.2.4 Given

an Administrator is viewing the rejection modal for a pending registration

### 3.2.5 When

the Administrator selects the 'Other' reason and enters a custom message in the text field, then confirms the rejection

### 3.2.6 Then

the system must save both the 'Other' selection and the custom text message as the rejection reason.

### 3.2.7 Validation Notes

Check the user's record in the database to ensure the custom text is stored correctly along with the predefined reason.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Admin attempts to reject without providing a reason

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

an Administrator has opened the rejection modal for a pending registration

### 3.3.5 When

the Administrator clicks 'Confirm Rejection' without selecting a predefined reason or entering a custom one

### 3.3.6 Then

the system must display a validation error message (e.g., 'A reason for rejection is required') within the modal, and the 'Confirm Rejection' button should remain disabled. The user's status must remain 'pending_verification'.

### 3.3.7 Validation Notes

UI test to confirm the button is disabled and the error message appears. Check the database to ensure the user's status has not changed.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Admin cancels the rejection process

### 3.4.3 Scenario Type

Alternative_Flow

### 3.4.4 Given

an Administrator has opened the rejection modal

### 3.4.5 When

the Administrator clicks the 'Cancel' button or closes the modal

### 3.4.6 Then

the modal must close, and no changes shall be made to the user's status or record.

### 3.4.7 Validation Notes

Verify that the user's status remains 'pending_verification' and no audit log entry is created.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Concurrent admin action: Attempting to reject an already processed registration

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

Administrator A is viewing the details of a 'pending_verification' user

### 3.5.5 When

Administrator B approves or rejects the same user, and then Administrator A attempts to reject the user

### 3.5.6 Then

the system must prevent the action and display an error message like 'This registration has already been processed. The page will now refresh.' The user's status should reflect the action taken by Administrator B.

### 3.5.7 Validation Notes

This requires a pre-update status check. Manually test with two admin accounts to confirm the race condition is handled gracefully.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A 'Reject' button on the registration review page, visually distinct from the 'Approve' button.
- A modal dialog for rejection confirmation.
- A dropdown or radio button group for predefined rejection reasons (configurable by admins).
- A text area for an optional custom rejection message.
- A 'Confirm Rejection' button within the modal.
- A 'Cancel' button within the modal.

## 4.2.0 User Interactions

- Clicking 'Reject' opens the confirmation modal.
- The 'Confirm Rejection' button is disabled until a reason is selected/entered.
- Upon successful rejection, a success toast/notification is displayed, and the admin is redirected to the pending registrations list.

## 4.3.0 Display Requirements

- The rejection modal must clearly identify the user being rejected.
- Validation error messages must be clear and displayed close to the input field.

## 4.4.0 Accessibility Needs

- The modal must be keyboard-navigable and screen-reader accessible, adhering to WCAG 2.1 AA standards.
- All buttons and form fields must have accessible labels.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-ADM-001

### 5.1.2 Rule Description

A reason must be provided for every registration rejection.

### 5.1.3 Enforcement Point

API endpoint for rejecting a user.

### 5.1.4 Violation Handling

The API request is rejected with a 400 Bad Request status and an error message.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-ADM-002

### 5.2.2 Rule Description

The rejection action must be recorded in the immutable administrator audit trail.

### 5.2.3 Enforcement Point

Within the user rejection service logic.

### 5.2.4 Violation Handling

If the audit log fails to write, the entire transaction should be rolled back to prevent an un-audited state change.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

ADM-001

#### 6.1.1.2 Dependency Reason

Admin needs a list of pending registrations to select from.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-002

#### 6.1.2.2 Dependency Reason

Admin needs a detailed view of a registration to make an informed rejection decision.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

VND-001

#### 6.1.3.2 Dependency Reason

Requires a vendor registration flow that creates users in a 'pending_verification' state.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

RDR-001

#### 6.1.4.2 Dependency Reason

Requires a rider registration flow that creates users in a 'pending_verification' state.

## 6.2.0.0 Technical Dependencies

- User Management Service (for updating user status).
- Notification Service (for sending rejection emails/SMS).
- Audit Log Service/Module (for recording the admin action).

## 6.3.0.0 Data Dependencies

- Access to user registration data, including submitted documents.
- A configurable list of predefined rejection reasons.

## 6.4.0.0 External Dependencies

- None for this specific story, but the notification feature depends on AWS SNS/FCM.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API response time for the rejection action should be under 500ms (P95).
- The UI for the pending registrations list should load quickly after a rejection is processed.

## 7.2.0.0 Security

- The endpoint must be protected and only accessible by users with the 'Administrator' role (RBAC).
- All input from the custom reason text field must be sanitized to prevent XSS attacks.
- The action must be logged in the audit trail as per REQ-USR-001 and REQ-NFR-008.

## 7.3.0.0 Usability

- The rejection process should be intuitive, requiring minimal steps.
- The list of predefined reasons should cover the most common rejection scenarios to speed up the process.

## 7.4.0.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The admin dashboard must be fully functional on modern web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires a transactional update across multiple data points (user status, rejection reason, audit log).
- Handling the concurrency edge case (multiple admins acting at once) requires careful implementation (e.g., optimistic locking or pre-update status check).
- Integration with an asynchronous notification service.
- The list of rejection reasons should be managed via an admin configuration interface, not hardcoded.

## 8.3.0.0 Technical Risks

- Potential for data inconsistency if the transaction for updating status and logging the audit fails midway. A Saga pattern or a robust transactional mechanism is recommended if services are distributed.

## 8.4.0.0 Integration Points

- Backend API for user management.
- Database to update user status and store rejection reason.
- Message bus (e.g., AWS SQS/SNS) to trigger notifications.
- Audit logging system.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- Verify successful rejection with both predefined and custom reasons.
- Verify validation prevents rejection without a reason.
- Verify the concurrency scenario where one admin acts before another.
- Verify the audit log contains the correct information (admin ID, user ID, reason, timestamp).
- Verify that a notification event is correctly triggered and contains the right payload.

## 9.3.0.0 Test Data Needs

- Test user accounts in the 'pending_verification' state for both Vendors and Riders.
- Multiple administrator test accounts for concurrency testing.

## 9.4.0.0 Testing Tools

- Jest for unit/integration tests.
- Cypress for E2E testing of the admin dashboard UI.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >80% code coverage for the new logic.
- End-to-end automated tests for the rejection flow are implemented and passing.
- The action is correctly and immutably logged in the audit trail.
- The rejection triggers a notification to the user with the correct reason.
- The list of rejection reasons is configurable and not hardcoded.
- Any necessary technical documentation (e.g., API spec) has been updated.
- The feature has been verified by QA and approved by the Product Owner.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is a core part of the admin workflow and is critical for launch.
- Ensure prerequisite stories (ADM-001, ADM-002) are completed in the same or a prior sprint.
- Confirm the notification service is ready to consume events triggered by this story.

## 11.4.0.0 Release Impact

This is a mandatory feature for the initial platform launch to enable the user verification process.

