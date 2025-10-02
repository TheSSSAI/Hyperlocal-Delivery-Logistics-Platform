# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | CUS-029 |
| Elaboration Date | 2025-01-18 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Customer Sees Rider's Last Known Location with Tim... |
| As A User Story | As a customer tracking my active order, I want to ... |
| User Persona | A customer who has placed an order and is actively... |
| Business Value | Improves user experience by managing expectations ... |
| Functional Area | Customer-Facing Features |
| Story Theme | Live Order Tracking |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

CUS-029-AC-01

### 3.1.2 Scenario

Display of last known location when GPS signal is lost

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a customer is viewing the live order tracking map, and the rider's location is updating in real-time

### 3.1.5 When

the backend does not receive a location update from the rider's device for a configurable period (e.g., 30 seconds)

### 3.1.6 Then

the rider's icon on the map remains fixed at the last successfully received coordinate

### 3.1.7 And

a user-friendly timestamp (e.g., 'Last seen 1 min ago') is displayed near the rider's icon.

### 3.1.8 Validation Notes

Verify by simulating a stop in location data transmission from the rider's device. Check the customer's app for the UI change and the correct display of the last known location and timestamp.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

CUS-029-AC-02

### 3.2.2 Scenario

Restoration of live tracking when GPS signal returns

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

the customer's map is displaying the rider's last known location due to a signal loss

### 3.2.5 When

the backend receives a new, valid location update from the rider's device

### 3.2.6 Then

the visual indicator for stale data (e.g., reduced opacity) is removed, and the icon returns to its normal state

### 3.2.7 And

the rider's icon moves to the new location and resumes updating in real-time.

### 3.2.8 Validation Notes

After simulating a signal loss, resume sending location data. Verify that the customer's app UI reverts to the standard live tracking display smoothly.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

CUS-029-AC-03

### 3.3.2 Scenario

Initial tracking screen state before first GPS coordinate is received

### 3.3.3 Scenario Type

Edge_Case

### 3.3.4 Given

a rider has picked up an order, and the customer opens the tracking map

### 3.3.5 When

the system has not yet received the first location coordinate from the rider

### 3.3.6 Then

the map should not display the rider icon

### 3.3.7 And

a message such as 'Waiting for rider's location...' should be displayed to the customer.

### 3.3.8 Validation Notes

Test the state of the tracking screen immediately after an order is marked 'Picked Up' but before the rider's device has transmitted its first location ping.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

CUS-029-AC-04

### 3.4.2 Scenario

Handling of prolonged GPS signal loss

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

the rider's GPS signal has been lost and the map is showing the last known location

### 3.4.5 When

the signal remains lost for an extended, configurable period (e.g., 5 minutes)

### 3.4.6 Then

a more prominent, non-intrusive message (e.g., a banner at the top of the map) is displayed, stating 'We're having trouble with live tracking. Your order is on its way.'

### 3.4.7 Validation Notes

Simulate a signal loss for longer than the configured threshold and verify the prominent message appears, while the last known location remains on the map.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Rider icon on the map
- Text label for timestamp (e.g., 'Last seen X mins ago')
- Banner/overlay for prolonged signal loss message

## 4.2.0 User Interactions

- The transition between live tracking and 'last known location' mode must be smooth and not require a screen reload.

## 4.3.0 Display Requirements

- The rider icon must have a visually distinct state (e.g., 50% opacity) to indicate stale data.
- The timestamp must be relative and human-readable (e.g., 'just now', '1 min ago').

## 4.4.0 Accessibility Needs

- The change in icon state should not rely on color alone. The presence of the timestamp text provides an alternative indicator.

# 5.0.0 Business Rules

- {'rule_id': 'BR-LKL-01', 'rule_description': "A rider's GPS signal is considered 'lost' if no new location data is received within a system-configurable time period.", 'enforcement_point': 'Backend location processing service.', 'violation_handling': 'N/A - This is a system state trigger.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

CUS-028

#### 6.1.1.2 Dependency Reason

This story enhances the core live rider tracking feature. The base map and real-time location update functionality must exist first.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

RDR-016

#### 6.1.2.2 Dependency Reason

Depends on the rider's ability to mark an order as 'Picked Up', which initiates the tracking phase for the customer.

## 6.2.0.0 Technical Dependencies

- Backend WebSocket service for real-time communication (Socket.IO).
- Customer mobile application's map component (Mapbox).
- Rider application's background location service.

## 6.3.0.0 Data Dependencies

- A continuous stream of rider location data payloads, each including latitude, longitude, and a timestamp.

## 6.4.0.0 External Dependencies

- Availability of the Mapbox API for rendering the map tiles.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The latency for the UI to update after a signal loss is detected by the backend should be under 1 second.
- The backend check for signal loss must be efficient and not add significant overhead to the location processing service.

## 7.2.0.0 Security

- All communication, including location data and status events, must be transmitted over a secure channel (WSS).

## 7.3.0.0 Usability

- The visual cues and text must be clear and unambiguous to the user, effectively communicating the status without causing confusion.

## 7.4.0.0 Accessibility

- WCAG 2.1 Level AA compliance for text and contrast ratios on displayed messages.

## 7.5.0.0 Compatibility

- Functionality must be consistent across all supported iOS and Android versions.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires state management on both the backend (detecting timeouts) and frontend (managing UI states).
- Involves defining and implementing new WebSocket events (e.g., `rider_signal_lost`, `rider_signal_restored`).
- Testing the failure/recovery path can be complex to automate.

## 8.3.0.0 Technical Risks

- Potential for race conditions if location updates and timeout events are not handled atomically.
- Defining a timeout value that is sensitive enough to be useful but not so short that it triggers on minor network hiccups.

## 8.4.0.0 Integration Points

- Backend Rider Logistics service: Needs logic to detect missed pings and emit status events.
- Customer mobile application: Needs to subscribe to and handle the new status events to update the UI.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- Simulate a rider's network connection dropping and verify the customer's UI updates correctly.
- Simulate the rider's network connection being restored and verify the UI reverts to live tracking.
- Test the initial screen state before any location data is sent.
- Test the prolonged signal loss scenario by maintaining the disconnected state for longer than the configured threshold.

## 9.3.0.0 Test Data Needs

- Test accounts for a customer and a rider.
- An active order assigned to the test rider.
- A mechanism to start, stop, and resume the transmission of mock location data for the test rider.

## 9.4.0.0 Testing Tools

- A WebSocket client/mocking tool to simulate the rider's app behavior for integration testing.
- Cypress or a similar E2E framework capable of mocking WebSocket events.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code for backend timeout logic and frontend UI state management is peer-reviewed and merged.
- Unit and integration tests are implemented with sufficient coverage and are passing.
- Manual E2E testing has confirmed the functionality works as expected on both iOS and Android.
- The signal loss timeout duration is implemented as a configurable parameter on the backend.
- UI changes have been reviewed and approved by a UX designer.
- Documentation for the new WebSocket events is created or updated.
- Story deployed and verified in staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a high-impact UX improvement for a core feature. It should be prioritized soon after the initial live tracking feature is stable.
- Requires coordinated work between backend and mobile frontend developers.

## 11.4.0.0 Release Impact

- Significantly enhances the reliability and user perception of the order tracking feature.

