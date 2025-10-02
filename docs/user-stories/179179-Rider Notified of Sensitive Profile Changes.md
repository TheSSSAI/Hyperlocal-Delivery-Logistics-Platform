# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-008 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider Notified of Sensitive Profile Changes |
| As A User Story | As a Rider, I want to receive an immediate notific... |
| User Persona | Rider (Delivery Partner) |
| Business Value | Enhances account security by immediately alerting ... |
| Functional Area | Rider Management |
| Story Theme | User Account Security |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Notification on Bank Account Detail Change

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a logged-in Rider is on their profile management screen

### 3.1.5 When

the Rider successfully updates their bank account details (e.g., account number or IFSC code) and saves the changes

### 3.1.6 Then

the system must immediately trigger and send a push notification to the Rider's registered device AND an SMS to their registered mobile number, and the notification content must state that their bank account details were changed and advise them to contact support if they did not authorize this change.

### 3.1.7 Validation Notes

Verify that both a push notification and an SMS are received on a test device. Check notification service logs for successful dispatch via FCM and SNS. The notification message must not contain any PII from the bank details.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Notification on Primary Mobile Number Change

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

a logged-in Rider is on their profile management screen

### 3.2.5 When

the Rider successfully updates their primary mobile number, which includes OTP verification of the new number

### 3.2.6 Then

the system must immediately trigger and send an SMS notification to the *old* mobile number alerting them of the change, and a push notification to their device (if still logged in), and the notification should advise them to contact support immediately if the change was unauthorized.

### 3.2.7 Validation Notes

Requires a test setup with two phone numbers. Verify the old number receives the alert SMS. This is a critical security step to prevent account takeover.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Notification on Vehicle Detail Change

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

a logged-in Rider is on their profile management screen

### 3.3.5 When

the Rider successfully updates their vehicle details (e.g., registration number)

### 3.3.6 Then

the system must immediately trigger and send a push notification and an SMS confirming that their vehicle details were updated.

### 3.3.7 Validation Notes

Verify receipt of both notification types. The content should be generic, e.g., 'Your vehicle details have been updated on [Platform Name].'

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

No Notification on Non-Sensitive Profile Change

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

a logged-in Rider is on their profile management screen

### 3.4.5 When

the Rider updates a non-sensitive field, such as their profile picture

### 3.4.6 Then

the system must save the change successfully AND must NOT trigger a security notification.

### 3.4.7 Validation Notes

Perform an update on a non-sensitive field and verify that no push notification or SMS is dispatched by checking notification service logs.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Notification System Handles Partial Failure

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

a Rider has successfully updated a sensitive profile field like their bank account

### 3.5.5 When

the primary notification channel (e.g., push notification via FCM) fails to dispatch

### 3.5.6 Then

the system must log the failure, proceed to send the notification via the secondary channel (e.g., SMS via SNS), and the profile update itself must remain successful.

### 3.5.7 Validation Notes

Requires mocking a failure from one of the notification provider APIs. Verify that the other notification is still sent and that the database reflects the updated profile information.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Push Notification
- SMS Message

## 4.2.0 User Interactions

- User receives a notification outside of the app context after making a profile change.

## 4.3.0 Display Requirements

- Push Notification Title: e.g., 'Security Alert: Profile Updated'
- Push Notification Body: e.g., 'Your bank account details were recently changed. If this wasn't you, please contact support immediately.'
- SMS Message Content: e.g., 'Your [Platform Name] account details (Bank Info) were updated. If you did not make this change, contact support now.'

## 4.4.0 Accessibility Needs

- Notification text must be clear and easy to understand.

# 5.0.0 Business Rules

- {'rule_id': 'BR-SEC-001', 'rule_description': "A security notification must be triggered for any Create, Update, or Delete operation on the following Rider profile fields: Bank Account Number, Bank IFSC Code, Primary Mobile Number, Primary Email Address, Vehicle Registration Number, Driver's License Number.", 'enforcement_point': 'Backend service responsible for profile updates, after successful database commit.', 'violation_handling': "Failure to send a notification should be logged as a high-priority error for monitoring, but should not roll back the user's data change."}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-005

#### 6.1.1.2 Dependency Reason

Provides the core functionality for a Rider to manage their personal profile.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

RDR-006

#### 6.1.2.2 Dependency Reason

Provides the core functionality for a Rider to manage their vehicle details.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

RDR-007

#### 6.1.3.2 Dependency Reason

Provides the core functionality for a Rider to manage their bank account details.

## 6.2.0.0 Technical Dependencies

- A centralized Notification Service capable of sending push notifications and SMS.
- Successful integration with Firebase Cloud Messaging (FCM) for push notifications.
- Successful integration with AWS Simple Notification Service (SNS) for transactional SMS.

## 6.3.0.0 Data Dependencies

- Access to the Rider's registered device token for push notifications.
- Access to the Rider's current and previous registered mobile number for SMS alerts.

## 6.4.0.0 External Dependencies

- Availability of third-party services: FCM and AWS SNS.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- P99 latency for notification dispatch (from profile update commit to API call to FCM/SNS) must be under 500ms.
- End-to-end delivery of the notification to the user's device should occur within 10 seconds of the profile change.

## 7.2.0.0 Security

- Notification content must NEVER include the old or new sensitive data (e.g., do not show the bank account number in the SMS).
- The event that triggers the notification should be handled asynchronously to prevent delaying the user-facing profile update response.
- All communication with notification services must be over TLS.

## 7.3.0.0 Usability

- The notification message must be unambiguous and clearly state the action required if the change was unauthorized.

## 7.4.0.0 Accessibility

- N/A for backend service, but notification text should be simple and clear.

## 7.5.0.0 Compatibility

- Push notifications must be compatible with the supported versions of iOS and Android for the Rider application.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires an event-driven architecture (e.g., profile service publishes a `RiderProfileUpdated` event).
- Requires a consumer (Notification Service) to parse the event and determine if the change was sensitive.
- Integration with two separate third-party services (FCM, SNS) adds complexity in error handling and fallbacks.
- Managing notification templates and localization in the future.

## 8.3.0.0 Technical Risks

- Latency or outages from third-party notification providers could delay or prevent security alerts.
- Incorrectly identifying which field changes are 'sensitive' could lead to missed alerts or excessive notifications.

## 8.4.0.0 Integration Points

- Rider Profile Service (publishes update events).
- Notification Service (consumes events and sends notifications).
- Message Bus (e.g., AWS SQS/SNS) for decoupling services.
- Firebase Cloud Messaging (FCM) API.
- AWS SNS API.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- Verify notification is sent for each sensitive field defined in BR-SEC-001.
- Verify no notification is sent for non-sensitive field changes.
- Verify the SMS is sent to the OLD number when the primary contact number is changed.
- Simulate and test failure of one notification channel to ensure the other channel still functions.
- Verify notification content for clarity and absence of PII.

## 9.3.0.0 Test Data Needs

- Test Rider accounts with valid device tokens.
- Access to test phone numbers that can receive SMS.
- Ability to mock API responses from FCM and SNS for failure testing.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- Mocking libraries (e.g., Sinon.js) for external services.
- Cypress or a similar E2E framework with a test harness to verify notifications.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one other engineer
- Unit and integration tests implemented with >80% code coverage for new logic
- Event-driven flow between Profile and Notification services is successfully tested
- Notification content reviewed and approved for clarity and security
- Performance requirements (latency) verified under test conditions
- Logging for notification success and failure is implemented and verified
- Documentation for the notification event and its payload is created/updated
- Story deployed and verified in the staging environment with real devices

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a critical security feature that should be prioritized after the core profile management features are stable.
- Requires coordination between the team managing the Rider profile service and the team managing the Notification service if they are separate.

## 11.4.0.0 Release Impact

Significantly improves the security posture of the platform for riders. Can be highlighted as a key trust and safety feature in release notes.

