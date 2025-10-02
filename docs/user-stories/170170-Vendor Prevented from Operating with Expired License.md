# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | VND-029 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Vendor Prevented from Operating with Expired Licen... |
| As A User Story | As a Vendor, I want the system to automatically pr... |
| User Persona | Vendor (e.g., restaurant owner, shopkeeper) |
| Business Value | Ensures platform compliance with local regulations... |
| Functional Area | Vendor Management & Compliance |
| Story Theme | Platform Governance and Risk Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Vendor with a valid, non-expired license receives new orders normally

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

A vendor has a mandatory license on file with an expiry date set to a future date

### 3.1.5 When

A new order is created that is eligible to be assigned to this vendor

### 3.1.6 Then

The vendor receives the new order notification on their dashboard and is able to accept it without any restrictions.

### 3.1.7 Validation Notes

Verify that the order assignment logic proceeds as normal. No compliance-related errors should be logged for this transaction.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

System automatically blocks a vendor whose license has expired

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

A vendor's license expiry date was yesterday

### 3.2.5 When

A daily system job runs to check for expired licenses

### 3.2.6 Then

The system updates the vendor's status to 'suspended_license_expired'.

### 3.2.7 And

An entry is created in the audit log recording the automatic suspension, timestamp, and reason.

### 3.2.8 Validation Notes

Check the vendor's status in the database after the job runs. Verify the audit log entry.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

A suspended vendor is not assigned new orders

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

A vendor's status is 'suspended_license_expired'

### 3.3.5 When

The order management service attempts to assign a new order to this vendor

### 3.3.6 Then

The assignment fails, and the system does not send the order to the vendor.

### 3.3.7 And

The order assignment logic proceeds to the next available vendor or triggers the 'Allocation Failed' protocol as per REQ-FUN-018.

### 3.3.8 Validation Notes

Simulate an order for a suspended vendor and confirm they do not receive it. Check system logs to confirm the reason for assignment failure.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Suspended vendor is shown a clear notification on their dashboard

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

A vendor with status 'suspended_license_expired' logs into their web dashboard

### 3.4.5 When

They view their main dashboard page

### 3.4.6 Then

A prominent, non-dismissible notification is displayed at the top of the page.

### 3.4.7 And

The notification contains a button or link labeled 'Update License Now' that directs them to the license management page.

### 3.4.8 Validation Notes

Log in as the suspended vendor and visually confirm the banner's presence, text, and functionality.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Vendor successfully updates their expired license and is reactivated

### 3.5.3 Scenario Type

Happy_Path

### 3.5.4 Given

A vendor's status is 'suspended_license_expired'

### 3.5.5 When

The vendor submits the license update form with a new, valid license number and a future expiry date

### 3.5.6 Then

The system updates the vendor's license details.

### 3.5.7 And

An audit log entry is created for the reactivation event.

### 3.5.8 Validation Notes

Perform the update action and verify the status change in the database. Refresh the dashboard to confirm the banner is gone. Check the audit log.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Vendor attempts to update with another invalid or expired date

### 3.6.3 Scenario Type

Error_Condition

### 3.6.4 Given

A vendor's status is 'suspended_license_expired'

### 3.6.5 When

The vendor attempts to submit the license update form with an expiry date that is in the past

### 3.6.6 Then

The form displays a validation error message, such as 'Expiry date must be in the future.'

### 3.6.7 And

The suspension notification remains on their dashboard.

### 3.6.8 Validation Notes

Attempt to save an expired date and confirm the UI shows an error and the backend status does not change.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

License expiring today is considered valid

### 3.7.3 Scenario Type

Edge_Case

### 3.7.4 Given

A vendor's license expiry date is today's date

### 3.7.5 When

The daily system job runs OR a new order is placed

### 3.7.6 Then

The vendor's status remains 'active' and they can accept new orders throughout the day.

### 3.7.7 Validation Notes

Set a vendor's license to expire today. Run the check and confirm their status is unchanged. The suspension should only occur after midnight when the date changes.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A persistent, non-dismissible banner component for the Vendor Web Dashboard.

## 4.2.0 User Interactions

- The banner must contain a clickable link/button that navigates the user to the correct settings page to update their license.

## 4.3.0 Display Requirements

- The banner must dynamically display the type of license that has expired (e.g., FSSAI) and the exact date of expiry.
- The vendor's store status on any public-facing or admin-facing UI should reflect their unavailability (e.g., 'Temporarily Offline - Compliance Review').

## 4.4.0 Accessibility Needs

- The banner must have sufficient color contrast and use ARIA roles (e.g., role='alert') to be accessible to screen readers.

# 5.0.0 Business Rules

- {'rule_id': 'BR-LICENSE-01', 'rule_description': "A vendor's account is considered non-compliant and must be suspended from receiving new orders if their mandatory license's expiry date is before the current date.", 'enforcement_point': 'A daily scheduled job at midnight (IST) and/or at the point of order assignment.', 'violation_handling': "The vendor's status is set to 'suspended_license_expired', preventing new order assignments. A notification is displayed on their dashboard."}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

VND-027

#### 6.1.1.2 Dependency Reason

This story requires the existence of the UI and backend functionality for a vendor to store and update their license number and expiry date.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

VND-016

#### 6.1.2.2 Dependency Reason

This story modifies the existing workflow for how a vendor receives a new order.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

ADM-021

#### 6.1.3.2 Dependency Reason

Requires the audit trail system to be in place to log the automatic suspension and reactivation events.

## 6.2.0.0 Technical Dependencies

- A scheduled job runner (e.g., Kubernetes CronJob, AWS EventBridge).
- The Vendor service must expose an internal API to update a vendor's status.
- The Order Management service must be able to read the vendor's status before attempting an assignment.

## 6.3.0.0 Data Dependencies

- The vendor database schema must include fields for `license_type`, `license_number`, `expiry_date`, and a `status` enum (e.g., 'active', 'pending_verification', 'suspended_license_expired').

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The license check during order assignment must add negligible latency (<10ms) to the process. Using a pre-calculated status field is preferred over a real-time date comparison for every order.
- The daily scheduled job must complete its scan of all vendors within a reasonable timeframe (e.g., under 5 minutes for 100,000 vendors).

## 7.2.0.0 Security

- The internal API endpoint to change a vendor's status must be secured and only accessible by authorized services (e.g., the scheduled job runner, admin service).
- All status changes must be logged in an immutable audit trail as per REQ-CON-001 and REQ-NFR-008.

## 7.3.0.0 Usability

- The notification message must be unambiguous and provide a clear, single-click path for the vendor to resolve the issue.

## 7.4.0.0 Accessibility

- All UI elements related to this feature must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

*No items available*

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires creating a new, reliable scheduled job.
- Involves coordination between multiple microservices (Vendor, Order Management, and potentially a new 'Compliance' service).
- Modifies a critical business flow (order assignment), requiring careful testing to avoid unintended consequences.
- Requires a new state ('suspended_license_expired') in the vendor lifecycle management.

## 8.3.0.0 Technical Risks

- Failure of the scheduled job could lead to non-compliant vendors continuing to operate. The job needs robust monitoring and alerting.
- Race conditions if a vendor's license expires at the exact moment an order is being assigned. Using a pre-calculated status mitigates this.

## 8.4.0.0 Integration Points

- Vendor Service: Manages vendor data, including status.
- Order Management Service: Consumes vendor status to make assignment decisions.
- Scheduler Service/Infrastructure: Triggers the daily compliance check.
- Audit Service: Records all status changes.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security

## 9.2.0.0 Test Scenarios

- End-to-end flow: A vendor's license expires, they are blocked, they see the notification, they update the license, they are unblocked, and they successfully receive a new order.
- Scheduled job correctly identifies and updates statuses for multiple vendors with different expiry dates (past, present, future).
- Order assignment logic correctly skips a suspended vendor.
- API security for the status update endpoint.

## 9.3.0.0 Test Data Needs

- Vendor accounts with license expiry dates in the past, present, and future.
- Vendor accounts in vendor categories that require a license vs. those that do not.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- Cypress for E2E testing of the vendor dashboard flow.
- Tools to manually trigger and monitor the scheduled job in a staging environment.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in the staging environment.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >80% coverage for the new logic.
- E2E tests for the suspension and reactivation flow are automated and passing.
- The scheduled job is deployed with appropriate logging, monitoring, and alerts for failures.
- UI changes have been reviewed and approved by a UX designer.
- Security review of the status-change mechanism is complete.
- Technical documentation for the vendor status lifecycle and the compliance job has been created or updated.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a critical compliance feature and should be prioritized accordingly.
- Requires coordination between backend developers responsible for different microservices.
- Ensure the prerequisite story VND-027 is completed in a prior sprint or early in the same sprint.

## 11.4.0.0 Release Impact

- This feature is essential for launching in markets with strict regulations on food, pharmacy, or other licensed businesses. It may be a legal prerequisite for go-live.

