/**
 * @fileoverview This is the main barrel file for all Data Transfer Objects (DTOs).
 * It re-exports all DTO contracts from the domain-specific subdirectories,
 * providing a single, clean entry point for consumers of this library.
 *
 * This pattern aligns with the "Published Language" and "Shared Kernel" principles
 * of Domain-Driven Design, defining the public API for synchronous data contracts.
 *
 * @see ../index.ts for the main library entry point.
 * @namespace Platform.Core.Contracts.DTOs
 */

// Level 0 DTOs
export * from './orders/create-order.dto';
export * from './orders/order.dto';
export * from './users/create-user.dto';

// Level 1 DTOs
export * from './products/product.dto';
export * from './users/user.dto';