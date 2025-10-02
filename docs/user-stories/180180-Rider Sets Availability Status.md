# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-009 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider Sets Availability Status |
| As A User Story | As a registered Rider, I want a simple toggle to s... |
| User Persona | A registered and approved Rider who is logged into... |
| Business Value | Provides riders with autonomy and flexibility over... |
| Functional Area | Rider-Facing Features |
| Story Theme | Rider Task Management & Availability |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

RDR-009-AC-01

### 3.1.2 Scenario

Rider successfully goes online

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a registered and logged-in rider is on the main screen of the rider application and their current status is 'Offline'

### 3.1.5 When

the rider taps the availability toggle to set their status to 'Online'

### 3.1.6 Then

the UI element visually updates to an 'Online' state, a request is sent to the backend to update the status, the rider is added to the pool of available riders for the allocation service, and the device begins sending periodic location updates.

### 3.1.7 Validation Notes

Verify the UI change. Check the backend API call is successful (200 OK). Query the rider's status in the database to confirm it's 'Online'. The Rider Logistics service should now see this rider as available.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

RDR-009-AC-02

### 3.2.2 Scenario

Rider successfully goes offline

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

a registered and logged-in rider is on the main screen, their current status is 'Online', and they have no active delivery tasks

### 3.2.5 When

the rider taps the availability toggle to set their status to 'Offline'

### 3.2.6 Then

the UI element visually updates to an 'Offline' state, a request is sent to the backend to update the status, and the rider is immediately removed from the pool of available riders for new task assignments.

### 3.2.7 Validation Notes

Verify the UI change. Check the backend API call is successful (200 OK). Confirm the rider's status is 'Offline' in the database. The Rider Logistics service should no longer see this rider as available for new tasks.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

RDR-009-AC-03

### 3.3.2 Scenario

Rider attempts to go offline with an active delivery task

### 3.3.3 Scenario Type

Edge_Case

### 3.3.4 Given

a rider has an active delivery task with a status of 'Accepted', 'Arrived at Store', 'Picked Up', or 'In Transit'

### 3.3.5 When

the rider attempts to toggle their status to 'Offline'

### 3.3.6 Then

the system prevents the status change, a non-intrusive message is displayed (e.g., 'You cannot go offline during an active delivery'), the UI element remains in the 'Online' state, and the rider's backend status remains 'Online'.

### 3.3.7 Validation Notes

Set up a test order assigned to the rider. Attempt to toggle status. Verify the error message appears and the database status for the rider remains 'Online'.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

RDR-009-AC-04

### 3.4.2 Scenario

Status change fails due to network error

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

a rider is logged into the app and attempts to change their availability status

### 3.4.5 When

the device has no network connectivity

### 3.4.6 Then

the UI provides immediate feedback that the action failed, the toggle reverts to its previous state, and a user-friendly error message is displayed (e.g., 'Network error. Could not update status.').

### 3.4.7 Validation Notes

Use a network proxy tool or airplane mode to simulate network loss. Attempt to toggle the status and observe the UI behavior and error message.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

RDR-009-AC-05

### 3.5.2 Scenario

App launch reflects correct persisted status

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

a rider has previously set their status to 'Online' and then closed the application

### 3.5.5 When

the rider re-launches the application and logs in

### 3.5.6 Then

the availability toggle correctly displays their last known status ('Online') fetched from the backend.

### 3.5.7 Validation Notes

Set status to 'Online', force-close the app, re-open it, and verify the toggle's initial state is 'Online'.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A prominent toggle switch or button on the main/home screen of the rider application.

## 4.2.0 User Interactions

- A single tap on the element should initiate the status change.
- The element should provide immediate visual feedback (e.g., a loading state) while the backend call is in progress.

## 4.3.0 Display Requirements

- The 'Online' and 'Offline' states must be visually distinct using both color (e.g., green for Online, grey for Offline) and a clear text label.
- A toast or snackbar notification should be used for displaying error messages.

## 4.4.0 Accessibility Needs

- The toggle must be compatible with screen readers, announcing its current state and purpose.
- Sufficient color contrast must be used for the different states to be legible for users with low vision.

# 5.0.0 Business Rules

- {'rule_id': 'BR-RDR-STATUS-01', 'rule_description': "A rider cannot set their status to 'Offline' if they have an active, uncompleted delivery task.", 'enforcement_point': 'Backend API endpoint for updating rider status.', 'violation_handling': 'The API request will be rejected with a 409 Conflict (or similar) status code and an error message. The client application will display this message to the user.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-004

#### 6.1.1.2 Dependency Reason

Rider must be able to log in to access the main screen where the availability toggle is located.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-003

#### 6.1.2.2 Dependency Reason

Rider account must be approved by an admin before they are eligible to go online and work.

## 6.2.0.0 Technical Dependencies

- A backend service ('Rider Logistics' or similar) with a database table to store rider status.
- A protected API endpoint (e.g., PATCH /api/v1/riders/me/status) to handle status updates.
- The Rider Allocation service (REQ-FUN-018) must be able to access the rider's online status to build its pool of available riders.

## 6.3.0.0 Data Dependencies

- Requires access to the rider's current task assignments to enforce the 'no offline with active task' rule.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The latency for a status update (from user tap to UI confirmation on a stable 4G connection) must be under 1 second.
- The Rider Allocation service must be aware of the status change within 5 seconds to ensure the available rider pool is near real-time.

## 7.2.0.0 Security

- The API endpoint for changing status must be authenticated and authorized, ensuring a rider can only change their own status.
- The system should log all status changes with a timestamp for auditing and support purposes.

## 7.3.0.0 Usability

- The toggle must be easily discoverable and accessible from the primary screen of the rider app.

## 7.4.0.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The feature must function correctly on all supported iOS and Android versions.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires inter-service communication between the Rider service and the Order/Delivery service to check for active tasks before allowing a status change to 'Offline'.
- Requires a robust mechanism (e.g., event sourcing, pub/sub) to notify the Rider Allocation service of status changes in near real-time without tight coupling.

## 8.3.0.0 Technical Risks

- Potential for race conditions if a rider is assigned a task at the exact moment they are trying to go offline. The transaction must be atomic.
- Latency in propagating the status change to the allocation service could result in attempts to assign tasks to riders who just went offline.

## 8.4.0.0 Integration Points

- Rider Service: Manages and persists the rider's status.
- Order Management Service: Must be queried to check for a rider's active tasks.
- Rider Allocation Service: Consumes the rider's status to determine eligibility for new tasks.
- API Gateway: Exposes the endpoint for the mobile client.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Usability

## 9.2.0.0 Test Scenarios

- Verify a rider can toggle between Online and Offline states when they have no active tasks.
- Verify a rider is blocked from going Offline when they have an active task.
- Verify the system's behavior during network interruptions.
- Verify that once a rider is Online, they are eligible to receive a new task offer.
- Verify that once a rider is Offline, they do not receive any new task offers.

## 9.3.0.0 Test Data Needs

- Test rider accounts with no active tasks.
- Test rider accounts with an active, in-progress delivery task.

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for frontend unit tests.
- Jest for backend unit/integration tests.
- Cypress or a similar framework for E2E tests.
- Postman or Insomnia for API-level testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >80% code coverage.
- E2E tests for the happy path and key edge cases are automated and passing.
- The UI/UX has been reviewed and approved by the design team.
- Performance criteria for status update latency have been met.
- The feature is documented in the API specification (OpenAPI).
- The feature has been successfully deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

3

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational feature for the rider application and a blocker for any delivery-related stories. It should be prioritized in an early sprint.
- Requires coordination between the teams responsible for the Rider service and the Order service.

## 11.4.0.0 Release Impact

This feature is critical for the Minimum Viable Product (MVP) launch. The platform cannot function without it.

