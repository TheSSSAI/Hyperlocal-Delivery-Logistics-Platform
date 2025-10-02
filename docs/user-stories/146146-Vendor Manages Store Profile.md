# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | VND-005 |
| Elaboration Date | 2024-05-21 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Vendor Manages Store Profile |
| As A User Story | As a registered vendor, I want to view and edit my... |
| User Persona | Vendor (Store Owner/Manager) |
| Business Value | Ensures data accuracy for logistics (rider navigat... |
| Functional Area | Vendor Management |
| Story Theme | Vendor Onboarding & Profile |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Vendor successfully views and updates their store profile

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a logged-in vendor is on the 'Store Profile' page of the vendor dashboard

### 3.1.5 When

they modify the store name, phone number, and address fields with valid information and click the 'Save Changes' button

### 3.1.6 Then

the system validates the inputs, saves the updated information to the database, displays a success message like 'Profile updated successfully', and the page refreshes to show the new details.

### 3.1.7 Validation Notes

Verify the database record for the vendor reflects the new information. The success message should be a non-blocking toast notification.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

System sends a notification upon profile change

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

a vendor has successfully updated their store profile information

### 3.2.5 When

the changes are saved to the database

### 3.2.6 Then

the system must trigger a notification (e.g., email or SMS) to the vendor's registered contact details confirming that their profile was updated.

### 3.2.7 Validation Notes

Check the notification service logs (e.g., AWS SNS) to confirm a message was sent to the correct vendor. This aligns with REQ-FUN-003.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Vendor attempts to save the profile with invalid data

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

a logged-in vendor is on the 'Store Profile' page

### 3.3.5 When

they clear the 'Store Name' field or enter an invalidly formatted phone number and click 'Save Changes'

### 3.3.6 Then

the system must prevent the save operation and display clear, inline validation error messages next to the corresponding fields (e.g., 'Store name cannot be empty', 'Please enter a valid 10-digit mobile number').

### 3.3.7 Validation Notes

Test with empty required fields and malformed data for each field with validation rules. The database should not be updated.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Address change triggers re-geocoding

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

a logged-in vendor is on the 'Store Profile' page

### 3.4.5 When

they update the address field with a new, valid address and click 'Save Changes'

### 3.4.6 Then

the system must make a call to the mapping service (Mapbox) to get the latitude and longitude for the new address and update these coordinates in the vendor's store record.

### 3.4.7 Validation Notes

Verify that a call to the geocoding API is made. Check the database to confirm the `latitude` and `longitude` fields for the store have been updated correctly.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Vendor attempts to save an address outside an operational zone

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

a logged-in vendor is on the 'Store Profile' page

### 3.5.5 When

they update the address to a location that falls outside any defined operational geofence and click 'Save Changes'

### 3.5.6 Then

the system must prevent the save operation and display an error message, such as 'The provided address is outside our service area.'

### 3.5.7 Validation Notes

Requires test data for operational zones. The geocoding must complete successfully before this check can be performed. The vendor record should not be updated.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Save button is disabled when no changes have been made

### 3.6.3 Scenario Type

Edge_Case

### 3.6.4 Given

a logged-in vendor navigates to the 'Store Profile' page

### 3.6.5 When

no fields have been modified

### 3.6.6 Then

the 'Save Changes' button must be in a disabled state.

### 3.6.7 Validation Notes

Verify the button becomes enabled as soon as a character is typed or changed in any form field, and disabled again if changes are reverted.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Geocoding API fails during address update

### 3.7.3 Scenario Type

Error_Condition

### 3.7.4 Given

a logged-in vendor is on the 'Store Profile' page

### 3.7.5 When

they update their address and the external mapping service API call fails or returns an error

### 3.7.6 Then

the system must not save any profile changes and must display a user-friendly error message like 'Could not verify the new address. Please try again or contact support.'

### 3.7.7 Validation Notes

Use a mock API or network interception to simulate a failure from the Mapbox API. The entire transaction should be rolled back.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A web form within the Vendor Dashboard.
- Input field for 'Store Name' (text).
- Input field for 'Store Address' (text, with potential autocomplete).
- Input field for 'Contact Phone Number' (text, with input masking for format).
- Input field for 'Contact Email' (email).
- A 'Save Changes' button (submit).
- A 'Cancel' or 'Reset' button.
- Display areas for inline validation messages.
- A toast notification component for success/failure messages.

## 4.2.0 User Interactions

- The 'Save Changes' button is disabled until a user modifies a field.
- On failed validation, the form remains populated with the user's input, and error messages appear next to the invalid fields.
- A loading indicator should be displayed on the 'Save Changes' button while the update is being processed.

## 4.3.0 Display Requirements

- The form must be pre-populated with the vendor's current profile information upon loading.
- Phone number format should be clearly indicated (e.g., placeholder text).
- All required fields must be marked with an asterisk (*).

## 4.4.0 Accessibility Needs

- All form fields must have associated `<label>` tags for screen readers.
- Validation errors must be programmatically associated with their respective input fields using `aria-describedby`.
- The UI must comply with WCAG 2.1 Level AA standards, as per REQ-INT-001.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-VND-001

### 5.1.2 Rule Description

A store's physical address must be geocoded and fall within a defined operational zone.

### 5.1.3 Enforcement Point

During the save operation of the store profile.

### 5.1.4 Violation Handling

The update transaction is rejected, and an error message is displayed to the vendor.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-VND-002

### 5.2.2 Rule Description

Store name is a mandatory field and cannot be empty.

### 5.2.3 Enforcement Point

Client-side and server-side validation upon form submission.

### 5.2.4 Violation Handling

The update is rejected, and an inline validation error is shown.

## 5.3.0 Rule Id

### 5.3.1 Rule Id

BR-VND-003

### 5.3.2 Rule Description

A notification must be sent to the vendor upon any change to their profile's contact or address information.

### 5.3.3 Enforcement Point

Post-successful database commit of the profile update.

### 5.3.4 Violation Handling

The failure to send a notification should be logged as a high-priority error for investigation but should not roll back the profile update itself.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

VND-004

#### 6.1.1.2 Dependency Reason

Vendor must be able to log in to access the dashboard where their profile can be managed.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-013

#### 6.1.2.2 Dependency Reason

The system needs defined operational zones (geofences) to validate a vendor's new address against.

## 6.2.0.0 Technical Dependencies

- Vendor & Catalog Microservice: To store and retrieve vendor profile data.
- Authentication Service (AWS Cognito): To secure the API endpoint.
- Mapping Service (Mapbox API): For geocoding address strings into coordinates.
- Notification Service (AWS SNS/FCM): To send confirmation alerts to the vendor.

## 6.3.0.0 Data Dependencies

- An existing, approved vendor account in the database.
- Configuration data for operational zones.

## 6.4.0.0 External Dependencies

- Availability of the Mapbox Geocoding API.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API endpoint for updating the profile should have a P95 latency of under 200ms, excluding the latency of the external geocoding service (as per REQ-NFR-001).

## 7.2.0.0 Security

- The API endpoint must be protected and only accessible by an authenticated vendor user.
- The endpoint must enforce authorization, ensuring a vendor can only modify their own store profile.
- All user-supplied input must be sanitized on the backend to prevent XSS and other injection attacks (OWASP Top 10).

## 7.3.0.0 Usability

- The profile management interface must be intuitive and require minimal instruction.
- Error messages must be clear, user-friendly, and guide the user toward a solution.

## 7.4.0.0 Accessibility

- The feature must be compliant with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The vendor web dashboard must be responsive and function correctly on all modern web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Integration with the external Mapbox API for geocoding.
- Error handling for the external API dependency (e.g., timeouts, invalid responses).
- Logic to validate the resulting coordinates against internal operational zone data.
- Asynchronous triggering of a notification upon successful update.

## 8.3.0.0 Technical Risks

- The external geocoding service may be unavailable or return inaccurate data, requiring robust fallback and error handling.
- Changes to a store's location have downstream impacts on delivery radius, rider allocation, and customer visibility, which must be handled correctly.

## 8.4.0.0 Integration Points

- Backend API for vendor profile (PUT/PATCH).
- Mapbox Geocoding API (Client or Server-side call).
- Internal service/database for operational zones.
- Notification service for sending alerts.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Accessibility

## 9.2.0.0 Test Scenarios

- Verify successful update of each individual field.
- Verify successful update of all fields at once.
- Test validation rules for each field (empty, invalid format).
- Test address change with a valid address inside an operational zone.
- Test address change with a valid address outside an operational zone.
- Test address change with an address that cannot be geocoded.
- Simulate and test failure of the external geocoding API.
- Verify that a notification is sent upon successful update.

## 9.3.0.0 Test Data Needs

- A test vendor account.
- Defined operational zones in the test environment.
- Sample addresses (valid, invalid, inside zone, outside zone).

## 9.4.0.0 Testing Tools

- Jest & React Testing Library (Frontend Unit/Integration).
- Jest (Backend Unit/Integration).
- Cypress (End-to-End).
- Postman/Insomnia (API testing).

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >= 80% coverage and all passing
- E2E tests for the happy path and key error conditions are implemented and passing
- User interface reviewed for UX consistency and responsiveness
- API endpoint is documented in the OpenAPI specification
- Security requirements (authentication, authorization, input sanitization) are validated
- Accessibility audit passed for WCAG 2.1 AA
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational feature for vendors. It is a prerequisite for enabling a store to go live.
- Requires access to Mapbox API keys and defined operational zones in the development environment.

## 11.4.0.0 Release Impact

- Critical for the initial launch and vendor onboarding process. Without this, vendors cannot manage their core business information.

