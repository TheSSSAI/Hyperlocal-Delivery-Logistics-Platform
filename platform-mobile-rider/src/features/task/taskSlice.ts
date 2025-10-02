import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from 'reselect';
import * as taskApi from '../../api/task.api';
import { RootState } from '../../store/store';
import { Task, TaskStatus } from '../../shared/types/task.types';
import { TaskOfferPayload } from './task.types';
import { LatLng } from 'react-native-maps';

export interface TaskState {
  activeTask: Task | null;
  taskOffer: TaskOfferPayload | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TaskState = {
  activeTask: null,
  taskOffer: null,
  status: 'idle',
  error: null,
};

// Async Thunks
export const acceptTaskThunk = createAsyncThunk(
  'task/acceptTask',
  async (taskId: string, { rejectWithValue }) => {
    try {
      const acceptedTask = await taskApi.acceptTask(taskId);
      return acceptedTask;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to accept task');
    }
  },
);

export const rejectTaskThunk = createAsyncThunk(
  'task/rejectTask',
  async (taskId: string, { rejectWithValue }) => {
    try {
      await taskApi.rejectTask(taskId);
      return taskId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to reject task');
    }
  },
);

export const updateTaskStatusThunk = createAsyncThunk(
  'task/updateTaskStatus',
  async (
    params: { taskId: string; status: TaskStatus; location?: LatLng },
    { rejectWithValue },
  ) => {
    try {
      const updatedTask = await taskApi.updateStatus(params);
      return updatedTask;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update task status');
    }
  },
);

export const submitPhotoPodThunk = createAsyncThunk(
  'task/submitPhotoPod',
  async (
    params: { taskId: string; photoS3Key: string; location: LatLng },
    { rejectWithValue },
  ) => {
    try {
      const updatedTask = await taskApi.submitPhotoPod(params);
      return updatedTask;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to submit Proof of Delivery');
    }
  },
);

export const submitOtpPodThunk = createAsyncThunk(
  'task/submitOtpPod',
  async (
    params: { taskId: string; otp: string; location: LatLng },
    { rejectWithValue },
  ) => {
    try {
      const updatedTask = await taskApi.submitOtpPod(params);
      return updatedTask;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to submit OTP');
    }
  },
);

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setTaskOffer: (state, action: PayloadAction<TaskOfferPayload>) => {
      // A rider can only receive an offer if they don't have an active task
      if (!state.activeTask) {
        state.taskOffer = action.payload;
      }
    },
    clearTaskOffer: state => {
      state.taskOffer = null;
    },
    clearActiveTask: state => {
      state.activeTask = null;
      state.status = 'idle';
      state.error = null;
    },
    setTaskCancelled: (state, action: PayloadAction<{ taskId: string }>) => {
      if (state.activeTask && state.activeTask.id === action.payload.taskId) {
        state.activeTask = null;
        state.status = 'idle';
      }
      if (state.taskOffer && state.taskOffer.task.id === action.payload.taskId) {
        state.taskOffer = null;
      }
    },
    clearTaskError: state => {
        state.error = null;
        state.status = 'idle';
    }
  },
  extraReducers: builder => {
    builder
      // Accept Task
      .addCase(acceptTaskThunk.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(acceptTaskThunk.fulfilled, (state, action: PayloadAction<Task>) => {
        state.status = 'succeeded';
        state.activeTask = action.payload;
        state.taskOffer = null; // Clear offer once accepted
      })
      .addCase(acceptTaskThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.taskOffer = null; // Clear offer on failure (e.g., already taken)
      })

      // Reject Task
      .addCase(rejectTaskThunk.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(rejectTaskThunk.fulfilled, state => {
        state.status = 'succeeded';
        state.taskOffer = null; // Clear offer on rejection
      })
      .addCase(rejectTaskThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.taskOffer = null; // Clear offer on failure
      })

      // Update Task Status (generic for all steps)
      .addCase(updateTaskStatusThunk.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateTaskStatusThunk.fulfilled, (state, action: PayloadAction<Task>) => {
        state.status = 'succeeded';
        if (state.activeTask && state.activeTask.id === action.payload.id) {
          state.activeTask = action.payload;
          // If the final status is Delivered or Cancelled, clear the active task
          if (action.payload.status === 'Delivered' || action.payload.status === 'Cancelled') {
            state.activeTask = null;
          }
        }
      })
      .addCase(updateTaskStatusThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Submit Photo POD
      .addCase(submitPhotoPodThunk.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitPhotoPodThunk.fulfilled, (state, action: PayloadAction<Task>) => {
        state.status = 'succeeded';
        if (state.activeTask && state.activeTask.id === action.payload.id) {
          state.activeTask = action.payload; // Update task with any new data from backend
        }
      })
      .addCase(submitPhotoPodThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Submit OTP POD
      .addCase(submitOtpPodThunk.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitOtpPodThunk.fulfilled, (state, action: PayloadAction<Task>) => {
        state.status = 'succeeded';
        if (state.activeTask && state.activeTask.id === action.payload.id) {
            state.activeTask = action.payload; // Update task with any new data from backend
        }
      })
      .addCase(submitOtpPodThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const {
  setTaskOffer,
  clearTaskOffer,
  clearActiveTask,
  setTaskCancelled,
  clearTaskError,
} = taskSlice.actions;

// Selectors
const selectTaskState = (state: RootState) => state.task;

export const selectActiveTask = createSelector(
  [selectTaskState],
  task => task.activeTask,
);

export const selectTaskOffer = createSelector(
  [selectTaskState],
  task => task.taskOffer,
);

export const selectTaskStatus = createSelector(
  [selectTaskState],
  task => task.status,
);

export const selectTaskError = createSelector(
  [selectTaskState],
  task => task.error,
);

export const selectHasActiveTask = createSelector(
  [selectActiveTask],
  activeTask => activeTask !== null,
);

export default taskSlice.reducer;