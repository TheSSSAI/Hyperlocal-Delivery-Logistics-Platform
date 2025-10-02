# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-001 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider Initiates Registration with Document Upload |
| As A User Story | As a prospective delivery rider, I want to registe... |
| User Persona | A new, prospective rider who has downloaded the ri... |
| Business Value | Enables the onboarding of new riders, which is cri... |
| Functional Area | User Management |
| Story Theme | Rider Onboarding |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

RDR-001-AC-01

### 3.1.2 Scenario

Happy Path: Successful Registration Submission

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a new user is on the rider registration screen

### 3.1.5 When

they enter all valid and required personal details (mobile number, name), vehicle details (type, registration), bank details, upload all required documents (Aadhaar, PAN, Driver's License, Vehicle RC), and submit the form

### 3.1.6 Then

the system creates a new rider user record in the database with a status of 'pending_verification', securely stores the uploaded documents, and the user is navigated to a confirmation screen that says 'Application Submitted! We will notify you once your profile has been reviewed.'

### 3.1.7 Validation Notes

Verify the user record is created in the database with the correct status. Verify the documents are present and inaccessible to the public in the designated S3 bucket. Verify the API response is under 500ms as per REQ-FUN-001.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

RDR-001-AC-02

### 3.2.2 Scenario

Error: Registration with an Existing Mobile Number

### 3.2.3 Scenario Type

Error_Condition

### 3.2.4 Given

a new user is on the personal details step of the registration form

### 3.2.5 When

they enter a mobile number that already exists in the system

### 3.2.6 Then

an inline error message 'This mobile number is already registered. Please log in.' is displayed, and the user cannot proceed to the next step.

### 3.2.7 Validation Notes

Test with a mobile number known to be in the database. The API should return a specific error code for this condition.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

RDR-001-AC-03

### 3.3.2 Scenario

Error: Incomplete Form Submission

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

a user is on the final review step of the registration form

### 3.3.5 When

they attempt to submit the form without filling in all mandatory fields (e.g., PAN card number is missing)

### 3.3.6 Then

the 'Submit' button is disabled or, if enabled, tapping it displays an error message highlighting all the missing required fields, and the form is not submitted.

### 3.3.7 Validation Notes

Attempt to submit the form with various mandatory fields left blank and verify the correct feedback is provided.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

RDR-001-AC-04

### 3.4.2 Scenario

Error: Document Upload Failure

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

a user is on the document upload step of registration

### 3.4.5 When

they attempt to upload a file that is an unsupported format (e.g., .pdf) or exceeds the maximum size limit (e.g., > 5MB)

### 3.4.6 Then

the application displays a specific error message (e.g., 'Unsupported file type. Please use JPG or PNG.' or 'File size cannot exceed 5MB.') and the file is not uploaded.

### 3.4.7 Validation Notes

Test with various file types and sizes to ensure validation logic works correctly on the client-side and is re-validated on the server-side.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

RDR-001-AC-05

### 3.5.2 Scenario

Mobile Number Verification via OTP

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

a user has entered their mobile number in the registration form

### 3.5.5 When

they proceed to the next step

### 3.5.6 Then

the system sends an OTP to the provided mobile number, and the user must enter the correct OTP to verify their number before continuing with the registration process.

### 3.5.7 Validation Notes

Verify integration with the SMS gateway (AWS SNS). Test the OTP validation logic for correct and incorrect OTPs, as well as the resend OTP functionality.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

RDR-001-AC-06

### 3.6.2 Scenario

Data Privacy and Security Compliance

### 3.6.3 Scenario Type

Happy_Path

### 3.6.4 Given

a user is submitting their registration form

### 3.6.5 When

the data is transmitted from the client to the backend

### 3.6.6 Then

all communication must be over HTTPS/TLS 1.2+, and all Personally Identifiable Information (PII) and uploaded documents must be stored encrypted at rest, in compliance with REQ-CON-001 and REQ-NFR-003.

### 3.6.7 Validation Notes

Perform a security review. Check network traffic to confirm HTTPS. Verify encryption settings on the database (RDS) and S3 bucket.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Multi-step registration form with a progress indicator (e.g., Step 1 of 4).
- Input fields for: Full Name, Mobile Number, Address, Vehicle Type (e.g., Bike, Scooter), Vehicle Registration Number, Bank Account Number, IFSC Code.
- File upload components for each required document: Aadhaar Card, PAN Card, Driver's License, Vehicle RC.
- 'Submit Application' button.
- Confirmation screen/modal post-submission.

## 4.2.0 User Interactions

- User taps into a field to enter text.
- User taps an 'Upload' button to open the device's file picker or camera.
- Inline validation provides real-time feedback on input format (e.g., for mobile number, vehicle number).
- User navigates between steps using 'Next' and 'Back' buttons.

## 4.3.0 Display Requirements

- Clear labels for all fields.
- Placeholder text indicating expected format (e.g., 'MH-01-AB-1234').
- Clear instructions for document uploads, including accepted file types and size limits.
- Loading indicators during OTP verification, document uploads, and final submission.

## 4.4.0 Accessibility Needs

- All form fields must have associated labels for screen readers.
- Sufficient color contrast for text and UI elements.
- Tap targets must be at least 44x44 pixels.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-RDR-REG-01

### 5.1.2 Rule Description

A rider's mobile number must be unique across all user roles in the platform.

### 5.1.3 Enforcement Point

During the submission of the personal details step of the registration form.

### 5.1.4 Violation Handling

Display an error message indicating the number is already in use and prevent the user from proceeding.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-RDR-REG-02

### 5.2.2 Rule Description

A rider account is created with an initial status of 'pending_verification' and cannot be used for logging in or accepting tasks until approved by an administrator.

### 5.2.3 Enforcement Point

Upon successful submission of the registration form.

### 5.2.4 Violation Handling

The system should prevent login attempts from accounts in this state.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

ADM-001

#### 6.1.1.2 Dependency Reason

An administrator needs a way to view and process the pending registrations created by this story.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

SYS-XXX (OTP Service)

#### 6.1.2.2 Dependency Reason

This story requires a centralized OTP generation and verification service for mobile number validation, as per REQ-FUN-001.

## 6.2.0.0 Technical Dependencies

- AWS Cognito for user identity management (REQ-NFR-003).
- A secure AWS S3 bucket for storing uploaded documents.
- Backend 'Identity & Access' microservice with a defined API endpoint for rider registration.
- Finalized database schema for the 'riders' table, including fields for personal info, vehicle, bank details, and document references.

## 6.3.0.0 Data Dependencies

- A predefined list of required documents for rider registration.

## 6.4.0.0 External Dependencies

- AWS Simple Notification Service (SNS) for sending OTPs via SMS (REQ-INT-003).

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API response time for the final registration submission must be less than 500ms (P95) as per REQ-FUN-001.

## 7.2.0.0 Security

- All PII (name, phone, address, Aadhaar, PAN, bank details) must be encrypted at rest and in transit (REQ-CON-001, REQ-NFR-003).
- Uploaded documents must be stored in a private S3 bucket with strict access controls, accessible only by authorized backend services.
- Input validation must be performed on both client and server sides to prevent injection attacks.

## 7.3.0.0 Usability

- The registration process should be intuitive and broken into logical steps to avoid overwhelming the user.
- Error messages must be clear, user-friendly, and guide the user on how to correct the issue.

## 7.4.0.0 Accessibility

- The registration interface must comply with WCAG 2.1 Level AA standards (REQ-INT-001).

## 7.5.0.0 Compatibility

- The feature must be fully functional on the supported versions of iOS and Android for the rider mobile application.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Building a robust, multi-step form with state management in React Native.
- Implementing secure file handling for uploads from a mobile device to S3.
- Coordinating user creation across the internal database and AWS Cognito.
- Ensuring all PII fields are correctly handled for encryption at rest.

## 8.3.0.0 Technical Risks

- Potential for inconsistent user state if the user abandons the app mid-registration.
- Handling network interruptions gracefully during document uploads.
- Ensuring the security of document storage and access is correctly configured from day one.

## 8.4.0.0 Integration Points

- Backend User Management/Identity Service API.
- AWS Cognito User Pools.
- AWS S3 for file storage.
- AWS SNS for SMS OTP delivery.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Usability

## 9.2.0.0 Test Scenarios

- Successful end-to-end registration.
- Attempted registration with an existing mobile number.
- Submission of form with missing mandatory fields.
- Upload of invalid file types and oversized files.
- OTP verification flow (correct, incorrect, expired, resend).
- Verification of data encryption in the database and file storage.

## 9.3.0.0 Test Data Needs

- A set of new user details.
- A mobile number that is already registered.
- Sample document files of valid/invalid types and sizes (e.g., .jpg, .png, .pdf, >5MB file).

## 9.4.0.0 Testing Tools

- Jest & React Testing Library for frontend unit tests.
- Cypress or a similar framework for E2E testing on the mobile app.
- Postman/Insomnia for API-level testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing.
- Code reviewed and approved by at least one other engineer.
- Unit and integration tests implemented with at least 80% coverage and all are passing.
- E2E automated test for the happy path registration flow is created and passing.
- User interface reviewed and approved by the design/product team.
- Security review of PII and document handling has been completed and any findings addressed.
- API documentation (OpenAPI) for the registration endpoint is created or updated.
- Story deployed and verified in the staging environment by QA.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational story for the rider lifecycle and a blocker for any rider-related features. It should be prioritized in an early sprint.
- Requires coordination between frontend (mobile), backend, and DevOps (for S3/Cognito setup).

## 11.4.0.0 Release Impact

This feature is essential for the initial pilot launch. The platform cannot operate without a way to onboard riders.

