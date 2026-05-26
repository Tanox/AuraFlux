'use client';

// src/components/visualizers/ui/Toast.tsx v2.3.11

import React, { useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface Props {
  message: string | null;
  type?: 'success' | 'info' | 'error' | 'warning';
  onClose: () => void;
  duration?: number;
  position?: 'top' | 'bottom';
}

export const Toast: React.FC<Props> = memo(({ message, type = 'info', onClose, duration = 3000, position = 'bottom' }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [message, onClose, duration]);

  const colors = {
    success: 'bg-green-500',
    info: 'bg-blue-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500'
  };

  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.div
          key={message}
          id="toast-container"
          initial={{ opacity: 0, y: position === 'top' ? -50 : 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: position === 'top' ? -20 : 20, scale: 0.9 }}
          className={`fixed ${position === 'top' ? 'top-8' : 'bottom-8'} left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full text-white font-bold shadow-2xl ${colors[type]} flex items-center gap-3`}
        >
          <span>{message}</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

Toast.displayName = 'Toast';

