# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | CUS-008 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Customer Edits Existing Delivery Address |
| As A User Story | As a registered customer, I want to edit my saved ... |
| User Persona | A registered customer who has previously saved at ... |
| Business Value | Improves delivery success rates by ensuring addres... |
| Functional Area | User Management |
| Story Theme | Profile & Address Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Successfully edit an address with valid data

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in customer on the 'My Addresses' screen and I have at least one saved address

### 3.1.5 When

I tap the 'Edit' option for an address, modify the details in the pre-filled form, and tap 'Save'

### 3.1.6 Then

The system validates the new details, saves the changes, displays a success confirmation message (e.g., 'Address updated successfully'), and the 'My Addresses' screen refreshes to show the updated address information.

### 3.1.7 Validation Notes

Verify the database record for the address is updated correctly. The success message should be non-blocking and disappear automatically after a few seconds.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Attempt to save an address with a missing required field

### 3.2.3 Scenario Type

Error_Condition

### 3.2.4 Given

I am on the 'Edit Address' screen with a pre-filled form

### 3.2.5 When

I clear a mandatory field (e.g., House/Flat No.) and tap 'Save'

### 3.2.6 Then

The system prevents the save, displays an inline validation error message next to the empty field (e.g., 'This field is required'), and the form remains open with my changes intact.

### 3.2.7 Validation Notes

Test for all mandatory fields defined in the address schema. The API should return a 400 Bad Request status with a clear error message.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Cancel the edit operation

### 3.3.3 Scenario Type

Alternative_Flow

### 3.3.4 Given

I am on the 'Edit Address' screen and have made some changes to the form

### 3.3.5 When

I tap the 'Cancel' button or use the back navigation

### 3.3.6 Then

The system discards my changes, returns me to the 'My Addresses' screen, and the original address information remains unchanged.

### 3.3.7 Validation Notes

Verify that no API call is made to the backend and the address data in the list view is the same as before initiating the edit.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Attempt to save an address outside an operational zone

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

I am on the 'Edit Address' screen

### 3.4.5 When

I modify the address or move the map pin to a location that is outside a defined operational geofence and tap 'Save'

### 3.4.6 Then

The system prevents the save and displays a clear error message (e.g., 'Sorry, this address is outside our service area.').

### 3.4.7 Validation Notes

This requires an API call to a service that can validate a lat/long or address against the geofenced zones defined by administrators (REQ-FUN-019).

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Attempt to edit an address associated with an active order

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

I am a logged-in customer on the 'My Addresses' screen

### 3.5.5 And

I have an active order ('Accepted' through 'In Transit' state) being delivered to one of my saved addresses

### 3.5.6 When

I attempt to edit that specific address

### 3.5.7 Then

The 'Edit' option for that address is disabled or, if tapped, a message is displayed stating 'This address cannot be edited while an order is in progress to this location.'

### 3.5.8 Validation Notes

The frontend needs to know which addresses are linked to active orders. The backend API for editing must also reject any attempt to modify an address linked to an active order as a security measure.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Network failure during save operation

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

I am on the 'Edit Address' screen and have made valid changes

### 3.6.5 When

I tap 'Save' and the device has no internet connectivity

### 3.6.6 Then

The system displays a network error message (e.g., 'Unable to save. Please check your connection and try again.'), and the form remains open with my changes intact so I don't lose my work.

### 3.6.7 Validation Notes

Simulate network failure using device settings or browser developer tools. The app should handle the API call failure gracefully.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A list view of saved addresses
- An 'Edit' icon or button for each address entry
- An 'Edit Address' form with pre-filled fields (e.g., House/Flat No., Building/Street, Landmark, Address Type, Pincode)
- Integration with a map view (Mapbox) to show and adjust the pin location
- 'Save' and 'Cancel' buttons
- Inline validation error messages
- Toast/Snackbar for success or failure notifications

## 4.2.0 User Interactions

- User taps 'Edit' to open the form.
- Form fields are pre-populated with the selected address data.
- User can type to modify text fields.
- User can drag a pin on the map to update the GPS coordinates.
- Tapping 'Save' triggers validation and an API call.
- Tapping 'Cancel' discards changes and closes the form.

## 4.3.0 Display Requirements

- The form must clearly distinguish between mandatory and optional fields.
- The updated address must be immediately reflected in the address list upon successful save.

## 4.4.0 Accessibility Needs

- All form fields must have associated labels for screen readers.
- UI elements must have sufficient color contrast.
- The form must be fully navigable using a keyboard or accessibility services, adhering to WCAG 2.1 Level AA (REQ-INT-001).

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-ADDR-01

### 5.1.2 Rule Description

An address cannot be edited if it is associated with an order in an active state (from 'Accepted' to 'In Transit').

### 5.1.3 Enforcement Point

Both client-side (disabling the UI element) and server-side (API validation).

### 5.1.4 Violation Handling

The client UI should prevent the action. The server API must reject the request with a 403 Forbidden or 409 Conflict error, including a descriptive message.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-ADDR-02

### 5.2.2 Rule Description

A saved address must fall within a defined operational geofence.

### 5.2.3 Enforcement Point

Server-side, during the save/update validation process.

### 5.2.4 Violation Handling

The server API must reject the request with a 400 Bad Request error, including a message indicating the address is outside the service area.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

CUS-003

#### 6.1.1.2 Dependency Reason

User must be able to log in to access their profile and addresses.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

CUS-007

#### 6.1.2.2 Dependency Reason

An address must first be added before it can be edited. The UI for listing addresses will likely be created in this story.

## 6.2.0.0 Technical Dependencies

- A secure backend API endpoint (e.g., PUT /api/v1/customer/addresses/{addressId}) for updating address data.
- Authentication service (AWS Cognito) to provide a validated user identity (JWT).
- Database schema for customer addresses.
- Access to the Order Management service to check for active orders linked to an address.
- Access to the Service Area Management configuration to validate location against geofences.

## 6.3.0.0 Data Dependencies

- The user must have at least one existing address record in the database.

## 6.4.0.0 External Dependencies

- Mapbox API for map display, pin placement, and potentially geocoding services (REQ-INT-003).

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API response time for the update operation must be under 200ms (P95), as per REQ-NFR-001.
- The map interface on the edit screen must load quickly and allow for smooth pin dragging.

## 7.2.0.0 Security

- The API endpoint must be protected and require a valid JWT.
- The system must enforce that a user can only edit their own addresses (Authorization).
- All user-supplied input must be sanitized and validated on the server-side to prevent injection attacks (OWASP Top 10).

## 7.3.0.0 Usability

- The editing process should be intuitive and require minimal steps.
- Error messages must be clear, user-friendly, and guide the user on how to correct the issue.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards (REQ-INT-001).

## 7.5.0.0 Compatibility

- The feature must function correctly on all supported versions of iOS and Android as defined by the project.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires inter-service communication to check for active orders and validate against operational zones.
- Integration with the Mapbox SDK for map-based pin adjustment.
- Requires robust state management on the client-side to handle the form data, validation, and API states (loading, success, error).

## 8.3.0.0 Technical Risks

- Potential for latency in the cross-service calls (checking active orders/zones), which could impact user experience. A timeout/circuit breaker might be needed.
- Inconsistencies between geocoding results from the map service and the user's manually entered address.

## 8.4.0.0 Integration Points

- User Service/Database: To fetch and update the address record.
- Order Service: To query for active orders associated with the address ID.
- Platform Configuration Service: To fetch operational zone geofences for validation.
- Mapbox API: For map rendering and location services.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Usability

## 9.2.0.0 Test Scenarios

- Verify successful update of all address fields.
- Test validation for each required field.
- Test cancellation flow.
- Test saving an address inside vs. outside a service area.
- Test editing an address with and without an active order associated with it.
- Test API security by attempting to edit another user's address with a valid token for a different user.

## 9.3.0.0 Test Data Needs

- A test user account with multiple saved addresses.
- A test user account with an active order.
- Defined operational zones in the staging environment for testing the geofence validation.

## 9.4.0.0 Testing Tools

- Jest & React Testing Library (Frontend Unit/Integration)
- Jest/Supertest (Backend API Testing)
- Cypress (End-to-End)
- Postman/Insomnia (API Security Testing)

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >80% code coverage.
- End-to-end automated tests for the happy path and key error conditions are implemented and passing.
- UI/UX has been reviewed and approved by the product owner/designer.
- Performance of the API endpoint meets the NFR of <200ms P95 latency.
- Security checks (authorization, input validation) have been implemented and verified.
- No major accessibility violations are present.
- Relevant documentation (e.g., API spec) has been updated.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is fundamental for user profile management and has a direct impact on delivery success. It should be prioritized early in the development cycle.
- Requires backend and frontend work that can be done in parallel after the API contract is defined.

## 11.4.0.0 Release Impact

- This is a core feature for the initial MVP launch. Without it, users cannot correct address mistakes, leading to a poor user experience and operational issues.

