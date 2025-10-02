# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | CUS-005 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Customer Account Lockout After Failed Attempts |
| As A User Story | As a security-conscious customer, I want the syste... |
| User Persona | Registered Customer attempting to log in. |
| Business Value | Enhances platform security by preventing brute-for... |
| Functional Area | User Management & Authentication |
| Story Theme | Account Security |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Account is locked after maximum consecutive failed OTP attempts

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

A customer is on the OTP login screen and has already entered 4 incorrect OTPs consecutively for their mobile number

### 3.1.5 When

The customer enters a 5th incorrect OTP

### 3.1.6 Then

The system locks the account associated with the mobile number for the configured duration (e.g., 15 minutes)

### 3.1.7 And

The customer is shown a specific error message: "Too many failed attempts. Your account is locked for 15 minutes."

### 3.1.8 Validation Notes

Verify that a lock status and expiry timestamp are set for the user's account in the backend (e.g., in Redis).

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

User is prevented from logging in or requesting a new OTP while account is locked

### 3.2.3 Scenario Type

Error_Condition

### 3.2.4 Given

A customer's account is currently in a locked state

### 3.2.5 When

The customer attempts to request a new OTP or submit any OTP on the login screen

### 3.2.6 Then

The system rejects the request

### 3.2.7 And

The customer is shown an error message indicating the account is still locked and the remaining time, e.g., "Your account is locked. Please try again in 8 minutes."

### 3.2.8 Validation Notes

The API endpoint for OTP generation/validation should return an appropriate error (e.g., 429 Too Many Requests) with a descriptive message.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Failed attempt counter is reset after a successful login

### 3.3.3 Scenario Type

Alternative_Flow

### 3.3.4 Given

A customer has entered 3 incorrect OTPs consecutively

### 3.3.5 When

The customer enters the correct OTP on their 4th attempt

### 3.3.6 Then

The system successfully authenticates the customer and grants them access

### 3.3.7 And

The consecutive failed attempt counter for that account is reset to zero.

### 3.3.8 Validation Notes

Check the backend data store (e.g., Redis) to confirm the attempt counter for the user has been deleted or reset.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Account is automatically unlocked after the lockout duration expires

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

A customer's account has been locked and the 15-minute lockout period has passed

### 3.4.5 When

The customer navigates to the login screen and requests a new OTP

### 3.4.6 Then

The system successfully generates and sends a new OTP to their mobile number

### 3.4.7 And

The failed attempt counter is reset to zero, allowing them a fresh set of attempts.

### 3.4.8 Validation Notes

This can be tested by manipulating time in a test environment or waiting for the TTL on the lockout key in Redis to expire.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Failed attempt counter is persistent across sessions

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

A customer has entered 2 incorrect OTPs

### 3.5.5 When

The customer closes the application, reopens it, and enters a 3rd incorrect OTP

### 3.5.6 Then

The system correctly registers this as the 3rd consecutive failed attempt.

### 3.5.7 Validation Notes

Verify that the counter is managed server-side and is not lost if the client application is terminated.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Error message display area on the OTP verification screen.

## 4.2.0 User Interactions

- Upon lockout, the OTP input field and 'Resend OTP' button should be disabled or non-functional.
- The error message should replace any generic validation messages.

## 4.3.0 Display Requirements

- The lockout error message must be clear, user-friendly, and explicitly state that the account is locked and for how long.
- The error message for attempting an action during lockout must show the remaining time.

## 4.4.0 Accessibility Needs

- Error messages must be programmatically associated with the input field and announced by screen readers (e.g., using `aria-live='assertive'`).

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-LOCKOUT-001

### 5.1.2 Rule Description

An account shall be temporarily locked after 5 consecutive failed OTP login attempts.

### 5.1.3 Enforcement Point

Server-side, within the authentication service during OTP validation.

### 5.1.4 Violation Handling

The account is placed in a 'locked' state for a configured duration.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-LOCKOUT-002

### 5.2.2 Rule Description

The default temporary account lockout duration shall be 15 minutes.

### 5.2.3 Enforcement Point

Server-side, when the lock is initiated.

### 5.2.4 Violation Handling

N/A. This is a system parameter.

## 5.3.0 Rule Id

### 5.3.1 Rule Id

BR-LOCKOUT-003

### 5.3.2 Rule Description

The maximum number of failed attempts and the lockout duration must be configurable by an Administrator via backend configuration.

### 5.3.3 Enforcement Point

System configuration files or environment variables.

### 5.3.4 Violation Handling

N/A. This is a system design requirement.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

- {'story_id': 'CUS-003', 'dependency_reason': 'This story enhances the OTP login flow. The basic OTP validation mechanism must exist before it can be secured with a lockout feature.'}

## 6.2.0 Technical Dependencies

- Authentication microservice (as per REQ-ARC-001)
- Amazon ElastiCache for Redis (as per REQ-TEC-001) for high-performance state management of attempt counters and lockout flags.

## 6.3.0 Data Dependencies

*No items available*

## 6.4.0 External Dependencies

*No items available*

# 7.0.0 Non Functional Requirements

## 7.1.0 Performance

- The check for failed attempts and lockout status must add negligible latency (< 20ms) to the OTP validation API call.
- The overall login process, including this check, must complete within 3 seconds as per REQ-FUN-002.

## 7.2.0 Security

- The failed attempt counter and lockout status must be managed exclusively on the server-side to prevent client-side manipulation.
- The lockout mechanism is a primary defense against brute-force attacks.
- All related logs should be monitored for suspicious patterns indicative of a large-scale attack.

## 7.3.0 Usability

- Error messages must be clear and provide actionable information to the user (i.e., why it's locked and when they can try again).

## 7.4.0 Accessibility

- Must comply with WCAG 2.1 Level AA, ensuring error messages are accessible to users with disabilities.

## 7.5.0 Compatibility

- The logic is backend-only, but the resulting error messages must be handled gracefully by all client applications (React Native, React.js).

# 8.0.0 Implementation Considerations

## 8.1.0 Complexity Assessment

Medium

## 8.2.0 Complexity Factors

- Requires integration with a stateful, high-performance datastore like Redis.
- Involves temporal logic (Time-To-Live/TTL) for both the attempt counter and the lockout period.
- Requires careful state management to correctly increment, reset, and clear counters and locks.
- The API contract for the login endpoint needs to be updated to include new error responses for the locked state.

## 8.3.0 Technical Risks

- Misconfiguration of Redis TTLs could lead to accounts being locked indefinitely or not at all.
- Potential for race conditions if not implemented atomically (e.g., using Redis `INCR` operation).

## 8.4.0 Integration Points

- Authentication Service's OTP validation logic.
- Amazon ElastiCache for Redis.

# 9.0.0 Testing Requirements

## 9.1.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0 Test Scenarios

- Verify lockout after exactly 5 failed attempts.
- Verify no lockout after 4 failed attempts.
- Verify login is blocked during the lockout period.
- Verify login is possible immediately after the lockout period expires.
- Verify the attempt counter resets upon successful login.
- Verify the attempt counter persists if the user closes and reopens the app.

## 9.3.0 Test Data Needs

- A test user account with a known mobile number.

## 9.4.0 Testing Tools

- Jest for unit/integration tests (mocking Redis).
- Cypress for end-to-end testing of the UI flow.
- A tool to inspect Redis keys/values during tests.

# 10.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >= 80% coverage for the new logic
- E2E tests for the lockout scenario are created and passing
- User interface on all clients correctly displays the lockout messages
- Performance impact on the login API is verified to be within acceptable limits
- Security review confirms the mechanism is sound and server-side only
- Configuration for attempt limit and lockout duration is externalized from code
- Story deployed and verified in the staging environment

# 11.0.0 Planning Information

## 11.1.0 Story Points

3

## 11.2.0 Priority

🔴 High

## 11.3.0 Sprint Considerations

- This is a critical security feature that should be implemented alongside or immediately after the core login functionality.
- Requires the development/staging environment to have a configured Redis instance available.

## 11.4.0 Release Impact

Essential for any public release of the application to ensure basic account security.

