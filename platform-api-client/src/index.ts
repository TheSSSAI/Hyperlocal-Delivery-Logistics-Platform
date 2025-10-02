/**
 * @fileoverview
 * This is the main entry point for the Platform API Client library.
 * It exposes the primary factory function `createApiClient` for creating a new API client instance,
 * along with all necessary types, generated API classes, and models. This facade simplifies
 * consumption by allowing frontend applications to import all required components from a single module.
 *
 * @see {@link ./core/apiClientFactory.ts} for the factory implementation.
 * @see {@link ./types/index.ts} for configuration interfaces.
 * @see {@link ./api/generated/index.ts} for the auto-generated API client and models.
 */

// Export the core factory function for creating an API client instance.
// This is the primary entry point for consumers of this library.
export { createApiClient } from './core/apiClientFactory';

// Export the configuration interfaces required by the factory function.
// Consumers will need to implement `TokenProvider` and provide an `ApiClientConfig` object.
export * from './types';

// Export all generated API classes, models (DTOs), and utility types from the openapi-generator output.
// This provides consumers with the fully-typed API surface area, including:
// - API classes (e.g., DefaultApi) for making requests.
// - Model interfaces (e.g., OrderDTO, UserDTO) for request and response payloads.
// - Base classes and configuration objects used by the generated client.
export * from './api/generated';