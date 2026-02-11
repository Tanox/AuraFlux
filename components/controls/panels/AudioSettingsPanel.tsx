
/**
 * File: components/controls/panels/AudioSettingsPanel.tsx
 * Version: 2.3.0
 * Author: Sut
 * Updated: 2025-07-27 12:00
 */

import React from 'react';
import { InputSettings } from './audio/InputSettings';
import { AiSettings } from './audio/AiSettings';

export const AudioSettingsPanel: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
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
