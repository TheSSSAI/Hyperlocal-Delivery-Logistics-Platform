# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-024 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider Views 'Cash-in-Hand' Total |
| As A User Story | As a Rider, I want to see a clear, real-time runni... |
| User Persona | Rider: A registered and active delivery partner us... |
| Business Value | Increases financial transparency and trust for rid... |
| Functional Area | Rider Financials & Earnings |
| Story Theme | Rider Earnings Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

RDR-024-AC-001

### 3.1.2 Scenario

Display of Cash-in-Hand for a rider with existing COD collections

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a rider has completed two COD orders worth ₹300 and ₹450 since their last cash remittance

### 3.1.5 When

the rider navigates to the 'Earnings' screen in the mobile application

### 3.1.6 Then

the system must display a clearly labeled 'Cash-in-Hand' total of '₹750.00'.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

RDR-024-AC-002

### 3.2.2 Scenario

Real-time update after completing a new COD order

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

the rider's current 'Cash-in-Hand' total is '₹750.00'

### 3.2.5 When

the rider successfully completes a new COD order worth ₹250 and marks it as 'Delivered'

### 3.2.6 Then

the 'Cash-in-Hand' total on the 'Earnings' screen must update to '₹1,000.00' within 2 seconds.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

RDR-024-AC-003

### 3.3.2 Scenario

Total remains unchanged after completing a prepaid order

### 3.3.3 Scenario Type

Alternative_Flow

### 3.3.4 Given

the rider's current 'Cash-in-Hand' total is '₹500.00'

### 3.3.5 When

the rider successfully completes a prepaid (UPI, Card) order and marks it as 'Delivered'

### 3.3.6 Then

the 'Cash-in-Hand' total must remain unchanged at '₹500.00'.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

RDR-024-AC-004

### 3.4.2 Scenario

Display for a new rider with no COD history

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

a newly registered rider has not yet completed any COD orders

### 3.4.5 When

the rider navigates to the 'Earnings' screen

### 3.4.6 Then

the 'Cash-in-Hand' total must be displayed as '₹0.00'.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

RDR-024-AC-005

### 3.5.2 Scenario

Balance resets after cash remittance is confirmed

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

the rider's current 'Cash-in-Hand' total is '₹1,200.00'

### 3.5.5 When

the rider completes the cash remittance process for ₹1,200.00 and it is confirmed by the system

### 3.5.6 Then

the 'Cash-in-Hand' total must reset to '₹0.00'.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

RDR-024-AC-006

### 3.6.2 Scenario

Displaying cached data when offline

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

the rider's last known 'Cash-in-Hand' total was '₹800.00'

### 3.6.5 When

the rider opens the 'Earnings' screen while their device has no internet connectivity

### 3.6.6 Then

the screen must display the cached total of '₹800.00' along with a visual indicator (e.g., 'Last updated: [timestamp]' or an offline icon) that the data may be stale.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A dedicated card or section within the 'Earnings' tab of the rider application.
- A large, legible text element to display the monetary value.

## 4.2.0 User Interactions

- The value is display-only; no direct user interaction with the total itself is required for this story.
- The screen should support a pull-to-refresh gesture to manually sync the latest value.

## 4.3.0 Display Requirements

- The value must be clearly labeled as 'Cash-in-Hand' or a similarly unambiguous term.
- The amount must be formatted as Indian Rupees (₹) with two decimal places (e.g., ₹1,234.50).
- A visual indicator for stale/offline data must be present when the app cannot sync with the backend.

## 4.4.0 Accessibility Needs

- The displayed total must be readable by screen readers, announcing the label and the full currency amount.
- Sufficient color contrast must be used for the text and its background to meet WCAG 2.1 AA standards.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-RDR-CIH-001

### 5.1.2 Rule Description

The 'Cash-in-Hand' total must only include the value of completed orders with the 'Cash on Delivery' (COD) payment method.

### 5.1.3 Enforcement Point

Backend calculation logic within the Payments & Settlements service.

### 5.1.4 Violation Handling

Any non-COD order value must be excluded from the sum. This is a system logic constraint.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-RDR-CIH-002

### 5.2.2 Rule Description

The 'Cash-in-Hand' total is cumulative and only decreases upon a confirmed cash remittance event.

### 5.2.3 Enforcement Point

Backend rider ledger within the Payments & Settlements service.

### 5.2.4 Violation Handling

The balance cannot be manually edited by the rider. Changes are event-driven (delivery completion, remittance confirmation).

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-019

#### 6.1.1.2 Dependency Reason

The 'Delivered' status update is the trigger event for adding an order's value to the Cash-in-Hand total.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

RDR-021

#### 6.1.2.2 Dependency Reason

This story establishes that the COD amount for an order is known and accessible to the system and rider.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

RDR-025

#### 6.1.3.2 Dependency Reason

The cash remittance process is required to reset or decrease the Cash-in-Hand total, providing the full lifecycle for this balance.

## 6.2.0.0 Technical Dependencies

- The 'Payments & Settlements' microservice must exist to manage the rider's financial ledger.
- The Order Management service must publish an event (e.g., via SQS/SNS) upon order completion that includes the order ID, final amount, and payment method.
- A real-time communication channel (WebSocket or push notification) to inform the client app of updates, or a dedicated API endpoint for the app to poll.

## 6.3.0.0 Data Dependencies

- Access to the final, authoritative order details, including total amount and payment method.
- A persistent, transaction-safe data store (e.g., a ledger table in PostgreSQL) to track each rider's COD collections and remittances.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API endpoint to fetch the Cash-in-Hand total must respond with P95 latency under 200ms.
- The UI on the rider's app must reflect the updated total within 2 seconds of an order being marked 'Delivered'.

## 7.2.0.0 Security

- The API endpoint for fetching financial data must be secured and only accessible by the authenticated rider to whom the data belongs.
- All financial data must be transmitted over HTTPS/TLS 1.2+.

## 7.3.0.0 Usability

- The information must be presented clearly and concisely, requiring minimal cognitive load from a rider who may be on the move.

## 7.4.0.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA guidelines.

## 7.5.0.0 Compatibility

- The feature must function correctly on all supported versions of iOS and Android for the React Native application.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires careful design of a financial ledger system to ensure accuracy and auditability.
- The need for atomic updates: marking an order delivered and updating the rider's balance must succeed or fail together.
- Handling state management and data synchronization between the backend and the mobile client, especially in offline scenarios.

## 8.3.0.0 Technical Risks

- Race conditions or calculation errors could lead to incorrect financial data, damaging rider trust.
- Delays in the event-driven architecture could cause a noticeable lag in the UI update.

## 8.4.0.0 Integration Points

- Subscribes to events from the 'Order Management' service.
- Provides data to the 'Rider' mobile application via a REST API.
- Will need to integrate with the future 'Cash Remittance' feature logic.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Usability

## 9.2.0.0 Test Scenarios

- Verify calculation with a sequence of COD and prepaid orders.
- Verify balance resets correctly after a mock remittance event.
- Verify UI behavior in an offline state and subsequent re-sync.
- Verify the total for a brand new rider.
- Verify currency formatting for various amounts (e.g., 0, 99, 1000, 1234.50).

## 9.3.0.0 Test Data Needs

- Test rider accounts in various states: new, with existing COD balance, with zero balance.
- A set of test orders with both COD and prepaid payment methods.

## 9.4.0.0 Testing Tools

- Jest for backend unit tests.
- React Testing Library for frontend component tests.
- Cypress or a similar framework for E2E testing the React Native app.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Backend code has >80% unit test coverage for the calculation logic.
- Code has been peer-reviewed and merged into the main branch.
- Integration tests confirm that the Order service event correctly triggers the balance update in the Payments service.
- UI/UX has been reviewed and approved by the design team.
- API endpoint performance meets the specified latency requirements under load.
- All related documentation, including the OpenAPI spec for the new endpoint, is updated.
- The feature has been successfully deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is a foundational piece for the entire cash management lifecycle for riders. It should be prioritized before implementing the actual cash remittance feature.
- Requires collaboration between backend (Payments service) and frontend (Rider app) developers.

## 11.4.0.0 Release Impact

This is a critical feature for rider satisfaction and operational efficiency. It is required for any market launch where Cash on Delivery is supported.

