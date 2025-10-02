# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | CUS-027 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Customer Views Real-Time Order Status |
| As A User Story | As a customer who has placed an order, I want to v... |
| User Persona | A registered customer who has an active or recentl... |
| Business Value | Increases customer trust and satisfaction by provi... |
| Functional Area | Customer-Facing Features |
| Story Theme | Order Management & Tracking |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Display of 'Pending Vendor Acceptance' status

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a customer has successfully placed an order and its status is 'Pending Vendor Acceptance'

### 3.1.5 When

the customer navigates to the order details screen

### 3.1.6 Then

the screen must display a user-friendly status like 'Waiting for vendor to accept your order' and the visual progress indicator must show this as the first active step.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Display of 'Preparing' status

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

a customer's order has been accepted by the vendor and its status is 'Preparing'

### 3.2.5 When

the customer views the order details screen

### 3.2.6 Then

the screen must display a user-friendly status like 'Your order is being prepared' and the visual progress indicator must show 'Order Accepted' as complete and 'Preparing' as the active step.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Real-time status update from 'Preparing' to 'Ready for Pickup'

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

a customer is viewing the order details screen for an order with status 'Preparing'

### 3.3.5 When

the vendor updates the order status to 'Ready for Pickup'

### 3.3.6 Then

the customer's screen must automatically update to a status like 'Ready for pickup' within 2 seconds, without requiring a manual refresh.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Display of 'In Transit' status

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

a rider has picked up the customer's order and its status is 'In Transit'

### 3.4.5 When

the customer views the order details screen

### 3.4.6 Then

the screen must display a user-friendly status like 'Your order is on its way' and the visual progress indicator must update to show this as the active step.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Display of 'Delivered' status for a completed order

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

a customer's order has been successfully delivered

### 3.5.5 When

the customer views the order in their order history

### 3.5.6 Then

the screen must display a final status of 'Delivered' and the visual progress indicator must show all steps as complete.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Display of 'Cancelled' status

### 3.6.3 Scenario Type

Edge_Case

### 3.6.4 Given

a customer's order has been cancelled (by any party)

### 3.6.5 When

the customer views the order details screen

### 3.6.6 Then

the screen must clearly display the status as 'Cancelled' and the visual progress indicator must be in a final, cancelled state.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Display of 'Allocation Failed' status

### 3.7.3 Scenario Type

Edge_Case

### 3.7.4 Given

the system fails to assign a rider to an order after multiple attempts

### 3.7.5 When

the customer views the order details screen

### 3.7.6 Then

the screen must display a user-friendly status like 'We're having trouble finding a rider' and provide information on next steps.

## 3.8.0 Criteria Id

### 3.8.1 Criteria Id

AC-008

### 3.8.2 Scenario

Handling of network connectivity loss

### 3.8.3 Scenario Type

Error_Condition

### 3.8.4 Given

a customer is viewing the real-time status of an active order

### 3.8.5 When

their mobile device loses internet connectivity

### 3.8.6 Then

the app must display the last known status with a timestamp and a visual indicator that the connection is lost, and it must attempt to reconnect automatically when connectivity is restored.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A visual progress indicator (e.g., a vertical stepper with icons for each stage).
- A clear text label for the current order status.
- A section displaying key order details (Order ID, Vendor Name, ETA).
- A non-intrusive indicator for network connection loss.

## 4.2.0 User Interactions

- The status and progress indicator must update automatically in real-time.
- The screen should not require any user interaction (e.g., pull-to-refresh) to get status updates.

## 4.3.0 Display Requirements

- Completed stages in the progress indicator must be visually distinct from the active and upcoming stages (e.g., using checkmarks and color-coding).
- The mapping from backend states to user-facing text must be consistent: 'Pending Vendor Acceptance' -> 'Waiting for vendor', 'Preparing' -> 'Preparing your order', 'In Transit' -> 'On its way', etc.

## 4.4.0 Accessibility Needs

- All status text must have sufficient color contrast to meet WCAG 2.1 AA standards.
- The screen must be navigable via screen readers, which should announce status updates as they occur.

# 5.0.0 Business Rules

- {'rule_id': 'BR-CUS-027-01', 'rule_description': 'Order status information is considered sensitive and must only be accessible to the customer who placed the order and authorized platform administrators.', 'enforcement_point': 'API Gateway and Order Management Service.', 'violation_handling': 'API request will be rejected with a 403 Forbidden or 404 Not Found status.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

CUS-026

#### 6.1.1.2 Dependency Reason

An order must be created and confirmed before its status can be viewed.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

VND-017

#### 6.1.2.2 Dependency Reason

The 'Accepted' and 'Preparing' statuses are triggered by vendor actions defined in this story.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

RDR-016

#### 6.1.3.2 Dependency Reason

The 'In Transit' status is triggered by the rider action of picking up the order.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

RDR-019

#### 6.1.4.2 Dependency Reason

The final 'Delivered' status is triggered by the rider completing the delivery.

## 6.2.0.0 Technical Dependencies

- Order Management microservice must publish state change events.
- A real-time messaging service (e.g., using WebSockets via Socket.IO as per REQ-TEC-001) must be implemented to push updates to clients.
- API Gateway must be configured to handle WebSocket connections (WSS as per REQ-INT-004).

## 6.3.0.0 Data Dependencies

- Access to the immutable order event log (REQ-FUN-017) to reconstruct and display order history if needed.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The latency for a status update on the backend to be reflected on the customer's UI shall be under 2 seconds (P95).
- The real-time connection must be lightweight to minimize battery and data consumption on the client device.

## 7.2.0.0 Security

- All communication for status updates must occur over a secure WebSocket connection (WSS).
- The API endpoint for fetching initial order status must enforce ownership, ensuring users can only view their own orders.

## 7.3.0.0 Usability

- The visual progress indicator must be intuitive and easy to understand at a glance.
- Status messages must be clear, concise, and free of technical jargon.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA guidelines.

## 7.5.0.0 Compatibility

- The feature must function correctly on all supported versions of iOS and Android as defined by the project.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires both frontend and backend implementation for the real-time communication channel.
- Managing the lifecycle of WebSocket connections, including authentication, disconnection, and reconnection logic, adds complexity.
- Ensuring the event-driven architecture is robust and scalable to handle a large number of concurrent orders and clients.

## 8.3.0.0 Technical Risks

- Potential for high resource consumption on the server if WebSocket connections are not managed efficiently.
- Message delivery is not guaranteed on unreliable mobile networks; a mechanism to fetch the latest state upon reconnection is critical.

## 8.4.0.0 Integration Points

- Frontend client with the real-time WebSocket service.
- Real-time service with the message bus (SQS/SNS) that carries order state change events from the Order Management service.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Performance
- Usability

## 9.2.0.0 Test Scenarios

- Verify each status transition in the happy path.
- Test the UI update when an order is cancelled.
- Simulate network loss and recovery to test reconnection logic.
- Test the flow for an order that fails rider allocation.
- Verify that a user cannot access the status of another user's order.

## 9.3.0.0 Test Data Needs

- Test accounts for customers, vendors, and riders.
- Orders in each of the possible lifecycle states ('Pending', 'Preparing', 'Cancelled', etc.).

## 9.4.0.0 Testing Tools

- Jest and React Testing Library for frontend unit tests.
- Cypress for E2E testing, including mocking WebSocket events.
- Backend testing frameworks for integration tests of the event publishing and delivery pipeline.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >= 80% code coverage
- E2E tests for the real-time update flow are created and passing
- User interface reviewed and approved by UX/UI designer
- Performance requirement for update latency is verified
- Security requirements for secure communication and data access are validated
- Documentation for the real-time events and API is updated
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a core feature of the post-purchase experience and a high priority for customers.
- Backend event publishing infrastructure should be in place before frontend work can be fully tested.
- Coordination between frontend and backend developers is crucial for defining the WebSocket event schema.

## 11.4.0.0 Release Impact

- Significantly enhances the customer experience and is a key feature for the initial launch.

