# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-005 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider Manages Personal Profile Information |
| As A User Story | As a registered Rider, I want to view and edit my ... |
| User Persona | A registered and verified Rider using the rider-fa... |
| Business Value | Increases data accuracy for operational communicat... |
| Functional Area | User Management |
| Story Theme | Rider Profile & Account Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

RDR-005-AC-001

### 3.1.2 Scenario

Rider successfully views their profile information

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in rider on the mobile application

### 3.1.5 When

I navigate to the 'My Profile' screen

### 3.1.6 Then

I should see my current Full Name, Mobile Number, Email Address, and Profile Picture displayed correctly and in a read-only state.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

RDR-005-AC-002

### 3.2.2 Scenario

Rider successfully edits their email address

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

I am on the 'My Profile' screen and have tapped 'Edit'

### 3.2.5 When

I change my email address to a new, valid email and tap 'Save'

### 3.2.6 Then

The system updates my email address, a success message 'Profile updated successfully' is displayed, and a notification is sent to my registered mobile number confirming the change.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

RDR-005-AC-003

### 3.3.2 Scenario

Rider successfully changes their profile picture

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

I am on the 'My Profile' screen

### 3.3.5 When

I tap the option to change my profile picture, select a valid image (JPG, PNG) from my device, and confirm the upload

### 3.3.6 Then

My new profile picture is displayed on the screen, and a success message is shown.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

RDR-005-AC-004

### 3.4.2 Scenario

Rider successfully changes their primary mobile number

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

I am on the 'My Profile' screen in edit mode

### 3.4.5 When

I enter a new, valid, and unregistered mobile number, trigger the verification, and correctly enter the OTP sent to the new number

### 3.4.6 Then

My login mobile number is updated in the system, a success message is displayed, and a confirmation notification is sent to both my old and new mobile numbers.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

RDR-005-AC-005

### 3.5.2 Scenario

Rider enters an invalid email format

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

I am on the 'My Profile' screen in edit mode

### 3.5.5 When

I enter an email with an invalid format (e.g., 'test@domain') and tap 'Save'

### 3.5.6 Then

An inline error message 'Please enter a valid email address' is displayed below the email field, and the profile is not updated.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

RDR-005-AC-006

### 3.6.2 Scenario

Rider attempts to use an existing mobile number

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

I am attempting to change my mobile number

### 3.6.5 When

I enter a mobile number that is already registered to another user and request verification

### 3.6.6 Then

An error message 'This mobile number is already in use' is displayed, and the OTP process is not initiated.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

RDR-005-AC-007

### 3.7.2 Scenario

Rider enters an incorrect OTP for mobile number change

### 3.7.3 Scenario Type

Error_Condition

### 3.7.4 Given

I have initiated a mobile number change and received an OTP on the new number

### 3.7.5 When

I enter an incorrect OTP and submit it

### 3.7.6 Then

An error message 'Invalid OTP. Please try again.' is displayed, and my mobile number remains unchanged.

## 3.8.0 Criteria Id

### 3.8.1 Criteria Id

RDR-005-AC-008

### 3.8.2 Scenario

Rider discards unsaved changes

### 3.8.3 Scenario Type

Edge_Case

### 3.8.4 Given

I am on the 'My Profile' screen in edit mode and have made changes to my information

### 3.8.5 When

I attempt to navigate back or close the screen without saving

### 3.8.6 Then

A confirmation dialog appears with the message 'You have unsaved changes. Are you sure you want to discard them?', and my profile remains unchanged if I confirm.

## 3.9.0 Criteria Id

### 3.9.1 Criteria Id

RDR-005-AC-009

### 3.9.2 Scenario

Audit trail is created for PII changes

### 3.9.3 Scenario Type

Happy_Path

### 3.9.4 Given

A rider has successfully updated their name, email, or mobile number

### 3.9.5 When

The change is committed to the database

### 3.9.6 Then

An immutable audit log entry is created containing the rider's ID, the field that was changed, a timestamp, and the actor (the rider themselves), as per REQ-USR-001.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A dedicated 'Profile' screen accessible from the main navigation.
- Display fields for Full Name, Mobile Number, and Email.
- A circular image view for the Profile Picture.
- An 'Edit' button to enable form fields.
- A 'Save' button, disabled by default and enabled only when changes are made.
- A 'Change Picture' button/icon.
- Input fields for OTP verification during mobile number change.
- Toast/Snackbar for success and error messages.

## 4.2.0 User Interactions

- Tapping 'Edit' makes text fields editable.
- Tapping 'Save' triggers validation and an API call.
- Tapping the profile picture or an associated icon opens the device's image picker.
- Navigating away with unsaved changes prompts a confirmation dialog.

## 4.3.0 Display Requirements

- User's current information must be pre-populated in the fields.
- Validation errors must be displayed inline, close to the relevant field.
- A loading indicator should be shown while saving data or uploading an image.

## 4.4.0 Accessibility Needs

- All form fields must have clear, descriptive labels.
- All buttons must have accessible names.
- The UI must be navigable using screen readers, adhering to WCAG 2.1 Level AA.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-RDR-PROFILE-001

### 5.1.2 Rule Description

A mobile number used for registration must be unique across all users in the system.

### 5.1.3 Enforcement Point

During the mobile number change validation step, before sending an OTP.

### 5.1.4 Violation Handling

Display an error message to the user and prevent the update.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-RDR-PROFILE-002

### 5.2.2 Rule Description

Any change to Personally Identifiable Information (PII) or financial information must trigger a notification to the user.

### 5.2.3 Enforcement Point

After a successful database update of the user's profile.

### 5.2.4 Violation Handling

The transaction should be flagged for review if the notification fails to send.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-001

#### 6.1.1.2 Dependency Reason

A rider account must be created before a profile can be managed.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

RDR-004

#### 6.1.2.2 Dependency Reason

Rider must be able to log in to access their profile page.

## 6.2.0.0 Technical Dependencies

- AWS Cognito: For managing user attributes like email and phone number (REQ-NFR-003).
- Notification Service (FCM/SNS): To send confirmation messages for profile changes (REQ-INT-003).
- AWS S3: For storing and serving rider profile pictures.
- Audit Logging Service: A backend component to log all sensitive data changes (REQ-USR-001).

## 6.3.0.0 Data Dependencies

- The rider's existing profile data must be available to be displayed.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The profile screen should load all user data within 2 seconds on a stable 4G connection.
- Saving profile updates should complete within 1.5 seconds (P95 latency).

## 7.2.0.0 Security

- All API calls must be authenticated and authorized over HTTPS/TLS 1.2+.
- A user must only be able to view and edit their own profile.
- Changing the primary mobile number must require OTP verification of the new number.
- Profile pictures uploaded by users must be scanned for malware.
- All PII changes must be logged in an immutable audit trail as per REQ-USR-001.

## 7.3.0.0 Usability

- The process of editing and saving information should be intuitive and require minimal steps.
- Error messages must be clear and actionable.

## 7.4.0.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The feature must function correctly on the supported versions of iOS and Android.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Secure, multi-step workflow for changing the primary mobile number (initiate, send OTP, verify, commit).
- Integration with AWS Cognito to update user attributes.
- Integration with AWS S3 for secure image uploads, including resizing and access control.
- Transactional logic to ensure that both the application database and Cognito are updated consistently.
- Implementing the audit trail for all PII changes.

## 8.3.0.0 Technical Risks

- Inconsistency between the application database and Cognito if one of the updates fails during the mobile number change process. A rollback or reconciliation mechanism is needed.
- Failure in the OTP delivery service could block users from updating their mobile number.

## 8.4.0.0 Integration Points

- Backend 'Identity & Access' microservice API (GET /rider/profile, PUT /rider/profile).
- AWS Cognito API (e.g., AdminUpdateUserAttributes).
- AWS S3 API for file uploads.
- AWS SNS/FCM for sending notifications.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Usability

## 9.2.0.0 Test Scenarios

- Verify all fields display correctly upon loading the profile.
- Test successful update of each editable field individually.
- Test the complete, successful flow of changing a mobile number with a valid OTP.
- Test failure cases: invalid email, existing mobile number, incorrect OTP, network failure during save.
- Test image upload with valid and invalid file types/sizes.
- Verify that a user cannot access or modify another user's profile via API manipulation.
- Confirm that security notifications and audit logs are generated for every PII change.

## 9.3.0.0 Test Data Needs

- Test rider accounts with pre-populated profile data.
- A pool of unused mobile numbers for testing the change functionality.
- A mobile number that is already registered to a different test account.

## 9.4.0.0 Testing Tools

- Jest & React Testing Library (Frontend Unit/Integration)
- Cypress (E2E)
- Postman/Insomnia (API Testing)

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration test coverage meets the 80% requirement (REQ-NFR-006).
- Automated E2E tests for the happy path and critical error conditions are implemented and passing.
- The feature has been manually tested and verified on target iOS and Android devices.
- Security requirements, including audit logging and notifications, have been validated.
- API documentation (OpenAPI) for the profile endpoints is complete and accurate.
- The feature is deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- Requires prior setup and configuration of AWS Cognito User Pools, S3 buckets, and the Notification Service.
- The team needs clarity on the exact PII fields that are considered editable by the rider versus those requiring admin intervention.
- The mobile number change flow is the most complex part and should be tackled early in the sprint.

## 11.4.0.0 Release Impact

This is a foundational feature for rider self-service and is critical for launch.

