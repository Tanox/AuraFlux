// src/components/controls/panels/AudioSettingsPanel.tsx v2.3.10

import React from 'react';
import { InputSettings } from '../audio/InputSettings';
import { AiSettings } from '../audio/AiSettings';

export const AudioSettingsPanel: React.FC = () => {
  return (
    <div id="audio-settings-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
      <div className="lg:col-span-7 flex flex-col gap-3">
        <InputSettings />
      </div>
      <div className="lg:col-span-5 flex flex-col gap-3">
        <AiSettings />
      </div>
    </div>
  );
};

