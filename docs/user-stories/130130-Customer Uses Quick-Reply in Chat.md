# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | CUS-033 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Customer Uses Quick-Reply in Chat |
| As A User Story | As a customer engaged in a chat for an active orde... |
| User Persona | Customer using the mobile application to communica... |
| Business Value | Improves user experience by making communication f... |
| Functional Area | Communication and Support |
| Story Theme | In-App Chat Enhancements |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Customer views quick replies in a chat with a Rider

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

A customer has an active order with an assigned rider

### 3.1.5 When

The customer opens the chat interface with the rider

### 3.1.6 Then

A horizontally scrollable list of predefined quick-reply buttons, specific to rider communication, is displayed above the text input field.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Customer views quick replies in a chat with a Vendor

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

A customer has an active order

### 3.2.5 When

The customer opens the chat interface with the vendor

### 3.2.6 Then

A horizontally scrollable list of predefined quick-reply buttons, specific to vendor communication, is displayed above the text input field.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Customer sends a message using a quick-reply button

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

The customer is in a chat screen with quick-reply options visible

### 3.3.5 When

The customer taps on a quick-reply button (e.g., 'I am at the door')

### 3.3.6 Then

The corresponding message ('I am at the door') is immediately sent and appears in the chat history for all participants, and the quick-reply options remain visible.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Quick replies are not available for completed orders

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

A customer's order is in a final state ('Delivered' or 'Cancelled')

### 3.4.5 When

The customer opens the chat history for that order

### 3.4.6 Then

The quick-reply buttons and the text input field are hidden or disabled, enforcing the read-only state of the chat.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

System handles network failure when sending a quick reply

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

The customer is in a chat and has no network connectivity

### 3.5.5 When

The customer taps on a quick-reply button

### 3.5.6 Then

The message sending fails, and the UI displays a 'failed to send' status with a retry option, consistent with typed messages.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

System handles failure to load quick-reply templates

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

The customer opens a chat screen

### 3.6.5 When

The application fails to fetch the list of quick-reply templates from the backend

### 3.6.6 Then

The quick-reply area is not displayed, but the standard text input chat functionality remains fully operational.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A horizontally scrollable container for quick-reply buttons.
- Individual tappable buttons (or 'chips') for each quick-reply message.

## 4.2.0 User Interactions

- The quick-reply container should be positioned above the text input field and keyboard.
- A single tap on a quick-reply button sends the message without needing a separate 'send' action.
- The list of quick replies should be swipeable horizontally if the content overflows the screen width.

## 4.3.0 Display Requirements

- The text on each button must be concise and clearly represent the message to be sent.
- The quick-reply component should load without causing a noticeable delay in the chat screen's appearance.

## 4.4.0 Accessibility Needs

- All quick-reply buttons must have sufficient color contrast and a minimum tap target size of 44x44 pixels.
- Each button must have a descriptive label for screen reader software, compliant with WCAG 2.1 Level AA.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-001

### 5.1.2 Rule Description

Quick-reply templates must be context-specific, with different sets for customer-to-vendor and customer-to-rider chats.

### 5.1.3 Enforcement Point

Backend API serving the templates, based on the chat context requested by the client.

### 5.1.4 Violation Handling

If context is not provided or invalid, the API should return an empty list.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-002

### 5.2.2 Rule Description

Quick replies are only available for active orders, consistent with overall chat permissions (REQ-USR-001).

### 5.2.3 Enforcement Point

The mobile application UI, which should check the order status before displaying the quick-reply component.

### 5.2.4 Violation Handling

The quick-reply component is not rendered for inactive orders.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

CUS-031

#### 6.1.1.2 Dependency Reason

The core chat functionality between customer and vendor must be implemented first.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

CUS-032

#### 6.1.2.2 Dependency Reason

The core chat functionality between customer and rider must be implemented first.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

ADM-031

#### 6.1.3.2 Dependency Reason

An administrative interface is required to create, manage, and categorize the quick-reply templates that will be displayed to users. This story cannot be completed without content to display.

## 6.2.0.0 Technical Dependencies

- The existing real-time chat service (WebSocket-based).
- A new backend API endpoint to fetch quick-reply templates based on context (e.g., /api/v1/chat/templates?context=customer-to-rider).

## 6.3.0.0 Data Dependencies

- A data store (e.g., a new database table) for the quick-reply templates, including the message text and context (vendor/rider).

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API call to fetch quick-reply templates must respond in under 150ms (P95).
- Rendering the quick-reply component must not add more than 50ms to the total chat screen load time.

## 7.2.0.0 Security

- The content of quick-reply templates is managed by administrators and should be treated as trusted content, but the message sending mechanism must adhere to the same security protocols as user-typed messages.

## 7.3.0.0 Usability

- The feature should be intuitive, requiring no user training. The buttons should be clearly identifiable as interactive elements.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The feature must function correctly on all supported iOS and Android versions.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Low

## 8.2.0.0 Complexity Factors

- Requires modification of an existing UI component (Chat Screen).
- Requires a new, simple CRUD API and data model for managing templates.
- The core logic for sending a message already exists.

## 8.3.0.0 Technical Risks

- Ensuring the quick-reply component does not interfere with the keyboard opening/closing behavior on different mobile devices.
- Potential for a slight delay in displaying templates if the API call is slow, requiring a loading state.

## 8.4.0.0 Integration Points

- Frontend chat module integrates with the new backend template service.
- The message sent via quick reply integrates with the existing WebSocket chat service.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Usability
- Accessibility

## 9.2.0.0 Test Scenarios

- Verify correct templates are shown for rider vs. vendor chats.
- Verify tapping a button sends the correct message.
- Verify the component is hidden for completed/cancelled orders.
- Verify the UI gracefully handles API failures (for template loading) and network failures (for message sending).
- Verify horizontal scrolling works correctly on devices with small screens.
- Verify functionality with screen readers (e.g., VoiceOver, TalkBack).

## 9.3.0.0 Test Data Needs

- Admin-configured quick-reply templates for both vendor and rider contexts in the test database.
- Test users (customer, vendor, rider) with active and completed orders.

## 9.4.0.0 Testing Tools

- Jest & React Testing Library (Frontend Unit/Integration)
- Cypress (End-to-End)
- Postman/Insomnia (API Testing)

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >80% coverage for new code
- End-to-end tests for the quick-reply flow are passing
- User interface reviewed and approved by UX/Product team
- Performance requirements for API and UI rendering are met
- Accessibility standards (WCAG 2.1 AA) are validated
- Dependency on admin story (ADM-031) is resolved, and templates can be managed
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

3

## 11.2.0.0 Priority

🟡 Medium

## 11.3.0.0 Sprint Considerations

- This story is dependent on the completion of the core chat features and the admin story for managing templates. It should be scheduled in a sprint after its prerequisites are met.
- This is a user experience enhancement and can be released independently of other major features.

## 11.4.0.0 Release Impact

Low. This is an incremental improvement to an existing feature.

