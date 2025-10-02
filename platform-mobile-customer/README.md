# Platform Customer Mobile Application

This repository contains the complete React Native source code for the customer-facing mobile application of the Hyperlocal Delivery Platform.

## 🚀 Overview

This application serves as the primary touchpoint for the **Customer** user class in our three-sided marketplace. It enables users to:

-   **Discover** local vendors and products.
-   **Manage** their shopping cart.
-   **Place** orders using various payment methods (UPI, Card, COD).
-   **Track** live delivery progress on a map.
-   **Provide** ratings and reviews for vendors and riders.
-   **Manage** their profile and saved addresses.

The app is built with a focus on performance, security, accessibility, and a seamless user experience, including basic offline support.

## 🛠️ Technology Stack

-   **Framework**: React Native v0.73+
-   **Language**: TypeScript
-   **State Management**: Redux Toolkit (with Redux Persist & MMKV)
-   **Navigation**: React Navigation
-   **API Communication**: Axios & Socket.IO Client (consumed via `@platform/api-client`)
-   **Mapping**: React Native Maps (with Mapbox)
-   **Notifications**: Firebase Cloud Messaging (FCM)
-   **Payments**: Razorpay SDK
-   **Secure Storage**: React Native Keychain
-   **Internationalization**: i18next

## 📋 Prerequisites

-   Node.js (version specified in `.nvmrc`, e.g., v18.18.0)
-   Yarn or npm
-   React Native development environment set up for iOS and Android (Xcode, Android Studio).
-   Access to the platform's private NPM registry for shared packages (`@platform/*`).

## ⚙️ Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd platform-mobile-customer
    ```

2.  **Install Node.js version:**
    If you use `nvm`, run:
    ```bash
    nvm use
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Install iOS Pods:**
    ```bash
    cd ios && pod install && cd ..
    ```

5.  **Environment Variables:**
    Create a `.env` file in the root of the project and populate it with the required variables. Use `.env.example` as a template.
    ```
    API_BASE_URL=...
    WEBSOCKET_URL=...
    MAPBOX_API_KEY=...
    RAZORPAY_KEY_ID=...
    ```

## 📜 Available Scripts

-   `npm start`: Starts the Metro Bundler.
-   `npm run ios`: Builds and runs the app on an iOS simulator or connected device.
-   `npm run android`: Builds and runs the app on an Android emulator or connected device.
-   `npm run test`: Runs the Jest test suite.
-   `npm run lint`: Lints the codebase using ESLint.

## 🏗️ Architecture

This application follows a feature-sliced architecture, organized around business domains (e.g., auth, products, orders).

-   `src/screens`: Top-level container components for each screen.
-   `src/components`: App-specific reusable UI components.
-   `src/features`: Encapsulates feature logic, including Redux slices, services, and hooks.
-   `src/services`: Handles cross-cutting concerns and integrations (e.g., location, real-time).
-   `src/navigation`: Defines the app's navigation stacks.
-   `src/store`: Configures the global Redux store.

The app communicates exclusively with the backend via the centralized **API Gateway**, using a shared and typed API client library.

## 🧪 Testing

This project uses Jest and React Native Testing Library for unit and integration testing.

To run tests:
```bash
npm test
```