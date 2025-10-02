# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | VND-023 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Vendor Views Customer Ratings and Reviews |
| As A User Story | As a Vendor, I want to access a dedicated section ... |
| User Persona | A registered and approved Vendor using the vendor-... |
| Business Value | Provides vendors with actionable feedback to impro... |
| Functional Area | Vendor Dashboard |
| Story Theme | Vendor Performance & Feedback Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Vendor views the list of ratings and reviews

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

the vendor is logged into the vendor dashboard and has received at least one customer review

### 3.1.5 When

the vendor navigates to the 'Ratings & Reviews' page

### 3.1.6 Then

the system displays a list of reviews, sorted by 'Newest First' by default.

### 3.1.7 And

the list must be paginated, displaying a maximum of 10 reviews per page.

### 3.1.8 Validation Notes

Verify the API returns the correct review data for the authenticated vendor. Check the UI for correct display of all required elements and default sorting.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Vendor views overall rating summary

### 3.2.3 Scenario Type

Happy_Path

### 3.2.4 Given

the vendor is on the 'Ratings & Reviews' page

### 3.2.5 When

the page loads

### 3.2.6 Then

the system displays a summary section showing the store's overall average star rating (calculated to one decimal place) and the total number of ratings received.

### 3.2.7 Validation Notes

Verify the calculation of the average rating is correct based on all ratings for the vendor in the database. The total count should match the number of reviews.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Vendor filters reviews by star rating

### 3.3.3 Scenario Type

Happy_Path

### 3.3.4 Given

the vendor is on the 'Ratings & Reviews' page with reviews of various star ratings

### 3.3.5 When

the vendor selects a specific star rating from a filter control (e.g., '3 Stars')

### 3.3.6 Then

the list of reviews updates to show only the reviews that match the selected star rating.

### 3.3.7 Validation Notes

Test filtering for each star rating (1 through 5). Verify the API correctly filters the results and the UI updates accordingly.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Vendor sorts reviews

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

the vendor is on the 'Ratings & Reviews' page

### 3.4.5 When

the vendor selects a sort option, such as 'Highest Rating' or 'Oldest First'

### 3.4.6 Then

the list of reviews reorders according to the selected criterion.

### 3.4.7 Validation Notes

Test all available sort options: Newest First, Oldest First, Highest Rating, Lowest Rating. Verify the order of items in the list.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Vendor views a rating that has no text review

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

a customer has submitted a star rating without an accompanying text review

### 3.5.5 When

the vendor views this rating on the 'Ratings & Reviews' page

### 3.5.6 Then

the system displays the star rating correctly, and the text review area shows a placeholder message, such as '(No comment provided)'.

### 3.5.7 Validation Notes

Ensure the UI handles null or empty review text gracefully without breaking the layout.

## 3.6.0 Criteria Id

### 3.6.1 Criteria Id

AC-006

### 3.6.2 Scenario

Vendor with no reviews views the page

### 3.6.3 Scenario Type

Edge_Case

### 3.6.4 Given

the vendor is newly onboarded and has not received any ratings or reviews

### 3.6.5 When

the vendor navigates to the 'Ratings & Reviews' page

### 3.6.6 Then

the system displays an empty state message, such as 'You haven't received any reviews yet.'

### 3.6.7 And

the overall rating summary is hidden or displays 'N/A'.

### 3.6.8 Validation Notes

Create a test vendor with zero associated reviews and verify the UI displays the correct empty state.

## 3.7.0 Criteria Id

### 3.7.1 Criteria Id

AC-007

### 3.7.2 Scenario

Vendor cannot see reviews for other stores

### 3.7.3 Scenario Type

Error_Condition

### 3.7.4 Given

the vendor is logged in

### 3.7.5 When

an attempt is made to fetch review data for a different vendor ID via the API

### 3.7.6 Then

the API must return an authorization error (e.g., 403 Forbidden) and not expose any data.

### 3.7.7 Validation Notes

This must be tested at the API level. A logged-in vendor's token should not grant access to another vendor's resources.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A main heading for the page, e.g., 'Ratings & Reviews'.
- A summary card displaying 'Overall Rating' (e.g., 4.5 ★) and 'Total Ratings' (e.g., 152).
- A dropdown or button group for filtering by star rating (All, 5 Stars, 4 Stars, etc.).
- A dropdown for sorting (Newest First, Oldest First, Highest Rating, Lowest Rating).
- A list area to display individual review cards.
- Pagination controls (e.g., 'Previous', 'Next', page numbers) at the bottom of the list.
- An empty state message component for vendors with no reviews.

## 4.2.0 User Interactions

- Clicking on a filter option immediately re-fetches and updates the review list.
- Selecting a sort option immediately re-fetches and re-sorts the review list.
- Clicking on pagination controls loads the corresponding page of reviews.

## 4.3.0 Display Requirements

- Customer names must be anonymized (e.g., first name and last initial).
- Star ratings must be displayed visually using star icons.
- Review dates should be in a human-readable format (e.g., 'Oct 27, 2024').

## 4.4.0 Accessibility Needs

- All interactive elements (filters, sorters, pagination) must be keyboard-navigable and have appropriate ARIA labels.
- Star ratings should have a text equivalent for screen readers (e.g., 'Rated 4 out of 5 stars').
- The UI must comply with WCAG 2.1 Level AA standards as per REQ-INT-001.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-VND-REV-01

### 5.1.2 Rule Description

Vendors can only view ratings and reviews associated with their own store.

### 5.1.3 Enforcement Point

API Gateway and Backend Service (Vendor Microservice).

### 5.1.4 Violation Handling

The API will return a 403 Forbidden or 404 Not Found status code.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-VND-REV-02

### 5.2.2 Rule Description

Customer Personally Identifiable Information (PII) must be anonymized in the review display to comply with DPDP Act (REQ-CON-001).

### 5.2.3 Enforcement Point

Backend API response serialization.

### 5.2.4 Violation Handling

Full customer names or other PII must never be included in the API payload sent to the vendor dashboard.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

CUS-037

#### 6.1.1.2 Dependency Reason

The functionality for customers to submit ratings and reviews for vendors must exist before vendors can view them.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

VND-004

#### 6.1.2.2 Dependency Reason

The vendor must be able to log in to the dashboard to access this feature.

## 6.2.0.0 Technical Dependencies

- A backend API endpoint (e.g., GET /api/v1/vendor/reviews) that supports authentication, pagination, filtering by rating, and sorting.
- The database schema for storing reviews must be finalized and implemented, linking reviews to vendors, customers, and orders.

## 6.3.0.0 Data Dependencies

- Requires existing review data in the database for testing and verification.

## 6.4.0.0 External Dependencies

*No items available*

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The P95 latency for the API call to fetch reviews must be under 200ms (REQ-NFR-001).
- The 'Ratings & Reviews' page on the web dashboard must achieve a Largest Contentful Paint (LCP) of under 2.5 seconds (REQ-NFR-001).

## 7.2.0.0 Security

- Access to the review data must be restricted to the authenticated vendor who owns the store, enforced via Role-Based Access Control (RBAC) at the API level (REQ-NFR-003).

## 7.3.0.0 Usability

- The interface for filtering and sorting reviews must be intuitive and provide immediate visual feedback when an option is selected.

## 7.4.0.0 Accessibility

- The feature must meet WCAG 2.1 Level AA compliance (REQ-INT-001).

## 7.5.0.0 Compatibility

- The vendor dashboard must be responsive and function correctly on all modern web browsers (REQ-INT-001).

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Backend: Implementing efficient database queries for combined filtering, sorting, and pagination.
- Backend: Logic for calculating and potentially caching the overall average rating to avoid performance degradation.
- Frontend: Managing the state of filters, sorting, and current page, and ensuring the UI updates correctly and efficiently upon changes.
- Data Privacy: Implementing the customer name anonymization logic correctly in the API layer.

## 8.3.0.0 Technical Risks

- Inefficient database queries could lead to slow API response times as the number of reviews grows.
- Incorrect implementation of access control could lead to a data leak, allowing vendors to see reviews for other stores.

## 8.4.0.0 Integration Points

- Vendor Web Dashboard (React.js) will call the Backend API.
- Backend API will query the PostgreSQL database.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Performance
- Security

## 9.2.0.0 Test Scenarios

- A vendor logs in and successfully views their reviews.
- Filtering by each star rating (1-5) shows the correct subset of reviews.
- Sorting by each available option correctly reorders the list.
- A vendor with no reviews sees the empty state message.
- Pagination correctly navigates between pages of reviews.
- An API request with a valid token for Vendor A fails to retrieve data for Vendor B.

## 9.3.0.0 Test Data Needs

- A test vendor account with a significant number of reviews (e.g., 25+) with varying star ratings and with/without text comments.
- A test vendor account with zero reviews.
- At least two distinct test vendor accounts to verify data segregation.

## 9.4.0.0 Testing Tools

- Jest and React Testing Library for frontend unit/integration tests.
- Jest for backend unit/integration tests.
- Cypress for E2E testing (REQ-NFR-006).

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing in the staging environment.
- Code for both frontend and backend has been peer-reviewed and merged.
- Unit and integration tests are written and achieve >= 80% coverage (REQ-NFR-006).
- E2E tests for the primary user flows are passing.
- The API endpoint is documented in the OpenAPI specification.
- Performance requirements for API latency and page load time are met.
- Security review confirms that a vendor cannot access another vendor's data.
- UI has been reviewed for responsiveness and adherence to design specifications.
- Feature is deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🟡 Medium

## 11.3.0.0 Sprint Considerations

- Requires both frontend (React) and backend (NestJS) development effort.
- The API contract between frontend and backend should be defined at the beginning of the sprint to allow for parallel work.
- Availability of realistic test data in the development environment is crucial.

## 11.4.0.0 Release Impact

This is a key feature for vendor engagement and satisfaction. It should be included in an early release after the core MVP functionality is stable.

