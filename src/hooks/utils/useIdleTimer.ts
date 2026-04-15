'use client';
// File: src\hooks\utils\useIdleTimer.ts | Version: v2.2.23
import { useState, useEffect } from 'react';

export const useIdleTimer = (isExpanded: boolean, autoHide: boolean = true) => {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    if (!autoHide) {
      setIsIdle(false);
      return;
    }

    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      setIsIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsIdle(true);
      }, 3000);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('mousedown', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('touchstart', resetTimer);

    resetTimer();

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('mousedown', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('touchstart', resetTimer);
      clearTimeout(timer);
    };
  }, [autoHide]);

  return { isIdle };
};

