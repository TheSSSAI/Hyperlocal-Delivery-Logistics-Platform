# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | VND-004 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Vendor Login with OTP |
| As A User Story | As a registered vendor, I want to log in to my das... |
| User Persona | A registered vendor whose account has been approve... |
| Business Value | Provides secure, passwordless access for vendors t... |
| Functional Area | User Management |
| Story Theme | Vendor Onboarding and Access |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Successful login with a valid mobile number and correct OTP

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a registered and active vendor on the vendor login page

### 3.1.5 When

I enter my valid, registered mobile number, request an OTP, receive it via SMS, and enter the correct OTP within the validity period

### 3.1.6 Then

The system validates the OTP, issues a JSON Web Token (JWT) access token and a refresh token, and redirects me to my vendor dashboard.

### 3.1.7 Validation Notes

Verify redirection to the correct dashboard URL. Inspect browser storage for the presence of JWTs. The entire process from OTP request to token issuance should be under 3 seconds as per REQ-FUN-002.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Login attempt with an unregistered mobile number

### 3.2.3 Scenario Type

Error_Condition

### 3.2.4 Given

I am on the vendor login page

### 3.2.5 When

I enter a mobile number that is not associated with any vendor account and request an OTP

### 3.2.6 Then

The system displays a clear error message, such as 'This mobile number is not registered. Please sign up or use a different number.', and does not send an OTP.

### 3.2.7 Validation Notes

Verify that no SMS is sent and the UI displays the specified error message without revealing whether the number exists for security reasons.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Login attempt with an invalid OTP

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

I have successfully requested an OTP to my registered mobile number

### 3.3.5 When

I enter an incorrect OTP and submit it

### 3.3.6 Then

The system displays an error message, such as 'Invalid OTP. Please try again.', and increments the failed attempt counter for my account.

### 3.3.7 Validation Notes

Verify the user remains on the OTP entry screen and the error message is displayed. Check backend logs for the failed attempt count increment.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Account is temporarily locked after multiple failed OTP attempts

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

I have entered an incorrect OTP 4 consecutive times

### 3.4.5 When

I enter an incorrect OTP for the 5th consecutive time

### 3.4.6 Then

The system displays an error message, such as 'Your account has been temporarily locked. Please try again in 15 minutes.', and prevents any further login attempts for that mobile number for the configured duration.

### 3.4.7 Validation Notes

Verify that subsequent login attempts (both OTP request and verification) for this number are blocked for the lockout period and return an appropriate error.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

OTP request rate limiting

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

I have just requested an OTP

### 3.5.5 When

I attempt to request another OTP before the cooldown period (e.g., 60 seconds) has passed

### 3.5.6 Then

The system prevents a new OTP from being sent and displays a message, such as 'Please wait before requesting a new OTP.'

### 3.5.7 Validation Notes

The 'Resend OTP' button should be disabled during the cooldown period. Verify that no new SMS is triggered if the API is called directly.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Login attempt with an expired OTP

### 3.6.3 Scenario Type

Edge_Case

### 3.6.4 Given

I have received an OTP, but its validity period (e.g., 5 minutes) has passed

### 3.6.5 When

I enter the expired (but correct) OTP

### 3.6.6 Then

The system rejects the OTP and displays an error message, such as 'OTP has expired. Please request a new one.'

### 3.6.7 Validation Notes

Test by waiting for the configured OTP TTL to expire before submitting. The system should treat it as an invalid OTP.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Login attempt with a non-active vendor account

### 3.7.3 Scenario Type

Error_Condition

### 3.7.4 Given

My vendor account exists but its status is 'pending_verification' or 'suspended'

### 3.7.5 When

I enter my mobile number and request an OTP

### 3.7.6 Then

The system displays an appropriate message (e.g., 'Your account is pending approval.' or 'Your account is suspended.') and does not proceed with the login flow.

### 3.7.7 Validation Notes

Verify that no OTP is sent for accounts in these states. This check should happen before the OTP generation step.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Input field for mobile number (pre-filled with country code +91).
- Button to 'Send OTP' or 'Continue'.
- Input field for 4 or 6-digit OTP.
- Button to 'Verify & Login'.
- A 'Resend OTP' link/button with a visible cooldown timer.
- Display area for error messages.

## 4.2.0 User Interactions

- On entering the mobile number and clicking 'Send OTP', the OTP input field becomes visible/active.
- The 'Resend OTP' button is initially disabled for a cooldown period (e.g., 60 seconds).
- Upon successful login, the user is automatically redirected to the vendor dashboard.

## 4.3.0 Display Requirements

- Clear instructions for the user at each step.
- Error messages must be user-friendly and specific.
- A loading indicator should be shown during API calls (e.g., while sending OTP or verifying).

## 4.4.0 Accessibility Needs

- All form fields must have associated labels.
- Buttons must have accessible names.
- Error messages must be associated with the relevant input field and announced by screen readers.
- UI must comply with WCAG 2.1 Level AA.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-LOGIN-001

### 5.1.2 Rule Description

An account will be temporarily locked for 15 minutes after 5 consecutive failed OTP attempts.

### 5.1.3 Enforcement Point

OTP Verification Service

### 5.1.4 Violation Handling

Block further login attempts from the mobile number for the duration and log the security event.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-LOGIN-002

### 5.2.2 Rule Description

A new OTP cannot be requested for the same mobile number within 60 seconds of the previous request.

### 5.2.3 Enforcement Point

OTP Generation Service

### 5.2.4 Violation Handling

Reject the request and return an error indicating the user must wait.

## 5.3.0 Rule Id

### 5.3.1 Rule Id

BR-LOGIN-003

### 5.3.2 Rule Description

Generated OTPs are valid for 5 minutes.

### 5.3.3 Enforcement Point

OTP Verification Service

### 5.3.4 Violation Handling

Reject any OTP submitted after its expiration time.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

VND-001

#### 6.1.1.2 Dependency Reason

A vendor must be able to register an account before they can log in.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-003

#### 6.1.2.2 Dependency Reason

A vendor's account must be approved and in an 'active' state to be able to log in.

## 6.2.0.0 Technical Dependencies

- AWS Cognito (or equivalent authentication service) for user identity management and token generation (REQ-NFR-003).
- AWS SNS (or equivalent SMS gateway) for sending OTPs (REQ-INT-003).
- A caching layer (e.g., Redis) for managing OTPs, failed attempt counters, and rate limiting.
- Vendor User Database to check account status.

## 6.3.0.0 Data Dependencies

- Access to the vendor user table/collection to verify mobile number existence and account status ('active', 'pending_verification', 'suspended').

## 6.4.0.0 External Dependencies

- Reliable and timely delivery from the third-party SMS gateway provider.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The login process, from OTP request to token issuance, shall complete within 3 seconds (REQ-FUN-002).
- The P95 latency for the 'Request OTP' API endpoint shall be under 500ms.

## 7.2.0.0 Security

- All communication must be over HTTPS/TLS 1.2+.
- JWT access tokens must be short-lived (e.g., 15 minutes).
- Securely stored refresh tokens must be used to obtain new access tokens.
- Refresh tokens must be invalidated on logout.
- Input validation must be performed on the mobile number to prevent injection attacks.
- The system must not reveal whether a mobile number is registered or not in its error responses to prevent user enumeration.

## 7.3.0.0 Usability

- The login process should be intuitive and require minimal steps.
- Error messages should be clear and actionable.

## 7.4.0.0 Accessibility

- The login interface must be compliant with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The vendor web dashboard login page must be responsive and function correctly on all modern web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Integration with external services (AWS Cognito, AWS SNS).
- Implementation of stateful security logic (rate limiting, attempt counters, lockouts) likely requiring Redis.
- Secure management and handling of JWTs on both client and server.
- Coordinating frontend UI state changes with backend API calls.

## 8.3.0.0 Technical Risks

- Delays or failures in SMS delivery from the third-party provider could block users from logging in.
- Incorrect implementation of security features could expose the system to brute-force attacks.
- Potential for race conditions if rate limiting is not implemented carefully.

## 8.4.0.0 Integration Points

- Authentication Service (AWS Cognito)
- Notification Service (AWS SNS)
- Vendor User Service/Database
- API Gateway

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Performance

## 9.2.0.0 Test Scenarios

- Verify successful login for an active vendor.
- Test login failure for an unregistered number.
- Test login failure for a suspended account.
- Simulate 5 incorrect OTP entries to trigger account lockout and verify the lockout duration.
- Simulate rapid OTP requests to trigger rate limiting.
- Test login with an expired OTP.
- Verify secure token handling in the browser.

## 9.3.0.0 Test Data Needs

- Test vendor accounts with 'active', 'pending_verification', and 'suspended' statuses.
- A pool of valid mobile numbers for automated testing of OTP delivery.
- Mobile numbers not present in the database.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- Cypress for E2E testing.
- Postman/Insomnia for API-level integration testing.
- OWASP ZAP or similar for security scanning.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >80% code coverage.
- E2E tests for the login flow are automated and passing.
- Security review completed, and vulnerabilities (e.g., related to rate limiting) addressed.
- Performance benchmarks (latency, throughput) are met under simulated load.
- All UI elements are responsive and meet accessibility standards.
- Relevant documentation (API specs, runbooks) has been updated.
- The feature is deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational story and a blocker for nearly all other vendor-facing functionality.
- Requires setup and configuration of AWS Cognito and SNS, which may be a one-time effort.
- The team needs access to the SMS gateway for testing.

## 11.4.0.0 Release Impact

This feature is critical for the initial launch. No vendor can use the platform without it.

