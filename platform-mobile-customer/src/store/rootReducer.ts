import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productsReducer from '../features/products/productsSlice';
import cartReducer from '../features/cart/cartSlice';
import ordersReducer from '../features/orders/ordersSlice';
import profileReducer from '../features/profile/profileSlice';

/**
 * Combines all feature reducers into a single root reducer.
 * This is the main reducer that will be passed to the Redux store.
 *
 * Each key in the object passed to combineReducers corresponds to a slice of the state.
 */
export const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
  cart: cartReducer,
  orders: ordersReducer,
  profile: profileReducer,
});

/**
 * The RootState type represents the entire state of the Redux store.
 * It's inferred from the `rootReducer` to ensure it's always up-to-date
 * with the slices of state. This type is used for typing the `useSelector` hook
 * throughout the application for type-safe state access.
 */
export type RootState = ReturnType<typeof rootReducer>;