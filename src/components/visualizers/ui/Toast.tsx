// File: src/components/visualizers/ui/Toast.tsx | Version: v1.9.88
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  message: string | null;
  type?: 'success' | 'info' | 'error';
  onClose: () => void;
  duration?: number;
  position?: 'top' | 'bottom';
}

export const Toast: React.FC<Props> = ({ message, type = 'info', onClose, duration = 3000, position = 'bottom' }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [message, onClose, duration]);

  const colors = {
    success: 'bg-green-500',
    info: 'bg-blue-500',
    error: 'bg-red-500'
  };

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          id="toast-container"
          initial={{ opacity: 0, y: position === 'top' ? -50 : 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: position === 'top' ? -20 : 20, scale: 0.9 }}
          className={`fixed ${position === 'top' ? 'top-8' : 'bottom-8'} left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-full text-white font-bold shadow-2xl ${colors[type]}`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
