'use client';

/**
 * File: app/components/controls/panels/playback/NowPlaying.tsx
 * Version: v1.9.73
 * Author: Sut
 */

import Image from 'next/image';
import React from 'react';
import { BentoCard } from '../../../visualizers/ui/layout/BentoCard';
import { SettingsToggle } from '../../../visualizers/ui/controls/SettingsToggle';
import { useAudioContext, useUI, useVisuals, useAI } from '@/context/AppContext';

export const NowPlaying: React.FC = () => {
  const { currentSong, playlist, playPrev, togglePlayback, playNext, isPlaying, currentTime, duration, seekFile } = useAudioContext();
  const { showLyrics, setShowLyrics } = useAI();
  const { settings, setSettings } = useVisuals();
  const { t } = useUI();

  const fmt = (s: number) => isNaN(s) || s === Infinity ? '--:--' : `${Math.floor(s/60)}:${Math.floor(s%60).toString().padStart(2,'0')}`;
  const progressPercent = (currentTime / (duration || 1)) * 100;

  return (
    <BentoCard id="panel-playback-now-playing" title={t?.('player.nowPlaying') || "Now Playing"}>
        <div className="space-y-6">
            {playlist.length > 0 ? (
                <div className="group/player relative flex flex-col gap-5 p-5 bg-black/[0.04] dark:bg-white/[0.04] rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden transition-all hover:border-black/10 dark:hover:border-white/10 shadow-xl">
                    {currentSong?.albumArtUrl && (
                        <div className="absolute inset-0 pointer-events-none opacity-20 blur-3xl scale-125 transition-opacity duration-1000">
                            <Image 
                              src={currentSong.albumArtUrl} 
                              fill 
                              className="object-cover" 
                              alt="" 
                              referrerPolicy="no-referrer"
                            />
                        </div>
                    )}
                    
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-20 h-20 shrink-0 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-black/40 shadow-lg transform transition-all group-hover/player:scale-105 duration-500 relative">
                            {currentSong?.albumArtUrl ? (
                                <Image 
                                  src={currentSong.albumArtUrl} 
                                  fill 
                                  className="object-cover" 
                                  alt="Album Art" 
                                  referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-black/5 dark:text-white/5">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" /></svg>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <div className="text-lg font-black text-black dark:text-white truncate leading-tight uppercase tracking-tight">
                                {currentSong?.title || t?.('common.unknownTrack')}
                            </div>
                            <div className="text-[10px] text-blue-500 dark:text-blue-400 truncate font-black uppercase tracking-[0.2em] mt-1.5 opacity-80">
                                {currentSong?.artist || t?.('common.unknownArtist')}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 relative z-10">
                        <div className="flex items-center gap-1">
                            <button onClick={playPrev} className="p-3 text-black/20 dark:text-white/20 hover:text-black dark:hover:text-white transition-all hover:scale-110 active:scale-90">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"/></svg>
                            </button>
                            <button onClick={togglePlayback} className="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-lg transform transition-all hover:scale-110 active:scale-95">
                                {isPlaying ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                                ) : (
                                    <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                )}
                            </button>
                            <button onClick={playNext} className="p-3 text-black/20 dark:text-white/20 hover:text-black dark:hover:text-white transition-all hover:scale-110 active:scale-90">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z"/></svg>
                            </button>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-black font-mono text-black/30 dark:text-white/30 uppercase tracking-widest">{fmt(currentTime)} / {fmt(duration)}</div>
                        </div>
                    </div>

                    <div className="relative h-1 w-full bg-black/5 dark:bg-white/10 rounded-full overflow-hidden cursor-pointer group/seek z-10">
                        <div className="absolute h-full bg-blue-600 transition-[width] duration-300 ease-linear" style={{ width: `${progressPercent}%` }} />
                        <input type="range" min={0} max={duration || 1} step={0.1} value={currentTime} onChange={(e) => seekFile(parseFloat(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                    </div>
                </div>
            ) : (
                <div className="h-40 rounded-2xl border-2 border-dashed border-black/5 dark:border-white/5 flex flex-col items-center justify-center text-black/10 dark:text-white/10 gap-3">
                    <svg className="w-10 h-10 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                    <span className="uppercase text-[10px] font-black tracking-[0.2em]">{t?.player?.noActiveTrack}</span>
                </div>
            )}

            <div className="grid grid-cols-2 gap-3">
                <SettingsToggle label={t?.showLyrics || "Lyrics"} value={showLyrics} onChange={() => setShowLyrics(!showLyrics)} activeColor="green" variant="clean" />
                <SettingsToggle label={t?.player?.info || "Song Info"} value={settings.showSongInfo} onChange={() => setSettings(p => ({ ...p, showSongInfo: !p.showSongInfo }))} activeColor="blue" variant="clean" />
            </div>
        </div>
    </BentoCard>
  );
};