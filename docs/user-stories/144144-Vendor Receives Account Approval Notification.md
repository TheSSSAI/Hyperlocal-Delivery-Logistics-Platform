# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | VND-003 |
| Elaboration Date | 2024-05-22 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Vendor Receives Account Approval Notification |
| As A User Story | As a newly registered vendor whose application is ... |
| User Persona | A vendor whose account status has just been change... |
| Business Value | Improves the vendor onboarding experience by provi... |
| Functional Area | User Management & Onboarding |
| Story Theme | Vendor Onboarding Experience |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Successful Approval Notification via SMS and Push Notification

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

A vendor has registered with a valid Indian mobile number, their account status is 'pending_verification', and they have the vendor application installed with push notifications enabled.

### 3.1.5 When

An administrator approves the vendor's registration via the admin dashboard.

### 3.1.6 Then

The vendor's account status in the database is updated to 'approved'.

### 3.1.7 And

Tapping the push notification deep-links the user to the login screen of the vendor application.

### 3.1.8 Validation Notes

Verify the status change in the database. Verify the SMS is received on a test device. Verify the push notification is received and the deep link functions correctly. Check service logs for successful API calls to AWS SNS and FCM.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Approval Notification with No Push Token Available

### 3.2.3 Scenario Type

Alternative_Flow

### 3.2.4 Given

A vendor has registered with a valid Indian mobile number, their account status is 'pending_verification', but they have not installed the app or have disabled push notifications.

### 3.2.5 When

An administrator approves the vendor's registration.

### 3.2.6 Then

The vendor's account status is updated to 'approved'.

### 3.2.7 And

No errors are generated due to the missing push notification token.

### 3.2.8 Validation Notes

Verify the SMS is received. Check the notification service logs to confirm that a push notification was not attempted for this user and that the reason (no token) was logged.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

External Notification Service Failure

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

A vendor's account status is 'pending_verification' and an administrator is approving it.

### 3.3.5 And

The failure does not cause the primary approval transaction to roll back.

### 3.3.6 When

The system attempts to send the approval notification.

### 3.3.7 Then

The vendor's account status is still successfully updated to 'approved' in the database.

### 3.3.8 Validation Notes

Use a mock or stub for the external API to simulate a failure. Verify the vendor's status is 'approved' in the database. Check application logs (e.g., CloudWatch) for a detailed and actionable error message.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Push Notification (System UI)
- SMS Message (System UI)

## 4.2.0 User Interactions

- Tapping the push notification should deep-link to the vendor app's login screen.

## 4.3.0 Display Requirements

- Notification content must be clear, concise, and professional.
- SMS must include a direct link to the vendor web dashboard login page.
- Push notification must clearly state the purpose (Account Approved) and the next action (Set up your store).

## 4.4.0 Accessibility Needs

- N/A (Handled by the mobile operating system's notification display)

# 5.0.0 Business Rules

*No items available*

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

VND-001

#### 6.1.1.2 Dependency Reason

A vendor must be able to register and have an account in a 'pending_verification' state before it can be approved.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-003

#### 6.1.2.2 Dependency Reason

The administrator's action of approving a registration is the trigger for this notification story.

## 6.2.0.0 Technical Dependencies

- A functioning 'Identity & Access' microservice to manage user states.
- A message bus (e.g., AWS SQS/SNS) for asynchronous inter-service communication as per REQ-ARC-001.
- A dedicated 'Notification' microservice or module capable of consuming events from the message bus.
- Configured and authenticated integration with AWS SNS for sending SMS.
- Configured and authenticated integration with Firebase Cloud Messaging (FCM) for sending push notifications.

## 6.3.0.0 Data Dependencies

- Access to the vendor's registered mobile number.
- Access to the vendor's business/store name for message personalization.
- Access to the vendor's current and valid device push notification token.

## 6.4.0.0 External Dependencies

- Availability of AWS SNS API.
- Availability of Firebase Cloud Messaging (FCM) API.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- P99 latency for triggering the notification process (from admin approval to event publication) must be under 500ms.
- The end-to-end time for a vendor to receive the notification after approval should be under 15 seconds.

## 7.2.0.0 Security

- Notification content must not contain any sensitive Personally Identifiable Information (PII) or credentials.
- Links included in notifications must point to the legitimate platform domain over HTTPS.
- Communication with external notification services must be secured via API keys managed in AWS Secrets Manager (REQ-NFR-003).

## 7.3.0.0 Usability

- The notification message must be easily understandable and clearly state the next required action.

## 7.4.0.0 Accessibility

- N/A

## 7.5.0.0 Compatibility

- Push notifications must be compatible with the target versions of iOS and Android supported by the vendor application.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires asynchronous, event-driven communication between at least two microservices ('Identity' and 'Notification').
- Integration with two separate third-party APIs (AWS SNS, FCM).
- Requires robust error handling and logging for external API failures to ensure the core approval process is not blocked.
- Management of device push notification tokens.

## 8.3.0.0 Technical Risks

- Potential for message delivery delays from external providers, which is outside of the platform's control.
- Failure to correctly handle event idempotency in the notification service could lead to duplicate notifications.
- Cost management for SMS messages needs to be monitored.

## 8.4.0.0 Integration Points

- The 'Identity & Access' service must publish an event upon changing a vendor's status.
- The 'Notification' service must subscribe to this event.
- The 'Notification' service must call the AWS SNS API.
- The 'Notification' service must call the FCM API.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E (Manual)

## 9.2.0.0 Test Scenarios

- Verify notification delivery (SMS and Push) on successful approval.
- Verify only SMS is sent when no push token is available.
- Verify the system's behavior when the SNS API call fails.
- Verify the system's behavior when the FCM API call fails.
- Verify the deep-link functionality of the push notification.

## 9.3.0.0 Test Data Needs

- Test vendor accounts in 'pending_verification' state.
- At least one test account associated with a physical device that can receive push notifications and SMS.
- Test accounts without any associated push notification token.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- Mocking libraries for AWS SDK and FCM clients.
- A tool like Postman or Cypress for triggering the admin approval API endpoint during integration/E2E tests.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written with >80% coverage and are passing in the CI/CD pipeline.
- A manual E2E test has confirmed that a notification is received on a physical test device for both SMS and Push.
- Error handling for external service failures has been tested and verified.
- Notification message templates are stored in a configurable location and have been approved by the product owner.
- Relevant documentation (e.g., sequence diagrams for the notification flow) has been created or updated.
- The feature is deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is dependent on the completion of the admin approval functionality (ADM-003).
- Requires credentials and configuration for both AWS SNS and FCM in all environments (Dev, Staging, Prod).
- Coordination may be needed with the mobile development team to ensure deep-linking is correctly implemented in the vendor app.

## 11.4.0.0 Release Impact

This is a critical feature for the vendor onboarding workflow and should be included in the initial release.

