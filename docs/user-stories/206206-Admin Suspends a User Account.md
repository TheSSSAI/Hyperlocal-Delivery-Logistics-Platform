# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | ADM-006 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Admin Suspends a User Account |
| As A User Story | As an Administrator, I want to suspend a user's ac... |
| User Persona | Administrator |
| Business Value | Enables effective platform moderation, enhances se... |
| Functional Area | User Management |
| Story Theme | Platform Administration & Security |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Admin successfully suspends a customer account

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am an Administrator logged into the admin dashboard and am viewing a specific customer's profile page which shows their status as 'Active'

### 3.1.5 When

I click the 'Suspend Account' button, enter 'Repeated fraudulent activity' as the reason in the confirmation modal, and confirm the action

### 3.1.6 Then

The system updates the user's status to 'Suspended' in the database, the user's active sessions are invalidated, and they are logged out. The admin dashboard now displays the user's status as 'Suspended'. An entry is created in the audit trail logging my admin ID, the user's ID, the action 'USER_SUSPEND', the reason, and a timestamp.

### 3.1.7 Validation Notes

Verify the user status in the database and on the admin UI. Confirm the audit log entry. The suspended user must be unable to log in and should receive a message: 'Your account has been suspended. Please contact support.'

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Admin successfully suspends a vendor account

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

I am an Administrator viewing an active Vendor's profile

### 3.2.5 When

I suspend the vendor's account with a valid reason

### 3.2.6 Then

All outcomes from AC-001 occur, AND the vendor's store is immediately set to 'Offline' status, preventing them from receiving new orders. Any existing 'Pending Vendor Acceptance' orders assigned to them are automatically cancelled and refunded.

### 3.2.7 Validation Notes

Verify the vendor's store is no longer visible or orderable in the customer app. Check that any pending orders were cancelled.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Admin successfully suspends a rider account

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

I am an Administrator viewing an active Rider's profile

### 3.3.5 When

I suspend the rider's account with a valid reason

### 3.3.6 Then

All outcomes from AC-001 occur, AND the rider's availability status is immediately forced to 'Offline', preventing them from being assigned new tasks.

### 3.3.7 Validation Notes

Verify the rider is no longer considered in the pool for the rider allocation algorithm.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Suspension of a rider with an active delivery

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

I am an Administrator and a Rider is currently 'In Transit' with an order

### 3.4.5 When

I suspend that Rider's account

### 3.4.6 Then

The rider's account is suspended, AND a high-priority alert is created for an administrator to manually handle the in-progress order (e.g., re-assign or cancel).

### 3.4.7 Validation Notes

Confirm the alert is generated in the admin system and contains the relevant order and rider details.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Admin attempts to suspend an already suspended account

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

I am an Administrator viewing the profile of a user whose status is already 'Suspended'

### 3.5.5 When

I look for the option to suspend the account

### 3.5.6 Then

The 'Suspend Account' button is disabled or replaced with a 'Reactivate Account' button. It is not possible to re-suspend the account.

### 3.5.7 Validation Notes

Check the UI on a suspended user's profile to ensure the action is not available.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Admin cancels the suspension action

### 3.6.3 Scenario Type

Alternative_Flow

### 3.6.4 Given

I am an Administrator and have clicked 'Suspend Account' on a user's profile, opening the confirmation modal

### 3.6.5 When

I click the 'Cancel' button

### 3.6.6 Then

The modal closes, and no changes are made to the user's account status or the audit trail.

### 3.6.7 Validation Notes

Verify that the user's status in the database remains 'Active' and no audit log was created.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A 'Suspend Account' button on the user details page in the admin dashboard.
- A confirmation modal that appears upon clicking the suspend button.
- A mandatory text area within the modal for entering the reason for suspension.
- 'Confirm Suspension' and 'Cancel' buttons within the modal.
- A clear visual indicator (e.g., a colored badge) on user lists and profiles to show 'Suspended' status.

## 4.2.0 User Interactions

- The suspend action requires a two-step process: click button, then confirm in modal.
- The 'Confirm Suspension' button in the modal is disabled until a reason is entered.

## 4.3.0 Display Requirements

- The user's current status must always be visible on their profile page.
- The reason for suspension should be viewable in the user's activity log or within the audit trail.

## 4.4.0 Accessibility Needs

- All buttons and modal elements must be keyboard-navigable and compliant with WCAG 2.1 Level AA, as per REQ-INT-001.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-SUS-001

### 5.1.2 Rule Description

A reason must be provided for every account suspension.

### 5.1.3 Enforcement Point

API level and UI validation before processing the suspension request.

### 5.1.4 Violation Handling

The API will return a 400 Bad Request error if the reason is missing. The UI will prevent form submission.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-SUS-002

### 5.2.2 Rule Description

Suspension of a user account must be logged in the immutable audit trail.

### 5.2.3 Enforcement Point

Within the user management service logic, as part of the same transaction as the status update.

### 5.2.4 Violation Handling

If the audit log fails to write, the entire suspension transaction must be rolled back.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

ADM-005

#### 6.1.1.2 Dependency Reason

This story provides the user management interface where the 'Suspend' action will be initiated.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-021

#### 6.1.2.2 Dependency Reason

The audit trail system must be in place to log this critical administrative action as required.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

SYS-001

#### 6.1.3.2 Dependency Reason

The logic for auto-cancelling a vendor's pending orders is required for the vendor suspension flow.

## 6.2.0.0 Technical Dependencies

- User Management microservice with a user status field (e.g., 'active', 'suspended').
- Authentication service (AWS Cognito) API for disabling a user and invalidating sessions.
- Audit Trail service/database for logging actions.
- An event bus (e.g., AWS SQS/SNS) for publishing a `UserSuspended` event to other services (Vendor, Rider, Order).

## 6.3.0.0 Data Dependencies

- Access to the user database to update the user's status.
- Access to the audit log database to record the action.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API call to suspend a user, including database updates and audit logging, must complete with a P95 latency of under 500ms.

## 7.2.0.0 Security

- The API endpoint for suspending users must be protected by Role-Based Access Control (RBAC), accessible only to the 'Administrator' role (REQ-USR-001).
- The user's active session tokens (JWTs) must be invalidated immediately upon suspension to prevent further API access (REQ-NFR-003).
- The reason for suspension, which may contain sensitive information, must be protected with the same access controls as other PII.

## 7.3.0.0 Usability

- The action should be unambiguous and require explicit confirmation to prevent accidental suspensions.

## 7.4.0.0 Accessibility

- The feature must adhere to WCAG 2.1 Level AA standards (REQ-INT-001).

## 7.5.0.0 Compatibility

- The admin dashboard feature must be functional on all modern web browsers supported by the platform.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires cross-service communication via an event bus to handle side effects for different user roles (Vendor, Rider).
- Implementing robust session invalidation for the suspended user.
- Defining and handling the edge case of suspending a rider during an active delivery.

## 8.3.0.0 Technical Risks

- Potential for race conditions if a user performs an action at the exact moment of suspension. Session invalidation must be swift.
- Failure in the event bus could lead to inconsistent states (e.g., user suspended but their store remains online). A retry mechanism or dead-letter queue is needed.

## 8.4.0.0 Integration Points

- Authentication Service (AWS Cognito): To disable the user.
- User Database (PostgreSQL): To update the user's status.
- Audit Service: To log the action.
- Event Bus (AWS SNS/SQS): To notify other services.
- Vendor Service: To listen for `UserSuspended` events and take stores offline.
- Rider Service: To listen for `UserSuspended` events and force riders offline.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Verify an admin can suspend a customer, vendor, and rider.
- Verify a suspended user of each type cannot log in.
- Verify a suspended vendor's store is offline.
- Verify a suspended rider cannot be assigned tasks.
- Verify the audit log is correctly written for each suspension.
- Verify an admin cannot suspend a user without providing a reason.
- Verify the API endpoint is inaccessible to non-admin roles.

## 9.3.0.0 Test Data Needs

- Test accounts for each user role (Customer, Vendor, Rider).
- An active Administrator account.
- A vendor with pending orders.
- A rider with an in-progress delivery.

## 9.4.0.0 Testing Tools

- Jest for unit/integration tests.
- Cypress for E2E tests.
- Postman or similar for API security testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >= 80% coverage and all passing
- E2E tests for suspension flows are created and passing
- Security testing confirms endpoint is protected and sessions are invalidated
- The `UserSuspended` event is correctly published and consumed by downstream services
- All UI elements are responsive and meet accessibility standards
- Relevant technical documentation (e.g., API spec, event schema) is updated
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- Requires that the event bus infrastructure is already in place or planned for the same sprint.
- Coordination may be needed between developers working on the User, Vendor, and Rider services.

## 11.4.0.0 Release Impact

This is a critical feature for platform launch to ensure moderation capabilities are available from day one.

