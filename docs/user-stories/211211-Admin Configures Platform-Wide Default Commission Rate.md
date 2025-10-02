# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | ADM-011 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Admin Configures Platform-Wide Default Commission ... |
| As A User Story | As an Administrator, I want to configure and updat... |
| User Persona | Platform Administrator responsible for financial a... |
| Business Value | Enables the platform to set and manage its primary... |
| Functional Area | Administration & Financial Management |
| Story Theme | Platform Configuration |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Admin successfully views and updates the default commission rate

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

the Administrator is logged into the admin dashboard and navigates to the 'Financial Settings' page

### 3.1.5 When

the Administrator enters a valid numerical value (e.g., '15.5') into the 'Default Commission Rate (%)' field and clicks 'Save Changes'

### 3.1.6 Then

the system must persist the new value, display a success notification ('Default commission rate updated successfully.'), and the input field must show the new value upon page reload.

### 3.1.7 Validation Notes

Verify the value is updated in the configuration database. Check that the success message is displayed. A subsequent order calculation for a vendor without a custom rate should use this new value.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

System rejects non-numeric input for the commission rate

### 3.2.3 Scenario Type

Error_Condition

### 3.2.4 Given

the Administrator is on the 'Financial Settings' page

### 3.2.5 When

the Administrator enters a non-numeric value (e.g., 'abc') into the 'Default Commission Rate (%)' field and clicks 'Save Changes'

### 3.2.6 Then

the system must not save the value and must display a clear validation error message, such as 'Please enter a valid number.'

### 3.2.7 Validation Notes

Confirm that the database value remains unchanged and the error message is displayed next to the input field.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

System rejects out-of-range numerical input for the commission rate

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

the Administrator is on the 'Financial Settings' page

### 3.3.5 When

the Administrator enters a numerical value outside the valid range of 0-100 (e.g., '-5' or '101') and clicks 'Save Changes'

### 3.3.6 Then

the system must not save the value and must display a clear validation error message, such as 'Commission rate must be a percentage between 0 and 100.'

### 3.3.7 Validation Notes

Test with negative numbers, zero, 100, and numbers greater than 100. Confirm the database value remains unchanged.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

System rejects empty input for the commission rate

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

the Administrator is on the 'Financial Settings' page

### 3.4.5 When

the Administrator clears the 'Default Commission Rate (%)' field and clicks 'Save Changes'

### 3.4.6 Then

the system must not save the value and must display a validation error message, such as 'This field is required.'

### 3.4.7 Validation Notes

Confirm that the database value is not updated to null or an empty string.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Updating the commission rate creates an audit trail entry

### 3.5.3 Scenario Type

Happy_Path

### 3.5.4 Given

the Administrator is on the 'Financial Settings' page and the current rate is '15.0'

### 3.5.5 When

the Administrator successfully updates the rate to '17.5'

### 3.5.6 Then

the system must create an entry in the immutable audit trail log that includes the administrator's ID, the action performed ('Default Commission Rate Update'), the old value ('15.0'), the new value ('17.5'), and a timestamp.

### 3.5.7 Validation Notes

Query the audit log database or API to confirm the new record exists and contains all the required information, as per REQ-NFR-008.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Non-admin user is denied access to update the commission rate

### 3.6.3 Scenario Type

Security

### 3.6.4 Given

a user with a 'Vendor' or 'Rider' role is authenticated

### 3.6.5 When

the user attempts to make a direct API call to the endpoint responsible for updating the default commission rate

### 3.6.6 Then

the system must reject the request with a '403 Forbidden' HTTP status code.

### 3.6.7 Validation Notes

Use an API testing tool like Postman or an automated test to attempt the action with a non-admin user's authentication token.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A dedicated 'Financial Settings' or 'Platform Configuration' section in the Admin Dashboard.
- A clearly labeled numerical input field: 'Default Commission Rate (%)'.
- A 'Save Changes' or 'Update' button, which is disabled until a change is made to the input field.
- Inline text for validation error messages.
- A toast or banner notification for success messages.

## 4.2.0 User Interactions

- The current default commission rate is pre-populated in the input field on page load.
- The system provides real-time validation feedback as the user types, if possible (e.g., highlighting invalid characters).

## 4.3.0 Display Requirements

- The commission rate should be displayed and input as a percentage, allowing for decimal values (e.g., 12.75).

## 4.4.0 Accessibility Needs

- The input field must have an associated `<label>` for screen reader compatibility.
- All UI elements must meet WCAG 2.1 Level AA contrast and keyboard navigation standards, as per REQ-INT-001.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-ADM-011-01

### 5.1.2 Rule Description

The default commission rate must be a numerical value between 0.00 and 100.00, inclusive.

### 5.1.3 Enforcement Point

API endpoint and frontend form validation before submission.

### 5.1.4 Violation Handling

The update request is rejected, and a user-facing error message is displayed.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-ADM-011-02

### 5.2.2 Rule Description

Any change to the default commission rate must be recorded in the system's audit trail.

### 5.2.3 Enforcement Point

Backend service layer after successful validation and before database commit.

### 5.2.4 Violation Handling

If the audit log write fails, the entire transaction should be rolled back to ensure data integrity.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

ADM-005

#### 6.1.1.2 Dependency Reason

Requires the core admin user role, authentication, and dashboard framework to be in place to host the settings page.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-021

#### 6.1.2.2 Dependency Reason

Requires the audit trail system to be functional to log the administrative action as specified in the acceptance criteria.

## 6.2.0.0 Technical Dependencies

- Admin Dashboard (React.js) for the UI.
- Configuration Service/Microservice with a database table for platform settings.
- Authentication/Authorization Service (AWS Cognito) to enforce RBAC.
- Audit Logging Service.

## 6.3.0.0 Data Dependencies

- Requires access to the current default commission rate value from the configuration database to display it.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API response time for updating the setting must be under 500ms (P95).
- The configuration value should be cached (e.g., in Redis) to prevent database lookups during every order's commission calculation.

## 7.2.0.0 Security

- The API endpoint must be protected by Role-Based Access Control (RBAC), accessible only to the 'Administrator' role.
- All input must be sanitized on the backend to prevent injection attacks.
- The change must be logged in an immutable audit trail as per REQ-NFR-008.

## 7.3.0.0 Usability

- The setting must be easy to find within the admin dashboard.
- Error messages must be clear and actionable.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The admin dashboard must be responsive and function correctly on all modern web browsers supported by the project.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Low

## 8.2.0.0 Complexity Factors

- Involves a simple form and a single API endpoint for a CRUD operation.
- Integration with the existing audit log service is required.
- A caching strategy for this value should be considered to optimize the performance of the financial calculation service.

## 8.3.0.0 Technical Risks

- Minimal risk. The primary risk is downstream, ensuring that the financial services correctly fetch and use the updated value. A failure in the cache invalidation process could lead to old rates being used.

## 8.4.0.0 Integration Points

- Admin Dashboard Frontend -> Configuration Service API
- Configuration Service -> Audit Log Service
- Financial/Settlement Service -> Configuration Service (or its cache) to retrieve the rate.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Verify successful update with a valid integer and a valid decimal.
- Verify rejection of negative, >100, non-numeric, and empty values.
- Verify audit log creation upon successful update.
- Verify API endpoint returns 403 for non-admin users.
- E2E test: Admin logs in, changes value, saves, logs out, logs back in, and confirms the new value is still present.

## 9.3.0.0 Test Data Needs

- An active Administrator user account.
- Test accounts for other roles (Vendor, Rider) to verify access control.

## 9.4.0.0 Testing Tools

- Jest & React Testing Library for frontend unit tests.
- Jest for backend unit/integration tests.
- Cypress for E2E tests.
- Postman or similar for API security testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one other engineer
- Unit and integration tests implemented with >80% coverage
- E2E tests for the happy path and key error conditions are automated and passing
- User interface reviewed and approved by the product owner/designer
- Security requirements (RBAC, audit logging) validated
- API documentation (OpenAPI) is created or updated
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

2

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational setting for the platform's financial model. It should be completed early in the project, as it is a dependency for all financial calculation and settlement stories.

## 11.4.0.0 Release Impact

- This feature must be live before any transactions can be processed on the platform.

