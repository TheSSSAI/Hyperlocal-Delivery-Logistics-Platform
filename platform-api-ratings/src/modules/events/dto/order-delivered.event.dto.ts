import { IsUUID } from 'class-validator';

/**
 * Data Transfer Object for the OrderDelivered event.
 * This DTO defines the shape and validation rules for the event payload
 * received from the Order service when an order is successfully delivered.
 * It serves as the contract between the Order service and the Ratings service.
 */
export class OrderDeliveredEventDto {
  /**
   * The unique identifier of the delivered order.
   * Must be a valid UUID.
   * @example 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
   */
  @IsUUID()
  orderId: string;

  /**
   * The unique identifier of the customer who placed the order.
   * Must be a valid UUID.
   * @example 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6'
   */
  @IsUUID()
  customerId: string;

  /**
   * The unique identifier of the vendor who fulfilled the order.
   * Must be a valid UUID.
   * @example 'b1b5a5b5-1b1b-4b1b-8b1b-1b1b1b1b1b1b'
   */
  @IsUUID()
  vendorId: string;

  /**
   * The unique identifier of the rider who delivered the order.
   * Must be a valid UUID.
   * @example 'c1c5a5c5-1c1c-4c1c-8c1c-1c1c1c1c1c1c'
   */
  @IsUUID()
  riderId: string;
}