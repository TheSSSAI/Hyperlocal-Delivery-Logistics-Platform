# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-014 |
| Elaboration Date | 2025-01-18 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider Uses In-App Navigation to Vendor |
| As A User Story | As a delivery rider who has accepted a task, I wan... |
| User Persona | A registered and online Rider who has accepted a d... |
| Business Value | Increases rider efficiency by reducing time and co... |
| Functional Area | Rider-Facing Features |
| Story Theme | Delivery Execution & Status Updates |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

RDR-014-AC-001

### 3.1.2 Scenario

Happy Path - Launching navigation successfully

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a rider is logged in, on the active task screen for a pickup, and has a compatible mapping application (e.g., Google Maps, Apple Maps) installed

### 3.1.5 When

the rider taps the 'Navigate to Vendor' button

### 3.1.6 Then

the system seamlessly launches the device's default mapping application

### 3.1.7 And

the turn-by-turn navigation is ready to begin.

### 3.1.8 Validation Notes

Test on both iOS and Android physical devices. Verify that Google Maps on Android and Apple Maps on iOS launch correctly with the pre-populated route.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

RDR-014-AC-002

### 3.2.2 Scenario

Error Condition - Location services are disabled

### 3.2.3 Scenario Type

Error_Condition

### 3.2.4 Given

a rider is on the active task screen

### 3.2.5 And

the prompt provides a shortcut to the device's location settings.

### 3.2.6 When

the rider taps the 'Navigate to Vendor' button

### 3.2.7 Then

the system displays a native prompt requesting the rider to enable location services

### 3.2.8 Validation Notes

Verify that the app does not crash and that the prompt is clear and actionable. After enabling location, tapping the button again should proceed to the happy path.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

RDR-014-AC-003

### 3.3.2 Scenario

Error Condition - No compatible mapping application is installed

### 3.3.3 Scenario Type

Error_Condition

### 3.3.4 Given

a rider is on the active task screen

### 3.3.5 And

the navigation action is halted.

### 3.3.6 When

the rider taps the 'Navigate to Vendor' button

### 3.3.7 Then

the system displays an in-app message stating 'A mapping application is required for navigation. Please install one from the App Store / Play Store.'

### 3.3.8 Validation Notes

Test this on an emulator or device where standard mapping apps have been uninstalled. The message should be user-friendly and not a technical error.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

RDR-014-AC-004

### 3.4.2 Scenario

Alternative Flow - App state is preserved after navigation

### 3.4.3 Scenario Type

Alternative_Flow

### 3.4.4 Given

the rider has successfully launched the external navigation app via the 'Navigate to Vendor' button

### 3.4.5 When

the rider manually switches back to the platform's rider app

### 3.4.6 Then

the app returns to the exact same active task screen without losing its state

### 3.4.7 And

all background processes, such as location tracking for the platform, continue to function as expected.

### 3.4.8 Validation Notes

Verify that no data is lost and the UI does not reset. Check background location updates are still being sent to the backend while the map app is in the foreground.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

RDR-014-AC-005

### 3.5.2 Scenario

Edge Case - Un-geocodeable or invalid vendor address

### 3.5.3 Scenario Type

Edge_Case

### 3.5.4 Given

a rider has accepted a task where the vendor's address is malformed or cannot be geocoded

### 3.5.5 When

the rider taps the 'Navigate to Vendor' button

### 3.5.6 Then

the system displays a user-friendly error message, such as 'Could not get directions. The vendor address may be incorrect.'

### 3.5.7 And

the rider is not sent to a mapping application with an invalid destination.

### 3.5.8 Validation Notes

Requires test data with an invalid address. The system should gracefully handle the API error from the mapping service.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A prominent and easily tappable 'Navigate' or 'Directions' button, possibly with a route icon, placed next to the vendor's address on the active task screen.

## 4.2.0 User Interactions

- A single tap on the 'Navigate' button initiates the action.
- The app should handle system-level permission prompts for location services if not already granted.

## 4.3.0 Display Requirements

- The active task screen must clearly display the vendor's name and full address.
- Any error messages must be clear, non-technical, and guide the user on how to resolve the issue.

## 4.4.0 Accessibility Needs

- The 'Navigate' button must have a proper accessibility label (e.g., 'Navigate to [Vendor Name]').
- The button must meet minimum tap target size requirements for accessibility.

# 5.0.0 Business Rules

*No items available*

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-012

#### 6.1.1.2 Dependency Reason

This story provides the context (an accepted task) and the UI (the active task screen) where the navigation button will be placed.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

VND-005

#### 6.1.2.2 Dependency Reason

This story ensures that vendor address data is captured and available in the system, which is the destination for the navigation.

## 6.2.0.0 Technical Dependencies

- React Native libraries for handling deep links/intents (e.g., Linking API).
- React Native libraries for handling device permissions (e.g., for location services).
- Integration with Mapbox API (as per REQ-INT-003) to geocode the vendor's address and format it correctly for the navigation URL.

## 6.3.0.0 Data Dependencies

- Access to accurate, geocoded vendor address from the Vendor service.
- Access to the rider's real-time GPS location from the device.

## 6.4.0.0 External Dependencies

- The device's operating system (iOS/Android) to handle the deep link request.
- The installed third-party mapping application (Google Maps, Apple Maps, etc.) to accept the deep link and provide navigation.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The time from tapping the 'Navigate' button to the external mapping application launching must be under 2 seconds on a stable 4G connection.

## 7.2.0.0 Security

- No Personally Identifiable Information (PII) other than the destination coordinates should be passed in the navigation URL.

## 7.3.0.0 Usability

- The feature must be intuitive, requiring zero training for the rider. The button's purpose and location should be self-evident.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards for mobile applications, particularly for tap targets and labels.

## 7.5.0.0 Compatibility

- The deep linking mechanism must be compatible with the last two major versions of iOS and Android.
- Must function correctly with the latest versions of Google Maps (Android) and Apple Maps (iOS). Support for other popular apps like Waze is a plus.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Handling cross-platform differences in deep linking and permission management between iOS and Android.
- Implementing robust error handling for various failure scenarios (no app, no GPS, bad address).
- Ensuring the rider app's background services (especially location tracking) are not disrupted when another app is in the foreground.

## 8.3.0.0 Technical Risks

- Changes in the URL schemes of third-party mapping apps could break the functionality, requiring ongoing maintenance.
- Aggressive battery optimization on some Android devices might kill the app's background service while the rider is navigating.

## 8.4.0.0 Integration Points

- Device Operating System (for deep linking and permissions).
- Third-party mapping applications.
- Internal Vendor service API to fetch the address.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Usability
- Compatibility

## 9.2.0.0 Test Scenarios

- Successful navigation launch on both iOS and Android.
- Handling of disabled location services.
- Handling of missing map applications.
- App state preservation after returning from the map app.
- Testing with a known bad address to verify error handling.
- Verification on devices with different default map apps (Google Maps, Apple Maps, Waze).

## 9.3.0.0 Test Data Needs

- Test rider accounts.
- Test vendor accounts with valid, geocoded addresses in the test region.
- A test vendor account with a deliberately malformed or un-geocodeable address.

## 9.4.0.0 Testing Tools

- React Native Testing Library for unit tests.
- Cypress or a similar framework for E2E tests.
- Physical iOS and Android devices for manual validation.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing on both iOS and Android.
- Code reviewed and approved by at least one other engineer.
- Unit and integration tests implemented with >80% coverage for new code.
- E2E test scenario for the happy path is automated and passing.
- User interface reviewed and approved by the design/product team.
- Feature manually verified on a representative set of physical devices.
- Background location tracking is confirmed to be unaffected by the feature.
- Documentation for the deep linking module is created or updated.
- Story deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a core rider-facing feature essential for the delivery workflow.
- Requires access to physical iOS and Android devices for thorough testing, as emulators may not fully replicate deep linking and permission behaviors.
- Potential for OS-specific implementation details that may require separate effort.

## 11.4.0.0 Release Impact

- This feature is a key component of the Minimum Viable Product (MVP) for the rider application. Its completion is critical for pilot launch.

