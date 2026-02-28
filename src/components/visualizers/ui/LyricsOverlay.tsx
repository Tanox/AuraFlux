/**
 * File: app/components/visualizers/ui/LyricsOverlay.tsx
 * Version: v1.9.73
 * Author: Sut
 */

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { VisualizerSettings, SongInfo, LyricsStyle } from '../../../types/index.ts';
import { useAudioPulse } from '../../../hooks/useAudioPulse';
import { useAudioContext, useUI, useAI } from '@/src/context/AppContext';
import { parseLrc, LrcLine } from '../../../utils/lyricsUtils';
import { SyncedLyrics } from './lyrics/SyncedLyrics';
import { StaticLyrics } from './lyrics/StaticLyrics';

interface LyricsOverlayProps {
  settings: VisualizerSettings;
  song: SongInfo | null;
  showLyrics: boolean;
  lyricsStyle: LyricsStyle;
  analyser: AnalyserNode | null;
}

const LyricsOverlay: React.FC<LyricsOverlayProps> = ({ settings, song, showLyrics, lyricsStyle, analyser }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { currentTime } = useAudioContext();
  const { isIdentifying } = useAI();
  const { t } = useUI();
  
  const [activeIndex, setActiveIndex] = useState(-1);

  const isEnabled = showLyrics && !!song && !song.isError;
  const hasFullLyrics = !!song?.lyrics;
  const rawText = hasFullLyrics ? song?.lyrics : song?.lyricsSnippet;

  const lrcLines = useMemo(() => {
      if (hasFullLyrics && rawText && rawText.includes('[')) return parseLrc(rawText);
      return [];
  }, [hasFullLyrics, rawText]);

  const isSynced = lrcLines.length > 0;

  useEffect(() => {
      if (!isSynced) return;
      const idx = lrcLines.findIndex((line, i) => {
          const nextTime = lrcLines[i+1]?.time || Infinity;
          return currentTime >= line.time && currentTime < nextTime;
      });
      setActiveIndex(idx);
  }, [currentTime, isSynced, lrcLines]);

  useEffect(() => {
      if (isSynced && activeIndex !== -1 && scrollContainerRef.current) {
          const el = scrollContainerRef.current.children[activeIndex] as HTMLElement;
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
  }, [activeIndex, isSynced]);

  useAudioPulse({
    elementRef: containerRef,
    analyser,
    settings,
    isEnabled: !!isEnabled,
    pulseStrength: isSynced ? 0.05 : (lyricsStyle === LyricsStyle.KARAOKE ? 0.35 : 0.15),
    opacityStrength: 0,
    baseOpacity: 1.0,
  });

  if (!isEnabled) return null;

  let content: React.ReactNode;

  if (isIdentifying && !hasFullLyrics) {
      content = (
          <div className="flex flex-col items-center gap-4 animate-pulse">
              <div className="w-12 h-12 border-4 border-white/10 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">{t?.audioPanel?.analyzing || "Retrieving Lyrics..."}</p>
          </div>
      );
  } else if (isSynced) {
      content = (
          <SyncedLyrics 
            lrcLines={lrcLines}
            activeIndex={activeIndex}
            lyricsStyle={lyricsStyle}
            settings={settings}
            scrollContainerRef={scrollContainerRef}
          />
      );
  } else {
      content = (
          <StaticLyrics 
            rawText={rawText || ""}
            hasFullLyrics={hasFullLyrics}
            lyricsStyle={lyricsStyle}
            settings={settings}
            t={t}
          />
      );
  }

  const containerClass = isSynced 
      ? `fixed inset-0 z-[15] flex flex-col items-center justify-center pointer-events-none`
      : `pointer-events-none fixed inset-0 z-[15] flex flex-col px-6 pt-24 pb-48 md:pb-32 pb-safe ${getPositionClasses(settings.lyricsPosition)}`;

  return (
    <div id="lyrics-overlay-container" className={containerClass}>
      <div 
        id="lyrics-content"
        ref={containerRef}
        className={`transition-all duration-700 ${isSynced ? "w-full h-full flex items-center justify-center" : ""}`}
        style={{
            transform: 'scale(var(--pulse-scale, 1))',
            opacity: 'var(--pulse-opacity, 1)'
        }}
      >
         {content}
      </div>
    </div>
  );
};

const getPositionClasses = (pos: string = 'mc') => {
    const map: Record<string, string> = {
        tl: 'justify-start items-start text-left',
        tc: 'justify-start items-center text-center',
        tr: 'justify-start items-end text-right',
        ml: 'justify-center items-start text-left',
        mc: 'justify-center items-center text-center',
        mr: 'justify-center items-end text-right',
        bl: 'justify-end items-start text-left',
        bc: 'justify-end items-center text-center',
        br: 'justify-end items-end text-right',
    };
    return map[pos] || map.mc;
};

export default LyricsOverlay;