# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | ADM-008 |
| Elaboration Date | 2024-05-22 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Admin Configures Cash on Delivery (COD) Order Valu... |
| As A User Story | As an Administrator, I want to set and update the ... |
| User Persona | Platform Administrator responsible for operational... |
| Business Value | Mitigates financial risk from fraudulent or failed... |
| Functional Area | Platform Administration |
| Story Theme | Financial Configuration & Risk Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

ADM-008-AC-01

### 3.1.2 Scenario

Admin successfully updates the COD limit

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

The administrator is logged into the admin dashboard and has navigated to the 'Payment Settings' page

### 3.1.5 When

The administrator enters a new, valid, positive numeric value (e.g., '3000') into the 'Maximum COD Order Value' field and clicks 'Save Changes'

### 3.1.6 Then

The system displays a success notification (e.g., 'COD limit updated successfully'), the new value ('3000') is persisted and displayed in the input field, and an entry is created in the audit log.

### 3.1.7 Validation Notes

Verify the UI updates, a success toast appears, and the database/configuration store reflects the new value. Check the audit log for a corresponding entry.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

ADM-008-AC-02

### 3.2.2 Scenario

Customer checkout reflects the updated COD limit (COD disabled)

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

The 'Maximum COD Order Value' is set to '2500'

### 3.2.5 When

A customer attempts to check out with an order total of '2501'

### 3.2.6 Then

The 'Cash on Delivery' payment option is not available for selection.

### 3.2.7 Validation Notes

This requires an E2E test. Set the limit as an admin, then impersonate a customer or use a test customer account to verify the payment options at checkout.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

ADM-008-AC-03

### 3.3.2 Scenario

Customer checkout reflects the updated COD limit (COD enabled)

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

The 'Maximum COD Order Value' is set to '2500'

### 3.3.5 When

A customer attempts to check out with an order total of '2500' or less

### 3.3.6 Then

The 'Cash on Delivery' payment option is available for selection.

### 3.3.7 Validation Notes

This requires an E2E test. Verify that for an order total equal to or less than the limit, the COD option is present and selectable.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

ADM-008-AC-04

### 3.4.2 Scenario

Admin attempts to save a non-numeric or negative value

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

The administrator is on the 'Payment Settings' page

### 3.4.5 When

The administrator enters an invalid value (e.g., 'abc', '-100') into the 'Maximum COD Order Value' field and clicks 'Save Changes'

### 3.4.6 Then

The system prevents the save action, displays an inline validation error message (e.g., 'Please enter a valid positive number'), and the existing value remains unchanged.

### 3.4.7 Validation Notes

Test with various invalid inputs like text, special characters, negative numbers, and decimals to ensure robust validation.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

ADM-008-AC-05

### 3.5.2 Scenario

Admin attempts to save an empty value

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

The administrator is on the 'Payment Settings' page

### 3.5.5 When

The administrator clears the 'Maximum COD Order Value' field and clicks 'Save Changes'

### 3.5.6 Then

The system prevents the save action and displays an inline validation error message (e.g., 'This field cannot be empty').

### 3.5.7 Validation Notes

Verify that submitting a blank form field triggers the required field validation.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

ADM-008-AC-06

### 3.6.2 Scenario

System uses default value if none is set

### 3.6.3 Scenario Type

Edge_Case

### 3.6.4 Given

The platform is newly deployed and no COD limit has been explicitly configured by an admin

### 3.6.5 When

The checkout service checks for the COD limit

### 3.6.6 Then

The system uses the default value of '2500' as specified in REQ-BR-001.

### 3.6.7 Validation Notes

This can be tested by checking the application's default configuration or by clearing the setting in the database and running the E2E test for an order of ₹2501.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A dedicated 'Payment Settings' or 'Financial Configuration' section in the Admin Dashboard.
- A clearly labeled numeric input field: 'Maximum COD Order Value (₹)'.
- A 'Save Changes' button.
- Help text below the input: 'Set the maximum order total for which COD is available. Enter 0 to disable COD completely.'
- Toast notifications for success and error messages.

## 4.2.0 User Interactions

- Admin enters a numeric value into the input field.
- The 'Save Changes' button becomes active only when the value is changed and valid.
- On save, the button is temporarily disabled to prevent double-submission.
- On successful save, a success toast appears. On failure, an error toast appears.

## 4.3.0 Display Requirements

- The current saved COD limit must be displayed in the input field upon page load.
- Currency symbol (₹) should be displayed in the label for clarity.

## 4.4.0 Accessibility Needs

- The input field must have a correctly associated `<label>` for screen readers.
- Validation and feedback messages must be programmatically associated with the input and announced by screen readers.

# 5.0.0 Business Rules

- {'rule_id': 'BR-COD-LIMIT', 'rule_description': 'The system shall enforce an administrator-configurable maximum order value for Cash on Delivery (COD) orders. This is a direct implementation of REQ-BR-001.', 'enforcement_point': 'During the customer checkout process, when payment options are being determined and displayed.', 'violation_handling': 'If the order total exceeds the configured limit, the COD payment option will not be presented to the customer.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

ADM-005

#### 6.1.1.2 Dependency Reason

Requires the core functionality for an administrator to log in and access the admin dashboard.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

CUS-022

#### 6.1.2.2 Dependency Reason

The checkout flow must exist to consume and enforce the rule set by this story. This story provides the configuration, CUS-022's implementation will use it.

## 6.2.0.0 Technical Dependencies

- A configuration management service or database table to store platform-wide settings.
- A caching layer (e.g., Redis) to provide low-latency access to this setting for the checkout service.
- The central Audit Logging service to record the change event, as per REQ-USR-001.

## 6.3.0.0 Data Dependencies

- Requires access to the current configuration value to display it to the admin.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API call to update the setting should complete in under 500ms.
- The checkout service's check against this limit must add negligible latency (<10ms), implying the value should be retrieved from a fast cache, not a direct database read per checkout.

## 7.2.0.0 Security

- The API endpoint for updating this setting must be protected and accessible only by users with the 'Administrator' role.
- All input must be sanitized to prevent injection attacks.
- The change action must be logged in an immutable audit trail, including the admin's ID, timestamp, old value, and new value, as per REQ-USR-001.

## 7.3.0.0 Usability

- The setting should be easy to find within the admin dashboard.
- Feedback on save success or failure must be immediate and clear.

## 7.4.0.0 Accessibility

- The admin dashboard interface for this feature must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The admin dashboard feature must function correctly on all supported modern web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Low

## 8.2.0.0 Complexity Factors

- Simple UI with a single input field.
- Backend logic is a straightforward CRUD operation on a configuration value.
- Requires cache invalidation logic: when the value is updated, the corresponding key in the cache (e.g., Redis) must be updated or deleted to ensure the checkout service fetches the new value.

## 8.3.0.0 Technical Risks

- Risk of cache coherency issues if the cache is not properly invalidated upon update, leading to the checkout service using a stale value.
- Failure to log the change in the audit trail would be a compliance violation.

## 8.4.0.0 Integration Points

- Admin Dashboard Frontend -> Configuration Service API (to update value).
- Configuration Service -> Audit Log Service (to log the change).
- Configuration Service -> Cache (to invalidate/update).
- Checkout Service -> Cache (to read value).

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Verify admin can update the value.
- Verify validation for non-numeric, negative, and empty inputs.
- Verify E2E flow: set limit, then as a customer, confirm payment options are correct for order totals above and below the limit.
- Verify an audit log is created with correct details upon successful update.
- Verify API endpoint is not accessible by non-admin roles.

## 9.3.0.0 Test Data Needs

- An active administrator user account.
- A test customer user account.
- Products in the catalog to create orders with varying total values.

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for frontend unit tests.
- Cypress for E2E testing.
- Postman or similar for API-level security testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written with >80% coverage and are passing.
- Automated E2E test case for the primary scenarios is created and passing.
- Security checks (role-based access) for the API endpoint are verified.
- The change is correctly logged in the audit trail.
- Performance of the checkout process is verified to be unaffected.
- Any necessary documentation for administrators has been updated.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

2

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational business rule required before enabling COD payments at scale.
- Dependent on the existence of the basic admin dashboard and checkout flow.

## 11.4.0.0 Release Impact

Enables a critical risk management feature for the platform's financial operations. Should be included in the release that formally launches COD as a payment method.

