# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | CUS-031 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Customer Chats with Vendor for an Active Order |
| As A User Story | As a Customer with an active order, I want to init... |
| User Persona | A registered Customer who has placed an order that... |
| Business Value | Improves customer satisfaction by providing direct... |
| Functional Area | Order Management & Communication |
| Story Theme | In-App Communication |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Customer successfully initiates chat for an active order

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in customer viewing the details of my order, which has a status of 'Accepted' or 'Preparing'

### 3.1.5 When

I tap the 'Chat with Vendor' button

### 3.1.6 Then

The system opens a chat interface, displaying the vendor's name, the associated Order ID, and any previous messages for this order.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Customer sends a message to the vendor

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

The chat interface for my active order is open

### 3.2.5 When

I type a message into the input field and tap the 'Send' button

### 3.2.6 Then

My message instantly appears in the chat window with a timestamp, and it is delivered to the vendor's dashboard in real-time.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Customer receives a message from the vendor

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

The chat interface for my active order is open

### 3.3.5 When

The vendor sends a message related to my order

### 3.3.6 Then

The vendor's message instantly appears in my chat window, visually distinguished from my own messages.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Chat functionality is disabled for non-active orders

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

I am a logged-in customer viewing the details of an order with a status of 'Pending Vendor Acceptance', 'Delivered', or 'Cancelled'

### 3.4.5 When

I look for the option to chat with the vendor

### 3.4.6 Then

The 'Chat with Vendor' button is not visible or is disabled.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Chat becomes read-only after order completion

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

I have an open chat session with a vendor for an order

### 3.5.5 When

The order's status changes to 'Delivered' or 'Cancelled'

### 3.5.6 Then

The message input field and send button become disabled, a system message indicates the chat is closed, and I can still view the chat history.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Attempting to send an empty message

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

The chat interface is open

### 3.6.5 When

I attempt to send a message that is empty or contains only whitespace

### 3.6.6 Then

The 'Send' button is disabled or tapping it has no effect.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Handling message sending failure due to network loss

### 3.7.3 Scenario Type

Alternative_Flow

### 3.7.4 Given

I am in the chat interface and my device loses its internet connection

### 3.7.5 When

I attempt to send a message

### 3.7.6 Then

The message appears in my chat window with a 'Failed to send' status indicator and an option to retry sending.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A 'Chat with Vendor' button on the active order details screen.
- A chat screen header displaying the Vendor's name and Order ID.
- A scrollable message history view.
- A text input field for composing messages.
- A 'Send' button.

## 4.2.0 User Interactions

- Tapping the chat button opens the chat screen.
- Typing in the input field enables the 'Send' button.
- Tapping 'Send' adds the message to the history and sends it.
- The message list should auto-scroll to the newest message upon sending or receiving.

## 4.3.0 Display Requirements

- Messages sent by the customer should be aligned differently or have a different background color than messages received from the vendor.
- Each message must display a timestamp.
- A visual indicator for messages that failed to send.

## 4.4.0 Accessibility Needs

- All buttons and input fields must have accessible labels for screen readers.
- Sufficient color contrast between text and background must be maintained, per WCAG 2.1 AA.
- The UI must be navigable using keyboard or assistive technologies.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-CHAT-001

### 5.1.2 Rule Description

Chat is only permitted between a customer, vendor, and rider for an active order they are party to. (Ref: REQ-USR-001)

### 5.1.3 Enforcement Point

API level, upon attempting to access a chat channel/room.

### 5.1.4 Violation Handling

The user is denied access to the chat with a 403 Forbidden error.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-CHAT-002

### 5.2.2 Rule Description

Chat history becomes read-only upon order completion ('Delivered' or 'Cancelled'). (Ref: REQ-USR-001)

### 5.2.3 Enforcement Point

Both client-side UI (disabling input) and server-side API (rejecting new messages).

### 5.2.4 Violation Handling

The client UI prevents message submission. The API rejects any new message attempts for a closed order with an error.

## 5.3.0 Rule Id

### 5.3.1 Rule Id

BR-CHAT-003

### 5.3.2 Rule Description

Chat logs are subject to the data retention policy and must be deleted after 90 days from order completion. (Ref: REQ-NFR-007)

### 5.3.3 Enforcement Point

A scheduled system job.

### 5.3.4 Violation Handling

N/A - System process.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

CUS-026

#### 6.1.1.2 Dependency Reason

An order must be created and confirmed before a chat can be associated with it.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

VND-017

#### 6.1.2.2 Dependency Reason

Chat functionality is typically enabled after a vendor accepts the order, making it 'active'.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

VND-024

#### 6.1.3.2 Dependency Reason

This is the vendor-side counterpart to the chat feature. Both stories should be developed concurrently to provide a complete feature.

## 6.2.0.0 Technical Dependencies

- A configured and deployed real-time messaging service using Secure WebSockets (WSS), as specified in REQ-INT-004 and REQ-TEC-001 (Socket.IO).
- A backend microservice (e.g., 'Communication Service') to handle chat authentication, message routing, and persistence.
- Integration with the User Authentication service (AWS Cognito) to authorize users for specific chat rooms.

## 6.3.0.0 Data Dependencies

- Access to the Order Management service to fetch order status and associated user IDs (customer, vendor).
- A database schema to store chat messages, including `message_id`, `order_id`, `sender_id`, `receiver_id`, `content`, and `timestamp`.

## 6.4.0.0 External Dependencies

- Firebase Cloud Messaging (FCM) for sending push notifications to the vendor's device when a new message arrives and they are not actively on the dashboard. (This is a dependency for VND-024 but critical for the feature's success).

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- Message delivery latency (sender client to receiver client) must be under 2 seconds for 95% of messages.
- The chat interface must load within 1.5 seconds.

## 7.2.0.0 Security

- All chat communication must be encrypted in transit using WSS (TLS 1.2+).
- The API must enforce strict authorization, ensuring only the customer and vendor associated with the order can access the chat channel.
- Input sanitization must be performed on all messages to prevent XSS and other injection attacks.

## 7.3.0.0 Usability

- The chat interface should be intuitive and follow common messaging app conventions.
- The system should provide clear feedback for message states (sending, sent, failed).

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards as per REQ-INT-001.

## 7.5.0.0 Compatibility

- The feature must be fully functional on all supported versions of iOS and Android for the React Native application.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires setting up and managing a real-time WebSocket infrastructure.
- Implementing robust authentication and authorization for chat channels.
- Handling state management for real-time connections, especially on unreliable mobile networks.
- Ensuring the backend is scalable to handle many concurrent chat sessions.

## 8.3.0.0 Technical Risks

- Scalability of the WebSocket server could become a bottleneck if not designed properly.
- Potential for message loss or out-of-order delivery on flaky networks if not handled gracefully.
- Ensuring low latency across the entire communication stack.

## 8.4.0.0 Integration Points

- Order Management Service: To check order status and retrieve participants.
- User Service / Cognito: To authenticate and authorize users.
- Notification Service (FCM/SNS): To send push notifications for new messages.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Performance
- Security

## 9.2.0.0 Test Scenarios

- Verify a customer can send and a vendor can receive a message in real-time.
- Verify the chat becomes read-only for both parties once the order is 'Delivered'.
- Verify a user cannot access the chat for an order they are not a part of.
- Test message sending and receiving during intermittent network connectivity.
- Test chat history loading correctly upon re-entering the chat screen.

## 9.3.0.0 Test Data Needs

- Test accounts for a customer and a vendor.
- A mechanism to create orders in various states ('Accepted', 'Preparing', 'Delivered', 'Cancelled') within the test environment.

## 9.4.0.0 Testing Tools

- Jest and React Testing Library for frontend unit tests.
- Cypress for E2E testing of the vendor web dashboard.
- An equivalent E2E framework for React Native (e.g., Appium, Detox).
- A WebSocket testing tool (e.g., `wscat`) for backend testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >= 80% coverage
- E2E automated tests for the chat flow are created and passing
- User interface reviewed and approved by the design/product team
- Performance requirements for message latency are verified under simulated load
- Security checks for channel authorization and input sanitization are validated
- API documentation for the chat service is created/updated using OpenAPI specification
- Story deployed and verified in the staging environment by QA

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story must be developed in the same sprint as its vendor-side counterpart (VND-024).
- Requires dedicated backend work to set up the WebSocket server and chat microservice, which may need to be a prerequisite technical story or spike if not already in place.

## 11.4.0.0 Release Impact

This is a key feature for improving user experience and reducing support overhead. It is a high-value addition for the initial and subsequent releases.

