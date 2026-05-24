// src/components/controls/panels/PlaybackPanel.tsx v2.3.11

import React from 'react';
import { NowPlaying } from '../playback/NowPlaying';
import { PlaylistManager } from '../playback/PlaylistManager';
import { DisplayConfig } from '../playback/DisplayConfig';

export const PlaybackPanel: React.FC = () => {
  return (
    <div id="playback-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
      <div className="lg:col-span-7 flex flex-col gap-3">
        <PlaylistManager />
      </div>
      <div className="lg:col-span-5 flex flex-col gap-3">
        <NowPlaying />
        <DisplayConfig />
      </div>
    </div>
  );
};

