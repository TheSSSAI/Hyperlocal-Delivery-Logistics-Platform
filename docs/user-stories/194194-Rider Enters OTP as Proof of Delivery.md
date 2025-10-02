# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-023 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider Enters OTP as Proof of Delivery |
| As A User Story | As a delivery rider, I want to enter a 4-digit OTP... |
| User Persona | Rider using the rider-facing mobile application. |
| Business Value | Reduces delivery disputes and fraud by creating a ... |
| Functional Area | Rider-Facing Features - Delivery Execution |
| Story Theme | Proof of Delivery Enhancements |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Happy Path: Rider enters the correct OTP

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

The rider's order status is 'Arrived at Destination' and the order is configured to require OTP confirmation

### 3.1.5 When

The rider enters the correct 4-digit OTP provided by the customer and taps 'Confirm Delivery'

### 3.1.6 Then

The system validates the OTP successfully via a server-side call, the order status is updated to 'Delivered', and a success confirmation is displayed to the rider.

### 3.1.7 Validation Notes

Verify the order status changes in the database. The API call for validation should return a 200 OK. The rider app should navigate to a post-delivery screen or the main task list.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Error Condition: Rider enters an incorrect OTP

### 3.2.3 Scenario Type

Error_Condition

### 3.2.4 Given

The rider is on the OTP entry screen for a delivery

### 3.2.5 When

The rider enters an incorrect 4-digit OTP and taps 'Confirm Delivery'

### 3.2.6 Then

The system rejects the OTP and displays a clear error message like 'Invalid OTP. Please try again.' to the rider, and the input field is cleared.

### 3.2.7 Validation Notes

Verify the order status remains 'Arrived at Destination'. The validation API should return an error response (e.g., 400 Bad Request).

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Edge Case: Multiple incorrect OTP attempts

### 3.3.3 Scenario Type

Edge_Case

### 3.3.4 Given

The rider has already entered an incorrect OTP two times for the same order

### 3.3.5 When

The rider enters an incorrect OTP for the third consecutive time

### 3.3.6 Then

The system displays a more prominent error message, such as 'Too many failed attempts. Please verify the OTP with the customer or contact support.'

### 3.3.7 Validation Notes

The backend should log the failed attempts. The UI should guide the user towards a resolution path (contacting support).

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

System records Proof of Delivery metadata

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

The rider is about to submit the correct OTP

### 3.4.5 When

The OTP is successfully validated

### 3.4.6 Then

The system stores the POD confirmation against the order record, including the method ('OTP'), a timestamp, and the GPS coordinates of the rider's device at the time of confirmation.

### 3.4.7 Validation Notes

Check the order's event log or POD table in the database to confirm that the timestamp and location data are saved, as per REQ-FUN-015.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Alternative Flow: Network connectivity is lost during submission

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

The rider's device is offline

### 3.5.5 When

The rider enters the correct OTP and taps 'Confirm Delivery'

### 3.5.6 Then

The app displays a message indicating the action is queued (e.g., 'Confirming delivery... will sync when back online') and attempts to submit the confirmation once connectivity is restored.

### 3.5.7 Validation Notes

Test by disabling network on the device, submitting, and then re-enabling network. The app should successfully sync the status update without user intervention.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A dedicated screen for OTP entry.
- Four distinct input boxes or a single masked input field for the 4-digit OTP.
- A numerical-only keyboard that appears automatically.
- A primary action button labeled 'Confirm Delivery' or 'Submit'.
- A secondary link or button for help, e.g., 'Customer can't provide OTP?'.
- A non-intrusive loading indicator during OTP validation.
- Clear text labels and instructions for the rider.

## 4.2.0 User Interactions

- The 'Confirm Delivery' button should be disabled until all 4 digits are entered.
- Focus should automatically move to the next input box after a digit is entered.
- Upon successful submission, the rider should see a success animation/message and be navigated away from the screen.
- Upon failed submission, the input fields should be cleared, and an error message should be displayed without dismissing the screen.

## 4.3.0 Display Requirements

- The screen must clearly state that a 4-digit OTP from the customer is required.
- Error messages must be specific and actionable.

## 4.4.0 Accessibility Needs

- All input fields must have proper labels for screen readers.
- Text and background colors must meet WCAG 2.1 AA contrast ratios.
- The UI must be navigable using accessibility tools.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-OTP-001

### 5.1.2 Rule Description

An OTP is valid only for the specific order it was generated for.

### 5.1.3 Enforcement Point

Server-side during the OTP validation API call.

### 5.1.4 Violation Handling

The API returns an error, and the app displays an 'Invalid OTP' message.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-OTP-002

### 5.2.2 Rule Description

A maximum of 3 consecutive failed OTP attempts are allowed before displaying a stronger warning message.

### 5.2.3 Enforcement Point

Server-side, by tracking failed attempts against the order ID.

### 5.2.4 Violation Handling

The API response indicates the attempt limit has been reached, triggering a different UI state in the app.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

CUS-040

#### 6.1.1.2 Dependency Reason

The customer application must first generate and display the OTP for the customer to provide to the rider. This story is blocked until the OTP is available on the customer side.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-017

#### 6.1.2.2 Dependency Reason

The system needs an administrative function to configure which orders or order types require OTP as a Proof of Delivery method. This story's logic depends on that configuration.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

RDR-018

#### 6.1.3.2 Dependency Reason

The OTP entry screen is part of the delivery workflow, typically appearing after the rider has updated their status to 'Arrived at Destination'.

## 6.2.0.0 Technical Dependencies

- A backend endpoint in the Order Management service for securely validating the submitted OTP against the stored value for a given order.
- A mechanism in the Order Management service to generate and associate a unique, secure 4-digit OTP with an order.

## 6.3.0.0 Data Dependencies

- The order record must have a field to store the OTP (or its hash) and a flag indicating that OTP confirmation is required.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The server-side OTP validation API call must have a P95 latency of under 500ms.

## 7.2.0.0 Security

- The OTP validation endpoint must be protected against brute-force attacks via rate limiting per order ID.
- The actual OTP should never be sent to the rider's device; the device only sends the user's input for validation.
- The OTP must be generated using a cryptographically secure random number generator.

## 7.3.0.0 Usability

- The process of entering the OTP should be quick and intuitive, requiring minimal taps.

## 7.4.0.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The feature must function correctly on all supported iOS and Android versions for the Rider App.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires coordinated development across multiple components: Backend (Order Service), Rider App, and Customer App (dependency).
- Secure OTP generation and validation logic must be implemented on the backend.
- State management for offline submission adds complexity to the mobile application.

## 8.3.0.0 Technical Risks

- Potential for race conditions if the customer or system tries to cancel the order while the rider is attempting OTP validation.
- Ensuring the offline queueing mechanism is robust and doesn't lead to lost status updates.

## 8.4.0.0 Integration Points

- Rider App -> Order Management Service (for OTP validation).
- Order Management Service -> Order Database (to update status and log POD).

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Usability

## 9.2.0.0 Test Scenarios

- Successful delivery confirmation with correct OTP.
- Single and multiple failed attempts with incorrect OTPs.
- OTP submission with no network connectivity, followed by successful sync upon reconnection.
- Attempting to use an OTP from a different order.
- UI/UX testing on various device sizes and accessibility modes.

## 9.3.0.0 Test Data Needs

- Test accounts for a customer and a rider.
- An order created and assigned, specifically flagged to require OTP confirmation.
- The OTP value for the test order must be known to the tester.

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for mobile component tests.
- Cypress or a similar framework for E2E tests.
- Postman or Insomnia for API-level testing of the validation endpoint.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code for all affected components (Rider App, Backend) has been peer-reviewed and merged.
- Unit and integration tests are written with at least 80% code coverage.
- E2E automated test case for the happy path is created and passing.
- The corresponding story CUS-040 (displaying OTP to customer) is complete and verified.
- Security review of the OTP validation endpoint is complete.
- UI/UX has been approved by the design team.
- Documentation for the OTP validation API endpoint is created/updated.
- Feature is deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is blocked by CUS-040 and ADM-017. It should be planned in a sprint after or concurrent with those stories, requiring close coordination between frontend and backend developers.
- The API contract for OTP validation must be defined and agreed upon at the beginning of the sprint.

## 11.4.0.0 Release Impact

This is a key feature for enhancing delivery security and is part of the core delivery execution flow. It should be included in a major feature release.

