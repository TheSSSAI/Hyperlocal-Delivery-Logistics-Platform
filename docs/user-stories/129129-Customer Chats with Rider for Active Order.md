# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | CUS-032 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Customer Chats with Rider for Active Order |
| As A User Story | As a Customer with an active order, I want to init... |
| User Persona | A registered Customer who has placed an order that... |
| Business Value | Improves first-attempt delivery success rates, red... |
| Functional Area | Order Management & Tracking |
| Story Theme | In-App Communication |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

CUS-032-AC-001

### 3.1.2 Scenario

Chat option is available only after a rider is assigned

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in Customer and my order status is 'In Transit' (meaning a rider is assigned)

### 3.1.5 When

I view the active order tracking screen

### 3.1.6 Then

I should see a clearly visible and enabled button or icon to 'Chat with Rider'.

### 3.1.7 Validation Notes

Verify that the chat entry point is present on the order tracking UI. This requires the order state to be correctly identified by the frontend.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

CUS-032-AC-002

### 3.2.2 Scenario

Customer sends and receives messages in real-time

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

I have opened the chat interface for my active order

### 3.2.5 When

I type a message and tap the 'Send' button

### 3.2.6 Then

The message immediately appears in my chat window, and the assigned rider receives a push notification and the message in their app.

### 3.2.7 Validation Notes

Test using two clients (customer and rider). The message latency should be under 2 seconds as per REQ-NFR-001. Verify push notification is triggered via FCM.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

CUS-032-AC-003

### 3.3.2 Scenario

Customer receives a push notification for new messages when the app is in the background

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

I have an active order and the customer application is in the background or closed

### 3.3.5 When

The assigned rider sends me a message

### 3.3.6 Then

I should receive a push notification on my device containing a preview of the message.

### 3.3.7 Validation Notes

Test on both iOS and Android to ensure push notifications are correctly configured and handled.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

CUS-032-AC-004

### 3.4.2 Scenario

Chat becomes read-only after order completion

### 3.4.3 Scenario Type

Alternative_Flow

### 3.4.4 Given

I am in a chat session with a rider for an active order

### 3.4.5 When

The order status changes to 'Delivered' or 'Cancelled'

### 3.4.6 Then

The text input field and 'Send' button in the chat interface must be disabled, and a system message like 'This chat is now closed' should be displayed. I can still view the chat history.

### 3.4.7 Validation Notes

Verify the UI state change is triggered by the order status update event. This aligns with REQ-USR-001.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

CUS-032-AC-005

### 3.5.2 Scenario

Chat option is not available before a rider is assigned

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

I am a logged-in Customer and my order status is 'Pending Vendor Acceptance' or 'Preparing'

### 3.5.5 When

I view the order details screen

### 3.5.6 Then

The option to chat with a rider must be hidden or disabled.

### 3.5.7 Validation Notes

Check the UI logic for different order states prior to 'In Transit'.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

CUS-032-AC-006

### 3.6.2 Scenario

Handling message sending with no network connectivity

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

I am in the chat interface and my device loses internet connection

### 3.6.5 When

I attempt to send a message

### 3.6.6 Then

The message should appear in the UI with a 'Sending failed' or similar status, and the app should attempt to resend it automatically once connectivity is restored.

### 3.6.7 Validation Notes

Use network throttling tools or airplane mode to simulate this condition.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

CUS-032-AC-007

### 3.7.2 Scenario

Customer uses a quick-reply template

### 3.7.3 Scenario Type

Happy_Path

### 3.7.4 Given

I have opened the chat interface for my active order

### 3.7.5 When

I tap the quick-reply option and select a predefined message (e.g., 'Please leave it at the door')

### 3.7.6 Then

The selected message is immediately sent to the rider.

### 3.7.7 Validation Notes

Verify that the list of quick-reply templates from REQ-FUN-020 is available and functional.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A 'Chat with Rider' button/icon on the live order tracking screen.
- A standard chat screen with a message history view.
- A text input field with a character limit (e.g., 500 characters).
- A 'Send' button.
- A button to access predefined quick-reply messages.
- Timestamps for each message.
- A visual indicator for sent/failed message status.
- A system message area for status updates (e.g., 'Chat is now closed').

## 4.2.0 User Interactions

- Tapping the chat button opens the chat screen.
- Typing in the input field and tapping 'Send' sends the message.
- Scrolling up loads previous messages in the conversation for that order.
- Tapping a quick-reply sends the message instantly.

## 4.3.0 Display Requirements

- My messages are right-aligned; rider's messages are left-aligned.
- The rider's name should be displayed at the top of the chat screen.
- The chat history for the specific order must be loaded upon opening the chat.

## 4.4.0 Accessibility Needs

- All buttons and input fields must have ARIA labels for screen readers.
- Sufficient color contrast must be used for text and UI elements, per WCAG 2.1 AA standards (REQ-INT-001).

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-CHAT-001

### 5.1.2 Rule Description

Chat is only permitted between a customer and the rider currently assigned to their active order.

### 5.1.3 Enforcement Point

Backend chat service authentication/authorization layer.

### 5.1.4 Violation Handling

Connection to the chat room is denied if the user is not a party to the specified active order.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-CHAT-002

### 5.2.2 Rule Description

Chat history becomes read-only for Customer and Rider upon order completion ('Delivered') or termination ('Cancelled').

### 5.2.3 Enforcement Point

Backend chat service and client-side UI.

### 5.2.4 Violation Handling

The backend will reject any new messages sent after the order is closed. The UI will disable the input controls.

## 5.3.0 Rule Id

### 5.3.1 Rule Id

BR-CHAT-003

### 5.3.2 Rule Description

Chat logs are accessible in a read-only mode to Administrators for support and moderation purposes.

### 5.3.3 Enforcement Point

Admin backend interface.

### 5.3.4 Violation Handling

N/A - This is a permission rule for the Admin role as defined in REQ-USR-001.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

REQ-FUN-018

#### 6.1.1.2 Dependency Reason

The system must be able to assign a rider to an order before a chat can be initiated.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

RDR-028

#### 6.1.2.2 Dependency Reason

This is the rider-facing counterpart to this story. Both sides are required for the feature to be functional and testable.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

REQ-FUN-017

#### 6.1.3.2 Dependency Reason

The order lifecycle management system must provide the states ('In Transit', 'Delivered', 'Cancelled') that govern the chat's availability.

## 6.2.0.0 Technical Dependencies

- A configured and deployed WebSocket service (e.g., using Socket.IO as per REQ-TEC-001) for real-time communication.
- Integration with the push notification service (Firebase Cloud Messaging as per REQ-INT-003).
- A backend 'Communication' microservice to handle chat logic, authentication, and message persistence.

## 6.3.0.0 Data Dependencies

- Access to the Order Management service to fetch the current order status and the assigned rider's ID.

## 6.4.0.0 External Dependencies

- Firebase Cloud Messaging (FCM) API for sending push notifications.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- P95 latency for message delivery (client A to client B) shall be under 2 seconds.
- Opening the chat screen and loading the last 20 messages shall take less than 1 second.

## 7.2.0.0 Security

- All chat communication must use the Secure WebSocket (WSS) protocol as per REQ-INT-004.
- The chat service must authorize every user connection against the order, ensuring only the correct customer and rider can join a specific chat room.
- No sensitive PII beyond what is necessary for delivery should be encouraged or stored.

## 7.3.0.0 Usability

- The chat interface should be intuitive and follow common design patterns of popular messaging apps.

## 7.4.0.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards as per REQ-INT-001.

## 7.5.0.0 Compatibility

- The feature must function correctly on the supported versions of iOS and Android for the React Native application.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires real-time infrastructure (WebSockets) which adds stateful complexity compared to stateless REST APIs.
- Managing the lifecycle of chat rooms tied to order statuses.
- Handling the edge case of rider re-assignment, which requires updating chat room permissions mid-delivery.
- Ensuring reliable push notification delivery across platforms.

## 8.3.0.0 Technical Risks

- Scalability of the WebSocket service under high load (many concurrent chats).
- Potential for message loss during network handovers (e.g., Wi-Fi to cellular). The implementation needs a robust retry mechanism.

## 8.4.0.0 Integration Points

- Order Management Service: To get order status and rider assignment updates.
- User Service / Cognito: To authenticate users connecting to the chat.
- Notification Service: To trigger push notifications.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Performance
- Security

## 9.2.0.0 Test Scenarios

- A customer successfully sends and receives messages with an assigned rider.
- A customer cannot initiate a chat before a rider is assigned.
- The chat becomes read-only for both parties after the order is delivered.
- If a rider is changed mid-order, the customer is correctly connected to the new rider's chat.
- Push notifications are received when the app is in the background.
- An administrator can view the chat log for a completed order.

## 9.3.0.0 Test Data Needs

- Test accounts for a Customer, a Rider, and an Administrator.
- Orders in various states: 'Preparing', 'In Transit', 'Delivered', 'Cancelled'.

## 9.4.0.0 Testing Tools

- Jest & React Testing Library for frontend unit tests.
- Cypress or a similar tool for E2E testing, capable of managing two user sessions simultaneously.
- Postman or a WebSocket client for API/service level testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one other developer
- Unit and integration tests implemented with >= 80% coverage as per REQ-NFR-006
- E2E tests for the chat flow are automated and passing
- User interface reviewed and approved by UX/UI designer
- Performance requirements for message latency are verified
- Security requirements for chat authorization are validated via testing
- API documentation for the chat service is created/updated
- Story deployed and verified in the staging environment with its counterpart (RDR-028)

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story must be developed in conjunction with its rider-side counterpart, RDR-028.
- Requires backend infrastructure for WebSockets. If this is the first real-time feature, a preceding technical spike may be necessary.
- Coordination between frontend and backend developers will be critical.

## 11.4.0.0 Release Impact

This is a key feature for improving the customer delivery experience and is a high-value differentiator.

