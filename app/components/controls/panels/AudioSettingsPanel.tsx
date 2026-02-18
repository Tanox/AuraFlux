// File: app/components/controls/panels/AudioSettingsPanel.tsx | Version: v1.9.72
import React from 'react';
import { InputSettings } from './audio/InputSettings.tsx';
import { AiSettings } from './audio/AiSettings.tsx';

export const AudioSettingsPanel: React.FC = () => {
  return (
    <div id="panel-audio" className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
      {/* Column 1: Signal & Capture (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-3">
        <InputSettings />
      </div>

      {/* Column 2: AI Intelligence & Synergy (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-3">
        <AiSettings />
      </div>
    </div>
  );
};