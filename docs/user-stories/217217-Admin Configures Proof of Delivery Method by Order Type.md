# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | ADM-017 |
| Elaboration Date | 2025-01-26 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Admin Configures Proof of Delivery Method by Order... |
| As A User Story | As an Administrator, I want to configure the requi... |
| User Persona | Platform Administrator responsible for operational... |
| Business Value | Provides operational flexibility to balance securi... |
| Functional Area | Platform Administration & Settings |
| Story Theme | Operational Configuration Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Admin can view and modify POD settings

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

an Administrator is logged into the admin dashboard and has the necessary permissions

### 3.1.5 When

the Administrator navigates to the 'Operational Settings > Delivery Configuration' page

### 3.1.6 Then

the page displays separate configuration options for 'Prepaid Orders' and 'Cash on Delivery (COD) Orders'

### 3.1.7 Validation Notes

Verify that the UI renders correctly and shows the current saved settings for both order types.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Admin configures OTP for COD orders and saves changes

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

the Administrator is on the 'Delivery Configuration' page

### 3.2.5 When

they select 'Customer OTP' as the POD method for 'Cash on Delivery (COD) Orders' and click 'Save'

### 3.2.6 Then

a success notification is displayed, and the new setting is persisted in the system

### 3.2.7 Validation Notes

Check the database or a settings API endpoint to confirm the configuration value has been updated. The 'Save' button should only be enabled after a change is made.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Admin configures Photo Capture for Prepaid orders and saves changes

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

the Administrator is on the 'Delivery Configuration' page

### 3.3.5 When

they select 'Photo Capture' as the POD method for 'Prepaid Orders' and click 'Save'

### 3.3.6 Then

a success notification is displayed, and the new setting is persisted in the system

### 3.3.7 Validation Notes

Check the database or a settings API endpoint to confirm the configuration value has been updated.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Rider app enforces OTP for a COD order

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

the POD method for COD orders is configured as 'Customer OTP'

### 3.4.5 And

the option to capture a photo must not be presented.

### 3.4.6 When

the Rider marks the order as 'Arrived at Destination' and proceeds to complete the delivery

### 3.4.7 Then

the Rider application must prompt the rider to enter the 4-digit customer OTP

### 3.4.8 Validation Notes

E2E Test: Configure setting, create a COD order, and complete the delivery flow with a rider account.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Rider app enforces Photo Capture for a Prepaid order

### 3.5.3 Scenario Type

Happy_Path

### 3.5.4 Given

the POD method for Prepaid orders is configured as 'Photo Capture'

### 3.5.5 And

the option to enter an OTP must not be presented.

### 3.5.6 When

the Rider marks the order as 'Arrived at Destination' and proceeds to complete the delivery

### 3.5.7 Then

the Rider application must prompt the rider to capture a photo

### 3.5.8 Validation Notes

E2E Test: Configure setting, create a Prepaid order, and complete the delivery flow with a rider account.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

System uses default settings if none are configured

### 3.6.3 Scenario Type

Edge_Case

### 3.6.4 Given

no POD settings have ever been explicitly saved by an administrator

### 3.6.5 When

a new order is created

### 3.6.6 Then

the system must apply a default POD method of 'Photo Capture' for Prepaid orders and 'Customer OTP' for COD orders.

### 3.6.7 Validation Notes

Verify this default behavior in a clean environment or by clearing the settings. This ensures the system is never in an undefined state.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Non-admin user attempts to access the configuration page

### 3.7.3 Scenario Type

Error_Condition

### 3.7.4 Given

a user with a 'Vendor' or 'Rider' role is logged in

### 3.7.5 When

they attempt to access the URL for the 'Delivery Configuration' page

### 3.7.6 Then

the system must deny access and show a '403 Forbidden' or 'Permission Denied' error.

### 3.7.7 Validation Notes

Test that the backend API endpoint and frontend route are properly protected by the Administrator role.

## 3.8.0 Criteria Id

### 3.8.1 Criteria Id

AC-008

### 3.8.2 Scenario

Configuration changes are logged in the audit trail

### 3.8.3 Scenario Type

Happy_Path

### 3.8.4 Given

an Administrator is on the 'Delivery Configuration' page

### 3.8.5 When

they change the POD method for any order type and save it

### 3.8.6 Then

a new entry must be created in the admin audit trail

### 3.8.7 And

the entry must include the administrator's ID, the setting that was changed (e.g., 'pod_method_cod'), the old value, the new value, and a timestamp.

### 3.8.8 Validation Notes

Requires dependency on ADM-021. Verify the audit log table after making a change.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A dedicated section in the Admin Dashboard, e.g., 'Settings > Delivery Configuration'.
- Two distinct sub-sections labeled 'Prepaid Orders' and 'Cash on Delivery (COD) Orders'.
- For each sub-section, a set of radio buttons or a dropdown menu with options: 'Photo Capture', 'Customer OTP'.
- A 'Save Changes' button, which should be disabled by default and enabled only when a change is made.
- Success/Error toast notifications for save operations.

## 4.2.0 User Interactions

- Admin selects a POD method for each order type.
- Admin clicks 'Save Changes' to persist the configuration.
- The UI should clearly indicate the currently selected option for each order type.

## 4.3.0 Display Requirements

- The page must clearly display the current saved configuration upon loading.
- Help text or tooltips explaining what each POD method entails can be included for clarity.

## 4.4.0 Accessibility Needs

- All form elements (radio buttons, dropdowns) must have associated labels.
- The page must be navigable using a keyboard.
- Compliant with WCAG 2.1 Level AA standards as per REQ-INT-001.

# 5.0.0 Business Rules

- {'rule_id': 'BR-POD-001', 'rule_description': "The Proof of Delivery method is determined by the order's payment type (Prepaid or COD) based on the global administrative setting.", 'enforcement_point': 'Backend (Order Service) when providing delivery task details to the Rider application.', 'violation_handling': 'Not applicable; this is a configuration rule. The system must always have a valid (default or admin-set) configuration.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-022

#### 6.1.1.2 Dependency Reason

The core functionality for a rider to capture a photo as POD must be implemented in the rider app.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

RDR-023

#### 6.1.2.2 Dependency Reason

The core functionality for a rider to enter a customer OTP as POD must be implemented in the rider app.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

CUS-040

#### 6.1.3.2 Dependency Reason

The customer application must display the OTP for the rider to use.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

ADM-021

#### 6.1.4.2 Dependency Reason

The audit trail system must be in place to log any changes to this configuration.

## 6.2.0.0 Technical Dependencies

- A backend configuration service or database table to store platform-wide settings.
- An authenticated and authorized API endpoint for administrators to update these settings.
- The Order Management service must be able to read these settings to enrich the delivery task data sent to the rider app.

## 6.3.0.0 Data Dependencies

- Order data must clearly distinguish between 'Prepaid' and 'COD' payment types.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API call to save the configuration must respond in under 500ms.
- Reading the configuration must not add any noticeable latency to the order processing or rider task assignment flow.

## 7.2.0.0 Security

- The API endpoint for modifying these settings must be protected and accessible only by users with the 'Administrator' role.
- All changes must be logged in an immutable audit trail as per REQ-NFR-008.

## 7.3.0.0 Usability

- The settings page should be intuitive and clearly explain the impact of each choice.

## 7.4.0.0 Accessibility

- The admin dashboard interface must adhere to WCAG 2.1 Level AA guidelines.

## 7.5.0.0 Compatibility

- The admin dashboard must be responsive and function correctly on all modern web browsers.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Cross-component impact: Requires changes in the Admin Dashboard (UI), Backend (API, config service, order logic), and Rider Mobile App (conditional UI).
- Requires robust E2E testing to ensure the configuration is correctly enforced in the field.
- Migration/Default state: The system must handle the state where no configuration has been set by defaulting to secure values.

## 8.3.0.0 Technical Risks

- Risk of inconsistent behavior if the rider app does not correctly interpret the `pod_method` flag from the backend.
- Potential for caching issues where an old configuration is served to the order service.

## 8.4.0.0 Integration Points

- Admin Dashboard <-> Backend Settings API
- Backend Order Service -> Backend Settings Service/DB
- Backend Order Service -> Rider App (via delivery task API response)

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Admin sets POD for COD to OTP -> Rider delivering COD order is prompted for OTP.
- Admin sets POD for Prepaid to Photo -> Rider delivering Prepaid order is prompted for Photo.
- Admin changes setting from OTP to Photo for COD -> New COD orders now require Photo.
- A non-admin user attempts to access the settings API endpoint and is rejected.
- Verify audit log is created with correct details after a setting is changed.

## 9.3.0.0 Test Data Needs

- Admin user account.
- Test accounts for Customer and Rider.
- Ability to create both Prepaid and COD orders in the test environment.

## 9.4.0.0 Testing Tools

- Cypress for E2E testing of the admin dashboard and order flow.
- Jest/React Testing Library for frontend unit tests.
- Postman/Insomnia for API endpoint testing (including security checks).

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer for frontend, backend, and mobile components
- Unit and integration tests implemented with >80% coverage for new code
- E2E tests for both POD configuration paths are automated and passing
- UI/UX for the admin settings page has been reviewed and approved
- Role-based access control for the settings page/API is verified
- Audit trail logging is confirmed to be working correctly
- Documentation for the new configuration setting is created in the admin knowledge base
- Story deployed and verified in the staging environment by a QA engineer

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- Requires coordination between frontend, backend, and mobile developers.
- All prerequisite stories (RDR-022, RDR-023, CUS-040, ADM-021) must be completed and merged before this story can be fully tested.
- E2E testing will be critical and may require significant setup time in the test environment.

## 11.4.0.0 Release Impact

- This is a foundational feature for operational control. It should be included in the release that enables COD orders to manage risk effectively.

