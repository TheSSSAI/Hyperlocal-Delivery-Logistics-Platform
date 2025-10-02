# Platform Mobile Rider Application

This repository contains the React Native source code for the rider-facing mobile application. Its core responsibility is to be the primary tool for delivery riders, enabling them to set their availability, receive and accept delivery tasks, navigate to pickup and drop-off locations, update order statuses, and track their earnings.

This application is built for both iOS and Android platforms.

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Linting & Formatting](#linting--formatting)
- [Troubleshooting](#troubleshooting)

## Project Overview

The Rider App is a key component of the three-sided marketplace, providing essential tools for delivery partners. Key features include:

- **Availability Management**: Toggle between 'Online' and 'Offline' states to receive jobs.
- **Task Management**: Receive, view, accept, and reject delivery task offers in real-time.
- **In-App Navigation**: Integrated turn-by-turn navigation via Mapbox to vendor and customer locations.
- **Order Lifecycle Updates**: Sequentially update order status from pickup to delivery.
- **Proof of Delivery (POD)**: Support for both photo capture and OTP confirmation.
- **Financial Tracking**: View detailed earnings breakdowns and cash-in-hand totals.
- **Real-time Communication**: In-app chat with customers for active orders.

## Technology Stack

- **Framework**: React Native 0.73+
- **Language**: TypeScript
- **State Management**: Redux Toolkit (with Zustand as a potential alternative for local state)
- **Navigation**: React Navigation
- **Mapping & Navigation**: Mapbox SDK
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **Background Location**: React Native Background Geolocation
- **API Communication**: Axios (abstracted via internal API client)
- **Real-time Communication**: Socket.IO Client
- **Testing**: Jest, React Native Testing Library
- **Linting**: ESLint
- **Formatting**: Prettier

## Prerequisites

- **Node.js**: Version specified in `.nvmrc` (e.g., v18.18.0). We recommend using `nvm` (Node Version Manager).
- **npm**: Version compatible with the specified Node.js version.
- **Watchman**: The file watcher recommended for React Native.
- **React Native CLI**: The global CLI for running React Native commands.
- **Xcode**: For iOS development (macOS only).
- **Android Studio**: For Android development.
- **CocoaPods**: For managing iOS dependencies.

## Getting Started

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd platform-mobile-rider
    ```

2.  **Set Node.js version:**
    If you are using `nvm`, run:
    ```bash
    nvm use
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Install iOS dependencies:**
    ```bash
    cd ios && pod install && cd ..
    ```

### Environment Configuration

1.  Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```

2.  Update the `.env` file with the required environment variables for your development environment. These values will be provided by the platform engineering team.

    - `API_BASE_URL`: The base URL for the backend API Gateway.
    - `WEBSOCKET_URL`: The URL for the real-time WebSocket service.
    - `MAPBOX_ACCESS_TOKEN`: The public access token for the Mapbox SDK.

### Running the Application

Ensure you have a simulator/emulator running or a physical device connected.

**For iOS:**
```bash
npm run ios
```

**For Android:**
```bash
npm run android
```

## Available Scripts

- `npm start`: Starts the Metro bundler.
- `npm run android`: Builds and runs the app on an Android emulator or connected device.
- `npm run ios`: Builds and runs the app on an iOS simulator or connected device.
- `npm test`: Runs the Jest test suite.
- `npm run test:watch`: Runs Jest in watch mode.
- `npm run lint`: Lints all TypeScript files in the `src` directory.
- `npm run lint:fix`: Lints and automatically fixes issues.
- `npm run format`: Formats all files with Prettier.
- `npm run type-check`: Runs the TypeScript compiler to check for type errors.

## Project Structure

The project follows a feature-sliced architecture for scalability and maintainability.

```
src/
├── api/          # API client wrappers for backend services
├── assets/       # Static assets like images and fonts
├── components/   # Shared, reusable UI components
├── config/       # Environment and global configuration
├── features/     # Feature-sliced modules (e.g., auth, task, profile)
├── lib/          # Wrappers for third-party libraries and native modules
├── navigation/   # React Navigation stacks and configuration
├── store/        # Redux Toolkit store, reducers, and hooks
├── shared/       # Shared types, constants, and utility functions
└── App.tsx       # Root application component
```

## Testing

This project uses Jest and React Native Testing Library for unit and integration tests.

- To run all tests: `npm test`
- To run tests in watch mode: `npm run test:watch`
- To see test coverage: `npm test -- --coverage`

Test files are co-located with the source files they are testing, using a `*.spec.ts` or `*.test.ts` extension.

## Linting & Formatting

- **ESLint** is used for static code analysis. Rules are defined in `.eslintrc.js`. Run with `npm run lint`.
- **Prettier** is used for automatic code formatting. Rules are defined in `.prettierrc.js`. Run with `npm run format`.
- **TypeScript** is used for static type checking. Run with `npm run type-check`.

It is highly recommended to use the recommended VS Code extensions to get real-time feedback and automatic formatting on save.

## Troubleshooting

- **iOS Pod Installation Issues**: If you encounter issues after `npm install`, try running `cd ios && pod install --repo-update` and then `cd ..`.
- **Android Build Fails**: Clean the Gradle build cache by running `cd android && ./gradlew clean && cd ..`.
- **Cache Issues**: If the app behaves unexpectedly, try clearing the Metro bundler cache: `npm start -- --reset-cache`.