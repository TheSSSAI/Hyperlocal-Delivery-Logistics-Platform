# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | SYS-010 |
| Elaboration Date | 2025-01-20 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | System: Automate Deletion of Old Sensitive Operati... |
| As A User Story | As a Platform Owner, I want the system to automati... |
| User Persona | System (Stakeholder: Platform Owner, Compliance Of... |
| Business Value | Ensures compliance with data retention policies (R... |
| Functional Area | Data Lifecycle Management |
| Story Theme | Compliance and System Maintenance |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Happy Path: Data for a delivered order older than 90 days is deleted

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

An order with ID 'ORD-123' was marked as 'Delivered' 91 days ago, and it has an associated Proof of Delivery (POD) photo and chat logs.

### 3.1.5 When

The automated data retention job is triggered.

### 3.1.6 Then

The job identifies 'ORD-123' as eligible for data deletion.

### 3.1.7 And

A success log is generated, recording the deletion of POD and chat data for 'ORD-123'.

### 3.1.8 Validation Notes

Verify by checking S3 for the absence of the photo, querying the chat database for the absence of logs, and checking the application logs for the success message.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Edge Case: Data for an order exactly 90 days old is not deleted

### 3.2.3 Scenario Type

Edge_Case

### 3.2.4 Given

An order with ID 'ORD-456' was marked as 'Delivered' exactly 90 days ago (based on a 24-hour window).

### 3.2.5 When

The automated data retention job is triggered.

### 3.2.6 Then

The job does NOT identify 'ORD-456' as eligible for data deletion.

### 3.2.7 And

Its associated POD photo and chat logs are NOT deleted.

### 3.2.8 Validation Notes

Verify that the POD photo in S3 and chat logs in the database for 'ORD-456' still exist after the job completes.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Happy Path: Data for a cancelled order older than 90 days is deleted

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

An order with ID 'ORD-789' was marked as 'Cancelled' 95 days ago and has associated chat logs.

### 3.3.5 When

The automated data retention job is triggered.

### 3.3.6 Then

The job identifies 'ORD-789' as eligible for data deletion.

### 3.3.7 And

The associated chat logs are permanently deleted from the database.

### 3.3.8 Validation Notes

Verify that the chat logs for 'ORD-789' are no longer present in the database.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Error Condition: Job handles missing data gracefully

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

An order with ID 'ORD-101' was completed 100 days ago, and its record points to a POD photo that is already missing from S3, but its chat logs exist.

### 3.4.5 When

The automated data retention job processes 'ORD-101'.

### 3.4.6 Then

The job logs a warning that the POD photo for 'ORD-101' was not found.

### 3.4.7 And

The job continues its execution to process other eligible orders without terminating.

### 3.4.8 Validation Notes

Check the job's execution logs for the specific warning message and confirm that other eligible orders were still processed correctly.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Performance: Job processes large volumes in batches

### 3.5.3 Scenario Type

Happy_Path

### 3.5.4 Given

There are 5,000 orders eligible for data deletion.

### 3.5.5 When

The automated data retention job is triggered.

### 3.5.6 Then

The job processes the orders in manageable batches (e.g., 100 or 500 at a time) to avoid excessive memory usage or long-running database transactions.

### 3.5.7 And

The job completes successfully without causing performance degradation to the main application.

### 3.5.8 Validation Notes

Monitor database load and application performance metrics during the job's execution in a staging environment. Review logs to confirm batch processing.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Auditability: Job execution is logged for administrative review

### 3.6.3 Scenario Type

Happy_Path

### 3.6.4 Given

The data retention job has completed its run.

### 3.6.5 When

An administrator views the system logs (e.g., in CloudWatch).

### 3.6.6 Then

They can find a summary log for the job execution, including start time, end time, total orders processed, and total orders with data deleted.

### 3.6.7 And

The system's immutable audit trail contains a high-level entry for the system-initiated data deletion event.

### 3.6.8 Validation Notes

Requires access to the centralized logging platform and the audit trail system.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- No direct user-facing UI for customers, vendors, or riders.
- Admin Dashboard: A section to view the status and logs of the data retention job.

## 4.2.0 User Interactions

- Admin can filter job logs by date.
- Admin can view details of a specific job run.

## 4.3.0 Display Requirements

- Job logs must display: execution timestamp, duration, number of records scanned, number of records deleted, and any errors encountered.

## 4.4.0 Accessibility Needs

- Not applicable for the core automated function. Admin UI must adhere to WCAG 2.1 AA.

# 5.0.0 Business Rules

- {'rule_id': 'BR-DRP-001', 'rule_description': "Sensitive operational data (POD photos, chat logs) must be permanently deleted 90 days after an order's terminal state ('Delivered' or 'Cancelled') is reached.", 'enforcement_point': 'Automated daily scheduled job.', 'violation_handling': 'The job is designed to enforce this rule. Failures in the job should trigger a P2 alert to the on-call engineering team.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

REQ-FUN-017

#### 6.1.1.2 Dependency Reason

Depends on the existence of final order states ('Delivered', 'Cancelled') and their timestamps.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

REQ-FUN-015

#### 6.1.2.2 Dependency Reason

Depends on the storage mechanism and location schema for Proof of Delivery photos.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

REQ-FUN-020

#### 6.1.3.2 Dependency Reason

Depends on the storage mechanism and data model for in-app chat logs.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

REQ-NFR-008

#### 6.1.4.2 Dependency Reason

The job's actions must be logged in the central, immutable audit trail.

## 6.2.0.0 Technical Dependencies

- A job scheduling service (e.g., AWS EventBridge Scheduler, Kubernetes CronJob).
- Read/write access to the primary PostgreSQL database.
- Delete access (`s3:DeleteObject`) to the specific S3 bucket where POD photos are stored.
- Centralized logging system (e.g., AWS CloudWatch).

## 6.3.0.0 Data Dependencies

- Accurate timestamps for when orders transition to a final state.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The job must be designed to run during off-peak hours (e.g., between 2 AM and 4 AM IST) to minimize impact on production traffic.
- Database queries must be optimized with appropriate indexes on order status and completion date columns to handle millions of records efficiently.
- The job should complete its daily run within a 1-hour time window under the projected load for the next 12 months.

## 7.2.0.0 Security

- The job must run under an IAM role with the principle of least privilege, granting delete permissions only to the specific S3 bucket and database tables required.
- The 90-day retention period must be managed as a secure configuration parameter (e.g., in AWS Secrets Manager or Parameter Store), not hardcoded.
- All actions performed by the job must be logged to an audit trail, attributed to a 'System' actor.

## 7.3.0.0 Usability

- Not applicable.

## 7.4.0.0 Accessibility

- Not applicable.

## 7.5.0.0 Compatibility

- Not applicable.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Need for scalable, batch-based processing to handle large data volumes without impacting system performance.
- Requirement for robust error handling and retry logic to ensure reliability.
- Difficulty in testing time-based logic, requiring specific test data setup and potentially time-mocking libraries.
- Ensuring idempotency, so that a failed and restarted job does not cause issues.

## 8.3.0.0 Technical Risks

- An inefficient database query could cause high database load and impact the main application.
- A bug in the logic could lead to accidental deletion of data that is still within the retention period.
- Failure to handle S3 or DB API errors correctly could cause the job to fail silently or incompletely.

## 8.4.0.0 Integration Points

- Primary Database (AWS RDS for PostgreSQL)
- Object Storage (AWS S3)
- Scheduling Service (AWS EventBridge)
- Logging Service (AWS CloudWatch)
- Auditing Service (Internal)

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E (Staging Validation)

## 9.2.0.0 Test Scenarios

- Verify deletion for orders at 91 days.
- Verify non-deletion for orders at 90 and 89 days.
- Verify job completion with no eligible orders.
- Verify graceful handling of missing S3 objects.
- Verify batch processing logic with a large dataset.
- Verify job failure and alerting if database connection is lost.

## 9.3.0.0 Test Data Needs

- A script to seed a test database with orders having 'Delivered' and 'Cancelled' statuses with completion timestamps set to various points in the past (e.g., 89, 90, 91, 120 days ago).
- Associated mock POD photos in a test S3 bucket and mock chat logs in a test database.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- Time-mocking library (e.g., `sinon` or similar) for unit testing time-sensitive logic.
- Docker/Testcontainers for setting up isolated database/S3 environments for integration tests.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code is peer-reviewed and merged into the main branch.
- Unit and integration tests are implemented with at least 80% code coverage for the new module.
- The job is configured to run on a schedule in the staging environment and has been observed to execute successfully.
- Job execution logs and metrics are successfully pushed to and are viewable in the staging monitoring tools.
- The data retention period is confirmed to be an external configuration parameter.
- A runbook entry is created for the job, explaining its purpose, how to monitor it, and how to trigger it manually for maintenance.
- Story deployed and verified in the staging environment by QA.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🟡 Medium

## 11.3.0.0 Sprint Considerations

- This is a backend-only task with no UI component.
- Requires infrastructure setup for the scheduled job (e.g., Kubernetes CronJob or EventBridge rule).
- Significant effort should be allocated to creating a robust testing strategy and seed data.

## 11.4.0.0 Release Impact

No direct impact on user-facing features. Improves platform compliance and reduces operational costs over time. Can be released independently of feature release cycles.

