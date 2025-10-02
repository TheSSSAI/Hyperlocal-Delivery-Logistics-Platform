# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | VND-028 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Vendor Receives Automated License Expiry Reminders |
| As A User Story | As a Vendor, I want to receive automated notificat... |
| User Persona | An active Vendor on the platform who is required t... |
| Business Value | Ensures vendors remain compliant, preventing autom... |
| Functional Area | Vendor Management & Compliance |
| Story Theme | Platform Compliance and Automation |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

30-Day Expiry Reminder Trigger

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

A vendor has a license stored in the system with an expiry date exactly 30 days from today's date

### 3.1.5 When

The daily automated license check job runs

### 3.1.6 Then

The system sends a reminder notification to the vendor via their configured channels (push notification and email). The notification content must be: 'Your [License Type] license (Number: [License Number]) is expiring on [Expiry Date]. Please renew and update your details to avoid service interruption.'

### 3.1.7 Validation Notes

Verify that a notification is triggered and received. Check the notification content for accuracy. The job should be idempotent and not send multiple notifications if run again on the same day.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

15-Day and 7-Day Expiry Reminders

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

A vendor has a license expiring in 15 days (or 7 days) and has not updated their license details since the previous reminder

### 3.2.5 When

The daily automated license check job runs

### 3.2.6 Then

The system sends the corresponding 15-day (or 7-day) reminder notification to the vendor.

### 3.2.7 Validation Notes

Set up test data with expiry dates at T+15 and T+7. Manually trigger the job and verify the correct notifications are sent.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Reminders Stop After License Update

### 3.3.3 Scenario Type

Alternative_Flow

### 3.3.4 Given

A vendor has a license expiring in 20 days and has already received the 30-day reminder

### 3.3.5 When

The vendor updates their license information with a new expiry date set for one year in the future

### 3.3.6 Then

The system must not send the 15-day or 7-day reminders associated with the old expiry date.

### 3.3.7 Validation Notes

Simulate a vendor updating their license. Trigger the check job on subsequent key dates (when the old license would have been 15/7 days from expiry) and confirm no notifications are sent.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Onboarding with a Nearly Expired License

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

A new vendor is approved and their license expires in 12 days

### 3.4.5 When

The daily automated license check job runs

### 3.4.6 Then

The system does not send the 30-day or 15-day reminders. The system will send the 7-day reminder when the license is exactly 7 days from expiry.

### 3.4.7 Validation Notes

Create a new vendor with a license expiring in 12 days. Verify that no reminder is sent. Advance the system date by 5 days, run the job, and verify the 7-day reminder is sent.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

No Reminders for Expired Licenses

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

A vendor's license expired yesterday

### 3.5.5 When

The daily automated license check job runs

### 3.5.6 Then

The system does not send any expiry reminders for this license.

### 3.5.7 Validation Notes

Use test data for a vendor with an expired license. Run the job and confirm no notifications are generated for this vendor.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Notification Delivery Failure

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

The license check job identifies a license that needs a reminder

### 3.6.5 When

The external notification service (e.g., FCM, SNS) is unavailable and fails to send the notification

### 3.6.6 Then

The system must log the failed delivery attempt with the vendor ID, notification type, and a timestamp, without halting the job for other vendors.

### 3.6.7 Validation Notes

Use a mock of the notification service that can be configured to fail. Trigger the job and verify that the failure is logged correctly in CloudWatch.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Push Notification on mobile device
- In-app notification/banner on the Vendor Dashboard
- Email notification template

## 4.2.0 User Interactions

- Clicking the in-app notification or a link within the email should navigate the vendor directly to the license management section of their profile.

## 4.3.0 Display Requirements

- All notifications must clearly display: License Type, License Number, and Expiry Date.

## 4.4.0 Accessibility Needs

- Email notifications must be HTML-formatted for screen reader compatibility.

# 5.0.0 Business Rules

- {'rule_id': 'BR-VND-LIC-01', 'rule_description': "Automated reminders are sent 30, 15, and 7 days before a license's expiry date.", 'enforcement_point': 'Daily scheduled background job.', 'violation_handling': 'N/A - This is a system-initiated action.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

VND-027

#### 6.1.1.2 Dependency Reason

A vendor must have the ability to view and update their license information to act on the reminder. This story is blocked until VND-027 is complete.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

VND-001

#### 6.1.2.2 Dependency Reason

The system must be able to capture license details during vendor registration.

## 6.2.0.0 Technical Dependencies

- A reliable serverless scheduling service (e.g., AWS EventBridge Scheduler).
- A notification service for push notifications (Firebase Cloud Messaging) and SMS/email (AWS SNS/SES), as per REQ-INT-003.
- Centralized logging service (AWS CloudWatch) for tracking job execution and failures.

## 6.3.0.0 Data Dependencies

- Vendor profile data, specifically a table/collection containing vendor_id, license_type, license_number, and license_expiry_date.

## 6.4.0.0 External Dependencies

- Availability of third-party notification provider APIs (FCM, AWS SNS/SES).

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The scheduled job must complete its scan of the entire vendor database within a 15-minute execution window, even with 100,000+ vendors.
- The database query for expiring licenses must be indexed on the expiry date field to ensure high performance.

## 7.2.0.0 Security

- The job must run with least-privilege IAM permissions, having read-only access to vendor data and write-only access to the notification and logging services.

## 7.3.0.0 Usability

- Notification content must be clear, concise, and actionable.

## 7.4.0.0 Accessibility

- N/A for the backend job, but email templates must follow WCAG 2.1 AA guidelines.

## 7.5.0.0 Compatibility

- N/A

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires setting up and managing a scheduled background job (e.g., Lambda with EventBridge trigger).
- Integration with multiple external notification services.
- Requires careful handling of timezones to ensure jobs run correctly relative to the IST zone specified in REQ-INT-005.
- Logic must be robust to handle edge cases like license updates and new vendors with near-expiry licenses.

## 8.3.0.0 Technical Risks

- The scheduled job could fail to trigger, leading to missed reminders. Requires robust monitoring and alerting on the job itself.
- Throttling or failures from external notification APIs could impact delivery. The system should handle this gracefully by logging errors.

## 8.4.0.0 Integration Points

- AWS EventBridge (Scheduler)
- AWS Lambda (Job Logic)
- Amazon RDS for PostgreSQL (Vendor Data)
- Firebase Cloud Messaging (Push Notifications)
- AWS Simple Notification Service (SMS)
- AWS CloudWatch (Logging & Monitoring)

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- End-to-End (Manual/Simulated)

## 9.2.0.0 Test Scenarios

- Verify reminder is sent at T+30, T+15, and T+7 days.
- Verify no reminder is sent at T+29 or T+16 days.
- Verify reminders stop after a vendor updates their license expiry date.
- Verify a vendor with an expired license receives no reminders.
- Verify the system correctly handles notification service failures by logging them.

## 9.3.0.0 Test Data Needs

- A set of vendor accounts with license expiry dates specifically set to T+30, T+15, T+7, T+1, T-1, and T+365 to cover all primary and edge cases.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- Mocks for external notification services.
- A script to manually trigger the scheduled job in a staging environment.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in the staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written with >80% coverage for the new logic.
- The scheduled job is deployed and configured to run daily on a schedule.
- Monitoring and alerts are configured for job failures in AWS CloudWatch.
- Documentation for the new scheduled job (purpose, schedule, monitoring) is created in the project's runbook.
- Manual E2E tests have been successfully executed for all key scenarios.
- Story deployed and verified in staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is primarily a backend task, but may require coordination with the mobile/frontend team if a new in-app notification UI is needed.
- Requires infrastructure setup (IaC via Terraform) for the Lambda and EventBridge rule.

## 11.4.0.0 Release Impact

This is a critical feature for ensuring platform compliance and preventing business disruption for vendors. It should be included in the next available release.

