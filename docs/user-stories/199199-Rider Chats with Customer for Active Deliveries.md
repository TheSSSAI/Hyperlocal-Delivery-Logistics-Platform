# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-028 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider Chats with Customer for Active Deliveries |
| As A User Story | As a delivery rider, I want to initiate and partic... |
| User Persona | Rider |
| Business Value | Improves delivery success rates, reduces delivery ... |
| Functional Area | Rider-Facing Features |
| Story Theme | In-App Communication |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Rider can access chat for an active order

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a rider has an active order with the status 'In Transit'

### 3.1.5 When

the rider navigates to the active order details screen

### 3.1.6 Then

a 'Chat with Customer' button is visible and enabled.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Rider sends a text message to the customer

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

the rider is on the chat screen for an active order

### 3.2.5 When

the rider types a message and taps the 'Send' button

### 3.2.6 Then

the message instantly appears in their chat history, and the customer receives the message in their app.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Rider receives a real-time message from the customer

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

the rider is on the chat screen for an active order

### 3.3.5 When

the customer sends a message

### 3.3.6 Then

the new message instantly appears in the rider's chat history.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Rider receives a push notification for a new message

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

the rider has an active order and the app is in the background or on another screen

### 3.4.5 When

the customer sends a chat message

### 3.4.6 Then

the rider receives a push notification containing a preview of the message.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Rider uses a quick-reply template

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

the rider is on the chat screen for an active order

### 3.5.5 When

the rider taps a predefined quick-reply button (e.g., 'I am arriving now')

### 3.5.6 Then

the corresponding message is sent to the customer without the rider needing to type.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Chat is disabled for non-active orders

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

an order is in a 'Delivered' or 'Cancelled' state

### 3.6.5 When

the rider views the details for that order

### 3.6.6 Then

the 'Chat with Customer' button is either hidden or disabled.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Chat history becomes read-only after order completion

### 3.7.3 Scenario Type

Edge_Case

### 3.7.4 Given

the rider is viewing the chat history for a 'Delivered' or 'Cancelled' order

### 3.7.5 When

they open the chat screen

### 3.7.6 Then

the message input field and send button are disabled, and the chat history is read-only, as per REQ-USR-001.

## 3.8.0 Criteria Id

### 3.8.1 Criteria Id

AC-008

### 3.8.2 Scenario

Sending a message with no network connectivity

### 3.8.3 Scenario Type

Error_Condition

### 3.8.4 Given

the rider has no internet connection

### 3.8.5 When

the rider attempts to send a chat message

### 3.8.6 Then

the message is marked with a 'Sending failed' status, and the app attempts to resend it automatically once connectivity is restored.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- 'Chat with Customer' button on the active order screen.
- A standard chat interface with a message history view.
- Text input field with a 'Send' button.
- A list of horizontally scrollable quick-reply buttons above the text input field.

## 4.2.0 User Interactions

- Tapping the chat button opens the chat screen.
- Typing in the input field and tapping 'Send' sends the message.
- Tapping a quick-reply button sends the predefined message.
- Scrolling up to view older messages in the conversation.

## 4.3.0 Display Requirements

- The chat screen header must display the customer's first name and the Order ID.
- Rider's messages are right-aligned; customer's messages are left-aligned.
- Each message bubble must display a timestamp.
- A visual indicator for message status (e.g., sent, delivered, failed).

## 4.4.0 Accessibility Needs

- All buttons and input fields must have ARIA labels for screen readers.
- Sufficient color contrast between text and background.
- UI must be navigable using accessibility tools.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-CHAT-001

### 5.1.2 Rule Description

Chat functionality is only enabled for active orders, specifically between the 'Accepted' and 'Delivered'/'Cancelled' states.

### 5.1.3 Enforcement Point

Backend service when authorizing connection to a chat channel/room and on the client when displaying the chat button.

### 5.1.4 Violation Handling

API requests to send messages to a non-active order chat will be rejected with a 403 Forbidden error. The UI will not allow access.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-CHAT-002

### 5.2.2 Rule Description

Chat history becomes read-only for all parties upon order completion or cancellation, as per REQ-USR-001.

### 5.2.3 Enforcement Point

Backend service will reject new messages. Client UI will disable input controls.

### 5.2.4 Violation Handling

API will reject the message. UI will show a message indicating the chat is closed.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-012

#### 6.1.1.2 Dependency Reason

A rider must be able to accept a task and have an active order before chat is relevant.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

CUS-032

#### 6.1.2.2 Dependency Reason

This is the other side of the same feature. Both rider and customer chat functionalities should be developed and released together.

## 6.2.0.0 Technical Dependencies

- A configured real-time messaging service (e.g., using Socket.IO as per REQ-TEC-001).
- A configured push notification service (FCM as per REQ-INT-003).
- Authentication service (AWS Cognito) to secure WebSocket connections.
- Order Management microservice to verify order status.

## 6.3.0.0 Data Dependencies

- Access to active order data, including customer ID and order ID, to establish the correct chat channel.

## 6.4.0.0 External Dependencies

- Firebase Cloud Messaging (FCM) for push notifications.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- Message delivery latency (from sender's client to receiver's client) must be under 2 seconds, as per REQ-FUN-008 latency expectations for real-time data.
- The app must efficiently handle WebSocket reconnections on unstable mobile networks.

## 7.2.0.0 Security

- All chat communication must use Secure WebSockets (WSS) over TLS 1.2+, as per REQ-INT-004.
- Users must be authenticated and authorized to join a specific order's chat room. A user cannot access a chat for an order they are not a party to.
- Chat logs are subject to the data retention policy in REQ-NFR-007 (deleted after 90 days).

## 7.3.0.0 Usability

- The chat interface must be simple and intuitive, minimizing distractions for a rider who may be briefly stopped.
- Quick-reply buttons should be easily accessible to facilitate common interactions safely.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA guidelines, as per REQ-INT-001.

## 7.5.0.0 Compatibility

- The feature must be fully functional on the supported versions of iOS and Android for the Rider application.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires both backend (WebSocket server) and frontend (UI, state management) implementation.
- Managing persistent, real-time connections on mobile devices with variable network quality.
- Implementing secure, authenticated chat channels per order.
- Handling offline message queuing and reliable delivery.

## 8.3.0.0 Technical Risks

- High battery consumption on the rider's device due to persistent connections.
- Difficulty in testing various network failure and recovery scenarios.
- Potential for message delivery race conditions or out-of-order messages.

## 8.4.0.0 Integration Points

- Backend: Order Management Service (for status checks), User Service (for user details), Notification Service (for push notifications).
- Frontend: Rider App's order details screen, global state management for notifications.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Usability
- Network Condition Testing

## 9.2.0.0 Test Scenarios

- Verify a rider can send and receive messages from a customer on an active order.
- Verify chat is inaccessible before pickup and after delivery.
- Verify push notifications are triggered when the app is in the background.
- Simulate network loss and verify that the connection is re-established and pending messages are sent.
- Verify chat history is correctly loaded and displayed as read-only for completed orders.

## 9.3.0.0 Test Data Needs

- Test accounts for a Rider and a Customer.
- Orders in various states: 'Accepted', 'In Transit', 'Delivered', 'Cancelled'.

## 9.4.0.0 Testing Tools

- Jest & React Testing Library for frontend unit tests.
- Cypress or equivalent for E2E testing.
- Network simulation tools (e.g., Charles Proxy or built-in mobile OS developer tools).

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >80% coverage for new logic
- E2E tests for the chat happy path are automated and passing
- Chat functionality manually tested and verified on both iOS and Android target devices
- Performance requirements for message latency are met
- Security review of the chat authentication/authorization mechanism is complete
- API documentation for chat service is created/updated
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is co-dependent with CUS-032 and they should be planned for the same sprint.
- Requires dedicated time for setting up and testing the WebSocket infrastructure if it doesn't already exist.
- Backend and frontend work can be parallelized after the API contract is defined.

## 11.4.0.0 Release Impact

- This is a key feature for improving operational efficiency and user experience. It should be included in a major feature release.

