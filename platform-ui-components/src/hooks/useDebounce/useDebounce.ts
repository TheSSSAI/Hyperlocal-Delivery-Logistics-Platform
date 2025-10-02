import { useState, useEffect } from 'react';

/**
 * A custom React hook that debounces a value.
 * It's useful for delaying an expensive operation (like an API call)
 * until the user has stopped typing for a specified period.
 *
 * @template T The type of the value to be debounced.
 * @param {T} value The value to debounce.
 * @param {number} delay The debounce delay in milliseconds.
 * @returns {T} The debounced value, which updates only after the delay has passed
 * since the last time the `value` prop changed.
 *
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 * useEffect(() => {
 *   // This effect will only run 500ms after the user stops typing
 *   if (debouncedSearchTerm) {
 *     fetchResults(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 *
 * <input onChange={(e) => setSearchTerm(e.target.value)} />
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // This is the cleanup function that React will run:
    // 1. When the component unmounts.
    // 2. Before running the effect again due to a change in `value` or `delay`.
    // This ensures that we cancel the previous timer before setting a new one,
    // which is the core of the debounce logic.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Only re-run the effect if value or delay changes

  return debouncedValue;
};