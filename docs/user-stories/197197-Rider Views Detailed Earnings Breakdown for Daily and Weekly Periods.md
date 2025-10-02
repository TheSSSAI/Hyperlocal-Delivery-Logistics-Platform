# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-026 |
| Elaboration Date | 2025-01-24 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider Views Detailed Earnings Breakdown for Daily ... |
| As A User Story | As a Rider, I want to view a detailed, itemized br... |
| User Persona | Rider: An active delivery partner who needs transp... |
| Business Value | Increases rider trust, satisfaction, and retention... |
| Functional Area | Rider-Facing Features |
| Story Theme | Rider Financial Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Default Weekly Earnings View

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a logged-in rider has completed deliveries in the current week

### 3.1.5 When

the rider navigates to the 'Earnings' screen

### 3.1.6 Then

the screen defaults to the current week's view, displaying the total earnings for the week and a summary of earnings for each day of that week.

### 3.1.7 Validation Notes

Verify that the date range for the current week is correct (e.g., Mon-Sun) and the total is a sum of the daily summaries.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Drill-down to Daily Earnings View

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

the rider is on the weekly earnings view and has earnings on a specific day

### 3.2.5 When

the rider taps on that specific day's summary

### 3.2.6 Then

the screen transitions to a detailed view for that day, showing a total for the day and a list of all individual deliveries completed on that date.

### 3.2.7 Validation Notes

Ensure the navigation is smooth and the correct day's data is loaded.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Individual Delivery Earnings Breakdown

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

the rider is viewing the daily earnings list

### 3.3.5 When

the rider looks at an entry for a single delivery

### 3.3.6 Then

the entry must clearly display the Order ID, the base delivery fee, the tip amount (if any), and the total earning for that delivery (fee + tip).

### 3.3.7 Validation Notes

Check a delivery with a tip and one without a tip. If no tip, it should display '₹0.00' or similar, without breaking the UI.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Navigating to Previous Weeks

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

the rider is on the earnings screen

### 3.4.5 When

the rider uses the navigation controls (e.g., arrows, calendar picker) to select a previous week

### 3.4.6 Then

the screen updates to show the earnings summary for the selected past week.

### 3.4.7 Validation Notes

Test navigation across month and year boundaries.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Display for a Period with No Earnings

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

a rider has not completed any deliveries in a specific week or day

### 3.5.5 When

the rider navigates to that period in the earnings screen

### 3.5.6 Then

a clear, user-friendly message is displayed, such as 'You had no earnings during this period.'

### 3.5.7 Validation Notes

Verify that the screen does not show '₹0.00' in a confusing way, but rather an explicit empty-state message.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Data Loading State

### 3.6.3 Scenario Type

Alternative_Flow

### 3.6.4 Given

the rider navigates to the earnings screen or changes the date period

### 3.6.5 When

the application is fetching data from the server

### 3.6.6 Then

a loading indicator (e.g., a spinner or shimmer effect) is displayed to the user.

### 3.6.7 Validation Notes

Simulate network latency to ensure the loading state is visible and not jarring.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

API or Network Error Handling

### 3.7.3 Scenario Type

Error_Condition

### 3.7.4 Given

the rider is on the earnings screen

### 3.7.5 When

the API call to fetch earnings data fails due to a network or server error

### 3.7.6 Then

a user-friendly error message is displayed (e.g., 'Could not load earnings. Please check your connection and try again.') along with a 'Retry' button.

### 3.7.7 Validation Notes

Use a tool to mock a 500 server error or simulate a network failure to test this state.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A main tab or menu item labeled 'Earnings'
- Week navigation controls (e.g., '<' and '>' arrows with the current week's date range displayed)
- A summary card displaying 'Total Weekly Earnings'
- A list of daily summaries for the selected week (e.g., 'Monday, Dec 25: ₹XXX.XX')
- A detailed list view for daily deliveries
- A loading indicator (spinner or shimmer placeholder)
- An error message component with a retry button

## 4.2.0 User Interactions

- Tapping on the 'Earnings' tab to access the screen.
- Tapping on week navigation arrows to move between weeks.
- Tapping on a day in the weekly summary to drill down to the daily view.
- Scrolling through the list of daily deliveries.
- Pull-to-refresh on the list to fetch the latest data.

## 4.3.0 Display Requirements

- All monetary values must be displayed in Indian Rupees (₹) with two decimal places (e.g., ₹55.00).
- Dates and days of the week must be clearly and consistently formatted.
- A clear distinction must be made between base fee and tips in the breakdown.

## 4.4.0 Accessibility Needs

- All text and numerical data must meet WCAG 2.1 AA contrast ratio standards.
- All interactive elements (buttons, list items) must have a minimum touch target size of 44x44dp.
- The screen should be navigable and readable using screen readers (e.g., VoiceOver, TalkBack).

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-RDR-EARN-01

### 5.1.2 Rule Description

Earnings are calculated based on completed and delivered orders only. Cancelled or failed orders do not contribute to earnings.

### 5.1.3 Enforcement Point

Backend financial service during data aggregation for the API.

### 5.1.4 Violation Handling

Data for non-completed orders is filtered out and not included in the API response.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-RDR-EARN-02

### 5.2.2 Rule Description

The earnings displayed are net earnings credited to the rider's account and do not include the cash amount collected for COD orders.

### 5.2.3 Enforcement Point

Backend financial service and Frontend UI display logic.

### 5.2.4 Violation Handling

The API payload and UI components must explicitly separate 'earnings' from 'cash collected'. This screen only shows 'earnings'.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-004

#### 6.1.1.2 Dependency Reason

Rider must be able to log in to access any authenticated screen.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

RDR-019

#### 6.1.2.2 Dependency Reason

The system must have a 'Delivered' order status to identify completed deliveries from which to calculate earnings.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

CUS-038

#### 6.1.3.2 Dependency Reason

The tipping functionality, which is part of the customer rating flow, must be implemented to provide tip data.

### 6.1.4.0 Story Id

#### 6.1.4.1 Story Id

SYS-006

#### 6.1.4.2 Dependency Reason

The backend settlement system must be in place to calculate and store the earnings data that this story's API will expose.

## 6.2.0.0 Technical Dependencies

- A backend microservice (e.g., 'Payments & Settlements') responsible for calculating and storing rider earnings.
- A secure, versioned, and documented REST API endpoint to fetch earnings data by rider ID and date range.

## 6.3.0.0 Data Dependencies

- Access to transactional data including order details, delivery fees, and tips associated with a rider's completed deliveries.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The earnings screen API (P95 latency) must respond in under 500ms.
- The UI must load and become interactive within 3 seconds on a standard 4G network.
- Scrolling through a list of 50+ deliveries for a single day must be smooth (maintain 60fps).

## 7.2.0.0 Security

- The API endpoint must be protected and require a valid JWT for an authenticated rider.
- The system must enforce authorization, ensuring a rider can only access their own earnings data and not anyone else's.

## 7.3.0.0 Usability

- The information architecture must be intuitive, allowing riders to find their earnings details with minimal taps.
- The breakdown of earnings must be clear and unambiguous.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA guidelines.

## 7.5.0.0 Compatibility

- The feature must function correctly on the supported versions of iOS and Android for the React Native application.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Backend API requires efficient database queries to aggregate financial data across multiple tables (orders, payments, tips) for specific date ranges.
- Frontend UI requires handling of date navigation, state management for different time periods (weekly, daily), and clear presentation of financial data.
- Potential for large data sets for high-performing riders, requiring pagination or virtualization in the UI to maintain performance.

## 8.3.0.0 Technical Risks

- Performance of the backend aggregation query could be slow if not properly indexed and optimized.
- Ensuring 100% accuracy of financial data displayed is critical to maintain rider trust. Off-by-one errors or rounding issues must be avoided.

## 8.4.0.0 Integration Points

- Rider Mobile Application (React Native)
- Backend API Gateway
- Payments & Settlements Microservice

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Performance

## 9.2.0.0 Test Scenarios

- Verify earnings for a rider with a high volume of deliveries in one day.
- Verify earnings for a rider with deliveries that include tips and deliveries that do not.
- Verify the empty state for a new rider with no completed deliveries.
- Verify correct weekly total calculation when a week spans across two months.
- Test the API response time and UI performance with a dataset representing a rider's earnings over a full year.
- Test the error handling flow by simulating API failures (4xx and 5xx responses).

## 9.3.0.0 Test Data Needs

- Test rider accounts with varying earning histories: no earnings, sparse earnings, consistent daily earnings, earnings with/without tips.
- Test data that crosses month and year boundaries.

## 9.4.0.0 Testing Tools

- Jest & React Testing Library for frontend unit tests.
- Cypress or a similar framework for E2E tests.
- Postman or Insomnia for API integration testing.
- Load testing tools (e.g., k6, JMeter) for the backend API.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in a staging environment.
- Backend and frontend code has been peer-reviewed and merged into the main branch.
- Unit test coverage for new logic meets the 80% threshold (REQ-NFR-006).
- Integration tests between the mobile app and the new API endpoint are passing.
- E2E test scenario for checking earnings is automated and passing.
- The new API endpoint is documented in the OpenAPI specification.
- Performance testing confirms API latency is within the defined limits.
- UI has been reviewed for usability and accessibility compliance.
- Story has been deployed and verified in the staging environment by QA and the Product Owner.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story has both significant backend and frontend components. The API contract should be defined early in the sprint to allow parallel development.
- Requires careful coordination with the team responsible for the financial/settlements microservice.

## 11.4.0.0 Release Impact

- This is a high-visibility feature for riders and a key component for rider satisfaction. It should be highlighted in release notes for the rider app.

