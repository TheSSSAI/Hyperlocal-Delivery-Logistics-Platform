import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Order, OrderSummary, CreateOrderPayload, RatingPayload } from './orders.types';
import { ordersService } from './ordersService';
import { realtimeService } from '../../services/realtimeService';

export interface RiderLocationUpdate {
    orderId: string;
    location: {
        lat: number;
        lng: number;
    };
}

export interface OrderStatusUpdate {
    orderId: string;
    status: string;
    message: string;
}


interface OrdersState {
  orderHistory: OrderSummary[];
  activeOrder: Order | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orderHistory: [],
  activeOrder: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
};

// Async Thunks
export const fetchOrderHistory = createAsyncThunk<OrderSummary[], void>(
  'orders/fetchOrderHistory',
  async (_, { rejectWithValue }) => {
    try {
      return await ordersService.getOrderHistory();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order history');
    }
  },
);

export const fetchOrderDetails = createAsyncThunk<Order, string>(
    'orders/fetchOrderDetails',
    async (orderId, { rejectWithValue }) => {
      try {
        const order = await ordersService.getOrderDetails(orderId);
        if (['In Transit'].includes(order.status)) {
            realtimeService.subscribe(`order:${orderId}:location`, (data) => {
                // This would typically dispatch an action, handled below
            });
        }
        return order;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch order details');
      }
    }
);

export const createOrder = createAsyncThunk<Order, CreateOrderPayload>(
    'orders/createOrder',
    async (payload, { rejectWithValue }) => {
        try {
            return await ordersService.createOrder(payload);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create order');
        }
    }
);

export const submitRating = createAsyncThunk<void, { orderId: string, payload: RatingPayload }>(
    'orders/submitRating',
    async ({ orderId, payload }, { rejectWithValue }) => {
        try {
            await ordersService.submitRating(orderId, payload);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to submit rating');
        }
    }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    updateActiveOrderStatus: (state, action: PayloadAction<OrderStatusUpdate>) => {
        if (state.activeOrder && state.activeOrder.id === action.payload.orderId) {
            state.activeOrder.status = action.payload.status;
        }
    },
    updateRiderLocation: (state, action: PayloadAction<RiderLocationUpdate>) => {
        if (state.activeOrder && state.activeOrder.id === action.payload.orderId && state.activeOrder.rider) {
            state.activeOrder.rider.location = action.payload.location;
        }
    },
    clearActiveOrder: (state) => {
        if (state.activeOrder) {
            realtimeService.unsubscribe(`order:${state.activeOrder.id}:location`);
        }
        state.activeOrder = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Order History
    builder
      .addCase(fetchOrderHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action: PayloadAction<OrderSummary[]>) => {
        state.isLoading = false;
        state.orderHistory = action.payload;
      })
      .addCase(fetchOrderHistory.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch Order Details
    builder
      .addCase(fetchOrderDetails.pending, (state) => {
        state.isLoading = true;
        state.activeOrder = null;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action: PayloadAction<Order>) => {
        state.isLoading = false;
        state.activeOrder = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create Order
    builder
      .addCase(createOrder.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.isSubmitting = false;
        state.activeOrder = action.payload;
        // Also add to history
        state.orderHistory.unshift({ id: action.payload.id, vendorName: action.payload.vendorName, placedAt: action.payload.placedAt, total: action.payload.total, status: action.payload.status });
      })
      .addCase(createOrder.rejected, (state, action: PayloadAction<any>) => {
        state.isSubmitting = false;
        state.error = action.payload;
      });

    // Submit Rating
    builder
      .addCase(submitRating.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(submitRating.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(submitRating.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload;
      });
  },
});

export const { updateActiveOrderStatus, updateRiderLocation, clearActiveOrder } = ordersSlice.actions;

export default ordersSlice.reducer;