/**
 * @fileoverview
 * This is the main entry point for the @hyperlocal/contracts library.
 * It serves as a barrel file to re-export all public contracts, DTOs,
 * events, enums, and common types from their respective modules.
 *
 * This approach provides a clean, unified public API for all consumers
 * of the library, simplifying imports and abstracting the internal
 * directory structure.
 *
 * @example
 * import { OrderDto, OrderStatus, IOrderPlacedEvent } from '@hyperlocal/contracts';
 *
 * @see REQ-1-092 for API data interchange format standardization.
 * @see REQ-1-105 for asynchronous event contract requirements.
 */

// Export all common, foundational contracts and interfaces.
// This includes base types, value objects, and generic responses.
export * from './common/address.contract';
export * from './common/api-error.response';
export * from './common/base.event';
export * from './common/money.contract';
export * from './common/paged.response';

// Export all Data Transfer Objects (DTOs) used for synchronous API communication.
// These are organized by their respective bounded contexts.
export * from './dtos';

// Export all event payload contracts for asynchronous, event-driven communication.
// These are organized by the domain that publishes the event.
export * from './events';

// Export all shared enumerations to provide a controlled vocabulary across the system.
export * from './enums';