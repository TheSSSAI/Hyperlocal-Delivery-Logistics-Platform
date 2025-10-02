# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | VND-025 |
| Elaboration Date | 2025-01-24 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Vendor Views Sales and Performance Reports |
| As A User Story | As a Vendor, I want to access and view filterable ... |
| User Persona | A registered and active Vendor using the vendor-fa... |
| Business Value | Empowers vendors with actionable data to optimize ... |
| Functional Area | Vendor Dashboard |
| Story Theme | Vendor Analytics & Reporting |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Accessing the Reports Page

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a vendor is logged into the vendor web dashboard

### 3.1.5 When

the vendor navigates to the 'Reports' section from the main menu

### 3.1.6 Then

the Sales Report page is displayed, defaulting to the 'This Month' date range.

### 3.1.7 Validation Notes

Verify the 'Reports' link is present in the navigation and correctly routes to the reports UI.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Viewing Key Performance Indicators (KPIs)

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

the vendor is on the Sales Report page

### 3.2.5 When

the page loads with data for the selected date range

### 3.2.6 Then

the following KPIs are clearly displayed: 'Total Sales' (in ₹, based on order subtotal), 'Total Orders' (count of delivered orders), and 'Average Order Value' (Total Sales / Total Orders).

### 3.2.7 Validation Notes

Cross-reference the displayed KPI values with a manual calculation from the database for a specific vendor and date range to ensure accuracy.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Viewing Top-Selling Items

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

the vendor is on the Sales Report page

### 3.3.5 When

the page loads with data for the selected date range

### 3.3.6 Then

a list or table of the top 10 selling items is displayed, showing 'Product Name', 'Quantity Sold', and 'Total Revenue' for each item.

### 3.3.7 Validation Notes

Verify the list is sorted by 'Total Revenue' in descending order by default. Check data accuracy against order records.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Filtering Report by a Predefined Date Range

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

the vendor is on the Sales Report page

### 3.4.5 When

the vendor selects a predefined filter like 'This Week' or 'Last Month'

### 3.4.6 Then

the KPIs and the Top-Selling Items list automatically update to reflect the data for the newly selected period.

### 3.4.7 Validation Notes

Test each predefined date range option to ensure the backend query and frontend display update correctly.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Filtering Report by a Custom Date Range

### 3.5.3 Scenario Type

Happy_Path

### 3.5.4 Given

the vendor is on the Sales Report page

### 3.5.5 When

the vendor uses the date picker to select a custom start and end date and applies the filter

### 3.5.6 Then

the KPIs and the Top-Selling Items list update to reflect the data for the custom period.

### 3.5.7 Validation Notes

Ensure the date picker is intuitive and the data updates upon applying the filter.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Exporting Report Data

### 3.6.3 Scenario Type

Happy_Path

### 3.6.4 Given

the vendor is viewing a report for a specific date range

### 3.6.5 When

the vendor clicks the 'Export' button and selects 'CSV'

### 3.6.6 Then

a CSV file is downloaded to their device containing the detailed transaction data for the selected period.

### 3.6.7 Validation Notes

Verify the contents of the downloaded CSV file. It should include columns like Order ID, Date, Subtotal, Taxes, Delivery Fee, Commission, and Net Payout. Also test PDF export as per REQ-REP-001.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Viewing Report with No Sales Data

### 3.7.3 Scenario Type

Edge_Case

### 3.7.4 Given

a vendor has no delivered orders within the selected date range

### 3.7.5 When

the vendor views the Sales Report for that period

### 3.7.6 Then

the KPIs display '0' or 'N/A', and a clear message like 'No sales data available for this period' is shown instead of an empty table.

### 3.7.7 Validation Notes

Test with a new vendor account or a custom date range with no orders to ensure the UI handles the empty state gracefully.

## 3.8.0 Criteria Id

### 3.8.1 Criteria Id

AC-008

### 3.8.2 Scenario

Invalid Custom Date Range Selection

### 3.8.3 Scenario Type

Error_Condition

### 3.8.4 Given

the vendor is selecting a custom date range

### 3.8.5 When

they attempt to select an end date that is before the start date

### 3.8.6 Then

the 'Apply' button is disabled and a validation message is displayed, preventing the invalid selection.

### 3.8.7 Validation Notes

Check frontend validation logic for the date range picker.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Navigation link to 'Reports'
- Date range filter with predefined options (Today, This Week, This Month, Last Month) and a custom date range picker
- KPI display cards for Total Sales, Total Orders, and Average Order Value
- A data table for 'Top-Selling Items' with sortable columns
- An 'Export' button with options for CSV and PDF download
- A clear message area for empty states (e.g., no data)

## 4.2.0 User Interactions

- User can click on predefined date ranges to quickly filter data.
- User can interact with a calendar widget to select a custom date range.
- The report data should refresh automatically after a new date range is applied.
- The 'Top-Selling Items' table columns should be sortable.

## 4.3.0 Display Requirements

- All monetary values must be displayed in Indian Rupees (₹) with correct formatting.
- The report must clearly indicate the date range for which data is being displayed.
- As per REQ-REP-001, the data freshness (e.g., 'Data updated as of [timestamp]') must be indicated on the page.

## 4.4.0 Accessibility Needs

- The page must comply with WCAG 2.1 Level AA standards as per REQ-INT-001.
- Data tables must have proper headers and captions for screen readers.
- All interactive elements (buttons, filters) must be keyboard accessible and have clear focus indicators.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-REP-001

### 5.1.2 Rule Description

Sales data must only be calculated from orders in the 'Delivered' state. 'Cancelled' or other state orders must be excluded from all calculations.

### 5.1.3 Enforcement Point

Backend API data aggregation query.

### 5.1.4 Violation Handling

N/A (System logic).

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-REP-002

### 5.2.2 Rule Description

'Total Sales' metric is calculated based on the order subtotal, exclusive of taxes and delivery fees, to align with commission calculation (REQ-BR-004).

### 5.2.3 Enforcement Point

Backend API data aggregation logic.

### 5.2.4 Violation Handling

N/A (System logic).

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

VND-004

#### 6.1.1.2 Dependency Reason

Vendor must be able to log in to access the dashboard.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

REQ-FUN-017

#### 6.1.2.2 Dependency Reason

A stable order lifecycle with discrete states ('Delivered', 'Cancelled') is required for accurate sales data aggregation.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

REQ-FUN-021

#### 6.1.3.2 Dependency Reason

The financial and transaction data managed by the settlements service is the source of truth for all reporting.

## 6.2.0.0 Technical Dependencies

- A backend API endpoint to fetch and aggregate sales data for a given vendor and date range.
- An optimized database query or materialized view to handle data aggregation efficiently without impacting production database performance.
- Frontend components in the React web application for displaying the report.

## 6.3.0.0 Data Dependencies

- Access to historical order data, including order status, items, and pricing.
- Access to product catalog data to display item names.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The 95th percentile (P95) latency for the report generation API call should be under 3 seconds for date ranges up to 90 days.
- The web page must achieve a Largest Contentful Paint (LCP) of under 2.5 seconds as per REQ-NFR-001.

## 7.2.0.0 Security

- The API endpoint must be secured using the platform's RBAC model to ensure a vendor can only access their own sales data.
- All data must be transmitted over HTTPS as per REQ-INT-004.

## 7.3.0.0 Usability

- The report should be easy to understand at a glance, with clear labels and visualizations.
- The filtering mechanism should be intuitive and responsive.

## 7.4.0.0 Accessibility

- Must adhere to WCAG 2.1 Level AA standards (REQ-INT-001).

## 7.5.0.0 Compatibility

- The vendor dashboard must be responsive and function correctly on all modern web browsers (Chrome, Firefox, Safari, Edge) as per REQ-INT-001.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- The primary complexity is in the backend data aggregation. A naive query on a large orders table could be slow and resource-intensive.
- A data warehousing or materialized view strategy might be necessary to ensure performance, which adds architectural complexity.
- Generating PDF exports can be more complex than CSV and may require a dedicated library or microservice.

## 8.3.0.0 Technical Risks

- Risk of slow report generation for vendors with very high order volumes, leading to API timeouts or a poor user experience.
- Risk of data inaccuracies if the aggregation logic does not correctly handle all edge cases (e.g., refunds, cancelled orders).

## 8.4.0.0 Integration Points

- The reporting service/module will need to read data from the Order Management and Payments & Settlements services/databases.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Performance
- Accessibility

## 9.2.0.0 Test Scenarios

- Verify report accuracy for a vendor with a complex order history (including some cancelled orders).
- Test the empty state for a new vendor with no sales history.
- Test all predefined and custom date range filters.
- Validate the content and format of both CSV and PDF exports.
- Perform load testing on the reporting API endpoint to ensure it meets performance requirements.

## 9.3.0.0 Test Data Needs

- A test vendor account with a large volume of 'Delivered' orders spread across several months.
- A test vendor account with a mix of 'Delivered' and 'Cancelled' orders.
- A new test vendor account with zero orders.

## 9.4.0.0 Testing Tools

- Jest and React Testing Library for frontend unit tests.
- Cypress for E2E testing of the user flow.
- A load testing tool (e.g., k6, JMeter) for the backend API.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer
- Unit and integration tests implemented with >= 80% coverage
- E2E tests for core functionality are passing in the CI/CD pipeline
- User interface reviewed for usability and adherence to design specs
- Performance testing confirms API response times are within the defined threshold
- Security review confirms data access is restricted correctly
- API documentation (OpenAPI) is created or updated
- Story deployed and verified in the staging environment

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- The backend data aggregation strategy needs to be decided before implementation begins.
- This story is a key feature for vendor retention and should be prioritized accordingly.
- Frontend and backend tasks can be worked on in parallel once the API contract is defined.

## 11.4.0.0 Release Impact

- This feature is a significant value-add for vendors and can be highlighted in release notes and marketing communications to vendors.

