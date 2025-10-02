# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-003 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider Receives Account Approval Notification |
| As A User Story | As a prospective rider who has submitted my regist... |
| User Persona | Prospective Rider (awaiting account activation) |
| Business Value | Improves the rider onboarding experience by provid... |
| Functional Area | User Management & Onboarding |
| Story Theme | Rider Lifecycle Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Successful approval notification via Push and SMS

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

A rider's account exists with the status 'pending_verification', and the rider has the application installed with push notifications enabled

### 3.1.5 When

An administrator changes the rider's account status to 'approved'

### 3.1.6 Then



```
The rider's account status in the database is updated to 'approved'.
AND a push notification is sent to the rider's registered device via Firebase Cloud Messaging (FCM).
AND an SMS notification is sent to the rider's registered mobile number via AWS Simple Notification Service (SNS).
```

### 3.1.7 Validation Notes

Verify database status change. Check application logs for successful API calls to FCM and SNS. Confirm receipt of notifications on a test device.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Push notification content and interaction

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

A rider receives the account approval push notification

### 3.2.5 When

The rider taps on the push notification

### 3.2.6 Then

The rider application opens and navigates the user to the login screen.

### 3.2.7 Validation Notes

Manually test on a physical or emulated device. The notification payload must contain the correct deep link or intent to open the login screen.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Notification delivery failure for one channel

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

A rider's account is 'pending_verification' and the push notification service (FCM) is temporarily unavailable

### 3.3.5 When

An administrator approves the rider's registration

### 3.3.6 Then



```
The rider's account status is updated to 'approved'.
AND the system logs the failure to send the push notification.
AND the SMS notification is still sent successfully to the rider's mobile number.
```

### 3.3.7 Validation Notes

Use a mock service or network rule to simulate FCM failure. Check logs for the error message and verify the SMS is still sent and received.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Notification delivery for user with app uninstalled

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

A rider's account is 'pending_verification' but the rider has uninstalled the application from their device

### 3.4.5 When

An administrator approves the rider's registration

### 3.4.6 Then



```
The rider's account status is updated to 'approved'.
AND the push notification attempt to the stale device token may fail, which is logged by the system.
AND the SMS notification is sent successfully.
```

### 3.4.7 Validation Notes

This scenario simulates a common real-world case. The key is to verify the SMS fallback works reliably.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Notification is not sent for non-approval status changes

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

A rider's account is 'pending_verification'

### 3.5.5 When

An administrator rejects the registration, changing the status to 'rejected'

### 3.5.6 Then

The approval notification logic is NOT triggered.

### 3.5.7 Validation Notes

Verify that no approval-related events are published or logged when the status changes to anything other than 'approved'.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Push Notification (System UI)
- SMS Message (System UI)

## 4.2.0 User Interactions

- Tapping the push notification opens the app to the login screen.

## 4.3.0 Display Requirements

- Push Notification Text: 'Congratulations! Your rider account is approved. Log in now to start earning.'
- SMS Text: 'Your rider account for [Platform Name] has been approved. You can now log in and start accepting deliveries.'

## 4.4.0 Accessibility Needs

- Notification text must be clear and concise, suitable for screen readers on both iOS and Android.

# 5.0.0 Business Rules

- {'rule_id': 'BR-RDR-01', 'rule_description': 'Approval notifications must be sent via both Push and SMS channels to ensure delivery.', 'enforcement_point': "Notification service upon receiving a 'RiderApproved' event.", 'violation_handling': 'Failure of one channel should be logged, but should not prevent the other channel from being attempted.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-001

#### 6.1.1.2 Dependency Reason

Requires the existence of a rider registration process and a rider account in a 'pending_verification' state.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-003

#### 6.1.2.2 Dependency Reason

The trigger for this story is the admin's approval action, which must be implemented first.

## 6.2.0.0 Technical Dependencies

- A functioning 'Identity & Access' microservice to manage user statuses.
- A dedicated 'Notification' microservice or module integrated with AWS SNS and Firebase Cloud Messaging.
- An event bus (e.g., AWS SQS/SNS) for asynchronous communication between the Identity and Notification services.

## 6.3.0.0 Data Dependencies

- Rider's record must contain a valid, verified mobile number.
- Rider's record must have a field to store the mobile device's push notification token.

## 6.4.0.0 External Dependencies

- Firebase Cloud Messaging (FCM) API
- AWS Simple Notification Service (SNS) API

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- Notifications (both Push and SMS) should be dispatched within 5 seconds of the administrator's approval action.

## 7.2.0.0 Security

- Notification content must not contain any sensitive PII (e.g., password, full address).
- Communication with external notification gateways (FCM, SNS) must be over secure channels (HTTPS).

## 7.3.0.0 Usability

- The notification message must be unambiguous and provide a clear call to action.

## 7.4.0.0 Accessibility

- Compliant with standard mobile OS accessibility features for notifications.

## 7.5.0.0 Compatibility

- Push notifications must be supported on the target versions of iOS and Android specified for the Rider App.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires coordination between multiple microservices (Admin Backend, Identity, Notifications).
- Implementation of a resilient, event-driven architecture using a message queue.
- Handling failures and retries for two separate external API integrations (FCM and SNS).

## 8.3.0.0 Technical Risks

- External notification services may have downtime or latency issues.
- Managing and refreshing device push tokens can be complex and error-prone.

## 8.4.0.0 Integration Points

- Admin Backend -> Identity Service (to update status)
- Identity Service -> Message Queue (to publish 'RiderApprovedEvent')
- Message Queue -> Notification Service (to consume event)
- Notification Service -> FCM API
- Notification Service -> AWS SNS API

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- Verify notification dispatch on successful approval.
- Verify correct deep link behavior when notification is tapped.
- Test failure handling when FCM is unavailable.
- Test failure handling when SNS is unavailable.
- Verify no notification is sent on registration rejection.

## 9.3.0.0 Test Data Needs

- Test rider accounts in 'pending_verification' state.
- Valid device tokens for test devices.
- Valid phone numbers for receiving test SMS.

## 9.4.0.0 Testing Tools

- Jest (Unit/Integration)
- Cypress (E2E, for triggering the admin action)
- Mock server for FCM/SNS APIs during integration testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >= 80% code coverage for new logic
- E2E test scenario for the approval-to-notification flow is automated and passing
- Notification content templates are stored in a configurable location (not hard-coded)
- Logging is implemented for all external API calls and error conditions
- Documentation for the 'RiderApprovedEvent' schema is created/updated
- Story deployed and verified in the staging environment on a real device

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is a critical part of the rider onboarding funnel and should be prioritized soon after the core registration and admin approval functionalities are complete.
- Requires coordination between backend developers working on different services.

## 11.4.0.0 Release Impact

Enables a complete and user-friendly onboarding flow for new riders, which is essential for platform launch and scaling.

