# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | VND-024 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Vendor Chats with Customer About an Active Order |
| As A User Story | As a vendor managing an active order, I want to in... |
| User Persona | Vendor using the web dashboard to manage store ope... |
| Business Value | Reduces order errors and cancellations by enabling... |
| Functional Area | Vendor Order Management |
| Story Theme | In-App Communication |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Vendor accesses the chat interface for an active order

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a vendor is logged into their dashboard and is viewing the details of an order with a status of 'Accepted', 'Preparing', or 'Ready for Pickup'

### 3.1.5 When

the vendor clicks on the 'Chat with Customer' button or icon associated with that order

### 3.1.6 Then

a chat panel or window is displayed, showing the conversation history for that specific order and a text input field for sending a new message.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Vendor sends a message to the customer

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

the vendor has the chat window open for an active order

### 3.2.5 When

the vendor types a message into the input field and clicks the 'Send' button

### 3.2.6 Then

the message instantly appears in the vendor's chat history, is timestamped, and is transmitted to the customer's application in real-time.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Vendor receives a new message notification

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

a vendor is logged into their dashboard and is not currently viewing the chat for a specific active order

### 3.3.5 When

the customer sends a message related to that order

### 3.3.6 Then

the vendor receives a non-intrusive visual notification (e.g., a notification badge on the order in the list) and an optional audio alert, indicating an unread message.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Vendor uses a quick-reply template

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

the vendor has the chat window open for an active order

### 3.4.5 When

the vendor clicks on a predefined quick-reply template (e.g., 'We are preparing your order now.')

### 3.4.6 Then

the content of the template is immediately sent as a message to the customer.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Chat is read-only for completed or cancelled orders

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

a vendor is viewing an order with a status of 'Delivered' or 'Cancelled'

### 3.5.5 When

the vendor opens the chat for that order

### 3.5.6 Then

the entire chat history is visible, but the message input field and 'Send' button are disabled, making the chat read-only.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Vendor attempts to send an empty message

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

the vendor has the chat window open

### 3.6.5 When

the vendor attempts to send a message that is empty or contains only whitespace

### 3.6.6 Then

the 'Send' button is disabled or an inline validation message appears, and no message is sent.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Message fails to send due to network interruption

### 3.7.3 Scenario Type

Error_Condition

### 3.7.4 Given

the vendor is sending a chat message

### 3.7.5 When

the network connection is temporarily lost

### 3.7.6 Then

the UI clearly indicates that the message has failed to send (e.g., a 'failed' status next to the message) and provides an option to retry sending it.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A 'Chat' button/icon on each active order card/detail view.
- A chat panel/modal with a message history view, a text input field, and a 'Send' button.
- A list of clickable quick-reply templates.
- A visual indicator for unread messages on the main order list.

## 4.2.0 User Interactions

- Clicking the chat button opens the chat interface.
- Typing in the input field and pressing 'Enter' or clicking 'Send' sends the message.
- Messages from the vendor and customer are visually distinct (e.g., right-aligned vs. left-aligned, different background colors).
- The chat view automatically scrolls to the latest message.

## 4.3.0 Display Requirements

- Each message must display the message content and a timestamp.
- The chat interface must be clearly associated with a specific Order ID.
- Read/unread status of conversations should be visually indicated.

## 4.4.0 Accessibility Needs

- The chat interface must be fully keyboard navigable (WCAG 2.1).
- New message notifications must be announced by screen readers.
- Sufficient color contrast must be used for text and UI elements.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-CHAT-001

### 5.1.2 Rule Description

Chat functionality is only enabled for active orders. An active order is defined as any order in a state between vendor acceptance and final delivery.

### 5.1.3 Enforcement Point

API and UI level when a user attempts to access or send a message.

### 5.1.4 Violation Handling

The chat interface will be in a read-only state for non-active orders. API calls to send messages for non-active orders will be rejected with an error.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-CHAT-002

### 5.2.2 Rule Description

Chat history becomes read-only upon order completion ('Delivered') or cancellation.

### 5.2.3 Enforcement Point

UI and API based on the order's final status.

### 5.2.4 Violation Handling

The message input is disabled in the UI. The API rejects any new messages for that order's chat channel.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

VND-017

#### 6.1.1.2 Dependency Reason

A vendor must be able to accept an order to make it 'active' before a chat can be initiated.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

CUS-031

#### 6.1.2.2 Dependency Reason

The customer-facing chat interface must exist for the vendor to have a two-way conversation.

## 6.2.0.0 Technical Dependencies

- A configured and running WebSocket service (Socket.IO as per REQ-TEC-001).
- Integration with the authentication service (AWS Cognito) to secure WebSocket connections.
- A database schema designed to store and retrieve chat messages efficiently.

## 6.3.0.0 Data Dependencies

- Access to real-time order status data to determine if a chat should be active or read-only.
- Access to user data to correctly associate messages with the vendor and customer of a specific order.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- Real-time message delivery latency (send-to-receive) must be under 2 seconds under normal network conditions.
- The vendor dashboard's performance should not be degraded by the background chat connection.

## 7.2.0.0 Security

- All chat communication must be encrypted in transit using Secure WebSockets (WSS) as per REQ-INT-004.
- The backend must enforce strict authorization, ensuring a vendor can only access chat channels for orders assigned to their store.
- All user-generated message content must be sanitized on the server to prevent Cross-Site Scripting (XSS) attacks.

## 7.3.0.0 Usability

- The chat interface should be intuitive and require no special training for a vendor to use.
- Notifications for new messages must be clear but not overly disruptive to the vendor's workflow.

## 7.4.0.0 Accessibility

- The feature must comply with Web Content Accessibility Guidelines (WCAG) 2.1 Level AA as per REQ-INT-001.

## 7.5.0.0 Compatibility

- The vendor dashboard, including the chat feature, must be fully functional on all modern web browsers supported by the platform.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Implementation of a scalable and secure WebSocket layer.
- State management on the frontend to handle real-time message updates and notifications.
- Robust authorization logic to scope chat access per order.
- Handling of connection lifecycle events (connect, disconnect, reconnect).

## 8.3.0.0 Technical Risks

- Potential for connection scalability issues under high load if not architected correctly.
- Ensuring reliable message delivery and handling of offline scenarios.
- Complexity in E2E testing of real-time features.

## 8.4.0.0 Integration Points

- Backend Order Management service (to check order status).
- Backend Authentication service (to authorize users).
- Frontend UI framework (React.js).
- Real-time communication service (WebSockets/Socket.IO).

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Accessibility

## 9.2.0.0 Test Scenarios

- A vendor and customer successfully exchange multiple messages on an active order.
- A vendor attempts to send a message on a delivered order and is blocked.
- A vendor receives a notification for a new message while on a different page of the dashboard.
- A vendor loses and regains network connectivity; the chat client reconnects successfully.
- An unauthorized user attempts to access a chat channel via API and is rejected.

## 9.3.0.0 Test Data Needs

- Test accounts for one vendor and one customer.
- An order in an 'Accepted' state assigned to the test vendor and customer.
- An order in a 'Delivered' state for the same parties to test read-only mode.

## 9.4.0.0 Testing Tools

- Jest and React Testing Library for frontend unit tests.
- Jest for backend unit/integration tests.
- Cypress for E2E testing.
- Postman or similar tool for WebSocket API testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one other developer
- Unit and integration tests implemented with at least 80% code coverage as per REQ-NFR-006
- End-to-end automated tests for the chat flow are created and passing
- User interface reviewed and approved by the design/product team
- Performance requirements for message latency are verified
- Security requirements (authorization, input sanitization) are validated
- Relevant API documentation is created or updated
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story should be developed in parallel or sequentially with the corresponding customer-side chat story (CUS-031) to deliver a complete feature.
- Requires developer expertise in both frontend (React) and backend (NestJS, WebSockets).

## 11.4.0.0 Release Impact

This is a key feature for improving operational efficiency and customer experience. It is a high-value addition for the initial platform launch.

