# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-027 |
| Elaboration Date | 2025-01-24 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider Downloads Weekly Earnings Statements in PDF ... |
| As A User Story | As a Rider, I want to select a specific weekly pay... |
| User Persona | A registered and active Rider who completes delive... |
| Business Value | Increases rider trust, satisfaction, and retention... |
| Functional Area | Rider Financial Management |
| Story Theme | Rider Earnings & Payouts |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Rider views the list of available weekly statements

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a rider is logged into the mobile application and navigates to the 'Earnings' section

### 3.1.5 When

the rider selects the 'Statements' tab or option

### 3.1.6 Then

the system displays a list of completed weekly pay periods in reverse chronological order (most recent first). Each list item must show the date range (e.g., 'Oct 23 - Oct 29, 2023') and the corresponding Net Payout amount.

### 3.1.7 Validation Notes

Verify the list is correctly sorted and displays the correct date ranges and payout amounts as per the settlement records.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Rider successfully downloads a statement

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

the rider is viewing the list of weekly statements

### 3.2.5 When

the rider taps the 'Download' icon for a specific week

### 3.2.6 Then

the system generates a PDF file, prompts the rider to save it, and a confirmation message (e.g., 'Statement saved to Downloads') is displayed upon successful completion. The filename must be standardized: `Earnings_Statement_[RiderID]_[StartDate]_to_[EndDate].pdf`.

### 3.2.7 Validation Notes

Test on both iOS and Android to confirm the file is saved correctly in the device's standard file storage location.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Verify the content and structure of the downloaded PDF statement

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

a rider has successfully downloaded an earnings statement PDF

### 3.3.5 When

the rider opens the PDF file

### 3.3.6 Then

the document must contain: 1. Platform logo and 'Weekly Earnings Statement' title. 2. Rider's full name and ID. 3. The statement's date range. 4. A summary section with Total Delivery Fees, Total Tips, Gross Earnings, and Net Payout. 5. An itemized list of all deliveries for the period with Date, Order ID, Fee, and Tip. 6. A COD summary showing Total COD Collected. 7. A footer with the generation date and page numbers.

### 3.3.7 Validation Notes

Manually verify the content of a generated PDF against a test rider's known weekly data to ensure all financial figures are 100% accurate.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Rider attempts to download with no network connection

### 3.4.3 Scenario Type

Error_Condition

### 3.4.4 Given

the rider is viewing the list of weekly statements and their device has no internet connectivity

### 3.4.5 When

the rider taps the 'Download' icon

### 3.4.6 Then

the system displays a user-friendly error message, such as 'Download failed. Please check your internet connection and try again.'

### 3.4.7 Validation Notes

Simulate network loss and ensure the app handles the API call failure gracefully without crashing.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Rider denies storage permissions

### 3.5.3 Scenario Type

Error_Condition

### 3.5.4 Given

the rider's app does not have permission to write to device storage

### 3.5.5 When

the rider taps the 'Download' icon for the first time

### 3.5.6 Then

the operating system prompts the user to grant storage permissions. If denied, the app displays a message explaining that the permission is required to save the statement.

### 3.5.7 Validation Notes

Test the full permission request flow: request, grant, deny. Ensure the app does not crash if permission is permanently denied.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

New rider with no completed pay periods views the statements screen

### 3.6.3 Scenario Type

Edge_Case

### 3.6.4 Given

a newly registered rider who has not yet completed a weekly settlement cycle navigates to the 'Statements' screen

### 3.6.5 When

the screen loads

### 3.6.6 Then

a message is displayed indicating no statements are available yet, such as 'Your first weekly statement will be available after your first pay period is complete.'

### 3.6.7 Validation Notes

Use a test account with no settlement history to verify this empty state.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Backend fails to generate the PDF

### 3.7.3 Scenario Type

Error_Condition

### 3.7.4 Given

the rider attempts to download a statement

### 3.7.5 When

the backend service encounters an internal error and fails to generate the PDF

### 3.7.6 Then

the API returns a 5xx error, and the mobile app displays a generic error message like 'Could not generate your statement at this time. Please try again later.'

### 3.7.7 Validation Notes

Mock a server-side error response to ensure the client-side handles it correctly and logs the failure event.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A list view to display weekly periods
- A 'Download' icon/button for each list item
- A loading indicator/spinner shown during PDF generation
- A toast/snackbar for success or failure notifications
- Standard OS permission request dialogs
- An empty state message for new riders

## 4.2.0 User Interactions

- User taps on a 'Download' button to initiate the process.
- User scrolls through the list of past statements.
- User interacts with the native OS file-saving prompt.

## 4.3.0 Display Requirements

- Statement list must clearly show the date range and net payout for each week.
- Error messages must be clear and actionable.
- The generated PDF must be professionally formatted and easy to read on a mobile screen.

## 4.4.0 Accessibility Needs

- The 'Download' button must have a proper accessibility label (e.g., 'Download statement for week of...').
- The list of statements must be navigable using screen readers.

# 5.0.0 Business Rules

- {'rule_id': 'BR-RDR-STMT-01', 'rule_description': 'Statements can only be generated for weekly periods that have been fully settled and closed.', 'enforcement_point': "Backend API - The service will only list and generate statements for weeks where the settlement status is 'Completed'.", 'violation_handling': 'Requests for unsettled periods will be rejected with an appropriate error code.'}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-026

#### 6.1.1.2 Dependency Reason

This story relies on the existence of the detailed earnings data and calculation logic that RDR-026 implements. The data source is the same.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

SYS-006

#### 6.1.2.2 Dependency Reason

The concept of a 'weekly settlement' must be implemented by the system. This story generates statements based on the output of that settlement process.

## 6.2.0.0 Technical Dependencies

- A backend microservice ('Payments & Settlements') capable of aggregating financial data.
- A server-side PDF generation library (e.g., Puppeteer, pdfkit).
- Mobile client libraries for handling file downloads and storage permissions (e.g., React Native FS).

## 6.3.0.0 Data Dependencies

- Access to an immutable, audited table of settled rider transactions, including fees, tips, and COD collections.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The API response time for generating and starting the download of a typical weekly statement (50-100 line items) should be under 5 seconds.

## 7.2.0.0 Security

- The API endpoint for downloading statements must be secured via JWT authentication and authorization, ensuring a rider can only access their own data.
- The generated PDF should not contain overly sensitive PII (e.g., no home address, bank account number).

## 7.3.0.0 Usability

- The download process should be intuitive, requiring minimal taps.
- The user must receive clear feedback on the status of the download (in-progress, success, failure).

## 7.4.0.0 Accessibility

- The feature must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The download functionality must be compatible with the last two major versions of iOS and Android.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Backend: PDF generation can be CPU/memory intensive and requires careful implementation and templating.
- Backend: Data aggregation logic must be accurate and performant.
- Frontend: Handling file system permissions and downloads across different Android (Scoped Storage) and iOS versions can be complex.
- The PDF layout must be designed to be readable and well-formatted.

## 8.3.0.0 Technical Risks

- Performance bottlenecks in the PDF generation service under high load.
- Inconsistencies in file saving behavior across different mobile OS versions and device manufacturers.
- Ensuring 100% data accuracy between the statement and the actual payout.

## 8.4.0.0 Integration Points

- Rider Mobile App -> API Gateway -> Payments & Settlements Microservice
- Payments & Settlements Microservice -> PostgreSQL Database (Transaction Records)

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Performance
- Security

## 9.2.0.0 Test Scenarios

- Verify PDF content for a rider with a normal week of activity.
- Verify PDF content for a rider with zero deliveries in a week.
- Verify PDF content for a rider with only COD orders.
- Test download failure due to network loss mid-download.
- Test the full lifecycle of denying, then granting storage permissions.

## 9.3.0.0 Test Data Needs

- Test rider accounts with varying transaction histories: no activity, low activity, high activity, COD-only orders, tip-heavy orders.

## 9.4.0.0 Testing Tools

- Jest (Unit/Integration), Cypress (E2E), Postman (API Testing), Physical mobile devices for manual verification.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented for backend logic with >80% coverage
- E2E test script automated for the download happy path
- PDF template and content reviewed and approved by the Product Owner
- Performance of the generation endpoint benchmarked and meets requirements
- Security review passed for the API endpoint
- Documentation for the new API endpoint created/updated in OpenAPI spec
- Story deployed and verified in the staging environment on both iOS and Android

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🟡 Medium

## 11.3.0.0 Sprint Considerations

- The PDF template design should be finalized early in the sprint to avoid blocking development.
- Backend and frontend tasks can be parallelized once the API contract is defined.

## 11.4.0.0 Release Impact

This is a significant feature for improving rider satisfaction and should be highlighted in release notes for the rider app.

