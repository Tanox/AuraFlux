// File: app/components/controls/BottomBar.tsx | Version: v1.9.65
import React, { useState, useRef, useEffect } from 'react';
import { useAudioContext, useUI, useVisuals } from '../../AppContext.tsx';
import { TooltipArea } from '../visualizers/ui/controls/Tooltip.tsx';
import { PlaybackMode } from '../../types/index.ts';

interface BottomBarProps {
  isExpanded: boolean;
  setIsExpanded: (val: boolean | ((prev: boolean) => boolean)) => void;
  toggleFullscreen: () => void;
  isIdle: boolean;
}

export const BottomBar: React.FC<BottomBarProps> = ({ isExpanded, setIsExpanded, toggleFullscreen, isIdle }) => {
  const { 
    isPlaying, togglePlayback, playNext, playPrev, 
    currentTime, duration, seekFile, 
    playlist, currentIndex, playTrackByIndex, removeFromPlaylist, clearPlaylist,
    playbackMode, setPlaybackMode, isPending
  } = useAudioContext();
  const { randomizeSettings } = useVisuals();
  const { t, showToast } = useUI();
  const [showPlaylist, setShowPlaylist] = useState(false);
  const playlistRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickOut = (e: MouseEvent) => { if (playlistRef.current && !playlistRef.current.contains(e.target as Node)) setShowPlaylist(false); };
    if (showPlaylist) document.addEventListener('mousedown', clickOut);
    return () => document.removeEventListener('mousedown', clickOut);
  }, [showPlaylist]);

  const handleAppShare = async () => {
      const shareTitle = t?.share?.appTitle || "Aura Flux";
      const shareText = t?.share?.appMessage || "Check out Aura Flux - AI Music Visualizer! 🎵✨";
      const url = window.location.href;
      const shareData = { title: shareTitle, text: shareText, url };

      if (navigator.share && navigator.canShare(shareData)) {
          try { await navigator.share(shareData); } catch (e) {}
      } else {
          try {
              await navigator.clipboard.writeText(`${shareText}\n${url}`);
              showToast(t?.share?.copied || "Link Copied!", 'success');
          } catch (e) {
              showToast(t?.share?.unsupported || "Error", 'error');
          }
      }
  };

  const fmt = (s: number) => `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2, '0')}`;
  const getIcon = () => {
    if (playbackMode === 'repeat-one') return <div className="relative"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg><span className="absolute -top-1 -right-1.5 text-[8px] font-black bg-black/50 text-white rounded-sm px-[1px] leading-none">1</span></div>;
    if (playbackMode === 'shuffle') return <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" /></svg>;
    return <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
  };

  return (
    <>
      {showPlaylist && (
        <div id="playlist-popup" ref={playlistRef} className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[85vw] md:max-w-sm z-[116] bg-white/95 dark:bg-[#050505]/95 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[340px] animate-fade-in-up origin-bottom transition-colors">
            <div className="p-3 border-b border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] flex justify-between items-center shrink-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-black/50 dark:text-white/50 pl-2">{t?.common?.queue || "Queue"} ({playlist.length})</span>
                <div className="flex items-center gap-1">
                    <TooltipArea text={playbackMode}><button onClick={() => {const m:PlaybackMode[]=['repeat-all','repeat-one','shuffle'];setPlaybackMode(m[(m.indexOf(playbackMode)+1)%3]);}} className="p-1.5 rounded hover:bg-black/10 dark:hover:bg-white/10 text-black/60 dark:text-white/60 hover:text-blue-500 dark:hover:text-blue-300 transition-colors">{getIcon()}</button></TooltipArea>
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
                        <div className="w-8 h-8 rounded bg-black/5 dark:bg-white/5 overflow-hidden border border-black/5 dark:border-white/5 shrink-0">{tr.albumArtUrl && <img src={tr.albumArtUrl} className="w-full h-full object-cover"/>}</div>
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
      )}
      <div id="bottom-bar-container" className={`fixed bottom-0 left-0 w-full z-[115] transition-all duration-500 transform ${isIdle && !isExpanded && !showPlaylist ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="max-w-lg mx-auto px-4 pb-6">
            <div className="bg-white/90 dark:bg-[#0a0a0c]/90 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl p-2 shadow-2xl flex items-center justify-between gap-3 transition-colors">
                <div className="flex items-center gap-1">
                    <TooltipArea text={`${t?.hints?.randomize || 'Randomize'} [R]`}><button onClick={randomizeSettings} className="h-10 rounded-xl flex items-center justify-center bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white px-4 gap-2 transition-all"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>{playlist.length===0&&<span className="text-xs font-bold uppercase">{t?.randomize}</span>}</button></TooltipArea>
                    <TooltipArea text={t?.share?.shareApp || "Share"}>
                        <button onClick={handleAppShare} className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:text-blue-500 dark:hover:text-blue-400 flex items-center justify-center transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
                            </svg>
                        </button>
                    </TooltipArea>
                    <button onClick={toggleFullscreen} className="w-10 h-10 rounded-xl bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white flex items-center justify-center transition-all"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg></button>
                </div>
                {playlist.length > 0 ? (
                    <div className="flex items-center gap-2 flex-1 justify-center">
                        <button onClick={playPrev} className="p-2 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"/></svg></button>
                        
                        <button 
                            onClick={togglePlayback} 
                            disabled={isPending}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isPlaying?'bg-black dark:bg-white text-white dark:text-black shadow-lg':'bg-black/10 dark:bg-white/10 text-black dark:text-white'} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isPending ? (
                                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : isPlaying ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                            ) : (
                                <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            )}
                        </button>
                        
                        <button onClick={playNext} className="p-2 text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z"/></svg></button>
                    </div>
                ) : <div className="flex-1 text-center"><span className="text-[10px] font-bold text-black/20 dark:text-white/20 uppercase tracking-[0.3em]">Aura Flux</span></div>}
                <div className="flex items-center gap-1 justify-end">
                    {playlist.length > 0 && <div className="hidden sm:flex flex-col items-end mr-2"><span className="text-[9px] font-mono text-black/40 dark:text-white/40">{fmt(currentTime)} / {fmt(duration)}</span><div className="w-20 h-1 bg-black/10 dark:bg-white/10 rounded-full mt-1 relative overflow-hidden"><div className="absolute h-full bg-blue-600 dark:bg-blue-500" style={{width:`${(currentTime/(duration||1))*100}%`}}/><input type="range" min={0} max={duration||1} step={0.1} value={currentTime} onChange={(e)=>seekFile(parseFloat(e.target.value))} className="absolute inset-0 opacity-0 cursor-pointer"/></div></div>}
                    <button onClick={()=>setShowPlaylist(!showPlaylist)} className={`w-10 h-10 rounded-xl relative transition-all ${showPlaylist?'bg-blue-600 text-white':'bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'}`}><svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7"/></svg>{playlist.length>0&&<span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center font-bold text-white border border-white dark:border-[#0a0a0c]">{playlist.length}</span>}</button>
                    <button onClick={() => setIsExpanded(p => !p)} className={`h-10 rounded-xl flex items-center justify-center transition-all ${playlist.length === 0 ? 'px-4 gap-4' : 'w-10'} ${isExpanded ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg' : 'bg-black/5 dark:bg-white/5 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'}`}>
                        {isExpanded ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 12H13.5" />
                          </svg>
                        )}
                        {playlist.length === 0 && <span className="text-xs font-black uppercase tracking-widest">{isExpanded ? t?.hideOptions : t?.showOptions}</span>}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </>
  );
};