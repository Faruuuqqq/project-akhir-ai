/**
 * frontend/hooks/useLocalStorage.ts
 * Custom hook for localStorage with React state sync and SSR safety
 * Provides persistent state that syncs with localStorage
 */

import { useState, useEffect, Dispatch, SetStateAction } from 'react';

/**
 * Custom hook for managing state in localStorage with SSR safety
 * @param key - The localStorage key
 * @param initialValue - Default value if key doesn't exist in localStorage
 * @returns [storedValue, setValue, isReady] - Current value, setter function, and SSR ready flag
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isReady, setIsReady] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      }
    } catch (error) {
      console.warn(`localStorage read error for key "${key}":`, error);
    } finally {
      setIsReady(true);
    }
  }, [key]);

  // Update localStorage when state changes
  const setValue: Dispatch<SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`localStorage write error for key "${key}":`, error);
    }
  };

  return [storedValue, setValue, isReady];
}
