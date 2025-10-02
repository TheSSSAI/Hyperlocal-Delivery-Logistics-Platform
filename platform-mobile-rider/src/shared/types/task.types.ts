/**
 * This file defines the core domain models and types related to a delivery task.
 * These types are shared across multiple features and represent the single source of truth
 * for what constitutes a Task, Location, etc., from the client's perspective.
 */

/**
 * Enum representing the finite state machine for a delivery task's lifecycle.
 * Aligns with REQ-1-072 and REQ-1-077, covering all key milestones from the rider's perspective.
 */
export enum TaskStatus {
  Offered = 'OFFERED',
  Accepted = 'ACCEPTED', // Rider accepted, en route to store
  ArrivedAtStore = 'ARRIVED_AT_STORE',
  InTransit = 'IN_TRANSIT', // Order picked up, en route to customer
  ArrivedAtDestination = 'ARRIVED_AT_DESTINATION',
  Delivered = 'DELIVERED',
  Cancelled = 'CANCELLED',
}

/**
 * Represents a geographical point with latitude and longitude.
 */
export interface LatLng {
  latitude: number;
  longitude: number;
}

/**
 * Represents a physical address with associated details and coordinates.
 */
export interface Address {
  line1: string;
  line2?: string;
  city: string;
  pincode: string;
  landmark?: string;
  coordinates: LatLng;
}

/**
 * Represents a contact person at a location (either vendor or customer).
 */
export interface LocationContact {
  name: string;
  address: Address;
  instructions?: string;
}

/**
 * Defines the Proof of Delivery method required for a task.
 * Aligns with REQ-1-074.
 */
export type PODMethod = 'PHOTO' | 'OTP';

/**
 * The core interface representing a single delivery task.
 * This aggregates all necessary information for a rider to execute a delivery.
 * Based on REQ-1-011 and user story RDR-011.
 */
export interface Task {
  id: string;
  orderId: string;
  status: TaskStatus;
  pickup: LocationContact;
  dropoff: LocationContact;
  earnings: number;
  estimatedDistance: number; // in kilometers
  estimatedTime: number; // in minutes
  paymentMethod: 'COD' | 'Prepaid';
  amountToCollect: number | null; // For COD orders, as per REQ-1-076
  podMethod: PODMethod;
}