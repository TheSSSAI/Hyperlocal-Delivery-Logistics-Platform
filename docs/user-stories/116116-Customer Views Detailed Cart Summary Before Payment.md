# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | CUS-019 |
| Elaboration Date | 2024-05-21 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Customer Views Detailed Cart Summary Before Paymen... |
| As A User Story | As a customer reviewing my order, I want to see a ... |
| User Persona | A customer who has added one or more items to thei... |
| Business Value | Increases customer trust and reduces cart abandonm... |
| Functional Area | Ordering and Checkout |
| Story Theme | Customer-Facing Features |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Display of all cost components for a standard order

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a customer has items in their cart and navigates to the cart summary screen

### 3.1.5 When

the cart summary screen loads

### 3.1.6 Then

the screen must display separate line items for 'Item Subtotal', 'Taxes', 'Delivery Fee', and a visually distinct 'Total Amount'.

### 3.1.7 Validation Notes

Verify that all four components are present and clearly labeled. The currency symbol '₹' must be present for all values.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Correct calculation of Item Subtotal

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

a customer's cart contains Item A (₹150 x 2) and Item B (₹200 x 1)

### 3.2.5 When

the cart summary is calculated

### 3.2.6 Then

the 'Item Subtotal' must be displayed as '₹500.00'.

### 3.2.7 Validation Notes

Test with multiple items and quantities. The calculation must be SUM(item_price * item_quantity) for all items in the cart.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Correct calculation of the final Total Amount

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

the Item Subtotal is ₹500.00, Taxes are ₹25.00, and the Delivery Fee is ₹40.00

### 3.3.5 When

the cart summary is calculated

### 3.3.6 Then

the 'Total Amount' must be displayed as '₹565.00'.

### 3.3.7 Validation Notes

Verify the formula: Total = Subtotal + Taxes + Delivery Fee. This should also correctly subtract any applied discounts in the future.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Display of items in the cart

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

a customer is viewing the cart summary

### 3.4.5 When

the screen is loaded

### 3.4.6 Then

a list of all items in the cart is displayed, with each item showing its name, selected quantity, and price per unit.

### 3.4.7 Validation Notes

Verify that the item list accurately reflects the contents of the cart.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Viewing the cart summary with an empty cart

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

a customer's cart is empty

### 3.5.5 When

they navigate to the cart summary screen

### 3.5.6 Then

a message like 'Your cart is empty' is displayed.

### 3.5.7 And

the cost breakdown (Subtotal, Taxes, etc.) and the 'Proceed to Payment' button are hidden or disabled.

### 3.5.8 Validation Notes

The user should be presented with a clear state and ideally a call-to-action to start shopping.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Cart summary with a promotional free delivery

### 3.6.3 Scenario Type

Alternative_Flow

### 3.6.4 Given

a customer's order qualifies for free delivery

### 3.6.5 When

they view the cart summary

### 3.6.6 Then

the 'Delivery Fee' line item must display 'Free' or '₹0.00'.

### 3.6.7 And

the Total Amount must be calculated correctly without adding a delivery fee.

### 3.6.8 Validation Notes

Ensure the UI handles a zero-value fee gracefully and the total calculation is accurate.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A list view for cart items (showing image, name, price, quantity)
- Text labels for 'Item Subtotal', 'Taxes', 'Delivery Fee'
- Text fields to display the calculated values for each cost component
- A visually distinct, prominent text field for the 'Total Amount'
- A primary call-to-action button labeled 'Proceed to Payment'

## 4.2.0 User Interactions

- The summary should be static and read-only on this screen. Any changes to the cart (e.g., updating quantity) should happen on a previous screen or via an 'edit' action that navigates away and then returns.
- Tapping the 'Proceed to Payment' button navigates the user to the payment selection screen.

## 4.3.0 Display Requirements

- All monetary values must be displayed with the Indian Rupee symbol (₹) and formatted to two decimal places.
- The layout must be clean, with clear separation between the item list and the cost breakdown.
- The 'Total Amount' should be the most prominent element in the cost summary section.

## 4.4.0 Accessibility Needs

- All text must meet WCAG 2.1 AA contrast ratio standards.
- All interactive elements (like the 'Proceed to Payment' button) must have accessible names and roles for screen readers.
- The cost breakdown should be structured logically for screen reader navigation.

# 5.0.0 Business Rules

- {'rule_id': 'BR-CART-001', 'rule_description': 'The cart summary must be calculated based on the final state of the cart before proceeding to payment. All prices, taxes, and fees must be locked in at this stage, pending final availability check.', 'enforcement_point': 'Backend API endpoint that serves the cart summary data.', 'violation_handling': "If calculation fails, the API should return a 500 error and the UI should display a user-friendly error message like 'Could not load cart summary. Please try again.'"}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

CUS-016

#### 6.1.1.2 Dependency Reason

A cart must exist and have items added to it before a summary can be displayed.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

CUS-017

#### 6.1.2.2 Dependency Reason

The summary must reflect the correct quantity of items, which is managed in this story.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

CUS-018

#### 6.1.3.2 Dependency Reason

The summary must not include items that have been removed from the cart.

## 6.2.0.0 Technical Dependencies

- A backend service/API endpoint to calculate and provide all cart summary components (subtotal, taxes, fees, total).
- Access to the Product/Catalog service to get accurate item prices.
- Access to a Tax calculation engine/ruleset.
- Access to a Delivery Fee calculation engine/ruleset.

## 6.3.0.0 Data Dependencies

- Requires an active user session with a valid cart object containing product IDs and quantities.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API call to fetch the cart summary must respond in under 500ms (P95).
- The UI must render the summary screen in under 1 second.

## 7.2.0.0 Security

- The API endpoint for the cart summary must be authenticated and authorized, ensuring a user can only view their own cart.
- No sensitive payment information should be handled or displayed on this screen.

## 7.3.0.0 Usability

- The cost breakdown must be unambiguous and easy for a non-technical user to understand.
- The path to proceed to the next step (payment) must be clear and obvious.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards as per REQ-INT-001.

## 7.5.0.0 Compatibility

- The mobile application UI must be responsive and function correctly on supported iOS and Android devices.
- If this view exists on a web dashboard, it must be responsive on all modern browsers.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Backend logic requires aggregating data from multiple sources (cart state, product prices, tax rules, delivery fee logic) into a single, consistent response.
- Ensuring the accuracy and consistency of financial calculations is critical and requires robust testing.
- The performance of the calculation API is important to provide a smooth user experience.

## 8.3.0.0 Technical Risks

- Potential for race conditions if the cart is modified while the summary is being calculated. The system should fetch the latest cart state for calculation.
- Misconfiguration of tax or delivery fee rules could lead to incorrect calculations.

## 8.4.0.0 Integration Points

- Backend: Cart Service, Product Service, Tax Service, Delivery Fee Service.
- Frontend: User's current cart state management (e.g., Redux, React Query).

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Accessibility

## 9.2.0.0 Test Scenarios

- Test with a single item in the cart.
- Test with multiple items of varying quantities.
- Test with an empty cart.
- Test with an order that qualifies for free delivery.
- Test with an order that has a complex tax calculation (if applicable).
- Verify UI on different screen sizes.

## 9.3.0.0 Test Data Needs

- User accounts with pre-populated carts.
- Products with various prices.
- Promotional rules that grant free delivery.

## 9.4.0.0 Testing Tools

- Jest and React Testing Library for frontend unit tests.
- Jest for backend unit/integration tests.
- Cypress for end-to-end testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >80% coverage and passing
- End-to-end tests for the cart summary flow are passing
- User interface reviewed and approved by UX/UI designer
- Performance requirements (API latency) verified under load
- Accessibility audit passed for the screen
- Documentation for the cart summary API endpoint is created/updated (OpenAPI spec)
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

3

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a critical story in the core user journey and a blocker for the payment processing story (CUS-025).
- Requires backend and frontend collaboration. The API contract should be defined early.

## 11.4.0.0 Release Impact

Essential for the Minimum Viable Product (MVP) launch. The platform cannot process orders without this functionality.

