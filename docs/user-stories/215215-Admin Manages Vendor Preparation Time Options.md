# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | ADM-015 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Admin Manages Vendor Preparation Time Options |
| As A User Story | As an Administrator, I want to create, view, edit,... |
| User Persona | Platform Administrator responsible for system-wide... |
| Business Value | Provides operational control over order ETAs, stan... |
| Functional Area | Platform Administration |
| Story Theme | Operational Configuration Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Admin views the list of preparation time options

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

the Administrator is logged into the admin dashboard and has the necessary permissions

### 3.1.5 When

the Administrator navigates to the 'Operational Settings > Preparation Times' page

### 3.1.6 Then

the system displays a list of all currently configured preparation time options (e.g., '10-15 min', '15-20 min', '20-30 min').

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Admin adds a new preparation time option

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

the Administrator is on the 'Preparation Times' settings page

### 3.2.5 When

they click the 'Add New Option' button, enter a valid, unique value (e.g., '5-10 min') into the form, and submit it

### 3.2.6 Then

the system displays a success notification, the new option '5-10 min' appears in the list, and the action is recorded in the audit trail.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Admin edits an existing preparation time option

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

the Administrator is on the 'Preparation Times' settings page

### 3.3.5 When

they click the 'Edit' button for an existing option, change its value (e.g., from '20-30 min' to '25-35 min'), and save the change

### 3.3.6 Then

the system displays a success notification, the list updates to show '25-35 min', and the modification is recorded in the audit trail.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Admin deletes a preparation time option

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

the Administrator is on the 'Preparation Times' settings page and more than one option exists

### 3.4.5 When

they click the 'Delete' button for an option and confirm the action in a confirmation dialog

### 3.4.6 Then

the system displays a success notification, the option is removed from the list, and the deletion is recorded in the audit trail.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Admin attempts to add a duplicate option

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

the option '15-20 min' already exists in the configuration

### 3.5.5 When

the Administrator attempts to add a new option with the exact value '15-20 min'

### 3.5.6 Then

the system prevents the submission and displays a validation error message, such as 'This preparation time option already exists.'

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Admin attempts to add an empty or invalid option

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

the Administrator is adding a new preparation time option

### 3.6.5 When

they attempt to submit the form with an empty value

### 3.6.6 Then

the system prevents the submission and displays a validation error message, such as 'This field cannot be empty.'

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Admin attempts to delete the last remaining option

### 3.7.3 Scenario Type

Edge_Case

### 3.7.4 Given

only one preparation time option remains in the system configuration

### 3.7.5 When

the Administrator views the list of options

### 3.7.6 Then

the 'Delete' button for the last remaining option is disabled or hidden, preventing its removal.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A table or list to display current options.
- An 'Add New Option' button.
- 'Edit' and 'Delete' icons/buttons for each option in the list.
- A modal or inline form for adding/editing options, containing a single text input field.
- A confirmation modal for the delete action (e.g., 'Are you sure you want to delete this option? It will no longer be available for new orders.').
- Toast/snackbar notifications for success and error messages.

## 4.2.0 User Interactions

- Clicking 'Add' opens a form.
- Clicking 'Edit' populates the form with the existing value.
- Clicking 'Delete' opens a confirmation dialog before proceeding.
- Submitting the add/edit form closes it and refreshes the list.

## 4.3.0 Display Requirements

- The list of options should be clearly legible.
- Validation errors must be displayed inline with the form field.

## 4.4.0 Accessibility Needs

- All buttons, inputs, and controls must have accessible labels (aria-label).
- The interface must be fully navigable using a keyboard.
- Modals must trap focus correctly.
- Complies with WCAG 2.1 Level AA as per REQ-INT-001.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-ADM-015-01

### 5.1.2 Rule Description

A preparation time option value must be unique.

### 5.1.3 Enforcement Point

Backend service layer upon create/update request.

### 5.1.4 Violation Handling

Reject the request with a '409 Conflict' or '400 Bad Request' status and a descriptive error message.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-ADM-015-02

### 5.2.2 Rule Description

The system must maintain at least one preparation time option.

### 5.2.3 Enforcement Point

Backend service layer upon delete request.

### 5.2.4 Violation Handling

Reject the delete request if it targets the last remaining option, returning a '400 Bad Request' with an error message.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

ADM-005

#### 6.1.1.2 Dependency Reason

Requires the core admin user management and authentication system to be in place so an admin can log in.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-021

#### 6.1.2.2 Dependency Reason

Requires the audit trail system to be functional to log all configuration changes as per security requirements.

## 6.2.0.0 Technical Dependencies

- Admin dashboard frontend application shell and navigation.
- Backend API Gateway with authentication middleware for admin roles.
- A dedicated database table to persist the configuration options.

## 6.3.0.0 Data Dependencies

*No items available*

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API response for CRUD operations on this configuration must be under 200ms (P95) as per REQ-NFR-001.
- The settings page in the admin dashboard must load in under 2.5 seconds (LCP) as per REQ-NFR-001.

## 7.2.0.0 Security

- The API endpoint for managing these options must be restricted to users with the 'Administrator' role, enforced at the API Gateway level (REQ-USR-001).
- All changes (create, update, delete) must be logged in a dedicated, immutable audit trail, including the admin's user ID, timestamp, and the change details (REQ-USR-001, REQ-NFR-008).

## 7.3.0.0 Usability

- The interface for managing these options should be intuitive, requiring no special training for an administrator.

## 7.4.0.0 Accessibility

- Must adhere to WCAG 2.1 Level AA standards (REQ-INT-001).

## 7.5.0.0 Compatibility

- The admin web dashboard must be responsive and function correctly on all modern web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Low

## 8.2.0.0 Complexity Factors

- Standard CRUD functionality.
- Involves a single data entity with one field.
- UI is simple and uses standard components.

## 8.3.0.0 Technical Risks

- Ensuring that changes are immediately available to the vendor-facing service. A caching layer for this configuration might introduce stale data if not properly invalidated.

## 8.4.0.0 Integration Points

- Vendor Service: This service will need to fetch the list of configured options to display to vendors when they accept an order (as per REQ-FUN-010). An API endpoint must be provided for this purpose.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- Verify an admin can perform all CRUD operations.
- Verify all validation rules (uniqueness, not empty, can't delete last item).
- Verify that after an admin adds a new option, a vendor user sees that new option when accepting a new order.
- Verify that only users with the 'Administrator' role can access the API endpoints.
- Verify that all CRUD actions are correctly recorded in the audit log.

## 9.3.0.0 Test Data Needs

- An active administrator user account.
- An active vendor user account for E2E testing.

## 9.4.0.0 Testing Tools

- Jest and React Testing Library for frontend unit/integration tests.
- Jest for backend unit/integration tests.
- Cypress for end-to-end testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria are met and have been validated by QA.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written with at least 80% code coverage as per REQ-NFR-006.
- E2E tests for the primary success path are implemented and passing.
- The feature is deployed and verified on the Staging environment.
- API documentation (OpenAPI) for the new endpoints is created/updated.
- All security requirements, including role-based access and audit logging, are implemented and verified.
- The dependent vendor feature (VND-018) can successfully consume the configured data in the Staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

2

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is a blocker for 'VND-018: Vendor Selects Estimated Preparation Time'. It must be completed before or in the same sprint as VND-018 to avoid blocking the vendor workflow.

## 11.4.0.0 Release Impact

- This is a foundational configuration feature required for the order management lifecycle. It is essential for the initial pilot launch.

