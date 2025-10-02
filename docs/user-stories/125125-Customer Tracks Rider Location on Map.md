# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | CUS-028 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Customer Tracks Rider Location on Map |
| As A User Story | As a customer who has placed an order that is out ... |
| User Persona | A registered customer using the mobile application... |
| Business Value | Increases customer satisfaction and trust by provi... |
| Functional Area | Customer-Facing Features |
| Story Theme | Live Order Tracking |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Happy Path: Display live tracking map when order is picked up

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a customer has an active order and its status is updated to 'In Transit' (or 'Picked Up')

### 3.1.5 When

the customer views the order details screen

### 3.1.6 Then

a map view is displayed, showing distinct icons for the vendor's location, the customer's delivery address, and the rider's current location.

### 3.1.7 Validation Notes

Verify the map appears automatically when the order status changes. Check that all three icons are present and correctly positioned.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Real-time location updates for the rider

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

the customer is viewing the live tracking map

### 3.2.5 When

the rider's location changes

### 3.2.6 Then

the rider's icon on the map updates its position automatically every 5-10 seconds without requiring a manual refresh.

### 3.2.7 Validation Notes

Use a location simulator for the rider app to verify the customer app's map updates smoothly and within the specified time interval.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Map is not shown for non-delivery order states

### 3.3.3 Scenario Type

Edge_Case

### 3.3.4 Given

a customer has an order with a status of 'Preparing' or 'Pending Vendor Acceptance'

### 3.3.5 When

the customer views the order details screen

### 3.3.6 Then

the live tracking map view is not displayed.

### 3.3.7 Validation Notes

Check the order screen for orders in various states before pickup to ensure the map is hidden.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Handling temporary loss of rider's GPS signal

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

the customer is viewing the live tracking map

### 3.4.5 When

the system stops receiving location updates from the rider's device

### 3.4.6 Then

the map displays the rider's last known location, and a visual indicator (e.g., a timestamp of the last update) is shown next to the rider's icon.

### 3.4.7 Validation Notes

Simulate a network disconnect on the rider's device and verify the customer's app displays the last location with the timestamp.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Tracking stops when order is delivered

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

the customer is viewing the live tracking map

### 3.5.5 When

the rider updates the order status to 'Delivered'

### 3.5.6 Then

the live tracking map is removed from the screen, and the view updates to show the final order status.

### 3.5.7 Validation Notes

Confirm that upon delivery, the map interface is cleanly removed and the real-time connection is terminated for that order.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Performance of location update propagation

### 3.6.3 Scenario Type

Happy_Path

### 3.6.4 Given

the rider's device sends a location data payload to the backend

### 3.6.5 When

the data is processed and broadcast to the customer's device

### 3.6.6 Then

the total latency from rider transmission to customer map update is under 2 seconds.

### 3.6.7 Validation Notes

This requires instrumented logging or a performance test environment to measure the end-to-end latency.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Interactive map canvas (e.g., Mapbox component)
- Custom icon for Vendor location (static)
- Custom icon for Customer location (static)
- Custom icon for Rider location (dynamic, potentially with a direction indicator)
- Text display for Estimated Time of Arrival (ETA)
- Timestamp display for 'last updated' time when GPS signal is lost

## 4.2.0 User Interactions

- User can pan and zoom the map.
- Tapping on an icon could show a label (e.g., 'Your Location', 'Restaurant Name').

## 4.3.0 Display Requirements

- The map should initially be zoomed to fit the vendor, rider, and customer locations.
- As the rider moves, the map can optionally re-center to keep the rider and destination in view.

## 4.4.0 Accessibility Needs

- The ETA text must be readable by screen readers.
- Ensure sufficient color contrast for icons and text against the map background.

# 5.0.0 Business Rules

- {'rule_id': 'BR-001', 'rule_description': "Live tracking is only enabled for orders in the 'In Transit' state.", 'enforcement_point': 'Customer mobile application and backend logic.', 'violation_handling': 'The map interface is not rendered or activated if the order is not in the correct state.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-016

#### 6.1.1.2 Dependency Reason

The 'Picked Up' status update from the rider is the trigger to start the live tracking feature for the customer.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

RDR-019

#### 6.1.2.2 Dependency Reason

The 'Delivered' status update from the rider is the trigger to stop the live tracking feature.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

CUS-027

#### 6.1.3.2 Dependency Reason

This story provides the parent UI screen ('Order Status') where the map view will be embedded.

## 6.2.0.0 Technical Dependencies

- A backend service (e.g., Rider Logistics microservice) capable of ingesting high-frequency location data.
- A real-time communication layer (e.g., WebSocket server using Socket.IO) to push updates to clients.
- Rider mobile application must have a component to periodically send GPS coordinates to the backend.
- Customer mobile application must have the mapping SDK (Mapbox) integrated.

## 6.3.0.0 Data Dependencies

- Requires access to the order's current state from the Order Management service.
- Requires access to vendor and customer address coordinates.
- Requires a live stream of rider coordinates for the specific order.

## 6.4.0.0 External Dependencies

- Mapbox API for map tiles, rendering, and potentially ETA calculation. (Ref: REQ-INT-003)

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- Latency for location updates from rider device to customer app shall be under 2 seconds (REQ-FUN-008).
- The location data payload must be lightweight (latitude, longitude, timestamp, accuracy) to minimize bandwidth usage.
- Map rendering and animations on the customer app must be smooth and not impact overall app performance.

## 7.2.0.0 Security

- All location data must be transmitted over secure channels (HTTPS/WSS) as per REQ-INT-004.
- Customers should only be able to access location data for the rider assigned to their active order.

## 7.3.0.0 Usability

- The map should be intuitive and easy to understand with minimal clutter.
- The distinction between vendor, rider, and customer icons must be clear.

## 7.4.0.0 Accessibility

- Compliant with WCAG 2.1 Level AA for all non-map UI elements on the screen.

## 7.5.0.0 Compatibility

- The feature must function correctly on all supported iOS and Android versions.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires coordination across three components: Customer App, Rider App, and Backend.
- Implementation of a scalable and resilient WebSocket infrastructure.
- Optimizing battery consumption on the rider's device due to continuous GPS usage.
- Handling connection/disconnection events and state management in a real-time environment.

## 8.3.0.0 Technical Risks

- High API costs from the mapping service if not implemented efficiently.
- Potential for significant battery drain on rider devices if background location services are not optimized.
- Scalability of the WebSocket layer under high load (e.g., thousands of concurrent deliveries).

## 8.4.0.0 Integration Points

- Rider App -> Rider Logistics Service (via HTTP/MQTT)
- Rider Logistics Service -> WebSocket Service (via message bus like SQS/SNS)
- WebSocket Service <-> Customer App (via Secure WebSockets)

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Performance
- Usability

## 9.2.0.0 Test Scenarios

- Verify map appears and disappears based on order status changes.
- Simulate rider movement and verify smooth updates on the customer map.
- Simulate network loss for the rider and verify the 'last known location' feature.
- Test with multiple concurrent orders to ensure data is not crossed between them.
- Verify map interactions (pan, zoom) work as expected.

## 9.3.0.0 Test Data Needs

- Test accounts for a customer, a vendor, and a rider.
- An order created and progressed to the 'In Transit' state.
- A tool to simulate and send GPS coordinates for the rider.

## 9.4.0.0 Testing Tools

- React Native testing libraries (Jest, React Testing Library).
- Cypress for E2E testing if a web-based simulator is used.
- Mobile device emulators with GPS simulation capabilities.
- Load testing tools for the WebSocket server (e.g., k6).

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by team
- Unit tests implemented and passing with >80% coverage
- Integration testing between Rider App, Backend, and Customer App completed successfully
- User interface reviewed and approved by UX team
- Performance requirements (latency < 2s) verified under simulated load
- Security requirements validated (secure channels, data isolation)
- Documentation for the location update WebSocket API is created/updated
- Story deployed and verified in staging environment using two physical devices

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- Requires parallel work from frontend (customer app), mobile (rider app), and backend teams.
- Close collaboration is needed to define the data contract for the location payload.
- Availability of the mapping service (Mapbox) API keys and SDKs for all environments is a prerequisite.

## 11.4.0.0 Release Impact

This is a critical feature for a competitive customer experience and a key part of the core order fulfillment loop.

