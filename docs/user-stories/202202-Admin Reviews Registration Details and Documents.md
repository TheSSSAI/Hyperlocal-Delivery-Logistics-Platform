# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | ADM-002 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Admin Reviews Registration Details and Documents |
| As A User Story | As an Administrator, I want to review all submitte... |
| User Persona | Platform Administrator responsible for user onboar... |
| Business Value | Ensures platform integrity, safety, and legal comp... |
| Functional Area | User Management |
| Story Theme | Admin Onboarding Workflow |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Admin reviews a pending Vendor registration

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am an authenticated Administrator viewing the 'Pending Registrations' list

### 3.1.5 When

I click to review a pending registration for a 'Vendor' applicant

### 3.1.6 Then

The system displays a dedicated review page with the applicant's type ('Vendor') and status ('pending_verification').

### 3.1.7 Validation Notes

Verify that all fields from REQ-FUN-001 for vendors are displayed: business name, address, contact info, GST certificate, and FSSAI license details (number, expiry date) if applicable.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Admin reviews a pending Rider registration

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

I am an authenticated Administrator viewing the 'Pending Registrations' list

### 3.2.5 When

I click to review a pending registration for a 'Rider' applicant

### 3.2.6 Then

The system displays a dedicated review page with the applicant's type ('Rider') and status ('pending_verification').

### 3.2.7 Validation Notes

Verify that all fields from REQ-FUN-001 for riders are displayed: personal details, driver's license, vehicle registration, bank details, Aadhaar, and PAN card.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Admin views/downloads an uploaded document

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

I am on the registration review page for an applicant who has uploaded documents

### 3.3.5 When

I click on a link for a document (e.g., 'View GST Certificate')

### 3.3.6 Then

The document should open in a new browser tab or be securely downloaded for review.

### 3.3.7 Validation Notes

Confirm that the link uses a secure, time-limited URL (e.g., S3 pre-signed URL) and that the correct document is retrieved.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Review page correctly indicates a missing document

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

I am reviewing a pending registration where a required document was not uploaded

### 3.4.5 When

I view the 'Uploaded Documents' section

### 3.4.6 Then

The system should display a clear text indicator like 'Not Provided' or 'Awaiting Upload' in place of a document link.

### 3.4.7 Validation Notes

The UI should not show a broken link or an error. It should gracefully handle the absence of a document.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Attempting to review a non-existent registration

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

I am an authenticated Administrator

### 3.5.5 When

I attempt to navigate directly to a review page URL with an invalid or non-existent registration ID

### 3.5.6 Then

The system should display a 'Registration Not Found' error page or a similar user-friendly message.

### 3.5.7 Validation Notes

The application should return a 404 Not Found status and not crash.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Unauthorized access attempt

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

A non-administrator user is logged into the system

### 3.6.5 When

They attempt to access the registration review page URL

### 3.6.6 Then

The system must deny access and return a 403 Forbidden error.

### 3.6.7 Validation Notes

Verify that Role-Based Access Control (RBAC) is enforced on both the frontend route and the backend API endpoint.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Header displaying applicant's name and type (Vendor/Rider)
- Status badge showing 'pending_verification'
- Sections for 'Business/Personal Details', 'Contact Information', 'License Information', and 'Uploaded Documents'
- Clearly labeled, clickable links for each uploaded document
- Text fields displaying submitted data (e.g., GST number, FSSAI license number/expiry)

## 4.2.0 User Interactions

- Clicking a document link opens it for viewing.
- The page should be read-only; no editing functionality is part of this story.

## 4.3.0 Display Requirements

- All submitted data must be displayed exactly as entered by the applicant.
- For vendors, FSSAI license number and expiry date must be displayed as distinct fields as per REQ-CON-001.
- The layout must be clean and logically organized to facilitate quick review.

## 4.4.0 Accessibility Needs

- All document links must have descriptive text for screen readers.
- The page must adhere to WCAG 2.1 Level AA standards for color contrast and keyboard navigation.

# 5.0.0 Business Rules

- {'rule_id': 'BR-ADM-001', 'rule_description': "Only users with the 'Administrator' role can access the registration review page.", 'enforcement_point': 'API Gateway and Frontend Router', 'violation_handling': 'A 403 Forbidden error is returned.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

ADM-001

#### 6.1.1.2 Dependency Reason

The admin needs the list of pending registrations to select one to review. This story is the entry point.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

VND-001

#### 6.1.2.2 Dependency Reason

This story displays the data and documents that are created during the vendor registration process.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

RDR-001

#### 6.1.3.2 Dependency Reason

This story displays the data and documents that are created during the rider registration process.

## 6.2.0.0 Technical Dependencies

- Admin authentication service (AWS Cognito)
- Role-Based Access Control (RBAC) middleware
- Secure file storage solution (e.g., AWS S3) for uploaded documents
- Database schema for storing registration application data

## 6.3.0.0 Data Dependencies

- Requires access to pending registration records in the database.
- Requires access to the uploaded document files in the storage service.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The registration review page, including all data and document links, must load in under 2.5 seconds (P95).
- The API call to fetch registration details must respond in under 200ms (P95).

## 7.2.0.0 Security

- All Personally Identifiable Information (PII) must be handled in compliance with India's DPDP Act, 2023 (REQ-CON-001).
- Access to uploaded documents must be granted via secure, short-lived, pre-signed URLs to prevent unauthorized access.
- The API endpoint must be protected and only accessible to authenticated users with the 'Administrator' role.
- All data transfer must be over HTTPS/TLS 1.2+.

## 7.3.0.0 Usability

- The information architecture must be intuitive, allowing an admin to quickly find and verify all necessary information without excessive scrolling or clicking.

## 7.4.0.0 Accessibility

- The interface must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The admin web dashboard must be fully functional on the latest versions of Chrome, Firefox, and Safari.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Backend logic to fetch and consolidate data from multiple tables (users, profiles, documents).
- Implementation of secure, pre-signed URL generation for document access.
- Frontend logic to dynamically render different views for Vendor vs. Rider applicants.
- Strict enforcement of RBAC at both the API and UI levels.

## 8.3.0.0 Technical Risks

- Improper security implementation for document access could lead to data breaches.
- Performance issues if the database query to fetch all registration data is not optimized.

## 8.4.0.0 Integration Points

- AWS Cognito for user authentication and role verification.
- AWS S3 (or similar) for retrieving documents.
- PostgreSQL database for application data.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Accessibility

## 9.2.0.0 Test Scenarios

- Verify a complete vendor application is displayed correctly.
- Verify a complete rider application is displayed correctly.
- Verify clicking a document link opens the correct document.
- Verify the UI gracefully handles missing documents.
- Verify that a non-admin user is blocked from accessing the page and API.
- Verify that direct access to document URLs fails, and only pre-signed URLs work.
- Verify the page loads within the specified performance budget.

## 9.3.0.0 Test Data Needs

- A test account with 'Administrator' role.
- At least one pending vendor registration with all documents.
- At least one pending rider registration with all documents.
- A pending registration with one or more missing documents.
- A test account with a non-admin role (e.g., 'Customer').

## 9.4.0.0 Testing Tools

- Jest & React Testing Library for frontend unit tests.
- Cypress for E2E testing.
- Postman or similar for API integration testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in the staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >80% code coverage.
- E2E tests for the review workflow are implemented and passing.
- Security review confirms that document access is secure and RBAC is correctly implemented.
- UI has been reviewed by a UX designer and approved.
- Performance metrics (page load, API response time) are verified to be within limits.
- Relevant technical documentation (e.g., API specification) has been updated.
- The feature has been successfully deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

3

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is a critical blocker for the entire user approval workflow (ADM-003, ADM-004).
- Requires both frontend and backend development effort.
- Ensure prerequisite stories are completed in a prior sprint or early in the same sprint.

## 11.4.0.0 Release Impact

This feature is essential for the initial platform launch to enable the onboarding of the first set of vendors and riders.

