# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | SYS-006 |
| Elaboration Date | 2025-01-20 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | System Processes Weekly Rider Settlements |
| As A User Story | As the System (on behalf of the Finance & Operatio... |
| User Persona | System (benefiting Riders and Platform Administrat... |
| Business Value | Ensures timely and accurate rider payments, which ... |
| Functional Area | Financial Management and Settlements |
| Story Theme | Rider Payouts and Financial Reconciliation |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Happy Path: Rider with positive net earnings receives a payout

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

A rider has a verified bank account, their total earnings for the settlement period are ₹2000, and their total collected COD is ₹500.

### 3.1.5 When

The weekly rider settlement job is triggered for that settlement period.

### 3.1.6 Then

The system calculates the net payout amount as ₹1500 (Earnings - COD Collected).

### 3.1.7 And

The rider's 'cash-in-hand' ledger is adjusted to reflect the settlement.

### 3.1.8 Validation Notes

Verify the payout record in the database and the corresponding API call in the RazorpayX sandbox dashboard. Check the rider's financial ledger for the correct balance adjustment.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Edge Case: Rider with negative net earnings (owes money to the platform)

### 3.2.3 Scenario Type

Edge_Case

### 3.2.4 Given

A rider's total earnings for the settlement period are ₹500, and their total collected COD is ₹1200.

### 3.2.5 When

The weekly rider settlement job is triggered.

### 3.2.6 Then

The system calculates a negative net balance of -₹700.

### 3.2.7 And

A notification is queued to be sent to the rider explaining their balance.

### 3.2.8 Validation Notes

Confirm that no payout API call was made for this rider. Check the rider's ledger in the database to ensure the negative balance is correctly recorded.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Error Condition: Payout API integration fails during payout initiation

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

A rider is eligible for a payout of ₹1500.

### 3.3.5 When

The system attempts to initiate the payout, but the external payout API returns a 5xx server error.

### 3.3.6 Then

The payout transaction record is marked as 'failed' with the error details from the API response.

### 3.3.7 And

The rider's payable balance is not debited until the payout is successfully confirmed.

### 3.3.8 Validation Notes

Simulate an API failure using a mock server. Verify that the payout status is 'failed' in the database, an alert is logged/sent, and the retry logic is triggered as expected.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Error Condition: Payout fails due to invalid rider bank details

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

A rider is eligible for a payout, but their registered bank account is invalid.

### 3.4.5 When

The payout API returns a failure status indicating invalid beneficiary details.

### 3.4.6 Then

The payout transaction record is marked as 'failed' with the specific reason 'Invalid Beneficiary Details'.

### 3.4.7 And

An internal support ticket or alert is created for an administrator to follow up.

### 3.4.8 Validation Notes

Use test credentials for an invalid bank account in the sandbox. Verify the payout status, the rider notification, and the admin alert.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

System ensures idempotency of the settlement process

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

The settlement job for a specific rider and week has already been successfully processed.

### 3.5.5 When

The settlement job is accidentally re-triggered for the same rider and week.

### 3.5.6 Then

The system identifies that a successful payout for this period already exists.

### 3.5.7 And

The event is logged as a duplicate trigger attempt.

### 3.5.8 Validation Notes

Run the settlement job, verify success, then immediately re-run it with the same parameters. Confirm that only one payout was initiated in the external API and the database.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

System adheres to the T+2 settlement cycle

### 3.6.3 Scenario Type

Happy_Path

### 3.6.4 Given

The settlement period is defined as Monday 00:00 to Sunday 23:59 IST.

### 3.6.5 When

The settlement job runs on the following Tuesday (a banking day).

### 3.6.6 Then

The system correctly aggregates all financial transactions (earnings, tips, COD) for each rider that were completed within that specific weekly period.

### 3.6.7 Validation Notes

Create test orders both inside and outside the settlement window. Verify that the calculation only includes orders from within the correct Mon-Sun period.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- N/A (This is a backend process). However, it triggers UI-related events:
- Push Notification template for 'Payout Processed'
- Push Notification template for 'Payout Failed - Action Required'
- Alert/Flag in the Admin Dashboard for failed settlements

## 4.2.0 User Interactions

- N/A

## 4.3.0 Display Requirements

- The rider's 'Earnings' screen must be updated with the settlement details post-payout.
- The Admin 'Payouts' dashboard must display the status (processing, success, failed) of each settlement batch.

## 4.4.0 Accessibility Needs

- N/A

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-001

### 5.1.2 Rule Description

Rider earnings shall be settled weekly on a T+2 banking day settlement cycle (REQ-BR-005).

### 5.1.3 Enforcement Point

The job scheduler configuration.

### 5.1.4 Violation Handling

Job failure should trigger a P1 critical alert to the on-call team.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-002

### 5.2.2 Rule Description

A payout is only initiated if the rider's net earnings (Earnings + Tips - COD Collected) for the period is a positive value.

### 5.2.3 Enforcement Point

Within the settlement calculation logic before the API call.

### 5.2.4 Violation Handling

Negative or zero balances are logged, and no payout is created.

## 5.3.0 Rule Id

### 5.3.1 Rule Id

BR-003

### 5.3.2 Rule Description

A payout can only be attempted for a rider with a 'verified' bank account status.

### 5.3.3 Enforcement Point

Eligibility check at the start of processing for each rider.

### 5.3.4 Violation Handling

Rider is skipped from the payout batch, and an admin alert is generated.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-007

#### 6.1.1.2 Dependency Reason

Requires the ability for riders to add and verify their bank account details.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

RDR-026

#### 6.1.2.2 Dependency Reason

Requires the underlying data structures and services that track rider earnings per delivery.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

RDR-024

#### 6.1.3.2 Dependency Reason

Requires the system to accurately track the 'cash-in-hand' amount for each rider from COD orders.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

ADM-028

#### 6.1.4.2 Dependency Reason

Requires an admin interface to monitor the status and outcome of settlement batches.

## 6.2.0.0 Technical Dependencies

- A reliable, configurable job scheduling system (e.g., Kubernetes CronJob, AWS EventBridge).
- The 'Payments & Settlements' microservice must be established (REQ-ARC-001).
- A double-entry accounting ledger system for all financial transactions (REQ-FUN-021).

## 6.3.0.0 Data Dependencies

- Access to immutable order and transaction records to calculate earnings, tips, and COD amounts.
- Access to rider profiles, including their verified bank account details.

## 6.4.0.0 External Dependencies

- Integration with the RazorpayX Bulk Payout API (REQ-FUN-021). API credentials and sandbox access are required for development and testing.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The settlement job must be able to process the entire active rider base within a 4-hour window.
- Database queries for fetching weekly transactions must be optimized to handle tens of thousands of records per rider.

## 7.2.0.0 Security

- All communication with the payout API must be over HTTPS/TLS 1.2+.
- API keys and secrets for the payout gateway must be stored securely in AWS Secrets Manager (REQ-NFR-003).
- Access to the settlement service and its logs must be restricted to authorized personnel (Finance/Admin roles).

## 7.3.0.0 Usability

- N/A

## 7.4.0.0 Accessibility

- N/A

## 7.5.0.0 Compatibility

- N/A

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

High

## 8.2.0.0 Complexity Factors

- Financial Criticality: Calculations must be 100% accurate to maintain rider trust. Requires careful handling of currency/decimal values.
- External API Integration: Dependency on a third-party API introduces risks of downtime, errors, and requires robust error handling and retry logic.
- Idempotency: The process must be designed to be safely re-runnable without causing duplicate payouts.
- Data Aggregation: The process needs to aggregate data from multiple sources/services (Orders, Riders), which requires a resilient data access strategy.
- Scalability: The solution must scale to handle a growing number of riders and transactions.

## 8.3.0.0 Technical Risks

- The external payout API may have rate limits that need to be handled.
- Partial failures within a large batch (e.g., 10 out of 1000 payouts fail) need a clear process for manual review and reprocessing.
- Data consistency issues between microservices could lead to incorrect calculations.

## 8.4.0.0 Integration Points

- RazorpayX API for initiating payouts.
- Internal APIs to fetch order data from the Order Management service.
- Internal APIs to fetch rider bank details from the Identity & Access service.
- Notification service (FCM/SNS) to send status updates to riders.
- Monitoring and alerting service (Prometheus/Alertmanager) for job health.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Performance

## 9.2.0.0 Test Scenarios

- Verify calculations for various scenarios: positive balance, negative balance, zero balance, with/without tips.
- Test the full E2E flow in a staging environment: create orders, complete them, run the job, verify payout in RazorpayX sandbox.
- Test failure scenarios: simulate API downtime, invalid API responses, and invalid bank details.
- Test idempotency by running the job multiple times for the same period.
- Perform load testing to ensure the job completes within the required performance window for a large number of riders.

## 9.3.0.0 Test Data Needs

- A set of test riders with verified and unverified bank accounts.
- A history of completed orders with a mix of prepaid and COD payments.
- Test credentials for the RazorpayX sandbox environment, including tokens for simulating success and failure cases.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- A mock server (e.g., WireMock) to simulate RazorpayX API responses.
- Cypress or a similar E2E framework to automate the creation of test data (orders).

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in the staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration test coverage meets the 80% project standard (REQ-NFR-006).
- The settlement job is successfully configured and tested on a schedule in the staging environment.
- Payouts are successfully created and verified in the RazorpayX sandbox.
- All financial calculations have been manually verified and signed off by a QA lead.
- Logging and alerting for success and failure cases are implemented and tested.
- Technical documentation for the settlement process and its configuration is created/updated.
- The story has been deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

13

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational feature for rider payments and may be a blocker for go-live.
- Requires early access to RazorpayX API documentation and sandbox credentials.
- Due to its complexity and criticality, it should be allocated to senior engineers and given sufficient time for thorough testing.

## 11.4.0.0 Release Impact

This feature is critical for the platform's ability to operate and pay its delivery partners. It must be fully functional and stable before the first rider payout cycle.

