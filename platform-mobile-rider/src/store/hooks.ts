import {useDispatch, useSelector, TypedUseSelectorHook} from 'react-redux';
import type {RootState, AppDispatch} from './store';

// This file provides typed versions of the standard React-Redux hooks.
// Using these throughout the app instead of the plain `useDispatch` and `useSelector`
// will provide full TypeScript support for the Redux store state and dispatchable actions.
// This is a standard best practice for using Redux Toolkit with TypeScript.

// The actual types `RootState` and `AppDispatch` will be imported from `src/store/store.ts`
// once that file is created in a higher dependency level. This setup is standard
// to avoid circular dependency issues between the store, slices, and hooks.

/**
 * A typed version of the `useDispatch` hook from React-Redux.
 * Use this hook to dispatch actions with type safety.
 *
 * @example
 * const dispatch = useAppDispatch();
 * dispatch(someAction(payload));
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * A typed version of the `useSelector` hook from React-Redux.
 * Use this hook to select data from the store with type safety.
 *
 * @example
 * const someValue = useAppSelector(state => state.someSlice.someValue);
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;