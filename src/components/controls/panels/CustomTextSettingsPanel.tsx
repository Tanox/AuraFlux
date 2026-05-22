// src/components/controls/panels/CustomTextSettingsPanel.tsx v2.3.11


import React from 'react';
import { TextLayerSetup } from '../text/TextLayerSetup';
import { TextChromaSettings } from '../text/TextChromaSettings';
import { TextStyleSettings } from '../text/TextStyleSettings';

export const CustomTextSettingsPanel: React.FC = () => {
  return (
    <div id="panel-text" className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
      {/* Column 1: Core Configuration (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-3">
        <TextLayerSetup />
        <TextChromaSettings />
      </div>

      {/* Column 2: Visual Style & Motion (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-3">
        <TextStyleSettings />
      </div>
    </div>
  );
};
