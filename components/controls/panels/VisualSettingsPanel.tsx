
/**
 * File: components/controls/panels/VisualSettingsPanel.tsx
 * Version: 2.5.0
 * Author: Sut
 * Updated: 2025-07-27 16:00
 */

import React from 'react';
import { CoreVisuals } from './visual/CoreVisuals';
import { AiBackground } from './visual/AiBackground';
import { ModeSelector } from './visual/ModeSelector';

export const VisualSettingsPanel: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
      {/* Column 1: Core Tuning & Display (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-3">
        <CoreVisuals />
        <AiBackground />
      </div>

      {/* Column 2: Engine Selection (5 cols) */}
      <div className="lg:col-span-5 h-full">
        <ModeSelector />
      </div>
    </div>
  );
};
