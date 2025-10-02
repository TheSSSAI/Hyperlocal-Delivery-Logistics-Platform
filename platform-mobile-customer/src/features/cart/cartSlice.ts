import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Cart, CartItem as CartItemType, CartUpdatePayload } from './cart.types';
import { cartService } from './cartService';
import { Product } from '../../types/product.types';

interface CartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  isLoading: false,
  error: null,
};

export const fetchCart = createAsyncThunk<Cart, void>(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      return await cartService.getCart();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
    }
  },
);

export const addItemToCart = createAsyncThunk<Cart, Product>(
  'cart/addItemToCart',
  async (product, { rejectWithValue, getState }) => {
    try {
      const updatePayload: CartUpdatePayload = { productId: product.id, quantity: 1 };
      return await cartService.updateCart([updatePayload]);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add item');
    }
  },
);

export const updateItemQuantity = createAsyncThunk<Cart, { productId: string, quantity: number }>(
    'cart/updateItemQuantity',
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const updatePayload: CartUpdatePayload = { productId, quantity };
            return await cartService.updateCart([updatePayload]);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update quantity');
        }
    }
);

export const removeItemFromCart = createAsyncThunk<Cart, string>(
    'cart/removeItemFromCart',
    async (productId, { rejectWithValue }) => {
        try {
            const updatePayload: CartUpdatePayload = { productId, quantity: 0 };
            return await cartService.updateCart([updatePayload]);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove item');
        }
    }
);


const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = null;
    },
    clearCartError: (state) => {
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    const handlePending = (state: CartState) => {
      state.isLoading = true;
      state.error = null;
    };
    const handleFulfilled = (state: CartState, action: PayloadAction<Cart>) => {
      state.isLoading = false;
      state.cart = action.payload;
    };
    const handleRejected = (state: CartState, action: PayloadAction<any>) => {
      state.isLoading = false;
      state.error = action.payload;
    };
    
    builder
      .addCase(fetchCart.pending, handlePending)
      .addCase(fetchCart.fulfilled, handleFulfilled)
      .addCase(fetchCart.rejected, handleRejected)
      .addCase(addItemToCart.pending, handlePending)
      .addCase(addItemToCart.fulfilled, handleFulfilled)
      .addCase(addItemToCart.rejected, handleRejected)
      .addCase(updateItemQuantity.pending, handlePending)
      .addCase(updateItemQuantity.fulfilled, handleFulfilled)
      .addCase(updateItemQuantity.rejected, handleRejected)
      .addCase(removeItemFromCart.pending, handlePending)
      .addCase(removeItemFromCart.fulfilled, handleFulfilled)
      .addCase(removeItemFromCart.rejected, handleRejected);
  },
});

export const { clearCart, clearCartError } = cartSlice.actions;

export default cartSlice.reducer;