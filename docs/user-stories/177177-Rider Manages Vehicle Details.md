# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-006 |
| Elaboration Date | 2024-05-22 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider Manages Vehicle Details |
| As A User Story | As a registered Rider, I want to add and update my... |
| User Persona | A registered and approved Rider who performs deliv... |
| Business Value | Ensures the platform maintains an accurate, safe, ... |
| Functional Area | Rider Profile Management |
| Story Theme | Rider Onboarding and Compliance |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Rider views their current, verified vehicle details

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a registered rider with a verified vehicle is logged into the rider application

### 3.1.5 When

the rider navigates to the 'My Vehicle' or 'Profile' section

### 3.1.6 Then

the application must display the current vehicle's details: Vehicle Type, Make, Model, Registration Number, and a status indicator showing 'Verified'.

### 3.1.7 Validation Notes

Verify that all stored vehicle details are correctly rendered on the UI.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Rider successfully submits updated vehicle details for re-verification

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

the rider is on the 'My Vehicle' screen

### 3.2.5 When

the rider initiates the edit flow, modifies a field (e.g., Registration Number), uploads a new document, and confirms submission

### 3.2.6 Then

the application must display a success message confirming submission for verification, and the vehicle's status must change to 'Pending Verification'.

### 3.2.7 Validation Notes

Check the database to confirm the new data is saved and the status field is updated. The admin dashboard should show a new item in the verification queue.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Rider is prevented from going online with a vehicle pending verification

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

a rider has submitted updated vehicle details and the status is 'Pending Verification'

### 3.3.5 When

the rider attempts to toggle their availability status to 'Online' from the main screen

### 3.3.6 Then

the system must prevent the status change and display an informative message, such as 'You cannot go online until your vehicle is approved.'

### 3.3.7 Validation Notes

This requires integration testing with the availability feature (RDR-009). The 'Online' toggle should be disabled or show a blocking message on tap.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Rider is shown a warning before submitting changes that require re-verification

### 3.4.3 Scenario Type

Alternative_Flow

### 3.4.4 Given

the rider has modified their vehicle details and is about to save them

### 3.4.5 When

the rider taps the 'Save' or 'Submit' button

### 3.4.6 Then

the application must display a confirmation dialog warning them, 'Submitting new details will require re-verification, and you cannot go online until approved. Continue?'

### 3.4.7 Validation Notes

The submission should only proceed after the rider explicitly confirms this dialog.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

System validates required fields and format on submission

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

the rider is editing their vehicle details

### 3.5.5 When

the rider attempts to save the form with a missing required field (e.g., Registration Number) or an invalid format

### 3.5.6 Then

the system must prevent submission and display a clear, inline error message next to the invalid field (e.g., 'Registration number is required').

### 3.5.7 Validation Notes

Test with empty fields and incorrectly formatted registration numbers (e.g., 'ABC-123').

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Rider cannot edit vehicle details while a verification is already pending

### 3.6.3 Scenario Type

Edge_Case

### 3.6.4 Given

a rider's vehicle status is 'Pending Verification'

### 3.6.5 When

the rider navigates to the 'My Vehicle' screen

### 3.6.6 Then

the 'Edit' button or form fields must be disabled, and a message should indicate that edits are locked until the current review is complete.

### 3.6.7 Validation Notes

Verify the UI state is read-only when the vehicle status is not 'Verified' or 'Rejected'.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A dedicated 'Vehicle Details' screen within the rider's profile.
- Read-only display fields for current vehicle information.
- An 'Edit' button to enter modification mode.
- Input fields for: Vehicle Type (Dropdown: 'Motorcycle', 'Scooter'), Make (Text), Model (Text), Registration Number (Text).
- File upload components for 'Vehicle Registration Certificate' and 'Vehicle Insurance', showing a preview or filename of the uploaded document.
- A status indicator displaying 'Verified', 'Pending Verification', or 'Rejected'.
- A confirmation modal/dialog to warn users about the re-verification process.

## 4.2.0 User Interactions

- Tapping 'Edit' enables the form fields for modification.
- Tapping a document upload button should open the device's native file picker or camera.
- Tapping 'Save' triggers validation and the confirmation dialog.
- The UI should provide clear feedback (e.g., toast notifications, loading spinners) during the submission process.

## 4.3.0 Display Requirements

- The registration number should be displayed in the standard Indian format (e.g., MH 01 AB 1234).
- The status of the vehicle must be prominently displayed.
- If verification is rejected, the reason for rejection (provided by the admin) should be displayed to the rider.

## 4.4.0 Accessibility Needs

- All form fields must have clear labels.
- All interactive elements (buttons, inputs) must have sufficient touch target size.
- The UI must be navigable using screen readers, adhering to WCAG 2.1 Level AA where applicable.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-RDR-VEH-01

### 5.1.2 Rule Description

A rider can only have one active vehicle at a time. Updating vehicle details places the vehicle into a 'Pending Verification' state.

### 5.1.3 Enforcement Point

Backend API on vehicle detail submission.

### 5.1.4 Violation Handling

The system updates the existing vehicle record's status rather than creating a new one.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-RDR-VEH-02

### 5.2.2 Rule Description

A rider cannot set their status to 'Online' unless they have a vehicle with a 'Verified' status.

### 5.2.3 Enforcement Point

Backend API that handles rider availability status changes.

### 5.2.4 Violation Handling

The API request to go online is rejected with an error code and message.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-001

#### 6.1.1.2 Dependency Reason

Establishes the initial rider profile and first vehicle entry during onboarding.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

RDR-004

#### 6.1.2.2 Dependency Reason

Required for user authentication to access profile information.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

RDR-005

#### 6.1.3.2 Dependency Reason

Creates the main profile section where the 'Vehicle Details' UI will reside.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

ADM-003

#### 6.1.4.2 Dependency Reason

The admin-side functionality to approve or reject registrations is needed to complete the verification lifecycle for vehicle updates.

## 6.2.0.0 Technical Dependencies

- Amazon S3 bucket for storing uploaded documents.
- Rider management microservice with endpoints for CRUD operations on vehicle details.
- Database schema in PostgreSQL to support vehicle fields and verification status.
- AWS Cognito for securing the rider-facing APIs.

## 6.3.0.0 Data Dependencies

- The rider's unique ID from the JWT to associate the vehicle with the correct profile.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- API response time for fetching vehicle details should be < 200ms (P95).
- Document uploads should show progress and complete within 10 seconds on a stable 3G connection.

## 7.2.0.0 Security

- All document uploads must be handled via pre-signed URLs to prevent direct S3 access.
- Uploaded files must be scanned for malware.
- Input validation must be enforced on the backend to prevent injection attacks.
- Access to vehicle details must be restricted to the vehicle's owner (the rider) and authorized administrators.

## 7.3.0.0 Usability

- Error messages must be clear and actionable.
- The process of updating details should be intuitive, requiring minimal steps.

## 7.4.0.0 Accessibility

- Compliance with WCAG 2.1 Level AA standards for mobile applications.

## 7.5.0.0 Compatibility

- The feature must function correctly on the supported versions of iOS and Android for the Rider App.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Frontend logic for form state management, validation, and file handling.
- Backend integration with Amazon S3 for secure file uploads.
- Implementing the state machine for vehicle verification (Verified -> Pending -> Rejected/Verified).
- Cross-service interaction to enforce the 'cannot go online' business rule, which impacts the Rider Availability service.

## 8.3.0.0 Technical Risks

- Handling large file uploads or network interruptions gracefully.
- Ensuring the state change correctly and immediately reflects on the rider's ability to go online, preventing race conditions.

## 8.4.0.0 Integration Points

- Rider Profile API (to fetch/update data).
- Rider Availability API (to check vehicle status before allowing online status).
- Admin Backend (to push items into the verification queue).

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Usability

## 9.2.0.0 Test Scenarios

- Verify a rider can view their details.
- Verify a rider can successfully submit an update.
- Verify a rider is blocked from going online after submission.
- Verify form validation for all fields.
- Verify file upload functionality with different file types and sizes.
- E2E: Rider updates vehicle -> Admin approves update -> Rider is able to go online again.

## 9.3.0.0 Test Data Needs

- Test rider accounts with 'Verified' vehicles.
- Test rider accounts with 'Pending Verification' vehicles.
- Sample image files (JPG, PNG) for document uploads.
- Invalid data for testing validation (e.g., malformed registration numbers).

## 9.4.0.0 Testing Tools

- Jest & React Testing Library (Frontend Unit/Integration).
- Cypress (End-to-End).
- Postman/Insomnia (API Testing).

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing.
- Code reviewed and approved by at least one peer.
- Unit and integration tests implemented with >80% coverage.
- E2E tests for the primary success and failure scenarios are automated.
- User interface reviewed for usability and adherence to design specs.
- API endpoints are documented via OpenAPI specification.
- Security requirements (input validation, secure uploads) are validated.
- Story deployed and verified in the staging environment without regressions.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- Requires both frontend (React Native) and backend (Node.js/NestJS) development effort.
- Dependent on the admin verification workflow (ADM-003). If the admin story is not ready, this story can be partially completed but cannot be fully tested E2E.
- Coordination is needed with the team/service responsible for rider availability.

## 11.4.0.0 Release Impact

This is a critical feature for rider compliance and data accuracy. It is required for post-launch fleet management.

