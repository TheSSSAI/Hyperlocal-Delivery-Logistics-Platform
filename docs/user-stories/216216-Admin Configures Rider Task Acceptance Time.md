# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | ADM-016 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Admin Configures Rider Task Acceptance Time |
| As A User Story | As an Administrator, I want to configure the time ... |
| User Persona | Administrator responsible for platform-wide operat... |
| Business Value | Enables fine-tuning of a critical operational para... |
| Functional Area | Platform Administration & Configuration |
| Story Theme | Operational Efficiency Controls |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Admin successfully views and updates the rider task acceptance time

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

the administrator is logged into the admin dashboard and has permissions to manage operational settings

### 3.1.5 When

the administrator navigates to the 'Operational Settings' page

### 3.1.6 Then

the administrator sees a field labeled 'Rider Task Acceptance Time (seconds)' displaying the current configured value (e.g., default 60).

### 3.1.7 Validation Notes

Verify the current value is fetched from the backend configuration service and displayed correctly.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Admin successfully saves a new valid time limit

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

the administrator is on the 'Operational Settings' page

### 3.2.5 When

the administrator enters a new, valid integer value (e.g., 45) into the 'Rider Task Acceptance Time' field and clicks 'Save Changes'

### 3.2.6 Then

a success notification (e.g., 'Settings updated successfully') is displayed.

### 3.2.7 And

an entry is created in the administrator audit log recording the change, the old value, the new value, the timestamp, and the admin user who made the change.

### 3.2.8 Validation Notes

Check the database to confirm the new value is saved. Check the audit log for the corresponding entry. The Rider Logistics service must now use this new value for subsequent task offers.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Admin attempts to save a non-numeric value

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

the administrator is on the 'Operational Settings' page

### 3.3.5 When

the administrator enters a non-numeric value (e.g., 'abc') into the field and attempts to save

### 3.3.6 Then

a validation error message is displayed next to the field (e.g., 'Please enter a valid number.') and the save action is prevented.

### 3.3.7 Validation Notes

Verify that the form submission fails and no API call is made if client-side validation is used, or that the API returns a 400 Bad Request response if server-side.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Admin attempts to save a value outside the defined business rule range

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

the administrator is on the 'Operational Settings' page and the acceptable range is 15-120 seconds

### 3.4.5 When

the administrator enters a value below the minimum (e.g., 10) or above the maximum (e.g., 150) and attempts to save

### 3.4.6 Then

a validation error message is displayed (e.g., 'Value must be between 15 and 120 seconds.') and the save action is prevented.

### 3.4.7 Validation Notes

This validation should exist on both the client and server side.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Admin attempts to save a zero or negative value

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

the administrator is on the 'Operational Settings' page

### 3.5.5 When

the administrator enters '0' or a negative number (e.g., -30) and attempts to save

### 3.5.6 Then

a validation error message is displayed (e.g., 'Value must be a positive number.') and the save action is prevented.

### 3.5.7 Validation Notes

This check is critical to prevent system failures in the allocation logic.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Admin attempts to save an empty value

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

the administrator is on the 'Operational Settings' page

### 3.6.5 When

the administrator clears the input field and attempts to save

### 3.6.6 Then

a validation error message is displayed (e.g., 'This field is required.') and the save action is prevented.

### 3.6.7 Validation Notes

Ensure the system enforces the presence of this critical configuration value.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A dedicated section in the Admin Dashboard, e.g., 'Settings > Operational'
- A clearly labeled number input field: 'Rider Task Acceptance Time (seconds)'
- A 'Save Changes' button, which should be disabled by default and enabled only when the value in the input field is changed.
- A toast notification component for success and error messages.

## 4.2.0 User Interactions

- Admin enters a number into the input field.
- Admin clicks the 'Save Changes' button to submit the form.
- The system provides immediate visual feedback on the success or failure of the action.

## 4.3.0 Display Requirements

- The current value must be loaded and displayed when the page loads.
- Helper text should be displayed below the input field: 'Set the time in seconds a rider has to accept or reject a delivery offer before it is automatically offered to the next available rider.'

## 4.4.0 Accessibility Needs

- The input field must have a proper `<label>` tag associated with it.
- Validation error messages must be programmatically associated with the input field for screen readers.
- All interactive elements must be keyboard-navigable.

# 5.0.0 Business Rules

- {'rule_id': 'BR-ADM-016-1', 'rule_description': 'The Rider Task Acceptance Time must be a positive integer between 15 and 120 (inclusive).', 'enforcement_point': 'Client-side form validation and Server-side API validation.', 'violation_handling': 'The system rejects the change and returns a descriptive error message to the user.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

ADM-005

#### 6.1.1.2 Dependency Reason

Requires the core admin user management and authentication system to be in place for an administrator to log in and access the dashboard.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

REQ-FUN-018

#### 6.1.2.2 Dependency Reason

This story provides the configuration for the timeout logic within the Rider Allocation and Route Optimization feature. The allocation service must be able to consume this configuration.

## 6.2.0.0 Technical Dependencies

- Admin Web Dashboard (React.js)
- Backend configuration service/endpoint (Node.js/NestJS)
- Central configuration store (PostgreSQL or similar)
- Low-latency cache for operational values (Redis)
- Audit logging service (`REQ-NFR-008`)

## 6.3.0.0 Data Dependencies

- A default value for this setting must be seeded into the configuration database upon system setup (e.g., 60 seconds).

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API call to update the setting should complete in under 500ms (P95).
- The Rider Logistics service must be able to fetch this configuration value with minimal latency (<10ms), suggesting the use of a cache (e.g., Redis) that is updated upon change.

## 7.2.0.0 Security

- The API endpoint for updating this setting must be protected by Role-Based Access Control (RBAC), accessible only to users with the 'Administrator' role.
- All changes to this value must be logged in an immutable audit trail as per REQ-NFR-008, capturing who made the change, what was changed (old and new values), and when.

## 7.3.0.0 Usability

- The setting should be easy to find within the admin dashboard.
- The purpose of the setting and the unit of measurement (seconds) must be explicitly clear to the user.

## 7.4.0.0 Accessibility

- The interface must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The admin dashboard must be functional on all modern web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Low

## 8.2.0.0 Complexity Factors

- Frontend work is a simple form field.
- Backend requires a standard CRUD endpoint with validation.
- The main consideration is ensuring the Rider Logistics microservice is architected to consume this configuration dynamically rather than using a hardcoded value. This may involve updating its startup logic or implementing a mechanism to refresh its configuration from the central store/cache.

## 8.3.0.0 Technical Risks

- Risk of configuration propagation delay. If the Rider Logistics service does not pick up the new value immediately, there could be a temporary inconsistency. A pub/sub mechanism (e.g., SNS) could be used to notify services of configuration changes to mitigate this.

## 8.4.0.0 Integration Points

- Admin Dashboard -> Configuration Service API (for writing the value).
- Rider Logistics Service -> Configuration Service/Cache (for reading the value).

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Verify an admin can update the value successfully.
- Verify all validation rules (numeric, range, required) prevent invalid updates.
- Verify a non-admin user cannot access the API endpoint.
- Verify the Rider Logistics service uses the default value if none is set.
- Verify that after an update, the Rider Logistics service uses the new timeout value for the next rider allocation.
- Verify the audit log is correctly written after a successful update.

## 9.3.0.0 Test Data Needs

- An admin user account.
- A non-admin user account.
- A set of valid and invalid values for the time limit.

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for frontend unit tests.
- Jest for backend unit/integration tests.
- Cypress for E2E tests.
- Postman/Insomnia for API-level testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >80% coverage
- E2E test scenario for the happy path is automated and passing
- User interface reviewed for usability and accessibility compliance
- Security requirements (RBAC, audit logging) are implemented and verified
- Technical documentation for the new configuration setting and API endpoint is created/updated
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

3

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational setting for delivery operations. It should be prioritized early in the development of the Rider Logistics and Admin features.
- The team implementing the Rider Logistics service needs to be aware of this story to ensure they build their timeout logic to be configurable from the start.

## 11.4.0.0 Release Impact

- This feature is critical for the initial platform launch to allow operational tuning. It should be included in the first release (MVP).

