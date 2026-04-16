// File: src\components\controls\panels\VisualSettingsPanel.tsx | Version: v2.2.23
import React from 'react';
import { ModeSelector } from '../visual/ModeSelector';
import { CoreVisuals } from '../visual/CoreVisuals';
import { AiBackground } from '../visual/AiBackground';

export const VisualSettingsPanel: React.FC = () => {
  return (
    <div id="visual-settings-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
      <div className="lg:col-span-7 flex flex-col gap-3">
        <ModeSelector />
      </div>
      <div className="lg:col-span-5 flex flex-col gap-3">
        <AiBackground />
        <CoreVisuals />
      </div>
    </div>
  );
};

