import apiClient from './apiClient';
import { Task, TaskStatus, LatLng } from '../shared/types/task.types';

/**
 * Fetches the currently assigned active task for the rider.
 * @returns A promise that resolves with the active task, or null if no task is active.
 * @throws {ApiError} on failure.
 */
const getActiveTask = async (): Promise<Task | null> => {
  const response = await apiClient.get<Task | null>('/tasks/active');
  return response.data;
};

/**
 * Accepts a new delivery task offer.
 * @param taskId - The ID of the task to accept.
 * @returns A promise that resolves with the updated task details.
 * @throws {ApiError} on failure (e.g., task already taken, offer expired).
 */
const acceptTask = async (taskId: string): Promise<Task> => {
  const response = await apiClient.post<Task>(`/tasks/${taskId}/accept`);
  return response.data;
};

/**
 * Rejects a new delivery task offer.
 * @param taskId - The ID of the task to reject.
 * @returns A promise that resolves on successful rejection.
 * @throws {ApiError} on failure.
 */
const rejectTask = async (taskId: string): Promise<void> => {
  await apiClient.post(`/tasks/${taskId}/reject`);
};

/**
 * Updates the status of an active delivery task.
 * @param params - An object containing the taskId, new status, and optional location data.
 * @returns A promise that resolves with the updated task details.
 * @throws {ApiError} on failure (e.g., invalid state transition).
 */
const updateTaskStatus = async (params: {
  taskId: string;
  status: TaskStatus;
  location?: LatLng;
}): Promise<Task> => {
  const { taskId, ...payload } = params;
  const response = await apiClient.patch<Task>(`/tasks/${taskId}/status`, payload);
  return response.data;
};

/**
 * Submits a photo as Proof of Delivery (POD).
 * @param params - An object containing the taskId, the S3 key of the uploaded photo, and the current location.
 * @returns A promise that resolves on successful submission.
 * @throws {ApiError} on failure.
 */
const submitPhotoPod = async (params: {
  taskId: string;
  photoS3Key: string;
  location: LatLng;
}): Promise<void> => {
  const { taskId, ...payload } = params;
  await apiClient.post(`/tasks/${taskId}/pod/photo`, payload);
};

/**
 * Submits and validates a customer-provided OTP as Proof of Delivery (POD).
 * @param params - An object containing the taskId, the 4-digit OTP, and the current location.
 * @returns A promise that resolves on successful submission and validation.
 * @throws {ApiError} on failure (e.g., invalid OTP, too many attempts).
 */
const submitOtpPod = async (params: {
  taskId: string;
  otp: string;
  location: LatLng;
}): Promise<void> => {
  const { taskId, ...payload } = params;
  await apiClient.post(`/tasks/${taskId}/pod/otp`, payload);
};

export const taskApi = {
  getActiveTask,
  acceptTask,
  rejectTask,
  updateTaskStatus,
  submitPhotoPod,
  submitOtpPod,
};