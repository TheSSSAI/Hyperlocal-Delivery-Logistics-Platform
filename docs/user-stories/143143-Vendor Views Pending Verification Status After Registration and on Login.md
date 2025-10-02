# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | VND-002 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Vendor Views Pending Verification Status After Reg... |
| As A User Story | As a new vendor who has just submitted my registra... |
| User Persona | New Vendor Applicant: A user who has completed the... |
| Business Value | Improves the vendor onboarding experience by provi... |
| Functional Area | User Management - Vendor Onboarding |
| Story Theme | Vendor Lifecycle Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Successful login by a vendor with a 'pending_verification' status

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a vendor has successfully completed the registration process and their account status is 'pending_verification' in the system

### 3.1.5 When

the vendor authenticates successfully using their mobile number and OTP

### 3.1.6 Then

the system must redirect them to a dedicated 'Pending Verification' page, not the main vendor dashboard

### 3.1.7 Validation Notes

Verify via E2E test. Create a user with 'pending_verification' status, log in as that user, and assert the final URL is the pending status page.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Content and display of the 'Pending Verification' page

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

a vendor is on the 'Pending Verification' page

### 3.2.5 When

the page loads

### 3.2.6 Then

the page must clearly display a heading like 'Your Application is Under Review'

### 3.2.7 And

the only available actions are 'Logout' and potentially a link to a 'Help/FAQ' page

### 3.2.8 Validation Notes

Visual inspection and snapshot testing of the UI component.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Vendor with pending status attempts to access dashboard URLs directly

### 3.3.3 Scenario Type

Edge_Case

### 3.3.4 Given

a vendor is authenticated and their session is active, but their account status is 'pending_verification'

### 3.3.5 When

the vendor attempts to navigate directly to a protected vendor dashboard URL (e.g., '/vendor/products')

### 3.3.6 Then

the system must intercept the request and redirect them back to the 'Pending Verification' page

### 3.3.7 Validation Notes

E2E test: Log in as a pending user, then attempt to navigate to a dashboard URL and assert the final URL is the pending page.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Vendor logs in after their account has been approved

### 3.4.3 Scenario Type

Alternative_Flow

### 3.4.4 Given

a vendor's account status was 'pending_verification' and has been changed to 'active' by an administrator

### 3.4.5 When

the vendor logs in with their correct credentials

### 3.4.6 Then

the system must grant them access and redirect them to the main vendor dashboard, not the pending page

### 3.4.7 Validation Notes

This confirms the exit criteria for the pending state. Test by updating a user's status in the database from 'pending' to 'active' and then performing the login flow.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

API failure when checking user status

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

a vendor is logging in

### 3.5.5 When

the frontend fails to retrieve the user's account status from the backend API after authentication

### 3.5.6 Then

the UI should display a non-technical error message (e.g., 'Could not load your profile. Please try again.') with a retry option

### 3.5.7 Validation Notes

Mock the API endpoint that returns user status to simulate a 500 server error and verify the UI response.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Page Title/Heading (e.g., 'Application Under Review')
- Status Indicator Text
- Explanatory Paragraph
- Logout Button
- Link to Help/FAQ (Optional)

## 4.2.0 User Interactions

- User is automatically redirected to this page upon login if status is pending.
- User is blocked from navigating away to other authenticated parts of the application.
- User can click 'Logout' to end their session.

## 4.3.0 Display Requirements

- The page must be a full-screen view, replacing the standard dashboard layout.
- No side navigation or header links (except Logout) associated with the main dashboard should be visible.

## 4.4.0 Accessibility Needs

- The page must comply with WCAG 2.1 Level AA.
- All text must have sufficient color contrast.
- The logout button must be focusable and operable via keyboard.

# 5.0.0 Business Rules

- {'rule_id': 'BR-VND-STATUS-CHECK', 'rule_description': "A user's account status must be checked upon every authentication and before rendering any protected route.", 'enforcement_point': 'Frontend routing middleware/guard and Backend API gateway authorization layer.', 'violation_handling': "If status is 'pending_verification', access to all vendor dashboard functionality is denied, and the user is redirected to the pending status page."}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

VND-001

#### 6.1.1.2 Dependency Reason

The registration process must be in place to create a vendor account with the initial 'pending_verification' status.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

VND-004

#### 6.1.2.2 Dependency Reason

The login functionality must exist for a pending vendor to authenticate and view their status.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

ADM-003

#### 6.1.3.2 Dependency Reason

The admin approval story is required to test the full lifecycle and the exit condition from the 'pending' state (AC-004).

## 6.2.0.0 Technical Dependencies

- Authentication service (e.g., AWS Cognito) to handle login.
- Vendor microservice with a database schema that includes a 'status' field for vendors.
- Frontend routing mechanism capable of implementing route guards or middleware.

## 6.3.0.0 Data Dependencies

- The vendor record in the database must have a 'status' attribute (e.g., ENUM: 'pending_verification', 'active', 'rejected', 'suspended').

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The login and redirection to the status page should complete in under 3 seconds (as per REQ-FUN-002).
- The status page itself, being mostly static, should have a Largest Contentful Paint (LCP) of under 1.5 seconds.

## 7.2.0.0 Security

- Access to the pending status page must require successful authentication.
- The user's status should be securely transmitted (e.g., as a claim in the JWT) or fetched from a protected backend endpoint.
- The routing logic must prevent any possibility of bypassing the status check to access dashboard functionality.

## 7.3.0.0 Usability

- The status message must be clear, unambiguous, and reassuring to the user.

## 7.4.0.0 Accessibility

- Must adhere to WCAG 2.1 Level AA standards as per REQ-INT-001.

## 7.5.0.0 Compatibility

- The web page must be responsive and render correctly on all modern web browsers supported by the platform.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Low

## 8.2.0.0 Complexity Factors

- Requires creating a simple, static UI page.
- Requires implementing a route guard/middleware in the frontend application, which is a standard pattern.
- Backend needs to expose the user's status upon login.

## 8.3.0.0 Technical Risks

- If not implemented correctly, the route guard could be bypassed, posing a security risk. This must be a priority during code review and testing.

## 8.4.0.0 Integration Points

- Authentication Service: To get user identity and roles/status after login.
- Vendor Service API: To fetch user profile details including status.
- Frontend Application Router: To enforce redirection.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- Verify login and redirect for a 'pending_verification' user.
- Verify direct URL access is blocked for a 'pending_verification' user.
- Verify UI content of the pending page.
- Verify login and access to the dashboard for an 'active' user (post-approval).
- Verify logout functionality from the pending page.

## 9.3.0.0 Test Data Needs

- A test vendor account with status set to 'pending_verification'.
- A test vendor account with status set to 'active'.

## 9.4.0.0 Testing Tools

- Jest and React Testing Library for frontend unit tests.
- Cypress for End-to-End testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >80% coverage for new code
- E2E tests for all key scenarios are written and passing
- User interface reviewed for clarity and adherence to design
- Security review of the routing guard logic is complete
- Documentation for the frontend routing and authorization logic is updated
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

2

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is a critical part of the initial vendor experience and should be prioritized early in the development cycle.
- Dependent on the completion of VND-001 (Registration) and VND-004 (Login).

## 11.4.0.0 Release Impact

Essential for the initial launch of the vendor onboarding flow. The platform cannot launch without this basic feedback mechanism.

