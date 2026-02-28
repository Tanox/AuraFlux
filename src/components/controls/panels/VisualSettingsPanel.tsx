// File: src/components/controls/panels/VisualSettingsPanel.tsx | Version: v1.9.76
import React from 'react';
import { ModeSelector } from './visual/ModeSelector';
import { CoreVisuals } from './visual/CoreVisuals';
import { AiBackground } from './visual/AiBackground';

export const VisualSettingsPanel: React.FC = () => {
  return (
    <div id="visual-settings-panel" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <ModeSelector />
        <CoreVisuals />
      </div>
      <div className="space-y-6">
        <AiBackground />
      </div>
    </div>
  );
};
