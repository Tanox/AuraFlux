// File: app/components/controls/panels/VisualSettingsPanel.tsx | Version: v1.9.65
import React from 'react';
import { CoreVisuals } from './visual/CoreVisuals.tsx';
import { AiBackground } from './visual/AiBackground.tsx';
import { ModeSelector } from './visual/ModeSelector.tsx';

export const VisualSettingsPanel: React.FC = () => {
  return (
    <div id="panel-visual" className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
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