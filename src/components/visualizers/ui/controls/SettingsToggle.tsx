// src/components/visualizers/ui/controls/SettingsToggle.tsx v2.3.11


import React, { memo } from 'react';
import { TooltipArea } from './Tooltip';

interface SettingsToggleProps {
  label: string; 
  value: boolean; 
  onChange: () => void; 
  activeColor?: string; 
  hintText?: string; 
  statusText?: string; 
  children?: React.ReactNode; 
  variant?: 'default' | 'clean';
}

export const SettingsToggle = memo(({ label, value, onChange, activeColor = 'blue', hintText, statusText, children, variant = 'default' }: SettingsToggleProps) => {
  const activeBg = activeColor === 'green' ? 'bg-green-500' : 'bg-blue-600';
  const neonShadow = value 
    ? (activeColor === 'green' ? 'shadow-[0_0_12px_rgba(34,197,94,0.4)]' : 'shadow-[0_0_12px_rgba(59,130,246,0.4)]') 
    : '';
  
  const containerClasses = variant === 'clean' 
    ? 'py-2 flex flex-col group'
    : 'bg-black/[0.03] dark:bg-white/[0.03] p-2.5 rounded-xl border border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10 transition-colors';
    
  const headerClasses = variant === 'clean'
    ? 'flex items-center justify-start gap-3 w-full' 
    : 'flex items-center justify-start gap-3 min-h-[22px] w-full';

  const labelClasses = `text-xs font-bold uppercase tracking-wider leading-none transition-colors text-left ${
    variant === 'clean' ? 'text-black/60 dark:text-white/60 group-hover:text-black dark:group-hover:text-white' : 'text-black/60 dark:text-white/60'
  }`;

  return (
    <div className={containerClasses}> 
      <div className={headerClasses}>
        {/* Switch on the LEFT */}
        <button 
          onClick={onChange} 
          className={`relative w-10 h-5 rounded-full transition-all duration-300 ease-in-out focus:outline-none flex items-center shrink-0 ${value ? activeBg : 'bg-black/10 dark:bg-white/10'} ${neonShadow}`}
          role="switch" 
          aria-checked={value}
          aria-label={label}
        >
          <span className={`inline-block w-4 h-4 transform transition-transform duration-200 ease-in-out bg-white rounded-full shadow-sm ${value ? 'translate-x-[22px]' : 'translate-x-[2px]'}`} />
        </button>

        {/* Label on the RIGHT, text-left */}
        <TooltipArea text={hintText} className="flex-1">
          <span className={labelClasses}>{label}</span>
        </TooltipArea>
      </div>
      
      {statusText && <div className="text-[10px] font-mono text-black/30 dark:text-white/30 uppercase tracking-widest text-left mt-1 ml-[52px]">{statusText}</div>}
      {value && children && <div className="mt-2 pt-2 border-t border-black/5 dark:border-white/5 animate-fade-in-up w-full">{children}</div>}
    </div>
  );
});

SettingsToggle.displayName = 'SettingsToggle';
