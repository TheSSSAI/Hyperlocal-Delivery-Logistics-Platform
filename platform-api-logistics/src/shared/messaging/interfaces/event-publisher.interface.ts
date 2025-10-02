export const EVENT_PUBLISHER = 'IEventPublisher';

/**
 * An abstraction for publishing domain and integration events to a message bus.
 * This interface decouples the application from the specific messaging technology (e.g., SNS, Kafka).
 */
export interface IEventPublisher {
  /**
   * Publishes an event to a specified topic.
   * @param topic - The name of the topic or channel to publish to.
   * @param event - The event payload object.
   * @typeParam T - The type of the event payload.
   * @returns A promise that resolves when the event has been successfully published.
   */
  publish<T extends object>(topic: string, event: T): Promise<void>;
}