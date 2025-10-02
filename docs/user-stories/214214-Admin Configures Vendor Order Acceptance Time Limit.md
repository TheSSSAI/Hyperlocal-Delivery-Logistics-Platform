# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | ADM-014 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Admin Configures Vendor Order Acceptance Time Limi... |
| As A User Story | As an Administrator, I want to configure a system-... |
| User Persona | Platform Administrator responsible for setting ope... |
| Business Value | Improves customer satisfaction by preventing order... |
| Functional Area | Platform Administration |
| Story Theme | Business Rule Configuration |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Admin successfully updates the time limit

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am an Administrator logged into the admin dashboard and viewing the 'Order Management Settings' page

### 3.1.5 When

I enter a new valid integer '7' into the 'Vendor Order Acceptance Time Limit' field and click 'Save'

### 3.1.6 Then

The system displays a success notification, such as 'Settings updated successfully.'

### 3.1.7 Validation Notes

Verify that the new value '7' is persisted and displayed correctly after a page refresh. Check the database to confirm the configuration value has been updated.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

System uses the new time limit to auto-cancel an order

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

The 'Vendor Order Acceptance Time Limit' is configured to '3' minutes, and a new order is in the 'Pending Vendor Acceptance' state

### 3.2.5 When

3 minutes and 1 second pass without the vendor accepting or rejecting the order

### 3.2.6 Then

The system must automatically change the order status to 'Cancelled'

### 3.2.7 Validation Notes

Verify the order status in the database. Check that an event is logged in the order's event log indicating an automatic rejection as per REQ-FUN-010. Confirm that a cancellation notification is queued for the customer.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Admin attempts to save an invalid value

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

I am an Administrator on the 'Order Management Settings' page

### 3.3.5 When

I enter a non-positive integer like '-5' or a non-numeric value like 'abc' into the time limit field and click 'Save'

### 3.3.6 Then

The system must display an inline validation error message, such as 'Value must be a positive whole number.'

### 3.3.7 Validation Notes

Confirm that the invalid value is not saved and the previously stored value remains unchanged in the database.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

System displays the default time limit on a new deployment

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

The platform is newly deployed and an administrator has not yet configured this setting

### 3.4.5 When

An Administrator navigates to the 'Order Management Settings' page for the first time

### 3.4.6 Then

The input field for the time limit must display the system default value of '5' minutes, as specified in REQ-FUN-010.

### 3.4.7 Validation Notes

Check the UI to ensure '5' is pre-populated in the input field.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Configuration change is recorded in the audit trail

### 3.5.3 Scenario Type

Happy_Path

### 3.5.4 Given

An Administrator has successfully changed the 'Vendor Order Acceptance Time Limit' from '5' to '7'

### 3.5.5 When

Another Administrator with appropriate permissions views the system audit trail

### 3.5.6 Then

A new log entry must exist detailing the change, including the timestamp, the administrator who made the change, the setting that was changed ('Vendor Order Acceptance Time Limit'), the old value ('5'), and the new value ('7').

### 3.5.7 Validation Notes

Query the audit log table/service to verify the presence and accuracy of this specific log entry.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A dedicated section in the Admin Dashboard, e.g., 'Settings > Order Management'.
- A clearly labeled numerical input field: 'Vendor Order Acceptance Time Limit (minutes)'.
- A 'Save' or 'Update' button.
- Helper text below the input field explaining its purpose: 'Time in minutes a vendor has to accept/reject an order before it is automatically cancelled. Default: 5.'

## 4.2.0 User Interactions

- The 'Save' button should be disabled until a change is made to the input field.
- Upon successful save, a non-intrusive success notification (e.g., a toast message) should appear and then fade out.
- Input validation errors should appear inline, next to the input field, upon attempting to save an invalid value.

## 4.3.0 Display Requirements

- The current saved value must always be displayed in the input field upon page load.

## 4.4.0 Accessibility Needs

- The input field must have an associated `<label>` for screen reader compatibility.
- Validation error messages must be programmatically linked to the input field using `aria-describedby`.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-ADM-014-01

### 5.1.2 Rule Description

The time limit must be a positive integer, representing minutes.

### 5.1.3 Enforcement Point

Frontend UI validation and Backend API validation upon save.

### 5.1.4 Violation Handling

The save operation is rejected, and an error message is returned to the user.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-ADM-014-02

### 5.2.2 Rule Description

A system-wide default of 5 minutes must be used if no value is explicitly configured.

### 5.2.3 Enforcement Point

Order Management Service when initiating the acceptance timer for a new order.

### 5.2.4 Violation Handling

Not applicable; this is a fallback rule.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

SYS-001

#### 6.1.1.2 Dependency Reason

This story provides the UI to configure the time limit, while SYS-001 implements the backend logic that consumes this value to auto-reject orders. They are functionally codependent and should be developed together.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-021

#### 6.1.2.2 Dependency Reason

The audit trail system must be in place to log the configuration changes made in this story, as required by AC-005.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

REQ-USR-001

#### 6.1.3.2 Dependency Reason

The core Administrator role and permission model must be defined to restrict access to this setting.

## 6.2.0.0 Technical Dependencies

- Admin Dashboard application shell and navigation.
- A backend configuration service or database table to store the setting.
- The Order Management microservice, which contains the order state machine.
- A background job scheduler (e.g., cron, SQS with delay) for the timer mechanism.

## 6.3.0.0 Data Dependencies

- Requires an authenticated Administrator user session to access the feature.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API call to save the setting must have a P95 latency of under 500ms.
- The background job that checks for expired orders must be optimized to handle thousands of concurrent orders without causing significant database load.

## 7.2.0.0 Security

- Access to the configuration page and API endpoint must be strictly limited to users with the 'Administrator' role (RBAC).
- All changes must be logged in an immutable audit trail as per REQ-NFR-008.

## 7.3.0.0 Usability

- The setting should be easy to find within the admin dashboard.
- The purpose of the setting and its impact should be clearly explained via helper text.

## 7.4.0.0 Accessibility

- The configuration form must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The admin dashboard interface must be responsive and function correctly on all modern web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- The frontend work is 'Low' complexity (a simple form).
- The backend work is 'Medium' complexity due to the need for a robust, scalable, and efficient background job to process order expirations accurately and without performance degradation.
- Requires careful indexing on the orders table (e.g., on `status` and `created_at`) to ensure the background query is performant.

## 8.3.0.0 Technical Risks

- A poorly implemented background job could cause high database CPU usage or locking issues, impacting overall platform performance.
- Potential for race conditions if a vendor accepts an order at the exact moment the system is cancelling it. The cancellation logic must be atomic.

## 8.4.0.0 Integration Points

- Admin Frontend -> Backend Configuration API
- Order Management Service <- Backend Configuration Store
- Background Job Processor -> Order Management Service (to trigger cancellation)

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- Verify an admin can update the value.
- Verify an admin cannot save an invalid value.
- Verify a non-admin user cannot access the page/API.
- End-to-end test: Set a short time limit (e.g., 1 minute), create a new order, wait for the time to elapse, and verify the order is automatically cancelled and the customer is notified.

## 9.3.0.0 Test Data Needs

- An active Administrator user account.
- An active Vendor and Customer account to create test orders.

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for frontend unit tests.
- Cypress for end-to-end testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit test coverage for new code is at or above 80%.
- An automated E2E test for the auto-cancellation flow has been created and is passing.
- The configuration change is successfully logged in the audit trail.
- UI meets WCAG 2.1 Level AA accessibility standards.
- Documentation for the new setting is added to the administrator's knowledge base.
- Story has been deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is tightly coupled with SYS-001 ('System Auto-Rejects Unattended Vendor Orders'). They should be planned and delivered in the same sprint to provide complete business value.
- This is a foundational business rule critical for customer experience and should be prioritized early in the development lifecycle.

## 11.4.0.0 Release Impact

- This feature is a core operational control for the platform. Its release is necessary before onboarding a significant number of vendors to ensure service quality.

