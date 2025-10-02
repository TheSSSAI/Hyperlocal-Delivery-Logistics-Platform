# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | CUS-003 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Customer Login with OTP |
| As A User Story | As a registered customer, I want to log in to my a... |
| User Persona | A returning customer who has already completed the... |
| Business Value | Provides a secure and convenient method for users ... |
| Functional Area | User Management |
| Story Theme | User Authentication & Access Control |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Successful Login on Happy Path

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

A registered customer is on the login screen of the mobile application

### 3.1.5 When

The customer enters their valid, registered mobile number and requests an OTP

### 3.1.6 And

The customer receives the OTP via SMS and enters it correctly into the app within the validity period

### 3.1.7 Then

The system validates the OTP, issues a JWT access token and a refresh token, and redirects the customer to the main dashboard/home screen.

### 3.1.8 Validation Notes

Verify that a valid JWT is received by the client and the user is navigated to the correct post-login screen. The entire process from OTP request to token issuance must complete within 3 seconds as per REQ-FUN-002.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Login Attempt with Unregistered Mobile Number

### 3.2.3 Scenario Type

Error_Condition

### 3.2.4 Given

A user is on the login screen

### 3.2.5 When

The user enters a validly formatted mobile number that is not associated with any registered account and requests an OTP

### 3.2.6 Then

The system shall not send an OTP and shall display a clear, non-committal error message such as 'Mobile number not found. Please check the number or sign up'.

### 3.2.7 Validation Notes

Check the API response for the correct error code and message. Verify that no SMS was sent by checking the notification service logs.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Login Attempt with Invalid OTP

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

A registered customer has successfully requested an OTP for their mobile number

### 3.3.5 When

The customer enters an incorrect OTP

### 3.3.6 Then

The system shall display an error message 'Invalid OTP. Please try again.' and the failed attempt count for the account shall be incremented.

### 3.3.7 Validation Notes

Verify the error message is displayed to the user and the session is not established. Check backend logs for the incremented failure count.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Account Lockout After Multiple Failed OTP Attempts

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

A registered customer has made 4 consecutive failed OTP attempts

### 3.4.5 When

The customer makes a 5th consecutive failed OTP attempt

### 3.4.6 Then

The system shall temporarily lock the account for a configurable period (e.g., 15 minutes) and display a message 'Too many failed attempts. Your account is locked. Please try again later.'

### 3.4.7 Validation Notes

Verify that subsequent login attempts for this mobile number are blocked for the duration of the lockout, as per REQ-FUN-002.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

OTP Generation Rate Limiting

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

A customer has requested an OTP

### 3.5.5 When

The customer attempts to request another OTP before the cooldown period (e.g., 60 seconds) has elapsed

### 3.5.6 Then

The system shall prevent a new OTP from being generated and display a message indicating how long they must wait.

### 3.5.7 Validation Notes

Test by repeatedly tapping the 'Resend OTP' button. The API should return a '429 Too Many Requests' error, as per REQ-FUN-002.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Login Attempt with Expired OTP

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

A registered customer has requested an OTP which has a validity of 5 minutes

### 3.6.5 When

The customer enters the correct OTP after 5 minutes have passed

### 3.6.6 Then

The system shall reject the OTP and display an error message 'OTP has expired. Please request a new one.'

### 3.6.7 Validation Notes

Requires the ability to manipulate time in the test environment or wait for the actual expiry period.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Input field for 10-digit mobile number with country code pre-filled (+91)
- Button to 'Request OTP'
- Input field for 6-digit OTP
- Button to 'Verify & Login'
- Text display for countdown timer before OTP can be resent
- Clickable text/link to 'Resend OTP' (disabled during countdown)
- Area for displaying error messages

## 4.2.0 User Interactions

- On entering mobile number and clicking 'Request OTP', the UI transitions to the OTP entry view.
- The OTP input field should auto-focus.
- The 'Resend OTP' link becomes active only after the countdown timer finishes.

## 4.3.0 Display Requirements

- A confirmation message 'OTP sent to +91 XXXXX-XXXXX' should appear.
- Error messages must be clear, concise, and displayed close to the relevant input field.

## 4.4.0 Accessibility Needs

- All input fields must have associated labels for screen readers.
- Buttons must have accessible names.
- Error messages must be programmatically associated with their respective inputs.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-LOGIN-001

### 5.1.2 Rule Description

A user account shall be temporarily locked after 5 consecutive failed OTP attempts.

### 5.1.3 Enforcement Point

Backend Authentication Service, upon OTP validation failure.

### 5.1.4 Violation Handling

Block login attempts for the specified mobile number for a configurable duration. Log the lockout event.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-LOGIN-002

### 5.2.2 Rule Description

OTP generation requests for a single mobile number shall be rate-limited.

### 5.2.3 Enforcement Point

Backend API endpoint for requesting OTPs.

### 5.2.4 Violation Handling

Return an HTTP 429 error if requests exceed the defined limit (e.g., 1 request per 60 seconds).

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

- {'story_id': 'CUS-001', 'dependency_reason': 'A customer must be able to register an account before they can log in. This story creates the user record that the login process validates against.'}

## 6.2.0 Technical Dependencies

- AWS Cognito for user authentication management (REQ-NFR-003).
- AWS Simple Notification Service (SNS) for sending transactional SMS (REQ-INT-003).
- A configured User Pool in Cognito.
- Backend service/lambda for handling the custom authentication flow.

## 6.3.0 Data Dependencies

- Access to the user database/directory to verify if a mobile number is registered.

## 6.4.0 External Dependencies

- Availability and latency of the AWS SNS service for timely OTP delivery.

# 7.0.0 Non Functional Requirements

## 7.1.0 Performance

- The end-to-end login process, from OTP request to token issuance, shall complete within 3 seconds (REQ-FUN-002).
- The P95 latency for the OTP validation API call shall be under 200ms (REQ-NFR-001).

## 7.2.0 Security

- All communication must be over HTTPS/TLS 1.2+ (REQ-INT-004).
- Generated JWT access tokens must be short-lived (e.g., 1 hour).
- Refresh tokens must be long-lived and stored securely on the client device (e.g., Keychain/Keystore) (REQ-FUN-002).
- Refresh tokens must be invalidated on logout.
- OTPs must be cryptographically secure random numbers and single-use.

## 7.3.0 Usability

- The login process should be simple and intuitive, requiring minimal steps.
- Error messages must be user-friendly and provide clear guidance.

## 7.4.0 Accessibility

- The login interface must comply with WCAG 2.1 Level AA standards (REQ-INT-001).

## 7.5.0 Compatibility

- The feature must function correctly on supported versions of iOS and Android.

# 8.0.0 Implementation Considerations

## 8.1.0 Complexity Assessment

Medium

## 8.2.0 Complexity Factors

- Integration with external services (AWS Cognito, AWS SNS).
- Implementation of a custom authentication flow in Cognito.
- Secure implementation of rate limiting and account lockout logic.
- Secure client-side storage and management of JWTs (access and refresh tokens).

## 8.3.0 Technical Risks

- Delays or failures in the third-party SMS gateway (SNS) could prevent users from logging in.
- Incorrect configuration of Cognito custom auth flow could lead to security vulnerabilities.

## 8.4.0 Integration Points

- Authentication Service (AWS Cognito)
- Notification Service (AWS SNS)
- API Gateway
- Client Application (React Native)

# 9.0.0 Testing Requirements

## 9.1.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Performance

## 9.2.0 Test Scenarios

- Successful login with a valid OTP.
- Attempted login with an unregistered number.
- Attempted login with an incorrect OTP.
- Verification of account lockout after 5 failed attempts.
- Verification of OTP resend rate limiting.
- Attempted login with an expired OTP.
- Verification of secure token storage on the client.

## 9.3.0 Test Data Needs

- A set of registered customer accounts with known mobile numbers.
- A list of mobile numbers known not to be registered.
- A mechanism in the test environment to retrieve the generated OTP without relying on actual SMS delivery.

## 9.4.0 Testing Tools

- Jest & React Testing Library for frontend unit tests.
- Jest for backend unit/integration tests.
- Cypress for End-to-End testing.
- Postman/Insomnia for API-level testing.

# 10.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one other engineer
- Unit and integration tests implemented with >= 80% code coverage and all are passing
- E2E automated tests for the login flow are created and passing
- User interface reviewed and approved by the design team
- Performance requirement (login < 3s) is load tested and verified
- Security requirements (rate limiting, lockout, HTTPS) are implemented and validated via testing
- All code is merged into the main development branch
- Story deployed and successfully verified in the staging environment

# 11.0.0 Planning Information

## 11.1.0 Story Points

5

## 11.2.0 Priority

🔴 High

## 11.3.0 Sprint Considerations

- This is a foundational story and a blocker for almost all other customer-facing features.
- It should be prioritized for an early sprint.
- Requires coordination between frontend and backend developers for API contract and token handling.

## 11.4.0 Release Impact

This feature is essential for the initial MVP launch. The platform cannot go live without it.

