# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-029 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider Raises a Support Ticket |
| As A User Story | As a Rider, I want to create, submit, and track a ... |
| User Persona | A registered and active Rider using the rider-faci... |
| Business Value | Provides a structured and trackable channel for ri... |
| Functional Area | Rider Support & Communication |
| Story Theme | User and Platform Support |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Happy Path: Rider submits a ticket related to a specific order

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am a logged-in rider on the 'Help & Support' screen

### 3.1.5 When

I select the option to 'Raise a New Ticket', choose a specific past order from a list, select a relevant category (e.g., 'Delivery Issue'), provide a detailed description, and tap 'Submit'

### 3.1.6 Then

The system validates the input, creates a new support ticket associated with my rider ID and the selected order ID, and I see a success confirmation message on the screen with a unique ticket ID (e.g., 'Success! Your ticket #TKT-12345 has been created.')

### 3.1.7 Validation Notes

Verify in the backend database that a new ticket record is created with the correct rider_id, order_id, category, description, and an initial status of 'Open'. The response from the API should be under 2 seconds.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Happy Path: Rider submits a general ticket not related to an order

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

I am a logged-in rider on the 'Raise a New Ticket' screen

### 3.2.5 When

I choose 'General Inquiry' or a similar option instead of selecting an order, select a category like 'App Problem', provide a description, and tap 'Submit'

### 3.2.6 Then

The system creates a new support ticket associated with my rider ID (without an order ID), and I see a success confirmation message with a unique ticket ID.

### 3.2.7 Validation Notes

Verify in the backend that a new ticket record is created with the correct rider_id and a NULL or empty order_id field.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Happy Path: Rider attaches a file to the support ticket

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

I am creating a new support ticket

### 3.3.5 When

I tap an 'Attach File' button, select an image (e.g., a screenshot) from my phone's gallery, and submit the ticket

### 3.3.6 Then

The ticket is created successfully, and the image is uploaded and associated with the ticket record.

### 3.3.7 Validation Notes

Verify the file is successfully uploaded to the designated S3 bucket and the ticket record in the database contains a reference to the file's location. The administrator viewing the ticket must be able to access and view the attachment.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Error Condition: Rider submits a ticket with missing required fields

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

I am on the 'Raise a New Ticket' screen

### 3.4.5 When

I attempt to submit the ticket without selecting a category or entering a description

### 3.4.6 Then

The app displays a user-friendly error message highlighting the required fields (e.g., 'Please select a category and provide a description.') and the ticket is not submitted.

### 3.4.7 Validation Notes

Check that no API call is made if client-side validation fails. If server-side validation fails, ensure a 4xx error code is returned with a clear error message in the response body.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Edge Case: Rider loses internet connectivity during submission

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

I have filled out the support ticket form completely and my device is offline

### 3.5.5 When

I tap the 'Submit' button

### 3.5.6 Then

The app displays an informative message (e.g., 'No internet connection. Please check your connection and try again.') and the data entered in the form is preserved for when connectivity is restored.

### 3.5.7 Validation Notes

Simulate offline mode using device settings or network throttling tools. Verify that form state is maintained after the failed submission attempt.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Alternative Flow: Rider views their list of submitted tickets

### 3.6.3 Scenario Type

Alternative_Flow

### 3.6.4 Given

I am a logged-in rider and have previously submitted one or more support tickets

### 3.6.5 When

I navigate to the 'My Tickets' or 'Support History' screen

### 3.6.6 Then

I see a list of all my tickets, sorted with the most recent at the top, displaying the Ticket ID, Category/Subject, and current Status (e.g., 'Open', 'In Progress', 'Resolved').

### 3.6.7 Validation Notes

Verify the API endpoint for fetching tickets returns only the tickets belonging to the authenticated rider and that the list is correctly rendered in the UI.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A 'Help & Support' entry point in the main navigation menu or profile screen.
- A 'Raise New Ticket' button.
- A form with a dropdown for 'Category' (pre-populated with options like 'Delivery Issue', 'Payment Discrepancy', 'App Problem', 'Account Inquiry').
- An optional field/selector to associate the ticket with a recent order.
- A multi-line text area for the 'Description'.
- An 'Attach File' button that opens the device's file/photo picker.
- A 'Submit' button.
- A screen to list all of the rider's past and open tickets ('My Tickets').

## 4.2.0 User Interactions

- Tapping 'Submit' triggers validation and an API call.
- A loading indicator is shown while the ticket is being submitted.
- A success or error message is displayed in a modal or toast notification after the submission attempt.
- Tapping on a ticket in the 'My Tickets' list navigates to a read-only detail view of that ticket and any responses from support.

## 4.3.0 Display Requirements

- The ticket form must clearly indicate which fields are required.
- The 'My Tickets' list must show Ticket ID, Category, and Status for each ticket.
- The success message must display the newly created Ticket ID for the rider's reference.

## 4.4.0 Accessibility Needs

- All form fields must have clear labels.
- Buttons and interactive elements must have sufficient touch target size.
- The UI must be compatible with screen readers, adhering to WCAG 2.1 Level AA guidelines.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-SUP-001

### 5.1.2 Rule Description

A rider can only view and interact with support tickets they have created.

### 5.1.3 Enforcement Point

Backend API (service layer).

### 5.1.4 Violation Handling

The API will return a 403 Forbidden or 404 Not Found error if a rider attempts to access a ticket ID not associated with their account.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-SUP-002

### 5.2.2 Rule Description

File attachments must be of a supported type (e.g., JPG, PNG, PDF) and not exceed a configured size limit (e.g., 5MB).

### 5.2.3 Enforcement Point

Backend API (file upload handler).

### 5.2.4 Violation Handling

The API will reject the file upload and return a 400 Bad Request error with a message explaining the reason (e.g., 'Invalid file type' or 'File size exceeds 5MB limit').

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-004

#### 6.1.1.2 Dependency Reason

Rider must be authenticated to create a ticket associated with their account.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-024

#### 6.1.2.2 Dependency Reason

A backend interface for administrators to view, manage, and respond to tickets is required for this feature to be functional and provide value. This story and ADM-024 should be developed in parallel or in close succession.

## 6.2.0.0 Technical Dependencies

- A backend 'Support' microservice with APIs to create and retrieve tickets.
- Database schema for storing tickets, ticket updates, and attachment metadata.
- Cloud object storage (e.g., AWS S3) for storing file attachments securely.
- Authentication service (e.g., AWS Cognito) to validate the rider's identity from the JWT.

## 6.3.0.0 Data Dependencies

- Access to the rider's order history is needed to allow them to associate a ticket with a specific order.

## 6.4.0.0 External Dependencies

- None, assuming the helpdesk module is built in-house as per REQ-FUN-020. If a third-party system like Zendesk were used, this would be a critical external dependency.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API response time for ticket submission must be under 2 seconds (P95).
- The 'My Tickets' list should load in under 1.5 seconds for a rider with up to 100 tickets.

## 7.2.0.0 Security

- All communication between the app and the backend must be over HTTPS/TLS 1.2+.
- Uploaded files must be scanned for malware upon upload.
- Access to attachments must be restricted via pre-signed URLs or a similar mechanism to ensure only authorized users (the rider and support admins) can view them.
- Input validation must be performed on all fields to prevent injection attacks (XSS, etc.).

## 7.3.0.0 Usability

- The process of raising a ticket should be completable in 3-4 steps.
- Error messages must be clear and actionable for the user.

## 7.4.0.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The feature must function correctly on the supported versions of iOS and Android for the Rider application.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires full-stack development: new UI screens in the React Native app, new backend APIs, and new database tables.
- Implementation of secure file upload and storage logic adds complexity.
- Requires integration with the authentication service and the order management service.
- Coordination with the development of the admin-facing ticket management feature (ADM-024) is crucial.

## 8.3.0.0 Technical Risks

- Handling large file uploads on mobile devices with varying network conditions can be challenging.
- Ensuring the ticket categorization is comprehensive enough to be useful but not so complex it confuses the rider.

## 8.4.0.0 Integration Points

- Authentication Service: To identify the rider creating the ticket.
- Order Service: To fetch the rider's order history and validate order IDs.
- Notification Service: To potentially send a push notification/SMS to the rider confirming ticket creation.
- Admin Backend: The created tickets must be consumable by the admin interface.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Security
- Usability

## 9.2.0.0 Test Scenarios

- Verify ticket creation with and without an associated order.
- Verify ticket creation with and without a file attachment.
- Test file upload with various supported and unsupported file types and sizes.
- Test form submission with invalid/missing data.
- Test the feature's behavior in an offline or poor network scenario.
- E2E Test: A rider creates a ticket, and an admin can view that same ticket in their dashboard.

## 9.3.0.0 Test Data Needs

- Test rider accounts with varying numbers of past orders (0, 1, 10+).
- Test rider accounts with and without existing support tickets.
- Sample files of different types (JPG, PNG) and sizes (small, large, oversized) for attachment testing.

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for frontend unit tests.
- Postman or similar for API testing.
- Cypress for E2E testing.
- Device farm or physical devices for manual UI/UX testing.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code for both frontend and backend has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve the required code coverage (e.g., 80%).
- E2E tests covering the critical paths are passing.
- The feature has been successfully tested against the admin-facing ticket management story (ADM-024).
- Security checks, including validation of file upload handling, have been performed.
- UI has been reviewed for usability and adherence to design specifications.
- API documentation (OpenAPI) for the new endpoints is created/updated.
- The feature is deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is highly dependent on ADM-024 (Admin Manages Support Tickets). Both stories should be planned for the same sprint or in consecutive sprints to deliver value.
- Backend API development should be prioritized to unblock both this story and ADM-024.

## 11.4.0.0 Release Impact

This is a key feature for rider support and satisfaction. Its inclusion in a release significantly improves the platform's operational maturity.

