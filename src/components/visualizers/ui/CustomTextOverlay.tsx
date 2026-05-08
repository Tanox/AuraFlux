// src/components/visualizers/ui/CustomTextOverlay.tsx v2.3.10

import React from 'react';
import { VisualizerSettings, SongInfo } from '@/types';

interface Props {
  settings: VisualizerSettings;
  analyser: AnalyserNode | null;
  song: SongInfo | null;
}

const CustomTextOverlay: React.FC<Props> = ({ settings }) => {
  if (!settings.showCustomText || !settings.customText) return null;

  return (
    <div 
      id="custom-text-overlay"
      className="fixed inset-0 pointer-events-none flex items-center justify-center z-10"
      style={{
        color: (settings.customTextColor as string) || '#ffffff',
        fontSize: `${(settings.customTextSize as number) || 2}rem`,
        opacity: (settings.customTextOpacity as number) || 0.5,
        fontFamily: (settings.customTextFont as string) || 'sans-serif'
      }}
    >
      <p className="font-bold uppercase tracking-widest">{String(settings.customText || '')}</p>
    </div>
  );
};

export default CustomTextOverlay;

