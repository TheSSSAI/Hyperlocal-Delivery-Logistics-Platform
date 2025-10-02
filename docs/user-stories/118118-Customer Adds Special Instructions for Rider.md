# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | CUS-021 |
| Elaboration Date | 2024-05-22 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Customer Adds Special Instructions for Rider |
| As A User Story | As a Customer placing an order, I want to add a fr... |
| User Persona | A customer who has specific delivery needs or live... |
| Business Value | Improves first-attempt delivery success rate, redu... |
| Functional Area | Ordering and Checkout |
| Story Theme | Order Placement Experience |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

CUS-021-AC-001

### 3.1.2 Scenario

Customer successfully adds and saves rider instructions during checkout

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a customer is on the checkout screen with items in their cart

### 3.1.5 When

the customer enters 'Please leave the package at the front door and do not ring the bell.' into the 'Instructions for Rider' text field and successfully places the order

### 3.1.6 Then

the order is created with the instructions saved, and the assigned rider can view the exact text in the order details on their application.

### 3.1.7 Validation Notes

Verify the 'rider_instructions' field in the order database record contains the correct text. Verify the rider-facing API for order details includes this field and its content.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

CUS-021-AC-002

### 3.2.2 Scenario

Rider instructions are not visible to the vendor

### 3.2.3 Scenario Type

Security_Condition

### 3.2.4 Given

an order has been placed with specific instructions for the rider

### 3.2.5 When

the vendor views the same order on their vendor dashboard

### 3.2.6 Then

the rider-specific instructions are not displayed.

### 3.2.7 Validation Notes

Check the vendor dashboard UI and the response from the vendor-facing order details API to ensure the rider instructions field is not present.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

CUS-021-AC-003

### 3.3.2 Scenario

Customer places an order without providing rider instructions

### 3.3.3 Scenario Type

Alternative_Flow

### 3.3.4 Given

a customer is on the checkout screen

### 3.3.5 When

the customer leaves the 'Instructions for Rider' field blank and places the order

### 3.3.6 Then

the order is created successfully, and the rider's app displays a message like 'No delivery instructions provided' or shows no instruction section at all.

### 3.3.7 Validation Notes

Verify the 'rider_instructions' field for the order is null or empty in the database. Check the rider app's handling of a null value for this field.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

CUS-021-AC-004

### 3.4.2 Scenario

Customer is prevented from exceeding the character limit for instructions

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

a customer is typing in the 'Instructions for Rider' text field on the checkout screen

### 3.4.5 When

the customer attempts to type more than the maximum allowed characters (e.g., 250)

### 3.4.6 Then

the UI prevents further input and a character counter (e.g., '250/250') clearly indicates the limit has been reached.

### 3.4.7 Validation Notes

Manual UI testing on the customer application to confirm the input limit and visual feedback.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

CUS-021-AC-005

### 3.5.2 Scenario

System sanitizes malicious input in rider instructions

### 3.5.3 Scenario Type

Security_Condition

### 3.5.4 Given

a customer is on the checkout screen

### 3.5.5 When

the customer enters malicious input, such as '<script>alert('XSS')</script>', into the 'Instructions for Rider' field and places the order

### 3.5.6 Then

the input is sanitized by the backend, and the rider's application displays the text without executing any scripts.

### 3.5.7 Validation Notes

Use an E2E test to submit a string with script tags. Verify that the string stored in the database is sanitized and that the rider app renders it as plain text.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A multi-line text area input field on the checkout screen, clearly labeled 'Instructions for Rider (optional)'.
- A real-time character counter displayed below the text area (e.g., '0/250').
- In the Rider App, a read-only text field within the order details screen to display the instructions.

## 4.2.0 User Interactions

- The text area should be optional and not required for order placement.
- As the user types, the character counter updates.
- The user is blocked from typing once the character limit is reached.

## 4.3.0 Display Requirements

- The instructions must be clearly distinguishable from any instructions meant for the vendor.
- If no instructions are provided, the Rider App should handle the absence gracefully.

## 4.4.0 Accessibility Needs

- The text area must have a proper HTML 'for' attribute linked to its label to be compliant with WCAG 2.1 standards (REQ-INT-001).

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

CUS-021-BR-001

### 5.1.2 Rule Description

Rider instructions are limited to a maximum of 250 characters.

### 5.1.3 Enforcement Point

Client-side (Customer App UI) and Server-side (API validation).

### 5.1.4 Violation Handling

Client-side: Prevent further input. Server-side: Reject the request with a 400 Bad Request error if the limit is bypassed.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

CUS-021-BR-002

### 5.2.2 Rule Description

Rider instructions can only be added or edited before the order is placed. They become read-only post-submission.

### 5.2.3 Enforcement Point

System logic; no UI for editing is provided after order placement.

### 5.2.4 Violation Handling

N/A - The system does not provide a mechanism for violation.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

CUS-019

#### 6.1.1.2 Dependency Reason

This story adds a field to the cart summary/checkout screen, which must exist first.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

CUS-025

#### 6.1.2.2 Dependency Reason

The functionality is part of the final order placement process.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

RDR-011

#### 6.1.3.2 Dependency Reason

The rider's order details screen must exist to display the instructions.

## 6.2.0.0 Technical Dependencies

- The 'Order' data model/schema must be updated to include a nullable string field for 'riderInstructions'.
- The 'createOrder' API endpoint in the Order Management service.
- The 'getOrderDetails' API endpoint for riders in the Rider Logistics service.

## 6.3.0.0 Data Dependencies

*No items available*

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- Adding instructions should not introduce more than 50ms of latency to the order placement API call.

## 7.2.0.0 Security

- All user-provided text must be sanitized on the backend before being stored to prevent XSS and other injection attacks, in line with OWASP Top 10 practices (REQ-NFR-003).

## 7.3.0.0 Usability

- The purpose of the field should be immediately obvious to the user through clear labeling.

## 7.4.0.0 Accessibility

- The input field must be WCAG 2.1 Level AA compliant (REQ-INT-001).

## 7.5.0.0 Compatibility

- Functionality must be consistent across all supported versions of the customer and rider mobile applications.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Low

## 8.2.0.0 Complexity Factors

- Requires coordinated changes across three components: Customer mobile app (UI), Backend (API/DB), and Rider mobile app (UI).
- Database schema migration is required.
- Input sanitization logic must be robust.

## 8.3.0.0 Technical Risks

- Minimal risk. The primary risk is data not being displayed correctly in the rider app or being inadvertently exposed in the vendor dashboard if API responses are not properly tailored per role.

## 8.4.0.0 Integration Points

- Customer App -> Order Management Service (createOrder API)
- Order Management Service -> Primary Database (Orders Table)
- Rider App -> Rider Logistics Service (getOrderDetails API)

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Create an order with instructions and verify they appear for the rider.
- Create an order without instructions and verify the rider app handles it.
- Create an order with instructions and verify they DO NOT appear for the vendor.
- Attempt to submit an order with instructions exceeding the character limit via API.
- Attempt to submit an order with a script tag in the instructions field and verify it is rendered harmlessly in the rider app.

## 9.3.0.0 Test Data Needs

- Test user accounts for a Customer, a Rider, and a Vendor.

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for frontend unit tests.
- Cypress for E2E tests.
- Postman or similar for API integration tests.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in the staging environment.
- Code for Customer App, Rider App, and Backend services reviewed and approved.
- Unit and integration tests implemented with >80% coverage for new logic.
- E2E test scenario automated and passing.
- Input sanitization logic peer-reviewed for security.
- Database migration script is written, tested, and successfully applied.
- UI changes on both mobile apps are verified by QA and approved by Product/UX.
- Story deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

3

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- Requires work from frontend (customer), frontend (rider), and backend developers. Coordination is needed to ensure all parts are ready for testing within the same sprint.

## 11.4.0.0 Release Impact

This is a high-value feature for customers. Its inclusion in a release is a significant improvement to the user experience.

