# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | CUS-026 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Customer Receives In-App and External Order Confir... |
| As A User Story | As a customer who has just successfully placed an ... |
| User Persona | A customer using the mobile application who has co... |
| Business Value | Increases customer trust and reduces post-order an... |
| Functional Area | Ordering and Checkout |
| Story Theme | Order Lifecycle Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Successful Order Confirmation after Online Payment

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a customer has successfully completed an online payment for their order

### 3.1.5 When

the payment gateway confirms the transaction is successful and the backend creates the order

### 3.1.6 Then

the customer is immediately navigated to an 'Order Placed' confirmation screen in the app AND the system sends both a push notification and an SMS to the customer.

### 3.1.7 Validation Notes

Verify the screen appears instantly (<1s). Check for the presence of Order ID, vendor name, total amount, and a 'Track Order' button. Verify push notification and SMS are received in the test environment.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Successful Order Confirmation for Cash on Delivery (COD)

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

a customer has selected 'Cash on Delivery' and confirmed their order

### 3.2.5 When

the customer taps the 'Place Order' button

### 3.2.6 Then

the customer is immediately navigated to an 'Order Placed' confirmation screen which explicitly states 'Cash on Delivery' as the payment method and shows the exact amount to be collected.

### 3.2.7 Validation Notes

Confirm the screen content is correct for COD orders. Verify notifications are also sent for COD orders.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Content of the In-App Confirmation Screen

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

an order has been successfully placed

### 3.3.5 When

the confirmation screen is displayed

### 3.3.6 Then

the screen must contain: a clear success message (e.g., 'Order Placed Successfully!'), the unique Order ID, the vendor's name, the final total amount, and a primary call-to-action button to 'Track Order'.

### 3.3.7 Validation Notes

Manually review the UI against a design mock-up to ensure all required elements are present and correctly formatted.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Content of the Confirmation Notifications (SMS/Push)

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

an order has been successfully placed

### 3.4.5 When

the notification service is triggered

### 3.4.6 Then

the push notification and SMS message must contain a confirmation message, the Order ID, and the total order value.

### 3.4.7 Validation Notes

Capture and verify the content of the SMS and push notification payloads in the test environment.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

System Resilience to UI Failure

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

a customer's payment is successful and the backend order is created

### 3.5.5 When

the mobile app fails to navigate to the confirmation screen (e.g., due to a crash or network loss)

### 3.5.6 Then

the customer must still receive the SMS and push notification confirmations, and the new order must be visible in their 'Order History' upon relaunching the app.

### 3.5.7 Validation Notes

Simulate an app crash after the payment API call returns success. Verify that notifications are still received and the order exists in the user's account.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

System Resilience to Notification Service Failure

### 3.6.3 Scenario Type

Edge_Case

### 3.6.4 Given

an order is successfully placed

### 3.6.5 When

the external notification service (FCM/SNS) is down or returns an error

### 3.6.6 Then

the in-app confirmation screen must still be displayed to the user without any visible error, and the notification failure must be logged in the backend for monitoring.

### 3.6.7 Validation Notes

Use a mock service to simulate a failure from the notification provider's API. Verify the UI flow is unaffected and an error is logged in CloudWatch.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Full-screen confirmation view/page
- Success icon (e.g., large checkmark)
- Primary header text (e.g., 'Order Placed!')
- Text fields for Order ID, Vendor Name, Total Amount
- Primary Button: 'Track Order'
- Secondary Link/Button: 'Back to Home'

## 4.2.0 User Interactions

- User is automatically navigated to this screen upon successful order placement.
- Tapping 'Track Order' navigates the user to the live tracking screen for this specific order.
- Tapping 'Back to Home' navigates the user to the main vendor discovery screen.

## 4.3.0 Display Requirements

- Order ID must be clearly visible and copyable.
- Total amount must be formatted correctly for INR (₹).
- For COD, the text 'Payable on Delivery' must be prominent next to the total amount.

## 4.4.0 Accessibility Needs

- All text must have sufficient color contrast (WCAG 2.1 AA).
- Screen reader support for all elements, announcing the successful order placement and key details.

# 5.0.0 Business Rules

- {'rule_id': 'BR-CONF-001', 'rule_description': "Confirmation must be triggered only after the order state is successfully persisted as 'Pending Vendor Acceptance' in the database.", 'enforcement_point': 'Order Management Service, post-payment confirmation.', 'violation_handling': 'If the order fails to save, the transaction should be rolled back/refunded, and the user should be shown an error screen, not a confirmation screen.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

CUS-025

#### 6.1.1.2 Dependency Reason

This story is triggered by the successful completion of an online payment.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

CUS-022

#### 6.1.2.2 Dependency Reason

This story handles the confirmation for orders placed via COD, which is a payment method selected in CUS-022.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

SYS-XXX (Implied)

#### 6.1.3.2 Dependency Reason

Requires backend logic (covered by REQ-FUN-017) to create an order record and set its initial state.

## 6.2.0.0 Technical Dependencies

- Order Management microservice must be able to create and persist order data.
- Integration with the payment gateway's success callback/webhook (Razorpay).
- A notification service capable of sending SMS (via AWS SNS) and push notifications (via FCM).

## 6.3.0.0 Data Dependencies

- Requires a successfully processed cart object to derive order details.
- Requires customer's registered mobile number and device token for notifications.

## 6.4.0.0 External Dependencies

- Firebase Cloud Messaging (FCM) for push notifications.
- AWS Simple Notification Service (SNS) for SMS.
- Razorpay Payment Gateway for payment success confirmation.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The latency between payment success and the display of the in-app confirmation screen must be less than 1 second.
- Push/SMS notifications should be dispatched by the system within 5 seconds of order creation.

## 7.2.0.0 Security

- The confirmation screen and notifications must not display any sensitive PII other than what is necessary (e.g., no full address, just confirmation of order).

## 7.3.0.0 Usability

- The confirmation must be unambiguous and reassuring to the user, leaving no doubt about the order's success.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards as per REQ-INT-001.

## 7.5.0.0 Compatibility

- The confirmation screen must render correctly on all supported iOS and Android devices.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires coordination between frontend and backend.
- Backend logic involves handling a payment gateway callback, which is an external, asynchronous trigger.
- Implementation of an event-driven pattern: The Order service should publish an `OrderPlaced` event, and a separate Notification service should consume it. This adds resilience but also architectural complexity.
- Ensuring idempotency in the order creation process to prevent duplicate orders if a payment callback is received more than once.

## 8.3.0.0 Technical Risks

- Latency or failure of the payment gateway callback could delay or prevent order confirmation.
- Failure in the event bus (SQS/SNS) could prevent notifications from being sent.
- Potential for a race condition if the user navigates away too quickly after payment submission.

## 8.4.0.0 Integration Points

- Order Service <- Payment Gateway (Webhook/Callback)
- Order Service -> Message Bus (e.g., AWS SQS/SNS)
- Message Bus -> Notification Service
- Notification Service -> FCM API
- Notification Service -> AWS SNS API

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- Verify confirmation for a successful UPI payment.
- Verify confirmation for a successful Credit Card payment.
- Verify confirmation for a COD order.
- Simulate a payment success callback followed by an app crash to test order persistence and out-of-app notification.
- Use service mocks to simulate FCM/SNS API failures and verify the system's graceful handling.

## 9.3.0.0 Test Data Needs

- Test customer accounts with valid mobile numbers and device tokens.
- Mock payment credentials for successful transactions.
- Pre-configured products and vendors in the test database.

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for frontend unit tests.
- Jest for backend unit/integration tests.
- Appium or a similar framework for mobile E2E testing.
- AWS console/CLI for verifying SQS/SNS messages and CloudWatch logs.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code for both frontend and backend components is peer-reviewed and merged.
- Unit test coverage meets the 80% threshold defined in REQ-NFR-006.
- Integration tests for the payment-to-notification flow are implemented and passing.
- E2E test scenario for a full order placement and confirmation is automated and passing.
- UI/UX of the confirmation screen is approved by the product owner/designer.
- Performance of the confirmation screen load time is verified.
- Logging for notification failures is implemented and verified.
- Story is deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a critical-path story in the core user journey and a blocker for post-order features like tracking and ratings.
- Requires backend and frontend developers to work in parallel.
- Dependencies on payment and notification service integrations must be resolved before starting.

## 11.4.0.0 Release Impact

The platform cannot launch without this functionality. It is essential for the Minimum Viable Product (MVP).

