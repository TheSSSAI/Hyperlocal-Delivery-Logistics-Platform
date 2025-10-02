# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | ADM-026 |
| Elaboration Date | 2025-01-24 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Admin Generates and Exports Platform Performance R... |
| As A User Story | As a Platform Administrator, I want to generate, v... |
| User Persona | The Platform Administrator is responsible for the ... |
| Business Value | Provides critical business intelligence to identif... |
| Functional Area | Administration & Reporting |
| Story Theme | Platform Analytics and Business Intelligence |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Admin accesses the main reports dashboard

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

the administrator is logged into the admin dashboard

### 3.1.5 When

they navigate to the 'Reports' section from the main menu

### 3.1.6 Then

the system displays a dashboard with options to generate 'Sales Report', 'Delivery Performance Report', and 'User Activity Report'.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Admin generates a Sales Report with a date range filter

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

the administrator is on the reports dashboard

### 3.2.5 When

they select 'Sales Report', choose a date range (e.g., 'Last 30 Days'), and click 'Generate Report'

### 3.2.6 Then

the system displays a summary of sales data for that period, including Total Orders, Total Order Value (GMV), and Platform Commission.

### 3.2.7 Validation Notes

Verify that the displayed metrics are calculated correctly based on order data within the specified date range.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Admin generates a Delivery Performance Report with multiple filters

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

the administrator is on the reports dashboard

### 3.3.5 When

they select 'Delivery Performance Report', choose a date range, and filter by a specific 'Operational Zone'

### 3.3.6 Then

the system displays a report with key delivery metrics (e.g., Average Delivery Time, On-time Delivery %, Rider Rejection Rate) specifically for that zone and period.

### 3.3.7 Validation Notes

Ensure the data is correctly filtered by both date and operational zone.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Admin generates a User Activity Report for vendors

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

the administrator is on the reports dashboard

### 3.4.5 When

they select 'User Activity Report', choose the 'Vendor Performance' sub-type, and generate the report for a specific date range

### 3.4.6 Then

the system displays a table of vendors with columns for Order Acceptance Rate, Cancellation Rate, Average Preparation Time, and Average Rating.

### 3.4.7 Validation Notes

Check that the vendor performance metrics are calculated accurately.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Admin exports a generated report to CSV

### 3.5.3 Scenario Type

Happy_Path

### 3.5.4 Given

the administrator has successfully generated a report on the screen

### 3.5.5 When

they click the 'Export as CSV' button

### 3.5.6 Then

the browser initiates a download of a CSV file named appropriately (e.g., 'sales_report_2025-01-01_to_2025-01-31.csv').

### 3.5.7 Validation Notes

Open the downloaded CSV and verify its contents match the on-screen data and are correctly formatted with headers.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Admin exports a generated report to PDF

### 3.6.3 Scenario Type

Happy_Path

### 3.6.4 Given

the administrator has successfully generated a report on the screen

### 3.6.5 When

they click the 'Export as PDF' button

### 3.6.6 Then

the browser initiates a download of a PDF file that is a well-formatted, printable version of the on-screen report, including charts and summary data.

### 3.6.7 Validation Notes

Review the downloaded PDF for readability, correct formatting, and inclusion of all on-screen elements.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Report generation with no data for the selected filters

### 3.7.3 Scenario Type

Edge_Case

### 3.7.4 Given

the administrator is on the reports dashboard

### 3.7.5 When

they select a report type and apply filters that result in no matching data (e.g., a future date range)

### 3.7.6 Then

the system displays a clear message, such as 'No data available for the selected criteria', instead of an empty table or an error.

### 3.7.7 Validation Notes

Test with various filter combinations that are known to have no data.

## 3.8.0 Criteria Id

### 3.8.1 Criteria Id

AC-008

### 3.8.2 Scenario

Attempting to generate a report with an invalid custom date range

### 3.8.3 Scenario Type

Error_Condition

### 3.8.4 Given

the administrator is selecting a custom date range for a report

### 3.8.5 When

they select a 'Start Date' that is after the 'End Date'

### 3.8.6 Then

the 'Generate Report' button is disabled and a validation message 'Start date must be before end date' is displayed.

### 3.8.7 Validation Notes

Verify the UI prevents submission of an invalid date range.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A main 'Reports' section in the admin navigation.
- Tabs or buttons to select report type (Sales, Delivery, User Activity).
- Date range picker with presets (Last 7 Days, Last 30 Days, This Month) and a custom range option.
- Dropdown filters for parameters like 'Operational Zone', 'Vendor', 'Rider'.
- A 'Generate Report' button.
- 'Export as CSV' and 'Export as PDF' buttons.
- Data tables for displaying detailed report data.
- Interactive charts (e.g., line, bar) for data visualization.
- A loading indicator while the report is being generated.
- A message area for displaying 'no data' or error messages.

## 4.2.0 User Interactions

- Admin selects a report type.
- Admin selects filters and clicks 'Generate Report'.
- The system displays the report data and visualizations.
- Admin can sort table data by clicking on column headers.
- Admin clicks an export button to download the report file.

## 4.3.0 Display Requirements

- All monetary values must be displayed in Indian Rupees (₹).
- Dates and times must be in IST.
- Each generated report must clearly state the filters applied (e.g., 'Date Range: 01 Jan 2025 - 31 Jan 2025').
- The data freshness must be indicated on each report, as per REQ-REP-001.

## 4.4.0 Accessibility Needs

- All UI controls (buttons, filters) must be keyboard accessible.
- Charts and graphs must have accessible text alternatives (e.g., a summary or a data table).
- The UI must comply with WCAG 2.1 Level AA standards.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-REP-001

### 5.1.2 Rule Description

Access to the reporting module is restricted to users with the 'Administrator' role.

### 5.1.3 Enforcement Point

API Gateway and Frontend routing.

### 5.1.4 Violation Handling

User is redirected to a '403 Forbidden' page or shown an access denied message.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-REP-002

### 5.2.2 Rule Description

Report data latency for analytical reports can be up to 24 hours, as stated in REQ-REP-001.

### 5.2.3 Enforcement Point

Data aggregation pipeline (ETL/ELT job schedule).

### 5.2.4 Violation Handling

The UI must display the 'Data as of [Timestamp]' to manage user expectations.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

REQ-FUN-017

#### 6.1.1.2 Dependency Reason

Requires complete order lifecycle data (states, timestamps) to calculate delivery times and sales metrics.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

REQ-FUN-021

#### 6.1.2.2 Dependency Reason

Requires financial transaction data to calculate GMV, commissions, and payouts.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

REQ-FUN-009

#### 6.1.3.2 Dependency Reason

Requires rating data to generate vendor and rider performance reports.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

ADM-013

#### 6.1.4.2 Dependency Reason

Requires defined operational zones to enable filtering by zone.

## 6.2.0.0 Technical Dependencies

- A data aggregation mechanism to pull data from various microservices into a queryable data store (e.g., Amazon OpenSearch as per REQ-TEC-001).
- A dedicated 'Reporting' microservice to handle business logic for report generation.
- Frontend charting library (e.g., Chart.js, Recharts).
- Backend libraries for CSV and PDF file generation.

## 6.3.0.0 Data Dependencies

- Access to historical, immutable data from the Order, Payment, User, and Rating services.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- 95th percentile (P95) response time for report generation API calls should be under 5 seconds for a 30-day data range.
- Exporting a large dataset (e.g., 10,000 rows) to CSV should complete within 10 seconds.

## 7.2.0.0 Security

- The reporting API endpoint must be protected and only accessible by authenticated and authorized administrators.
- Exported files containing PII (if any) must be handled securely.

## 7.3.0.0 Usability

- The report interface must be intuitive, allowing an admin to generate any report with minimal clicks.
- Reports must be easy to read and interpret, using clear labels and visualizations.

## 7.4.0.0 Accessibility

- Must meet WCAG 2.1 Level AA compliance.

## 7.5.0.0 Compatibility

- The admin dashboard must be fully functional on the latest versions of Chrome, Firefox, and Safari.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

High

## 8.2.0.0 Complexity Factors

- Designing and implementing the data aggregation pipeline from multiple microservices is complex and critical for performance.
- Avoiding performance degradation on the primary transactional databases by using a separate analytical store (e.g., OpenSearch).
- Optimizing complex database queries for large datasets.
- Potential need for asynchronous report generation for very large date ranges, which adds complexity (though may be deferred).

## 8.3.0.0 Technical Risks

- Data consistency issues between microservices could lead to inaccurate reports.
- Poorly optimized queries could lead to slow report generation or timeouts.
- The chosen data store (OpenSearch) may have limitations for certain types of complex analytical queries compared to a traditional data warehouse.

## 8.4.0.0 Integration Points

- Data sources: Order Service DB, Payment Service DB, User Service DB.
- Data destination: Amazon OpenSearch Service.
- Consumer: Admin Dashboard Frontend.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Performance
- Data Validation

## 9.2.0.0 Test Scenarios

- Verify the accuracy of all calculated metrics in each report type against a known dataset.
- Test all filter combinations (date range, zone, etc.) to ensure they work correctly.
- Test the content and format of exported CSV and PDF files.
- Test the 'no data' and 'invalid date range' scenarios.
- Perform load testing on the report generation API to ensure it meets performance requirements.

## 9.3.0.0 Test Data Needs

- A large, realistic dataset in the staging environment covering at least 3-6 months of simulated activity.
- Data that specifically covers edge cases, such as cancelled orders, refunded orders, and users with no activity.

## 9.4.0.0 Testing Tools

- Jest for unit tests.
- Cypress for E2E tests.
- A performance testing tool like k6 or JMeter.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing.
- Code reviewed and approved by at least one peer.
- Unit and integration tests implemented with >80% coverage for the new reporting service.
- E2E tests for generating and exporting each report type are passing.
- Data accuracy has been manually verified by a QA engineer or product owner against the source data.
- Performance tests confirm that report generation meets the specified time limits.
- UI is responsive and meets accessibility standards.
- Documentation for the new Reporting API is created/updated in OpenAPI specification.
- Story deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

13

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a large story that may be broken down into smaller, per-report stories (e.g., ADM-026a: Sales Report, ADM-026b: Delivery Report).
- A technical spike may be required beforehand to finalize the data aggregation strategy and schema in OpenSearch.
- Requires both backend (data engineering, API) and frontend (UI, visualization) development effort, which should be coordinated.

## 11.4.0.0 Release Impact

- This is a key feature for the administrative team and a major milestone for providing business intelligence capabilities.

