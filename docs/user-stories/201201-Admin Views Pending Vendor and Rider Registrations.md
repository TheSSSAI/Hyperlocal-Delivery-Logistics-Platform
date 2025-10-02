# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | ADM-001 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Admin Views Pending Vendor and Rider Registrations |
| As A User Story | As an Administrator, I want to view a clear, filte... |
| User Persona | Platform Administrator responsible for user onboar... |
| Business Value | Enables the platform's supply-side growth by provi... |
| Functional Area | User Management |
| Story Theme | Admin Onboarding & Verification |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

ADM-001-AC-01

### 3.1.2 Scenario

Displaying a list with pending registrations of both types

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

an Administrator is logged into the admin dashboard and navigates to the 'Pending Registrations' section

### 3.1.5 When

there are pending registrations for both vendors and riders in the system with a status of 'pending_verification'

### 3.1.6 Then

a paginated table is displayed showing all pending registrations, sorted by 'Submission Date' in ascending order (oldest first) by default.

### 3.1.7 And

each row must contain a 'Review' button that links to the detailed application view.

### 3.1.8 Validation Notes

Verify the API returns a list of users with status 'pending_verification'. Check that the default sort order is correct. The 'Review' button's functionality will be implemented in story ADM-002, but the button must be present.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

ADM-001-AC-02

### 3.2.2 Scenario

Filtering the list to show only pending Vendors

### 3.2.3 Scenario Type

Alternative_Flow

### 3.2.4 Given

the Administrator is viewing the list of all pending registrations

### 3.2.5 When

they select the 'Vendor' filter option

### 3.2.6 Then

the table updates to display only the registration applications where the User Type is 'Vendor'.

### 3.2.7 Validation Notes

Test by applying the filter and verifying the API call includes a 'userType=vendor' parameter. The UI should update immediately to reflect the filtered data.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

ADM-001-AC-03

### 3.3.2 Scenario

Filtering the list to show only pending Riders

### 3.3.3 Scenario Type

Alternative_Flow

### 3.3.4 Given

the Administrator is viewing the list of all pending registrations

### 3.3.5 When

they select the 'Rider' filter option

### 3.3.6 Then

the table updates to display only the registration applications where the User Type is 'Rider'.

### 3.3.7 Validation Notes

Test by applying the filter and verifying the API call includes a 'userType=rider' parameter. The UI should update immediately to reflect the filtered data.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

ADM-001-AC-04

### 3.4.2 Scenario

Displaying a message when no pending registrations exist

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

an Administrator is logged into the admin dashboard and navigates to the 'Pending Registrations' section

### 3.4.5 When

there are no user accounts with the status 'pending_verification'

### 3.4.6 Then

the table area is empty and a clear, user-friendly message is displayed, such as 'No pending registrations to review.'

### 3.4.7 Validation Notes

Ensure the backend API returns an empty array. The frontend should correctly handle this response and display the specified message instead of an empty table.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

ADM-001-AC-05

### 3.5.2 Scenario

Pagination of the pending registrations list

### 3.5.3 Scenario Type

Happy_Path

### 3.5.4 Given

there are more pending registrations than the page limit (e.g., >25)

### 3.5.5 When

the Administrator views the 'Pending Registrations' page

### 3.5.6 Then

the table displays only the first page of results.

### 3.5.7 And

pagination controls (e.g., 'Next', 'Previous', page numbers) are visible and functional, allowing the admin to navigate through all pages of pending registrations.

### 3.5.8 Validation Notes

Verify the API supports pagination parameters (e.g., 'page', 'limit'). Test that clicking pagination controls fetches and displays the correct subset of data.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

ADM-001-AC-06

### 3.6.2 Scenario

Non-admin user attempts to access the page

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

a user with a role other than 'Administrator' (e.g., 'Vendor', 'Rider', 'Customer') is logged in

### 3.6.5 When

they attempt to access the URL for the 'Pending Registrations' page

### 3.6.6 Then

the system must prevent access and display an authorization error (e.g., '403 Forbidden' page).

### 3.6.7 Validation Notes

This should be tested at the API level (endpoint returns 403) and at the UI level (route is protected).

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A data table/grid to display the list of applicants.
- Filter controls (e.g., a dropdown) for User Type ('All', 'Vendor', 'Rider').
- Sortable table headers for 'Applicant Name' and 'Submission Date'.
- Pagination controls at the bottom of the table.
- A 'Review' button for each row.
- A message container for the 'no pending registrations' state.

## 4.2.0 User Interactions

- Clicking a filter option should refresh the table data without a full page reload.
- Clicking a sortable column header should toggle the sort order (ASC/DESC) and refresh the table.
- Clicking pagination controls should load the corresponding page of data.

## 4.3.0 Display Requirements

- The table must clearly display: Applicant Name/Business Name, User Type, and Submission Date.
- Dates and times must be displayed in the IST timezone as per REQ-INT-005.
- The UI must be responsive and functional on modern web browsers as per REQ-INT-001.

## 4.4.0 Accessibility Needs

- The data table must be accessible, with proper `<th>` and `scope` attributes.
- All interactive elements (filters, buttons, pagination) must be keyboard-navigable and have accessible labels, adhering to WCAG 2.1 Level AA (REQ-INT-001).

# 5.0.0 Business Rules

- {'rule_id': 'ADM-001-BR-01', 'rule_description': "Only users with a status of 'pending_verification' shall appear in this list.", 'enforcement_point': 'Backend API query logic.', 'violation_handling': "Users with other statuses (e.g., 'approved', 'rejected', 'suspended') must be excluded from the query results."}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

VND-001

#### 6.1.1.2 Dependency Reason

This story creates the 'pending_verification' vendor accounts that need to be displayed.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

RDR-001

#### 6.1.2.2 Dependency Reason

This story creates the 'pending_verification' rider accounts that need to be displayed.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

ADM-XXX (Admin Authentication)

#### 6.1.3.2 Dependency Reason

An administrator must be able to log in to access this functionality.

## 6.2.0.0 Technical Dependencies

- A backend API endpoint (e.g., GET /api/v1/admin/registrations/pending) that provides paginated, filterable, and sortable data.
- A database schema for users that includes a 'status' field and a 'submission_date' timestamp.
- The Role-Based Access Control (RBAC) module to secure the endpoint and UI route.

## 6.3.0.0 Data Dependencies

- Requires test data in the database representing pending vendors and pending riders to verify functionality.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API response time for fetching the list must be under 200ms (P95) as per REQ-NFR-001.
- The web page's Largest Contentful Paint (LCP) must be under 2.5 seconds as per REQ-NFR-001.

## 7.2.0.0 Security

- Access to the API endpoint and the corresponding UI page must be strictly limited to users with the 'Administrator' role, enforced by the RBAC system (REQ-NFR-003).
- All data must be transmitted over HTTPS/TLS 1.2+ (REQ-INT-004).

## 7.3.0.0 Usability

- The interface should be intuitive, allowing an admin to quickly understand the queue and apply filters without training.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards (REQ-INT-001).

## 7.5.0.0 Compatibility

- The admin web dashboard must be responsive and function correctly on all modern web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Low

## 8.2.0.0 Complexity Factors

- Standard CRUD functionality (reading a list).
- Involves creating a straightforward API endpoint and a corresponding frontend table component.
- Filtering, sorting, and pagination are common and well-supported features in modern frameworks.

## 8.3.0.0 Technical Risks

- Potential for slow database query performance if the 'users' table grows very large. An index on the 'status' and 'submission_date' columns is required to mitigate this.

## 8.4.0.0 Integration Points

- Frontend Admin Dashboard (React.js) will call the Backend API.
- Backend API ('Identity & Access' microservice) will query the PostgreSQL database.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Verify list displays correctly with a mix of pending vendors and riders.
- Verify filtering by 'Vendor' works.
- Verify filtering by 'Rider' works.
- Verify clearing filters shows all pending users.
- Verify default sorting is by oldest submission date.
- Verify sorting can be toggled to newest first.
- Verify the 'no pending registrations' message appears when the list is empty.
- Verify pagination controls appear and function correctly when data exceeds one page.
- Verify a non-admin user receives a 403 Forbidden error when attempting to access the API endpoint.

## 9.3.0.0 Test Data Needs

- A set of users with status 'pending_verification' (at least one vendor, one rider).
- A set of users with status 'approved' to ensure they are not displayed.
- A dataset large enough to trigger pagination (e.g., 30 pending users if the page size is 25).

## 9.4.0.0 Testing Tools

- Jest and React Testing Library for frontend unit/integration tests.
- Jest for backend unit/integration tests.
- Cypress for E2E tests.

# 10.0.0.0 Definition Of Done

- All acceptance criteria are validated and passing in the staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >80% code coverage as per REQ-NFR-006.
- E2E tests for the primary happy path and filtering are automated and passing.
- API endpoint is secured and tested for unauthorized access.
- UI is reviewed for responsiveness and adherence to design specifications.
- Performance requirements (API latency, LCP) are met.
- API documentation (OpenAPI) for the new endpoint is created/updated.
- Story is deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

3

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational story for the entire admin-led onboarding workflow. It is a blocker for subsequent stories like ADM-002 (Admin Reviews Registration Details) and ADM-003 (Admin Approves a Registration).

## 11.4.0.0 Release Impact

Critical for the initial platform launch, as no new vendors or riders can be onboarded without this feature.

