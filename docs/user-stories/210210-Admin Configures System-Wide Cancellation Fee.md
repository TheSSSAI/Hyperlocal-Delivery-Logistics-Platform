# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | ADM-010 |
| Elaboration Date | 2024-05-22 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Admin Configures System-Wide Cancellation Fee |
| As A User Story | As an Administrator, I want to view, set, and upda... |
| User Persona | Platform Administrator responsible for managing sy... |
| Business Value | Provides the business with direct control over a k... |
| Functional Area | Administrative Backend - Financial Management |
| Story Theme | Business Rule Configuration |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Successfully update the cancellation fee with a valid positive value

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

The Administrator is logged in and is on the 'Business Rules' configuration page of the admin dashboard

### 3.1.5 When

They enter a valid positive numerical value (e.g., '75') into the 'Cancellation Fee' input field and click 'Save'

### 3.1.6 Then

The system saves the new value, a success message 'Cancellation fee updated successfully' is displayed, and the input field now shows '75' as the current fee.

### 3.1.7 Validation Notes

Verify the value is updated in the configuration database. Verify the success toast/message appears. The new value should be immediately reflected on the page.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Successfully set the cancellation fee to zero

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

The Administrator is on the 'Business Rules' configuration page

### 3.2.5 When

They enter '0' into the 'Cancellation Fee' input field and click 'Save'

### 3.2.6 Then

The system saves the value '0', a success message is displayed, and the input field shows '0' as the current fee.

### 3.2.7 Validation Notes

This confirms that setting the fee to zero (e.g., for a promotion) is a valid business operation.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Attempt to save a non-numeric value

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

The Administrator is on the 'Business Rules' configuration page

### 3.3.5 When

They enter non-numeric text (e.g., 'fifty') into the 'Cancellation Fee' input field and click 'Save'

### 3.3.6 Then

The system rejects the change, does not update the value, and displays an inline validation error message, such as 'Please enter a valid number.'

### 3.3.7 Validation Notes

The save button click should trigger client-side and server-side validation. The database value should remain unchanged.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Attempt to save a negative value

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

The Administrator is on the 'Business Rules' configuration page

### 3.4.5 When

They enter a negative number (e.g., '-20') into the 'Cancellation Fee' input field and click 'Save'

### 3.4.6 Then

The system rejects the change and displays an inline validation error message, such as 'Value cannot be negative.'

### 3.4.7 Validation Notes

Verify that both client-side and server-side validation prevent negative numbers.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Attempt to save an empty value

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

The Administrator is on the 'Business Rules' configuration page and the fee field has a value

### 3.5.5 When

They clear the 'Cancellation Fee' input field and click 'Save'

### 3.5.6 Then

The system rejects the change and displays an inline validation error message, such as 'This field is required.'

### 3.5.7 Validation Notes

The system should not allow a null or empty value for this configuration.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Verify the configuration change is logged in the audit trail

### 3.6.3 Scenario Type

Happy_Path

### 3.6.4 Given

The Administrator has successfully updated the cancellation fee from '50' to '75'

### 3.6.5 When

Another authorized Administrator views the system's audit trail

### 3.6.6 Then

A new log entry is present containing the timestamp, the acting admin's ID, the action ('CONFIG_UPDATE'), the parameter changed ('cancellationFee'), the old value ('50'), and the new value ('75').

### 3.6.7 Validation Notes

Check the audit log table/service to confirm the entry was created as specified. This is a critical security and compliance requirement (REQ-USR-001, REQ-NFR-008).

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Verify the system uses the newly configured fee

### 3.7.3 Scenario Type

Integration

### 3.7.4 Given

The cancellation fee is set to '75'

### 3.7.5 And

A customer places an order and a rider is subsequently assigned

### 3.7.6 When

The customer cancels the order after the rider assignment

### 3.7.7 Then

The system's order cancellation logic correctly applies a cancellation fee of ₹75 to the customer's transaction.

### 3.7.8 Validation Notes

This is an integration test scenario to be performed after this story and the cancellation logic story (CUS-035) are complete.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A clearly labeled text input field for the 'Cancellation Fee' within the Admin Dashboard, likely under a 'Financial Settings' or 'Business Rules' section.
- A 'Save' or 'Update' button to submit the change.
- A currency symbol (₹) displayed next to the input field.
- Help text below the input: 'This fee is applied when a customer cancels after a rider has been assigned.'
- Toast/notification component for success or error feedback.

## 4.2.0 User Interactions

- Admin can type a numerical value into the input field.
- The 'Save' button becomes active only when a change is made to the value.
- On save, the button shows a loading state and then provides feedback (success/error).
- Validation errors appear inline, next to the input field.

## 4.3.0 Display Requirements

- The current system-wide cancellation fee must be loaded and displayed in the input field when the page loads.
- All monetary values should be displayed with two decimal places.

## 4.4.0 Accessibility Needs

- The input field must have a proper `<label>` tag for screen readers.
- Validation messages must be associated with the input field using `aria-describedby`.
- All interactive elements must be keyboard-navigable.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-ADM-010-01

### 5.1.2 Rule Description

The cancellation fee must be a non-negative numerical value.

### 5.1.3 Enforcement Point

Client-side validation on form submission and server-side validation at the API endpoint.

### 5.1.4 Violation Handling

The update request is rejected, and a user-friendly error message is displayed.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-ADM-010-02

### 5.2.2 Rule Description

Any change to the cancellation fee must be recorded in the administrative audit trail.

### 5.2.3 Enforcement Point

Backend service layer after a successful validation and before committing the database transaction.

### 5.2.4 Violation Handling

If the audit log fails, the entire transaction should be rolled back to ensure data integrity.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

ADM-005

#### 6.1.1.2 Dependency Reason

Requires the basic Admin Dashboard and authentication to be in place to host the configuration UI.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

CUS-035

#### 6.1.2.2 Dependency Reason

The cancellation logic must exist to consume this configurable value. This story provides the configuration, while CUS-035 applies it.

## 6.2.0.0 Technical Dependencies

- A configuration management service or database table to persist the setting.
- The central audit logging service/module.
- A caching mechanism (e.g., Redis) to store the value for fast retrieval by the Order service. The update logic must invalidate this cache.

## 6.3.0.0 Data Dependencies

*No items available*

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API endpoint to update the fee should respond in under 500ms.
- Reading the configuration value by other services should be highly performant (<10ms), implying the use of a cache.

## 7.2.0.0 Security

- The API endpoint for updating this setting must be protected and only accessible by users with the 'Administrator' role (RBAC).
- All input must be sanitized on the backend to prevent injection attacks (e.g., XSS).
- The audit log entry is immutable.

## 7.3.0.0 Usability

- The setting should be easy to find within the admin dashboard.
- Feedback on the success or failure of the update must be immediate and clear.

## 7.4.0.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The admin dashboard interface must be responsive and function correctly on all modern web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Low

## 8.2.0.0 Complexity Factors

- Involves a simple UI form, a single API endpoint, and a database update.
- Integration with the audit log service is required but should be a standard pattern.
- Cache invalidation logic needs to be implemented correctly.

## 8.3.0.0 Technical Risks

- Risk of cache-coherency issues if the cache is not properly invalidated upon update, leading to the Order service using a stale fee value.
- Failure to log the action in the audit trail would be a compliance violation.

## 8.4.0.0 Integration Points

- Admin Backend API: A `PUT /api/v1/admin/configuration/cancellation-fee` endpoint.
- Database: A `configurations` table to store the key-value pair.
- Audit Service: A call to `auditService.log()` with the required parameters.
- Caching Service (Redis): `SET` the new value and `DEL` or `UPDATE` the cache key on successful update.
- Order Management Service: This service will read the configuration value (from cache or DB) when processing a cancellation.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Verify all acceptance criteria through automated and manual tests.
- Test the API endpoint directly with valid and invalid payloads.
- Test the role-based access control to ensure non-admins cannot access the endpoint.
- Test the full end-to-end flow: Admin updates fee -> Customer cancels late -> Correct fee is charged.

## 9.3.0.0 Test Data Needs

- Admin user credentials.
- An existing order with an assigned rider to test the cancellation flow.

## 9.4.0.0 Testing Tools

- Jest for frontend and backend unit tests.
- Cypress for end-to-end testing.
- Postman or similar for direct API testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one other engineer
- Unit and integration tests implemented with >80% code coverage
- End-to-end test scenario is automated and passing
- The action is correctly logged in the audit trail
- Cache invalidation logic is implemented and verified
- Security requirements (RBAC, input sanitization) are validated
- UI is responsive and meets accessibility standards
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

2

## 11.2.0.0 Priority

🟡 Medium

## 11.3.0.0 Sprint Considerations

- This story should be prioritized after the core admin login and dashboard UI is available.
- It is a dependency for fully testing the business logic of the 'Customer Cancels Order with a Fee' (CUS-035) story.

## 11.4.0.0 Release Impact

Enables a key business control. The platform can launch with a hardcoded default, but this feature is necessary for post-launch operational management.

