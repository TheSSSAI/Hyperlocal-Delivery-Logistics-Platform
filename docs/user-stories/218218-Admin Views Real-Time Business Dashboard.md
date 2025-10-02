# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | ADM-018 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Admin Views Real-Time Business Dashboard |
| As A User Story | As an Administrator, I want to view a real-time bu... |
| User Persona | Administrator user responsible for platform oversi... |
| Business Value | Provides immediate, at-a-glance visibility into th... |
| Functional Area | Platform & Administrative Features |
| Story Theme | Platform Monitoring & Reporting |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Dashboard displays all key metric widgets on successful load

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

I am an authenticated Administrator and have navigated to the admin dashboard

### 3.1.5 When

the dashboard page finishes loading

### 3.1.6 Then

I should see distinct widgets for: 'Orders per Minute', 'Total Orders (Today)', 'Total GMV (Today)', 'Rider Allocation Success Rate (%)', 'Average Delivery Time (minutes)', 'Payment Success Rate (%)', 'Active Riders', and 'Active Vendors'.

### 3.1.7 Validation Notes

Verify that all 8 specified widgets are rendered with numerical or percentage values. 'Today' refers to the current calendar day in IST.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Dashboard data auto-refreshes periodically

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

I am viewing the admin dashboard

### 3.2.5 When

I remain on the page for 30 seconds without any interaction

### 3.2.6 Then

the data within the widgets should update automatically to reflect the latest metrics without requiring a full page reload.

### 3.2.7 Validation Notes

Use browser developer tools to observe network requests being made at a regular interval (e.g., 30s). The displayed values should change if new data is available.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Dashboard handles data source unavailability for a single widget

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

I am an authenticated Administrator

### 3.3.5 And

all other widgets for which data is available should load and display their metrics correctly.

### 3.3.6 When

I load the admin dashboard

### 3.3.7 Then

the 'Active Riders' widget should display a clear error state (e.g., 'Data unavailable') without crashing the page.

### 3.3.8 Validation Notes

Simulate a service failure for one of the data points in a testing environment. The UI should degrade gracefully.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Dashboard displays zero or N/A for metrics with no activity

### 3.4.3 Scenario Type

Edge_Case

### 3.4.4 Given

it is the beginning of a new day (00:01 IST) and no orders have been placed yet

### 3.4.5 When

I load the admin dashboard

### 3.4.6 Then

the 'Total Orders (Today)' and 'Total GMV (Today)' widgets should display '0'.

### 3.4.7 And

metrics like 'Average Delivery Time' should display 'N/A' or a similar indicator if there is no data to compute an average.

### 3.4.8 Validation Notes

Test against a dataset with no activity for the current day. The UI must not show broken elements or 'NaN' errors.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Dashboard access is restricted to Administrators

### 3.5.3 Scenario Type

Security

### 3.5.4 Given

I am authenticated as a non-Administrator user (e.g., Vendor, Rider)

### 3.5.5 When

I attempt to navigate directly to the admin dashboard URL

### 3.5.6 Then

I should be redirected to an 'Access Denied' page or my own role-specific dashboard.

### 3.5.7 Validation Notes

Attempt to access the endpoint/route with credentials for other user roles. Access must be forbidden (HTTP 403).

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Dashboard widgets are visually distinct and accessible

### 3.6.3 Scenario Type

Happy_Path

### 3.6.4 Given

I am viewing the admin dashboard

### 3.6.5 When

I inspect the UI elements

### 3.6.6 Then

each metric should be presented in a visually clear format, such as a scorecard for single numbers and a simple line chart for time-series data like 'Orders per Minute'.

### 3.6.7 And

all text and chart colors must meet WCAG 2.1 AA contrast ratio requirements.

### 3.6.8 Validation Notes

Use accessibility audit tools (e.g., Lighthouse, Axe) to verify color contrast and other accessibility standards.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A grid-based layout for dashboard widgets.
- Scorecard components for displaying single-value metrics (e.g., 'Active Riders').
- Line chart component for time-series data ('Orders per Minute').
- Gauge or percentage display component for rates ('Allocation Success Rate').
- Clear titles for each widget.
- Loading spinners displayed while initial data is being fetched.
- Error state indicators within widgets for data fetch failures.

## 4.2.0 User Interactions

- The dashboard should be the default view after an administrator logs in.
- Hovering over data points on charts should reveal a tooltip with the precise value and timestamp.
- The dashboard should be view-only; no interactive form elements are required for this story.

## 4.3.0 Display Requirements

- All monetary values (GMV) must be displayed in Indian Rupees (₹) format.
- Time-based metrics ('Today') must be calculated based on the IST timezone.
- Data refresh interval should be clearly understood, ideally between 15-30 seconds.

## 4.4.0 Accessibility Needs

- Adherence to WCAG 2.1 Level AA standards as per REQ-INT-001.
- Sufficient color contrast for all text and data visualizations.
- Keyboard navigability between widgets.
- Screen reader compatibility for widget titles and displayed values.

# 5.0.0 Business Rules

- {'rule_id': 'BR-ADM-018-01', 'rule_description': "Access to the business dashboard is strictly limited to users with the 'Administrator' role.", 'enforcement_point': 'API Gateway and Frontend Router.', 'violation_handling': "API requests return a 403 Forbidden status. Frontend redirects to an 'Access Denied' page."}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

ADM-005

#### 6.1.1.2 Dependency Reason

Requires the existence of the Administrator role and login functionality.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

SYS-001

#### 6.1.2.2 Dependency Reason

Core order lifecycle management must be in place to generate order data.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

RDR-009

#### 6.1.3.2 Dependency Reason

Rider availability status is required to calculate 'Active Riders'.

## 6.2.0.0 Technical Dependencies

- A metrics collection and aggregation system (e.g., Prometheus) must be implemented as per REQ-REP-002.
- The Admin web application (React.js) shell must be established.
- An authentication mechanism (AWS Cognito) must be integrated to enforce role-based access control.

## 6.3.0.0 Data Dependencies

- Requires access to real-time or near-real-time aggregated data from the Order, Rider, Vendor, and Payment microservices.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The dashboard's Largest Contentful Paint (LCP) must be under 2.5 seconds (REQ-NFR-001).
- The API endpoint serving dashboard data must have a 95th percentile (P95) latency of under 200ms.
- Background data refresh calls must not block or degrade the user interface.

## 7.2.0.0 Security

- All communication between the client and the backend for dashboard data must be over HTTPS/TLS 1.2+.
- The API endpoint must be protected and only accessible by authenticated users with the 'Administrator' role (enforced by RBAC).

## 7.3.0.0 Usability

- The dashboard must provide an intuitive, at-a-glance understanding of platform health.
- Data visualizations should be simple and easy to interpret.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards.

## 7.5.0.0 Compatibility

- The dashboard must be responsive and function correctly on all modern desktop web browsers (Chrome, Firefox, Safari, Edge).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires a robust backend data aggregation strategy to collect metrics from multiple microservices without impacting their performance.
- Frontend implementation involves integrating charting libraries and managing real-time data updates efficiently.
- Defining and implementing the correct queries in the metrics system (e.g., PromQL) can be complex.

## 8.3.0.0 Technical Risks

- Risk of high latency if data aggregation is not optimized, violating performance requirements.
- Potential for data inconsistency if metrics are not collected and aggregated transactionally.
- The chosen charting library might have performance or accessibility limitations.

## 8.4.0.0 Integration Points

- Backend API for the dashboard will integrate with the metrics database (e.g., Prometheus).
- Frontend dashboard will integrate with the new backend API endpoint.
- Integrates with the existing authentication service (AWS Cognito) for role checking.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Performance
- Accessibility

## 9.2.0.0 Test Scenarios

- Verify correct rendering of all widgets with mock data.
- Test the graceful failure of individual widgets when their data source is down.
- Validate the auto-refresh mechanism.
- E2E test: Admin login -> navigation to dashboard -> presence of widgets.
- Load test the dashboard API endpoint.
- Run automated accessibility audits against the dashboard UI.

## 9.3.0.0 Test Data Needs

- A mechanism to generate mock time-series metric data for development and testing.
- Test user accounts with 'Administrator' and other roles to verify access control.

## 9.4.0.0 Testing Tools

- Jest & React Testing Library for frontend unit tests.
- Cypress for E2E tests.
- A load testing tool (e.g., k6, JMeter) for the API.
- Axe or Lighthouse for accessibility audits.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Code for both frontend and backend components has been peer-reviewed and merged.
- Unit and integration tests are written and achieve >80% code coverage.
- E2E tests for the happy path and access control are automated and passing.
- Performance testing confirms API latency is within the defined limits.
- Accessibility audit (WCAG 2.1 AA) has been performed and critical issues are resolved.
- The dashboard is verified to be responsive on target browser resolutions.
- Required documentation (e.g., API endpoint in OpenAPI spec) is updated.
- Story has been deployed and verified in the staging environment by a QA engineer or product owner.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story is a foundational element for platform operations and should be prioritized early after core functionalities are in place.
- Requires coordination between frontend and backend developers.
- Dependent on the prior setup of the metrics collection pipeline (Prometheus/CloudWatch).

## 11.4.0.0 Release Impact

- Provides critical operational visibility for the administrative team from day one of launch.
- Does not directly impact customer, vendor, or rider-facing applications.

