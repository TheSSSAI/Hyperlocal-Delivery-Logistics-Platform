import { combineReducers } from '@reduxjs/toolkit';
import taskReducer from '../features/task/taskSlice';
// PRE-PLANNED IMPORTS FOR FUTURE SLICES
// These are architecturally necessary for a complete application state.
// They will be created in their respective feature folders in subsequent dependency levels.
// import authReducer from '../features/auth/authSlice';
// import profileReducer from '../features/profile/profileSlice';
// import earningsReducer from '../features/earnings/earningsSlice';
// import uiReducer from '../features/ui/uiSlice';
// import chatReducer from '../features/chat/chatSlice';

/**
 * The root reducer for the entire application.
 *
 * This function combines all the individual feature-specific reducers (slices) into a single
 * reducer function. The resulting state object will have a shape that matches the keys
 * provided to the `combineReducers` object.
 *
 * For example, the state managed by `taskReducer` will be accessible under `state.task`.
 *
 * This follows the feature-sliced architecture where each domain concern manages its own state,
 * and the root reducer acts as the central point of integration for the global Redux store.
 */
const rootReducer = combineReducers({
  /**
   * Manages the state related to delivery tasks, including the current active task,
   * task offers, and task history.
   * Defined in: src/features/task/taskSlice.ts
   */
  task: taskReducer,

  /**
   * FUTURE SLICE: Manages authentication state, including the user's session token,
   * login status (authenticated, unauthenticated, pending), and user identity details.
   * To be defined in: src/features/auth/authSlice.ts
   */
  // auth: authReducer,

  /**
   * FUTURE SLICE: Manages the rider's profile data, such as personal details,
   * vehicle information, and bank account details for payouts.
   * To be defined in: src/features/profile/profileSlice.ts
   */
  // profile: profileReducer,

  /**
   * FUTURE SLICE: Manages financial data for the rider, including detailed earnings
   * breakdowns, cash-in-hand totals, and historical statements.
   * To be defined in: src/features/earnings/earningsSlice.ts
   */
  // earnings: earningsReducer,
  
  /**
   * FUTURE SLICE: Manages global UI state, such as loading indicators, modals,
   * snackbars/toasts, and network connectivity status.
   * To be defined in: src/features/ui/uiSlice.ts
   */
  // ui: uiReducer,

  /**
   * FUTURE SLICE: Manages state for the real-time chat feature, including
   * connection status, conversation history for the active order, and new messages.
   * To be defined in: src/features/chat/chatSlice.ts
   */
  // chat: chatReducer,
});

/**
 * The RootState type represents the entire state of the Redux store.
 * It's inferred automatically from the `rootReducer` function.
 * This type is used throughout the application to provide strong typing for
 * the `useSelector` hook and for other parts of the Redux ecosystem.
 *
 * This robust pattern ensures that the RootState type always stays in sync
 * with the structure of the reducers.
 */
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;