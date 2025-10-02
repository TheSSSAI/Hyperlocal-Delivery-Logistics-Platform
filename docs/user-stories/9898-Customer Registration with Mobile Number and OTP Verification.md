# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | CUS-001 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Customer Registration with Mobile Number and OTP V... |
| As A User Story | As a new user of the platform, I want to register ... |
| User Persona | A prospective customer who has not yet created an ... |
| Business Value | Enables new user acquisition by providing a secure... |
| Functional Area | User Management |
| Story Theme | User Onboarding & Authentication |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Successful registration with a valid, new mobile number

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

A new user is on the registration screen and has not previously registered

### 3.1.5 When

The user enters a valid, unregistered 10-digit Indian mobile number and requests an OTP, then enters the correct OTP received via SMS within the validity period

### 3.1.6 Then

The system shall verify the OTP, create a new customer account with a 'verified' status, issue a JWT access and refresh token as per REQ-FUN-002, and navigate the user to the profile creation screen (e.g., to enter their name).

### 3.1.7 Validation Notes

Verify a new user record is created in the database. Verify the API response contains valid JWTs. Verify the mobile app navigates to the correct subsequent screen.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Attempted registration with an invalid mobile number format

### 3.2.3 Scenario Type

Error_Condition

### 3.2.4 Given

A new user is on the registration screen

### 3.2.5 When

The user enters a mobile number that is not a valid 10-digit Indian number (e.g., contains letters, is too short/long)

### 3.2.6 Then

The system shall display an inline validation error message, such as 'Please enter a valid 10-digit mobile number', and the 'Send OTP' button shall be disabled until the format is corrected.

### 3.2.7 Validation Notes

Test with various invalid inputs: '123', '12345678901', 'abcdefghij', '+911234567890'.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Attempted registration with an already existing mobile number

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

A user is on the registration screen

### 3.3.5 When

The user enters a mobile number that is already associated with an existing account and requests an OTP

### 3.3.6 Then

The system shall display a clear error message, such as 'This mobile number is already registered. Please log in instead.' as per REQ-FUN-001. The system should not proceed to the OTP entry screen for registration.

### 3.3.7 Validation Notes

Requires a pre-existing user in the database. Verify the API returns a specific error code/message for 'user exists' and the UI displays the correct message.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

API performance for registration submission

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

A user has submitted a valid mobile number and OTP for registration

### 3.4.5 When

The backend receives the registration request for processing

### 3.4.6 Then

The API response for the registration submission shall be less than 500ms, as specified in REQ-FUN-001.

### 3.4.7 Validation Notes

Measure the server processing time from request receipt to response dispatch using API performance monitoring tools.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

User consent for data protection is captured

### 3.5.3 Scenario Type

Happy_Path

### 3.5.4 Given

A new user is on the registration screen

### 3.5.5 When

The user enters their mobile number

### 3.5.6 Then

The screen must display a checkbox or a clear statement with a link to the Terms of Service and Privacy Policy, indicating that proceeding constitutes agreement. The registration action must not be possible without acknowledging this consent, in compliance with REQ-CON-001 (DPDP Act).

### 3.5.7 Validation Notes

Verify the UI element for consent is present and required. Verify that the consent action is logged with the user's record upon creation.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Input field for 10-digit mobile number with a '+91' prefix displayed.
- A 'Send OTP' or 'Continue' button.
- A separate screen or view for OTP entry (e.g., 4 or 6 input boxes).
- A 'Resend OTP' button (initially disabled).
- A countdown timer indicating OTP validity.
- A checkbox and linked text for accepting Terms & Conditions and Privacy Policy.
- Text areas for displaying feedback and error messages.

## 4.2.0 User Interactions

- The mobile number input should only accept numeric characters.
- The 'Send OTP' button is enabled only when a valid 10-digit number is entered.
- After OTP is requested, the user is navigated to the OTP entry screen.
- The 'Resend OTP' button becomes active after a cooldown period (e.g., 30 seconds).

## 4.3.0 Display Requirements

- Clear instructional text like 'Enter your mobile number to get started'.
- Confirmation message after OTP is sent: 'An OTP has been sent to +91 XXXXX XXXXX'.
- Error messages for invalid number format or existing user.

## 4.4.0 Accessibility Needs

- All input fields must have proper labels for screen readers.
- UI elements must have sufficient color contrast (WCAG 2.1 AA).
- Error messages should be programmatically associated with their respective input fields.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-REG-001

### 5.1.2 Rule Description

User registration is permitted only with a valid 10-digit Indian mobile number.

### 5.1.3 Enforcement Point

Client-side validation and Server-side API.

### 5.1.4 Violation Handling

Request is rejected with a '400 Bad Request' status and a descriptive error message.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-REG-002

### 5.2.2 Rule Description

A mobile number can only be associated with one customer account.

### 5.2.3 Enforcement Point

Server-side API during the registration request.

### 5.2.4 Violation Handling

Request is rejected with a '409 Conflict' status and an error message indicating the number is already in use.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

*No items available*

## 6.2.0 Technical Dependencies

- AWS Cognito for user authentication management (as per REQ-NFR-003).
- AWS Simple Notification Service (SNS) for sending transactional SMS (as per REQ-INT-003).
- A configured rate-limiting service (e.g., using Amazon ElastiCache for Redis) to prevent OTP abuse (as per REQ-FUN-002).

## 6.3.0 Data Dependencies

- Access to the user database/table to check for the existence of a mobile number.

## 6.4.0 External Dependencies

- The third-party SMS gateway (AWS SNS) must be operational and have sufficient sending credits.

# 7.0.0 Non Functional Requirements

## 7.1.0 Performance

- P95 latency for the OTP generation API call must be under 500ms.
- P95 latency for the OTP verification and user creation API call must be under 500ms (as per REQ-FUN-001).

## 7.2.0 Security

- All communication must be over HTTPS/TLS 1.2+ (REQ-INT-004).
- OTP generation must be rate-limited per mobile number and IP address to prevent abuse (REQ-FUN-002).
- Generated OTPs must be cryptographically secure, have a short expiry time (e.g., 5 minutes), and be single-use.
- The system must not expose whether a mobile number exists via timing attacks.

## 7.3.0 Usability

- The registration process should be intuitive and require minimal steps.
- Error messages must be clear, concise, and helpful.

## 7.4.0 Accessibility

- The registration flow must be compliant with WCAG 2.1 Level AA standards (REQ-INT-001).

## 7.5.0 Compatibility

- The feature must be fully functional on the supported versions of iOS and Android for the React Native application.

# 8.0.0 Implementation Considerations

## 8.1.0 Complexity Assessment

Medium

## 8.2.0 Complexity Factors

- Integration with the external AWS SNS service for sending SMS.
- Implementation of a secure and stateful OTP verification flow (e.g., using Redis with a TTL).
- Setting up robust rate-limiting rules.
- Coordination between frontend state changes (mobile entry -> OTP entry) and backend API calls.
- Secure handling of JWTs on the client-side upon successful registration.

## 8.3.0 Technical Risks

- Delays or failures from the external SMS gateway could block all new user registrations.
- Improperly configured rate limiting could either be too restrictive for legitimate users or allow for abuse.

## 8.4.0 Integration Points

- Backend User Service: To create the new user record.
- AWS SNS API: To send the OTP SMS.
- Redis/ElastiCache: To temporarily store OTPs and for rate limiting counters.
- AWS Cognito: To provision the new user identity.

# 9.0.0 Testing Requirements

## 9.1.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Performance

## 9.2.0 Test Scenarios

- Successful registration with a new number.
- Attempted registration with an existing number.
- Attempted registration with invalid number formats.
- OTP entry with correct, incorrect, and expired OTPs.
- Testing the 'Resend OTP' functionality and its cooldown period.
- Verifying that the rate limit is triggered after multiple requests.

## 9.3.0 Test Data Needs

- A pool of unused mobile numbers for successful registration tests.
- A set of pre-registered mobile numbers for failure tests.
- A list of invalid number formats.
- A mechanism to intercept/read OTPs sent to test numbers via the SMS gateway mock.

## 9.4.0 Testing Tools

- Jest & React Testing Library (Frontend Unit/Integration)
- Jest (Backend Unit/Integration)
- Cypress (End-to-End)
- Postman/Insomnia (API Testing)

# 10.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >= 80% coverage (as per REQ-NFR-006)
- E2E tests for the registration happy path are automated and passing
- User interface reviewed for UX consistency and accessibility compliance
- Performance requirements for API response times are verified under load
- Security requirements (rate limiting, HTTPS) are validated
- All relevant technical documentation (e.g., API spec) is updated
- Story deployed and successfully verified in the staging environment

# 11.0.0 Planning Information

## 11.1.0 Story Points

8

## 11.2.0 Priority

🔴 High

## 11.3.0 Sprint Considerations

- This is a foundational story for the platform and likely a blocker for most other customer-facing features.
- Requires setup and configuration of AWS SNS and potentially Redis if not already done.
- Should be prioritized for the first development sprint.

## 11.4.0 Release Impact

- Critical for the Minimum Viable Product (MVP) launch. The platform cannot acquire users without this feature.

