# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | CUS-020 |
| Elaboration Date | 2024-05-22 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Customer Adds Special Instructions for Vendor |
| As A User Story | As a customer placing an order, I want to add a no... |
| User Persona | A customer who is on the checkout screen, about to... |
| Business Value | Increases customer satisfaction by allowing order ... |
| Functional Area | Ordering and Cart Management |
| Story Theme | Order Placement Experience |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Customer successfully adds a special instruction for the vendor

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a customer is on the checkout screen with items in their cart

### 3.1.5 When

they enter 'Please pack the sauce separately' into the 'Vendor Instructions' text field and complete the order

### 3.1.6 Then

the order is created successfully and the instruction is saved with the order details

### 3.1.7 Validation Notes

Verify the 'vendor_instructions' field in the order record in the database contains the exact text. The vendor dashboard must display this text when viewing the order.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Customer leaves the special instructions field empty

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

a customer is on the checkout screen

### 3.2.5 When

they leave the 'Vendor Instructions' field blank and complete the order

### 3.2.6 Then

the order is created successfully with a null or empty value for the vendor instructions

### 3.2.7 Validation Notes

Verify the vendor dashboard displays 'No special instructions' or hides the section entirely for that order.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Customer attempts to exceed the character limit for instructions

### 3.3.3 Scenario Type

Edge_Case

### 3.3.4 Given

a customer is on the checkout screen and the character limit for vendor instructions is 250

### 3.3.5 When

the customer types 250 characters into the 'Vendor Instructions' field

### 3.3.6 Then

the UI prevents any further characters from being entered and the character counter displays '250/250'

### 3.3.7 Validation Notes

The text area input should stop accepting new characters. The displayed text should not be truncated.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Customer views their added instructions in the order history

### 3.4.3 Scenario Type

Alternative_Flow

### 3.4.4 Given

a customer has successfully placed an order with the vendor instruction 'No onions, please'

### 3.4.5 When

they navigate to their order history and view the details of that specific order

### 3.4.6 Then

the instruction 'No onions, please' is clearly displayed as part of the order details

### 3.4.7 Validation Notes

Check the customer's order details screen in the mobile app to ensure the instruction text is present and correctly formatted.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

System handles potentially malicious input safely

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

a customer is on the checkout screen

### 3.5.5 When

they enter '<script>alert("XSS")</script>' into the 'Vendor Instructions' field and place the order

### 3.5.6 Then

the input is sanitized on the backend before being stored in the database

### 3.5.7 Validation Notes

When viewing the order on the vendor dashboard, the script must not execute. The text should be rendered as plain text (e.g., '&lt;script&gt;alert("XSS")&lt;/script&gt;').

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A multi-line text area input field.
- A clear label, e.g., 'Special Instructions for Vendor'.
- Placeholder text to guide the user, e.g., 'Allergies, custom requests, etc. Do not add delivery instructions here.'
- A real-time character counter, e.g., '0/250'.

## 4.2.0 User Interactions

- The text area should expand vertically as the user types, up to a certain maximum height.
- The character counter updates in real-time as the user types.
- Input is disabled once the character limit is reached.

## 4.3.0 Display Requirements

- The field must be clearly distinct from the 'Rider Instructions' field as per REQ-FUN-006.
- The entered instructions must be displayed on the final order confirmation screen for the customer.
- The instructions must be prominently displayed on the vendor's order details view in their dashboard.

## 4.4.0 Accessibility Needs

- The text area must have a proper ARIA label for screen readers.
- The character count and any validation messages must be accessible to screen readers.

# 5.0.0 Business Rules

- {'rule_id': 'BR-CUS-01', 'rule_description': 'Vendor instructions are limited to a maximum of 250 characters.', 'enforcement_point': 'Client-side (UI) and Server-side (API validation).', 'violation_handling': 'The UI prevents further input. The API will reject the request with a 400 Bad Request error if the limit is bypassed on the client.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

CUS-019

#### 6.1.1.2 Dependency Reason

This feature is part of the checkout screen, which is defined in the cart summary story.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

VND-016

#### 6.1.2.2 Dependency Reason

The vendor's order management dashboard must exist to display the instructions.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

CUS-021

#### 6.1.3.2 Dependency Reason

This story is a sibling to 'Customer Adds Special Instructions for Rider'. The UI for both should be designed cohesively to avoid confusion.

## 6.2.0.0 Technical Dependencies

- The Order Management microservice's data model must be updated to include a 'vendor_instructions' field (e.g., VARCHAR(250) or TEXT).
- The order creation API endpoint must be updated to accept the new field in its request payload.

## 6.3.0.0 Data Dependencies

*No items available*

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- Adding or editing instructions must not introduce any user-perceptible latency to the checkout process.

## 7.2.0.0 Security

- All user-provided text must be sanitized on the backend to prevent Cross-Site Scripting (XSS) and other injection attacks, as per REQ-NFR-003.

## 7.3.0.0 Usability

- The purpose of the field must be unambiguous to prevent users from entering delivery instructions intended for the rider.

## 7.4.0.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards, as stated in REQ-INT-001.

## 7.5.0.0 Compatibility

- The feature must function correctly on all supported versions of the customer mobile application (React Native).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Low

## 8.2.0.0 Complexity Factors

- Requires coordinated changes across three components: customer mobile app, backend API/database, and vendor web dashboard.
- The logic itself is simple CRUD, but the data must flow correctly through the entire system.

## 8.3.0.0 Technical Risks

- Risk of user confusion if the 'Vendor Instructions' and 'Rider Instructions' fields are not clearly differentiated in the UI.
- Inadequate input sanitization could lead to a security vulnerability on the vendor dashboard.

## 8.4.0.0 Integration Points

- Customer App -> API Gateway -> Order Management Service
- Order Management Service -> PostgreSQL Database
- Vendor Dashboard -> API Gateway -> Order Management Service

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- Verify successful submission and display of instructions.
- Verify submission with empty instructions.
- Verify client-side and server-side enforcement of the character limit.
- Verify instructions are correctly displayed in the customer's order history.
- Perform XSS injection testing on the input field.

## 9.3.0.0 Test Data Needs

- User accounts for both a customer and a vendor.
- Test strings of various lengths, including empty, max length, and strings with special characters/HTML tags.

## 9.4.0.0 Testing Tools

- Jest & React Testing Library for frontend unit tests.
- Cypress for end-to-end testing.
- Postman or similar for API-level testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >80% coverage and passing
- End-to-end automated test case created and passing
- User interface on both customer and vendor applications reviewed and approved by UX/Product
- Input sanitization validated through security testing
- API documentation (OpenAPI spec) updated to reflect the new request field
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

3

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story should be planned in the same sprint as CUS-021 ('Customer Adds Special Instructions for Rider') to ensure a consistent user experience is developed for both instruction types.
- Requires coordination between frontend (mobile), frontend (web), and backend developers.

## 11.4.0.0 Release Impact

This is a key feature for customer satisfaction and is expected to be part of the initial product launch.

