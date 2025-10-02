# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-019 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider Updates Status to 'Delivered' and Completes ... |
| As A User Story | As a Rider, I want to mark an order as 'Delivered'... |
| User Persona | A registered and active Rider who is currently han... |
| Business Value | This action marks the successful completion of the... |
| Functional Area | Rider-Facing Features |
| Story Theme | Delivery Execution & Status Updates |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

RDR-019-AC-01

### 3.1.2 Scenario

Happy Path: Rider marks order as delivered after completing Proof of Delivery (POD)

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

The rider is logged in, has an active order with the status 'Arrived at Destination', and has successfully completed the required Proof of Delivery (photo or OTP)

### 3.1.5 When

The rider taps the 'Mark as Delivered' button

### 3.1.6 Then

The system updates the order status to 'Delivered', an 'OrderDelivered' event is published, a success confirmation is shown to the rider, and a delivery confirmation notification is sent to the customer.

### 3.1.7 Validation Notes

Verify in the database that the order status is 'Delivered'. Check the order event log for the new state entry. Confirm the 'OrderDelivered' event appears on the message bus (e.g., SQS/SNS). Verify the customer receives a push notification.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

RDR-019-AC-02

### 3.2.2 Scenario

Error Condition: Rider attempts to mark as delivered before completing POD

### 3.2.3 Scenario Type

Error_Condition

### 3.2.4 Given

The rider is logged in and has an active order with the status 'Arrived at Destination'

### 3.2.5 When

The rider attempts to tap the 'Mark as Delivered' button before the POD has been submitted and validated

### 3.2.6 Then

The system prevents the status change and displays a clear, non-intrusive error message, such as 'Please complete Proof of Delivery first.'

### 3.2.7 Validation Notes

The 'Mark as Delivered' button should ideally be disabled until the POD is complete. If enabled, test that tapping it shows the specified error and the order status remains unchanged in the backend.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

RDR-019-AC-03

### 3.3.2 Scenario

System triggers post-delivery workflows

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

An order has just been successfully marked as 'Delivered'

### 3.3.5 When

The 'OrderDelivered' event is processed by downstream services

### 3.3.6 Then

The system must trigger the following actions: 1) The customer is prompted to rate the vendor and rider. 2) The financial module initiates settlement calculations for the rider and vendor. 3) The rider's live location tracking for this specific order is terminated. 4) The rider's status is made available for new task allocations.

### 3.3.7 Validation Notes

Verify that a rating prompt is queued for the customer. Check logs or a test interface for the financial service to confirm settlement processing has started. Confirm the rider's location data is no longer being broadcast for this order. Verify the rider appears as 'available' in the allocation system.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

RDR-019-AC-04

### 3.4.2 Scenario

Edge Case: Network failure during status update

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

The rider has completed the POD and is on the delivery confirmation screen

### 3.4.5 When

The rider taps 'Mark as Delivered' but their device has lost internet connectivity

### 3.4.6 Then

The app must display a 'Syncing...' or 'No Connection' status, queue the update request, and automatically retry sending it once connectivity is restored without requiring further user action.

### 3.4.7 Validation Notes

Use network throttling tools to simulate connection loss. Verify the app queues the request locally and successfully syncs when the connection is restored. The backend API must be idempotent to handle retries safely.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

RDR-019-AC-05

### 3.5.2 Scenario

Security: Unauthorized status update attempt

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

An order (Order-123) is assigned to Rider A

### 3.5.5 When

Rider B attempts to call the API to mark Order-123 as 'Delivered'

### 3.5.6 Then

The system must reject the request with an authorization error (e.g., HTTP 403 Forbidden) and the order status must remain unchanged.

### 3.5.7 Validation Notes

Perform an API-level test using authentication tokens from two different riders to ensure proper authorization is enforced.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A prominent and clearly labeled button, e.g., 'Complete Delivery', on the active task screen.
- A confirmation screen or toast message indicating successful completion.
- A loading indicator while the request is being processed.
- An error message display area for scenarios like missing POD or network failure.

## 4.2.0 User Interactions

- The 'Complete Delivery' button should be disabled until the Proof of Delivery requirement is met.
- Tapping the button triggers the API call to update the order status.
- Upon success, the rider should be navigated away from the completed task screen, either to a summary page or back to the main dashboard.

## 4.3.0 Display Requirements

- The final earnings for the completed delivery (including any tips) should be displayed on the confirmation/summary screen.

## 4.4.0 Accessibility Needs

- The button must have a sufficient tap target size (min 44x44dp).
- All text and feedback messages must be compatible with screen readers, adhering to WCAG 2.1 AA standards.

# 5.0.0 Business Rules

- {'rule_id': 'BR-POD-01', 'rule_description': "An order cannot be moved to the 'Delivered' state unless the required Proof of Delivery (as configured for the order) has been successfully captured and stored.", 'enforcement_point': 'Backend API endpoint for updating order status.', 'violation_handling': 'The API request is rejected with a specific error code (e.g., HTTP 400 Bad Request) and a message indicating the POD is missing.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-018

#### 6.1.1.2 Dependency Reason

Sets the precondition state of 'Arrived at Destination' from which this story proceeds.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

RDR-022

#### 6.1.2.2 Dependency Reason

Implements the photo-based Proof of Delivery, which is a mandatory prerequisite for this story on prepaid orders.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

RDR-023

#### 6.1.3.2 Dependency Reason

Implements the OTP-based Proof of Delivery, a mandatory prerequisite for this story on OTP-configured orders.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

SYS-006

#### 6.1.4.2 Dependency Reason

This story triggers the rider settlement process, which is defined in SYS-006.

### 6.1.5.0 Story Id

#### 6.1.5.1 Story Id

CUS-036

#### 6.1.5.2 Dependency Reason

This story triggers the customer rating prompt, which is defined in CUS-036.

## 6.2.0.0 Technical Dependencies

- Order Management microservice (for state transition).
- Notification microservice (for customer notifications via FCM).
- Rider Logistics microservice (to update rider availability).
- Payments & Settlements microservice (to consume the 'OrderDelivered' event).
- AWS SQS/SNS for asynchronous event publishing as per REQ-ARC-001.

## 6.3.0.0 Data Dependencies

- The order record must contain the assigned rider's ID and the required POD method.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API call to update the order status must have a P95 latency under 200ms (REQ-NFR-001).
- The end-to-end user-perceived latency (from tap to UI confirmation) should be under 1 second on a stable 4G connection.

## 7.2.0.0 Security

- The API endpoint must be secured via JWT authentication (REQ-FUN-002) and authorized to ensure only the assigned rider can update the order status.
- All communication must be over HTTPS/TLS 1.2+ (REQ-INT-004).

## 7.3.0.0 Usability

- The action must be simple and require a single tap after POD is complete.
- Feedback to the rider (success, failure, pending) must be immediate and clear.

## 7.4.0.0 Accessibility

- Compliance with WCAG 2.1 Level AA standards is required (REQ-INT-001).

## 7.5.0.0 Compatibility

- Functionality must be consistent across all supported iOS and Android versions.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires coordination across multiple microservices (Order, Rider, Notification, Payment) using an event-driven approach (Saga pattern).
- Implementing robust offline support with a queuing and retry mechanism on the mobile client adds complexity.
- Ensuring the status update API is idempotent is critical to prevent data corruption from network retries.

## 8.3.0.0 Technical Risks

- Potential for race conditions if multiple update requests are sent simultaneously.
- Failure in the event bus could disrupt downstream processes (e.g., payments, ratings), requiring monitoring and dead-letter queues.

## 8.4.0.0 Integration Points

- Publishes an `OrderDelivered` event to an SNS topic.
- Subscribers include: Payments service, Ratings service, Notification service.
- Reads from the order database to validate current state and POD completion.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Usability
- Security

## 9.2.0.0 Test Scenarios

- Successful delivery completion with photo POD.
- Successful delivery completion with OTP POD.
- Attempted completion without POD.
- Network failure and successful retry.
- API test for unauthorized access by another rider.
- Verify all downstream events (notification, payment trigger, rating prompt) are fired correctly.

## 9.3.0.0 Test Data Needs

- Test accounts for a Rider, Customer, and Vendor.
- An active order in the 'Arrived at Destination' state.
- Orders configured for both photo POD and OTP POD.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- Cypress for E2E tests.
- Postman or similar for direct API testing.
- Network simulation tools (e.g., Charles Proxy or built-in IDE tools).

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >= 80% coverage and passing
- E2E test scenario for successful delivery is automated and passing
- The `OrderDelivered` event contract is documented and published correctly
- Downstream services are confirmed to consume the event correctly in a staging environment
- UI/UX reviewed and approved by the design team
- Performance and security requirements validated
- All related documentation (e.g., API spec) is updated
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- Requires close collaboration between frontend (React Native) and backend (multiple microservices) developers.
- The event contract for 'OrderDelivered' must be finalized early in the sprint to allow parallel work on consumer services.

## 11.4.0.0 Release Impact

This is a critical feature for the core delivery workflow. The platform cannot launch without this functionality.

