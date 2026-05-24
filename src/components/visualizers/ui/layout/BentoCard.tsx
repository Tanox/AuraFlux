// src/components/visualizers/ui/layout/BentoCard.tsx v2.3.11

import React from 'react';

interface Props {
  children: React.ReactNode;
  title?: string;
  className?: string;
  id?: string;
  action?: React.ReactNode;
}

export const BentoCard: React.FC<Props> = React.memo(({ children, title, className = '', id, action }) => {
  return (
    <div 
      id={id}
      className={`bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      {(title || action) && (
        <div className="flex justify-between items-center mb-1">
          {title && (
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
              {title}
            </h4>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
});

BentoCard.displayName = 'BentoCard';

