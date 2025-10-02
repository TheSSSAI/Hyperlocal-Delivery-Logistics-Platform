# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | CUS-017 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Customer Updates Item Quantity in Cart |
| As A User Story | As a Customer viewing my shopping cart, I want to ... |
| User Persona | A registered or guest customer who has added at le... |
| Business Value | Improves user experience by providing essential co... |
| Functional Area | Ordering and Cart Management |
| Story Theme | Customer-Facing Features |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Successfully increase item quantity

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a customer is on the cart screen with 'Product A' (Price: ₹100, Stock: 10) at a quantity of 2

### 3.1.5 When

the customer taps the '+' button for 'Product A'

### 3.1.6 Then

the quantity for 'Product A' immediately displays as 3, the line item total for 'Product A' updates to ₹300, and the cart's overall subtotal, taxes, and final total are recalculated and updated in the UI.

### 3.1.7 Validation Notes

Verify via UI inspection and by checking the API response for the updated cart state. The backend must confirm the change in the database.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Successfully decrease item quantity

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

a customer is on the cart screen with 'Product A' (Price: ₹100) at a quantity of 2

### 3.2.5 When

the customer taps the '-' button for 'Product A'

### 3.2.6 Then

the quantity for 'Product A' immediately displays as 1, the line item total for 'Product A' updates to ₹100, and the cart's overall subtotal, taxes, and final total are recalculated and updated in the UI.

### 3.2.7 Validation Notes

Verify via UI inspection and API response. The change must be persisted on the server.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Attempt to increase quantity beyond available stock

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

a customer is on the cart screen with 'Product B' (Stock: 5) at a quantity of 5

### 3.3.5 When

the customer taps the '+' button for 'Product B'

### 3.3.6 Then

the quantity remains 5, the '+' button may appear disabled, and a non-blocking message (e.g., toast notification) is displayed stating 'Maximum quantity reached' or 'Only 5 items available'.

### 3.3.7 Validation Notes

The UI should not update the quantity. The backend API call should be prevented or should return an error indicating insufficient stock.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Decrease item quantity to zero, triggering removal

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

a customer is on the cart screen with 'Product A' at a quantity of 1

### 3.4.5 When

the customer taps the '-' button for 'Product A'

### 3.4.6 Then

a confirmation modal appears with the message 'Remove this item from your cart?' and options 'Remove' and 'Cancel'.

### 3.4.7 Validation Notes

This is a two-step process. See AC-005 for the confirmation step.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Confirm removal after decreasing quantity to zero

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

the 'Remove this item from your cart?' confirmation modal is displayed

### 3.5.5 When

the customer taps the 'Remove' button

### 3.5.6 Then

'Product A' is removed from the cart view, and the cart's overall subtotal, taxes, and final total are recalculated to reflect the removal.

### 3.5.7 Validation Notes

Verify the item is gone from the UI and the API response confirms the cart no longer contains the item.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Backend validation of price and stock on update

### 3.6.3 Scenario Type

Security

### 3.6.4 Given

a customer has an item in their cart

### 3.6.5 When

the client sends an API request to update the quantity of that item

### 3.6.6 Then

the backend service must independently verify the item's current price and available stock from the database before committing the quantity change.

### 3.6.7 Validation Notes

This is a backend test. A test case should simulate a request with a stale price or a quantity exceeding now-unavailable stock to ensure the server rejects it.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Network failure during quantity update

### 3.7.3 Scenario Type

Error_Condition

### 3.7.4 Given

a customer attempts to update an item's quantity

### 3.7.5 When

the API call to the backend fails due to a network error

### 3.7.6 Then

the UI reverts the quantity and totals to their original state before the action was attempted, and an error message like 'Could not update cart. Please check your connection.' is displayed.

### 3.7.7 Validation Notes

Use browser developer tools or a proxy to simulate network failure and observe the UI's rollback behavior.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A dedicated 'Cart' screen listing all added items.
- For each item: a '+' button, a '-' button, and a non-editable text display showing the current quantity.
- A confirmation modal for item removal.
- A non-blocking notification component (e.g., toast) for displaying errors or stock limits.

## 4.2.0 User Interactions

- Tapping '+' increments the quantity.
- Tapping '-' decrements the quantity.
- All price and total fields in the UI must update in real-time upon quantity change.
- The UI should provide immediate feedback. An optimistic update on the client-side is preferred, with a rollback mechanism if the server call fails.

## 4.3.0 Display Requirements

- The line item total price (item price * quantity) must be displayed for each item.
- The cart summary (subtotal, taxes, delivery fee, final total) must be clearly visible and update instantly.

## 4.4.0 Accessibility Needs

- The '+' and '-' controls must be implemented as buttons with appropriate ARIA labels, e.g., 'aria-label="Increase quantity for Product A"'.
- Tap targets for the controls must meet WCAG 2.1 AA size requirements.
- Changes to the cart total should be announced by screen readers using ARIA live regions.

# 5.0.0 Business Rules

- {'rule_id': 'BR-INV-01', 'rule_description': 'A customer cannot set an item quantity in the cart that is greater than the currently available stock for that item.', 'enforcement_point': 'Both on the client-side (disabling UI controls) and server-side (API validation) during the quantity update action.', 'violation_handling': 'The update request is rejected, and the user is notified of the stock limitation.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

CUS-016

#### 6.1.1.2 Dependency Reason

This story modifies an item in the cart; CUS-016 provides the functionality to add an item to the cart.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

CUS-019

#### 6.1.2.2 Dependency Reason

This story's UI elements are part of the cart summary screen, which is defined in CUS-019.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

REQ-FUN-005

#### 6.1.3.2 Dependency Reason

This story depends on the system's ability to track and expose real-time inventory levels to prevent ordering beyond available stock.

## 6.2.0.0 Technical Dependencies

- A backend Cart service with an API endpoint (e.g., PATCH /api/v1/cart/items/{itemId}) to update item quantities.
- A backend Inventory service that the Cart service can query in real-time to validate stock availability.
- A frontend state management library (e.g., Redux Toolkit) to manage the cart state efficiently.

## 6.3.0.0 Data Dependencies

- Requires product data to be available, including a numerical stock quantity for each product.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API response time for a cart quantity update must be under 200ms (P95), as per REQ-NFR-001.
- The UI update on the client device must be visually instantaneous (<100ms).

## 7.2.0.0 Security

- The API endpoint for updating the cart must be authenticated and authorized to ensure users can only modify their own cart.
- The server must perform its own validation of stock and price, never trusting the values sent from the client.

## 7.3.0.0 Usability

- The quantity controls should be intuitive and provide immediate visual feedback.
- Error messages (e.g., for stock limits) should be clear and concise.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards, as per REQ-INT-001.

## 7.5.0.0 Compatibility

- Functionality must be consistent across all supported mobile devices (iOS/Android) via React Native.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires real-time, synchronous communication between the Cart and Inventory microservices, which can introduce latency.
- Backend logic must handle potential race conditions where multiple users try to update the cart with the last few items in stock. The update operation should be atomic.
- Frontend state management can be complex to ensure all dependent values (item total, cart subtotal, taxes, final total) update correctly and consistently.

## 8.3.0.0 Technical Risks

- High latency from the Inventory service could lead to a poor user experience. Caching strategies may need to be considered.
- Failure to handle race conditions correctly on the backend could lead to overselling inventory.

## 8.4.0.0 Integration Points

- Frontend Application <-> API Gateway
- API Gateway <-> Cart Service
- Cart Service <-> Inventory Service
- Cart Service <-> User/Session Database

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Performance
- Accessibility

## 9.2.0.0 Test Scenarios

- Verify quantity increment/decrement and corresponding price updates.
- Test the stock limit enforcement by setting up a product with a known, low stock count.
- Test the item removal flow when quantity is decreased to zero.
- Simulate API failures to ensure the UI handles errors gracefully.
- Write an integration test to confirm the Cart service correctly calls the Inventory service.

## 9.3.0.0 Test Data Needs

- User accounts.
- Products with varying and specific stock levels (e.g., stock=1, stock=5, stock=99).
- A product that is marked as 'Out of Stock'.

## 9.4.0.0 Testing Tools

- Jest and React Testing Library for frontend unit/integration tests.
- Jest for backend unit/integration tests.
- Cypress for E2E testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit test coverage for new logic is at or above the 80% project standard.
- Automated E2E tests for all primary scenarios (increase, decrease, stock limit, remove) are created and passing.
- UI/UX has been reviewed and approved by the design/product team.
- Performance of the update API has been benchmarked and meets the <200ms P95 requirement.
- Accessibility checks (screen reader labels, tap target size) have been completed and verified.
- The feature is deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

3

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a core feature for the Minimum Viable Product (MVP).
- Requires that the APIs from the Inventory service are stable and available for consumption by the Cart service team.
- Frontend and backend work can be done in parallel but requires a clear API contract defined early in the sprint.

## 11.4.0.0 Release Impact

This feature is critical for the initial launch. The platform cannot go live without this basic cart functionality.

