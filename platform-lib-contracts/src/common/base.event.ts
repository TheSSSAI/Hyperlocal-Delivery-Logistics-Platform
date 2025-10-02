/**
 * @file Defines the base contract for all event payloads within the event-driven architecture.
 * @version 1.0.0
 * @since 1.0.0
 * @author Principal Software Engineer
 * @see REQ-1-105
 * @see REQ-1-110
 */

/**
 * Defines the mandatory envelope structure for all event payloads.
 * This ensures system-wide consistency for tracing, auditing, and versioning.
 *
 * @template T The specific, strongly-typed data (payload) for the event.
 */
export interface IEventPayload<T> {
  /**
   * A unique identifier (UUID) for this specific event instance.
   * @example "evt_a1b2c3d4-e5f6-7890-1234-567890abcdef"
   */
  readonly eventId: string;

  /**
   * An identifier to trace a single request's lifecycle across multiple services and events.
   * Fulfills requirement REQ-1-110.
   * @example "corr_a1b2c3d4-e5f6-7890-1234-567890abcdef"
   */
  readonly correlationId: string;

  /**
   * The ISO 8601 timestamp (UTC) when the event occurred.
   * @example "2023-10-27T10:00:00.123Z"
   */
  readonly timestamp: string;

  /**
   * The unique name of the event, used for routing and consumption.
   * @example "OrderPlacedEvent"
   */
  readonly eventName: string;

  /**
   * The semantic version of the event schema.
   * Helps consumers handle event evolution.
   * @example "1.0"
   */
  readonly version: string;

  /**
   * The specific, strongly-typed data for the event.
   */
  readonly payload: T;
}