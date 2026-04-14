// File: src\components\visualizers\ui\controls\SegmentedControl.tsx | Version: v2.2.18
import React from 'react';
import { motion } from 'motion/react';

interface Option {
  id: string;
  label: string;
}

interface Props {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SegmentedControl: React.FC<Props> = ({ options, value, onChange, className = '' }) => {
  return (
    <div className={`flex p-1 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10 ${className}`}>
      {options.map((option) => {
        const isActive = value === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`relative flex-1 py-1.5 px-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors ${
              isActive ? 'text-black dark:text-white' : 'text-black/50 dark:text-white/50 hover:text-black/80 dark:hover:text-white/80'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="segmented-control-active"
                className="absolute inset-0 bg-white dark:bg-white/10 rounded-lg shadow-sm"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};

