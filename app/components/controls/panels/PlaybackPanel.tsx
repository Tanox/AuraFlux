/**
 * File: app/components/controls/panels/PlaybackPanel.tsx
 * Version: v1.9.36
 * Author: Sut
 * Updated: 2025-07-28 16:30
 */

import React from 'react';
import { NowPlaying } from './playback/NowPlaying';
import { DisplayConfig } from './playback/DisplayConfig';
import { PlaylistManager } from './playback/PlaylistManager';

export const PlaybackPanel: React.FC = () => {
  return (
    <div id="panel-playback" className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
      {/* Column 1: Now Playing & Display Settings (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-3">
        <NowPlaying />
        <DisplayConfig />
      </div>

      {/* Column 2: Playlist Manager (7 cols) */}
      <div className="lg:col-span-7 h-full">
        <PlaylistManager />
      </div>
    </div>
  );
};