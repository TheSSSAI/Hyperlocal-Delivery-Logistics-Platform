# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-004 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider Login with OTP |
| As A User Story | As a registered Rider, I want to log in to the mob... |
| User Persona | A registered Rider whose account has been approved... |
| Business Value | Provides a secure, password-less authentication me... |
| Functional Area | User Management & Authentication |
| Story Theme | Rider Onboarding and Access |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

RDR-004-AC-01

### 3.1.2 Scenario

Successful login with valid mobile number and OTP

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a registered and approved rider is on the login screen of the rider application

### 3.1.5 When

the rider enters their registered mobile number, taps 'Send OTP', receives the OTP via SMS, enters the correct OTP within the validity period, and taps 'Verify'

### 3.1.6 Then

the system successfully validates the OTP, issues a JWT access token and a refresh token, and navigates the rider to the main application dashboard.

### 3.1.7 Validation Notes

Verify that the JWT tokens are generated and stored securely on the client device. The redirection to the dashboard should be seamless. The login process from OTP request to token issuance must complete within 3 seconds as per REQ-FUN-002.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

RDR-004-AC-02

### 3.2.2 Scenario

Login attempt with an unregistered mobile number

### 3.2.3 Scenario Type

Error_Condition

### 3.2.4 Given

a user is on the login screen

### 3.2.5 When

the user enters a mobile number that is not associated with an approved rider account and taps 'Send OTP'

### 3.2.6 Then

the system displays a clear, non-generic error message (e.g., 'This mobile number is not registered. Please sign up or use a registered number.') and does not send an OTP.

### 3.2.7 Validation Notes

Check that no OTP generation event is triggered and no SMS is sent. The API response should be a specific error code indicating 'user not found'.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

RDR-004-AC-03

### 3.3.2 Scenario

Login attempt with an incorrect OTP

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

a registered rider has successfully requested and received an OTP

### 3.3.5 When

the rider enters an incorrect OTP and taps 'Verify'

### 3.3.6 Then

the system displays an error message (e.g., 'Invalid OTP. Please try again.'), the OTP input field is cleared, and the user remains on the OTP entry screen. A failed attempt counter is incremented for the account.

### 3.3.7 Validation Notes

Verify that the session is not established and the failed attempt is logged against the user's account.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

RDR-004-AC-04

### 3.4.2 Scenario

Account is temporarily locked after multiple consecutive failed OTP attempts

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

a registered rider has entered an incorrect OTP 4 consecutive times

### 3.4.5 When

the rider enters an incorrect OTP for the 5th consecutive time

### 3.4.6 Then

the system displays a message (e.g., 'Account temporarily locked due to too many failed attempts. Please try again in 15 minutes.'), and prevents any further login attempts for that account for the configured duration.

### 3.4.7 Validation Notes

This must align with REQ-FUN-002. Test that both OTP request and OTP verification are blocked for the locked account during the lockout period.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

RDR-004-AC-05

### 3.5.2 Scenario

OTP generation is rate-limited to prevent abuse

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

a user has just requested an OTP for a valid mobile number

### 3.5.5 When

the user immediately taps the 'Resend OTP' button within the rate-limit window (e.g., 60 seconds)

### 3.5.6 Then

the system displays a message (e.g., 'Please wait 45 seconds before requesting a new OTP.') and does not send a new OTP.

### 3.5.7 Validation Notes

Verify that the 'Resend OTP' button is disabled and shows a countdown timer. This aligns with REQ-FUN-002.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

RDR-004-AC-06

### 3.6.2 Scenario

Login attempt with an expired OTP

### 3.6.3 Scenario Type

Edge_Case

### 3.6.4 Given

a registered rider has requested an OTP and the OTP's validity period (e.g., 5 minutes) has passed

### 3.6.5 When

the rider enters the expired OTP and taps 'Verify'

### 3.6.6 Then

the system displays an error message (e.g., 'OTP has expired. Please request a new one.') and the user is prompted to request a new OTP.

### 3.6.7 Validation Notes

The backend must check the OTP's timestamp upon verification. The previous OTP should be invalidated.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Input field for mobile number with country code pre-filled (+91).
- Button to 'Send OTP'.
- Input field for the 4 or 6-digit OTP.
- Button to 'Verify' or 'Login'.
- A 'Resend OTP' link/button with a countdown timer.
- Loading indicator/spinner during API calls.
- Error message display area.

## 4.2.0 User Interactions

- Mobile number input should validate for 10 digits.
- After tapping 'Send OTP', the OTP input field should become enabled and focused.
- The 'Resend OTP' button should be disabled until a timer (e.g., 60 seconds) completes.
- Upon successful login, the user is navigated away from the login screen.

## 4.3.0 Display Requirements

- Clear instructions for the user at each step.
- Error messages must be user-friendly and specific.

## 4.4.0 Accessibility Needs

- All input fields must have clear labels.
- Buttons must have accessible names.
- The app should be navigable using screen readers.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-AUTH-01

### 5.1.2 Rule Description

A user account will be temporarily locked after 5 consecutive failed OTP attempts.

### 5.1.3 Enforcement Point

Backend authentication service during OTP verification.

### 5.1.4 Violation Handling

Block login attempts for the account for a configurable duration (e.g., 15 minutes) and log the security event.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-AUTH-02

### 5.2.2 Rule Description

OTP generation for a single mobile number is rate-limited to one request per 60 seconds.

### 5.2.3 Enforcement Point

Backend API endpoint for requesting OTPs.

### 5.2.4 Violation Handling

Reject the request with an error message indicating the remaining wait time.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-001

#### 6.1.1.2 Dependency Reason

A rider must be able to register an account before they can log in.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-003

#### 6.1.2.2 Dependency Reason

A rider's account must be approved by an admin to be considered 'registered' and eligible for login.

## 6.2.0.0 Technical Dependencies

- AWS Cognito: User pool for Riders must be configured to support a custom OTP-based authentication flow (REQ-NFR-003).
- AWS SNS (or other SMS provider): Integration must be complete to send transactional SMS for OTPs (REQ-INT-003).
- Backend Authentication Service: Endpoints for requesting and verifying OTPs must be created.
- API Gateway: Public endpoints for login must be configured and secured.

## 6.3.0.0 Data Dependencies

- Requires access to the Rider user database/pool to verify if a mobile number is registered and approved.

## 6.4.0.0 External Dependencies

- Reliability of the third-party SMS gateway for timely OTP delivery.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The login process, from OTP request to token issuance, shall complete within 3 seconds (REQ-FUN-002).
- The P95 latency for the OTP request and verification APIs shall be under 200ms (REQ-NFR-001).

## 7.2.0.0 Security

- All communication must use HTTPS/TLS 1.2+ (REQ-INT-004).
- JWT access tokens must be short-lived; refresh tokens must be used for re-authentication and stored securely on the client (REQ-FUN-002).
- The system must implement rate limiting and account lockout mechanisms as defined in the business rules (REQ-FUN-002).
- Input validation must be performed on the mobile number to prevent injection attacks.

## 7.3.0.0 Usability

- The login process should be intuitive and require minimal steps.
- Error messages should be clear and guide the user on how to proceed.

## 7.4.0.0 Accessibility

- The login interface must comply with WCAG 2.1 Level AA standards (REQ-INT-001).

## 7.5.0.0 Compatibility

- The feature must be fully functional on the supported versions of iOS and Android for the React Native application.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Integration with AWS Cognito for a custom authentication flow.
- Implementing robust error handling and fallback for the external SMS gateway.
- Building and tuning the rate limiting and account lockout logic (potentially using Redis).
- Secure management of JWTs (access and refresh tokens) on the mobile client (React Native).

## 8.3.0.0 Technical Risks

- Delays in OTP delivery from the SMS provider can negatively impact user experience.
- Incorrect implementation of token storage on the client could lead to security vulnerabilities.

## 8.4.0.0 Integration Points

- AWS Cognito (Authentication)
- AWS SNS (SMS Notifications)
- Backend User Service (User data lookup)
- Client-side secure storage (for tokens)

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Performance

## 9.2.0.0 Test Scenarios

- Verify successful login flow.
- Test login with unregistered/unapproved rider numbers.
- Test incorrect and expired OTP scenarios.
- Verify that account lockout is triggered after 5 failed attempts and released after the timeout.
- Verify that OTP resend is rate-limited.
- Test the flow on both iOS and Android devices.

## 9.3.0.0 Test Data Needs

- A set of approved rider accounts with known mobile numbers.
- A set of mobile numbers that are not registered.
- A mechanism in the test environment to retrieve the generated OTP without relying on actual SMS delivery.

## 9.4.0.0 Testing Tools

- Jest (Unit/Integration)
- React Testing Library (Frontend)
- Cypress or similar for E2E testing on React Native.
- Postman/Insomnia for API-level testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria are validated and passing in the staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve the required code coverage (80% as per REQ-NFR-006).
- E2E automated tests for all defined scenarios are passing.
- Security review of the authentication flow has been completed.
- Performance testing confirms that latency requirements are met.
- All UI elements are implemented as per the design and accessibility requirements.
- Relevant technical documentation (e.g., API specification) is updated.
- The feature is deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational story for the rider application and blocks most other rider-facing features.
- Requires prior setup and configuration of AWS Cognito and the SMS gateway service.
- The team needs a clear strategy for handling OTPs in non-production environments for testing purposes.

## 11.4.0.0 Release Impact

- This feature is critical for the initial launch of the rider application.

