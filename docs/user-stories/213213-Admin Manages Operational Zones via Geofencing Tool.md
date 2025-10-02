# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | ADM-013 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Admin Manages Operational Zones via Geofencing Too... |
| As A User Story | As an Administrator, I want to create, view, updat... |
| User Persona | Platform Administrator responsible for system conf... |
| Business Value | Enables controlled market expansion, ensures servi... |
| Functional Area | Platform & Administrative Features |
| Story Theme | Service Area Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Admin successfully creates a new active operational zone

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

The administrator is logged in and has navigated to the 'Operational Zones' management page

### 3.1.5 When

The administrator uses the map tool to draw a valid, closed polygon, enters a unique name (e.g., 'Mumbai South'), sets the status to 'Active', and clicks 'Save'

### 3.1.6 Then

The system saves the new zone's geographic data, name, and status. The new zone is immediately visible on the map and in the list of zones with an 'Active' status. The action is recorded in the admin audit trail.

### 3.1.7 Validation Notes

Verify the new zone polygon is stored correctly in the database (PostGIS). Verify the audit log entry is created. Verify the zone appears on the UI without a page refresh.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Admin views all existing operational zones

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

There are multiple operational zones already defined in the system with different statuses

### 3.2.5 When

The administrator navigates to the 'Operational Zones' management page

### 3.2.6 Then

The page displays an interactive map showing all defined zones as distinct, colored polygons. A list view alongside the map displays the name and status of each zone. Active zones are visually distinct from inactive zones (e.g., green vs. gray).

### 3.2.7 Validation Notes

Test that clicking a zone in the list highlights and centers it on the map. Verify that both active and inactive zones are displayed correctly.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Admin successfully edits an existing zone's shape and details

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

An operational zone named 'Mumbai South' exists

### 3.3.5 When

The administrator selects the 'Mumbai South' zone, modifies its polygon shape on the map, changes its name to 'Mumbai South-West', and clicks 'Save'

### 3.3.6 Then

The system updates the zone's geographic data and name. The changes are reflected immediately on the map and in the list. The update action is recorded in the admin audit trail.

### 3.3.7 Validation Notes

Verify the database record for the zone reflects the new polygon coordinates and name. Check the audit log for the update event.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Admin successfully deactivates a zone

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

An active operational zone named 'Pune Pilot' exists

### 3.4.5 When

The administrator selects the 'Pune Pilot' zone, changes its status from 'Active' to 'Inactive', and clicks 'Save'

### 3.4.6 Then

The system updates the zone's status to 'Inactive'. The zone's visual representation on the map changes to indicate its inactive state. The system will now prevent new orders from being placed for delivery within this zone.

### 3.4.7 Validation Notes

Create an E2E test: Deactivate the zone, then attempt to place an order to an address within it as a customer, and verify the order is blocked.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Admin successfully deletes a zone

### 3.5.3 Scenario Type

Happy_Path

### 3.5.4 Given

An inactive operational zone named 'Test Zone' exists

### 3.5.5 When

The administrator clicks the 'Delete' button for 'Test Zone', and confirms the action in a confirmation dialog

### 3.5.6 Then

The system permanently removes the zone from the database. The zone disappears from the map and the list view. The delete action is recorded in the admin audit trail.

### 3.5.7 Validation Notes

Verify the record is deleted from the database. Verify the audit log entry is created.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Admin attempts to save a zone with an invalid shape

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

The administrator is creating a new zone on the map

### 3.6.5 When

The administrator draws a self-intersecting polygon and attempts to save it

### 3.6.6 Then

The system prevents the save operation and displays an informative error message, such as 'Zone boundaries cannot cross. Please create a simple polygon.'

### 3.6.7 Validation Notes

Test with various invalid polygon shapes to ensure robust validation.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Admin attempts to save a zone without a name

### 3.7.3 Scenario Type

Error_Condition

### 3.7.4 Given

The administrator has drawn a valid polygon on the map

### 3.7.5 When

The administrator leaves the 'Zone Name' field blank and clicks 'Save'

### 3.7.6 Then

The system prevents the save operation and displays a validation error message next to the name field, such as 'Zone Name is required.'

### 3.7.7 Validation Notes

Verify the 'Save' button is disabled until the name field is populated.

## 3.8.0 Criteria Id

### 3.8.1 Criteria Id

AC-008

### 3.8.2 Scenario

System prevents order placement outside of all active zones

### 3.8.3 Scenario Type

Alternative_Flow

### 3.8.4 Given

An active operational zone 'Mumbai South' is defined, and a customer is on the checkout page

### 3.8.5 When

The customer enters a delivery address that is geographically outside the 'Mumbai South' polygon

### 3.8.6 Then

The system validates the address against all active zones, determines it is outside, and displays a clear error message to the customer, such as 'Sorry, we do not currently deliver to this address.' The customer is prevented from proceeding with the order.

### 3.8.7 Validation Notes

This requires integration with the order placement logic. Test with addresses just inside and just outside the boundary to confirm precision.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Interactive map display (e.g., Mapbox)
- Polygon drawing tools (add, move, delete vertex)
- A list view of all zones with columns for 'Name' and 'Status'
- Form fields for 'Zone Name' (text input) and 'Status' (dropdown/toggle: Active/Inactive)
- Action buttons: 'Create New Zone', 'Save', 'Cancel', 'Edit', 'Delete'
- Confirmation modal for delete actions

## 4.2.0 User Interactions

- Admin can pan and zoom the map.
- Admin can click on the map to draw a polygon by adding vertices.
- Admin can drag existing vertices to edit a polygon's shape.
- Clicking a zone in the list view should center the map on that zone and select it for editing.
- Selecting a zone on the map should populate the form fields with its details.

## 4.3.0 Display Requirements

- Active and Inactive zones must be visually distinguishable on the map (e.g., by color).
- The currently selected zone for editing should be highlighted.
- All user-facing error messages must be clear and actionable.

## 4.4.0 Accessibility Needs

- All form elements must have associated labels.
- Map controls should be keyboard accessible.
- Color contrast for zone statuses must meet WCAG 2.1 AA standards.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-ZONE-001

### 5.1.2 Rule Description

A zone must be defined by a valid, non-self-intersecting, closed polygon.

### 5.1.3 Enforcement Point

Backend API upon create/update request.

### 5.1.4 Violation Handling

The API request is rejected with a 400 Bad Request status and an error message.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-ZONE-002

### 5.2.2 Rule Description

Each operational zone must have a unique, non-empty name.

### 5.2.3 Enforcement Point

Backend API upon create/update request.

### 5.2.4 Violation Handling

The API request is rejected with a 400 Bad Request status and an error message.

## 5.3.0 Rule Id

### 5.3.1 Rule Id

BR-ZONE-003

### 5.3.2 Rule Description

New customer orders can only be placed for delivery addresses that fall within at least one 'Active' operational zone.

### 5.3.3 Enforcement Point

Order Management service during the address validation step of checkout.

### 5.3.4 Violation Handling

The order placement is blocked, and an error message is returned to the customer.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

- {'story_id': 'ADM-003', 'dependency_reason': 'Requires the admin role and login functionality to be in place to secure this feature.'}

## 6.2.0 Technical Dependencies

- Admin dashboard front-end application shell must be created.
- PostgreSQL database with PostGIS extension enabled and configured across all environments.
- Integration with Mapbox API for map rendering and geocoding services (as per REQ-INT-003).
- Backend authentication and authorization middleware to enforce RBAC for the API endpoints.

## 6.3.0 Data Dependencies

- This story creates the foundational geofence data that will be consumed by the Order Management service.

## 6.4.0 External Dependencies

- Availability of the Mapbox mapping service API.

# 7.0.0 Non Functional Requirements

## 7.1.0 Performance

- The map interface with up to 50 zones must load in under 3 seconds.
- Saving or updating a zone should have an API response time (P95) of under 500ms.
- The point-in-polygon check during order placement must add less than 50ms to the checkout validation process.

## 7.2.0 Security

- Access to the zone management page and its corresponding APIs must be strictly restricted to users with the 'Administrator' role.
- All create, update, and delete actions on zones must be logged in an immutable audit trail, as per REQ-FUN-019.
- Input data (zone name) must be sanitized to prevent XSS attacks.

## 7.3.0 Usability

- The polygon drawing tool should be intuitive for a non-technical user.
- Error messages should be clear and guide the user to a solution.

## 7.4.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards, as per REQ-INT-001.

## 7.5.0 Compatibility

- The admin dashboard must be fully functional on the latest versions of Chrome, Firefox, and Safari.

# 8.0.0 Implementation Considerations

## 8.1.0 Complexity Assessment

Medium

## 8.2.0 Complexity Factors

- Frontend: Requires integration of a third-party mapping library (Mapbox) and implementation of custom UI for drawing and editing polygons.
- Backend: Requires use of a specialized database extension (PostGIS) and writing spatial queries. The API must handle GeoJSON data format.
- Infrastructure: The PostGIS extension needs to be provisioned and managed in the cloud environment (AWS RDS).

## 8.3.0 Technical Risks

- Team's potential lack of experience with PostGIS could slow down backend development.
- The complexity of the map drawing UI could lead to bugs or poor user experience if not carefully designed and tested.

## 8.4.0 Integration Points

- Order Management Service: Will need to call a new endpoint or query the database to validate delivery addresses against active zones.
- Audit Service: The zone management API must publish events for create/update/delete actions to the audit log.

# 9.0.0 Testing Requirements

## 9.1.0 Testing Types

- Unit
- Integration
- E2E
- Usability

## 9.2.0 Test Scenarios

- Full CRUD lifecycle of an operational zone.
- Validation of invalid inputs (self-intersecting polygon, empty name).
- E2E test of order placement for an address inside an active zone (success).
- E2E test of order placement for an address inside an inactive zone (failure).
- E2E test of order placement for an address outside any zone (failure).
- Verification of audit log entries for all state-changing actions.

## 9.3.0 Test Data Needs

- Pre-defined set of geographic coordinates for addresses both inside and outside test zones.
- At least two admin user accounts for testing access control.

## 9.4.0 Testing Tools

- Cypress for E2E testing.
- Jest/React Testing Library for frontend unit tests.
- Postman or similar for API integration testing.

# 10.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >80% coverage
- E2E tests for critical paths are automated and passing
- User interface reviewed and approved for usability and accessibility
- Performance of spatial queries and API endpoints meets specified requirements
- Security requirements (RBAC, audit logging) are implemented and validated
- Technical documentation for the zone management API and PostGIS schema is created/updated
- Story deployed and verified in the staging environment

# 11.0.0 Planning Information

## 11.1.0 Story Points

8

## 11.2.0 Priority

🔴 High

## 11.3.0 Sprint Considerations

- This is a foundational feature and a blocker for any market launch. It should be prioritized early in the project.
- An infrastructure task to enable the PostGIS extension on AWS RDS should precede this story or be done in parallel.
- Requires both significant frontend (map UI) and backend (spatial DB) effort.

## 11.4.0 Release Impact

- Critical for the initial platform launch and any subsequent geographical expansion.

