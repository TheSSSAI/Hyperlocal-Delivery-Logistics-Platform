import { Task, TaskStatus, LatLng } from '../../shared/types/task.types';

/**
 * This file contains TypeScript types that are specific to the 'task' feature.
 * These types often represent DTOs for API calls or payloads for state management actions,
 * building upon the core domain types defined in `src/shared/types`.
 */

/**
 * Represents the payload received from the backend via WebSocket when a new task is offered.
 * This is a DTO (Data Transfer Object) for the real-time event.
 * Aligns with user story RDR-010.
 */
export interface TaskOfferPayload {
  task: Task;
  expiresAt: string; // ISO 8601 timestamp string
}

/**
 * Defines the structure for updating a task's status via an API call.
 * This is the payload for the `updateTaskStatus` API method.
 * Aligns with REQ-1-072.
 */
export interface UpdateTaskStatusPayload {
  taskId: string;
  status: TaskStatus;
  location?: LatLng;
}

/**
 * Defines the structure for submitting Proof of Delivery (POD) via an API call.
 * Aligns with REQ-1-074 and user stories RDR-022 and RDR-023.
 */
export interface SubmitPhotoPODPayload {
  taskId: string;
  photoS3Key: string;
  location: LatLng;
}

export interface SubmitOtpPODPayload {
  taskId: string;
  otp: string;
  location: LatLng;
}

/**
 * Represents the shape of the 'task' slice in the Redux store.
 * It manages the state for task offers and the currently active task.
 */
export interface TaskState {
  taskOffer: TaskOfferPayload | null;
  activeTask: Task | null;
  isLoading: boolean;
  error: string | null;
}