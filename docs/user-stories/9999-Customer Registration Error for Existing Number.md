# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | CUS-002 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Customer Registration Error for Existing Number |
| As A User Story | As a prospective customer attempting to register, ... |
| User Persona | A new user attempting to register, or a returning ... |
| Business Value | Prevents the creation of duplicate user accounts, ... |
| Functional Area | User Management |
| Story Theme | User Onboarding & Authentication |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

User attempts to register with an existing mobile number

### 3.1.3 Scenario Type

Error_Condition

### 3.1.4 Given

A user is on the registration screen and a user account already exists with the mobile number '+919876543210'

### 3.1.5 When

The user enters '9876543210' into the mobile number field and submits the registration form

### 3.1.6 Then

The system must not create a new user account in the database.

### 3.1.7 Validation Notes

Verify in the user database (e.g., AWS Cognito or PostgreSQL) that no new user record has been created for this mobile number.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

System displays a specific error message for a duplicate number

### 3.2.3 Scenario Type

Error_Condition

### 3.2.4 Given

The user has submitted the registration form with an existing mobile number

### 3.2.5 When

The API responds with an error indicating a duplicate user

### 3.2.6 Then

An inline error message stating 'This mobile number is already registered. Please log in instead.' is displayed directly below the mobile number input field.

### 3.2.7 Validation Notes

Use browser developer tools or mobile UI inspector to confirm the presence and content of the error message text.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

User is provided a direct path to the login screen

### 3.3.3 Scenario Type

Alternative_Flow

### 3.3.4 Given

The 'already registered' error message is displayed

### 3.3.5 When

The user clicks on the 'log in' part of the error message

### 3.3.6 Then

The user is immediately redirected to the login screen.

### 3.3.7 Validation Notes

Automated E2E test to simulate the click and verify the URL or screen transition to the login page.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Registration form data is preserved after error

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

The user has filled out multiple fields on the registration form (e.g., name, email) and submitted with an existing mobile number

### 3.4.5 When

The duplicate number error is displayed

### 3.4.6 Then

All other data entered by the user in the form fields must be preserved.

### 3.4.7 Validation Notes

Manually or via E2E test, check that other form fields retain their values after the error is shown.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

API performance for the duplicate check

### 3.5.3 Scenario Type

Happy_Path

### 3.5.4 Given

A user submits the registration form

### 3.5.5 When

The backend performs the check for an existing mobile number

### 3.5.6 Then

The total API response time for the registration submission attempt must be less than 500ms, as per REQ-FUN-001.

### 3.5.7 Validation Notes

Monitor API response times using APM tools like AWS CloudWatch or perform load testing on the registration endpoint.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

System handles different mobile number formats

### 3.6.3 Scenario Type

Edge_Case

### 3.6.4 Given

A user account exists with the normalized number '9876543210'

### 3.6.5 When

A new user attempts to register with variations like '+91 98765 43210' or '09876543210'

### 3.6.6 Then

The system correctly identifies all variations as duplicates and displays the error message.

### 3.6.7 Validation Notes

Test with multiple formats of the same number to ensure the backend normalization logic is working correctly before the database lookup.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Inline error text field associated with the mobile number input.
- A hyperlink or clickable text within the error message to navigate to the login screen.

## 4.2.0 User Interactions

- On form submission, the system performs a validation check.
- If validation fails due to a duplicate number, the error message appears without a full page reload.
- Clicking the 'log in' link navigates the user away from the registration screen.

## 4.3.0 Display Requirements

- The error message must be clearly visible and distinguishable from other text, typically using a contrasting color like red.
- The mobile number input field may optionally have its border highlighted in the same error color.

## 4.4.0 Accessibility Needs

- The error message must be programmatically linked to the input field using `aria-describedby` for screen readers.
- The color contrast of the error text must meet WCAG 2.1 Level AA guidelines, as stated in REQ-INT-001.

# 5.0.0 Business Rules

- {'rule_id': 'BR-USER-001', 'rule_description': 'A mobile number must be unique across all user accounts (Customer, Vendor, Rider).', 'enforcement_point': 'During the user registration process, at the API level, before creating a new user record.', 'violation_handling': 'The registration is blocked, and a specific error message is returned to the client application.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

CUS-001

#### 6.1.1.2 Dependency Reason

The basic registration UI, form fields, and API endpoint must exist before this error handling logic can be implemented.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

CUS-003

#### 6.1.2.2 Dependency Reason

The login screen and its associated functionality must exist for the user to be redirected to upon encountering this error.

## 6.2.0.0 Technical Dependencies

- User authentication service (AWS Cognito as per REQ-NFR-003) must be configured to check for user existence by mobile number.
- A database schema with a unique constraint on the normalized mobile number column.
- API Gateway configuration for the registration endpoint.

## 6.3.0.0 Data Dependencies

- Access to the primary user data store to perform the existence check.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The database query for checking the existence of a mobile number must complete in under 50ms.
- The end-to-end API response time for a registration attempt must be under 500ms (as per REQ-FUN-001).

## 7.2.0.0 Security

- The registration endpoint must be protected against user enumeration attacks. Implement rate limiting (e.g., max 10 attempts per IP per minute) on the API Gateway to mitigate this risk.
- The error message should be generic enough not to confirm which specific data point (e.g., email vs. phone) caused the conflict if the form contains multiple unique fields.

## 7.3.0.0 Usability

- The error message must be clear, concise, and provide a direct, actionable solution (i.e., 'log in instead').

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards (REQ-INT-001).

## 7.5.0.0 Compatibility

- Functionality must be consistent across all supported mobile OS versions (iOS, Android) as defined in the project scope.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Low

## 8.2.0.0 Complexity Factors

- Backend logic is a straightforward database lookup.
- Frontend change is a conditional rendering of an error message.
- If rate-limiting is not already in place, its initial setup could increase complexity to Medium.

## 8.3.0.0 Technical Risks

- Incorrect implementation of number normalization could lead to duplicate accounts.
- Lack of a database index on the mobile number column could lead to slow performance under load.

## 8.4.0.0 Integration Points

- Frontend registration form.
- Backend User/Authentication service.
- Database (PostgreSQL/Cognito).

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Attempt to register with a known, existing mobile number.
- Attempt to register with a new, unique mobile number (should succeed, validating the negative case).
- Attempt to register using various formats of an existing number.
- Click the 'log in' link in the error message and verify redirection.
- Trigger the rate limit for the registration endpoint to verify security controls.

## 9.3.0.0 Test Data Needs

- A set of pre-provisioned user accounts in the test environment with known mobile numbers.

## 9.4.0.0 Testing Tools

- Jest and React Testing Library for frontend unit tests.
- Jest for backend unit/integration tests.
- Cypress for E2E tests.
- A script-based tool (e.g., Postman, k6) for security/rate-limit testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >80% coverage for the new logic
- E2E test scenario for duplicate registration is automated and passing
- Security requirement for rate limiting is implemented and verified
- User interface changes reviewed and approved by UX/Product Owner
- Performance of the API endpoint is verified to be within the defined limits
- Accessibility requirements for the error message are met
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

2

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story should be implemented in the same sprint as the primary registration story (CUS-001) to provide a complete and robust registration feature.
- Requires coordination between frontend and backend developers.

## 11.4.0.0 Release Impact

This is a critical feature for the initial launch. A registration system without this check is considered incomplete and high-risk.

