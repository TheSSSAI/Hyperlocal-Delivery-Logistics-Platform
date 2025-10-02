import { describe, it, expect } from '@jest/globals';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

import { OrderPlacedEvent } from '../../src/events/orders/order-placed.event';
import { OrderStatus } from '../../src/enums/order-status.enum';
import { PaymentMethod } from '../../src/enums/payment-method.enum';

// Reusable Zod schema for MoneyContract, ensuring financial data consistency
const MoneyContractSchema = z.object({
  amount: z.number().int('Amount must be an integer (smallest currency unit)'),
  currency: z.string().length(3, 'Currency must be a 3-letter ISO code'),
});

// Reusable Zod schema for AddressContract
const AddressContractSchema = z.object({
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional().nullable(),
  city: z.string().min(1),
  pincode: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
});

// Zod schema for the generic event envelope, enforcing metadata consistency
const BaseEventSchema = z.object({
  eventId: z.string().uuid(),
  correlationId: z.string().uuid(),
  timestamp: z.string().datetime(),
  eventName: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+$/),
});

// Zod schema for the OrderItem within the payload
const OrderItemPayloadSchema = z.object({
  productId: z.string().uuid(),
  productName: z.string().min(1),
  quantity: z.number().int().positive(),
  priceAtTimeOfOrder: MoneyContractSchema,
});

// Zod schema for the specific payload of an OrderPlacedEvent
const OrderPlacedPayloadSchema = z.object({
  orderId: z.string().uuid(),
  customerId: z.string().uuid(),
  vendorId: z.string().uuid(),
  items: z.array(OrderItemPayloadSchema).min(1),
  totalAmount: MoneyContractSchema,
  subtotal: MoneyContractSchema,
  deliveryFee: MoneyContractSchema,
  taxes: MoneyContractSchema,
  paymentMethod: z.nativeEnum(PaymentMethod),
  status: z.literal(OrderStatus.PendingVendorAcceptance),
  deliveryAddress: AddressContractSchema,
  placedAt: z.string().datetime(),
});

// The complete Zod schema for the OrderPlacedEvent, combining the envelope and payload
const OrderPlacedEventSchema = BaseEventSchema.extend({
  eventName: z.literal('OrderPlacedEvent'),
  payload: OrderPlacedPayloadSchema,
});

describe('Order Events Contracts', () => {
  describe('OrderPlacedEvent', () => {
    it('should have a structure that conforms to the defined Zod schema', () => {
      // ARRANGE: Create a mock event object that conforms to the TypeScript interface
      const mockEvent: OrderPlacedEvent = {
        eventId: uuidv4(),
        correlationId: uuidv4(),
        timestamp: new Date().toISOString(),
        eventName: 'OrderPlacedEvent',
        version: '1.0',
        payload: {
          orderId: uuidv4(),
          customerId: uuidv4(),
          vendorId: uuidv4(),
          items: [
            {
              productId: uuidv4(),
              productName: 'Spicy Chicken Ramen',
              quantity: 2,
              priceAtTimeOfOrder: { amount: 35000, currency: 'INR' },
            },
            {
              productId: uuidv4(),
              productName: 'Gyoza',
              quantity: 1,
              priceAtTimeOfOrder: { amount: 15000, currency: 'INR' },
            },
          ],
          totalAmount: { amount: 53500, currency: 'INR' },
          subtotal: { amount: 50000, currency: 'INR' },
          deliveryFee: { amount: 3000, currency: 'INR' },
          taxes: { amount: 500, currency: 'INR' },
          paymentMethod: PaymentMethod.CARD,
          status: OrderStatus.PendingVendorAcceptance,
          deliveryAddress: {
            addressLine1: '123 Tech Park',
            addressLine2: 'Silicon Valley',
            city: 'Mumbai',
            pincode: '400001',
            latitude: 19.076,
            longitude: 72.8777,
          },
          placedAt: new Date().toISOString(),
        },
      };

      // ACT & ASSERT: Validate the mock object against the Zod schema.
      // .parse() will throw an error if validation fails, causing the test to fail.
      expect(() => OrderPlacedEventSchema.parse(mockEvent)).not.toThrow();
    });

    it('should fail validation if a required payload field is missing', () => {
      // ARRANGE: Create an invalid mock object (missing totalAmount)
      const mockEvent: any = {
        eventId: uuidv4(),
        correlationId: uuidv4(),
        timestamp: new Date().toISOString(),
        eventName: 'OrderPlacedEvent',
        version: '1.0',
        payload: {
          orderId: uuidv4(),
          customerId: uuidv4(),
          vendorId: uuidv4(),
          items: [],
          // totalAmount is missing
          paymentMethod: PaymentMethod.CARD,
          status: OrderStatus.PendingVendorAcceptance,
          deliveryAddress: {
            addressLine1: '123 Tech Park',
            city: 'Mumbai',
            pincode: '400001',
            latitude: 19.076,
            longitude: 72.8777,
          },
          placedAt: new Date().toISOString(),
        },
      };

      // ACT: Use safeParse to check for validation failure
      const result = OrderPlacedEventSchema.safeParse(mockEvent);

      // ASSERT: The validation should fail
      expect(result.success).toBe(false);
      // And we can even check for the specific error
      if (!result.success) {
        const issues = result.error.issues;
        expect(issues.some((issue) => issue.path.includes('totalAmount'))).toBe(
          true,
        );
      }
    });

    it('should fail validation if an event metadata field is invalid', () => {
      // ARRANGE: Create an invalid mock object (invalid eventId)
      const mockEvent: any = {
        eventId: 'not-a-uuid',
        correlationId: uuidv4(),
        timestamp: new Date().toISOString(),
        eventName: 'OrderPlacedEvent',
        version: '1.0',
        payload: {
          orderId: uuidv4(),
          customerId: uuidv4(),
          vendorId: uuidv4(),
          items: [{
            productId: uuidv4(),
            productName: 'Item',
            quantity: 1,
            priceAtTimeOfOrder: { amount: 100, currency: 'INR' },
          }],
          totalAmount: { amount: 100, currency: 'INR' },
          subtotal: { amount: 100, currency: 'INR' },
          deliveryFee: { amount: 0, currency: 'INR' },
          taxes: { amount: 0, currency: 'INR' },
          paymentMethod: PaymentMethod.CARD,
          status: OrderStatus.PendingVendorAcceptance,
          deliveryAddress: {
            addressLine1: '123 Tech Park',
            city: 'Mumbai',
            pincode: '400001',
            latitude: 19.076,
            longitude: 72.8777,
          },
          placedAt: new Date().toISOString(),
        },
      };

      // ACT: Use safeParse to check for validation failure
      const result = OrderPlacedEventSchema.safeParse(mockEvent);

      // ASSERT: The validation should fail
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toEqual(['eventId']);
        expect(result.error.issues[0].message).toBe('Invalid uuid');
      }
    });
  });
});