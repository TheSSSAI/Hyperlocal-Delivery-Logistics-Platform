# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | VND-018 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Vendor Selects Estimated Preparation Time After Ac... |
| As A User Story | As a Vendor, I want to select an estimated prepara... |
| User Persona | Vendor (Store manager or staff responsible for pro... |
| Business Value | Improves customer satisfaction by setting accurate... |
| Functional Area | Vendor Order Management |
| Story Theme | Order Fulfillment Workflow |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Happy Path: Vendor accepts an order and selects a preparation time

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a vendor is logged into the vendor dashboard and has a new incoming order with an 'Accept' action available

### 3.1.5 When

the vendor clicks the 'Accept' button for the new order

### 3.1.6 Then

a modal dialog must appear, prompting the vendor to select an 'Estimated Preparation Time' from a list of options, and the vendor must select one of the provided options and click 'Confirm'.

### 3.1.7 Validation Notes

Verify the modal appears. Verify the options are present. Verify the selection and confirmation updates the order status to 'Preparing', saves the selected time against the order record, and closes the modal.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

System uses administrator-configured time options

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

an administrator has configured the preparation time options as '10-15 min', '15-20 min', and '20-30 min' in the backend (as per REQ-FUN-010)

### 3.2.5 When

the vendor accepts an order and the preparation time modal is displayed

### 3.2.6 Then

the modal must display exactly the options configured by the administrator.

### 3.2.7 Validation Notes

Test by changing the admin configuration and ensuring the vendor-facing modal reflects the changes on the next order acceptance.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Customer receives updated ETA after preparation time is selected

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

a vendor has accepted an order and selected an estimated preparation time

### 3.3.5 When

the system successfully processes the selection

### 3.3.6 Then

the system must trigger a notification to the customer with an updated ETA that incorporates the selected preparation time, and the customer's order tracking screen must reflect the new ETA.

### 3.3.7 Validation Notes

Requires integration testing. Verify a notification is sent and the customer-facing app UI updates correctly.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Selection is mandatory to proceed

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

the 'Select Preparation Time' modal is displayed

### 3.4.5 When

the vendor attempts to click the 'Confirm' button without selecting a time option

### 3.4.6 Then

the 'Confirm' button must be disabled or inactive, and the vendor cannot proceed until a selection is made.

### 3.4.7 Validation Notes

Check the initial state of the 'Confirm' button. It should only become active after a time option is selected.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Network error during submission

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

the vendor has selected a preparation time and clicks 'Confirm'

### 3.5.5 When

the API call to update the order fails due to a network error

### 3.5.6 Then

the modal must remain open, display a clear error message (e.g., 'Failed to update order. Please try again.'), and provide a mechanism to retry the submission. The order status must not change to 'Preparing'.

### 3.5.7 Validation Notes

Use browser developer tools or a proxy to simulate a failed API request and verify the UI handles the error state gracefully.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Order state transition is logged

### 3.6.3 Scenario Type

Happy_Path

### 3.6.4 Given

a vendor has successfully selected a preparation time for an order

### 3.6.5 When

the order status transitions to 'Preparing'

### 3.6.6 Then

an entry must be created in the immutable order event log capturing the timestamp, the new state ('Preparing'), the actor (vendor), and the selected preparation time value.

### 3.6.7 Validation Notes

Check the database or an admin view of the order event log to confirm the new entry is present and accurate.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Modal dialog for time selection
- List of selectable time options (e.g., radio buttons or styled buttons)
- A 'Confirm' button within the modal

## 4.2.0 User Interactions

- Clicking 'Accept' on an order triggers the modal.
- The modal must be blocking, preventing interaction with the rest of the dashboard until a selection is confirmed.
- Selecting a time option should provide clear visual feedback (e.g., highlighting).
- The 'Confirm' button is disabled until a time option is selected.

## 4.3.0 Display Requirements

- The modal must have a clear title, such as 'Select Estimated Preparation Time'.
- The time options must be clearly legible.
- Error messages for failed submissions must be displayed within the modal.

## 4.4.0 Accessibility Needs

- The modal should be keyboard navigable.
- Time options should be selectable using the spacebar or enter key.
- The modal should trap focus to comply with WCAG 2.1 standards.

# 5.0.0 Business Rules

- {'rule_id': 'BR-VND-018-01', 'rule_description': 'A vendor must provide an estimated preparation time to successfully accept an order.', 'enforcement_point': 'During the order acceptance workflow in the Vendor Dashboard.', 'violation_handling': "The user is prevented from completing the 'Accept Order' action until a time is selected. The UI enforces this by disabling the confirmation action."}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

VND-017

#### 6.1.1.2 Dependency Reason

This story defines the action that immediately precedes and triggers the functionality described here. The 'Accept' button must exist before this modal flow can be implemented.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-015

#### 6.1.2.2 Dependency Reason

The list of preparation time options displayed to the vendor is managed by an administrator. The backend mechanism to store and retrieve these options must exist.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

CUS-030

#### 6.1.3.2 Dependency Reason

This story's successful completion triggers a notification to the customer. The notification system must be in place to consume the event and deliver the message.

## 6.2.0.0 Technical Dependencies

- Backend API endpoint to accept an order which takes the preparation time as a parameter.
- Order database schema must have a field to store the selected preparation time.
- An event bus (e.g., AWS SQS/SNS) to publish an `OrderAcceptedWithPrepTime` event for downstream consumers like the notification service.

## 6.3.0.0 Data Dependencies

- Requires access to the administrator-configured list of preparation time options.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API call to accept the order and save the preparation time should have a P95 latency of under 200ms, as per REQ-NFR-001.
- The modal dialog should render in under 200ms after the 'Accept' button is clicked.

## 7.2.0.0 Security

- The API endpoint must validate that the vendor making the request is the owner of the store to which the order belongs.

## 7.3.0.0 Usability

- The process of selecting a time should require a minimal number of clicks (ideally two: one to select, one to confirm).
- The options should be presented clearly to avoid ambiguity.

## 7.4.0.0 Accessibility

- The modal and its contents must be compliant with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The feature must function correctly on all supported modern web browsers for the Vendor Dashboard.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Low

## 8.2.0.0 Complexity Factors

- Requires frontend modal implementation.
- Requires a minor change to the existing 'Accept Order' backend logic to include a new parameter.
- Requires publishing an event for customer notification.

## 8.3.0.0 Technical Risks

- Potential for race conditions if the vendor has the dashboard open on multiple tabs/devices. The backend should handle this by ensuring an order can only be accepted once.

## 8.4.0.0 Integration Points

- Vendor Dashboard Frontend
- Order Management Service (Backend)
- Notification Service (to inform the customer)
- Database (Order table and Order Event Log table)

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E

## 9.2.0.0 Test Scenarios

- Verify modal appears with correct, admin-configured options.
- Verify confirm button is disabled by default and enabled upon selection.
- Verify successful submission updates order status and saves the time.
- Verify customer receives a notification with an updated ETA.
- Verify API failure is handled gracefully in the UI.
- Verify the action is logged in the order event log.

## 9.3.0.0 Test Data Needs

- A test vendor account.
- A new order assigned to the test vendor.
- Configured preparation time options in the database.

## 9.4.0.0 Testing Tools

- Jest & React Testing Library (Frontend Unit/Integration)
- Jest (Backend Unit/Integration)
- Cypress (End-to-End)

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >= 80% coverage and passing
- End-to-end tests for the user flow are created and passing
- User interface reviewed for usability and accessibility compliance
- Performance of the API endpoint is verified to be within SLOs
- Security checks (e.g., authorization) are implemented and tested
- Relevant API documentation (OpenAPI) is updated
- Story deployed and verified in the staging environment without regressions

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

3

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is tightly coupled with 'VND-017: Vendor Accepts a New Order' and should be developed in the same sprint, or immediately after.
- Backend work for 'ADM-015' (storing/retrieving time options) is a prerequisite and must be completed first, even if the admin UI for it is not.

## 11.4.0.0 Release Impact

This is a core feature of the vendor's order fulfillment workflow and is essential for the initial platform launch.

