// src/components/visualizers/ui/controls/Slider.tsx v2.3.11

import React, { memo, useCallback, useId } from 'react';
import { TooltipArea } from './Tooltip';

interface SliderProps {
  label: string; 
  value: number; 
  min: number; 
  max: number; 
  step: number; 
  onChange: (val: number) => void; 
  unit?: string; 
  hintText?: string;
  disabled?: boolean;
}

export const Slider = memo(({ label, value, min, max, step, onChange, unit = '', hintText, disabled = false }: SliderProps) => {
  const safeValue = value ?? 0;
  const percentage = ((safeValue - min) / (max - min)) * 100;
  const id = useId();
  const labelId = `${id}-label`;
  const valueId = `${id}-value`;
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(parseFloat(e.target.value));
  }, [onChange]);
  
  return (
    <div className={`space-y-1.5 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex justify-between items-center px-1">
        <TooltipArea text={hintText}>
          <span id={labelId} className="text-label">
            {label}
          </span>
        </TooltipArea>
        <span id={valueId} className="text-mono" aria-live="polite">
          {safeValue.toFixed(step < 1 ? (step < 0.1 ? 2 : 1) : 0)}{unit}
        </span>
      </div>
      <div className="group relative flex items-center h-5 w-full">
          <input 
              type="range" 
              id={id}
              min={min} 
              max={max} 
              step={step} 
              value={safeValue} 
              onChange={handleChange}
              disabled={disabled}
              className="absolute w-full h-full opacity-0 cursor-pointer z-20 m-0 p-0 touch-auto"
              aria-labelledby={labelId}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={safeValue}
              aria-describedby={hintText ? valueId : undefined}
          />
          
          <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden relative pointer-events-none transition-colors group-hover:bg-black/15 dark:group-hover:bg-white/15">
              <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-[width] duration-150 ease-out" 
                  style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }} 
              />
          </div>
          
          <div 
              className="absolute pointer-events-none z-10 transition-[left] duration-150 ease-out"
              style={{ 
                  left: `${Math.max(0, Math.min(100, percentage))}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
              }}
          >
              <div className="h-4 w-4 bg-white rounded-full shadow-[0_0_12px_rgba(59,130,246,0.9)] ring-3 ring-blue-500/20 transition-all duration-200 group-hover:scale-125 group-hover:shadow-[0_0_20px_rgba(59,130,246,1)]" />
          </div>
      </div>
    </div>
  );
});

Slider.displayName = 'Slider';
