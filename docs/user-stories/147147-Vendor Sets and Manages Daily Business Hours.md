# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | VND-006 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Vendor Sets and Manages Daily Business Hours |
| As A User Story | As a vendor, I want to define and manage my store'... |
| User Persona | A registered and approved Vendor user responsible ... |
| Business Value | Automates store availability, preventing unfulfill... |
| Functional Area | Vendor Management |
| Story Theme | Store Profile & Operations |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Vendor sets standard business hours for a single day

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

The vendor is logged into the vendor dashboard and is on the 'Business Hours' settings page

### 3.1.5 When

the vendor sets Monday's hours to 9:00 AM - 5:00 PM and clicks 'Save Changes'

### 3.1.6 Then

the system successfully saves the hours for Monday, a success notification is displayed, and when the page is reloaded, the saved hours are correctly shown.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Vendor marks a day as closed

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

The vendor is on the 'Business Hours' settings page

### 3.2.5 When

the vendor toggles Sunday to 'Closed' and clicks 'Save Changes'

### 3.2.6 Then

the system saves Sunday's status as closed, and customers cannot place orders from this vendor on Sundays.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Vendor sets multiple time slots for a single day (e.g., for a lunch break)

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

The vendor is on the 'Business Hours' settings page

### 3.3.5 When

the vendor sets Tuesday's hours to 10:00 AM - 2:00 PM, adds a second time slot, sets it to 5:00 PM - 9:00 PM, and clicks 'Save Changes'

### 3.3.6 Then

the system saves both time slots for Tuesday, and the store is shown as open only during these two periods.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

System prevents saving invalid time ranges (closing time before opening time)

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

The vendor is on the 'Business Hours' settings page

### 3.4.5 When

the vendor attempts to set Wednesday's hours to 7:00 PM - 11:00 AM and clicks 'Save Changes'

### 3.4.6 Then

the system prevents saving, displays an inline validation error message 'Closing time must be after opening time', and the 'Save Changes' button may become disabled until the error is corrected.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

System prevents saving overlapping time slots for the same day

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

The vendor has set a time slot for Thursday from 9:00 AM to 5:00 PM

### 3.5.5 When

the vendor adds a second time slot and attempts to set it to 4:00 PM - 8:00 PM and clicks 'Save Changes'

### 3.5.6 Then

the system prevents saving and displays an inline validation error message 'Time slots cannot overlap'.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Customer view reflects store as 'Open' during business hours

### 3.6.3 Scenario Type

Happy_Path

### 3.6.4 Given

a vendor has set their Friday hours to 10:00 AM - 8:00 PM and their master availability switch is 'Online'

### 3.6.5 When

a customer views the vendor's store page on the mobile app at 3:00 PM IST on a Friday

### 3.6.6 Then

the store is displayed as 'Open' and the customer is able to add items to their cart and proceed to checkout.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Customer view reflects store as 'Closed' outside business hours

### 3.7.3 Scenario Type

Edge_Case

### 3.7.4 Given

a vendor has set their Friday hours to 10:00 AM - 8:00 PM

### 3.7.5 When

a customer views the vendor's store page on the mobile app at 9:00 PM IST on a Friday

### 3.7.6 Then

the store is displayed as 'Closed', and the 'add to cart' functionality is disabled for that store's products.

## 3.8.0 Criteria Id

### 3.8.1 Criteria Id

AC-008

### 3.8.2 Scenario

Master 'Offline' switch overrides the daily schedule

### 3.8.3 Scenario Type

Alternative_Flow

### 3.8.4 Given

a vendor has set their Saturday hours to 10:00 AM - 8:00 PM

### 3.8.5 When

the vendor sets their master availability switch to 'Offline' at 11:00 AM on Saturday

### 3.8.6 Then

the store immediately appears as 'Closed' to all customers, overriding the scheduled hours.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A list of all 7 days of the week (e.g., Monday-Sunday).
- For each day, a primary toggle/checkbox to mark the day as 'Open' or 'Closed'.
- When a day is 'Open', one or more pairs of time-picker inputs for 'Opening Time' and 'Closing Time'.
- An 'Add time slot' button for each day to add an additional pair of time inputs.
- A 'Remove' icon/button next to each time slot (except the first one) to delete it.
- A single 'Save Changes' button for the entire form.
- Inline error message containers next to time inputs for validation feedback.

## 4.2.0 User Interactions

- Toggling a day to 'Closed' should disable/hide the time input fields for that day.
- The 'Save Changes' button should be disabled by default and only become enabled when there are unsaved changes.
- Time pickers should present a user-friendly way to select time, preferably in 15 or 30-minute increments.
- Upon successful save, a non-intrusive success notification (e.g., a toast message) should appear briefly.

## 4.3.0 Display Requirements

- All times should be clearly indicated as being in the IST timezone, as per REQ-INT-005.
- The current saved hours should be pre-populated when the page loads.

## 4.4.0 Accessibility Needs

- All form controls (toggles, time pickers, buttons) must be fully keyboard accessible.
- All controls must have appropriate labels and ARIA attributes for screen reader compatibility, adhering to WCAG 2.1 Level AA (REQ-INT-001).

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-VND-HOURS-01

### 5.1.2 Rule Description

A closing time for a time slot must be chronologically after its opening time.

### 5.1.3 Enforcement Point

Client-side validation on the vendor dashboard and server-side validation upon form submission.

### 5.1.4 Violation Handling

Prevent form submission and display a clear, user-friendly error message to the vendor.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-VND-HOURS-02

### 5.2.2 Rule Description

Multiple time slots for the same day cannot overlap.

### 5.2.3 Enforcement Point

Client-side and server-side validation upon form submission.

### 5.2.4 Violation Handling

Prevent form submission and display an error message indicating which time slots are in conflict.

## 5.3.0 Rule Id

### 5.3.1 Rule Id

BR-VND-HOURS-03

### 5.3.2 Rule Description

The master availability switch (REQ-FUN-012) overrides the configured business hours. If the switch is 'Offline', the store is closed regardless of the schedule.

### 5.3.3 Enforcement Point

In the system service that determines a vendor's current availability status.

### 5.3.4 Violation Handling

N/A - This is a rule of precedence.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

VND-005

#### 6.1.1.2 Dependency Reason

This functionality is a core part of the vendor's store profile management and will likely reside within that UI section.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

VND-007

#### 6.1.2.2 Dependency Reason

The interaction and precedence between the master availability switch and the business hours schedule must be clearly defined and implemented together.

## 6.2.0.0 Technical Dependencies

- A backend API endpoint to GET and PUT/POST business hours data.
- A database schema capable of storing multiple time ranges per day per vendor.
- A robust, centralized system service/logic to determine a vendor's real-time availability status based on the schedule, master switch, and current time (IST).

## 6.3.0.0 Data Dependencies

- Requires a valid `vendor_id` to associate the hours with a store.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API endpoint for saving business hours must have a P95 latency of under 500ms.
- The system service that checks for vendor availability must be highly performant as it will be queried frequently during product discovery and checkout processes.

## 7.2.0.0 Security

- Only the authenticated vendor (or an Administrator) can modify the business hours for a store. This must be enforced at the API level via RBAC (REQ-NFR-003).

## 7.3.0.0 Usability

- The interface for setting hours must be intuitive and minimize the chance of user error through the use of time pickers and clear validation.

## 7.4.0.0 Accessibility

- The vendor dashboard interface must comply with WCAG 2.1 Level AA standards (REQ-INT-001).

## 7.5.0.0 Compatibility

- The vendor web dashboard must be responsive and function correctly on all modern web browsers.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- The frontend state management for a dynamic form with multiple, nested, and validated fields.
- The backend logic for validating non-overlapping time slots.
- The design of an efficient, system-wide service to determine vendor availability, which will be a high-traffic query.
- Correct handling of timezones (even if only IST initially) and edge cases like midnight transitions.

## 8.3.0.0 Technical Risks

- An inefficient implementation of the vendor availability check could become a performance bottleneck for the entire platform.
- Poor client-side validation could lead to a frustrating user experience for vendors.

## 8.4.0.0 Integration Points

- Vendor Profile Service (to store/retrieve hours).
- Product Discovery/Search Service (to filter out closed vendors).
- Order Management Service (to perform a final availability check before order placement).

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Usability
- Accessibility

## 9.2.0.0 Test Scenarios

- Verify all acceptance criteria.
- Test time boundary conditions: e.g., a customer trying to order exactly at closing time or opening time.
- Test midnight crossover: e.g., hours set from 10:00 PM to 2:00 AM.
- Test the interaction with the master availability switch in all states.
- Test form submission with no changes made (Save button should be inactive).

## 9.3.0.0 Test Data Needs

- Vendor accounts with no hours set.
- Vendor accounts with hours set for all days, including multiple slots and closed days.
- Test cases timed to run during and outside of the configured business hours.

## 9.4.0.0 Testing Tools

- Jest and React Testing Library for frontend unit/integration tests.
- Cypress for E2E testing.
- Postman/Insomnia for API-level testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration test coverage meets the 80% project standard (REQ-NFR-006)
- E2E tests covering the vendor setting hours and the customer seeing the correct status are implemented and passing
- User interface has been reviewed for usability and responsiveness
- Accessibility audit (automated and manual) passed against WCAG 2.1 AA
- API performance meets latency requirements under simulated load
- Security checks confirm that only authorized users can modify settings
- Relevant documentation (e.g., API spec, user guide) has been updated
- Story deployed and verified in the staging environment by QA

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational feature for vendor self-service and platform reliability. It should be prioritized before enabling widespread customer ordering.
- Requires both frontend and backend development effort that can be parallelized after the API contract is defined.

## 11.4.0.0 Release Impact

- Enables the automation of store availability, a critical feature for launch. Without this, vendors would have to manually toggle their store on/off daily, which is not scalable.

