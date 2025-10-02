# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | CUS-022 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Customer Selects Payment Method During Checkout |
| As A User Story | As a customer at the checkout stage, I want to see... |
| User Persona | A registered customer who has items in their cart ... |
| Business Value | Increases order conversion rates and customer sati... |
| Functional Area | Checkout & Payments |
| Story Theme | Order Placement Journey |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Display of all available payment methods for an eligible order

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a customer is on the payment selection screen of the checkout flow and their order total is less than the administrator-configured COD limit

### 3.1.5 When

the payment options are loaded

### 3.1.6 Then

the system must display 'Unified Payments Interface (UPI)', 'Credit/Debit Cards', and 'Cash on Delivery (COD)' as selectable options.

### 3.1.7 Validation Notes

Verify that all three payment methods are visible and enabled. The COD limit should be fetched from the backend configuration.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Customer selects an online payment method (UPI or Card)

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

a customer is on the payment selection screen

### 3.2.5 When

the customer selects either 'UPI' or 'Credit/Debit Card'

### 3.2.6 Then

the selected option is visually highlighted, any other selection is cleared, and the primary action button is labeled 'Proceed to Pay'.

### 3.2.7 Validation Notes

Test by selecting UPI, then selecting Card. The UI should update correctly. Clicking 'Proceed to Pay' will trigger the flow for CUS-025.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Customer selects Cash on Delivery for an eligible order

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

a customer is on the payment selection screen and their order total is not greater than the COD limit

### 3.3.5 When

the customer selects 'Cash on Delivery'

### 3.3.6 Then

the 'Cash on Delivery' option is visually highlighted, any other selection is cleared, and the primary action button is labeled 'Confirm Order'.

### 3.3.7 Validation Notes

Verify that clicking 'Confirm Order' places the order directly without redirecting to a payment gateway.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Cash on Delivery option is disabled for high-value orders

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

a customer is on the payment selection screen and their order total is greater than the administrator-configured COD limit

### 3.4.5 When

the payment options are loaded

### 3.4.6 Then

the 'Cash on Delivery' option must be displayed in a disabled (greyed out) state and be unselectable.

### 3.4.7 And

a clear, non-intrusive message is displayed, such as 'COD is not available for orders above ₹2,500'.

### 3.4.8 Validation Notes

Test with an order total of ₹2,500.01 where the limit is ₹2,500. The message must be visible and the option unclickable.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Customer changes their payment method selection

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

a customer has selected 'UPI' on the payment selection screen

### 3.5.5 When

the customer then selects 'Cash on Delivery' (assuming the order is eligible)

### 3.5.6 Then

the 'UPI' option becomes deselected, 'Cash on Delivery' becomes selected, and the action button text changes from 'Proceed to Pay' to 'Confirm Order'.

### 3.5.7 Validation Notes

Verify this flow works in both directions (online to COD and COD to online).

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A list of payment options, each implemented as a radio button or a similar single-select component.
- Icon/logo for each payment method (UPI, Visa/Mastercard, COD).
- A primary call-to-action button ('Proceed to Pay' or 'Confirm Order').
- A text label to display the reason for COD being unavailable.

## 4.2.0 User Interactions

- Tapping a payment option selects it and deselects any other.
- The primary action button's text and action must update dynamically based on the selected payment method.
- Disabled options must not have a hover/press effect.

## 4.3.0 Display Requirements

- The currently selected payment method must be clearly indicated.
- The order total, used for the COD check, should be visible on the same screen for context.

## 4.4.0 Accessibility Needs

- All selectable options must have proper labels for screen readers (e.g., 'Select UPI as payment method').
- The disabled state of the COD option must be conveyed to assistive technologies.
- The UI must adhere to WCAG 2.1 Level AA contrast ratios.

# 5.0.0 Business Rules

- {'rule_id': 'REQ-BR-001', 'rule_description': 'Cash on Delivery (COD) is only available for orders with a total value up to a configurable limit (default ₹2,500).', 'enforcement_point': 'On the payment selection screen during checkout.', 'violation_handling': 'The COD option is disabled and a message is displayed to the user explaining the limit.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

CUS-019

#### 6.1.1.2 Dependency Reason

The cart summary and total are required to determine eligibility for Cash on Delivery.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-008

#### 6.1.2.2 Dependency Reason

The backend must provide an API endpoint for the client to fetch the current COD maximum order value.

## 6.2.0.0 Technical Dependencies

- Access to the application's state management to retrieve the final cart total.
- A backend API endpoint to fetch platform business rules, specifically the COD limit.

## 6.3.0.0 Data Dependencies

- Final calculated order total, including all items, taxes, and fees.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The payment selection screen should load in under 1 second.
- The UI response to selecting a payment method must be instantaneous (<100ms).

## 7.2.0.0 Security

- The selected payment method must be transmitted securely to the backend.
- The client-side check for the COD limit should be re-validated on the server-side when the order is placed to prevent tampering.

## 7.3.0.0 Usability

- The reason for a disabled payment option must be clearly and concisely communicated to the user.
- The most common payment methods should be listed first.

## 7.4.0.0 Accessibility

- Must be compliant with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The UI must be responsive and function correctly on all supported iOS and Android device screen sizes.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Low

## 8.2.0.0 Complexity Factors

- Requires a new API call to fetch business rule configurations.
- Involves conditional rendering logic in the UI based on the fetched configuration and cart total.
- State management for the checkout flow needs to be updated to store the selected payment method.

## 8.3.0.0 Technical Risks

- Graceful handling is required if the API call to fetch the COD limit fails. The system should default to a safe state, such as disabling COD, to mitigate financial risk.

## 8.4.0.0 Integration Points

- Backend Configuration Service API (to get COD limit).
- Frontend State Management (e.g., Redux Toolkit) for the checkout flow.
- Order Placement Service API (to pass the selected payment method when creating the order).

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Accessibility

## 9.2.0.0 Test Scenarios

- Verify UI with an order total of ₹2499 (COD enabled).
- Verify UI with an order total of ₹2500 (COD enabled).
- Verify UI with an order total of ₹2501 (COD disabled).
- Verify the flow of selecting UPI, then switching to COD, and vice-versa.
- Verify the API failure scenario for fetching the COD limit and ensure the UI defaults to a safe state.
- Verify screen reader functionality for all elements.

## 9.3.0.0 Test Data Needs

- Test user accounts.
- A configurable COD limit in the test/staging environment.
- A catalog of products with various prices to easily construct carts with specific total values.

## 9.4.0.0 Testing Tools

- Jest
- React Testing Library
- Cypress for E2E tests.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in the staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written with >80% code coverage for the new logic.
- End-to-end tests for all payment selection scenarios are passing.
- UI has been reviewed and approved by the UX/UI designer.
- Performance requirements are met.
- Backend re-validation of the COD limit is implemented and tested.
- Accessibility checks have been performed and passed.
- The story has been successfully deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

3

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is a critical blocker for the end-to-end payment flow.
- Dependent story ADM-008 (Admin Configures COD Limit) must be completed or have its API contract finalized before frontend development can be completed.

## 11.4.0.0 Release Impact

This is a core feature required for the initial MVP launch. The platform cannot process orders without it.

