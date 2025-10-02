# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | CUS-007 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Customer Adds and Saves a New Delivery Address to ... |
| As A User Story | As a registered customer, I want to add and save a... |
| User Persona | A registered and authenticated customer using the ... |
| Business Value | Improves checkout speed and reduces cart abandonme... |
| Functional Area | User Profile Management |
| Story Theme | Customer Account & Personalization |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Happy Path: Successfully add a new address with all required details

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in customer on the 'Manage Addresses' screen

### 3.1.5 When

I tap 'Add New Address', fill in all mandatory fields, adjust the pin on the map for accuracy, select an address type (e.g., 'Home'), and tap 'Save'

### 3.1.6 Then

The system validates the input, saves the new address to my profile, and I am returned to the 'Manage Addresses' screen where the newly added address is now visible in my list.

### 3.1.7 Validation Notes

Verify the address record is created in the database with the correct user ID, address details, and geospatial coordinates.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Error Condition: Attempt to save an address with missing mandatory fields

### 3.2.3 Scenario Type

Error_Condition

### 3.2.4 Given

I am on the 'Add New Address' form

### 3.2.5 When

I attempt to save the address without filling in a mandatory field, such as 'Address Line 1'

### 3.2.6 Then

The form submission is prevented, and a clear, inline error message (e.g., 'This field is required') is displayed next to the corresponding empty field.

### 3.2.7 Validation Notes

Test for each mandatory field individually to ensure validation triggers correctly.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Error Condition: Attempt to save an address outside the service area

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

I am on the 'Add New Address' form

### 3.3.5 When

I enter an address or move the map pin to a location that is outside a defined operational geofence

### 3.3.6 Then

A clear, non-blocking message like 'Sorry, we don't currently serve this area' is displayed, and the 'Save' button is disabled.

### 3.3.7 Validation Notes

Requires a backend check against the geofence data defined in REQ-FUN-019. Test with coordinates both inside and outside known service zones.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Alternative Flow: Use 'Current Location' to pre-fill the address

### 3.4.3 Scenario Type

Alternative_Flow

### 3.4.4 Given

I am on the 'Add New Address' form and have granted location permissions

### 3.4.5 When

I tap the 'Use my current location' button

### 3.4.6 Then

The system uses the device's GPS to position the pin on the map and automatically fills the address fields using reverse geocoding.

### 3.4.7 Validation Notes

Verify the app correctly requests GPS permissions as per REQ-INT-002. The accuracy of the auto-filled address depends on the mapping service.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Edge Case: Network failure during address save

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

I have filled out the address form correctly

### 3.5.5 When

I tap 'Save', but the device has lost its internet connection

### 3.5.6 Then

The system displays a user-friendly error message (e.g., 'No internet connection. Please try again.') and the data I entered in the form is preserved.

### 3.5.7 Validation Notes

Simulate network loss using device settings or network throttling tools during testing.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Interaction: Address fields and map pin are synchronized

### 3.6.3 Scenario Type

Happy_Path

### 3.6.4 Given

I am on the 'Add New Address' form

### 3.6.5 When

I manually type a new address and the system successfully geocodes it OR I drag the pin on the map

### 3.6.6 Then

The other element updates accordingly; the map pin moves to the typed address, or the address fields update based on the pin's new location.

### 3.6.7 Validation Notes

This confirms the two-way binding between the text input and the map component via the mapping service API.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A 'Manage Addresses' screen within the user profile.
- An 'Add New Address' button.
- A form with fields for: Address Line 1, Address Line 2, Landmark (optional), City, Pincode, Contact Name, Contact Phone.
- A set of selectable tags for address type (e.g., 'Home', 'Work', 'Other').
- An interactive map view (e.g., Mapbox).
- A draggable pin on the map.
- A 'Use my current location' button.
- A 'Save Address' button.

## 4.2.0 User Interactions

- User can tap to add a new address.
- User can type into text fields.
- User can drag the pin on the map to set a precise location.
- User can tap a button to auto-fill based on current GPS location.

## 4.3.0 Display Requirements

- Clear inline validation errors for invalid form fields.
- A loading indicator while the address is being saved.
- Success or failure feedback messages to the user.

## 4.4.0 Accessibility Needs

- All form fields must have clear, associated labels.
- UI elements must have sufficient color contrast and touch target size.
- The screen should be navigable using screen readers, adhering to WCAG 2.1 Level AA as per REQ-INT-001.

# 5.0.0 Business Rules

- {'rule_id': 'BR-001', 'rule_description': 'A new address must fall within a defined operational zone to be saved.', 'enforcement_point': 'Backend API, upon receiving the request to save a new address.', 'violation_handling': 'The API should return a specific error code and message, which the client app will use to display a user-friendly notification and disable the save action.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

CUS-003

#### 6.1.1.2 Dependency Reason

User must be authenticated to access their profile and add an address.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

CUS-006

#### 6.1.2.2 Dependency Reason

This story likely creates the foundational 'Profile/Account' section where the 'Manage Addresses' feature will reside.

## 6.2.0.0 Technical Dependencies

- Authentication Service (AWS Cognito) to identify the current user.
- User Profile Microservice with a database capable of storing addresses.
- Geospatial database support (e.g., PostGIS on PostgreSQL as per REQ-TEC-001) to store and query location coordinates efficiently.
- Internal Geofencing Service/API to validate addresses against operational zones (as per REQ-FUN-019).

## 6.3.0.0 Data Dependencies

- Availability of defined operational zone geofence data.

## 6.4.0.0 External Dependencies

- Mapbox API (as per REQ-INT-003) for map rendering, geocoding, and reverse geocoding. The system must handle API unavailability gracefully (as per REQ-DEP-002).

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The 'Add Address' screen should load in under 2 seconds.
- Geocoding/reverse-geocoding API responses should be received in under 500ms.
- The save operation (client to server and back) should complete in under 2 seconds.

## 7.2.0.0 Security

- All address data must be transmitted over HTTPS/TLS 1.2+ (REQ-INT-004).
- Address data (PII) must be encrypted at rest in the database (REQ-NFR-003).
- All user-supplied input must be sanitized on the backend to prevent XSS and other injection attacks.

## 7.3.0.0 Usability

- The process of adding an address should be intuitive and require minimal user effort.
- Error messages must be clear and actionable.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards (REQ-INT-001).

## 7.5.0.0 Compatibility

- The feature must function correctly on the supported versions of iOS and Android.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Integration with a third-party mapping SDK (Mapbox) on the mobile client.
- Implementing the two-way synchronization between the map pin and address text fields.
- Backend implementation of geospatial queries to check against operational zones.
- Handling device-specific permissions for GPS access (REQ-INT-002).

## 8.3.0.0 Technical Risks

- Latency or unavailability of the external Mapbox API could degrade user experience.
- Inaccurate geocoding results from the mapping service could lead to incorrect address data.
- Complexity in managing geospatial data and queries if the team is unfamiliar with PostGIS.

## 8.4.0.0 Integration Points

- Client App <-> API Gateway
- API Gateway <-> User Profile Microservice
- User Profile Microservice <-> PostgreSQL Database (PostGIS)
- User Profile Microservice <-> Geofencing Service
- Client App <-> Mapbox API

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Usability
- Security

## 9.2.0.0 Test Scenarios

- Successfully add an address for 'Home', 'Work', and 'Other'.
- Attempt to add an address with each mandatory field missing.
- Add an address by typing first, then by moving the pin first.
- Test adding an address exactly on the border of a service zone.
- Test adding an address far outside any service zone.
- Test the 'Use my current location' feature with GPS enabled and disabled.
- Test the form's behavior during a network interruption.

## 9.3.0.0 Test Data Needs

- Test user accounts.
- A set of known addresses and coordinates inside, outside, and on the boundary of defined service zones.

## 9.4.0.0 Testing Tools

- Jest & React Testing Library (Frontend Unit/Integration)
- Cypress (E2E)
- Device emulators and physical devices for manual testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >= 80% code coverage as per REQ-NFR-006
- E2E automated test case for the happy path is created and passing
- User interface reviewed for usability and adherence to design specs
- Performance requirements for screen load and API response times are met
- Security requirements (data encryption, input sanitization) are validated
- API documentation for the new endpoint is created/updated in OpenAPI specification
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational feature for the checkout process.
- Requires both frontend and backend development, which can be parallelized once the API contract is defined.
- Developer access to Mapbox API keys and documentation is required before starting.

## 11.4.0.0 Release Impact

- Enables subsequent stories related to address selection during checkout.
- Significantly improves the core user journey for placing an order.

