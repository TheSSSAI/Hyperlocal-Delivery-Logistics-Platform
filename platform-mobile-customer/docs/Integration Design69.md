# 1 Integration Specifications

## 1.1 Extraction Metadata

| Property | Value |
|----------|-------|
| Repository Id | REPO-FE-CUST |
| Extraction Timestamp | 2024-05-24T10:00:00Z |
| Mapping Validation Score | 100% |
| Context Completeness Score | 100% |
| Implementation Readiness Level | High |

## 1.2 Relevant Requirements

### 1.2.1 Requirement Id

#### 1.2.1.1 Requirement Id

REQ-1-002

#### 1.2.1.2 Requirement Text

The system shall provide four distinct client applications: a mobile application for Customers, a web-based dashboard for Vendors, a mobile application for Riders, and a web-based dashboard for platform Administrators.

#### 1.2.1.3 Validation Criteria

- Confirm the existence and accessibility of a customer mobile app.

#### 1.2.1.4 Implementation Implications

- This repository is the single source of truth for the customer mobile application.
- The application must be built using React Native to target both iOS and Android platforms.
- The application's sole purpose is to serve the 'Customer' user class.

#### 1.2.1.5 Extraction Reasoning

This requirement directly mandates the existence of the customer mobile application, which is the exclusive purpose of this repository.

### 1.2.2.0 Requirement Id

#### 1.2.2.1 Requirement Id

REQ-1-009

#### 1.2.2.2 Requirement Text

The system shall implement a 'Customer' user role with the following permissions: Create, Read, and Update their own user profile and saved addresses; Read-only access to vendor profiles and product catalogs; Create and Read access to their own orders; and Create access for ratings and reviews on completed orders.

#### 1.2.2.3 Validation Criteria

- Log in as a Customer and verify the ability to edit profile information and manage addresses.
- Verify that a Customer can browse vendors and products.
- Verify that a Customer can place an order and view their order history.
- Verify that a Customer can submit a rating/review for a delivered order.

#### 1.2.2.4 Implementation Implications

- The repository must contain UI screens and logic for profile management, address management, vendor/product discovery, order placement, and order history/ratings.
- All functionality must be scoped to the authenticated customer's own data.
- The application must consume backend APIs that provide the data for these features.

#### 1.2.2.5 Extraction Reasoning

This requirement defines the complete functional scope of the customer role, which this mobile application must implement.

### 1.2.3.0 Requirement Id

#### 1.2.3.1 Requirement Id

REQ-1-059

#### 1.2.3.2 Requirement Text

The system shall provide live order tracking for customers. Once an order's status is updated to 'In Transit' (picked up by a rider), the customer's order tracking screen must display a map view showing the rider's real-time location. The rider's position on the map must be updated automatically at an interval of 5 to 10 seconds.

#### 1.2.3.3 Validation Criteria

- As the customer for that order, open the tracking screen.
- Verify a map is displayed showing the rider's icon.
- Verify the icon's position on the map updates periodically to reflect the rider's movement.

#### 1.2.3.4 Implementation Implications

- The application must integrate a mapping library (e.g., 'react-native-maps' with Mapbox).
- It must establish a real-time connection (WebSocket) to receive location updates for a specific order.
- The UI must include a dedicated order tracking screen with a map component that can render and animate the rider's location marker.

#### 1.2.3.5 Extraction Reasoning

This requirement details a key post-purchase feature (live tracking) that is a primary responsibility of the customer mobile application.

### 1.2.4.0 Requirement Id

#### 1.2.4.1 Requirement Id

REQ-1-081

#### 1.2.4.2 Requirement Text

The system shall provide two communication channels. First, an in-app chat for active orders, enabling communication between the customer and the vendor, and between the customer and the assigned rider. This chat must support predefined quick-reply templates.

#### 1.2.4.3 Validation Criteria

- For an active order, verify the customer can send a message to the vendor and the rider.

#### 1.2.4.4 Implementation Implications

- The application must include a chat screen UI.
- It must integrate with a real-time WebSocket service to send and receive messages.
- Logic is needed to determine the correct chat room based on the active order context (vendor or rider).

#### 1.2.4.5 Extraction Reasoning

This requirement specifies the in-app chat feature, a core real-time communication component that this repository must implement.

### 1.2.5.0 Requirement Id

#### 1.2.5.1 Requirement Id

REQ-1-087

#### 1.2.5.2 Requirement Text

The customer and rider mobile applications shall implement basic offline support. When the device has no internet connectivity, users must still be able to view locally cached data, such as their order history, profile information, or items currently in the cart.

#### 1.2.5.3 Validation Criteria

- Open the customer app and view order history.
- Enable airplane mode on the device.
- Re-open the app and navigate to the order history screen. Verify the previously viewed data is still visible.

#### 1.2.5.4 Implementation Implications

- A client-side persistence strategy (e.g., Redux Persist with MMKV/AsyncStorage) is required to cache data.
- The application must have a global network status listener.
- UI components must be designed to render cached data gracefully and indicate the offline status.

#### 1.2.5.5 Extraction Reasoning

This non-functional requirement dictates a key architectural pattern for the application to handle common network unreliability in its target market.

## 1.3.0.0 Relevant Components

- {'component_name': 'Customer Mobile App (React Native)', 'component_specification': "The primary client application for the 'Customer' user class. It provides the user interface for all customer-facing functionalities, including discovery, ordering, tracking, and feedback. It is built using React Native and interacts with the backend exclusively through the API Gateway.", 'implementation_requirements': ['Implement using React Native v0.73+ as per REQ-1-111.', 'Manage application state using a library like Redux Toolkit or Zustand.', "Use 'react-native-maps' for all mapping functionalities, configured with Mapbox.", "Handle user authentication flow, including secure storage of JWTs using 'react-native-keychain'.", 'Request and handle device permissions for GPS (location) as per REQ-1-089.', "Implement offline data caching using 'redux-persist' and a performant storage engine like MMKV."], 'architectural_context': "This component resides in the 'Presentation Layer' of the microservices architecture. It is one of the four required client applications.", 'extraction_reasoning': "This repository is the sole implementation of the 'Customer Mobile App' component, making this the central and only relevant component mapping."}

## 1.4.0.0 Architectural Layers

- {'layer_name': 'Presentation Layer (Clients)', 'layer_responsibilities': 'Provide user interfaces for each user role (Customer, Vendor, Rider, Admin), render data received from the backend, manage client-side state, handle user authentication flows, and request necessary hardware permissions.', 'layer_constraints': ['Must not contain any business logic that is not directly related to UI presentation.', 'All backend communication must go through the API Gateway Layer.', 'Must adhere to the defined technology stack (React Native for mobile, React.js for web).'], 'implementation_patterns': ['State Management (Redux/Zustand)', 'Component-Based Architecture', 'API Client Abstraction'], 'extraction_reasoning': 'This repository is a primary component of the Presentation Layer, responsible for implementing the customer-facing UI and experience as defined by the architecture.'}

## 1.5.0.0 Dependency Interfaces

### 1.5.1.0 Interface Name

#### 1.5.1.1 Interface Name

IApiClient

#### 1.5.1.2 Source Repository

REPO-API-CLIENT

#### 1.5.1.3 Method Contracts

##### 1.5.1.3.1 Method Name

###### 1.5.1.3.1.1 Method Name

requestOtp

###### 1.5.1.3.1.2 Method Signature

requestOtp(payload: RequestOtpDTO): Promise<void>

###### 1.5.1.3.1.3 Method Purpose

Initiates the registration or login process by requesting an OTP for a given mobile number.

###### 1.5.1.3.1.4 Integration Context

Called from the Login/Registration screen.

##### 1.5.1.3.2.0 Method Name

###### 1.5.1.3.2.1 Method Name

verifyOtp

###### 1.5.1.3.2.2 Method Signature

verifyOtp(payload: VerifyOtpDTO): Promise<AuthTokensDTO>

###### 1.5.1.3.2.3 Method Purpose

Verifies the OTP to complete registration or login and returns JWTs.

###### 1.5.1.3.2.4 Integration Context

Called from the OTP verification screen.

##### 1.5.1.3.3.0 Method Name

###### 1.5.1.3.3.1 Method Name

getNearbyVendors

###### 1.5.1.3.3.2 Method Signature

getNearbyVendors(location: { lat: number, lng: number }): Promise<PaginatedResult<VendorSummaryDTO>>

###### 1.5.1.3.3.3 Method Purpose

Fetches a list of available vendors based on the user's current geographical location.

###### 1.5.1.3.3.4 Integration Context

Called on the main discovery/home screen.

##### 1.5.1.3.4.0 Method Name

###### 1.5.1.3.4.1 Method Name

search

###### 1.5.1.3.4.2 Method Signature

search(query: string, filters: SearchFilters): Promise<SearchResultsDTO>

###### 1.5.1.3.4.3 Method Purpose

Performs a search for vendors or products with optional filters.

###### 1.5.1.3.4.4 Integration Context

Called from the search bar and filter components.

##### 1.5.1.3.5.0 Method Name

###### 1.5.1.3.5.1 Method Name

updateCart

###### 1.5.1.3.5.2 Method Signature

updateCart(updates: CartUpdateDTO[]): Promise<CartDTO>

###### 1.5.1.3.5.3 Method Purpose

Adds, removes, or updates the quantity of items in the user's shopping cart.

###### 1.5.1.3.5.4 Integration Context

Called from product cards and the cart screen.

##### 1.5.1.3.6.0 Method Name

###### 1.5.1.3.6.1 Method Name

createOrder

###### 1.5.1.3.6.2 Method Signature

createOrder(payload: CreateOrderDTO): Promise<OrderDTO>

###### 1.5.1.3.6.3 Method Purpose

Submits the finalized cart to create an order in the system.

###### 1.5.1.3.6.4 Integration Context

Called as the final step of the checkout process.

##### 1.5.1.3.7.0 Method Name

###### 1.5.1.3.7.1 Method Name

getOrderHistory

###### 1.5.1.3.7.2 Method Signature

getOrderHistory(pagination: PaginationParams): Promise<PaginatedResult<OrderSummaryDTO>>

###### 1.5.1.3.7.3 Method Purpose

Fetches a paginated list of the user's past orders.

###### 1.5.1.3.7.4 Integration Context

Called on the Order History screen.

##### 1.5.1.3.8.0 Method Name

###### 1.5.1.3.8.1 Method Name

submitRating

###### 1.5.1.3.8.2 Method Signature

submitRating(orderId: string, payload: CreateRatingDTO): Promise<void>

###### 1.5.1.3.8.3 Method Purpose

Submits a rating for a vendor or rider for a completed order.

###### 1.5.1.3.8.4 Integration Context

Called from the rating screen.

#### 1.5.1.4.0.0 Integration Pattern

Library Consumption (NPM Package)

#### 1.5.1.5.0.0 Communication Protocol

HTTPS/REST (handled by the library)

#### 1.5.1.6.0.0 Extraction Reasoning

This is the primary dependency for all request-response communication with the backend. Consuming the shared client library ensures consistency, type safety, and abstracts away complex logic like JWT token refresh.

### 1.5.2.0.0.0 Interface Name

#### 1.5.2.1.0.0 Interface Name

IRealTimeGateway

#### 1.5.2.2.0.0 Source Repository

API Gateway / Backend Services (REPO-BE-LOGIS, REPO-BE-CHAT)

#### 1.5.2.3.0.0 Method Contracts

##### 1.5.2.3.1.0 Method Name

###### 1.5.2.3.1.1 Method Name

connect

###### 1.5.2.3.1.2 Method Signature

connect(token: string): Promise<void>

###### 1.5.2.3.1.3 Method Purpose

Establishes an authenticated WebSocket connection.

###### 1.5.2.3.1.4 Integration Context

Called after successful user login.

##### 1.5.2.3.2.0 Method Name

###### 1.5.2.3.2.1 Method Name

subscribeToRiderLocation

###### 1.5.2.3.2.2 Method Signature

on('rider_location_update', (data: LocationUpdateDTO) => void)

###### 1.5.2.3.2.3 Method Purpose

Listens for periodic updates of the assigned rider's GPS coordinates.

###### 1.5.2.3.2.4 Integration Context

Initiated when an order's status becomes 'In Transit' and the user is on the tracking screen.

##### 1.5.2.3.3.0 Method Name

###### 1.5.2.3.3.1 Method Name

subscribeToOrderStatus

###### 1.5.2.3.3.2 Method Signature

on('order_status_update', (data: OrderStatusUpdateDTO) => void)

###### 1.5.2.3.3.3 Method Purpose

Listens for real-time changes to an order's status (e.g., 'Preparing', 'In Transit').

###### 1.5.2.3.3.4 Integration Context

Initiated when the user opens the order tracking screen for an active order.

##### 1.5.2.3.4.0 Method Name

###### 1.5.2.3.4.1 Method Name

sendChatMessage

###### 1.5.2.3.4.2 Method Signature

emit('send_chat_message', (payload: NewMessagePayload) => void)

###### 1.5.2.3.4.3 Method Purpose

Sends a new chat message to the backend to be relayed to the vendor or rider.

###### 1.5.2.3.4.4 Integration Context

Triggered when the user sends a message from the chat UI.

#### 1.5.2.4.0.0 Integration Pattern

WebSocket Client

#### 1.5.2.5.0.0 Communication Protocol

Secure WebSocket (WSS)

#### 1.5.2.6.0.0 Extraction Reasoning

This interface defines the contract for all real-time features like live tracking and chat, which are core to the customer experience and mandated by requirements like REQ-1-059 and REQ-1-081.

### 1.5.3.0.0.0 Interface Name

#### 1.5.3.1.0.0 Interface Name

IUIComponents

#### 1.5.3.2.0.0 Source Repository

REPO-UI-COMPONENTS

#### 1.5.3.3.0.0 Method Contracts

##### 1.5.3.3.1.0 Method Name

###### 1.5.3.3.1.1 Method Name

Button

###### 1.5.3.3.1.2 Method Signature

<Button title='...' onPress={...} />

###### 1.5.3.3.1.3 Method Purpose

Provides a consistent, styled, and accessible button component.

###### 1.5.3.3.1.4 Integration Context

Used for all primary and secondary actions throughout the application.

##### 1.5.3.3.2.0 Method Name

###### 1.5.3.3.2.1 Method Name

Card

###### 1.5.3.3.2.2 Method Signature

<Card>{...}</Card>

###### 1.5.3.3.2.3 Method Purpose

Provides a styled container for content blocks, such as vendor or product cards.

###### 1.5.3.3.2.4 Integration Context

Used on the home screen and search results to display vendor summaries.

##### 1.5.3.3.3.0 Method Name

###### 1.5.3.3.3.1 Method Name

MapMarker

###### 1.5.3.3.3.2 Method Signature

<MapMarker coordinate={...} type='vendor' />

###### 1.5.3.3.3.3 Method Purpose

Provides standardized map pins for different entities (vendor, rider, customer).

###### 1.5.3.3.3.4 Integration Context

Used within the `react-native-maps` component on the Order Tracking screen.

#### 1.5.3.4.0.0 Integration Pattern

Library Consumption (NPM Package)

#### 1.5.3.5.0.0 Communication Protocol

N/A (Compile-time dependency)

#### 1.5.3.6.0.0 Extraction Reasoning

This dependency is critical for ensuring UI consistency and accelerating development. The customer app will compose its screens using these pre-built, themeable components.

### 1.5.4.0.0.0 Interface Name

#### 1.5.4.1.0.0 Interface Name

IPlatformContracts

#### 1.5.4.2.0.0 Source Repository

REPO-LIB-CONTRACTS

#### 1.5.4.3.0.0 Method Contracts

*No items available*

#### 1.5.4.4.0.0 Integration Pattern

Library Consumption (NPM Package)

#### 1.5.4.5.0.0 Communication Protocol

N/A (Compile-time dependency)

#### 1.5.4.6.0.0 Extraction Reasoning

This repository provides all the TypeScript types for DTOs and event payloads. The REPO-API-CLIENT and the customer app itself will import these types to ensure end-to-end type safety.

### 1.5.5.0.0.0 Interface Name

#### 1.5.5.1.0.0 Interface Name

IThirdPartySDKs

#### 1.5.5.2.0.0 Source Repository

External (Mapbox, Firebase, Razorpay)

#### 1.5.5.3.0.0 Method Contracts

##### 1.5.5.3.1.0 Method Name

###### 1.5.5.3.1.1 Method Name

Mapbox SDK

###### 1.5.5.3.1.2 Method Signature

N/A (Native SDK)

###### 1.5.5.3.1.3 Method Purpose

To render map views and markers for live tracking and address selection.

###### 1.5.5.3.1.4 Integration Context

Used within the Order Tracking and Address Management screens.

##### 1.5.5.3.2.0 Method Name

###### 1.5.5.3.2.1 Method Name

Firebase Cloud Messaging (FCM) SDK

###### 1.5.5.3.2.2 Method Signature

N/A (Native SDK)

###### 1.5.5.3.2.3 Method Purpose

To receive push notifications for order status updates.

###### 1.5.5.3.2.4 Integration Context

Initialized at app startup to register the device and handle incoming notifications.

##### 1.5.5.3.3.0 Method Name

###### 1.5.5.3.3.1 Method Name

Razorpay SDK

###### 1.5.5.3.3.2 Method Signature

N/A (Client-side SDK)

###### 1.5.5.3.3.3 Method Purpose

To provide the user interface for securely entering payment details for online orders.

###### 1.5.5.3.3.4 Integration Context

Launched during the final step of the checkout process.

#### 1.5.5.4.0.0 Integration Pattern

SDK Integration

#### 1.5.5.5.0.0 Communication Protocol

Native Bridge / HTTPS

#### 1.5.5.6.0.0 Extraction Reasoning

The application has direct dependencies on these third-party services as mandated by REQ-1-090 to fulfill core functionalities like mapping, notifications, and payments.

## 1.6.0.0.0.0 Exposed Interfaces

*No items available*

## 1.7.0.0.0.0 Technology Context

### 1.7.1.0.0.0 Framework Requirements

React Native v0.73+ using TypeScript. A state management library like Redux Toolkit is required for managing global state such as authentication, cart, and offline data.

### 1.7.2.0.0.0 Integration Technologies

- react-native-maps (for Mapbox integration)
- @react-native-firebase/messaging (for FCM push notifications)
- react-native-razorpay (or equivalent for payment UI)
- react-native-keychain (for secure token storage)
- redux-persist with MMKV (for offline data caching)

### 1.7.3.0.0.0 Performance Constraints

List rendering must be optimized using FlatList or FlashList. Bundle size should be minimized to ensure fast initial load times. The app must remain responsive during real-time data updates and data fetching.

### 1.7.4.0.0.0 Security Requirements

JWT refresh tokens MUST be stored in the device's native Keychain/Keystore. All communication with the backend must use HTTPS/WSS. Certificate pinning should be considered for enhanced security against man-in-the-middle attacks.

## 1.8.0.0.0.0 Extraction Validation

| Property | Value |
|----------|-------|
| Mapping Completeness Check | The repository is correctly and completely mapped ... |
| Cross Reference Validation | All mappings are consistent with the provided Arch... |
| Implementation Readiness Assessment | High. The context is sufficiently detailed to begi... |
| Quality Assurance Confirmation | The extracted context has been systematically anal... |

