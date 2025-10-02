# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | ADM-012 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Admin Configures Custom Commission Rate for Vendor... |
| As A User Story | As an Administrator, I want to configure custom co... |
| User Persona | Platform Administrator responsible for business op... |
| Business Value | Enables strategic pricing and partnerships by allo... |
| Functional Area | Administration > Financial Management |
| Story Theme | Platform Monetization and Configuration |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Admin sets a custom commission rate for a specific vendor

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

The Administrator is logged into the admin dashboard and is on the 'Commission Management' page

### 3.1.5 When

The Administrator selects the 'Vendor' option, searches for and selects a specific vendor, enters a valid commission rate (e.g., '10.5%'), and saves the configuration

### 3.1.6 Then

The system saves the custom rate for that vendor, a success message is displayed, and the new custom rate appears in the list of commission overrides.

### 3.1.7 Validation Notes

Verify the new rate is stored correctly in the database, associated with the correct vendor ID. Verify the action is logged in the audit trail.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Admin sets a custom commission rate for an entire vendor category

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

The Administrator is on the 'Commission Management' page

### 3.2.5 When

The Administrator selects the 'Category' option, selects a vendor category from a dropdown (e.g., 'Restaurants'), enters a valid commission rate (e.g., '12%'), and saves the configuration

### 3.2.6 Then

The system saves the custom rate for that category, a success message is displayed, and the new rate appears in the list of commission overrides.

### 3.2.7 Validation Notes

Verify the new rate is stored correctly in the database, associated with the correct category ID.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

System correctly applies the commission hierarchy for an order

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

The default commission is 15%, the 'Restaurants' category commission is 12%, and 'Vendor A' (a restaurant) has a specific commission of 10%

### 3.3.5 When

A new order is placed with 'Vendor A'

### 3.3.6 Then

The financial module must calculate the platform's commission for that order using the 10% rate.

### 3.3.7 Validation Notes

Check the financial transaction record for the order to confirm the commission was calculated with the vendor-specific rate.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Admin edits an existing custom commission rate

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

A custom commission rate of 10% exists for 'Vendor A'

### 3.4.5 When

The Administrator edits this entry and changes the rate to 11% and saves

### 3.4.6 Then

The system updates the rate for 'Vendor A' to 11%, and all subsequent new orders for 'Vendor A' use the 11% rate.

### 3.4.7 Validation Notes

Verify the database record is updated. Confirm that orders placed before the change are unaffected.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Admin deletes a custom commission rate, reverting to the next level

### 3.5.3 Scenario Type

Happy_Path

### 3.5.4 Given

The default commission is 15%, the 'Restaurants' category commission is 12%, and 'Vendor A' has a specific commission of 10%

### 3.5.5 When

The Administrator deletes the custom rate for 'Vendor A'

### 3.5.6 Then

The system removes the vendor-specific rate, and subsequent new orders for 'Vendor A' use the 'Restaurants' category rate of 12%.

### 3.5.7 Validation Notes

Verify the vendor-specific override is removed from the database. Place a new test order to confirm the category rate is now being applied.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Admin attempts to save an invalid commission rate

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

The Administrator is creating or editing a custom commission rate

### 3.6.5 When

The Administrator enters an invalid value (e.g., '-5', 'abc', '101') and attempts to save

### 3.6.6 Then

The system must display a clear validation error message (e.g., 'Rate must be a number between 0 and 100') and prevent the form from being submitted.

### 3.6.7 Validation Notes

Test with multiple invalid data types: negative numbers, non-numeric strings, and values over 100.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Commission rate changes do not affect in-progress or completed orders

### 3.7.3 Scenario Type

Edge_Case

### 3.7.4 Given

An order for 'Vendor A' was placed and completed when their commission rate was 10%

### 3.7.5 When

The Administrator changes the commission rate for 'Vendor A' to 12%

### 3.7.6 Then

The financial records for the completed order must remain unchanged, reflecting the 10% commission rate that was active at the time of order placement.

### 3.7.7 Validation Notes

Query the financial ledger for the old order and confirm its commission data has not been altered by the configuration change.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A dedicated 'Commission Management' section in the Admin Dashboard.
- A non-editable field displaying the current global default commission rate.
- A table listing all existing custom commission rates, with columns for 'Type' (Vendor/Category), 'Name', 'Rate (%)', and 'Last Updated'.
- A 'Create New Override' button.
- A form/modal for creating/editing an override containing a radio button/toggle to select 'Vendor' or 'Category'.
- An autocomplete search input for selecting a vendor.
- A dropdown menu for selecting a vendor category.
- A numeric input field for the commission percentage, with input validation.
- 'Save', 'Cancel', 'Edit', and 'Delete' buttons with a confirmation dialog for deletion.

## 4.2.0 User Interactions

- Admin can filter or search the list of existing overrides.
- The form prevents saving if required fields (type, entity, rate) are empty.
- Real-time validation on the percentage input field provides immediate feedback on invalid entries.

## 4.3.0 Display Requirements

- The commission hierarchy should be explained with a help tooltip: 'Vendor-specific rates override category rates, which override the global default rate.'

## 4.4.0 Accessibility Needs

- All form fields must have associated labels.
- The interface must be navigable using a keyboard.
- Compliant with WCAG 2.1 Level AA standards.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-COM-HIERARCHY

### 5.1.2 Rule Description

Commission rates must be applied in a specific order of precedence: 1. Vendor-specific rate, 2. Vendor Category rate, 3. Global default rate.

### 5.1.3 Enforcement Point

During order processing within the Payments & Settlements microservice, when calculating the platform fee.

### 5.1.4 Violation Handling

The logic must strictly follow the hierarchy. A failure to find a rate at any level should correctly fall back to the next level.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-COM-AUDIT

### 5.2.2 Rule Description

Any creation, modification, or deletion of a commission rate is a financially significant event and must be logged in an immutable audit trail.

### 5.2.3 Enforcement Point

At the API level whenever a commission override record is changed.

### 5.2.4 Violation Handling

The transaction to change the rate must fail if the audit log entry cannot be created.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

ADM-011

#### 6.1.1.2 Dependency Reason

The concept of a 'default' commission rate must exist before custom 'overrides' can be created.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

VND-008

#### 6.1.2.2 Dependency Reason

The system must support vendor categories to allow setting category-level commission rates.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

REQ-FUN-021

#### 6.1.3.2 Dependency Reason

The Financial Management service must be designed to incorporate this commission hierarchy logic into its calculation engine.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

ADM-021

#### 6.1.4.2 Dependency Reason

The audit trail functionality must be available to log these financially sensitive changes.

## 6.2.0.0 Technical Dependencies

- Admin Dashboard frontend framework (React.js).
- Backend API endpoint for CRUD operations on commission overrides.
- Payments & Settlements microservice.

## 6.3.0.0 Data Dependencies

- Access to the list of all vendors and vendor categories.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The commission rate lookup during order processing must add less than 10ms to the transaction time.
- The admin dashboard page for managing commissions should load in under 2 seconds with up to 1,000 override rules.

## 7.2.0.0 Security

- Access to this functionality must be strictly restricted to the 'Administrator' user role via RBAC.
- All changes must be logged in the audit trail as per REQ-USR-001 and REQ-NFR-008.

## 7.3.0.0 Usability

- The interface should make it clear and unambiguous which rate will apply to a vendor, potentially showing the 'effective rate' on the vendor's profile page for admins.

## 7.4.0.0 Accessibility

- Must adhere to WCAG 2.1 Level AA.

## 7.5.0.0 Compatibility

- The admin dashboard must be fully functional on the latest versions of Chrome, Firefox, and Safari.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires changes across multiple microservices (e.g., a service managing vendor data and the Payments service).
- The commission calculation logic in the financial service becomes more complex and requires robust testing.
- Database schema changes are required to store the override rules.
- Ensuring data consistency if a vendor or category is deleted.

## 8.3.0.0 Technical Risks

- Risk of incorrect commission calculation if the hierarchy logic is flawed, leading to financial discrepancies.
- Potential for performance degradation in the order processing pipeline if the rate lookup is not optimized.

## 8.4.0.0 Integration Points

- Vendor & Catalog Service: To store and manage the override rules.
- Payments & Settlements Service: To query and apply the correct commission rate during financial processing.
- Admin Backend API: To expose CRUD endpoints for the admin dashboard.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- Verify a vendor-specific rate overrides both category and default rates.
- Verify a category rate overrides the default rate when no vendor-specific rate exists.
- Verify the default rate is used when no overrides are present.
- Verify deleting a vendor-specific rate causes a fallback to the category rate.
- Verify deleting a category rate causes a fallback to the default rate.
- Test E2E flow: Admin sets rate -> Customer places order -> Admin verifies correct commission in financial reports.

## 9.3.0.0 Test Data Needs

- A set of test vendors assigned to different categories.
- A global default commission rate.
- Pre-configured custom rates for specific test vendors and categories.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- Cypress for E2E tests.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one other engineer
- Unit and integration tests implemented with >80% coverage for the new logic
- E2E test scenario for the commission hierarchy is automated and passing
- User interface reviewed and approved by a UX designer or Product Owner
- Performance impact on order processing is measured and within acceptable limits (<10ms overhead)
- Security requirements (RBAC, audit logging) are validated
- Technical documentation for the commission hierarchy logic is created or updated
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational business feature required for flexible vendor onboarding.
- Ensure prerequisite stories, especially the design of the financial service, are completed before starting development.

## 11.4.0.0 Release Impact

- This feature is critical for launching in a competitive market where custom deals are common. It should be part of an early release after the core MVP.

