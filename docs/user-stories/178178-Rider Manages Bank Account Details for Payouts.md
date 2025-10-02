# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-007 |
| Elaboration Date | 2025-01-18 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider Manages Bank Account Details for Payouts |
| As A User Story | As a Rider, I want to securely add, view, and upda... |
| User Persona | A registered and active Rider who needs to provide... |
| Business Value | Enables automated, accurate, and timely payouts to... |
| Functional Area | Rider Profile & Financial Management |
| Story Theme | Rider Onboarding and Lifecycle Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Rider adds bank account details for the first time

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

A logged-in rider has navigated to their profile and has no existing bank account details saved

### 3.1.5 When

The rider enters valid information into all required fields (Account Holder Name, Account Number, Confirm Account Number, IFSC Code, Bank Name) and submits the form

### 3.1.6 Then

The system validates the inputs, saves the bank account details securely against the rider's profile, and displays a success message like 'Bank account added successfully'.

### 3.1.7 Validation Notes

Verify that the new bank account record is created in the database and associated with the correct rider ID. The data must be encrypted at rest.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Rider views their existing bank account details

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

A logged-in rider has previously saved their bank account details

### 3.2.5 When

The rider navigates to the 'Bank Details' or 'Payouts' section of their profile

### 3.2.6 Then

The system displays the saved Account Holder Name, Bank Name, and a partially masked Account Number (e.g., 'XXXXXXXX1234') for security.

### 3.2.7 Validation Notes

Confirm that only the last 4 digits of the account number are visible on the UI. The full account number should not be sent to the client.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Rider successfully updates their bank account details with OTP verification

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

A logged-in rider is viewing their existing bank details and initiates an edit

### 3.3.5 When

The rider enters new, valid bank account information, submits the form, receives an OTP on their registered mobile number, and enters the correct OTP

### 3.3.6 Then

The system validates the OTP, updates the bank account details in the database, displays a success message, and sends a confirmation notification to the rider's device as per REQ-FUN-003.

### 3.3.7 Validation Notes

Verify the record is updated in the database. Check that a notification (push/SMS) is triggered and logged.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Rider enters invalid data in the bank details form

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

A rider is on the 'Add/Edit Bank Account' screen

### 3.4.5 When

The rider enters an incorrectly formatted IFSC code, a non-matching 'Confirm Account Number', or an account number with non-numeric characters

### 3.4.6 Then

The system displays clear, inline validation errors next to the respective fields (e.g., 'IFSC code is invalid', 'Account numbers do not match') and the form submission is blocked until the errors are corrected.

### 3.4.7 Validation Notes

Test with various invalid inputs for each field to ensure client-side and server-side validation works as expected.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Rider fails OTP verification when updating bank details

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

A rider has submitted new bank details and is prompted for OTP verification

### 3.5.5 When

The rider enters an incorrect OTP

### 3.5.6 Then

The system displays an 'Invalid OTP' error message, and the bank details are not updated. The rider can attempt to enter the OTP again.

### 3.5.7 Validation Notes

Verify that the bank details in the database remain unchanged after a failed OTP attempt.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Rider's account is temporarily locked after multiple failed OTP attempts

### 3.6.3 Scenario Type

Edge_Case

### 3.6.4 Given

A rider is attempting to update their bank details

### 3.6.5 When

The rider enters an incorrect OTP 5 consecutive times

### 3.6.6 Then

The system displays a message indicating the account is temporarily locked for security reasons, and the bank details are not updated, as per REQ-FUN-002.

### 3.6.7 Validation Notes

Confirm that the system prevents further OTP attempts for a configured duration and logs the security event.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

API or network error occurs during submission

### 3.7.3 Scenario Type

Error_Condition

### 3.7.4 Given

A rider has entered valid bank details and submitted the form

### 3.7.5 When

The mobile application fails to communicate with the backend server

### 3.7.6 Then

The application displays a user-friendly error message (e.g., 'Unable to save details. Please check your connection and try again.') and the data entered by the user in the form is preserved.

### 3.7.7 Validation Notes

Simulate a network failure or a 5xx API response to test the client's error handling and state preservation.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Input field for 'Account Holder Name' (Text)
- Input field for 'Bank Account Number' (Numeric)
- Input field for 'Confirm Bank Account Number' (Numeric)
- Input field for 'IFSC Code' (Alphanumeric, capitalized)
- Input field for 'Bank Name' (Text)
- Save/Submit Button
- Edit Button
- OTP Input Screen

## 4.2.0 User Interactions

- The 'Save' button is disabled until all required fields are filled with validly formatted data.
- Tapping 'Edit' makes the fields editable.
- Submitting an update triggers an OTP verification modal/screen.
- The 'Bank Name' field could be auto-populated after a valid IFSC code is entered to improve user experience.

## 4.3.0 Display Requirements

- Saved bank account number must always be displayed in a masked format (e.g., 'XXXXXXXX1234').
- Clear success, error, and informational messages must be displayed to the user at each step.

## 4.4.0 Accessibility Needs

- All form fields must have clear, descriptive labels.
- The interface must be navigable using screen readers.
- Sufficient color contrast must be used as per WCAG 2.1 AA standards.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-RDR-001

### 5.1.2 Rule Description

A rider must have valid and verified bank account details on file to be eligible for weekly payouts.

### 5.1.3 Enforcement Point

During the weekly settlement process (SYS-006).

### 5.1.4 Violation Handling

If details are missing or invalid, the payout for that rider is skipped, and a notification is sent to the rider to update their information. The amount is held for the next payout cycle.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-RDR-002

### 5.2.2 Rule Description

Any change to financial information (bank account details) must be authenticated via a second factor (OTP to registered mobile number).

### 5.2.3 Enforcement Point

On submission of the 'Edit Bank Account' form.

### 5.2.4 Violation Handling

The update operation fails if OTP verification is not completed successfully.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-001

#### 6.1.1.2 Dependency Reason

Rider must have a registered account to add bank details to.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

RDR-004

#### 6.1.2.2 Dependency Reason

Rider must be able to log in to access their profile. The OTP mechanism from login is required for verification.

## 6.2.0.0 Technical Dependencies

- User Profile Microservice: To store and retrieve rider data.
- Authentication Service (AWS Cognito): To manage user identity and sessions.
- Notification Service (AWS SNS/FCM): To send OTPs and confirmation messages.
- Database (PostgreSQL on RDS): Schema must support storing encrypted bank details.

## 6.3.0.0 Data Dependencies

- A verified mobile number for the rider must exist in the system to receive OTPs.

## 6.4.0.0 External Dependencies

- Optional: An external API service for IFSC code validation to improve data accuracy and user experience.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- API response time for saving/updating details should be under 500ms (P95).
- OTP delivery to the user's mobile should occur within 15 seconds.

## 7.2.0.0 Security

- All communication must be over HTTPS/TLS 1.2+.
- Bank account details must be encrypted at rest in the database using AWS KMS.
- The full bank account number must never be sent to or stored on the client device.
- The API endpoint must be protected and accessible only by the authenticated owner of the profile.
- Rate limiting must be applied to the OTP generation endpoint to prevent abuse.

## 7.3.0.0 Usability

- The process of adding/editing details should be intuitive and require minimal steps.
- Error messages must be clear, concise, and helpful.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The feature must function correctly on all supported versions of iOS and Android for the Rider mobile application.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- High security requirements for handling sensitive financial PII (encryption at rest, secure transit, strict access control).
- Integration with the OTP service for second-factor authentication.
- Need for robust client-side and server-side validation.
- Implementation of a secure, transactional update process on the backend.

## 8.3.0.0 Technical Risks

- Improper handling of encryption keys or sensitive data could lead to a security breach.
- Failure or delay in the third-party SMS gateway for OTP delivery could block users from updating their details.

## 8.4.0.0 Integration Points

- Backend API for user profile management.
- OTP generation and validation service.
- Push/SMS notification service.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Usability

## 9.2.0.0 Test Scenarios

- Successful addition of a new bank account.
- Successful update of an existing bank account with OTP.
- Viewing masked bank account details.
- Form submission with various invalid inputs (IFSC, account number mismatch, etc.).
- Failed update due to incorrect OTP.
- Account lockout after multiple failed OTPs.
- Graceful handling of API/network failures.

## 9.3.0.0 Test Data Needs

- Test rider accounts with and without existing bank details.
- A list of valid and invalid IFSC codes.
- Valid and invalid bank account number formats.

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for frontend unit tests.
- Cypress for E2E tests.
- Postman/Insomnia for API testing.
- OWASP ZAP or similar for security scanning.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >= 80% code coverage and all are passing
- E2E automated test case for the happy path is created and passing
- User interface reviewed for usability and adherence to design standards
- A formal security review of the implementation has been completed and any findings addressed
- All PII is confirmed to be encrypted at rest and masked on the UI
- Documentation for the new API endpoint is created/updated in OpenAPI spec
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a blocker for implementing the automated rider payout feature (SYS-006).
- Requires both frontend and backend development effort.
- Requires careful coordination for security review.

## 11.4.0.0 Release Impact

This is a critical feature for rider onboarding and must be included in the initial launch or first major update.

