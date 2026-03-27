'use client';
import React, { useRef, useEffect } from 'react';
import Image from 'next/image';
import { useAudioContext, useUI } from '@/src/context/AppContext';
import { TooltipArea } from '../visualizers/ui/controls/Tooltip';
import { PlaybackMode } from '../../types/index';

interface PlaylistPopupProps {
  showPlaylist: boolean;
  setShowPlaylist: (show: boolean) => void;
  playlistRef: React.RefObject<HTMLDivElement | null>;
}

export const PlaylistPopup: React.FC<PlaylistPopupProps> = ({ showPlaylist, setShowPlaylist, playlistRef }) => {
  const { 
    playlist, currentIndex, playTrackByIndex, removeFromPlaylist, clearPlaylist,
    playbackMode, setPlaybackMode
  } = useAudioContext();
  const { t } = useUI();

  const getIcon = () => {
    if (playbackMode === PlaybackMode.LOOP) return <div className="relative"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg><span className="absolute -top-1 -right-1.5 text-[8px] font-black bg-black/50 text-white rounded-sm px-[1px] leading-none">1</span></div>;
    if (playbackMode === PlaybackMode.SHUFFLE) return <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" /></svg>;
    return <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
  };

  if (!showPlaylist) return null;

  return (
    <div id="playlist-popup" ref={playlistRef} className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[85vw] md:max-w-sm z-[116] bg-white/95 dark:bg-[#050505]/95 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[340px] animate-fade-in-up origin-bottom transition-colors">
        <div className="p-3 border-b border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] flex justify-between items-center shrink-0">
            <span className="text-[10px] font-black uppercase tracking-widest text-black/50 dark:text-white/50 pl-2">{t?.common?.queue || "Queue"} ({playlist.length})</span>
            <div className="flex items-center gap-1">
                <TooltipArea text={playbackMode}><button onClick={() => {const m:PlaybackMode[]=[PlaybackMode.SEQUENCE,PlaybackMode.LOOP,PlaybackMode.SHUFFLE];setPlaybackMode(m[(m.indexOf(playbackMode)+1)%3]);}} className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-black/60 dark:text-white/60 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">{getIcon()}</button></TooltipArea>
                <TooltipArea text={t?.common?.clearAll}><button onClick={() => playlist.length > 0 && window.confirm(t?.common?.confirmClear) && clearPlaylist()} className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-black/60 dark:text-white/60 hover:text-red-500 dark:hover:text-red-400 transition-colors"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button></TooltipArea>
                <button onClick={() => setShowPlaylist(false)} className="p-1.5 hover:bg-black/10 dark:hover:bg-white/10 rounded text-black/40 dark:text-white/40"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
            {playlist.length === 0 ? <div className="flex flex-col items-center justify-center h-32 text-black/20 dark:text-white/20"><span className="text-[10px] uppercase font-bold">{t?.common?.empty}</span></div> : playlist.map((tr, idx) => (
                <div 
                  key={tr.id} 
                  onClick={() => playTrackByIndex(idx)} 
                  tabIndex={0}
                  className={`group flex items-center gap-3 p-2 rounded-lg cursor-pointer border outline-none focus-within:ring-1 focus-within:ring-blue-500/30 ${idx===currentIndex?'bg-blue-600/10 border-blue-500/30':'hover:bg-black/5 dark:hover:bg-white/5 border-transparent'}`}
                >
                    <div className="w-5 text-[10px] text-black/30 dark:text-white/30 text-center shrink-0">{idx===currentIndex?<div className="w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse mx-auto"/>:idx+1}</div>
                    <div className="w-8 h-8 rounded bg-black/5 dark:bg-white/5 overflow-hidden border border-black/5 dark:border-white/5 shrink-0 relative">
                      {(tr as any).albumArtUrl && (
                        <Image 
                          src={(tr as any).albumArtUrl} 
                          alt={tr.title} 
                          fill 
                          className="object-cover" 
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0"><div className="text-xs font-bold truncate">{tr.title}</div><div className="text-[10px] text-black/40 dark:text-white/40 truncate">{tr.artist}</div></div>
                    
                    <button 
                      onClick={(e)=>{e.stopPropagation();removeFromPlaylist(idx);}} 
                      className={`p-1.5 transition-all duration-200 text-black/40 dark:text-white/40 hover:text-red-500 dark:hover:text-red-400 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            ))}
        </div>
    </div>
  );
};
