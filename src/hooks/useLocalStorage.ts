// File: /src/hooks/useLocalStorage.ts | Version: v2.2.22
import { useState, useEffect } from 'react';

export const useLocalStorage = () => {
  const getStorage = <T>(key: string, initialValue: T): T => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error: any) {
      console.warn(`Error reading localStorage key "${key}":`, error?.message || error);
      return initialValue;
    }
  };

  const setStorage = <T>(key: string, value: T) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error: any) {
      console.warn(`Error setting localStorage key "${key}":`, error?.message || error);
    }
  };

  return { getStorage, setStorage };
};

