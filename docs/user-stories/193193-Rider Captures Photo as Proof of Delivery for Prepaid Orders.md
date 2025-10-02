# 1 Story Metadata

| Property | Value |
|----------|-------|
| Story Id | RDR-022 |
| Elaboration Date | 2024-10-27 |
| Development Readiness | Complete |

# 2 Story Narrative

| Property | Value |
|----------|-------|
| Title | Rider Captures Photo as Proof of Delivery for Prep... |
| As A User Story | As a Rider, I want to capture and upload a photo o... |
| User Persona | Rider |
| Business Value | Reduces financial loss from fraudulent 'item not r... |
| Functional Area | Rider-Facing Features |
| Story Theme | Delivery Execution & Proof of Delivery |

# 3 Acceptance Criteria

## 3.1 Criteria Id

### 3.1.1 Criteria Id

RDR-022-AC-01

### 3.1.2 Scenario

Happy Path: Successful Photo Capture and Upload for Prepaid Order

### 3.1.3 Scenario Type

Happy_Path

### 3.1.4 Given

a Rider is logged in, has an active prepaid order, and has updated the status to 'Arrived at Destination'

### 3.1.5 When

the Rider is prompted to provide Proof of Delivery (POD)

### 3.1.6 Then

the app presents an option to 'Take Photo'.

### 3.1.7 And

after a successful upload, the Rider can proceed to mark the order as 'Delivered'.

### 3.1.8 Validation Notes

Verify the photo is visible in the admin dashboard for the specific order. Check the database to confirm the timestamp and GPS coordinates are stored correctly against the order record.

## 3.2.0 Criteria Id

### 3.2.1 Criteria Id

RDR-022-AC-02

### 3.2.2 Scenario

Error Condition: Camera Permission is Denied

### 3.2.3 Scenario Type

Error_Condition

### 3.2.4 Given

a Rider is at the POD step for a prepaid order

### 3.2.5 And

the Rider cannot proceed to complete the delivery until permission is granted and a photo is captured.

### 3.2.6 When

the Rider attempts to take a photo

### 3.2.7 Then

the app must display a clear message explaining why camera access is required for POD.

### 3.2.8 Validation Notes

Test by revoking camera permissions for the app in the OS settings and then attempting the POD flow. Verify the explanatory message is shown.

## 3.3.0 Criteria Id

### 3.3.1 Criteria Id

RDR-022-AC-03

### 3.3.2 Scenario

Edge Case: Photo Upload Fails Due to Poor Network

### 3.3.3 Scenario Type

Edge_Case

### 3.3.4 Given

a Rider has captured a POD photo

### 3.3.5 And

the Rider must be able to proceed with marking the order as 'Delivered' in the app to not delay their next task.

### 3.3.6 When

the Rider taps 'Confirm' to upload the photo

### 3.3.7 Then

the app must display a non-blocking notification that the upload has been queued.

### 3.3.8 Validation Notes

Use network throttling tools to simulate a lost connection. Verify the photo is eventually uploaded once the connection is restored. Check server logs for the delayed upload.

## 3.4.0 Criteria Id

### 3.4.1 Criteria Id

RDR-022-AC-04

### 3.4.2 Scenario

Alternative Flow: Rider Retakes a Photo

### 3.4.3 Scenario Type

Alternative_Flow

### 3.4.4 Given

a Rider has captured a POD photo and is on the preview screen

### 3.4.5 When

the Rider determines the photo is blurry or inadequate and taps 'Retake'

### 3.4.6 Then

the preview is discarded and the native camera interface is immediately reopened.

### 3.4.7 And

the Rider can capture a new photo.

### 3.4.8 Validation Notes

Capture a photo, tap 'Retake', and ensure the camera view is presented again without any errors.

## 3.5.0 Criteria Id

### 3.5.1 Criteria Id

RDR-022-AC-05

### 3.5.2 Scenario

Security: POD Photo Storage and Access

### 3.5.3 Scenario Type

Happy_Path

### 3.5.4 Given

a POD photo has been successfully uploaded for an order

### 3.5.5 When

an Administrator views the order details in the admin dashboard

### 3.5.6 Then

the Administrator can view the associated POD photo.

### 3.5.7 And

the photo must be subject to the 90-day data retention policy (as per REQ-NFR-007).

### 3.5.8 Validation Notes

Verify S3 bucket policies are private. Check that the URL used to display the image in the admin panel is a pre-signed URL with a short expiry. Confirm a scheduled job exists to delete photos older than 90 days.

# 4.0.0 User Interface Requirements

## 4.1.0 Ui Elements

- A prominent 'Take Proof of Delivery Photo' button on the delivery completion screen.
- A camera preview screen after photo capture.
- Clearly labeled 'Confirm' and 'Retake' buttons.
- A non-blocking progress indicator (e.g., spinner) during photo upload.
- User-friendly notifications for upload success, queuing, and failure.

## 4.2.0 User Interactions

- Tapping the button launches the camera.
- Standard camera interactions (capture, flash toggle).
- Tapping 'Confirm' initiates upload and proceeds the workflow.
- Tapping 'Retake' discards the current photo and returns to the camera view.

## 4.3.0 Display Requirements

- The prompt for POD should only appear for order types configured to require it (e.g., prepaid orders).

## 4.4.0 Accessibility Needs

- All buttons and interactive elements must have ARIA labels for screen readers, compliant with WCAG 2.1 Level AA (REQ-INT-001).

# 5.0.0 Business Rules

- {'rule_id': 'BR-POD-001', 'rule_description': 'Photo Proof of Delivery is mandatory for all prepaid orders by default.', 'enforcement_point': "At the 'Arrived at Destination' status update in the Rider App.", 'violation_handling': "The Rider cannot transition the order to the 'Delivered' state without successfully capturing and queuing a POD photo for upload."}

# 6.0.0 Dependencies

## 6.1.0 Prerequisite Stories

### 6.1.1 Story Id

#### 6.1.1.1 Story Id

RDR-018

#### 6.1.1.2 Dependency Reason

The 'Arrived at Destination' status update is the trigger for initiating the POD workflow.

### 6.1.2.0 Story Id

#### 6.1.2.1 Story Id

RDR-019

#### 6.1.2.2 Dependency Reason

The 'Delivered' status update is the next step in the workflow after a successful POD capture.

### 6.1.3.0 Story Id

#### 6.1.3.1 Story Id

ADM-017

#### 6.1.3.2 Dependency Reason

This story provides the administrative configuration to define which order types require photo POD, which this story's logic will depend on.

## 6.2.0.0 Technical Dependencies

- Rider mobile application framework (React Native).
- Native module for camera and GPS access (e.g., react-native-vision-camera, react-native-geolocation-service).
- Backend Order Management service API to associate the photo with an order.
- AWS S3 for secure object storage.
- Backend logic to generate pre-signed S3 upload URLs.

## 6.3.0.0 Data Dependencies

- The order record must have a flag indicating if it's prepaid or requires photo POD.

## 6.4.0.0 External Dependencies

- Device Operating System for camera and GPS hardware access and permissions.

# 7.0.0.0 Non Functional Requirements

## 7.1.0.0 Performance

- Camera interface must launch in under 2 seconds.
- Photo upload process must be asynchronous and not block the UI.
- Client-side image compression should be used to reduce file size by at least 50% without significant quality loss, optimizing for mobile networks.

## 7.2.0.0 Security

- All communication must be over HTTPS/TLS 1.2+.
- Photos must be stored in a private AWS S3 bucket with encryption at rest (AWS KMS).
- Access to photos must be controlled via short-lived, pre-signed URLs generated by the backend for authorized users only (e.g., Admins).
- Photos must be deleted after 90 days as per the data retention policy (REQ-NFR-007).

## 7.3.0.0 Usability

- The process of taking and confirming a photo should require a minimal number of taps.
- Feedback to the rider about the upload status must be immediate and clear.

## 7.4.0.0 Accessibility

- Must comply with WCAG 2.1 Level AA standards (REQ-INT-001).

## 7.5.0.0 Compatibility

- Must be functional on the supported range of iOS and Android devices and OS versions.

# 8.0.0.0 Implementation Considerations

## 8.1.0.0 Complexity Assessment

Medium

## 8.2.0.0 Complexity Factors

- Integration with native device hardware (camera, GPS) via React Native.
- Implementing a robust offline-first upload mechanism with a background queue and retry logic.
- Secure handling of file uploads to S3 using pre-signed URLs.
- Managing OS-level permissions for camera and location.

## 8.3.0.0 Technical Risks

- Inconsistencies in camera behavior across different Android device manufacturers.
- Background processes for retrying uploads being killed by the OS, leading to data loss.
- Potential for high storage costs if images are not properly compressed and old images are not purged.

## 8.4.0.0 Integration Points

- Order Management Service: To update the order with POD metadata (URL, timestamp, location).
- AWS S3: For file storage.
- Admin Backend: To retrieve and display the POD photo for support cases.

# 9.0.0.0 Testing Requirements

## 9.1.0.0 Testing Types

- Unit
- Integration
- E2E
- Usability
- Security
- Performance

## 9.2.0.0 Test Scenarios

- Successful photo capture and upload on a stable network.
- Photo capture and upload on a throttled/unstable network.
- App behavior when camera/location permissions are denied and then granted.
- Retake photo functionality.
- Verify photo and metadata in the admin panel after upload.
- Verify photo is inaccessible via direct URL without a valid signature.

## 9.3.0.0 Test Data Needs

- Test accounts for a Rider and an Administrator.
- Prepaid orders created in the system assigned to the test Rider.

## 9.4.0.0 Testing Tools

- Jest/React Testing Library for unit tests.
- Appium or Detox for E2E automation.
- Browser/network developer tools for network throttling simulation.

# 10.0.0.0 Definition Of Done

- All acceptance criteria are validated and passing on target devices.
- Code has been peer-reviewed and merged into the main branch.
- Unit and integration tests are written and achieve >80% code coverage.
- E2E automated tests for the happy path and permission denial flow are passing.
- The offline upload queue has been manually tested and verified.
- Security review confirms secure storage and access control for photos.
- Performance of camera launch and upload speed meets requirements.
- All UI elements are compliant with accessibility standards.
- The feature is deployed and verified in the staging environment.

# 11.0.0.0 Planning Information

## 11.1.0.0 Story Points

8

## 11.2.0.0 Priority

🔴 High

## 11.3.0.0 Sprint Considerations

- This is a critical feature for mitigating financial risk and must be completed before launching prepaid orders widely.
- Requires testing on a range of physical iOS and Android devices due to hardware interaction.
- The backend work for generating pre-signed URLs and storing metadata should be coordinated within the same sprint.

## 11.4.0.0 Release Impact

Enables the platform to securely handle prepaid orders and manage delivery disputes effectively. A blocker for expanding payment options.

