# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | ADM-020 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Admin Manually Intervenes in Failed Orders |
| As A User Story | As an Administrator, I want to view orders that ha... |
| User Persona | Administrator / Operations Manager responsible for... |
| Business Value | Provides a critical safety net to recover orders t... |
| Functional Area | Platform & Administrative Features |
| Story Theme | Operational Resilience and Exception Handling |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Admin successfully views and manually re-assigns a failed order

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

an Administrator is logged into the admin dashboard and an order exists with the status 'Allocation Failed'

### 3.1.5 When

the Administrator navigates to the 'Failed Orders' queue, selects the order, chooses the 'Manually Assign Rider' option, selects an available rider from the displayed list, and confirms the assignment

### 3.1.6 Then

the order's status is updated to 'Ready for Pickup' with the rider assigned, the selected rider receives the new task notification in their application, the customer and vendor receive a notification that a rider has been assigned, and a detailed entry is created in the admin audit trail and order event log documenting the manual intervention.

### 3.1.7 Validation Notes

Verify the order status change in the database. Check the rider's app for the new task. Confirm push notifications are sent. Query the audit log for the corresponding entry.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Admin successfully cancels a failed order

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

an Administrator is viewing an order with the status 'Allocation Failed'

### 3.2.5 When

the Administrator selects the 'Cancel Order' option and confirms the action in the confirmation dialog

### 3.2.6 Then

the order's status is updated to 'Cancelled', a full refund is automatically initiated if the order was prepaid, the customer and vendor are notified of the cancellation, and a detailed entry is created in the admin audit trail and order event log.

### 3.2.7 Validation Notes

Verify the order status change. Check the payment gateway logs for a refund transaction initiation. Confirm notifications are sent. Query the audit log.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

System prevents assignment to a rider who just became unavailable

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

an Administrator is viewing the list of available riders for a failed order

### 3.3.5 When

the Administrator attempts to assign the order to a rider who has just gone offline or accepted another task

### 3.3.6 Then

the assignment fails and the UI displays a non-blocking error message, such as 'Selected rider is no longer available. Please refresh the list and try again.'

### 3.3.7 Validation Notes

Simulate a rider's status changing via API while the admin UI is open. Attempt the assignment and verify the error message is shown and the order status does not change.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Admin views a list of suitable riders for manual assignment

### 3.4.3 Scenario Type

Alternative_Flow

### 3.4.4 Given

an Administrator is viewing an 'Allocation Failed' order

### 3.4.5 When

the Administrator clicks the 'Manually Assign Rider' button

### 3.4.6 Then

a modal or panel appears displaying a list of all riders who are currently 'Online' and within the operational zone of the vendor.

### 3.4.7 Validation Notes

The list should display the rider's name, their approximate distance from the vendor, and their current task load (e.g., 0 active deliveries).

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Admin actions require confirmation

### 3.5.3 Scenario Type

Usability

### 3.5.4 Given

an Administrator is viewing an 'Allocation Failed' order

### 3.5.5 When

the Administrator clicks either 'Assign Rider' or 'Cancel Order'

### 3.5.6 Then

a confirmation dialog appears asking 'Are you sure you want to [assign this rider / cancel this order]?' with 'Confirm' and 'Cancel' options.

### 3.5.7 Validation Notes

Verify that the action is only triggered after clicking 'Confirm'. This aligns with REQ-USR-001 for critical operations.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A dedicated section or filtered view in the admin dashboard for 'Allocation Failed' orders.
- A 'Manually Assign Rider' button on the failed order details view.
- A 'Cancel Order' button on the failed order details view.
- A modal/panel to display a searchable and sortable list of available riders.
- Confirmation dialogs for both assignment and cancellation actions.

## 4.2.0 User Interactions

- Admin can select a failed order to view its details.
- Admin can select a rider from a list to perform the assignment.
- The list of available riders should be refreshable to get the latest data.

## 4.3.0 Display Requirements

- The failed orders queue must show Order ID, Customer Name, Vendor Name, and time since failure.
- The rider selection list must show Rider Name, distance from vendor, and current load.
- The UI must provide clear feedback (e.g., a toast notification) upon successful assignment or cancellation.

## 4.4.0 Accessibility Needs

- All UI elements must be keyboard-navigable.
- Confirmation dialogs must trap focus.
- Buttons and interactive elements must have clear, descriptive labels for screen readers.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-001

### 5.1.2 Rule Description

Only riders with a status of 'Online' and within the vendor's operational zone can be manually assigned.

### 5.1.3 Enforcement Point

Backend API when fetching the list of available riders and upon assignment submission.

### 5.1.4 Violation Handling

The rider will not appear in the list. If an assignment is attempted via API with an invalid rider, the request will be rejected with a 400 Bad Request error.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-002

### 5.2.2 Rule Description

All manual interventions (assignment or cancellation) on failed orders must be logged in the immutable audit trail.

### 5.2.3 Enforcement Point

Backend service layer for the intervention APIs.

### 5.2.4 Violation Handling

The operation should fail if the audit log entry cannot be created, ensuring full traceability.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

SYS-003

#### 6.1.1.2 Dependency Reason

The system must first be able to identify and flag an order with the 'Allocation Failed' status.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-019

#### 6.1.2.2 Dependency Reason

The mechanism to alert administrators about failed orders must exist so they know when to intervene.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

RDR-009

#### 6.1.3.2 Dependency Reason

The system needs to track rider 'Online'/'Offline' status to provide a list of available riders for assignment.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

ADM-021

#### 6.1.4.2 Dependency Reason

The audit trail system must be implemented to log these critical administrative actions as required.

## 6.2.0.0 Technical Dependencies

- Admin Dashboard UI framework
- Order Management microservice
- Rider Logistics microservice (for rider status and location)
- Notification service (for customer/vendor/rider alerts)
- Payments microservice (for initiating refunds)

## 6.3.0.0 Data Dependencies

- Access to real-time rider status and location data.
- Access to the central order database.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API call to fetch the list of available riders for an order must respond in under 1500ms.
- The API call to process the manual assignment or cancellation must have a P95 latency of under 500ms.

## 7.2.0.0 Security

- Access to this functionality must be strictly limited to users with the 'Administrator' role (enforced via RBAC at the API Gateway).
- All actions must be logged in the audit trail with the performing admin's user ID and a timestamp, as per REQ-NFR-008.

## 7.3.0.0 Usability

- The interface for intervention should be intuitive, requiring minimal clicks to resolve an issue.
- Error messages must be clear and actionable.

## 7.4.0.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The admin dashboard interface must be fully functional on the latest versions of Chrome, Firefox, and Safari.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires coordination across multiple microservices (Orders, Riders, Notifications, Payments).
- Frontend implementation of a new dashboard view with real-time data dependencies (rider list).
- Handling potential race conditions (e.g., rider status changing during the assignment process).
- Ensuring the entire flow is transactional and auditable.

## 8.3.0.0 Technical Risks

- Latency in fetching the real-time status of riders could lead to a poor user experience for the admin.
- Failure to correctly propagate state changes and notifications across all relevant services could lead to data inconsistency.

## 8.4.0.0 Integration Points

- API call to Rider Logistics service to get online riders near a location.
- API call to Order Management service to update order status and assigned rider.
- API call to Notification service to dispatch alerts.
- API call to Payments service to trigger refunds on cancellation.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- E2E test for the full re-assignment flow: order fails allocation -> admin logs in -> finds order -> assigns rider -> rider receives task.
- E2E test for the full cancellation flow: order fails allocation -> admin logs in -> finds order -> cancels order -> customer is notified and refund is initiated.
- Integration test to verify that attempting to assign an offline rider fails correctly.
- Unit tests for the business logic within each affected microservice.

## 9.3.0.0 Test Data Needs

- A method to reliably place an order into the 'Allocation Failed' state.
- Test accounts for an Administrator, a Customer, a Vendor, and multiple Riders.
- Ability to toggle rider online/offline status during testing.

## 9.4.0.0 Testing Tools

- Cypress for E2E testing of the admin dashboard.
- Jest for unit and integration tests in the backend services.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one other engineer
- Unit and integration tests implemented with >= 80% coverage for new code
- E2E automated tests for both re-assignment and cancellation happy paths are passing
- User interface is responsive and has been reviewed for usability
- Performance of new APIs meets the specified NFRs
- All actions are confirmed to be logged correctly in the audit trail
- Feature documentation for the admin knowledge base is created or updated
- Story deployed and verified in the staging environment by QA and the Product Owner

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a critical operational feature required for launch or shortly after to ensure platform stability.
- Requires backend and frontend development effort.
- Dependencies on other stories (SYS-003, ADM-019) must be resolved before this story can be completed.

## 11.4.0.0 Release Impact

Improves the operational readiness of the platform, reducing the risk associated with the automated rider allocation system. Essential for maintaining service levels in the early stages of a launch.

