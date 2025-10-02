# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-020 |
| Elaboration Date | 2025-01-15 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider App: Graceful Handling of Denied GPS and Cam... |
| As A User Story | As a Rider, I want to be clearly informed why GPS ... |
| User Persona | A registered and verified Rider using the mobile a... |
| Business Value | Improves rider experience by preventing a dead-end... |
| Functional Area | Rider Application - Core Functionality & Permissio... |
| Story Theme | Rider Onboarding and Usability |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

AC-001

### 3.1.2 Scenario

Rider denies GPS permission when prompted (e.g., when toggling 'Online')

### 3.1.3 Scenario Type

Error_Condition

### 3.1.4 Given

The rider is logged into the app and has not yet granted location permissions

### 3.1.5 When

The rider attempts an action that requires GPS (e.g., tapping the 'Go Online' toggle) and the OS permission prompt appears, and the rider selects 'Deny'

### 3.1.6 Then

A non-dismissible modal or a dedicated screen appears, blocking the previous action. The screen must display a clear message explaining that GPS is required for receiving delivery tasks and navigation. A primary button labeled 'Go to Settings' must be present, which deep-links the user to the app's specific permission settings in the device's OS. The 'Go Online' toggle remains in the 'Offline' state.

### 3.1.7 Validation Notes

Test on both iOS and Android. Verify the deep link navigates to the correct settings page. Verify the rider cannot proceed with the action until permission is granted.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

AC-002

### 3.2.2 Scenario

Rider denies Camera permission when prompted (e.g., for Proof of Delivery)

### 3.2.3 Scenario Type

Error_Condition

### 3.2.4 Given

The rider is on the delivery confirmation screen for a prepaid order requiring photo POD

### 3.2.5 When

The rider taps the 'Take Photo' button and the OS permission prompt appears, and the rider selects 'Deny'

### 3.2.6 Then

A non-dismissible modal or a dedicated screen appears. The screen must display a clear message explaining that camera access is required for Proof of Delivery. A primary button labeled 'Go to Settings' must be present, which deep-links the user to the app's specific permission settings. The rider cannot proceed with capturing the photo.

### 3.2.7 Validation Notes

Test on both iOS and Android. Verify the camera does not open. Verify the deep link works correctly.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

AC-003

### 3.3.2 Scenario

Rider has previously selected 'Deny & Don't Ask Again' for a permission

### 3.3.3 Scenario Type

Edge_Case

### 3.3.4 Given

The rider has previously denied a required permission (GPS or Camera) and selected the 'Don't Ask Again' option

### 3.3.5 When

The rider attempts an action that requires that permission

### 3.3.6 Then

The OS prompt will not appear. The app must immediately display the same informational screen as in AC-001/AC-002, guiding the user to manually enable the permission in their device settings.

### 3.3.7 Validation Notes

This is a critical flow to test. The app must correctly detect this permanent denial state and react without trying to re-prompt.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

AC-004

### 3.4.2 Scenario

Rider grants permission via settings and returns to the app

### 3.4.3 Scenario Type

Alternative_Flow

### 3.4.4 Given

The rider is on the 'permission required' informational screen

### 3.4.5 When

The rider taps 'Go to Settings', enables the required permission in the OS settings, and then navigates back to the rider app

### 3.4.6 Then

The app must automatically detect the change in permission status, dismiss the informational screen, and allow the rider to proceed with their original action (e.g., the 'Go Online' toggle becomes active, or the camera interface opens for POD).

### 3.4.7 Validation Notes

Test the app's lifecycle management. The permission check should happen when the app resumes or comes into the foreground.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

AC-005

### 3.5.2 Scenario

Rider does not grant permission in settings and returns to the app

### 3.5.3 Scenario Type

Alternative_Flow

### 3.5.4 Given

The rider is on the 'permission required' informational screen

### 3.5.5 When

The rider taps 'Go to Settings', does NOT enable the permission, and navigates back to the rider app

### 3.5.6 Then

The informational screen remains visible, and the rider is still blocked from performing the action.

### 3.5.7 Validation Notes

Verify that the app re-checks the permission status upon return and correctly maintains the blocked state.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- Informational Modal/Screen
- Primary Button: 'Go to Settings'
- Descriptive text block for explaining permission necessity

## 4.2.0 User Interactions

- Tapping the 'Go to Settings' button should trigger a deep link to the OS settings for the application.
- The informational screen should block interaction with the underlying feature until the permission state is resolved.

## 4.3.0 Display Requirements

- GPS Denial Message: 'Location access is required to go online, receive new delivery tasks, and use navigation. Please enable location services in your settings.'
- Camera Denial Message: 'Camera access is required to take photos for Proof of Delivery. Please enable camera access in your settings.'

## 4.4.0 Accessibility Needs

- All text on the informational screen must be readable by screen readers.
- The 'Go to Settings' button must have a clear, accessible label.

# 5.0.0 Business Rules

## 5.1.0 Rule Id

### 5.1.1 Rule Id

BR-RDR-PERM-01

### 5.1.2 Rule Description

A rider cannot have an 'Online' status without granting 'Precise Location' (GPS) permission.

### 5.1.3 Enforcement Point

When toggling availability status to 'Online'.

### 5.1.4 Violation Handling

The action is blocked, and the user is presented with the permission explanation screen.

## 5.2.0 Rule Id

### 5.2.1 Rule Id

BR-RDR-PERM-02

### 5.2.2 Rule Description

A rider cannot complete a photo-based Proof of Delivery (POD) without granting Camera permission.

### 5.2.3 Enforcement Point

When initiating the photo capture action for POD.

### 5.2.4 Violation Handling

The action is blocked, and the user is presented with the permission explanation screen.

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-009

#### 6.1.1.2 Dependency Reason

This story handles the failure case for setting availability status, which requires GPS.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

RDR-022

#### 6.1.2.2 Dependency Reason

This story handles the failure case for capturing a photo POD, which requires the Camera.

## 6.2.0.0 Technical Dependencies

- React Native permission handling library (e.g., 'react-native-permissions').
- Platform-specific code (iOS/Android) for deep-linking to app settings.

## 6.3.0.0 Data Dependencies

*No items available*

## 6.4.0.0 External Dependencies

- Depends on the device's Operating System (iOS/Android) to provide the permission prompts and settings pages.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- The permission check and display of the informational screen should feel instantaneous to the user (<200ms).

## 7.2.0.0 Security

- The app should only request permissions in the context of a user-initiated action that requires them.

## 7.3.0.0 Usability

- The explanation text must be simple, clear, and justify the need for the permission in terms of user benefit (e.g., 'to get new orders').

## 7.4.0.0 Accessibility

- The informational screen must comply with WCAG 2.1 Level AA standards for mobile applications.

## 7.5.0.0 Compatibility

- The permission handling logic must be compatible with the target versions of iOS and Android specified for the project.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Requires platform-specific implementation for deep-linking to settings on both iOS and Android.
- Handling the 'Deny & Don't Ask Again' state requires careful state management.
- Managing the app's lifecycle (checking permissions when the app returns to the foreground) adds complexity.
- Testing requires physical devices and manual manipulation of OS-level settings.

## 8.3.0.0 Technical Risks

- Changes in future iOS or Android versions could break the permission handling or deep-linking logic.
- Inconsistent behavior across different Android manufacturers' customized OS versions.

## 8.4.0.0 Integration Points

- Integrates with the device's Operating System for permission management.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E (Manual)

## 9.2.0.0 Test Scenarios

- Deny GPS permission on first request.
- Deny Camera permission on first request.
- Attempt action after 'Deny & Don't Ask Again' for GPS.
- Attempt action after 'Deny & Don't Ask Again' for Camera.
- Full loop: Deny -> Go to Settings -> Grant -> Return to App -> Verify success.
- Full loop: Deny -> Go to Settings -> Do Nothing -> Return to App -> Verify blocked state remains.

## 9.3.0.0 Test Data Needs

- A test rider account.
- A test order assigned to the rider that requires photo POD.

## 9.4.0.0 Testing Tools

- Physical iOS and Android devices are required for manual testing of OS-level interactions.

# 10.0.0.0 Definition Of Done

- All acceptance criteria validated and passing on both iOS and Android.
- Code reviewed and approved by at least one peer.
- Unit tests for permission-checking logic are implemented and passing.
- Manual E2E testing of all permission flows has been completed and signed off by QA.
- User interface and copy text reviewed and approved by UX/Product.
- No crashes or unhandled states related to permission denial.
- Accessibility requirements for the informational screen are verified.
- Story deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

5

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a foundational story for rider app usability. It should be prioritized before or alongside the features that depend on these permissions.
- Requires significant manual testing time on physical devices for both platforms.

## 11.4.0.0 Release Impact

Critical for the initial release to ensure a stable and user-friendly experience for riders. A failure in this area will lead to high rates of rider churn and support requests.

