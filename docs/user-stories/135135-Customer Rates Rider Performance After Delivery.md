# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | CUS-038 |
| Elaboration Date | 2025-01-18 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Customer Rates Rider Performance After Delivery |
| As A User Story | As a customer who has received my order, I want to... |
| User Persona | A customer who has completed an order and wants to... |
| Business Value | Provides a key metric for rider performance which ... |
| Functional Area | Ratings & Reviews |
| Story Theme | Order Fulfillment & Feedback Loop |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Happy Path: Customer submits a star rating and a text review for the rider

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a customer has an order with the status 'Delivered' and has not yet rated the rider for this order

### 3.1.5 When

the customer selects a 4-star rating for the rider, enters 'Very professional and on time' in the review field, and taps 'Submit'

### 3.1.6 Then

the system saves the 4-star rating and the review text, associating it with the correct rider and order ID, and displays a confirmation message like 'Thank you for your feedback!'

### 3.1.7 Validation Notes

Verify in the database that a new record is created in the `rider_ratings` table with the correct `order_id`, `rider_id`, `customer_id`, `rating_value`=4, and the correct `review_text`.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Alternative Flow: Customer submits only a star rating without a text review

### 3.2.3 Scenario Type

Alternative_Flow

### 3.2.4 Given

a customer is on the rider rating screen for a delivered order

### 3.2.5 When

the customer selects a 5-star rating for the rider and leaves the text review field empty, then taps 'Submit'

### 3.2.6 Then

the system successfully saves the 5-star rating with a null or empty review text and displays a confirmation message.

### 3.2.7 Validation Notes

Verify in the database that a new record is created with `rating_value`=5 and `review_text` is null or empty.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Error Condition: Customer attempts to submit without selecting a star rating

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

a customer is on the rider rating screen

### 3.3.5 When

the customer does not select any stars and taps 'Submit'

### 3.3.6 Then

the system prevents submission and displays an inline error message, such as 'Please select a star rating to continue.'

### 3.3.7 Validation Notes

Confirm no API call is made and the error message is displayed correctly. The form should remain on screen.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Edge Case: Customer tries to rate a rider for the same order more than once

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

a customer has already submitted a rating for a rider on a specific order

### 3.4.5 When

the customer navigates back to the order details in their order history

### 3.4.6 Then

the rating interface is either disabled or replaced with a view showing the previously submitted rating (e.g., 'You rated this delivery 4 stars').

### 3.4.7 Validation Notes

The UI should not allow a second submission. The backend API should reject any subsequent rating attempts for the same order/rider combination with a 409 Conflict or similar error.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Edge Case: Customer skips the initial rating prompt and rates later from order history

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

a customer has a delivered order that they have not yet rated and they have dismissed the initial rating prompt

### 3.5.5 When

the customer navigates to their order history, selects the completed order, and taps a 'Rate Delivery' button

### 3.5.6 Then

the system displays the same rider rating interface, allowing them to submit their feedback.

### 3.5.7 Validation Notes

Ensure the order history screen has a clear call-to-action for unrated, completed orders.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

System Behavior: Rider's average rating is updated

### 3.6.3 Scenario Type

Happy_Path

### 3.6.4 Given

a rider has an existing average rating of 4.5 from 10 ratings

### 3.6.5 When

a new 5-star rating is successfully submitted for that rider

### 3.6.6 Then

the system asynchronously recalculates and updates the rider's average rating.

### 3.6.7 Validation Notes

Check the `riders` table or the rider's profile data source to confirm the `average_rating` and `rating_count` fields are updated correctly. This process can be asynchronous to not delay the user-facing API response.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A modal or dedicated screen section for rating.
- A 5-star interactive rating component.
- A multi-line text input field for the optional review, with a character counter/limit.
- A 'Submit' button.
- A 'Skip' or 'Rate Later' option to dismiss the prompt.
- Display of the rider's name (e.g., 'How was your delivery by [Rider Name]?').

## 4.2.0 User Interactions

- Tapping a star selects that value (e.g., tapping the 4th star highlights stars 1-4).
- The 'Submit' button is disabled until at least one star is selected.
- After submission, the UI provides clear visual feedback (e.g., a success message or toast notification).

## 4.3.0 Display Requirements

- The rating interface must be clearly labeled to distinguish it from the vendor/product rating (as per REQ-FUN-009).
- If a character limit exists for the review, it must be displayed to the user.

## 4.4.0 Accessibility Needs

- The star rating component must be keyboard-navigable and compatible with screen readers, announcing the selected rating (e.g., '4 out of 5 stars selected').
- All form fields and buttons must have accessible labels (aria-labels).

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-001

### 5.1.2 Rule Description

A rider can only be rated for an order that is in the 'Delivered' state.

### 5.1.3 Enforcement Point

Backend API validation before accepting a rating submission.

### 5.1.4 Violation Handling

The API should return a 403 Forbidden or 400 Bad Request error if a rating is attempted on an order not in the 'Delivered' state.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-002

### 5.2.2 Rule Description

A star rating (1-5) is mandatory for submission, but the text review is optional.

### 5.2.3 Enforcement Point

Both frontend UI (disabling submit button) and backend API validation.

### 5.2.4 Violation Handling

Frontend shows a validation error. Backend returns a 400 Bad Request error if `rating_value` is missing or invalid.

## 5.3.0 Rule Id

### 5.3.1 Rule Id

BR-003

### 5.3.2 Rule Description

A customer can only rate a specific order's rider once.

### 5.3.3 Enforcement Point

Backend API validation by checking if a rating already exists for the given order ID.

### 5.3.4 Violation Handling

The API should return a 409 Conflict error.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-019

#### 6.1.1.2 Dependency Reason

The rating prompt is triggered when the rider marks an order as 'Delivered'.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

CUS-039

#### 6.1.2.2 Dependency Reason

The order history screen is the fallback location for customers to rate an order if they skip the initial prompt.

## 6.2.0.0 Technical Dependencies

- A `ratings` microservice or a dedicated module within the `Order Management` service.
- A database schema to store rider ratings (e.g., a `rider_ratings` table).
- An API endpoint (e.g., POST /api/v1/orders/{orderId}/rider-rating) to receive submissions.

## 6.3.0.0 Data Dependencies

- Requires access to the order's final state ('Delivered').
- Requires the `rider_id` and `customer_id` associated with the completed order.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API response time for submitting a rating must be under 500ms (P95).
- The calculation of a rider's average rating should be handled asynchronously to avoid impacting the user's submission experience.

## 7.2.0.0 Security

- All text input from the review field must be sanitized on the backend to prevent XSS and other injection attacks before storage and display.
- The API must validate that the authenticated user submitting the rating is the same user who placed the order.

## 7.3.0.0 Usability

- The rating prompt should be presented at a logical point in the user flow (e.g., immediately after the order is marked delivered or upon next app open).
- The process of leaving a rating should be quick and require minimal taps for the happy path.

## 7.4.0.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The UI components must render correctly on all supported mobile device screen sizes.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Low

## 8.2.0.0 Complexity Factors

- Standard form submission and API integration.
- Requires a new database table and API endpoint.
- Logic for recalculating average ratings needs to be robust but is a common pattern.

## 8.3.0.0 Technical Risks

- Potential for race conditions if average rating is updated naively. Using a background job or a database trigger is recommended.
- Ensuring the rating prompt logic (when to show it) is not intrusive or annoying to the user.

## 8.4.0.0 Integration Points

- Order Service: To get order status and associated user/rider IDs.
- User Service: To fetch rider details for display and update their average rating.
- API Gateway: To expose the new rating submission endpoint.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Submit rating with and without review.
- Attempt to submit without a star rating.
- Attempt to submit a rating for an order twice.
- Attempt to submit a rating for an order not yet delivered.
- Verify average rating calculation with multiple submissions.
- Test input sanitization for the review field with malicious strings.

## 9.3.0.0 Test Data Needs

- Test users (customers, riders).
- Orders in 'Delivered' state that are unrated.
- Orders in 'Delivered' state that are already rated.
- Orders in other states (e.g., 'In Transit').

## 9.4.0.0 Testing Tools

- Jest and React Testing Library for frontend unit tests.
- Jest for backend unit/integration tests.
- Cypress for E2E tests.
- Postman or similar for API-level testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >= 80% coverage and passing
- E2E automated test case created and passing
- User interface reviewed for UX consistency and accessibility compliance
- API performance confirmed to be under the 500ms P95 threshold
- Security validation (input sanitization, authorization checks) completed
- API documentation (OpenAPI spec) is created or updated
- Story deployed and verified in the staging environment by QA

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

3

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational feature for the platform's quality control mechanism. It should be prioritized soon after the core order lifecycle is complete.
- Depends on the completion of the order delivery flow.

## 11.4.0.0 Release Impact

- Completes a critical part of the user feedback loop.
- Enables data collection for rider performance metrics, which is a prerequisite for more advanced features like performance-based rider allocation.

