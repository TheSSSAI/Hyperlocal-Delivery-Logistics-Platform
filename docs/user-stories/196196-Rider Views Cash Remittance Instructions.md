# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-025 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider Views Cash Remittance Instructions |
| As A User Story | As a delivery rider who has completed Cash on Deli... |
| User Persona | A registered and active Rider who handles Cash on ... |
| Business Value | Ensures timely collection of COD revenue, improves... |
| Functional Area | Rider Financials & Payouts |
| Story Theme | Rider Earnings and Cash Management |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Rider with a positive cash balance views remittance instructions

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a rider is logged into the application and has a 'cash-in-hand' balance greater than ₹0

### 3.1.5 When

the rider navigates to the 'Cash Remittance' screen from their 'Earnings' section

### 3.1.6 Then

the screen must display the current 'cash-in-hand' total, the full address of their assigned remittance center, the center's operating hours, and a bulleted list of procedural instructions.

### 3.1.7 Validation Notes

Verify the displayed address and hours match the configuration for the rider's operational zone in the admin backend.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Rider with a zero cash balance views the remittance screen

### 3.2.3 Scenario Type

Edge_Case

### 3.2.4 Given

a rider is logged into the application and has a 'cash-in-hand' balance of ₹0

### 3.2.5 When

the rider navigates to the 'Cash Remittance' screen

### 3.2.6 Then

the screen must display a clear message indicating there is no cash to remit, such as 'Your cash balance is clear. No remittance required.'

### 3.2.7 Validation Notes

The screen should not show any address or instructions, only the zero-balance message.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Remittance information is not configured for the rider's zone

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

a rider is logged in and has a positive 'cash-in-hand' balance

### 3.3.5 And

no remittance center information has been configured for their operational zone by an administrator

### 3.3.6 When

the rider navigates to the 'Cash Remittance' screen

### 3.3.7 Then

the system must display a user-friendly error message, such as 'Remittance details are not available for your area. Please contact support for assistance.'

### 3.3.8 Validation Notes

This can be tested by assigning a rider to a zone with no associated remittance center in the test database.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Rider interacts with the address on the remittance screen

### 3.4.3 Scenario Type

Happy_Path

### 3.4.4 Given

the rider is viewing the cash remittance instructions which include a valid address

### 3.4.5 When

the rider taps on the address text or a map icon next to it

### 3.4.6 Then

the device's default mapping application must open with the remittance center's address pre-filled for navigation.

### 3.4.7 Validation Notes

Test on both iOS and Android to ensure the correct deep-linking behavior.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

System displays instructions for the correct operational zone

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

the platform operates in multiple zones (e.g., 'Mumbai-North', 'Mumbai-South') with different remittance centers

### 3.5.5 And

a rider is assigned to the 'Mumbai-North' zone

### 3.5.6 When

the rider views the cash remittance instructions

### 3.5.7 Then

the system must display the address and instructions specifically for the 'Mumbai-North' remittance center.

### 3.5.8 Validation Notes

Test with multiple rider accounts, each assigned to a different zone, to verify the correct information is fetched and displayed.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Large, prominent display for 'Cash-in-Hand' amount.
- Clearly labeled section for 'Remittance Location' with address.
- Map icon next to the address.
- Clearly labeled section for 'Operating Hours'.
- Bulleted or numbered list for 'Instructions'.

## 4.2.0 User Interactions

- The remittance screen should be accessible from the main 'Earnings' tab.
- Tapping the address or map icon should launch an external map application.
- If a phone number is provided in the instructions, it should be tappable to initiate a call.

## 4.3.0 Display Requirements

- Cash-in-hand amount must be formatted as currency (e.g., ₹5,432.50).
- Address must be displayed in a standard, multi-line format.
- Operating hours should clearly state the days and times (e.g., 'Mon - Fri, 10:00 AM - 6:00 PM IST').

## 4.4.0 Accessibility Needs

- All text must have sufficient color contrast.
- Screen readers should correctly announce the purpose of each section and the content within.
- Interactive elements like the address link must have clear touch targets.

# 5.0.0 Business Rules

- {'rule_id': 'BR-RDR-01', 'rule_description': "Remittance instructions are specific to a rider's assigned operational zone.", 'enforcement_point': 'Backend API when fetching remittance data for a specific rider.', 'violation_handling': "If a rider's zone cannot be determined or has no configured center, an error state is returned as per AC-003."}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-024

#### 6.1.1.2 Dependency Reason

This story requires the 'cash-in-hand' total to be calculated and available, which is the core functionality of RDR-024.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

ADM-013

#### 6.1.2.2 Dependency Reason

The concept of operational zones, managed by admins, is required to associate riders with the correct remittance center.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

ADM-XXX (New Story)

#### 6.1.3.2 Dependency Reason

An administrator needs a dedicated interface to create, update, and manage remittance center details (address, hours, instructions) and link them to operational zones. This story is a blocker.

## 6.2.0.0 Technical Dependencies

- A new backend API endpoint (e.g., GET /api/v1/rider/remittance-info) to serve the instructions based on the authenticated rider's zone.
- A new database table to store remittance center information and its association with operational zones.

## 6.3.0.0 Data Dependencies

- Availability of remittance center data (address, hours, etc.) in the database, managed via the new Admin story.

## 6.4.0.0 External Dependencies

- Device's native mapping application (e.g., Google Maps, Apple Maps) for the navigation deep-link.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The remittance instruction screen must load in under 2 seconds on a stable 4G connection.

## 7.2.0.0 Security

- The API endpoint must be authenticated and authorized, ensuring a rider can only see information relevant to their own account and zone.

## 7.3.0.0 Usability

- Instructions must be written in simple, clear language, avoiding jargon.
- The layout must be uncluttered and easy to read on a mobile screen in various lighting conditions.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards for mobile applications.

## 7.5.0.0 Compatibility

- Functionality must be consistent across supported iOS and Android versions.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires backend development for a new API endpoint and database schema.
- Requires frontend development for a new screen in the rider mobile app.
- Crucially, requires development of a new CRUD interface in the Admin Dashboard, which is often underestimated.
- Logic to map riders to their operational zone and then to the correct remittance center.

## 8.3.0.0 Technical Risks

- The data model for zones and remittance centers must be flexible enough to handle future changes (e.g., temporary centers, changing hours).
- Inconsistent deep-linking behavior across different Android OEM versions.

## 8.4.0.0 Integration Points

- Rider Service (to get rider's zone).
- New Configuration/Operations Service (to store and retrieve remittance info).
- Admin Backend (for data management).

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Usability

## 9.2.0.0 Test Scenarios

- Verify a rider in Zone A sees instructions for Center A.
- Verify a rider in Zone B sees instructions for Center B.
- Verify a rider with ₹0 cash-in-hand sees the correct message.
- Verify the app's behavior when no remittance center is configured for a zone.
- Verify the map link opens correctly on both iOS and Android devices.

## 9.3.0.0 Test Data Needs

- Test accounts for riders assigned to different operational zones.
- At least two distinct operational zones configured with unique remittance center details.
- One operational zone with no remittance center configured.

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for frontend unit tests.
- Cypress for E2E testing of the Admin panel.
- Appium or similar for mobile E2E automation.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing
- Code reviewed and approved by at least one peer for frontend, backend, and admin panel changes
- Unit and integration tests implemented with >80% coverage for new code
- E2E tests for the user flow are automated and passing
- The new Admin UI for managing remittance centers is fully functional and tested
- UI/UX has been reviewed and approved by the design team for clarity and consistency
- Documentation for the new API endpoint is created/updated in OpenAPI spec
- Story deployed and verified in the staging environment by QA

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This story has a hard dependency on the completion of RDR-024.
- The effort estimation includes the necessary work on the Admin Dashboard. This should be clarified during sprint planning to ensure capacity is allocated for backend, frontend, and admin panel tasks.

## 11.4.0.0 Release Impact

This is a critical feature for enabling COD operations at scale. Its absence would be a major blocker for financial reconciliation and operational efficiency.

