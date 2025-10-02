/**
 * @fileoverview This is the main barrel file for all asynchronous Event contracts.
 * It re-exports all event payload contracts from the domain-specific subdirectories,
 * providing a single, clean entry point for consumers of this library.
 *
 * This pattern is essential for the Event-Driven Architecture, ensuring that
 * event producers and consumers are decoupled but contractually aligned.
 *
 * @see ../index.ts for the main library entry point.
 * @namespace Platform.Core.Contracts.Events
 */

// Level 1 Events
export * from './users/user-registered.event';
export * from './orders/order-placed.event';
export * from './payments/payment-succeeded.event';