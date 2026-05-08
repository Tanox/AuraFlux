// src/components/controls/panels/VisualSettingsPanel.tsx v2.3.10

import React from 'react';
import { ModeSelector } from '../visual/ModeSelector';
import { CoreVisuals } from '../visual/CoreVisuals';
import { AiBackground } from '../visual/AiBackground';
import { ModeSpecificSettings } from '../visual/ModeSpecificSettings';

export const VisualSettingsPanel: React.FC = () => {
  return (
    <div id="visual-settings-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
      <div className="lg:col-span-7 flex flex-col gap-3">
        <ModeSelector />
        <ModeSpecificSettings />
      </div>
      <div className="lg:col-span-5 flex flex-col gap-3">
        <AiBackground />
        <CoreVisuals />
      </div>
    </div>
  );
};

