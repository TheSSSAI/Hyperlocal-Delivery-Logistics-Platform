# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | CUS-037 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Customer Rates Vendor and Products |
| As A User Story | As a customer who has received my order, I want to... |
| User Persona | A registered Customer whose order has been success... |
| Business Value | Generates user-created content that builds trust a... |
| Functional Area | Customer-Facing Features |
| Story Theme | Post-Order Experience & Feedback Loop |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Happy Path: Customer submits a rating with an optional review

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a customer has a completed order with the status 'Delivered' that has not yet been rated

### 3.1.5 When

the customer navigates to the rating screen, selects a 4-star rating for the vendor/products, and enters a text review

### 3.1.6 Then

the system successfully submits the rating and review, associates it with the correct order and vendor, and displays a confirmation message to the customer.

### 3.1.7 Validation Notes

Verify a new record is created in the 'ratings' table with the correct `order_id`, `customer_id`, `vendor_id`, `rating_value`=4, and the review text. The vendor's average rating should be recalculated.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Customer submits a rating without a review

### 3.2.3 Scenario Type

Alternative_Flow

### 3.2.4 Given

a customer is on the rating screen for a delivered order

### 3.2.5 When

the customer selects a 5-star rating for the vendor/products and leaves the text review field empty

### 3.2.6 Then

the system successfully submits the rating, and the review field in the database is stored as null or empty.

### 3.2.7 Validation Notes

Verify the rating is saved successfully without any review text.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Error: Attempting to submit without a star rating

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

a customer is on the rating screen for a delivered order

### 3.3.5 When

the customer enters text in the review field but does not select any stars for the rating

### 3.3.6 Then

the 'Submit' button is disabled, or if tapped, a validation error message is displayed stating that a star rating is required.

### 3.3.7 Validation Notes

The API call should not be made. The UI must clearly indicate the error.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Error: Attempting to rate the same order twice

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

a customer has already submitted a rating for a specific order

### 3.4.5 When

the customer navigates back to that order in their order history

### 3.4.6 Then

the system displays their previously submitted rating and does not provide an option to submit a new one.

### 3.4.7 Validation Notes

The rating UI should be in a read-only state for this order. The API should reject any subsequent POST requests for this order's rating from the same user.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Rating prompt and access from order history

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

a customer's order is marked as 'Delivered'

### 3.5.5 When

the customer dismisses the initial rating prompt

### 3.5.6 Then

the customer can still access the rating screen for that order via their 'Order History' page.

### 3.5.7 Validation Notes

Verify that an unrated, delivered order in the order history list has a clear 'Rate Order' call-to-action.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Security: User-generated content is sanitized

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

a customer is submitting a review

### 3.6.5 When

the customer enters a text review containing HTML or script tags (e.g., '<script>alert("XSS")</script>')

### 3.6.6 Then

the backend sanitizes the input, storing only the plain text content, and the malicious script is not executed when the review is displayed elsewhere.

### 3.6.7 Validation Notes

Check the database to ensure the stored text is sanitized. When viewing the review on the vendor's page, verify no scripts are executed.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Interactive 5-star rating component
- Multi-line text area for the review with a character counter
- A 'Submit Review' button
- A confirmation message/toast notification upon success
- A read-only display for previously submitted ratings

## 4.2.0 User Interactions

- Tapping a star selects that rating (e.g., tapping the 4th star selects a 4-star rating).
- The 'Submit' button is disabled until a star rating is selected.
- The rating screen is accessible via a prompt post-delivery or from the order history.

## 4.3.0 Display Requirements

- The rating screen must clearly distinguish between rating the 'Vendor/Products' and rating the 'Rider' (as per REQ-FUN-009).
- The screen should show basic order details (e.g., Vendor Name) for context.

## 4.4.0 Accessibility Needs

- Star rating component must be keyboard-navigable and compatible with screen readers (e.g., announce 'Rating: 4 out of 5 stars').
- All form elements (text area, buttons) must have accessible labels, adhering to WCAG 2.1 AA standards (REQ-INT-001).

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-RAT-001

### 5.1.2 Rule Description

A customer can only rate an order after its status is 'Delivered'.

### 5.1.3 Enforcement Point

API and Client-side logic.

### 5.1.4 Violation Handling

The option to rate is not shown for orders not in 'Delivered' state. API rejects requests for non-delivered orders.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-RAT-002

### 5.2.2 Rule Description

A customer can only submit one rating per order.

### 5.2.3 Enforcement Point

API (database constraint on `order_id` and `customer_id`).

### 5.2.4 Violation Handling

API returns a '409 Conflict' error if a rating for that order by that customer already exists.

## 5.3.0 Rule Id

### 5.3.1 Rule Id

BR-RAT-003

### 5.3.2 Rule Description

A star rating (1-5) is mandatory for submission, but the text review is optional.

### 5.3.3 Enforcement Point

Client-side validation and API validation.

### 5.3.4 Violation Handling

Client shows a validation error. API returns a '400 Bad Request' error if `rating_value` is missing or invalid.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

CUS-027

#### 6.1.1.2 Dependency Reason

The system must support an order lifecycle with a 'Delivered' state to trigger the rating functionality.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

CUS-039

#### 6.1.2.2 Dependency Reason

Requires an 'Order History' screen where users can access past orders to rate them if the initial prompt was missed.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

CUS-036

#### 6.1.3.2 Dependency Reason

This story implements the rating screen itself, while CUS-036 defines the logic for prompting the user to open this screen.

## 6.2.0.0 Technical Dependencies

- A defined database schema for storing ratings (e.g., a 'ratings' table).
- A backend API endpoint (e.g., `POST /api/v1/orders/{orderId}/ratings`) for submitting ratings.
- The Vendor & Catalog microservice must have a mechanism to store and update a vendor's average rating.

## 6.3.0.0 Data Dependencies

- Requires access to the customer's order data to associate the rating correctly.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API response time for submitting a rating must be under 500ms (P95).
- The recalculation of a vendor's average rating should be handled asynchronously to avoid blocking the user's submission request.

## 7.2.0.0 Security

- All user-submitted text in reviews must be sanitized on the backend to prevent Cross-Site Scripting (XSS) attacks.
- The API must validate that the authenticated user is the owner of the order they are trying to rate.

## 7.3.0.0 Usability

- The rating process should be simple, intuitive, and require minimal steps to complete.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards as per REQ-INT-001.

## 7.5.0.0 Compatibility

- The UI must render correctly on all supported mobile devices and OS versions.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires frontend UI development for the rating component.
- Requires backend API endpoint with robust validation logic.
- Requires database schema design and implementation.
- Potential need for asynchronous processing (e.g., using a message queue like SQS) to update aggregated vendor ratings to ensure scalability.

## 8.3.0.0 Technical Risks

- The logic for calculating and updating average ratings could become a performance bottleneck if not designed efficiently, especially with a large number of vendors and ratings.

## 8.4.0.0 Integration Points

- Order Management Service: To get the 'Delivered' status of an order.
- Vendor & Catalog Service: To update the vendor's profile with the new average rating.
- User Management Service: To validate the customer's identity.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Submit rating with and without a review.
- Attempt to submit without a star rating.
- Attempt to rate an order twice.
- Attempt to rate a non-delivered order.
- Submit a review with special characters and script tags to test sanitization.
- Verify vendor's average rating is updated correctly after multiple submissions.

## 9.3.0.0 Test Data Needs

- Test users with orders in various states ('Preparing', 'In Transit', 'Delivered').
- A test user with a delivered order that has already been rated.
- A test user with a delivered order that has not been rated.

## 9.4.0.0 Testing Tools

- Jest and React Testing Library for frontend unit tests.
- Cypress for E2E testing.
- Postman or similar for API integration testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >= 80% coverage
- E2E tests for the rating submission flow are passing
- User interface reviewed and approved by UX/Product team
- API performance meets the <500ms P95 latency requirement
- Security validation for XSS prevention is implemented and tested
- API documentation (OpenAPI) is updated
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a core feature for platform trust and data collection. It should be prioritized soon after the main order lifecycle is complete.
- Dependent on the completion of the order 'Delivered' status.

## 11.4.0.0 Release Impact

- Enables a key feedback mechanism for the platform. Its absence would be a significant gap in the user experience.

