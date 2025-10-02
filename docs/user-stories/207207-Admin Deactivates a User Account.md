# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | ADM-007 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Admin Deactivates a User Account |
| As A User Story | As an Administrator, I want to deactivate a user's... |
| User Persona | Administrator, as defined in REQ-USR-001, with ful... |
| Business Value | Provides essential security and operational contro... |
| Functional Area | User Management |
| Story Theme | Platform Administration & Security |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Happy Path: Admin successfully deactivates an active user account

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am an Administrator logged into the admin dashboard and viewing the profile of an active user

### 3.1.5 When

I click the 'Deactivate Account' button and confirm the action in the subsequent confirmation dialog

### 3.1.6 Then

The user's status in the database is updated to 'deactivated'.

### 3.1.7 Validation Notes

Verify the user's status field in the user table. The API response should confirm the successful status change.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Audit Trail Logging

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

An Administrator has just successfully deactivated a user account

### 3.2.5 When

The deactivation action is processed by the system

### 3.2.6 Then

A new entry is created in the immutable audit trail.

### 3.2.7 Validation Notes

Query the audit log table. The entry must contain the administrator's ID, the target user's ID, the action ('user.deactivate'), a timestamp, and the outcome ('success'). This aligns with REQ-USR-001 and REQ-NFR-008.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Session Invalidation and Login Prevention

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

A user's account has been deactivated

### 3.3.5 When

The deactivated user attempts to use an existing access token or attempts to log in again

### 3.3.6 Then

Any existing sessions for the user are immediately invalidated, and they are prevented from logging in, receiving an 'Account deactivated' error message.

### 3.3.7 Validation Notes

Test API calls with the user's old JWT to ensure a 401/403 error. Attempt a new login via the OTP flow (REQ-FUN-002) and verify it fails with the correct error.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

UI Feedback and State Change

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

An Administrator has deactivated a user account

### 3.4.5 When

The admin dashboard refreshes or the admin views the user's profile again

### 3.4.6 Then

The user's status is clearly displayed as 'Deactivated', and the 'Deactivate Account' button is replaced with a 'Reactivate Account' button (or is disabled).

### 3.4.7 Validation Notes

Visually inspect the user management page (REQ-FUN-019) to confirm the status badge and button state change.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Admin cancels the deactivation process

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

I am an Administrator and the deactivation confirmation dialog is open for a user

### 3.5.5 When

I click the 'Cancel' button or close the dialog

### 3.5.6 Then

The dialog closes, the user's account status remains unchanged, and no audit log entry is created.

### 3.5.7 Validation Notes

Verify the user's status in the database is still 'active' and check that no new entry was added to the audit log for this cancelled action.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Deactivating a Vendor user triggers store deactivation

### 3.6.3 Scenario Type

Edge_Case

### 3.6.4 Given

An Administrator is deactivating a user who has the 'Vendor' role

### 3.6.5 When

The deactivation is confirmed

### 3.6.6 Then

The vendor's associated store is immediately set to 'offline' and is no longer visible to customers.

### 3.6.7 Validation Notes

Check the store's status in the database. Use the customer application to search for the store (REQ-FUN-004) and confirm it does not appear.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Deactivating a Rider user triggers fleet removal

### 3.7.3 Scenario Type

Edge_Case

### 3.7.4 Given

An Administrator is deactivating a user who has the 'Rider' role

### 3.7.5 When

The deactivation is confirmed

### 3.7.6 Then

The rider's status is immediately set to 'offline', and they are removed from the pool of available riders for new task allocations.

### 3.7.7 Validation Notes

Check the rider's availability status in the database. Trigger a new order in their vicinity and confirm they are not considered by the allocation algorithm (REQ-FUN-018).

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A 'Deactivate Account' button on the user profile page in the admin dashboard.
- A confirmation modal/dialog that requires a second explicit confirmation.
- A distinct visual indicator (e.g., status badge) in the user list and profile to show 'Deactivated' status.

## 4.2.0 User Interactions

- Admin clicks button -> Modal appears -> Admin confirms -> System processes action.
- The confirmation modal must clearly state the permanent nature of the action to prevent errors, as per the spirit of REQ-USR-001's two-step confirmation for critical operations.

## 4.3.0 Display Requirements

- The confirmation dialog must display the user's name and/or ID to ensure the admin is deactivating the correct account.
- The login screen must display a specific error message like 'Your account has been deactivated. Please contact support.' for deactivated users.

## 4.4.0 Accessibility Needs

- The confirmation modal must be keyboard-navigable and meet WCAG 2.1 AA standards for focus management and dialogs.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-DEACT-001

### 5.1.2 Rule Description

A deactivated user cannot log in or access any platform services via API.

### 5.1.3 Enforcement Point

Authentication Service (at login) and API Gateway (for existing tokens).

### 5.1.4 Violation Handling

Login attempt is rejected. API calls with a token from a deactivated user are rejected with a 401/403 status.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-DEACT-002

### 5.2.2 Rule Description

Deactivation is a permanent access revocation but not data erasure. User data is retained according to the data retention policy (REQ-NFR-007).

### 5.2.3 Enforcement Point

System logic; this is a design principle.

### 5.2.4 Violation Handling

N/A. This rule guides implementation to not delete data, distinguishing it from an erasure request (CUS-043).

## 5.3.0 Rule Id

### 5.3.1 Rule Id

BR-DEACT-003

### 5.3.2 Rule Description

All administrative deactivation actions must be logged in the immutable audit trail.

### 5.3.3 Enforcement Point

User Management Service, upon successful deactivation.

### 5.3.4 Violation Handling

The deactivation transaction should fail if the audit log entry cannot be created, to ensure full traceability.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

ADM-005

#### 6.1.1.2 Dependency Reason

Requires the user management interface to find and select a user to deactivate.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-021

#### 6.1.2.2 Dependency Reason

Requires the audit trail system to be in place for logging this critical administrative action.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

REQ-FUN-002

#### 6.1.3.2 Dependency Reason

Requires the core authentication and session management system (JWTs) to exist so that sessions can be invalidated.

## 6.2.0.0 Technical Dependencies

- Authentication Service (AWS Cognito per REQ-NFR-003) to disable the user's login capabilities.
- User Management Microservice to update the user's status.
- API Gateway to enforce access control based on user status.
- Message Bus (AWS SQS/SNS per REQ-ARC-001) for publishing a 'user.deactivated' event to other services.
- Audit Logging Service to record the action.

## 6.3.0.0 Data Dependencies

- Requires access to the central user database to read and update user status.

## 6.4.0.0 External Dependencies

- AWS Cognito API for disabling a user profile.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API call to deactivate a user, including all subsequent actions like session invalidation, should complete in under 1000ms.

## 7.2.0.0 Security

- The API endpoint for deactivation must be strictly protected by Role-Based Access Control (RBAC), accessible only to the 'Administrator' role.
- The action must be logged in an immutable audit trail as per REQ-USR-001 and REQ-NFR-008.
- Session invalidation must be immediate to prevent a deactivated user from continuing to use an active session.

## 7.3.0.0 Usability

- The two-step confirmation process must be clear and unambiguous to prevent accidental deactivations.

## 7.4.0.0 Accessibility

- All UI elements must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The admin dashboard functionality must be supported on all modern web browsers specified in REQ-INT-001.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires coordination across multiple microservices (User, Auth, Vendor, Rider, Audit). An event-driven approach using SQS/SNS is recommended.
- Integration with an external service (AWS Cognito) adds complexity.
- Implementing a robust and performant JWT invalidation mechanism (e.g., using a Redis blacklist) is a key challenge.

## 8.3.0.0 Technical Risks

- Failure to propagate the deactivation status to all services could lead to inconsistencies (e.g., a deactivated rider still being assigned an order). The Saga pattern (REQ-ARC-001) should be considered to manage this distributed transaction.
- Latency in session invalidation could create a small window of vulnerability.

## 8.4.0.0 Integration Points

- AWS Cognito: To disable the user at the identity provider level.
- Redis (ElastiCache): For JWT blacklist/revocation list.
- PostgreSQL (RDS): To update the user's status.
- AWS SQS/SNS: To publish the 'user.deactivated' event.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Verify an admin can deactivate a user of each type (Customer, Vendor, Rider).
- Verify a deactivated user cannot log in.
- Verify API calls with a token from a deactivated user are rejected.
- Verify the audit log is correctly populated.
- Verify a deactivated vendor's store disappears from the customer app.
- Verify a deactivated rider is no longer eligible for deliveries.

## 9.3.0.0 Test Data Needs

- Test accounts for an Administrator.
- Active test accounts for a Customer, a Vendor with a live store, and a Rider with 'Online' status.

## 9.4.0.0 Testing Tools

- Jest (Unit/Integration)
- Cypress (E2E)
- Postman or similar for direct API testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria are validated and passing in the staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written with at least 80% coverage (REQ-NFR-006) and are passing.
- E2E tests covering the critical paths are implemented and passing.
- Security review confirms the endpoint is protected and the action is audited.
- Session invalidation mechanism is tested and verified to be effective.
- The 'user.deactivated' event and its consumers in other services are tested.
- API documentation (OpenAPI) for the new endpoint is created/updated.
- The feature is deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story has dependencies on foundational user management and auditing features. It should be scheduled after those are complete.
- The implementation requires a clear architectural decision on handling distributed transactions (e.g., Saga pattern) and session invalidation.

## 11.4.0.0 Release Impact

This is a critical administrative feature required for platform launch to ensure security and operational control.

