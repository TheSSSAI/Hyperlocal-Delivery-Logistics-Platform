# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | VND-001 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Vendor Initiates Registration with Business Detail... |
| As A User Story | As a prospective local business owner, I want to f... |
| User Persona | A new, prospective vendor who owns a local busines... |
| Business Value | This is a critical step in the vendor acquisition ... |
| Functional Area | User Management - Vendor Onboarding |
| Story Theme | Vendor Lifecycle Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Successful registration submission with all required information

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

A new vendor is on the registration page of the vendor web dashboard

### 3.1.5 When

The vendor enters valid data for all mandatory fields (Business Name, Address, Contact Phone, Contact Email, GST Number) and uploads a valid GST certificate file

### 3.1.6 Then

The system creates a new vendor account in the database with a status of 'pending_verification'.

### 3.1.7 Validation Notes

Verify in the database that a new record exists in the 'vendors' table with the correct data and status. The response from the API should be a success status (e.g., 201 Created) and should complete in under 500ms as per REQ-FUN-001.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Successful registration submission with optional FSSAI license

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

A new food-based vendor is on the registration page

### 3.2.5 When

The vendor fills all mandatory fields and uploads both a GST certificate and an FSSAI license

### 3.2.6 Then

A new vendor account is created with status 'pending_verification', and both documents are securely stored and associated with the account.

### 3.2.7 Validation Notes

Verify the vendor record is created and check the associated document storage (e.g., S3) to confirm both files are present and correctly linked.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

User receives confirmation after successful submission

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

A vendor has successfully submitted their registration form

### 3.3.5 When

The system successfully processes the submission

### 3.3.6 Then

The vendor is redirected to a confirmation page with a message like 'Thank you for registering! Your application is now under review. We will notify you once it has been processed.'

### 3.3.7 Validation Notes

Manually or via E2E test, confirm the redirection and the presence of the success message on the UI.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Attempt to submit form with missing mandatory fields

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

A vendor is on the registration page

### 3.4.5 When

The vendor attempts to submit the form without filling in a mandatory field, such as 'Business Name'

### 3.4.6 Then

The form submission is prevented on the client-side, and a clear, inline error message (e.g., 'Business Name is required') is displayed next to the corresponding field.

### 3.4.7 Validation Notes

Test by leaving each mandatory field blank one by one and attempting to submit. Verify the API call is not made and the correct error message appears.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Attempt to submit form with invalid data format

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

A vendor is on the registration page

### 3.5.5 When

The vendor enters an invalid email format (e.g., 'test@example') or an invalid Indian mobile number (e.g., '12345')

### 3.5.6 Then

The form submission is prevented, and an inline error message is displayed indicating the correct format required (e.g., 'Please enter a valid email address').

### 3.5.7 Validation Notes

Test with various invalid formats for email and phone number fields.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Attempt to register with an existing mobile number or GST number

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

A vendor with a specific mobile number or GST number already exists in the system

### 3.6.5 When

A new vendor attempts to register using the same mobile number or GST number

### 3.6.6 Then

The backend rejects the submission, and a clear error message is displayed on the form, such as 'An account with this mobile number already exists.'

### 3.6.7 Validation Notes

Seed the database with an existing vendor. Attempt to register with the same credentials and verify the API returns an error (e.g., 409 Conflict) and the UI displays the message.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Attempt to upload an invalid file type or oversized file

### 3.7.3 Scenario Type

Edge_Case

### 3.7.4 Given

A vendor is on the registration page

### 3.7.5 When

The vendor attempts to upload a document that is not a PDF, JPG, or PNG, or exceeds the 5MB size limit

### 3.7.6 Then

The file upload is rejected, and an informative error message is displayed to the user (e.g., 'Invalid file type. Please upload a PDF, JPG, or PNG.' or 'File size cannot exceed 5MB.').

### 3.7.7 Validation Notes

Attempt to upload various file types (.txt, .gif, .docx) and a file larger than 5MB to verify the validation works as expected.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Input field for Business Name (text)
- Input field for Business Address (textarea or structured address fields)
- Input field for Contact Phone Number (text, with validation for Indian numbers)
- Input field for Contact Email (email)
- Input field for GST Number (text, with validation)
- File upload component for GST Certificate
- File upload component for FSSAI License (clearly marked as 'if applicable')
- Submit button
- Loading indicator during form submission

## 4.2.0 User Interactions

- Mandatory fields are clearly marked with an asterisk (*).
- Validation errors appear inline, next to the relevant field, upon losing focus or attempting submission.
- The file upload component shows the name of the selected file and provides a way to remove or change it.
- The submit button is disabled until all mandatory fields are filled with valid data.

## 4.3.0 Display Requirements

- The registration form must be displayed on a dedicated page within the vendor web dashboard.
- A confirmation page must be displayed after successful submission.

## 4.4.0 Accessibility Needs

- All form fields must have associated `<label>` tags.
- The form must be fully navigable and submittable using only a keyboard.
- Error messages must be programmatically associated with their respective input fields using `aria-describedby`.
- The UI must comply with WCAG 2.1 Level AA standards as per REQ-INT-001.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-VND-001

### 5.1.2 Rule Description

A new vendor account must be created with the status 'pending_verification' upon initial registration submission.

### 5.1.3 Enforcement Point

Backend - Vendor Registration API endpoint

### 5.1.4 Violation Handling

The transaction should fail if the status cannot be set correctly.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-VND-002

### 5.2.2 Rule Description

Registration is blocked if the provided mobile number or GST number already exists for another vendor account.

### 5.2.3 Enforcement Point

Backend - Vendor Registration API endpoint

### 5.2.4 Violation Handling

Return a 409 Conflict error with a descriptive message.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

ADM-001

#### 6.1.1.2 Dependency Reason

An administrator needs a way to view the pending registrations created by this story to make it functional.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-002

#### 6.1.2.2 Dependency Reason

An administrator needs to be able to review the details and documents submitted in this story to approve or reject the application.

## 6.2.0.0 Technical Dependencies

- A secure file storage service (e.g., AWS S3) must be configured with appropriate access policies.
- The 'Vendor & Catalog' microservice must have a defined database schema for vendors.
- The vendor-facing web application (React.js) project must be set up.

## 6.3.0.0 Data Dependencies

- Defined validation rules for Indian mobile numbers and GST numbers.
- A defined list of accepted file types (e.g., ['application/pdf', 'image/jpeg', 'image/png']) and a maximum file size (e.g., 5MB).

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API response for the registration submission must be less than 500ms (P95) as per REQ-FUN-001.

## 7.2.0.0 Security

- All data must be transmitted over HTTPS/TLS 1.2+.
- Uploaded documents must be stored in a private, non-publicly accessible location (e.g., a private S3 bucket).
- Robust server-side input validation must be implemented to prevent injection attacks (e.g., XSS, SQLi) as per OWASP Top 10 guidelines in REQ-NFR-003.

## 7.3.0.0 Usability

- The registration process should be intuitive and require minimal guidance for a non-technical user.
- Error messages must be clear, concise, and helpful.

## 7.4.0.0 Accessibility

- The registration form must be compliant with WCAG 2.1 Level AA standards (REQ-INT-001).

## 7.5.0.0 Compatibility

- The vendor web dashboard must be responsive and function correctly on all modern web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Implementing secure file upload, storage, and retrieval.
- Robust, multi-field server-side validation, including checks for uniqueness.
- Creating a responsive and accessible frontend form with good user feedback for validation and file handling.
- Integration between the frontend application, backend API, and file storage service.

## 8.3.0.0 Technical Risks

- Misconfiguration of S3 bucket policies could lead to a security vulnerability.
- Handling large file uploads could impact performance if not managed correctly (e.g., streaming uploads).

## 8.4.0.0 Integration Points

- Frontend (React) to Backend (NestJS) API Gateway endpoint.
- Backend service to AWS S3 for document storage.
- Backend service to PostgreSQL database for creating the vendor record.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Accessibility

## 9.2.0.0 Test Scenarios

- Verify successful submission with minimum required fields.
- Verify successful submission with all optional fields.
- Verify form validation for each field individually (empty, invalid format).
- Verify duplicate registration attempts are blocked.
- Verify file upload constraints (type, size).
- Verify keyboard-only navigation and submission.
- Verify API response time under load.

## 9.3.0.0 Test Data Needs

- Valid and invalid sample data for all form fields.
- Sample files of accepted and rejected types, and a file larger than the size limit.
- Pre-existing vendor data in the database to test uniqueness constraints.

## 9.4.0.0 Testing Tools

- Jest and React Testing Library for frontend unit/integration tests.
- Jest for backend unit/integration tests.
- Cypress for E2E testing.
- Axe for accessibility scanning.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >80% code coverage.
- Automated E2E tests for the happy path and key error conditions are passing.
- UI has been reviewed and approved by the design/product owner.
- Performance of the submission API meets the <500ms requirement.
- Security review confirms secure file handling and input validation.
- Accessibility audit (automated and manual) confirms WCAG 2.1 AA compliance.
- API documentation (OpenAPI) for the new endpoint is complete and accurate.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational story for the vendor track and a blocker for the entire vendor onboarding flow. It should be prioritized in an early sprint.
- Requires coordinated effort between frontend, backend, and DevOps (for S3 setup).

## 11.4.0.0 Release Impact

This feature is essential for the initial pilot launch. The platform cannot launch without a way for vendors to register.

