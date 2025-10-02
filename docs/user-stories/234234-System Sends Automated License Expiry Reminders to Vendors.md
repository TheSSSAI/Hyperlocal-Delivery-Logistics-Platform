# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | SYS-004 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | System Sends Automated License Expiry Reminders to... |
| As A User Story | As a Vendor, I want to receive automated reminders... |
| User Persona | System (Actor), Vendor (Beneficiary) |
| Business Value | Ensures vendor compliance, prevents revenue loss f... |
| Functional Area | Vendor Management & Compliance |
| Story Theme | Platform Automation & Governance |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

30-Day Reminder Trigger

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

A vendor has a license with an expiry date that is exactly 30 days from the current date

### 3.1.5 And

The system records that the 30-day reminder has been successfully sent for this specific license to prevent duplicates.

### 3.1.6 When

The daily automated license check job runs

### 3.1.7 Then

The system sends a '30-day expiry' reminder notification to the vendor via configured channels (Push Notification, SMS)

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

15-Day Reminder Trigger

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

A vendor has a license with an expiry date that is exactly 15 days from the current date

### 3.2.5 And

The system records that the 15-day reminder has been successfully sent.

### 3.2.6 When

The daily automated license check job runs

### 3.2.7 Then

The system sends a '15-day expiry' reminder notification to the vendor

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

7-Day Reminder Trigger

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

A vendor has a license with an expiry date that is exactly 7 days from the current date

### 3.3.5 And

The system records that the 7-day reminder has been successfully sent.

### 3.3.6 When

The daily automated license check job runs

### 3.3.7 Then

The system sends a '7-day expiry' reminder notification to the vendor

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Duplicate Reminder Prevention

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

A vendor's license expires in 29 days

### 3.4.5 And

The system has already successfully sent the 30-day reminder on the previous day

### 3.4.6 When

The daily automated license check job runs

### 3.4.7 Then

The system does not send any notification to the vendor.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Reminder Cycle Resets After License Update

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

A vendor received a 30-day reminder for a license

### 3.5.5 And

The vendor subsequently updates their license with a new expiry date set for one year in the future

### 3.5.6 When

The daily automated license check job runs on a day that would have triggered a 15-day reminder for the old expiry date

### 3.5.7 Then

The system does not send any reminder, as the new expiry date is not within any reminder window.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Job Ignores Vendors with No Expiry Date

### 3.6.3 Scenario Type

Edge_Case

### 3.6.4 Given

A vendor has a license record but the expiry date is null or not provided

### 3.6.5 When

The daily automated license check job runs

### 3.6.6 Then

The system skips this vendor's license record without sending a notification or logging an error.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Job Ignores Already Expired Licenses

### 3.7.3 Scenario Type

Edge_Case

### 3.7.4 Given

A vendor's license expiry date is in the past

### 3.7.5 When

The daily automated license check job runs

### 3.7.6 Then

The system skips this vendor's license record, as the vendor should already be handled by the account-blocking mechanism (SYS-005).

## 3.8.0 Criteria Id

### 3.8.1 Criteria Id

AC-008

### 3.8.2 Scenario

Handling Notification Service Failure

### 3.8.3 Scenario Type

Error_Condition

### 3.8.4 Given

A vendor's license is due for a reminder

### 3.8.5 And

The system does NOT record the reminder as 'sent', allowing for a retry on the next scheduled job run.

### 3.8.6 When

The system attempts to send the reminder notification

### 3.8.7 Then

The system logs the failed delivery attempt with the vendor ID, license ID, and error details

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- This is a backend feature; no direct UI elements are created in this story.

## 4.2.0 User Interactions

- No direct user interaction. The vendor receives system-generated notifications.

## 4.3.0 Display Requirements

- Push Notification Content: Title: 'License Renewal Reminder', Body: 'Your [License Type] license for [Store Name] is expiring on [Expiry Date]. Please update it in the vendor dashboard to ensure uninterrupted service.'
- SMS Content: 'Hi [Vendor Name], your [License Type] license for [Store Name] expires on [Expiry Date]. Please update it on the platform to avoid service disruption.'

## 4.4.0 Accessibility Needs

- Not applicable for a backend process. Notification content should be clear and simple.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-SYS-004-01

### 5.1.2 Rule Description

Reminder notifications must be sent at specific intervals: 30, 15, and 7 days before the license expiry date.

### 5.1.3 Enforcement Point

During the execution of the daily scheduled license check job.

### 5.1.4 Violation Handling

If the job fails to run, monitoring alerts should be triggered. If a notification fails to send, it should be retried on the next run.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-SYS-004-02

### 5.2.2 Rule Description

A specific reminder (e.g., 30-day) for a specific license instance must only be sent once.

### 5.2.3 Enforcement Point

The system must check if a reminder has already been sent before attempting to send a new one.

### 5.2.4 Violation Handling

The system must maintain a state/log of sent reminders to prevent duplicates.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

VND-027

#### 6.1.1.2 Dependency Reason

This story requires the data model and functionality for vendors to store and manage their license information, including the expiry date.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

REQ-INT-003

#### 6.1.2.2 Dependency Reason

This story requires the platform to be integrated with notification services (FCM for push, AWS SNS for SMS) to send the reminders.

## 6.2.0.0 Technical Dependencies

- A scheduled job runner (e.g., Kubernetes CronJob, AWS EventBridge Scheduler).
- Database schema to store vendor license details and track sent reminders.
- Configured SDKs for AWS SNS and Firebase Cloud Messaging.

## 6.3.0.0 Data Dependencies

- Access to the `vendors` and `vendor_licenses` tables with accurate data.

## 6.4.0.0 External Dependencies

- Availability and correct functioning of the AWS SNS and Google FCM APIs.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The scheduled job must be optimized to handle tens of thousands of vendors without causing significant load on the database. The query to find expiring licenses must use an index on the expiry date column.
- The job should complete its run within a predefined time window (e.g., 30 minutes).

## 7.2.0.0 Security

- Credentials for notification services must be stored securely in AWS Secrets Manager.
- The job should only access the data it needs (vendor contact info, license details).

## 7.3.0.0 Usability

- Notification messages must be clear, concise, and actionable for the vendor.

## 7.4.0.0 Accessibility

- Not applicable.

## 7.5.0.0 Compatibility

- Not applicable.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires setting up and monitoring a scheduled background job.
- Involves date and time logic, which needs to be handled carefully (including timezones).
- Requires state management to track sent notifications and prevent duplicates.
- Integration with external notification services adds a point of failure that must be handled gracefully.

## 8.3.0.0 Technical Risks

- The external notification service API could be down or rate-limit the requests.
- An inefficient database query could cause performance degradation as the number of vendors grows.
- A bug in the date logic could cause reminders to be missed or sent on the wrong day.

## 8.4.0.0 Integration Points

- Database (PostgreSQL) for reading vendor and license data.
- Notification Service (AWS SNS, FCM) for sending messages.
- Logging Service (AWS CloudWatch) for auditing and error tracking.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- Verify that notifications are triggered correctly for licenses expiring in 30, 15, and 7 days.
- Verify that no notification is sent for licenses outside these windows.
- Verify that duplicate notifications are not sent.
- Verify that updating a license's expiry date correctly resets the reminder logic.
- Simulate a notification service failure and verify that the error is logged and the reminder is not marked as sent.

## 9.3.0.0 Test Data Needs

- Test vendors with licenses expiring at T+30, T+15, T+7 days.
- Test vendors with licenses expiring at other intervals (e.g., T+29, T+1 days).
- Test vendors with null expiry dates.
- Test vendors with already expired licenses.
- Test vendors with multiple licenses.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- Mocking libraries for external services (AWS SDK, FCM).
- A test environment where the scheduled job can be triggered manually.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a testing environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written with at least 80% coverage for the new logic.
- The scheduled job is successfully configured and tested in the staging environment.
- Logs for sent notifications and errors are correctly written to CloudWatch.
- Notification content templates are finalized and approved.
- Documentation for the job's configuration and monitoring has been created.
- Story has been deployed and verified in the staging environment by QA.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is dependent on VND-027 being completed first.
- The team needs to ensure access and credentials for the notification services are available before starting development.
- This story provides significant value by preventing a negative user experience (account suspension) and should be prioritized before the platform launch.

## 11.4.0.0 Release Impact

- This is a key compliance and vendor-retention feature. It should be part of the initial release to ensure a smooth operational start.

