# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-017 |
| Elaboration Date | 2025-01-24 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider Uses In-App Navigation to Customer |
| As A User Story | As a Rider who has just picked up an order, I want... |
| User Persona | A registered and online Rider who is in the 'In Tr... |
| Business Value | Improves delivery efficiency and speed, enhances E... |
| Functional Area | Rider-Facing Features |
| Story Theme | Delivery Execution |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

RDR-017-AC-01

### 3.1.2 Scenario

Happy Path: Launching Navigation to Customer

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a Rider has updated the order status to 'Picked Up' and is on the active task screen

### 3.1.5 When

the Rider taps the 'Navigate to Customer' button

### 3.1.6 Then

the application shall transition to a full-screen map view displaying an optimized route from the Rider's current GPS location to the customer's geocoded address.

### 3.1.7 And

the map shall display real-time traffic information provided by the mapping service.

### 3.1.8 Validation Notes

Verify that the route displayed is correct and that voice guidance is audible. The initial route calculation and display must complete in under 3 seconds.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

RDR-017-AC-02

### 3.2.2 Scenario

Automatic Re-routing on Deviation

### 3.2.3 Scenario Type

Alternative_Flow

### 3.2.4 Given

a Rider is in active navigation mode

### 3.2.5 When

the Rider deviates from the suggested route

### 3.2.6 Then

the system shall automatically calculate and display a new, optimized route to the destination within 5 seconds.

### 3.2.7 Validation Notes

Use a GPS simulator or perform a field test to drive off the suggested route and confirm that a new route is generated promptly.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

RDR-017-AC-03

### 3.3.2 Scenario

Handling Temporary GPS Signal Loss

### 3.3.3 Scenario Type

Edge_Case

### 3.3.4 Given

a Rider is in active navigation mode

### 3.3.5 When

the device's GPS signal is temporarily lost

### 3.3.6 Then

the application shall display a clear visual indicator (e.g., 'Searching for GPS signal').

### 3.3.7 And

when the GPS signal is reacquired, navigation shall resume automatically from the Rider's new current location.

### 3.3.8 Validation Notes

Test by disabling and re-enabling location services on the device or by testing in an area with known poor GPS reception (e.g., a tunnel).

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

RDR-017-AC-04

### 3.4.2 Scenario

Exiting and Resuming Navigation

### 3.4.3 Scenario Type

Alternative_Flow

### 3.4.4 Given

a Rider is in active navigation mode

### 3.4.5 When

the Rider uses the device's back button or an in-app 'Exit Navigation' control

### 3.4.6 Then

the application shall return to the main delivery task screen.

### 3.4.7 And

a 'Resume Navigation' button shall be visible on the task screen, allowing the Rider to re-enter the navigation view.

### 3.4.8 Validation Notes

Verify that exiting navigation does not cancel the delivery task and that resuming returns the user to the active navigation session.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

RDR-017-AC-05

### 3.5.2 Scenario

Navigation Audio in Background

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

a Rider is in active navigation mode

### 3.5.5 When

the Rider receives a phone call or switches the application to the background

### 3.5.6 Then

the audible turn-by-turn instructions shall continue to play over other audio or during the call.

### 3.5.7 Validation Notes

Initiate a phone call to the test device or press the home button during active navigation to confirm background audio continues.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

RDR-017-AC-06

### 3.6.2 Scenario

Mapping Service API Failure

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

the third-party mapping service API is unavailable

### 3.6.5 When

the Rider attempts to start navigation

### 3.6.6 Then

the application shall display a user-friendly error message, such as 'Navigation service is temporarily unavailable. Please try again shortly.'

### 3.6.7 And

the system shall log this failure for monitoring purposes, as per REQ-DEP-002.

### 3.6.8 Validation Notes

Use a mock server or network interception tool to simulate an API failure from the mapping service and verify the error message is displayed.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A 'Navigate to Customer' button on the active task screen (visible after pickup).
- Full-screen map view for navigation.
- Prominent display for next-turn instruction and distance.
- Clear display of Estimated Time of Arrival (ETA) and remaining distance.
- A 'Re-center' button to focus the map on the rider's current location.
- An 'Exit Navigation' control.

## 4.2.0 User Interactions

- Tapping 'Navigate to Customer' initiates the navigation session.
- Standard map gestures (pinch-to-zoom, pan) should be supported when not in active follow mode.
- The map should automatically orient in the direction of travel.

## 4.3.0 Display Requirements

- The route line should be clearly distinguishable from the map.
- Real-time traffic should be visualized on the map (e.g., using color-coded lines).
- The customer's address pin must be clearly visible as the destination.

## 4.4.0 Accessibility Needs

- Audible turn-by-turn voice guidance is mandatory.
- UI elements must have high contrast for readability in bright daylight.
- All interactive elements must have a minimum touch target size of 44x44 pixels.

# 5.0.0 Business Rules

*No items available*

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-016

#### 6.1.1.2 Dependency Reason

The 'Navigate to Customer' functionality is only triggered after the Rider has confirmed order pickup by updating the status to 'Picked Up'.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

RDR-012

#### 6.1.2.2 Dependency Reason

A rider must first accept a delivery task to have an active order to navigate for.

## 6.2.0.0 Technical Dependencies

- React Native Rider Application shell.
- Successful integration of the Mapbox Navigation SDK (as per REQ-TEC-001).
- Access to the device's GPS hardware and location services.

## 6.3.0.0 Data Dependencies

- The order record must contain a valid, geocoded (latitude/longitude) address for the customer's drop-off location.

## 6.4.0.0 External Dependencies

- Critical dependency on the Mapbox APIs for maps, routing, and real-time traffic data (as per REQ-INT-003 and REQ-DEP-002).

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- Initial route calculation and map display must be < 3 seconds.
- Re-routing calculation must be < 5 seconds.
- The application must remain responsive while navigation is active.
- The implementation should be optimized to minimize battery consumption during navigation.

## 7.2.0.0 Security

- API keys for the mapping service must be securely stored and managed using AWS Secrets Manager, not hardcoded in the client application.

## 7.3.0.0 Usability

- The navigation interface must be simple and intuitive, designed for at-a-glance comprehension by a user who is driving.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA for visual elements where applicable.
- Voice guidance must be clear and timely.

## 7.5.0.0 Compatibility

- Must be fully functional on the last two major versions of iOS and Android.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Integration of a third-party native SDK (Mapbox) into a React Native application.
- Managing the component lifecycle for the navigation view (start, pause, resume, stop).
- Handling background processes for location tracking and audio playback.
- Ensuring consistent behavior and performance across a wide range of Android and iOS devices.
- Optimizing for battery life during prolonged GPS usage.

## 8.3.0.0 Technical Risks

- Potential bugs or limitations within the Mapbox Navigation SDK.
- High cost associated with API usage if not monitored and managed properly.
- Inconsistent GPS accuracy across different hardware.
- App rejection by stores if background location permissions are not justified correctly.

## 8.4.0.0 Integration Points

- Mapbox API (for routing and maps).
- Internal Order Management service (to fetch customer address).
- Device native location services (GPS).

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Usability
- Performance

## 9.2.0.0 Test Scenarios

- Verify navigation starts correctly with a valid address.
- Simulate route deviation and confirm re-routing works.
- Simulate GPS signal loss and recovery.
- Test app backgrounding and foregrounding during navigation.
- Test behavior during an incoming phone call.
- **Critical**: Conduct real-world field testing with riders in moving vehicles to assess accuracy, usability, and performance in a live environment.

## 9.3.0.0 Test Data Needs

- A set of valid geocoded addresses within the pilot operational zone (Mumbai).
- An address that is known to be difficult to geocode to test error handling.
- Test rider accounts with active, assigned orders.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- React Native Testing Library.
- Appium or Cypress for E2E automation.
- GPS simulation tools for development environment.
- Real devices for field testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >80% coverage for new code.
- E2E tests for the navigation flow are automated and passing.
- Successful field test report from at least two different riders in a real-world environment is approved.
- Performance metrics (route calculation time, battery usage) are measured and meet requirements.
- All UI elements are reviewed and approved by the UX team.
- Required documentation (e.g., on SDK integration) is updated.
- The feature is deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is blocked by the completion of the order pickup flow (RDR-016).
- Allocate sufficient time within the sprint for real-world device testing, as simulator testing alone is insufficient.
- Requires a developer with experience in integrating native modules into React Native.

## 11.4.0.0 Release Impact

This is a core feature for the rider application and is essential for the Minimum Viable Product (MVP) launch.

