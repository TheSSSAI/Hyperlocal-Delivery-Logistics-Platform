# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | CUS-042 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Customer Manages Granular Data Consent Settings |
| As A User Story | As a registered customer, I want to access a dedic... |
| User Persona | Registered Customer using the mobile application. |
| Business Value | Ensures compliance with India's Digital Personal D... |
| Functional Area | User Management & Settings |
| Story Theme | User Privacy & Compliance |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Customer views their current consent settings

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in customer

### 3.1.5 When

I navigate to the 'Settings' screen and select the 'Data & Privacy' option

### 3.1.6 Then

The system displays a screen with a list of all data processing activities requiring consent, and my current choices (granted/revoked) are shown for each using toggle switches.

### 3.1.7 Validation Notes

Verify the screen loads and accurately reflects the consent statuses stored in the database for the logged-in user.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Customer grants consent for an optional activity

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

I am on the 'Data & Privacy' screen and my consent for 'Promotional Emails' is currently revoked

### 3.2.5 When

I tap the toggle to the 'on' position for 'Promotional Emails' and tap the 'Save Changes' button

### 3.2.6 Then

The system saves my preference, a confirmation message 'Your privacy settings have been updated' is displayed, and the toggle remains in the 'on' position.

### 3.2.7 Validation Notes

Check the database to confirm the user's consent status for 'promotional_emails' is updated to 'granted'. Verify an audit log entry is created for this change.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Customer revokes consent for an optional activity

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

I am on the 'Data & Privacy' screen and my consent for 'Personalized Recommendations' is currently granted

### 3.3.5 When

I tap the toggle to the 'off' position for 'Personalized Recommendations' and tap the 'Save Changes' button

### 3.3.6 Then

The system saves my preference, a confirmation message is displayed, and the toggle remains in the 'off' position.

### 3.3.7 Validation Notes

Check the database to confirm the user's consent status for 'personalized_recommendations' is updated to 'revoked'. Verify an audit log entry is created.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Customer views a mandatory, non-revocable consent

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

I am on the 'Data & Privacy' screen

### 3.4.5 When

I view the consent item for 'Processing location data for delivery'

### 3.4.6 Then

The toggle switch is in the 'on' position, is disabled (greyed out), and cannot be changed. An informational icon or text is displayed next to it explaining that this is required for the service to function.

### 3.4.7 Validation Notes

Verify the UI element for mandatory consent is not interactive and the explanatory text is clear and visible.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Saving consent changes fails due to a network error

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

I am on the 'Data & Privacy' screen and have changed a consent setting

### 3.5.5 When

I tap 'Save Changes' and the device has no internet connectivity

### 3.5.6 Then

The system displays an error message like 'Failed to update settings. Please check your connection and try again.', and the toggle switches revert to their last saved state.

### 3.5.7 Validation Notes

Simulate a network failure (e.g., using device's airplane mode or a proxy) and verify the UI handles the API call failure gracefully.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

System logs all consent changes for auditability

### 3.6.3 Scenario Type

Happy_Path

### 3.6.4 Given

A customer is successfully updating their consent for any activity

### 3.6.5 When

The backend service processes the update request

### 3.6.6 Then

A new, immutable entry is created in the consent audit log that includes the user ID, the specific consent type (e.g., 'promotional_emails'), the new status ('granted' or 'revoked'), and an ISO 8601 timestamp.

### 3.6.7 Validation Notes

After performing a consent change via the API, query the audit log database/table to ensure the correct record was created.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A 'Data & Privacy' menu item within the main 'Settings' or 'Profile' screen.
- A dedicated screen titled 'Data & Privacy Settings'.
- A list of consent items, each with a clear, non-legalistic description.
- A toggle switch for each consent item.
- An informational icon (e.g., '(i)') for mandatory consents.
- A 'Save Changes' button.
- Toast/Snackbar notifications for success and error messages.

## 4.2.0 User Interactions

- User taps a toggle to change its state from on/off.
- User must tap 'Save Changes' to persist any modifications.
- If the user navigates away with unsaved changes, a confirmation dialog should appear.
- Tapping the informational icon for a mandatory consent should display a tooltip or modal with the explanation.

## 4.3.0 Display Requirements

- Each consent item must clearly state the purpose of data processing (e.g., 'Promotional Emails: Allow us to send you marketing offers and updates.').
- The distinction between optional and mandatory consents must be visually clear.

## 4.4.0 Accessibility Needs

- All interactive elements (toggles, buttons) must have proper labels for screen readers (e.g., 'Toggle for Promotional Emails, currently on').
- The screen must adhere to WCAG 2.1 Level AA contrast ratios.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-CST-001

### 5.1.2 Rule Description

Certain consents are mandatory for core service functionality and cannot be revoked by the user.

### 5.1.3 Enforcement Point

Backend API and Frontend UI.

### 5.1.4 Violation Handling

The UI must prevent the user from attempting to change the setting. The backend API must reject any attempt to modify a mandatory consent.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-CST-002

### 5.2.2 Rule Description

All changes to a user's consent status must be recorded in an immutable audit log.

### 5.2.3 Enforcement Point

Backend User/Identity Service.

### 5.2.4 Violation Handling

If the audit log write fails, the entire transaction to update the consent should be rolled back to ensure data integrity.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

CUS-001

#### 6.1.1.2 Dependency Reason

A user account must exist before consent can be managed.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

CUS-003

#### 6.1.2.2 Dependency Reason

User must be authenticated to access and modify their personal settings.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

CUS-006

#### 6.1.3.2 Dependency Reason

This feature is part of the overall user profile management section.

## 6.2.0.0 Technical Dependencies

- A defined API endpoint in the User/Identity microservice (e.g., GET/PUT /api/v1/users/me/consents).
- A database schema to store user consent preferences (e.g., a `user_consents` table).
- Integration with the central Audit Logging service/system.

## 6.3.0.0 Data Dependencies

- A finalized, version-controlled list of consent types (e.g., `promotional_emails`, `personalized_recommendations`) and their classification (mandatory/optional).

## 6.4.0.0 External Dependencies

- The list of required consents is derived from legal interpretation of the DPDP Act, 2023.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The consent settings screen must load in under 1.5 seconds.
- The API response time for updating consents must be under 500ms (P95).

## 7.2.0.0 Security

- The API endpoint for managing consent must be protected and only accessible by the authenticated user who owns the data.
- Consent changes must be logged in a secure, immutable audit trail as per REQ-NFR-008.
- Consent data must be encrypted at rest.

## 7.3.0.0 Usability

- The purpose of each consent must be explained in simple, clear language, avoiding jargon.

## 7.4.0.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The feature must function correctly on all supported versions of iOS and Android.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires both frontend (new screen) and backend (new API, DB schema change) development.
- Integration with a central audit log is required.
- The most significant complexity lies in ensuring other microservices (e.g., Marketing, Analytics) correctly query and enforce these consents before performing actions. This cross-service enforcement mechanism needs careful design (e.g., via API calls or event-driven architecture).

## 8.3.0.0 Technical Risks

- Risk of inconsistent enforcement across different microservices. A clear pattern for checking consent must be established and followed.
- The initial list of consents may change as legal interpretations evolve, requiring a flexible data model.

## 8.4.0.0 Integration Points

- User/Identity Service: Owns the consent data and API.
- API Gateway: Exposes the consent management endpoint.
- Audit Service: Receives logs of all consent changes.
- Other services (e.g., Notification/Marketing Service): Must query the User Service to check consent before acting.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Accessibility

## 9.2.0.0 Test Scenarios

- Verify a user can view, grant, and revoke optional consents.
- Verify mandatory consents cannot be changed.
- Verify UI and data persistence after saving.
- Verify error handling for network failures.
- Verify audit logs are created correctly for every change.
- Verify that revoking consent for 'Promotional Emails' actually prevents the user from receiving them (requires testing the Notification service integration).

## 9.3.0.0 Test Data Needs

- Test users with various initial consent configurations (all granted, all revoked, mixed).
- A defined list of mandatory and optional consent types for testing.

## 9.4.0.0 Testing Tools

- Jest & React Testing Library for frontend unit tests.
- Cypress or similar for E2E tests.
- Postman/Insomnia for API-level testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >80% code coverage
- E2E test scenario for the happy path is automated and passing
- User interface reviewed and approved by UX/UI designer
- API performance meets specified latency requirements
- Security review passed; audit logging is confirmed to be working
- All UI text is internationalized and added to resource files
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- The list of consent types and their descriptions must be finalized with the legal/product team before starting development.
- Backend API work can be done in parallel with frontend UI development using a mock API contract.
- Enforcement of consent by other services might be handled in separate, subsequent stories.

## 11.4.0.0 Release Impact

This is a critical compliance feature and must be included in any public release to mitigate legal risk.

