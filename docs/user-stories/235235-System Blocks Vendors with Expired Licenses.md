# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | SYS-005 |
| Elaboration Date | 2025-01-24 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | System Blocks Vendors with Expired Licenses |
| As A User Story | As the platform, I want to automatically check ven... |
| User Persona | System (acting on behalf of Platform Administrator... |
| Business Value | Mitigates legal and regulatory risk (as per REQ-CO... |
| Functional Area | Vendor Management & Compliance |
| Story Theme | Platform Trust & Safety |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

A vendor's license has expired

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

A vendor in a category requiring a license has a license on file with an expiry date of 'yesterday'

### 3.1.5 And

The vendor receives an in-app and email notification informing them of the suspension and the reason.

### 3.1.6 When

The system's daily compliance check job runs

### 3.1.7 Then

The vendor's status is updated to 'suspended_license_expired'

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

A vendor's license expires today

### 3.2.3 Scenario Type

Edge_Case

### 3.2.4 Given

A vendor has a license on file with an expiry date of 'today'

### 3.2.5 And

The vendor's status is 'active'

### 3.2.6 When

The system's daily compliance check job runs

### 3.2.7 Then

The vendor's status remains 'active' and they can continue to accept orders for the remainder of the day.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

A vendor does not require a license

### 3.3.3 Scenario Type

Alternative_Flow

### 3.3.4 Given

A vendor is in a category that does not require a license

### 3.3.5 And

They have no license information stored in their profile

### 3.3.6 When

The system's daily compliance check job runs

### 3.3.7 Then

The vendor's status is unaffected and they remain able to accept orders.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

A suspended vendor cannot be assigned an order

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

A vendor's status is 'suspended_license_expired'

### 3.4.5 When

The order allocation service attempts to assign a new order to this vendor

### 3.4.6 Then

The assignment fails, and the system immediately attempts to find the next available, compliant rider for that order.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Suspended vendor views their dashboard

### 3.5.3 Scenario Type

Happy_Path

### 3.5.4 Given

A vendor's status is 'suspended_license_expired'

### 3.5.5 When

The vendor logs into their web dashboard

### 3.5.6 Then

A prominent, non-dismissible banner is displayed stating: 'Your store is offline. Your [License Type] expired on [Expiry Date]. Please update your license details to resume accepting orders.'

### 3.5.7 And

The master switch to take the store online is disabled.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Admin views a suspended vendor's profile

### 3.6.3 Scenario Type

Happy_Path

### 3.6.4 Given

A vendor's status is 'suspended_license_expired'

### 3.6.5 When

An administrator views the user management list or the vendor's profile

### 3.6.6 Then

The vendor's status is clearly displayed as 'Suspended (License Expired)'.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A non-dismissible banner on the vendor dashboard for suspended vendors.
- A status indicator/tag on the admin user management dashboard.

## 4.2.0 User Interactions

- The vendor's 'Go Online' toggle must be disabled while their license is expired.
- Customers should not see or be able to interact with the suspended vendor's store.

## 4.3.0 Display Requirements

- The suspension notification must clearly state the license type and expiry date.
- The customer-facing app must gracefully handle suspended stores, showing a 'temporarily unavailable' message if accessed via a direct link.

## 4.4.0 Accessibility Needs

- The suspension banner on the vendor dashboard must be accessible to screen readers.

# 5.0.0 Business Rules

- {'rule_id': 'BR-COMP-001', 'rule_description': 'A vendor cannot accept new orders if any of their required licenses have an expiry date that is in the past.', 'enforcement_point': 'A daily scheduled job and as a fail-safe check during the order assignment process.', 'violation_handling': "The vendor's status is set to 'suspended_license_expired', their store is taken offline, and they are notified."}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

VND-027

#### 6.1.1.2 Dependency Reason

The system must have the functionality for vendors to store and manage their license number and expiry date before it can check them.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-030

#### 6.1.2.2 Dependency Reason

An audit log system must be in place to record the automated suspension action, as required by REQ-CON-001.

## 6.2.0.0 Technical Dependencies

- A scheduled job execution environment (e.g., Kubernetes CronJob, AWS EventBridge).
- A centralized notification service (for in-app, email, SMS).
- Vendor Profile microservice to store and manage vendor status.
- Order Management microservice to check vendor status before allocation.

## 6.3.0.0 Data Dependencies

- Vendor profile data, including a flag for whether a license is required for their category.
- Vendor license data, specifically the expiry date.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The daily compliance check job must process all vendors within the designated 2 AM - 4 AM IST maintenance window.
- If a real-time check is implemented in the order path, it must add less than 50ms of latency to the allocation process.

## 7.2.0.0 Security

- The job should run with the minimum necessary permissions to read vendor data and update their status.
- Changes to vendor status must be auditable.

## 7.3.0.0 Usability

- The reason for suspension must be communicated clearly and immediately to the affected vendor to avoid confusion.

## 7.4.0.0 Accessibility

- N/A for a system-facing story, but UI elements affected (e.g., vendor banner) must be accessible.

## 7.5.0.0 Compatibility

- N/A

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires coordination between a scheduled job and real-time services (Order Management).
- Managing vendor state ('active', 'suspended_license_expired', 'inactive_by_vendor') requires careful logic to ensure states don't conflict.
- The scheduled job must be idempotent and handle time zones correctly (all dates stored in UTC, checks run against IST midnight).

## 8.3.0.0 Technical Risks

- A failure in the scheduled job could lead to non-compliant vendors remaining active. The job needs robust monitoring and alerting.
- Incorrect time zone handling could lead to vendors being suspended a day early or a day late.

## 8.4.0.0 Integration Points

- Vendor Service (to read/write vendor status).
- Order Service (to check vendor status).
- Notification Service (to send alerts).
- Audit Service (to log the event).

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- Verify a vendor with a license expiring yesterday is correctly suspended.
- Verify a vendor with a license expiring today remains active.
- Verify a suspended vendor is hidden from the customer app.
- Verify an order cannot be assigned to a suspended vendor.
- E2E: Create a vendor, set license to expire, run job, verify suspension, update license, verify reactivation.

## 9.3.0.0 Test Data Needs

- Vendor accounts with licenses in various states: valid, expiring today, expired yesterday.
- Vendor accounts in categories that do and do not require licenses.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- Cypress for E2E tests.
- A method to manually trigger the scheduled job in test/staging environments.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by team
- Unit and integration tests implemented with >80% coverage for the new logic
- E2E test scenario for suspension and reactivation is automated and passing
- The scheduled job is configured and verified in the staging environment
- Vendor dashboard correctly displays the suspension banner
- Admin dashboard correctly flags the suspended vendor
- Notifications to the vendor are verified
- Audit log entries are correctly created
- Documentation for the compliance job (runbook, alerts) is created

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a critical compliance feature. It must be completed before launching in any region.
- Requires collaboration between backend developers working on the Vendor service and the scheduled job.

## 11.4.0.0 Release Impact

- Enables the platform to enforce a key compliance policy, reducing legal risk for the business.

