# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | CUS-030 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Customer Receives Real-Time Order Status Push Noti... |
| As A User Story | As a Customer who has placed an order, I want to r... |
| User Persona | The Customer user role who has an active order on ... |
| Business Value | Improves customer experience and satisfaction by p... |
| Functional Area | Customer-Facing Features |
| Story Theme | Order Tracking & Communication |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Notification for Order Accepted by Vendor

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a customer has successfully placed an order and its status is 'Pending Vendor Acceptance'

### 3.1.5 When

the vendor accepts the order and provides an estimated preparation time

### 3.1.6 Then

the customer's registered device must receive a push notification with a title like 'Order Confirmed!' and a body similar to 'Your order from [Vendor Name] is being prepared. ETA: [Estimated Preparation Time].'

### 3.1.7 Validation Notes

Verify via logs that the notification was sent via FCM and manually check on a test device that the notification is received.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Notification for Order Picked Up by Rider

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

a customer's order has been accepted and is 'Ready for Pickup'

### 3.2.5 When

a rider marks the order status as 'Picked Up'

### 3.2.6 Then

the customer's registered device must receive a push notification with a title like 'Your order is on the way!' and a body similar to '[Rider Name] has picked up your order.'

### 3.2.7 Validation Notes

Verify via logs and on a test device. The rider's name must be correctly populated.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Notification for Rider Arrived at Destination

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

a customer's order status is 'In Transit'

### 3.3.5 When

the rider updates the order status to 'Arrived at Destination'

### 3.3.6 Then

the customer's registered device must receive a push notification with a title like 'Your rider has arrived!' and a body similar to 'Please be ready to collect your order.'

### 3.3.7 Validation Notes

This notification should be triggered promptly to give the customer a heads-up.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Notification for Order Delivered

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

a customer's order status is 'Arrived at Destination'

### 3.4.5 When

the rider marks the order status as 'Delivered'

### 3.4.6 Then

the customer's registered device must receive a push notification with a title like 'Order Delivered!' and a body similar to 'Enjoy your order from [Vendor Name]! Please rate your experience.'

### 3.4.7 Validation Notes

This notification confirms the completion of the order lifecycle.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Notification for Order Cancellation

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

a customer has an active order

### 3.5.5 When

the order status is changed to 'Cancelled' by any actor (customer, vendor, or admin)

### 3.5.6 Then

the customer's registered device must receive a push notification with a title like 'Order Cancelled' and a body that clarifies the next steps, e.g., 'Your order from [Vendor Name] has been cancelled. A refund has been initiated.'

### 3.5.7 Validation Notes

Test for cancellations triggered by different user roles.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Notification for Rider Allocation Failure

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

a customer's order is 'Ready for Pickup'

### 3.6.5 When

the system fails to assign a rider and changes the order status to 'Allocation Failed'

### 3.6.6 Then

the customer's registered device must receive a push notification with a title like 'Delivery Delayed' and a body similar to 'We are having trouble finding a delivery partner for your order. We are working on it.'

### 3.6.7 Validation Notes

This requires simulating the allocation failure scenario in a test environment.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Tapping a notification opens the correct screen

### 3.7.3 Scenario Type

Happy_Path

### 3.7.4 Given

the customer has received any order-related push notification and the app is either in the background or closed

### 3.7.5 When

the customer taps on the notification

### 3.7.6 Then

the application must launch and navigate directly to the live tracking/details screen for that specific order.

### 3.7.7 Validation Notes

This tests the deep linking functionality. It must work for all notification types mentioned above.

## 3.8.0 Criteria Id

### 3.8.1 Criteria Id

AC-008

### 3.8.2 Scenario

No notifications sent to logged-out users

### 3.8.3 Scenario Type

Edge_Case

### 3.8.4 Given

a user has logged out of the application

### 3.8.5 When

a backend event occurs that would normally trigger a notification for that user's previous orders

### 3.8.6 Then

the system must not attempt to send a push notification to the user's device.

### 3.8.7 Validation Notes

Verify that the user's device token is disassociated from their profile upon logout, preventing notification sends.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Standard OS push notification banner/alert (iOS/Android)

## 4.2.0 User Interactions

- Tapping the notification opens the app and deep links to the relevant order screen.

## 4.3.0 Display Requirements

- Notification must display the application icon.
- Notification title must be concise and clear.
- Notification body must contain relevant, dynamic information (e.g., Vendor Name, Rider Name).

## 4.4.0 Accessibility Needs

- Notifications must respect the user's OS-level text size and notification settings.

# 5.0.0 Business Rules

- {'rule_id': 'BR-NOTIF-001', 'rule_description': 'Notifications are only sent for key, customer-facing order state changes: Accepted, Picked Up, Arrived, Delivered, Cancelled, Allocation Failed.', 'enforcement_point': 'Notification Service, upon receiving an order state change event.', 'violation_handling': "Events for non-key state changes (e.g., 'Preparing') are ignored by the notification service."}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

REQ-FUN-017

#### 6.1.1.2 Dependency Reason

The entire Order Lifecycle Management system must be in place to provide the state change events that trigger notifications.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

VND-017

#### 6.1.2.2 Dependency Reason

Vendor 'Accept Order' action is the trigger for the 'Order Confirmed' notification.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

RDR-016

#### 6.1.3.2 Dependency Reason

Rider 'Picked Up' action is the trigger for the 'Order on the way' notification.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

SYS-003

#### 6.1.4.2 Dependency Reason

The system's 'Allocation Failed' state change is the trigger for the allocation failure notification.

## 6.2.0.0 Technical Dependencies

- Integration with Firebase Cloud Messaging (FCM) as specified in REQ-INT-003.
- A backend event bus (e.g., AWS SNS/SQS) for publishing order state changes, as per REQ-ARC-001.
- A dedicated Notification microservice to consume events and dispatch notifications.
- Mobile client (React Native) must have the FCM SDK integrated to receive notifications.
- A robust system for managing user device tokens, linking them to user accounts (e.g., via AWS Cognito as per REQ-NFR-003).

## 6.3.0.0 Data Dependencies

- Access to Order data (Vendor Name, Order ID) and Rider data (Rider Name) to populate notification content.

## 6.4.0.0 External Dependencies

- Firebase Cloud Messaging (FCM) service availability.
- Apple Push Notification Service (APNS) and Google's corresponding services.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- Notifications should be delivered to the user's device within 5 seconds of the triggering event occurring in the backend.

## 7.2.0.0 Security

- Notification payloads must not contain sensitive Personally Identifiable Information (PII) beyond what is necessary (e.g., Rider's first name is acceptable, but customer's full address is not).
- Communication with FCM must be over a secure channel.

## 7.3.0.0 Usability

- Notification text must be clear, concise, and easily understandable.
- The frequency of notifications should not be overwhelming; only key milestones should trigger one.

## 7.4.0.0 Accessibility

- Compliant with WCAG 2.1 AA standards where applicable to UI elements.

## 7.5.0.0 Compatibility

- Notifications must function correctly on supported versions of iOS and Android.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires coordination between multiple microservices (Order, Rider, Notification).
- Implementation of a robust event-driven architecture.
- Secure management of device registration tokens.
- Client-side implementation of deep linking to handle various app states (background, terminated).

## 8.3.0.0 Technical Risks

- Latency in the event bus or FCM service could delay notifications.
- Inconsistent delivery of notifications by OS/device manufacturers due to battery optimization settings.
- Complexity in testing the full end-to-end notification flow automatically.

## 8.4.0.0 Integration Points

- Order Management Service (publishes events).
- Notification Service (consumes events, calls FCM API).
- Firebase Cloud Messaging (FCM) API.
- Customer Mobile Application (receives and displays notifications).

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Manual

## 9.2.0.0 Test Scenarios

- Verify each notification type is triggered by the correct event.
- Test deep linking from each notification type when the app is in the background and when it is terminated.
- Test on both physical iOS and Android devices to check for OS-specific behavior.
- Verify that no notifications are sent after a user logs out.
- Test the graceful handling of scenarios where the user has disabled notifications in OS settings.

## 9.3.0.0 Test Data Needs

- Test accounts for Customer, Vendor, and Rider roles.
- Orders that can be programmatically moved through all lifecycle states.

## 9.4.0.0 Testing Tools

- Backend: Jest
- Frontend: React Testing Library
- E2E: A mobile testing framework like Appium or Detox to automate UI flows and verify notification receipt.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing on both iOS and Android.
- Code for backend services and mobile client reviewed and approved.
- Unit and integration tests implemented with >80% coverage.
- E2E tests for the primary notification flows are automated and passing.
- Deep linking functionality is verified from all notification types.
- Performance requirement for notification delivery latency is met.
- Notification content templates are finalized and approved.
- Documentation for the notification service and event schema is created/updated.
- Story deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- Requires parallel work from both backend and mobile development teams.
- The backend eventing infrastructure should be stable before mobile client work begins.
- Access to a reliable testing environment with FCM configured is necessary.

## 11.4.0.0 Release Impact

This is a core feature for customer experience and is critical for the initial launch.

