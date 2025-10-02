# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | VND-027 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Vendor Manages Business License Information for Co... |
| As A User Story | As a vendor, I want to add, view, and update my bu... |
| User Persona | A registered and approved vendor using the vendor-... |
| Business Value | Ensures platform operates with legally compliant v... |
| Functional Area | Vendor Profile Management |
| Story Theme | Vendor Compliance and Onboarding |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Vendor successfully adds a new license

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in vendor on my store profile page

### 3.1.5 When

I navigate to the 'License Information' section, enter a valid license number, select a license type, and choose a future expiry date, and then click 'Save'

### 3.1.6 Then

The system saves the license information and associates it with my vendor profile, a success message is displayed, and the new license details are visible on the page. The creation event is recorded in the audit log.

### 3.1.7 Validation Notes

Verify the record is created in the `vendor_licenses` table with the correct vendor ID. Check the audit log for an entry corresponding to this action, including the new data.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Vendor successfully updates an existing license

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

I am a logged-in vendor with at least one license already saved

### 3.2.5 When

I click 'Edit' next to an existing license, change the license number and/or expiry date to valid new values, and click 'Save'

### 3.2.6 Then

The system updates the existing license record, a success message is displayed, and the updated information is reflected on the page. The update event, including old and new values, is recorded in the audit log.

### 3.2.7 Validation Notes

Verify the corresponding record in the `vendor_licenses` table is updated. Check the audit log for an entry detailing the change from the old values to the new values.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Vendor attempts to save a license with missing information

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

I am a logged-in vendor in the process of adding or editing a license

### 3.3.5 When

I attempt to save the form with the license number or expiry date field left blank

### 3.3.6 Then

The system prevents the form submission and displays a clear, inline validation error message such as 'This field is required' next to the empty field.

### 3.3.7 Validation Notes

Test by leaving each required field blank individually and then all at once. Verify no API call is made and no data is saved.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Vendor attempts to save a license with a past expiry date

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

I am a logged-in vendor in the process of adding or editing a license

### 3.4.5 When

I select an expiry date that is in the past and attempt to save

### 3.4.6 Then

The system prevents the form submission and displays a clear, inline validation error message such as 'Expiry date must be in the future'.

### 3.4.7 Validation Notes

Test with yesterday's date. The date picker UI should ideally prevent selection of past dates, but server-side validation must enforce this rule.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Vendor adds multiple different licenses

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

I am a logged-in vendor who has already added one license (e.g., FSSAI)

### 3.5.5 When

I click an 'Add another license' button and submit the form with details for a second license (e.g., GST)

### 3.5.6 Then

The system saves the second license, and both licenses are displayed in a list under the 'License Information' section.

### 3.5.7 Validation Notes

Verify that the vendor can have multiple license records associated with their profile in the database.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Administrator views vendor license information

### 3.6.3 Scenario Type

Happy_Path

### 3.6.4 Given

I am a logged-in Administrator viewing a specific vendor's profile in the admin dashboard

### 3.6.5 When

I navigate to the vendor's compliance or license section

### 3.6.6 Then

I can see all the license information (type, number, expiry date) that the vendor has provided in a read-only format.

### 3.6.7 Validation Notes

Verify that the admin role has read access to this data as per REQ-USR-001.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A dedicated 'License Information' or 'Compliance' section in the vendor profile.
- Input field for 'License Number' (Text).
- Dropdown for 'License Type' (e.g., FSSAI, GST, Drug License).
- Date picker for 'Expiry Date'.
- 'Save', 'Edit', and 'Add another license' buttons.
- Display area to list saved licenses with their details.

## 4.2.0 User Interactions

- The date picker should default to a future date and disable selection of past dates.
- Inline validation messages should appear on blur or on attempted submission with invalid data.
- After saving, the form should reset or switch to a read-only display mode, showing the saved data.

## 4.3.0 Display Requirements

- Saved licenses should be displayed in a clear list format, showing Type, Number, and Expiry Date.
- The expiry date should be displayed in a consistent, human-readable format (e.g., DD-MMM-YYYY).

## 4.4.0 Accessibility Needs

- All form fields must have associated labels.
- Validation errors must be programmatically associated with their respective inputs.
- The interface must be navigable using a keyboard.
- Complies with WCAG 2.1 Level AA standards as per REQ-INT-001.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-VND-LIC-01

### 5.1.2 Rule Description

A license expiry date must always be a future date.

### 5.1.3 Enforcement Point

Client-side form validation and server-side API validation.

### 5.1.4 Violation Handling

The submission is rejected with a user-facing error message.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-VND-LIC-02

### 5.2.2 Rule Description

All modifications (create, update) to license information must be recorded in an immutable audit log.

### 5.2.3 Enforcement Point

Backend service layer, after successful validation but before committing the database transaction.

### 5.2.4 Violation Handling

If the audit log write fails, the entire transaction should be rolled back to ensure data consistency.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

VND-005

#### 6.1.1.2 Dependency Reason

This feature is a component of the overall vendor profile management interface.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-021

#### 6.1.2.2 Dependency Reason

Requires the existence of an audit trail system to log all changes as mandated by REQ-CON-001.

## 6.2.0.0 Technical Dependencies

- Vendor & Catalog Microservice: Requires schema modification to store license data (e.g., a new `vendor_licenses` table with a foreign key to the `vendors` table).
- API Gateway: To expose the new endpoint for managing licenses.
- Audit Log Service/Module: Must be available to receive and store audit events from the Vendor service.

## 6.3.0.0 Data Dependencies

- An administrator-managed list of valid 'License Types' to populate the selection dropdown.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- API response time for saving or updating license information should be under 500ms (P95).

## 7.2.0.0 Security

- License numbers and associated data must be encrypted at rest in the database (as per REQ-CON-001).
- All API communication must be over HTTPS/TLS 1.2+ (as per REQ-INT-004).
- Access to modify license data is restricted to the owning vendor. Read access is available to Administrators (as per REQ-USR-001).

## 7.3.0.0 Usability

- The process of adding or updating a license should be intuitive and require minimal steps.
- Error messages must be clear and actionable.

## 7.4.0.0 Accessibility

- Must meet WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The vendor web dashboard must be responsive and function correctly on all modern web browsers.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Database schema design and migration for a new one-to-many relationship (vendor to licenses).
- Critical integration with the audit log service, which must be robust and transactional.
- Requires both client-side and server-side validation logic for dates and required fields.

## 8.3.0.0 Technical Risks

- Failure to correctly implement the audit log integration could lead to compliance violations.
- Inconsistent validation between the client and server could lead to a poor user experience or bad data.

## 8.4.0.0 Integration Points

- Vendor & Catalog Service API (for CRUD operations).
- Audit Log Service (for logging changes).

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- Verify a vendor can add, update, and see their license information.
- Verify form validation for all required fields and business rules (e.g., future date).
- Verify that every successful create/update action generates a corresponding, accurate entry in the audit log.
- Verify an administrator can view, but not edit, the vendor's license information.
- Verify data is encrypted in the database.

## 9.3.0.0 Test Data Needs

- Test vendor accounts with no licenses.
- Test vendor accounts with one existing license.
- A list of predefined license types for testing the dropdown.

## 9.4.0.0 Testing Tools

- Jest and React Testing Library for frontend unit tests.
- Jest for backend unit/integration tests.
- Cypress for E2E tests.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >80% coverage and passing
- E2E test scenario for adding and editing a license is automated and passing
- User interface is responsive and approved by the design/product owner
- Security requirement for data encryption at rest is verified
- Audit log integration is confirmed to be working correctly in the staging environment
- API documentation (OpenAPI) is updated for the new endpoints
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational compliance feature required for other stories like SYS-004 (License Expiry Reminders) and SYS-005 (Block Vendors with Expired Licenses).
- The availability of the audit log service is a key dependency that must be resolved before or during the sprint.

## 11.4.0.0 Release Impact

This feature is critical for onboarding any vendors that require legal licensing to operate. It is a blocker for launching in regulated categories like food or pharmaceuticals.

