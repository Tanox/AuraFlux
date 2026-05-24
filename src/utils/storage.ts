// src/utils/storage.ts v2.3.11
import { logger } from './logger';

/**
 * Safe localStorage utility with error handling
 */

/**
 * Safely get an item from localStorage
 * @param key - The storage key
 * @param defaultValue - Default value if key doesn't exist or error occurs
 * @returns The parsed value or defaultValue
 */
export const safeStorageGet = <T>(key: string, defaultValue?: T): T | null => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return defaultValue ?? null;
  }

  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue ?? null;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    logger.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue ?? null;
  }
};

/**
 * Safely set an item in localStorage
 * @param key - The storage key
 * @param value - The value to store (will be JSON stringified)
 * @returns boolean indicating success
 */
export const safeStorageSet = <T>(key: string, value: T): boolean => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    logger.warn(`Error setting localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Safely remove an item from localStorage
 * @param key - The storage key
 * @returns boolean indicating success
 */
export const safeStorageRemove = (key: string): boolean => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    logger.warn(`Error removing localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Safely clear all items from localStorage
 * @returns boolean indicating success
 */
export const safeStorageClear = (): boolean => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    localStorage.clear();
    return true;
  } catch (error) {
    logger.warn('Error clearing localStorage:', error);
    return false;
  }
};

// Convenient object with all methods
export const safeStorage = {
  get: safeStorageGet,
  set: safeStorageSet,
  remove: safeStorageRemove,
  clear: safeStorageClear,
};
