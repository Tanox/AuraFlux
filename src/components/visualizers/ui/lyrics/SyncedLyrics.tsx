// src/components/visualizers/ui/lyrics/SyncedLyrics.tsx v2.3.10


import React from 'react';
import { LyricsStyle, VisualizerSettings } from '../../../../types';
import { LrcLine } from '../../../../utils/lyricsUtils';

interface Props {
  lrcLines: LrcLine[];
  activeIndex: number;
  lyricsStyle: LyricsStyle;
  settings: VisualizerSettings;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

export const SyncedLyrics: React.FC<Props> = ({ 
  lrcLines, activeIndex, lyricsStyle, settings, scrollContainerRef 
}) => {
  return (
    <div ref={scrollContainerRef} className="flex flex-col items-center gap-6 w-full max-w-3xl px-4 py-[45vh] overflow-hidden no-scrollbar h-full mask-fade-vertical">
      {lrcLines.map((line, i) => {
        const isActive = i === activeIndex;
        const isNear = Math.abs(i - activeIndex) <= 2;
        
        let className = "transition-all duration-700 text-center max-w-[90vw] ";
        let style: React.CSSProperties = { 
            fontFamily: settings.lyricsFont || 'Inter, sans-serif',
            fontSize: isActive ? '2.25rem' : '1.25rem',
            opacity: isActive ? 1 : (isNear ? 0.4 : 0.1),
            transform: isActive ? 'scale(1.05)' : 'scale(0.95)',
            filter: isActive ? 'blur(0px)' : 'blur(2px)',
            color: isActive ? '#ffffff' : '#888888',
            fontWeight: isActive ? 900 : 500
        };

        if (lyricsStyle === LyricsStyle.KARAOKE && isActive) {
            className += "text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-purple-300 drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]";
        }

        return <p key={i} className={className} style={style}>{line.text}</p>;
      })}
    </div>
  );
};
