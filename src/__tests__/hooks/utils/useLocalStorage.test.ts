/**
 * File: src/hooks/useLocalStorage.test.ts
 * Version: v2.0.6
 */

import { renderHook } from '@testing-library/react';
import { useLocalStorage } from '../../../hooks/utils/useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    // 清除 localStorage 中的所有数据
    window.localStorage.clear();
  });

  describe('getStorage', () => {
    it('should return initial value when key does not exist', () => {
      const { result } = renderHook(() => useLocalStorage());
      const initialValue = { theme: 'dark' };
      const value = result.current.getStorage('theme', initialValue);
      
      expect(value).toEqual(initialValue);
    });

    it('should return stored value when key exists', () => {
      const { result } = renderHook(() => useLocalStorage());
      const storedValue = { theme: 'light' };
      window.localStorage.setItem('theme', JSON.stringify(storedValue));
      
      const value = result.current.getStorage('theme', { theme: 'dark' });
      expect(value).toEqual(storedValue);
    });

    it('should return initial value when parsing fails', () => {
      const { result } = renderHook(() => useLocalStorage());
      const initialValue = { theme: 'dark' };
      window.localStorage.setItem('theme', 'invalid json');
      
      const value = result.current.getStorage('theme', initialValue);
      expect(value).toEqual(initialValue);
    });

    it('should return initial value in server environment', () => {
      const originalWindow = global.window;
      delete global.window;
      
      try {
        const { result } = renderHook(() => useLocalStorage());
        const initialValue = { theme: 'dark' };
        const value = result.current.getStorage('theme', initialValue);
        expect(value).toEqual(initialValue);
      } finally {
        global.window = originalWindow;
      }
    });
  });

  describe('setStorage', () => {
    it('should set value to localStorage', () => {
      const { result } = renderHook(() => useLocalStorage());
      const value = { theme: 'light' };
      result.current.setStorage('theme', value);
      
      const storedValue = JSON.parse(window.localStorage.getItem('theme') || '{}');
      expect(storedValue).toEqual(value);
    });

    it('should handle JSON stringify errors', () => {
      const { result } = renderHook(() => useLocalStorage());
      const circularObj: any = { self: null };
      circularObj.self = circularObj;
      
      // 应该不会抛出错误
      expect(() => result.current.setStorage('circular', circularObj)).not.toThrow();
    });

    it('should do nothing in server environment', () => {
      const originalWindow = global.window;
      delete global.window;
      
      try {
        const { result } = renderHook(() => useLocalStorage());
        // 应该不会抛出错误
        expect(() => result.current.setStorage('theme', { theme: 'light' })).not.toThrow();
      } finally {
        global.window = originalWindow;
      }
    });
  });
});