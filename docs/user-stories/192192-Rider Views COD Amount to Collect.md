# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-021 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider Views COD Amount to Collect |
| As A User Story | As a Delivery Rider, I want the app to clearly and... |
| User Persona | A registered and active Delivery Rider who is assi... |
| Business Value | Ensures accurate collection of revenue for COD ord... |
| Functional Area | Rider-Facing Features |
| Story Theme | Delivery Execution & Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

RDR-021-AC-001

### 3.1.2 Scenario

Display of collection amount for a standard COD order

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a rider is logged in and has been assigned a 'Cash on Delivery' order with a total value of ₹850.50

### 3.1.5 When

the rider navigates to the active delivery screen showing the customer drop-off details

### 3.1.6 Then

the app must display a visually prominent element with the text 'Collect Cash: ₹850.50'

### 3.1.7 Validation Notes

Verify that the amount displayed matches the order's `total_amount` from the backend. The UI element should be easily noticeable.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

RDR-021-AC-002

### 3.2.2 Scenario

No collection amount displayed for a prepaid order

### 3.2.3 Scenario Type

Alternative_Flow

### 3.2.4 Given

a rider is logged in and has been assigned a prepaid (e.g., UPI, Card) order

### 3.2.5 When

the rider navigates to the active delivery screen showing the customer drop-off details

### 3.2.6 Then

the app must NOT display any 'Collect Cash' element or amount

### 3.2.7 Validation Notes

Verify the absence of the COD amount display. Optionally, verify that a 'Prepaid Order' or 'Paid Online' status is shown instead.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

RDR-021-AC-003

### 3.3.2 Scenario

Correct currency formatting for the collection amount

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

a rider is assigned a COD order with a total value of ₹12345

### 3.3.5 When

the rider views the delivery details screen

### 3.3.6 Then

the amount displayed must be formatted with the correct currency symbol and regional separators, such as '₹12,345.00'

### 3.3.7 Validation Notes

Check formatting for various amounts, including those with and without decimals, and those requiring thousand separators.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

RDR-021-AC-004

### 3.4.2 Scenario

UI prominence of the collection amount display

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

a rider is viewing the delivery screen for a COD order on a mobile device in bright daylight

### 3.4.5 When

the rider glances at the screen to confirm the amount

### 3.4.6 Then

the 'Collect Cash' element must be highly legible, using a large font size, high-contrast colors, and a prominent position on the screen (e.g., near the primary action buttons)

### 3.4.7 Validation Notes

This should be verified through UI/UX review and testing on actual devices under different lighting conditions.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A dedicated text label or a card component to display the COD amount.
- A clear textual identifier like 'Collect Cash:' or 'Amount to Collect:'.

## 4.2.0 User Interactions

- This is a display-only feature. No direct user interaction with the amount display element is required.

## 4.3.0 Display Requirements

- The element must only be visible for orders where `payment_method` is 'COD'.
- The amount must be the final, all-inclusive order total.
- The amount must be formatted as Indian Rupees (₹).

## 4.4.0 Accessibility Needs

- The text must have a contrast ratio of at least 4.5:1 against its background to comply with WCAG 2.1 AA.
- The font size should be large enough to be easily readable from a typical viewing distance.

# 5.0.0 Business Rules

- {'rule_id': 'BR-RDR-001', 'rule_description': 'The amount displayed for collection must be the final order total as recorded in the Order Management System.', 'enforcement_point': "Data retrieval from the backend API for the rider's active task.", 'violation_handling': "If the amount cannot be fetched or is invalid, the app should display an error state and prevent the rider from marking the order as 'Delivered' until the data is synced."}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-012

#### 6.1.1.2 Dependency Reason

Rider must be able to accept a task to view its details.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

RDR-016

#### 6.1.2.2 Dependency Reason

The COD amount is most relevant on the delivery leg of the journey, which begins after the 'Picked Up' status update.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

CUS-022

#### 6.1.3.2 Dependency Reason

The order creation flow must correctly identify and flag an order as 'Cash on Delivery' for this feature to work.

## 6.2.0.0 Technical Dependencies

- The Order Management service's API must expose the `payment_method` and `total_amount` for a given order ID.
- The Rider Logistics service must fetch and pass this order data to the rider's mobile application as part of the task details.

## 6.3.0.0 Data Dependencies

- The `orders` data model must contain accurate `payment_method` and `total_amount` fields.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The order details, including the COD amount, must load on the rider's app within 2 seconds of opening the task screen on a stable 3G connection.

## 7.2.0.0 Security

- The API endpoint providing order details must be authenticated and authorized to ensure only the assigned rider can access the information.

## 7.3.0.0 Usability

- The information must be presented without ambiguity. The rider should not have to perform any calculations or search for the amount.

## 7.4.0.0 Accessibility

- Adherence to WCAG 2.1 Level AA for color contrast and text size.

## 7.5.0.0 Compatibility

- The UI must render correctly on all supported iOS and Android devices and OS versions.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Low

## 8.2.0.0 Complexity Factors

- Primarily a frontend UI change involving conditional rendering.
- Backend change is minimal, likely just adding two fields to an existing API response.
- No complex business logic is involved in this story itself.

## 8.3.0.0 Technical Risks

- Data inconsistency between what the customer sees as the total and what the rider is shown. This risk is mitigated by ensuring both clients fetch the `total_amount` from the single source of truth (Order service).

## 8.4.0.0 Integration Points

- Rider mobile application will call the Rider Logistics/Task Management backend service.
- Rider Logistics service will fetch order details from the Order Management service.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- Verify correct amount is shown for a COD order.
- Verify no amount is shown for a prepaid (UPI/Card) order.
- Verify correct currency formatting for amounts less than 1000 and greater than 1000.
- Verify UI on different screen sizes and in both light and dark modes (if applicable).

## 9.3.0.0 Test Data Needs

- A test user account with the 'Rider' role.
- At least one order with `payment_method: 'COD'` assigned to the test rider.
- At least one order with `payment_method: 'UPI'` (or other prepaid type) assigned to the test rider.

## 9.4.0.0 Testing Tools

- Jest and React Testing Library for frontend unit tests.
- Cypress or a similar framework for E2E testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in the staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit tests are written for the new UI component and conditional logic, achieving >80% coverage.
- Integration tests confirm the frontend correctly displays data from the backend API.
- Automated E2E test scenarios for both COD and prepaid orders are passing.
- UI/UX review has been completed and any feedback has been addressed.
- No performance regressions have been introduced.
- The feature is verified on both target platforms (iOS and Android).

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

1

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a critical feature for enabling COD functionality. It should be prioritized in the sprint where COD deliveries are planned to be enabled.
- Dependent on the backend API being ready to provide the `payment_method` and `total_amount` fields.

## 11.4.0.0 Release Impact

This story is a mandatory component for the launch of Cash on Delivery as a payment option.

