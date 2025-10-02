import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import {
  acceptTask,
  rejectTask,
  selectActiveTask,
  selectIsLoading,
  selectTaskError,
  selectTaskOffer,
  updateTaskStatus,
  clearError,
  submitPhotoPod,
  submitOtpPod,
} from '../taskSlice';
import { TaskStatus } from '../../../shared/types/task.types';
import locationService from '../../../lib/locationService';
import navigationService from '../../../lib/navigationService';
import { showToast } from '../../../utils/toast';
import { PODMethod } from '../task.types';

/**
 * @description A custom hook to manage all business logic and state related to delivery tasks.
 * It provides a clean interface for UI components to interact with the task lifecycle,
 * including accepting/rejecting offers, updating status, and submitting Proof of Delivery.
 * This hook acts as a ViewModel, decoupling the UI from the underlying state management and API calls.
 *
 * @returns An object containing the current task state (taskOffer, activeTask, isLoading, error)
 * and handler functions to perform task-related actions.
 */
export const useTask = () => {
  const dispatch = useAppDispatch();

  // Selectors to get the current state from the Redux store
  const taskOffer = useAppSelector(selectTaskOffer);
  const activeTask = useAppSelector(selectActiveTask);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectTaskError);

  /**
   * @description Clears any existing task-related errors from the state.
   */
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  /**
   * @description Handles the acceptance of a new task offer.
   * On success, navigates to the active task screen.
   * On failure, shows an error toast.
   * @param taskId - The ID of the task to accept.
   */
  const handleAcceptTask = useCallback(
    async (taskId: string) => {
      try {
        await dispatch(acceptTask(taskId)).unwrap();
        navigationService.navigate('Main', { screen: 'ActiveTask' });
      } catch (err: any) {
        showToast('error', 'Failed to accept task', err.message || 'Please try again.');
      }
    },
    [dispatch],
  );

  /**
   * @description Handles the rejection of a new task offer.
   * @param taskId - The ID of the task to reject.
   */
  const handleRejectTask = useCallback(
    async (taskId: string) => {
      try {
        await dispatch(rejectTask(taskId)).unwrap();
        // UI will automatically dismiss the offer screen based on `taskOffer` state becoming null.
      } catch (err: any) {
        // Silently fail or show a minor error, as the task will likely time out anyway.
        console.error('Failed to reject task:', err);
      }
    },
    [dispatch],
  );

  /**
   * @description Handles sequential status updates for an active delivery task.
   * It fetches the current GPS location before dispatching the update.
   * @param status - The new status to set for the active task.
   */
  const handleUpdateStatus = useCallback(
    async (status: TaskStatus) => {
      if (!activeTask) {
        showToast('error', 'No active task', 'Cannot update status without an active task.');
        return;
      }
      try {
        const currentLocation = await locationService.getCurrentLocation();
        await dispatch(
          updateTaskStatus({
            taskId: activeTask.id,
            status,
            location: {
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            },
          }),
        ).unwrap();
        showToast('success', 'Status Updated', `Order status is now: ${status}`);
      } catch (err: any) {
        showToast('error', 'Status Update Failed', err.message || 'Please check your connection and try again.');
      }
    },
    [dispatch, activeTask],
  );
  
  /**
   * @description Handles the submission of a photo for Proof of Delivery.
   * The thunk is responsible for the actual file upload.
   * @param localPhotoUri - The local URI of the captured photo.
   */
  const handleSubmitPhotoPod = useCallback(
    async (localPhotoUri: string) => {
        if (!activeTask) {
            showToast('error', 'No active task found');
            return;
        }

        try {
            const currentLocation = await locationService.getCurrentLocation();
            await dispatch(submitPhotoPod({
                taskId: activeTask.id,
                localPhotoUri,
                location: {
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                }
            })).unwrap();
            showToast('success', 'Proof of Delivery Submitted');
        } catch (err: any) {
            showToast('error', 'Photo Upload Failed', err.message || 'Could not submit proof of delivery.');
        }
    }, [dispatch, activeTask]
  );

  /**
   * @description Handles the submission of an OTP for Proof of Delivery.
   * @param otp - The 4-digit OTP provided by the customer.
   */
  const handleSubmitOtpPod = useCallback(
    async (otp: string) => {
        if (!activeTask) {
            showToast('error', 'No active task found');
            return;
        }
        if (!/^\d{4}$/.test(otp)) {
            showToast('error', 'Invalid OTP', 'Please enter a valid 4-digit OTP.');
            return;
        }
        try {
            const currentLocation = await locationService.getCurrentLocation();
            await dispatch(submitOtpPod({
                taskId: activeTask.id,
                otp,
                location: {
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                }
            })).unwrap();
            showToast('success', 'Proof of Delivery Submitted');
        } catch (err: any) {
            showToast('error', 'Invalid OTP', err.message || 'Please verify the OTP and try again.');
        }
    }, [dispatch, activeTask]
  );

  return {
    // State
    taskOffer,
    activeTask,
    isLoading,
    error,
    // Actions
    acceptTask: handleAcceptTask,
    rejectTask: handleRejectTask,
    updateStatus: handleUpdateStatus,
    submitPhotoPod: handleSubmitPhotoPod,
    submitOtpPod: handleSubmitOtpPod,
    clearError: handleClearError,
  };
};