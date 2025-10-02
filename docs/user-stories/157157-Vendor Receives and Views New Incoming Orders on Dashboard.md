# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | VND-016 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Vendor Receives and Views New Incoming Orders on D... |
| As A User Story | As a vendor, I want to be immediately notified of ... |
| User Persona | Vendor (Store Owner/Manager) |
| Business Value | Enables the core order fulfillment process, reduce... |
| Functional Area | Vendor Order Management |
| Story Theme | Order Lifecycle Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Happy Path: New order appears on the dashboard in real-time

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a vendor is logged into their web dashboard and is viewing the main orders screen

### 3.1.5 When

a customer's order for their store transitions to the 'Pending Vendor Acceptance' state

### 3.1.6 Then

an audible notification is triggered, AND the new order appears at the top of the 'New Orders' list within 3 seconds without requiring a page refresh.

### 3.1.7 Validation Notes

Test using a WebSocket client to verify the message is pushed. Use E2E test (Cypress) to confirm UI update and sound playback.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Order card displays essential summary information

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

a new order has appeared on the vendor dashboard

### 3.2.5 When

the vendor views the order card in the 'New Orders' list

### 3.2.6 Then

the card must clearly display the Order ID, total number of items, the final total amount, and a countdown timer indicating the time remaining to accept the order (defaulting from 5 minutes).

### 3.2.7 Validation Notes

Verify all specified data points are present and correctly formatted on the UI component.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Viewing full order details

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

a new order card is visible on the dashboard

### 3.3.5 When

the vendor clicks on the order card

### 3.3.6 Then

a detailed view or modal is displayed, showing: a full list of items with quantities, special instructions from the customer for the vendor, the payment method ('Prepaid' or 'Cash on Delivery'), and clear 'Accept' and 'Reject' action buttons.

### 3.3.7 Validation Notes

Manually test the click interaction and verify all detailed information is present and accurate.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Edge Case: Customer cancels order while it is pending acceptance

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

a new order is displayed in the vendor's 'New Orders' list

### 3.4.5 When

the customer cancels the order within their 60-second grace period (as per REQ-BR-003)

### 3.4.6 Then

the order card is immediately and automatically removed from the vendor's 'New Orders' list.

### 3.4.7 Validation Notes

Requires an E2E test where a test user places an order and then immediately cancels it, asserting the order disappears from the vendor's view.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Error Condition: Vendor dashboard reconnects after a network outage

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

the vendor's dashboard loses internet connectivity, and one or more new orders arrive during the outage

### 3.5.5 When

the vendor's internet connection is restored

### 3.5.6 Then

the dashboard automatically reconnects and syncs, displaying all orders that arrived during the outage.

### 3.5.7 Validation Notes

Simulate network disconnection in browser developer tools, trigger a new order on the backend, then re-enable the network and verify the order appears.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

System auto-rejects order when acceptance timer expires

### 3.6.3 Scenario Type

Alternative_Flow

### 3.6.4 Given

a new order is displayed on the vendor's dashboard

### 3.6.5 When

the vendor takes no action and the acceptance countdown timer reaches zero

### 3.6.6 Then

the order is automatically removed from the 'New Orders' list, consistent with the system behavior defined in REQ-FUN-010.

### 3.6.7 Validation Notes

This is primarily a backend behavior (SYS-001), but the UI must reflect the change. E2E test by waiting for the timer to expire and asserting the order is removed.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A dedicated 'New Orders' panel or column on the main dashboard.
- Individual 'Order Cards' for each new order.
- A countdown timer visual on each card.
- An 'Order Details' modal or view.
- 'Accept' and 'Reject' buttons.
- A settings toggle to enable/disable the new order notification sound.

## 4.2.0 User Interactions

- New orders are pushed to the UI in real-time.
- Clicking an order card opens the detailed view.
- The countdown timer should visually indicate urgency as time decreases (e.g., color change from green to yellow to red).

## 4.3.0 Display Requirements

- Order summary must show Order ID, item count, total price, and timer.
- Order details must show itemized list, quantities, special instructions, and payment method.

## 4.4.0 Accessibility Needs

- New order notification must have a visual cue in addition to the audible alert.
- All interactive elements must be keyboard accessible and have appropriate ARIA labels, per WCAG 2.1 AA (`REQ-INT-001`).

# 5.0.0 Business Rules

- {'rule_id': 'BR-VND-01', 'rule_description': 'Vendors must accept or reject an order within a configurable time limit (default: 5 minutes).', 'enforcement_point': 'System-level (backend job) and displayed on Vendor Dashboard UI.', 'violation_handling': 'The order is automatically rejected, and the customer is notified. The event is logged for vendor performance analysis (`REQ-FUN-010`).'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

CUS-025

#### 6.1.1.2 Dependency Reason

An order must be successfully created and paid for (or marked as COD) before it can be sent to the vendor.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

VND-004

#### 6.1.2.2 Dependency Reason

The vendor must be able to log in to the dashboard to see incoming orders.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

ADM-014

#### 6.1.3.2 Dependency Reason

The configurable acceptance time limit must be available for the system to enforce the timeout.

## 6.2.0.0 Technical Dependencies

- Order Management microservice to manage order state transitions.
- Real-time communication infrastructure (e.g., WebSocket server using Socket.IO as per `REQ-TEC-001`).
- Event bus (AWS SQS/SNS) for decoupling the Order service from the real-time notification service.

## 6.3.0.0 Data Dependencies

- A successfully created order record in the database with the status 'Pending Vendor Acceptance'.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- P95 latency for the new order appearing on the dashboard after creation must be under 3 seconds.
- The WebSocket connection must be lightweight and not significantly impact browser performance.

## 7.2.0.0 Security

- The WebSocket channel must be authenticated and authorized to ensure a vendor can only receive notifications for their own store's orders (Role-Based Access Control).
- All communication must be over a secure channel (WSS) as per `REQ-INT-004`.

## 7.3.0.0 Usability

- The notification for a new order must be prominent and unambiguous to capture the attention of a potentially busy vendor.
- The information presented must be clear and concise, allowing for a decision (Accept/Reject) with minimal cognitive load.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards (`REQ-INT-001`).

## 7.5.0.0 Compatibility

- The vendor web dashboard must be responsive and function correctly on all modern web browsers (latest versions of Chrome, Firefox, Safari, Edge) on desktop and tablet devices (`REQ-INT-001`).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires both backend (event publishing, WebSocket server) and frontend (WebSocket client, real-time state updates) implementation.
- Ensuring the real-time connection is robust, secure, and handles reconnections gracefully.
- Coordinating the server-side timeout logic with the client-side countdown timer display.

## 8.3.0.0 Technical Risks

- Scalability of the WebSocket server under high load (many concurrently connected vendors).
- Potential for message delivery failure in the real-time pipeline; a fallback polling mechanism might be needed as a backup.

## 8.4.0.0 Integration Points

- Backend: Subscribes to events from the Order Management service.
- Frontend: Integrates with the real-time WebSocket service.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Performance
- Usability

## 9.2.0.0 Test Scenarios

- Verify a new order appears correctly.
- Verify order details are accurate.
- Verify the countdown timer is accurate and synchronized.
- Verify the timeout behavior removes the order.
- Verify the customer cancellation behavior removes the order.
- Verify behavior during network loss and reconnection.

## 9.3.0.0 Test Data Needs

- Test vendor accounts.
- Test customer accounts to place orders.
- Orders with varying numbers of items and special instructions.
- Prepaid and COD order types.

## 9.4.0.0 Testing Tools

- Jest and React Testing Library for frontend unit tests.
- Cypress for E2E tests.
- Browser developer tools for simulating network conditions.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >80% coverage and passing
- E2E tests for happy path and key edge cases are automated and passing
- User interface is responsive and approved by the design/product owner
- Performance requirement of <3s for notification is verified
- Security requirements for the WebSocket channel are validated
- Documentation for the real-time event and WebSocket API is created/updated
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational story for the entire vendor workflow and blocks subsequent order management stories (Accept/Reject).
- Requires close collaboration between frontend and backend developers due to the real-time API contract.

## 11.4.0.0 Release Impact

Critical for the Minimum Viable Product (MVP) launch. The platform cannot function without this feature.

