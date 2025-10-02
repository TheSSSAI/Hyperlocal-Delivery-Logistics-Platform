# 1 Overview

## 1.1 Diagram Id

SEQ-UJ-003

## 1.2 Name

Rider Executes a Delivery Task

## 1.3 Description

The complete user journey for a rider after accepting a task, from navigating to the vendor to completing the delivery with Proof of Delivery (POD).

## 1.4 Type

🔹 UserJourney

## 1.5 Purpose

To define the primary workflow within the rider mobile application.

## 1.6 Complexity

Medium

## 1.7 Priority

🚨 Critical

## 1.8 Frequency

OnDemand

## 1.9 Participants

- REPO-FE-RIDER
- REPO-BE-LOGISTICS

## 1.10 Key Interactions

- Rider accepts a task.
- Rider app displays vendor location and provides in-app navigation.
- Rider taps 'Arrived at Store'.
- Rider taps 'Picked Up'.
- Rider app displays customer location and provides navigation.
- Rider taps 'Arrived at Destination'.
- Rider collects POD (photo or customer OTP) as required by the order type.
- Rider taps 'Delivered'.
- Each status update is sent to the Logistics Service, which notifies the customer.

## 1.11 Triggers

- A rider accepts a new delivery task.

## 1.12 Outcomes

- The order is successfully transported from vendor to customer.
- The order status is updated in real-time at each step.
- A valid Proof of Delivery is captured and stored.

## 1.13 Business Rules

- Riders must update the status at each stage of the delivery (REQ-FUN-014).
- Proof of Delivery (photo or OTP) is mandatory (REQ-FUN-015).

## 1.14 Error Scenarios

- Rider cannot find the customer's address.
- Customer is unavailable to provide OTP for delivery confirmation.

## 1.15 Integration Points

- Mapbox for navigation.
- Device camera for photo POD.

# 2.0 Details

## 2.1 Diagram Id

SEQ-UJ-003

## 2.2 Name

Implementation: Rider Executes a Delivery Task

## 2.3 Description

Defines the complete technical sequence for a rider executing a delivery task. It covers all user interactions within the Rider Mobile App and the corresponding API calls to the Logistics Service, including state transitions, navigation, and Proof of Delivery (POD) capture, as per REQ-FUN-014 and REQ-FUN-015.

## 2.4 Participants

### 2.4.1 Client Application

#### 2.4.1.1 Repository Id

REPO-FE-RIDER

#### 2.4.1.2 Display Name

Rider Mobile App

#### 2.4.1.3 Type

🔹 Client Application

#### 2.4.1.4 Technology

React Native v0.73+ with Redux Toolkit

#### 2.4.1.5 Order

1

#### 2.4.1.6 Style

| Property | Value |
|----------|-------|
| Shape | actor |
| Color | #3498DB |
| Stereotype | <<Frontend>> |

### 2.4.2.0 Microservice

#### 2.4.2.1 Repository Id

REPO-BE-LOGISTICS

#### 2.4.2.2 Display Name

Rider Logistics Service

#### 2.4.2.3 Type

🔹 Microservice

#### 2.4.2.4 Technology

NestJS v10.3+ on Node.js v18.18+

#### 2.4.2.5 Order

2

#### 2.4.2.6 Style

| Property | Value |
|----------|-------|
| Shape | component |
| Color | #2ECC71 |
| Stereotype | <<Backend>> |

## 2.5.0.0 Interactions

### 2.5.1.0 API Call

#### 2.5.1.1 Source Id

REPO-FE-RIDER

#### 2.5.1.2 Target Id

REPO-BE-LOGISTICS

#### 2.5.1.3 Message

1. Fetch assigned task details and initial route

#### 2.5.1.4 Sequence Number

1

#### 2.5.1.5 Type

🔹 API Call

#### 2.5.1.6 Is Synchronous

✅ Yes

#### 2.5.1.7 Return Message

2. Respond with task details (vendor/customer info, POD type) and optimized route to vendor

#### 2.5.1.8 Has Return

✅ Yes

#### 2.5.1.9 Is Activation

✅ Yes

#### 2.5.1.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS/REST |
| Method | GET /api/v1/rider/tasks/active |
| Parameters | N/A |
| Authentication | Required: Authorization header with Bearer JWT |
| Error Handling | Handle 404 (No active task), 401 (Unauthorized), 5... |
| Performance | P95 Latency < 300ms. Response payload includes bot... |

### 2.5.2.0 UI Interaction

#### 2.5.2.1 Source Id

REPO-FE-RIDER

#### 2.5.2.2 Target Id

REPO-FE-RIDER

#### 2.5.2.3 Message

3. Render 'DeliveryTaskScreen' and display navigation to Vendor using Mapbox SDK

#### 2.5.2.4 Sequence Number

2

#### 2.5.2.5 Type

🔹 UI Interaction

#### 2.5.2.6 Is Synchronous

✅ Yes

#### 2.5.2.7 Return Message



#### 2.5.2.8 Has Return

❌ No

#### 2.5.2.9 Is Activation

❌ No

#### 2.5.2.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | Internal Component Logic |
| Method | updateState('NAVIGATING_TO_VENDOR') |
| Parameters | Task data from API response |
| Authentication | N/A |
| Error Handling | Gracefully handle cases where Mapbox SDK fails to ... |
| Performance | UI should render in < 500ms after API response. |

### 2.5.3.0 API Call

#### 2.5.3.1 Source Id

REPO-FE-RIDER

#### 2.5.3.2 Target Id

REPO-BE-LOGISTICS

#### 2.5.3.3 Message

4. Rider taps 'Arrived at Store'. Send status update.

#### 2.5.3.4 Sequence Number

3

#### 2.5.3.5 Type

🔹 API Call

#### 2.5.3.6 Is Synchronous

✅ Yes

#### 2.5.3.7 Return Message

5. Acknowledge status update (200 OK)

#### 2.5.3.8 Has Return

✅ Yes

#### 2.5.3.9 Is Activation

✅ Yes

#### 2.5.3.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS/REST |
| Method | PATCH /api/v1/rider/tasks/{taskId}/status |
| Parameters | Path: {taskId}, Body: { "status": "ARRIVED_AT_STOR... |
| Authentication | Required: Authorization header with Bearer JWT |
| Error Handling | Implement client-side retry with exponential backo... |
| Performance | P95 Latency < 200ms. |

### 2.5.4.0 API Call

#### 2.5.4.1 Source Id

REPO-FE-RIDER

#### 2.5.4.2 Target Id

REPO-BE-LOGISTICS

#### 2.5.4.3 Message

6. Rider taps 'Picked Up'. Send status update.

#### 2.5.4.4 Sequence Number

4

#### 2.5.4.5 Type

🔹 API Call

#### 2.5.4.6 Is Synchronous

✅ Yes

#### 2.5.4.7 Return Message

7. Acknowledge status update (200 OK)

#### 2.5.4.8 Has Return

✅ Yes

#### 2.5.4.9 Is Activation

✅ Yes

#### 2.5.4.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS/REST |
| Method | PATCH /api/v1/rider/tasks/{taskId}/status |
| Parameters | Path: {taskId}, Body: { "status": "PICKED_UP", "lo... |
| Authentication | Required: Authorization header with Bearer JWT |
| Error Handling | Same as previous status update. This action is a c... |
| Performance | P95 Latency < 200ms. |

### 2.5.5.0 UI Interaction

#### 2.5.5.1 Source Id

REPO-FE-RIDER

#### 2.5.5.2 Target Id

REPO-FE-RIDER

#### 2.5.5.3 Message

8. Update UI to display navigation to Customer

#### 2.5.5.4 Sequence Number

5

#### 2.5.5.5 Type

🔹 UI Interaction

#### 2.5.5.6 Is Synchronous

✅ Yes

#### 2.5.5.7 Return Message



#### 2.5.5.8 Has Return

❌ No

#### 2.5.5.9 Is Activation

❌ No

#### 2.5.5.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | Internal Component Logic |
| Method | updateState('NAVIGATING_TO_CUSTOMER') |
| Parameters | Task data containing customer address |
| Authentication | N/A |
| Error Handling | Handle potential errors from the Mapbox SDK. |
| Performance | UI transition should be immediate. |

### 2.5.6.0 API Call

#### 2.5.6.1 Source Id

REPO-FE-RIDER

#### 2.5.6.2 Target Id

REPO-BE-LOGISTICS

#### 2.5.6.3 Message

9. Rider taps 'Arrived at Destination'. Send status update.

#### 2.5.6.4 Sequence Number

6

#### 2.5.6.5 Type

🔹 API Call

#### 2.5.6.6 Is Synchronous

✅ Yes

#### 2.5.6.7 Return Message

10. Acknowledge status update (200 OK)

#### 2.5.6.8 Has Return

✅ Yes

#### 2.5.6.9 Is Activation

✅ Yes

#### 2.5.6.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS/REST |
| Method | PATCH /api/v1/rider/tasks/{taskId}/status |
| Parameters | Path: {taskId}, Body: { "status": "ARRIVED_AT_DEST... |
| Authentication | Required: Authorization header with Bearer JWT |
| Error Handling | Implement client-side retry with exponential backo... |
| Performance | P95 Latency < 200ms. |

### 2.5.7.0 Conditional Flow

#### 2.5.7.1 Source Id

REPO-FE-RIDER

#### 2.5.7.2 Target Id

REPO-FE-RIDER

#### 2.5.7.3 Message

11. Rider initiates POD. App checks required POD type (Photo or OTP) from task data.

#### 2.5.7.4 Sequence Number

7

#### 2.5.7.5 Type

🔹 Conditional Flow

#### 2.5.7.6 Is Synchronous

✅ Yes

#### 2.5.7.7 Return Message



#### 2.5.7.8 Has Return

❌ No

#### 2.5.7.9 Is Activation

❌ No

#### 2.5.7.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | Internal Logic |
| Method | if (task.podType === 'PHOTO') { ... } else if (tas... |
| Parameters | task.podType |
| Authentication | N/A |
| Error Handling | If podType is unknown, default to Photo and log a ... |
| Performance | N/A |

#### 2.5.7.11 Nested Interactions

##### 2.5.7.11.1 API Call

###### 2.5.7.11.1.1 Source Id

REPO-FE-RIDER

###### 2.5.7.11.1.2 Target Id

REPO-BE-LOGISTICS

###### 2.5.7.11.1.3 Message

12a. [IF PHOTO] Capture photo, upload image, and submit POD.

###### 2.5.7.11.1.4 Sequence Number

8

###### 2.5.7.11.1.5 Type

🔹 API Call

###### 2.5.7.11.1.6 Is Synchronous

✅ Yes

###### 2.5.7.11.1.7 Return Message

13a. Respond with image URL and confirmation (201 Created)

###### 2.5.7.11.1.8 Has Return

✅ Yes

###### 2.5.7.11.1.9 Is Activation

✅ Yes

###### 2.5.7.11.1.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS/REST |
| Method | POST /api/v1/rider/tasks/{taskId}/pod |
| Parameters | Path: {taskId}, Body: Multipart/form-data containi... |
| Authentication | Required: Authorization header with Bearer JWT |
| Error Handling | Handle image compression failure on client. Handle... |
| Performance | Upload should show progress indicator. API respons... |

##### 2.5.7.11.2.0 API Call

###### 2.5.7.11.2.1 Source Id

REPO-FE-RIDER

###### 2.5.7.11.2.2 Target Id

REPO-BE-LOGISTICS

###### 2.5.7.11.2.3 Message

12b. [IF OTP] Rider enters 4-digit OTP from customer. Submit for validation.

###### 2.5.7.11.2.4 Sequence Number

9

###### 2.5.7.11.2.5 Type

🔹 API Call

###### 2.5.7.11.2.6 Is Synchronous

✅ Yes

###### 2.5.7.11.2.7 Return Message

13b. Respond with validation result (200 OK or 400 Invalid OTP)

###### 2.5.7.11.2.8 Has Return

✅ Yes

###### 2.5.7.11.2.9 Is Activation

✅ Yes

###### 2.5.7.11.2.10 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS/REST |
| Method | POST /api/v1/rider/tasks/{taskId}/pod |
| Parameters | Path: {taskId}, Body: { "type": "OTP", "value": "1... |
| Authentication | Required: Authorization header with Bearer JWT |
| Error Handling | If 400 is received, app displays 'Invalid OTP, ple... |
| Performance | P95 Latency < 250ms. |

### 2.5.8.0.0.0 API Call

#### 2.5.8.1.0.0 Source Id

REPO-FE-RIDER

#### 2.5.8.2.0.0 Target Id

REPO-BE-LOGISTICS

#### 2.5.8.3.0.0 Message

14. Rider taps 'Delivered' after successful POD. Send final status update.

#### 2.5.8.4.0.0 Sequence Number

10

#### 2.5.8.5.0.0 Type

🔹 API Call

#### 2.5.8.6.0.0 Is Synchronous

✅ Yes

#### 2.5.8.7.0.0 Return Message

15. Acknowledge final status, marking task complete (200 OK)

#### 2.5.8.8.0.0 Has Return

✅ Yes

#### 2.5.8.9.0.0 Is Activation

✅ Yes

#### 2.5.8.10.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | HTTPS/REST |
| Method | PATCH /api/v1/rider/tasks/{taskId}/status |
| Parameters | Path: {taskId}, Body: { "status": "DELIVERED", "lo... |
| Authentication | Required: Authorization header with Bearer JWT |
| Error Handling | If POD was not successfully submitted, backend ret... |
| Performance | P95 Latency < 200ms. |

### 2.5.9.0.0.0 UI Interaction

#### 2.5.9.1.0.0 Source Id

REPO-FE-RIDER

#### 2.5.9.2.0.0 Target Id

REPO-FE-RIDER

#### 2.5.9.3.0.0 Message

16. Display 'Delivery Complete' confirmation and return to task list/home screen.

#### 2.5.9.4.0.0 Sequence Number

11

#### 2.5.9.5.0.0 Type

🔹 UI Interaction

#### 2.5.9.6.0.0 Is Synchronous

✅ Yes

#### 2.5.9.7.0.0 Return Message



#### 2.5.9.8.0.0 Has Return

❌ No

#### 2.5.9.9.0.0 Is Activation

❌ No

#### 2.5.9.10.0.0 Technical Details

| Property | Value |
|----------|-------|
| Protocol | Internal Component Logic |
| Method | updateState('IDLE'); navigate('HomeScreen') |
| Parameters | N/A |
| Authentication | N/A |
| Error Handling | N/A |
| Performance | UI transition should be immediate. |

## 2.6.0.0.0.0 Notes

### 2.6.1.0.0.0 Content

#### 2.6.1.1.0.0 Content

Backend Responsibility: Upon receiving each status update (e.g., 'PICKED_UP', 'DELIVERED'), the Logistics Service is responsible for emitting a domain event (e.g., `DeliveryStatusUpdated`) via SNS/SQS. The Notifications Service consumes this event to send real-time updates to the customer, as per REQ-FUN-014.

#### 2.6.1.2.0.0 Position

TopRight

#### 2.6.1.3.0.0 Participant Id

REPO-BE-LOGISTICS

#### 2.6.1.4.0.0 Sequence Number

3

### 2.6.2.0.0.0 Content

#### 2.6.2.1.0.0 Content

State Management: The Rider App must maintain the current state of the delivery task robustly (e.g., using Redux Persist) to handle app closures or network interruptions gracefully. The app should always sync with the backend upon launch to fetch the latest state of the active task.

#### 2.6.2.2.0.0 Position

TopLeft

#### 2.6.2.3.0.0 Participant Id

REPO-FE-RIDER

#### 2.6.2.4.0.0 Sequence Number

1

### 2.6.3.0.0.0 Content

#### 2.6.3.1.0.0 Content

POD Metadata: As per REQ-FUN-015, all POD submissions must include the GPS coordinates and a precise timestamp of the capture location for audit and dispute resolution purposes.

#### 2.6.3.2.0.0 Position

Bottom

#### 2.6.3.3.0.0 Participant Id

*Not specified*

#### 2.6.3.4.0.0 Sequence Number

7

## 2.7.0.0.0.0 Implementation Guidance

| Property | Value |
|----------|-------|
| Security Requirements | All API endpoints must be protected and require a ... |
| Performance Targets | UI responsiveness is critical. API calls for statu... |
| Error Handling Strategy | The Rider App must implement a global API error ha... |
| Testing Considerations | End-to-end testing using a framework like Cypress ... |
| Monitoring Requirements | Frontend: Log key user interactions (button taps f... |
| Deployment Considerations | The API contract between the Rider App and Logisti... |

