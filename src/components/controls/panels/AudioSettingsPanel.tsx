// File: src/components/controls/panels/AudioSettingsPanel.tsx | Version: v1.9.80
import React from 'react';
import { InputSettings } from './audio/InputSettings';
import { AiSettings } from './audio/AiSettings';

export const AudioSettingsPanel: React.FC = () => {
  return (
    <div id="audio-settings-panel" className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <InputSettings />
      <AiSettings />
    </div>
  );
};
