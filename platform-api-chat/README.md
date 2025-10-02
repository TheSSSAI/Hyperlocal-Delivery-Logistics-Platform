# Platform Chat Microservice (`platform-api-chat`)

## Overview

This microservice is responsible for all real-time chat functionality within the platform. It manages WebSocket connections, order-specific chat rooms, message persistence, and broadcasting between customers, vendors, and riders.

The service is built with [NestJS](https://nestjs.com/) and leverages WebSockets with a Redis adapter for horizontal scalability.

## Prerequisites

-   [Node.js](https://nodejs.org/) (v18.x or later)
-   [npm](https://www.npmjs.com/) (v9.x or later)
-   [Docker](https://www.docker.com/) and Docker Compose
-   Access to a running PostgreSQL instance
-   Access to a running Redis instance

## Environment Variables

To run this application, you will need to create a `.env` file in the root directory. You can use the `.env.example` file as a template.

Key variables include:

-   `PORT`: The port the application will run on (e.g., `3004`).
-   `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`: PostgreSQL connection details.
-   `REDIS_HOST`, `REDIS_PORT`: Redis connection details for the WebSocket adapter.
-   `COGNITO_USER_POOL_ID`, `COGNITO_REGION`: AWS Cognito details for JWT validation.
-   `ORDER_SERVICE_URL`: The internal URL for the Order Management Service.
-   `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`: AWS credentials for SQS/SNS integration.
-   `AWS_SQS_ORDER_EVENTS_QUEUE_URL`: The URL of the SQS queue this service listens to for order events.

## Installation

```bash
# Clone the repository
git clone <repository_url>

# Navigate to the project directory
cd platform-api-chat

# Install dependencies
npm install
```

## Running the Application

### Development Mode

This command starts the application in development mode with hot-reloading enabled.

```bash
npm run start:dev
```

The application will be available at `http://localhost:3004`. The WebSocket gateway will be listening on the same port.

### Production Mode

To build and run the application in production mode:

```bash
# Build the application
npm run build

# Start the production server
npm run start:prod
```

## Running with Docker

You can also run the application using Docker Compose, which will set up the necessary database and Redis containers.

```bash
# Make sure you have a .env file configured
docker-compose up --build
```

## Testing

### Unit and Integration Tests

Run the full test suite using Jest.

```bash
npm run test
```

### Test Coverage

To generate a test coverage report:

```bash
npm run test:cov
```

## Code Quality

### Linting

To check the code for linting errors:

```bash
npm run lint
```

### Formatting

This project uses Prettier for code formatting. It is recommended to configure your IDE to format on save. To format the entire codebase:

```bash
npm run format
```

## Architectural Notes

-   **WebSockets & Scalability**: This service uses `@nestjs/websockets` with a Redis adapter (`socket.io-redis`). This is critical for scaling beyond a single instance, as it allows message broadcasting across multiple pods in a Kubernetes environment.
-   **Event-Driven**: The lifecycle of a chat room (creation, adding participants, making it read-only) is driven by asynchronous events consumed from an SQS queue, which are published by the Order Management service.
-   **Authorization**: WebSocket connections are secured using a custom NestJS Guard (`WsJwtGuard`) that validates a JWT passed during the handshake. Authorization for joining rooms and sending messages is context-based, verifying that the user is a participant in the specific order.