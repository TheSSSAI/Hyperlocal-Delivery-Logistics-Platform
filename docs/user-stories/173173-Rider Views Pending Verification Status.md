# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-002 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider Views Pending Verification Status |
| As A User Story | As a new rider who has just submitted my registrat... |
| User Persona | New Rider Applicant (A user who has completed the ... |
| Business Value | Provides immediate feedback to new riders, manages... |
| Functional Area | User Management - Rider Onboarding |
| Story Theme | Rider Lifecycle Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

RDR-002-AC-001

### 3.1.2 Scenario

Display pending status immediately after registration submission

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a new rider has successfully filled out and submitted all required registration information as per REQ-FUN-001

### 3.1.5 When

the registration submission API call returns a success response

### 3.1.6 Then

the rider is automatically navigated to a screen that clearly displays the status 'Pending Verification'

### 3.1.7 And

the screen contains an explanatory message about the review process and expected timeline (e.g., 'Your application is under review. This typically takes 2-3 business days.')

### 3.1.8 Validation Notes

Verify by completing the registration flow. The final screen must match the UI requirements.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

RDR-002-AC-002

### 3.2.2 Scenario

Display pending status on subsequent logins

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

a rider's account exists in the system with a status of 'pending_verification'

### 3.2.5 When

the rider successfully logs in using their mobile number and OTP

### 3.2.6 Then

they are directed straight to the 'Pending Verification' status screen

### 3.2.7 And

they are prevented from accessing any other part of the rider application (e.g., task list, earnings dashboard).

### 3.2.8 Validation Notes

Create a test user with 'pending_verification' status. Log in as this user and verify the redirection and that no other app sections are accessible.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

RDR-002-AC-003

### 3.3.2 Scenario

Backend enforces access restrictions for pending riders

### 3.3.3 Scenario Type

Security_Condition

### 3.3.4 Given

a rider is logged in with a valid JWT token but their account status is 'pending_verification'

### 3.3.5 When

they attempt to make an API call to an endpoint reserved for active riders (e.g., GET /api/v1/rider/tasks)

### 3.3.6 Then

the API must return a '403 Forbidden' status code with an appropriate error message.

### 3.3.7 Validation Notes

Using an API client like Postman, authenticate as a pending rider and attempt to access protected endpoints. Verify the 403 response.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

RDR-002-AC-004

### 3.4.2 Scenario

User attempts to navigate away from the pending screen

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

a rider with 'pending_verification' status is on the status screen

### 3.4.5 When

the user attempts to use the device's back button or a deep link to navigate to another part of the app

### 3.4.6 Then

the application's routing logic should intercept the attempt and keep them on or return them to the 'Pending Verification' screen.

### 3.4.7 Validation Notes

While on the status screen, attempt to trigger navigation via back button or by simulating a deep link. The view should not change.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

RDR-002-AC-005

### 3.5.2 Scenario

API fails to retrieve user status on login

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

a rider with 'pending_verification' status is logging in

### 3.5.5 When

the API call to fetch the user's profile/status fails after successful authentication

### 3.5.6 Then

the app displays a user-friendly error message (e.g., 'Could not retrieve your account status. Please check your connection and try again.')

### 3.5.7 And

a 'Retry' button is provided to re-trigger the API call.

### 3.5.8 Validation Notes

Use a mock server or network interceptor to simulate a 5xx error on the user profile endpoint and verify the app's response.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Static screen container
- Prominent heading (e.g., 'Application Submitted for Review')
- Status indicator text: 'Pending Verification'
- Informative icon (e.g., clock, hourglass)
- Descriptive paragraph explaining the review process and timeline
- A 'Logout' button
- Optional: A 'Contact Support' link or button

## 4.2.0 User Interactions

- The screen is primarily informational and non-interactive.
- The user can tap the 'Logout' button to end their session.
- The user cannot swipe or navigate away from this screen to other functional areas of the app.

## 4.3.0 Display Requirements

- The status must be the most prominent piece of information on the screen.
- The design should be consistent with the overall application branding.

## 4.4.0 Accessibility Needs

- All text must meet WCAG 2.1 AA contrast ratio standards.
- The screen should be navigable and readable by screen readers, with proper labels for all elements.

# 5.0.0 Business Rules

*No items available*

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-001

#### 6.1.1.2 Dependency Reason

This story is triggered by the successful completion of the rider registration process defined in RDR-001.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

RDR-004

#### 6.1.2.2 Dependency Reason

The login flow from RDR-004 is required to test the scenario where a pending rider logs back into the application.

## 6.2.0.0 Technical Dependencies

- User/Identity microservice must support a 'status' attribute for the Rider entity (e.g., 'pending_verification', 'active', 'suspended').
- Authentication service (AWS Cognito) must include the user's status or role in the claims of the issued JWT, or an endpoint must be available to fetch this status upon login.
- API Gateway and backend microservices must have an authorization layer (middleware) that can inspect the user's status and enforce access control.

## 6.3.0.0 Data Dependencies

- A user record must exist in the database with the status explicitly set to 'pending_verification'.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The status screen must load in under 1 second after successful registration or login.

## 7.2.0.0 Security

- The system must enforce Role-Based Access Control (RBAC) based on the user's status. Users with 'pending_verification' status must be denied access to all operational rider APIs.
- The session must be managed via secure JWTs as defined in REQ-FUN-002.

## 7.3.0.0 Usability

- The screen's purpose and the user's status must be immediately obvious without requiring any user action or interpretation.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The screen must render correctly on all supported iOS and Android devices.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Frontend complexity lies in implementing robust routing logic to trap the user on the status screen.
- Backend complexity involves creating or modifying the authorization middleware to be status-aware. This is a critical security feature and must be implemented carefully.
- Coordination is required between frontend and backend on how the user status is communicated (e.g., in JWT claims vs. a separate API call).

## 8.3.0.0 Technical Risks

- Risk of improper implementation of the authorization logic, potentially allowing pending riders to access sensitive data or functionality.
- Client-side routing logic could have loopholes that allow users to bypass the status screen.

## 8.4.0.0 Integration Points

- User Registration Service: Receives the trigger to show this status.
- Authentication Service: Provides the user's status upon login.
- API Gateway: Enforces access control based on the user's status.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Successful registration leads to the pending screen.
- Login with a pending account leads to the pending screen.
- Attempted access to protected API endpoints as a pending user results in a 403 error.
- Attempted client-side navigation away from the pending screen is blocked.
- Logout functionality works correctly from the pending screen.

## 9.3.0.0 Test Data Needs

- Test accounts with the status explicitly set to 'pending_verification'.
- Test accounts with 'active' status to ensure they are NOT blocked.

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for frontend unit tests.
- Cypress for E2E tests.
- Postman or a similar tool for API security testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >80% coverage for new code
- E2E tests for the user flow are created and passing
- Backend authorization logic is explicitly tested for security vulnerabilities
- User interface reviewed and approved by UX/UI designer
- No performance regressions are introduced
- Documentation for the authorization middleware is updated
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

3

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is a critical part of the rider onboarding flow and should be prioritized early in the development cycle.
- Requires both frontend and backend development work that can be done in parallel once the API contract for user status is defined.

## 11.4.0.0 Release Impact

Essential for the initial release (MVP) as it directly impacts the experience of every new rider joining the platform.

