# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | CUS-040 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Customer Provides OTP for Proof of Delivery |
| As A User Story | As a Customer, I want to see a unique OTP in my ap... |
| User Persona | Customer placing an order for delivery. |
| Business Value | Increases delivery security, reduces disputes and ... |
| Functional Area | Order Tracking & Delivery |
| Story Theme | Proof of Delivery Enhancements |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Happy Path: Successful delivery confirmation with correct OTP

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a customer with an active order, the order status is 'Arrived at Destination', and the configured Proof of Delivery method for this order is OTP

### 3.1.5 When

I view the live order tracking screen in my application

### 3.1.6 Then

A unique, 4-digit numeric OTP is clearly displayed with the instruction 'Provide this OTP to your rider to confirm delivery'.

### 3.1.7 Validation Notes

Verify the OTP is visible. The rider must then enter this OTP in their app. Upon successful validation, the order status in both the customer and rider apps must update to 'Delivered'.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Error Condition: Rider enters an incorrect OTP

### 3.2.3 Scenario Type

Error_Condition

### 3.2.4 Given

The rider is at my location to deliver an order and I have provided them an OTP from my app

### 3.2.5 When

The rider enters an incorrect OTP into their application and submits it

### 3.2.6 Then

The system rejects the OTP, and the rider's app displays a clear error message, such as 'Invalid OTP. Please try again.'

### 3.2.7 Validation Notes

The order status must remain 'Arrived at Destination'. The failed attempt count for the order should be incremented on the backend.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Edge Case: OTP validation is locked after multiple failed attempts

### 3.3.3 Scenario Type

Edge_Case

### 3.3.4 Given

A rider has already made 2 failed OTP attempts for my order

### 3.3.5 When

The rider enters a third incorrect OTP

### 3.3.6 Then

The system rejects the OTP and temporarily locks OTP validation for that specific order for 5 minutes.

### 3.3.7 And

The rider's app displays a message like 'Too many failed attempts. Please try again in 5 minutes or use an alternative POD method if available.'

### 3.3.8 Validation Notes

Verify that any subsequent validation attempts for this order within the 5-minute window are immediately rejected with a 'Validation locked' error.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

OTP is not visible before rider's arrival

### 3.4.3 Scenario Type

Alternative_Flow

### 3.4.4 Given

I am a customer with an active order

### 3.4.5 When

The order status is any state before 'Arrived at Destination' (e.g., 'In Transit')

### 3.4.6 Then

The delivery confirmation OTP is not visible in my application.

### 3.4.7 Validation Notes

Check the order tracking screen at various stages of the delivery lifecycle to ensure the OTP is only displayed at the correct time.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

OTP is no longer needed after delivery is complete

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

My order has been successfully delivered and its status is 'Delivered'

### 3.5.5 When

I view the order details screen

### 3.5.6 Then

The delivery confirmation OTP is no longer displayed, replaced by the final order status information.

### 3.5.7 Validation Notes

Verify the UI state change after the order is marked as delivered.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A dedicated section/card on the customer's live order tracking screen to display the OTP.
- Large, easily readable font for the 4-digit OTP.
- Instructional text for the customer.
- Numeric input field on the rider's app for OTP entry.
- A 'Confirm Delivery' button on the rider's app.
- Error message display area on the rider's app.

## 4.2.0 User Interactions

- The OTP display appears automatically when the order state changes to 'Arrived at Destination'.
- The rider enters the 4 digits and taps a button to submit.
- The rider's app provides immediate visual feedback for success or failure of the OTP validation.

## 4.3.0 Display Requirements

- Customer App: Must display the 4-digit OTP and clear instructions.
- Rider App: Must display an input field, a submit button, and clear error/success messages.

## 4.4.0 Accessibility Needs

- The OTP display must have sufficient color contrast to be easily readable (WCAG 2.1 AA).
- The OTP should be readable by screen readers for visually impaired users.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-POD-001

### 5.1.2 Rule Description

A unique OTP must be generated for each order configured to use this POD method.

### 5.1.3 Enforcement Point

Backend (Order Management Service) when order status is updated to 'Ready for Pickup' or similar state.

### 5.1.4 Violation Handling

The order cannot proceed to the delivery phase without a valid OTP associated with it.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-POD-002

### 5.2.2 Rule Description

OTP validation attempts are limited to 3 per lock-out period.

### 5.2.3 Enforcement Point

Backend (OTP Validation Endpoint).

### 5.2.4 Violation Handling

After 3 failed attempts, the endpoint will reject further attempts for that order for a configurable duration (default: 5 minutes).

## 5.3.0 Rule Id

### 5.3.1 Rule Id

BR-POD-003

### 5.3.2 Rule Description

The OTP has a limited validity period (e.g., 15 minutes from when the rider marks 'Arrived at Destination').

### 5.3.3 Enforcement Point

Backend (OTP Validation Logic).

### 5.3.4 Violation Handling

If the OTP expires, the system should reject it. A mechanism to regenerate the OTP may be required in a future story.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-018

#### 6.1.1.2 Dependency Reason

The rider must be able to update the order status to 'Arrived at Destination', which is the trigger for displaying the OTP to the customer.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

CUS-028

#### 6.1.2.2 Dependency Reason

The customer's live order tracking screen, where the OTP will be displayed, must exist.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

ADM-017

#### 6.1.3.2 Dependency Reason

The system needs the administrative capability to configure OTP as a valid Proof of Delivery method for an order.

## 6.2.0.0 Technical Dependencies

- Order Management Service: Must be enhanced to generate, store (hashed), and validate OTPs.
- Real-time Communication Channel (WebSocket/FCM): Required to update the customer's app in real-time when the order status changes to 'Arrived at Destination'.

## 6.3.0.0 Data Dependencies

- The Order data model must be extended to include fields for the OTP hash, expiry timestamp, and failed attempt count.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The OTP validation API call from the rider's app must have a P95 latency of less than 500ms to ensure a smooth, real-time handover experience.

## 7.2.0.0 Security

- The OTP must be generated using a cryptographically secure pseudo-random number generator.
- The OTP must be stored on the server as a hash, not in plaintext.
- The OTP validation endpoint must be protected against brute-force attacks via rate limiting per order ID.

## 7.3.0.0 Usability

- The OTP must be prominently displayed and easy for the customer to find and read aloud.
- The OTP entry process for the rider must be simple and provide clear, immediate feedback.

## 7.4.0.0 Accessibility

- All UI elements must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- Functionality must be consistent across all supported versions of iOS and Android for the customer and rider applications.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires coordinated changes across three components: Backend (Order Service), Customer Mobile App, and Rider Mobile App.
- Backend logic for secure OTP generation, storage, expiry, and rate-limiting is non-trivial.
- Requires real-time UI updates on the customer's device.

## 8.3.0.0 Technical Risks

- Latency in the real-time update system could cause a delay in the OTP appearing on the customer's app, leading to a poor user experience.
- Lack of a fallback mechanism if the customer cannot access their app (e.g., phone battery died) could block delivery completion. This should be addressed in a subsequent story.

## 8.4.0.0 Integration Points

- Rider App -> API Gateway -> Order Management Service (for OTP validation).
- Order Management Service -> Real-time Service (WebSocket/FCM) -> Customer App (to trigger OTP display).

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Full E2E test of a successful OTP delivery.
- E2E test of entering an incorrect OTP once.
- E2E test of entering incorrect OTPs three times to trigger the lockout.
- API-level tests to confirm the validation endpoint's logic and rate limiting.
- Security testing to attempt brute-force attacks on the OTP endpoint.

## 9.3.0.0 Test Data Needs

- User accounts for a customer and a rider.
- An order that can be manipulated through various statuses.
- Backend configuration enabling OTP as the POD method.

## 9.4.0.0 Testing Tools

- Cypress or similar for E2E testing.
- Postman or Insomnia for API-level testing.
- Jest for unit tests.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code for backend, customer app, and rider app is peer-reviewed and merged.
- Unit test coverage for new logic is at or above the 80% project standard.
- Integration tests between the rider app and the backend service are passing.
- Automated E2E test for the happy path scenario is created and passing.
- Security review of the OTP generation and validation flow is complete.
- UI/UX for both applications has been reviewed and approved by the design team.
- Documentation for the OTP validation API endpoint is created/updated in OpenAPI spec.
- Story is deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- Requires concurrent work from backend, iOS/Android (React Native) developers.
- A feature flag should be considered to enable/disable this feature for phased rollout or in case of critical issues.

## 11.4.0.0 Release Impact

This is a significant feature enhancement for delivery security. It should be highlighted in release notes and user-facing communications.

