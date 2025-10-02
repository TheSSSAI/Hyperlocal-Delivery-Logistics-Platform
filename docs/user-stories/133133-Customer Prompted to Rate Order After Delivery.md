# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | CUS-036 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Customer Prompted to Rate Order After Delivery |
| As A User Story | As a customer who has just received my order, I wa... |
| User Persona | Customer who has placed and received an order. |
| Business Value | Increases the volume of ratings and reviews, which... |
| Functional Area | Customer-Facing Features |
| Story Theme | Ratings and Reviews |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Happy Path - In-App Prompt After Delivery

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a customer has a completed order with the status 'Delivered' that has not yet been rated

### 3.1.5 When

the customer next opens the application

### 3.1.6 Then

an in-app prompt (e.g., a modal or a prominent banner) is displayed, asking them to rate their recent order

### 3.1.7 Validation Notes

Verify that the prompt appears automatically on the first app launch after an order is marked 'Delivered'. The prompt must reference the specific order (e.g., by vendor name).

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Happy Path - Push Notification Trigger

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

a customer has a completed order and has push notifications enabled for the app

### 3.2.5 When

the order status is updated to 'Delivered' by the rider

### 3.2.6 Then

the customer receives a push notification prompting them to rate the order

### 3.2.7 Validation Notes

Test on both iOS and Android. Tapping the notification must open the app and navigate directly to the rating screen for that specific order.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Interaction - Navigating from Prompt to Rating Screen

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

the customer is viewing the rating prompt for a specific order

### 3.3.5 When

they tap the primary call-to-action (e.g., 'Rate Now')

### 3.3.6 Then

they are navigated directly to the rating and review screen for that order

### 3.3.7 Validation Notes

Ensure the context of the order (vendor ID, rider ID, order ID) is correctly passed to the rating screen.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Alternative Flow - Dismissing the Prompt

### 3.4.3 Scenario Type

Alternative_Flow

### 3.4.4 Given

the customer is viewing the in-app rating prompt

### 3.4.5 When

they tap the dismiss option (e.g., 'Later' or 'X' icon)

### 3.4.6 Then

the prompt is hidden for the current user session

### 3.4.7 And

a persistent, non-intrusive option to rate the order remains available on the order's detail page in their order history

### 3.4.8 Validation Notes

Verify the prompt does not reappear on subsequent screen navigations within the same session. Check the order history to confirm the rating option is still present.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Error Condition - Prompt Not Shown for Rated Orders

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

a customer has an order with the status 'Delivered'

### 3.5.5 And

they have already submitted a rating for that order (e.g., by navigating there manually)

### 3.5.6 When

they open the application

### 3.5.7 Then

no prompt to rate that specific order is displayed

### 3.5.8 Validation Notes

The backend must track the rating status of an order and prevent redundant prompts.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Edge Case - Multiple Unrated Delivered Orders

### 3.6.3 Scenario Type

Edge_Case

### 3.6.4 Given

a customer has two or more delivered orders that have not been rated

### 3.6.5 When

they open the application

### 3.6.6 Then

the prompt displayed is for the most recently delivered order

### 3.6.7 And

after rating or dismissing, a prompt for the next unrated order may be shown in a subsequent session

### 3.6.8 Validation Notes

Verify the logic correctly identifies the most recent unrated order. The system should not show multiple modal prompts in a single session.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Error Condition - No Prompt for Cancelled Orders

### 3.7.3 Scenario Type

Error_Condition

### 3.7.4 Given

a customer's order has a final status of 'Cancelled'

### 3.7.5 When

the customer opens the application

### 3.7.6 Then

no prompt to rate that order is ever displayed

### 3.7.7 Validation Notes

Check the trigger logic to ensure it only fires on the 'Delivered' status.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- In-app modal dialog or a non-intrusive top banner for the prompt.
- Push notification with a title and body text.
- A primary call-to-action button (e.g., 'Rate Now').
- A secondary action or icon to dismiss the prompt (e.g., 'Later', 'X').

## 4.2.0 User Interactions

- Tapping the push notification opens the app to the rating screen.
- Tapping the in-app prompt's primary action navigates to the rating screen.
- Tapping the dismiss action hides the prompt.

## 4.3.0 Display Requirements

- The prompt must clearly identify the order being rated, preferably by showing the vendor's name.
- Example Push Notification Text: 'How was your order from [Vendor Name]? Tap to rate your experience.'

## 4.4.0 Accessibility Needs

- The prompt (modal/banner) must be accessible via screen readers.
- All buttons and interactive elements within the prompt must have clear, descriptive labels (e.g., 'Rate your order from [Vendor Name]').
- The prompt must be dismissible using accessibility controls.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-001

### 5.1.2 Rule Description

A rating prompt should only be triggered for orders with a final status of 'Delivered'.

### 5.1.3 Enforcement Point

Backend order management service, upon state transition.

### 5.1.4 Violation Handling

The event to trigger a prompt is not published for any other status.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-002

### 5.2.2 Rule Description

A user should only be prompted once per order via a given channel (e.g., one push notification, one primary in-app prompt).

### 5.2.3 Enforcement Point

Backend notification/prompting service.

### 5.2.4 Violation Handling

The system logs that a prompt has been sent and does not send it again.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-019

#### 6.1.1.2 Dependency Reason

The system needs the 'Delivered' status update from the rider to trigger this story's functionality.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

CUS-037

#### 6.1.2.2 Dependency Reason

The rating screen for vendors/products must exist for the prompt to navigate to.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

CUS-038

#### 6.1.3.2 Dependency Reason

The rating functionality for riders must exist on the destination screen.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

CUS-039

#### 6.1.4.2 Dependency Reason

The Order History page must exist as a fallback location for users to rate orders if they dismiss the prompt.

## 6.2.0.0 Technical Dependencies

- Backend event bus (e.g., AWS SQS/SNS) to handle order status change events.
- A persistent data store (e.g., PostgreSQL, Redis) to track the rating/prompt status of each order.
- Push notification service (Firebase Cloud Messaging) must be integrated.

## 6.3.0.0 Data Dependencies

- Requires access to the final order status.
- Requires access to user notification preferences.

## 6.4.0.0 External Dependencies

- Firebase Cloud Messaging (FCM) for push notifications.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The push notification should be sent within 10 seconds of the order being marked 'Delivered'.
- The in-app prompt check should not add more than 100ms to the app's startup time.

## 7.2.0.0 Security

- The deep link from the push notification must securely authenticate the user session before displaying the rating screen.

## 7.3.0.0 Usability

- The prompt must be non-blocking and easy to dismiss to avoid user frustration.
- The prompting logic should be designed to avoid feeling spammy, especially for frequent users.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards for mobile applications.

## 7.5.0.0 Compatibility

- The prompt and notification functionality must be tested on the latest two major versions of iOS and Android.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires coordination between backend (event trigger), frontend (UI display), and an external service (FCM).
- State management is required to track which orders have been prompted for and which have been rated.
- Designing a user-friendly (non-annoying) prompting strategy requires careful UX consideration.

## 8.3.0.0 Technical Risks

- Delays in the event processing pipeline could lead to delayed notifications.
- Inconsistent behavior of push notifications across different Android manufacturers and iOS versions.

## 8.4.0.0 Integration Points

- Order Management Service (to consume 'Delivered' event).
- User Profile Service (to check notification preferences).
- Notification Service (to dispatch push notifications).
- Mobile Client (to display in-app prompt and handle deep links).

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Usability

## 9.2.0.0 Test Scenarios

- Verify in-app prompt appears after first app open post-delivery.
- Verify push notification is received and deep-links correctly.
- Verify dismissing the prompt works and the rating option remains in order history.
- Verify no prompt is shown for an already rated order.
- Verify no prompt is shown for a cancelled order.
- Verify correct behavior with multiple unrated orders.

## 9.3.0.0 Test Data Needs

- User accounts with notifications enabled and disabled.
- Orders in 'Delivered', 'Cancelled', and other states.
- User accounts with single and multiple unrated, delivered orders.

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for frontend unit tests.
- Backend testing framework (e.g., Jest for NestJS).
- Cypress or a similar tool for E2E testing on the mobile app.
- Firebase console or similar tool to verify push notification dispatch.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >= 80% coverage and passing
- E2E test scenarios for the prompt-to-rate flow are automated and passing
- User interface and push notification copy reviewed and approved by UX/Product
- Functionality verified on target iOS and Android devices
- Performance impact on app startup is measured and within acceptable limits
- Backend event handling is logged and monitored
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is a key driver for data collection and should be prioritized soon after the core ordering and rating functionalities are stable.
- Requires UX design input for the prompt's appearance and interaction flow before development begins.

## 11.4.0.0 Release Impact

This feature significantly enhances the feedback loop, a core component of the marketplace's quality control mechanism. Its inclusion is important for post-launch optimization.

