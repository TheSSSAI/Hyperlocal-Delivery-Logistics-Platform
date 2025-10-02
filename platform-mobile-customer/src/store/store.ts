import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { rootReducer } from './rootReducer';
import { AppState } from './rootReducer';

// Per REQ-1-087 & CUS-044, we need offline support.
// We will persist critical slices of the state to local storage.
// 'auth' slice is persisted to keep the user logged in across app launches.
// 'cart' slice is persisted to prevent losing the cart if the app is closed.
// 'profile' and 'orders' (for history) can also be persisted for a better offline UX.
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'cart', 'profile', 'orders'], // Slices to persist
  // Blacklist can be used for slices that should not be persisted, e.g., 'products' if we always want fresh data.
};

const persistedReducer = persistReducer<AppState>(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for redux-persist, as they are not serializable but are necessary.
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      // Disabling thunk check because we use thunks for async actions.
      // And immutable check for performance in production.
      immutableCheck: { warnAfter: 128 },
      serializableCheck: { warnAfter: 128 },
    }),
  // Enable Redux DevTools in development environments
  devTools: process.env.NODE_ENV !== 'production',
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
// These types are used throughout the application for type safety with Redux hooks.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;