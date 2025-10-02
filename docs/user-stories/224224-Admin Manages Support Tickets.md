# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | ADM-024 |
| Elaboration Date | 2025-01-24 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Admin Manages Support Tickets |
| As A User Story | As an Administrator, I want a comprehensive suppor... |
| User Persona | Platform Administrator responsible for operations,... |
| Business Value | Improves user satisfaction and retention by provid... |
| Functional Area | Platform & Administrative Features |
| Story Theme | Communication and Support |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Admin views the main support ticket queue

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

an Administrator is logged into the admin dashboard and has permissions to manage support tickets

### 3.1.5 When

the Administrator navigates to the 'Support' or 'Tickets' section

### 3.1.6 Then

a paginated table of support tickets is displayed with columns for 'Ticket ID', 'Subject', 'User', 'Status', 'Assignee', and 'Last Updated'.

### 3.1.7 Validation Notes

Verify the API call to fetch tickets is made and the table populates correctly. Check that pagination controls are functional.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Admin filters the ticket queue by status

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

the Administrator is viewing the support ticket queue with tickets of various statuses

### 3.2.5 When

the Administrator selects 'New' from the status filter dropdown

### 3.2.6 Then

the ticket list updates to show only tickets with the status 'New'.

### 3.2.7 Validation Notes

Test filtering for each available status (New, Open, In Progress, Resolved, Closed). Ensure the filter state is maintained during pagination.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Admin opens and views a ticket's details

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

the Administrator is viewing the support ticket queue

### 3.3.5 When

the Administrator clicks on a specific ticket ID or subject

### 3.3.6 Then

they are navigated to a detailed view of that ticket, which displays the full ticket description, user details (name, role), a link to the associated order (if any), and the complete conversation history.

### 3.3.7 Validation Notes

Verify all required data points are present and accurate in the detail view. The user and order links should navigate to the correct pages.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Admin assigns a ticket to another administrator

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

the Administrator is viewing an unassigned ticket

### 3.4.5 When

they select another admin's name from the 'Assignee' dropdown and save the change

### 3.4.6 Then

the ticket's assignee is updated, and an internal note is logged in the ticket's history: 'Ticket assigned to [New Admin Name] by [Current Admin Name]'.

### 3.4.7 Validation Notes

Check that the assignee dropdown is populated with all active administrators. Verify the update is reflected in both the detail view and the main queue list.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Admin responds to a user's ticket

### 3.5.3 Scenario Type

Happy_Path

### 3.5.4 Given

the Administrator is viewing a ticket with status 'New' or 'Open'

### 3.5.5 When

they type a message into the reply box and click 'Send Reply'

### 3.5.6 Then

the message is appended to the conversation history, the ticket's 'Last Updated' timestamp is updated, the status is automatically changed to 'In Progress' (if it was 'New'), and a notification is sent to the user.

### 3.5.7 Validation Notes

Verify the message appears correctly in the UI. Check the database to confirm the new message is stored. Confirm the notification service was called with the correct payload.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Admin resolves a ticket

### 3.6.3 Scenario Type

Happy_Path

### 3.6.4 Given

the Administrator is viewing a ticket where the issue has been addressed

### 3.6.5 When

they change the ticket's status to 'Resolved' and save the change

### 3.6.6 Then

the ticket's status is updated to 'Resolved', and the reply box is disabled to prevent further comments.

### 3.6.7 Validation Notes

Verify the status change is saved and reflected in the UI. The ticket should no longer appear in the default 'Open' filter view.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Admin adds an internal note to a ticket

### 3.7.3 Scenario Type

Alternative_Flow

### 3.7.4 Given

the Administrator is viewing a ticket and needs to add a comment for other admins

### 3.7.5 When

they type a message in the 'Internal Note' text area and click 'Add Note'

### 3.7.6 Then

the note is added to the ticket's history, visibly distinct from user-facing replies (e.g., different color background), and is not sent as a notification to the user.

### 3.7.7 Validation Notes

Verify the note is visible to another logged-in admin but is not visible to the user who created the ticket.

## 3.8.0 Criteria Id

### 3.8.1 Criteria Id

AC-008

### 3.8.2 Scenario

Admin views a ticket from a deleted user

### 3.8.3 Scenario Type

Edge_Case

### 3.8.4 Given

a user has raised a ticket and their account was later deleted/anonymized

### 3.8.5 When

an Administrator views that ticket

### 3.8.6 Then

the ticket details are displayed correctly, but the user's name is shown as 'Deleted User' and any link to their profile is disabled.

### 3.8.7 Validation Notes

This requires setting up test data with an anonymized user ID linked to a ticket record.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Paginated data table for ticket list
- Filter dropdowns for 'Status' and 'Assignee'
- Search bar for Ticket ID or Subject
- Detail view with sections for ticket info, conversation history, and actions
- Dropdown for changing ticket status
- Dropdown for assigning tickets
- Text area for public replies
- Separate text area for internal notes
- 'Update'/'Save' buttons for actions

## 4.2.0 User Interactions

- Clicking a table row navigates to the detail view.
- Selecting a filter automatically refreshes the table.
- Status changes and assignments are confirmed with a save/update action.
- Conversation history should be displayed chronologically, with the newest messages at the bottom.

## 4.3.0 Display Requirements

- Ticket statuses should be color-coded for easy identification (e.g., New: Blue, In Progress: Orange, Resolved: Green).
- Internal notes must be visually distinct from public replies.
- Timestamps for all replies and status changes must be displayed.
- The user who created the ticket should be clearly identified (e.g., 'John Doe (Customer)').

## 4.4.0 Accessibility Needs

- All UI controls (buttons, dropdowns, inputs) must have accessible labels.
- The interface must be fully navigable using a keyboard.
- Color-coding for status must be supplemented with text to be accessible.
- Must comply with WCAG 2.1 Level AA standards.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-TKT-001

### 5.1.2 Rule Description

A ticket can only be assigned to an active user with the 'Administrator' role.

### 5.1.3 Enforcement Point

Backend API when processing an assignment request.

### 5.1.4 Violation Handling

The API returns an error message, and the UI displays a notification like 'Assignment failed: User is not an active administrator'.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-TKT-002

### 5.2.2 Rule Description

Once a ticket is set to 'Resolved' or 'Closed', no further public replies can be added.

### 5.2.3 Enforcement Point

The UI should disable the reply input, and the backend API should reject any new reply attempts on a resolved ticket.

### 5.2.4 Violation Handling

API returns a 403 Forbidden error with a message 'This ticket is closed and cannot be updated'.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

CUS-041

#### 6.1.1.2 Dependency Reason

The system must allow customers to raise support tickets before an admin can manage them.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

VND-030

#### 6.1.2.2 Dependency Reason

The system must allow vendors to raise support tickets before an admin can manage them.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

RDR-029

#### 6.1.3.2 Dependency Reason

The system must allow riders to raise support tickets before an admin can manage them.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

ADM-005

#### 6.1.4.2 Dependency Reason

The ticket management UI needs to link to the user management page to view user details.

## 6.2.0.0 Technical Dependencies

- A defined database schema for tickets, replies, and internal notes.
- The existing Admin authentication and authorization service (AWS Cognito).
- The platform's notification service (FCM/SNS) for sending alerts to users about replies.

## 6.3.0.0 Data Dependencies

- Access to the User database/service to fetch user details.
- Access to the Order database/service to fetch details for tickets linked to an order.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The main ticket queue page (first page) must load in under 2 seconds with 10,000+ tickets in the system.
- API response time for fetching a single ticket's details must be under 500ms.

## 7.2.0.0 Security

- Access to the entire ticket management module must be restricted to users with the 'Administrator' role.
- All data transmitted between the client and server must be encrypted via HTTPS/TLS 1.2+.
- Input validation must be performed on all text fields to prevent XSS attacks.

## 7.3.0.0 Usability

- The interface should be intuitive, allowing a new administrator to manage tickets with minimal training.
- Key actions (assign, change status, reply) should be easily accessible from the ticket detail view.

## 7.4.0.0 Accessibility

- Must adhere to WCAG 2.1 Level AA guidelines.

## 7.5.0.0 Compatibility

- The admin web dashboard must be responsive and function correctly on the latest versions of Chrome, Firefox, and Safari.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires new database schema design for tickets and conversations.
- Involves creating a new set of backend CRUD APIs with business logic for status transitions.
- Requires building a new, moderately complex UI section in the admin dashboard (list with filters + detail view).
- Integration with User, Order, and Notification services is required.

## 8.3.0.0 Technical Risks

- Potential for race conditions if two admins attempt to modify the same ticket simultaneously. Optimistic locking or a similar strategy should be considered.
- Ensuring performant database queries for filtering and searching as the number of tickets grows.

## 8.4.0.0 Integration Points

- User Service API: To fetch details of the user who created the ticket.
- Order Service API: To fetch details of an order linked to a ticket.
- Notification Service API: To send push/SMS notifications to users upon receiving a reply.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Accessibility

## 9.2.0.0 Test Scenarios

- Full lifecycle of a ticket: A test user creates a ticket, an admin assigns it, replies, adds an internal note, and resolves it. Verify all state changes and notifications.
- Test all filter combinations on the ticket queue.
- Verify role-based access control: A non-admin user attempting to access the ticket management URL should be denied.
- Test edge case of a ticket linked to a deleted user or a cancelled order.

## 9.3.0.0 Test Data Needs

- A set of admin users.
- Tickets created by different user types (Customer, Vendor, Rider).
- Tickets with and without associated order IDs.
- A ticket associated with an anonymized user.

## 9.4.0.0 Testing Tools

- Jest and React Testing Library for frontend unit/integration tests.
- Cypress for end-to-end testing.
- Postman or similar for API-level testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one other engineer
- Unit and integration tests implemented with >= 80% code coverage as per REQ-NFR-006
- End-to-end automated test for the primary ticket lifecycle scenario is passing
- User interface is responsive and has been reviewed for usability and accessibility (WCAG 2.1 AA)
- Performance requirements for page and API load times are verified
- Security requirements (RBAC, input validation) are validated
- API documentation (OpenAPI) for the new ticket endpoints is created or updated
- Story deployed and verified in the staging environment by QA

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational feature for platform support. The prerequisite stories for ticket creation must be completed first.
- Requires both frontend and backend development effort, which should be coordinated.

## 11.4.0.0 Release Impact

Enables the operational team to begin managing user support requests, which is critical for launch and post-launch phases.

