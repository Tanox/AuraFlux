// File: src/hooks/useLocalStorage.ts | Version: v1.9.81
import { useCallback } from 'react';

export const useLocalStorage = () => {
  const getStorage = useCallback(<T>(key: string, initialValue: T): T => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, []);

  const setStorage = useCallback(<T>(key: string, value: T) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, []);

  return { getStorage, setStorage };
};
