# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | ADM-030 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Admin Views Vendor License Audit Log |
| As A User Story | As an Administrator, I want to view a detailed and... |
| User Persona | Administrator, likely in a compliance, operations,... |
| Business Value | Provides critical traceability for regulatory audi... |
| Functional Area | Platform & Administrative Features |
| Story Theme | Vendor Compliance Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Admin accesses the audit log for a vendor with existing license history

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am an administrator logged into the admin dashboard and viewing the profile of a vendor whose license information has been previously added and updated

### 3.1.5 When

I navigate to the vendor's license section and click the 'View History' or 'Audit Log' button

### 3.1.6 Then

A modal or dedicated section appears displaying the license audit log in reverse chronological order (newest first).

### 3.1.7 Validation Notes

Verify that the UI element to trigger the log view is present and functional. The log data should be fetched via a dedicated, secure API endpoint.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Audit log displays comprehensive and accurate entry details

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

I am viewing the license audit log for a vendor

### 3.2.5 When

I inspect an entry in the log

### 3.2.6 Then

The entry must clearly display the following fields: 'Timestamp' (in IST format), 'Actor' (e.g., 'Admin: John Doe', 'Vendor: Store ABC', 'System'), 'Action' (e.g., 'License Created', 'Expiry Date Updated'), 'Field Changed', 'Old Value', and 'New Value'.

### 3.2.7 Validation Notes

Check the database record for the audit log entry to ensure all fields are populated correctly and match what is displayed in the UI.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Audit log correctly records the initial creation of a license

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

A vendor's license information has just been added for the first time

### 3.3.5 When

I view the license audit log for that vendor

### 3.3.6 Then

The log contains a single entry with the 'Action' as 'License Created', the 'Old Value' for all fields is null or empty, and the 'New Value' shows the details that were just entered.

### 3.3.7 Validation Notes

This must be tested by creating a new vendor or adding license info to a vendor for the first time and immediately checking the log.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Viewing the audit log for a vendor with no license information

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

I am viewing the profile of a vendor who has never had license information entered

### 3.4.5 When

I navigate to the license section

### 3.4.6 Then

The system either disables the 'View History' button or, upon clicking, displays a clear message such as 'No license history found for this vendor.'

### 3.4.7 Validation Notes

Test with a newly created vendor account that has not completed this part of their profile.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Audit log is presented as read-only

### 3.5.3 Scenario Type

Security_Condition

### 3.5.4 Given

I am an administrator viewing the license audit log

### 3.5.5 When

I inspect the user interface of the log

### 3.5.6 Then

There are no controls (e.g., buttons, forms) to edit or delete any of the log entries.

### 3.5.7 Validation Notes

Perform a UI review and check the browser's developer tools to ensure no hidden APIs for modification exist.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Audit log API is secured

### 3.6.3 Scenario Type

Security_Condition

### 3.6.4 Given

A user with a non-Administrator role (e.g., Vendor, Rider) is authenticated

### 3.6.5 When

They attempt to call the API endpoint for fetching the vendor license audit log directly

### 3.6.6 Then

The API returns a '403 Forbidden' or '401 Unauthorized' error.

### 3.6.7 Validation Notes

Use an API testing tool like Postman or Insomnia to attempt to access the endpoint with JWTs from different user roles.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A 'View History' or 'Audit Log' button/link within the vendor's license management section.
- A modal dialog or an expandable section to display the log.
- A data table with columns: 'Timestamp', 'Actor', 'Action', 'Field Changed', 'Old Value', 'New Value'.
- Pagination controls if the log exceeds a certain number of entries (e.g., 20 per page).

## 4.2.0 User Interactions

- Admin clicks a button to reveal the audit log.
- Admin can navigate through pages of the log if pagination is present.

## 4.3.0 Display Requirements

- Log entries must be sorted in reverse chronological order.
- Timestamps must be displayed in a human-readable format and localized to the IST timezone (e.g., '27-Oct-2024 14:30 IST').
- For the 'Old Value' on creation events, display 'N/A' or leave it blank.

## 4.4.0 Accessibility Needs

- The data table must be properly structured with `<thead>`, `<tbody>`, and `<th>` scope attributes for screen reader compatibility.
- The modal for the log must be keyboard-navigable and properly manage focus.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-AUD-01

### 5.1.2 Rule Description

Every create, update, or delete operation on a vendor's license information must generate an entry in the audit log.

### 5.1.3 Enforcement Point

Application service layer responsible for vendor data persistence.

### 5.1.4 Violation Handling

The transaction that modifies the license data must fail if the corresponding audit log entry cannot be created.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-AUD-02

### 5.2.2 Rule Description

Audit log entries are immutable and cannot be altered or deleted after creation.

### 5.2.3 Enforcement Point

Database permissions and application logic. No APIs should exist for modifying log entries.

### 5.2.4 Violation Handling

N/A (Prevention through system design).

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

VND-027

#### 6.1.1.2 Dependency Reason

This story depends on the existence of a feature allowing vendors to manage their license information, as those actions need to be logged.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-XXX (Implied)

#### 6.1.2.2 Dependency Reason

Requires an admin-facing feature to create/update vendor license information. The changes made through this feature are the primary events to be logged.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

ADM-005

#### 6.1.3.2 Dependency Reason

Depends on the core admin dashboard functionality for managing and viewing vendor profiles, which is where this feature will be located.

## 6.2.0.0 Technical Dependencies

- A dedicated, append-only audit log table in the PostgreSQL database.
- A backend mechanism (e.g., service interceptor, event listener) to capture changes to the vendor license entity.
- Role-Based Access Control (RBAC) middleware to secure the API endpoint.

## 6.3.0.0 Data Dependencies

- Requires access to vendor profile data and license information.
- Requires access to the current user's (admin's) identity to populate the 'Actor' field in the log.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API endpoint to fetch the audit log for a vendor must have a P95 latency of under 500ms.

## 7.2.0.0 Security

- Access to the audit log UI and API must be strictly limited to users with the 'Administrator' role, as per REQ-USR-001.
- All data in transit must be encrypted via HTTPS/TLS 1.2+.

## 7.3.0.0 Usability

- The log must be presented in a clear, scannable format that is easy for non-technical admins to understand.

## 7.4.0.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The admin dashboard feature must be responsive and function correctly on all modern web browsers supported by the platform.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires creating a new database schema for the audit log.
- Requires modifying existing vendor management services to reliably capture and record every change.
- Ensuring the atomicity of the data change and the audit log creation (i.e., both succeed or both fail) is critical.
- Frontend work is straightforward but requires careful presentation of data.

## 8.3.0.0 Technical Risks

- Risk of missing some code paths that modify license data, leading to an incomplete audit trail. A thorough code review is essential.
- Potential for performance degradation on the vendor update endpoint if the auditing logic is inefficient.

## 8.4.0.0 Integration Points

- Vendor Management microservice (backend).
- Admin Dashboard (frontend).
- Authentication/Authorization service for securing the endpoint.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Verify log creation when an admin adds a license for the first time.
- Verify log creation when an admin updates an existing license number.
- Verify log creation when an admin updates an existing expiry date.
- Verify log creation when a vendor updates their own license (if permitted).
- Verify the UI displays correctly for a vendor with 0, 1, and 20+ log entries (testing pagination).
- Verify API access is denied for Customer, Vendor, and Rider roles.

## 9.3.0.0 Test Data Needs

- Test admin accounts.
- Test vendor accounts in various states: no license, new license, license with a history of updates.

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for frontend unit tests.
- Cypress for E2E tests.
- Postman or similar for API security testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one other engineer
- Unit and integration tests implemented with >80% coverage for new code
- E2E tests for the primary user flow are created and passing
- The API endpoint is documented in the OpenAPI specification
- The database schema changes are documented
- Security requirements (RBAC) are implemented and verified
- The feature is deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a critical compliance feature and should be prioritized before launching in any regulated market.
- Dependent on the completion of basic admin and vendor profile management stories.

## 11.4.0.0 Release Impact

Required for go-live in markets with strict vendor licensing regulations. Enhances platform trustworthiness and reduces legal risk.

