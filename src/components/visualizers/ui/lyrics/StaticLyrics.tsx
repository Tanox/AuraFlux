/**
 * File: src/components/visualizers/ui/lyrics/StaticLyrics.tsx
 * Version: v1.9.76
 */

import React from 'react';
import { LyricsStyle, VisualizerSettings } from '../../../../types';

interface Props {
  rawText: string;
  hasFullLyrics: boolean;
  lyricsStyle: LyricsStyle;
  settings: VisualizerSettings;
  t: any;
}

export const StaticLyrics: React.FC<Props> = ({ 
  rawText, hasFullLyrics, lyricsStyle, settings, t 
}) => {
  const text = (rawText || "")
    .replace(/\[\d{2}:\d{2}(\.\d{1,3})?\]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();
  
  const allLines = text.split('\n').filter((l: string) => l.trim() !== '');
  const lines = hasFullLyrics ? allLines.slice(0, 10) : allLines.slice(0, 4);
  
  let textClass = "";
  let fontStyle: React.CSSProperties = { fontFamily: settings.lyricsFont || 'Inter, sans-serif' };
  const baseSizeVw = settings.lyricsFontSize || 4;

  if (lyricsStyle === LyricsStyle.KARAOKE) {
     textClass = "font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-white to-purple-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]";
     fontStyle = { ...fontStyle, fontSize: `max(24px, min(${baseSizeVw}vw, ${baseSizeVw * 12}px))`, lineHeight: 1.3 };
  } else if (lyricsStyle === LyricsStyle.MINIMAL) {
     textClass = "font-mono text-white/80 tracking-[0.2em]";
     fontStyle = { ...fontStyle, fontSize: `max(14px, min(${baseSizeVw * 0.6}vw, ${baseSizeVw * 8}px))`, lineHeight: 1.8 };
  } else {
     textClass = "font-serif italic text-white drop-shadow-md";
     fontStyle = { ...fontStyle, fontSize: `max(18px, min(${baseSizeVw * 0.9}vw, ${baseSizeVw * 10}px))`, lineHeight: 1.4 };
  }

  return (
    <div className="select-none max-w-4xl text-center px-8 transition-all duration-1000 animate-fade-in-up">
       {lines.length > 0 ? (
           lines.map((line, i) => <p key={i} className={`${textClass} mb-2`} style={fontStyle}>{line}</p>)
       ) : (
           <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] italic">{t?.player?.noActiveTrack || "No lyrics content"}</p>
       )}
       {hasFullLyrics && lines.length < allLines.length && <p className="mt-4 text-[10px] text-white/20 uppercase tracking-widest animate-pulse">... scrolling paused ...</p>}
    </div>
  );
};
