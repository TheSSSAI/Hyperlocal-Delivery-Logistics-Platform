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
import rootReducer from './rootReducer';

/**
 * Configuration for redux-persist.
 * This configuration determines how the Redux store state is persisted to and
 * rehydrated from the device's local storage.
 *
 * REQ-1-087: Implement basic offline support to view locally cached data.
 * The persistence layer is a foundational part of this requirement, allowing
 * slices like `auth` (for user profile) and `task` (for task history)
 * to be available when the app is offline.
 *
 * - key: The key for the persisted state in AsyncStorage. 'root' is standard.
 * - storage: The storage engine to use. AsyncStorage is the default for React Native.
 * - version: A version number for the persisted state. Useful for migrations.
 * - whitelist: An array of reducer names to persist. We selectively persist
 *   state to avoid storing transient or sensitive data.
 *   - 'auth': Persists user profile information for offline viewing.
 *             Note: JWTs are handled separately in secure storage.
 *   - 'task': Persists task history and potentially the active task for
 *             offline resilience.
 */
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  version: 1,
  whitelist: ['auth', 'task'], // Add slices you want to persist here
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Configures the Redux store using Redux Toolkit's `configureStore`.
 * This function simplifies store setup by automatically including recommended
 * middleware like redux-thunk and enabling the Redux DevTools Extension.
 *
 * - reducer: The root reducer for the application. We use the `persistedReducer`
 *   to enable offline state persistence.
 * - middleware: We customize the middleware to handle non-serializable actions
 *   that are part of redux-persist's lifecycle. This is a standard configuration
 *   to avoid development-mode warnings when using redux-persist with RTK.
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

/**
 * Creates a persistor for the Redux store.
 * The persistor object is used by the `PersistGate` component in the UI
 * to delay rendering until the persisted state has been rehydrated.
 */
export const persistor = persistStore(store);

/**
 * Type definition for the root state of the application.
 * Inferred from the store itself, this type provides strong type-checking
 * for selectors and component props throughout the application.
 * It is consumed by the `useAppSelector` hook.
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Type definition for the dispatch function of the Redux store.
 * This type includes types for any middleware being used (e.g., Thunk).
 * It is consumed by the `useAppDispatch` hook to ensure dispatched actions
 * and thunks are type-safe.
 */
export type AppDispatch = typeof store.dispatch;