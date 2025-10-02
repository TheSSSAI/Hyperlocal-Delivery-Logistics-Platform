# Platform Web Vendor Dashboard

This repository contains the source code for the vendor-facing web dashboard of the Hyperlocal Marketplace Platform. It is a modern Single Page Application (SPA) built with React.js, Vite, and TypeScript.

## 📖 Overview

The Vendor Dashboard is the primary interface for our vendor partners. It provides a comprehensive set of tools to manage their entire presence on the platform, from initial setup to daily operations.

### Key Features

-   **Store Profile Management**: Update store name, address, contact details, and business hours.
-   **Catalog & Inventory Control**: Full CRUD functionality for products and categories.
-   **Bulk Operations**: Efficiently manage large catalogs with CSV import and export.
-   **Real-time Order Management**: Receive and act on new orders instantly with a live dashboard.
-   **Financial Reporting**: View sales performance and download monthly statements.
-   **Customer Feedback**: Monitor store ratings and reviews.
-   **Compliance**: Manage business licenses and other compliance documents.
-   **Support**: Create and track support tickets.

## 🛠️ Technology Stack

-   **Framework**: [React.js](https://react.dev/) v18.2+
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Server State Management**: [TanStack Query](https://tanstack.com/query)
-   **Real-time Communication**: [Socket.IO Client](https://socket.io/docs/v4/client-api/)
-   **Routing**: [React Router](https://reactrouter.com/)
-   **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
-   **Styling**: (Assumes a shared component library or CSS-in-JS solution)
-   **Testing**: [Jest](https://jestjs.io/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/), [Cypress](https://www.cypress.io/)

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18.18+ recommended)
-   npm (v9+ recommended)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-org/platform-web-vendor.git
    cd platform-web-vendor
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env.local
    ```
    Update the variables in `.env.local` to point to your local or development backend services.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 📜 Available Scripts

-   `npm run dev`: Starts the Vite development server with hot module replacement.
-   `npm run build`: Compiles and bundles the application for production into the `dist` directory.
-   `npm run lint`: Lints the entire codebase using ESLint to check for code quality issues.
-   `npm run preview`: Serves the production build locally to preview it before deployment.
-   `npm run test`: Runs all unit and integration tests using Jest.
-   `npm run test:watch`: Runs tests in an interactive watch mode.
-   `npm run cypress:open`: Opens the Cypress test runner for end-to-end testing.

## 🧪 Testing

This project uses a combination of testing strategies to ensure quality:

-   **Unit & Integration Tests**: Written with Jest and React Testing Library.
-   **End-to-End (E2E) Tests**: Written with Cypress.

## 🐳 Docker Deployment

A multi-stage `Dockerfile` is provided for building a production-ready container image.

To build the image:
```bash
docker build -t platform-web-vendor .
```

To run the container:
```bash
docker run -p 8080:80 platform-web-vendor
```
The application will be accessible at `http://localhost:8080`.

## 🤝 Contributing

Please refer to the organization's contribution guidelines for details on how to contribute to this project.