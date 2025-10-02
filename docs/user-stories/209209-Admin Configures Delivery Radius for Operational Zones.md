# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | ADM-009 |
| Elaboration Date | 2024-05-21 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Admin Configures Delivery Radius for Operational Z... |
| As A User Story | As an Administrator, I want to define and update t... |
| User Persona | Platform Administrator responsible for business op... |
| Business Value | Enables precise control over service areas, ensuri... |
| Functional Area | Platform Administration |
| Story Theme | Service Area and Logistics Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Admin successfully views and updates a delivery radius

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

an Administrator is logged into the admin dashboard and navigates to the 'Operational Zones' management page

### 3.1.5 When

the Administrator enters a new valid, positive numeric value (e.g., '10') into the 'Delivery Radius (km)' field for a specific zone and clicks 'Save'

### 3.1.6 Then

the system must persist the new value to the database, display a success notification (e.g., 'Delivery radius for [Zone Name] updated to 10 km'), and the page must reflect the updated value.

### 3.1.7 Validation Notes

Verify the value in the UI and by checking the database record for the specific zone. The API call should return a 200 OK status.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

System enforces the configured radius during order placement (customer allowed)

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

an operational zone has a configured delivery radius of 8 km

### 3.2.5 And

a customer selects a delivery address that is 7.5 km away from the vendor's location

### 3.2.6 When

the customer attempts to add an item from that vendor to their cart or proceed to checkout

### 3.2.7 Then

the system must validate the distance and allow the customer to proceed with the order without any errors.

### 3.2.8 Validation Notes

Requires an E2E test. Use test accounts with known lat/long coordinates for the vendor and customer address to confirm the distance calculation is correct.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

System enforces the configured radius during order placement (customer blocked)

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

an operational zone has a configured delivery radius of 8 km

### 3.3.5 And

a customer selects a delivery address that is 9 km away from the vendor's location

### 3.3.6 When

the customer attempts to add an item from that vendor to their cart or proceed to checkout

### 3.3.7 Then

the system must prevent the action and display a clear, user-friendly error message, such as 'This vendor does not deliver to your selected address.'

### 3.3.8 Validation Notes

Requires an E2E test. Verify that the UI displays the correct error message and the API call for adding to cart or checkout returns a validation error (e.g., 4xx status code).

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Admin enters invalid non-numeric data for the radius

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

an Administrator is on the 'Operational Zones' management page

### 3.4.5 When

the Administrator enters a non-numeric value (e.g., 'abc') into the radius field and attempts to save

### 3.4.6 Then

the system must prevent the save operation and display an inline validation error message, such as 'Please enter a valid number.'

### 3.4.7 Validation Notes

Test with various invalid inputs like text, symbols, and mixed strings. The API should return a 400 Bad Request.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Admin enters an invalid zero or negative number for the radius

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

an Administrator is on the 'Operational Zones' management page

### 3.5.5 When

the Administrator enters '0' or a negative number (e.g., '-5') into the radius field and attempts to save

### 3.5.6 Then

the system must prevent the save operation and display an inline validation error message, such as 'Radius must be a positive number.'

### 3.5.7 Validation Notes

Test with 0, -1, and other negative values. The API should return a 400 Bad Request.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

System applies the default delivery radius for a new zone

### 3.6.3 Scenario Type

Alternative_Flow

### 3.6.4 Given

an Administrator creates a new operational zone via the functionality in ADM-013

### 3.6.5 When

the new zone is successfully created

### 3.6.6 Then

the system must automatically assign the default delivery radius of 7 km to that zone, as specified in REQ-BR-002.

### 3.6.7 Validation Notes

After creating a new zone, navigate to the zone management page and verify that the radius field is pre-populated with '7'.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Changes to delivery radius are recorded in the audit trail

### 3.7.3 Scenario Type

Happy_Path

### 3.7.4 Given

an Administrator is logged in

### 3.7.5 When

the Administrator successfully changes the delivery radius for a zone from '7' to '10'

### 3.7.6 Then

a new entry must be created in the administrator audit trail log that includes the administrator's ID, the action performed ('Update Delivery Radius'), the zone ID/name, the old value ('7'), the new value ('10'), and a timestamp.

### 3.7.7 Validation Notes

Check the audit log table or interface after performing the update to confirm the new record exists and contains all required information.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A list or table of existing operational zones in the Admin Dashboard.
- An editable numeric input field for 'Delivery Radius' next to each zone.
- A clear label for the input field specifying the unit, e.g., 'Delivery Radius (km)'.
- A 'Save' or 'Update' button for each zone or for the entire page.
- Toast/notification component for displaying success or error messages.

## 4.2.0 User Interactions

- Admin clicks into the input field to edit the value.
- Admin clicks the 'Save' button to submit the change.
- The system provides immediate inline validation feedback for invalid input.

## 4.3.0 Display Requirements

- The current delivery radius for each zone must be clearly displayed.
- Error messages must be specific and actionable.

## 4.4.0 Accessibility Needs

- All input fields must have associated `<label>` tags.
- Buttons must have descriptive text or `aria-label` attributes.
- The interface must be navigable using a keyboard.
- Complies with WCAG 2.1 Level AA as per REQ-INT-001.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-RADIUS-01

### 5.1.2 Rule Description

The delivery radius must be a positive numerical value, representing distance in kilometers.

### 5.1.3 Enforcement Point

API endpoint for updating zone configuration; Frontend form validation.

### 5.1.4 Violation Handling

The update request is rejected with a 400-level error code and a descriptive error message.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-RADIUS-02

### 5.2.2 Rule Description

A customer's delivery address must be within the vendor's operational zone delivery radius for an order to be placed.

### 5.2.3 Enforcement Point

Order Management service during the checkout validation process.

### 5.2.4 Violation Handling

The order placement is blocked, and the customer is notified that delivery is not available to their location from that vendor.

## 5.3.0 Rule Id

### 5.3.1 Rule Id

BR-RADIUS-03

### 5.3.2 Rule Description

A default delivery radius of 7 km shall be applied to all newly created operational zones.

### 5.3.3 Enforcement Point

System logic for creating a new operational zone.

### 5.3.4 Violation Handling

N/A - System-enforced default.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

ADM-013

#### 6.1.1.2 Dependency Reason

This story configures a property of an 'operational zone'. The ability to create and manage these zones must exist first.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-021

#### 6.1.2.2 Dependency Reason

This story requires logging changes to an audit trail. The audit trail functionality must be implemented first.

## 6.2.0.0 Technical Dependencies

- The database schema for 'OperationalZones' must be extended to include a `delivery_radius_km` column (e.g., DECIMAL or FLOAT).
- The database must have geospatial capabilities enabled (e.g., PostGIS extension for PostgreSQL as per REQ-TEC-001) for efficient distance calculations.
- The Order Management microservice must have an API to query the delivery radius for a given vendor's location or zone.

## 6.3.0.0 Data Dependencies

- Requires accurate geocoded (latitude/longitude) data for both vendor locations and customer delivery addresses.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The distance validation check during the customer's checkout process must complete in under 50ms to avoid adding noticeable latency.
- The admin page for managing zones should load in under 2 seconds, even with hundreds of zones.

## 7.2.0.0 Security

- The API endpoint for updating the delivery radius must be protected and accessible only to users with the 'Administrator' role.
- All input from the admin must be sanitized to prevent injection attacks.

## 7.3.0.0 Usability

- The interface for setting the radius should be intuitive, requiring no special training for an administrator.

## 7.4.0.0 Accessibility

- Must meet WCAG 2.1 Level AA standards as per REQ-INT-001.

## 7.5.0.0 Compatibility

- The admin dashboard must be fully functional on modern web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires modification of a critical, high-throughput code path (order validation).
- Involves inter-service communication between the Order Management service and the service that owns zone data.
- Requires implementation and optimization of geospatial queries in the database (e.g., using PostGIS `ST_DWithin`).
- Frontend work on the admin panel is straightforward, but backend and integration work is more complex.

## 8.3.0.0 Technical Risks

- Poorly optimized geospatial queries could lead to slow checkout times under heavy load.
- Inaccurate geocoding of addresses could lead to incorrect enforcement of the delivery radius.

## 8.4.0.0 Integration Points

- Admin Web App -> Backend API (for updating the radius).
- Order Management Service -> Zone/Vendor Service (for retrieving radius during validation).

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Performance

## 9.2.0.0 Test Scenarios

- Admin can update radius.
- Admin receives errors for invalid input (text, zero, negative).
- Customer can order when inside the radius.
- Customer is blocked when outside the radius.
- A new zone correctly receives the default radius.
- The audit log is correctly updated after a change.

## 9.3.0.0 Test Data Needs

- Test users with 'Administrator' role.
- Pre-defined operational zones.
- Test vendors with fixed latitude/longitude coordinates.
- Test customer addresses with known distances from the test vendors (both inside and outside the radius).

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for frontend unit tests.
- Cypress for E2E tests.
- A load testing tool (e.g., k6, JMeter) to benchmark the performance of the checkout API endpoint.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in the staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit test coverage for new logic is at or above 80%.
- Integration tests between the Order Management and Zone services are implemented and passing.
- E2E tests for both the admin flow and the customer checkout flow are automated and passing.
- Performance testing confirms the checkout validation API meets latency requirements.
- The change is logged in the audit trail as required.
- Technical documentation for the new API endpoint and the distance validation logic is created or updated.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational business rule and should be completed before launching in any new market.
- Requires both frontend (admin panel) and backend (API, service logic) development effort, which can be parallelized.
- The dependency on ADM-013 must be resolved before this story can be started.

## 11.4.0.0 Release Impact

- This feature is critical for the initial platform launch and any subsequent geographical expansions.

