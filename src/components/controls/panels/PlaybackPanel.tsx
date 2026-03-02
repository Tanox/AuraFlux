// File: src/components/controls/panels/PlaybackPanel.tsx | Version: v1.9.80
import React from 'react';
import { NowPlaying } from './playback/NowPlaying';
import { PlaylistManager } from './playback/PlaylistManager';
import { DisplayConfig } from './playback/DisplayConfig';

export const PlaybackPanel: React.FC = () => {
  return (
    <div id="playback-panel" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <PlaylistManager />
      </div>
      <div className="space-y-6">
        <NowPlaying />
        <DisplayConfig />
      </div>
    </div>
  );
};
