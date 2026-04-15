'use client';
// File: src\components\controls\panels\playback\PlaylistManager.tsx | Version: v2.2.23

import Image from 'next/image';
import React, { useRef, useEffect, useState } from 'react';
import { BentoCard } from '../../../visualizers/ui/layout/BentoCard';
import { useAudioContext, useUI } from '@/context/AppContext';
import { checkAiServiceAvailability } from '@/services/aiService';

export const PlaylistManager: React.FC = () => {
  const { 
    playlist, currentIndex, playTrackByIndex, removeFromPlaylist, 
    importFiles, importFromUrl, importPlaylistFromUrl, clearPlaylist
  } = useAudioContext();
  const { t, showToast } = useUI();
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeTrackRef = useRef<HTMLDivElement>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    if (activeTrackRef.current) activeTrackRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [currentIndex]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) importFiles(e.target.files);
    e.target.value = ''; 
  };

  const handleUrlImport = async () => {
    if (!urlValue.trim()) return;
    
    if (!checkAiServiceAvailability((msg) => showToast(msg, 'error'))) return;

    setIsImporting(true);
    try {
        const isPlatform = urlValue.includes('163.com') || urlValue.includes('qq.com') || 
                           urlValue.includes('spotify.com') || urlValue.includes('youtube.com') || 
                           urlValue.includes('music.apple.com');

        if (isPlatform) {
            showToast(t?.('player.importing') || "AI Parsing Playlist...", 'info');
            const tracks = await importPlaylistFromUrl(urlValue);
            if (tracks.length > 0) {
                showToast(`${t?.('player.import')} ${tracks.length} ${t?.('common.active') || "Tracks"}`, 'success');
                setUrlValue('');
                setShowUrlInput(false);
            } else {
                throw new Error("Empty results");
            }
        } else {
            const track = await importFromUrl(urlValue);
            if (track) {
                showToast(`${t?.('player.import')}: ${track.title}`, 'success');
                setUrlValue('');
                setShowUrlInput(false);
            }
        }
    } catch (e) {
            showToast("Import failed", 'error');
        } finally {
        setIsImporting(false);
    }
  };

  return (
    <BentoCard id="panel-playback-playlist-manager" title={t?.('player.playlistTitle') || "Playlist"} className="h-full">
        <div className="h-full flex flex-col">
            <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-1 -mr-1">
                {playlist.length > 0 ? playlist.map((track, index) => (
                    <div 
                        ref={index === currentIndex ? activeTrackRef : null}
                        key={track.id} 
                        onClick={() => playTrackByIndex(index)}
                        className={`group flex items-center gap-3 p-2 rounded-lg cursor-pointer border outline-none focus-within:ring-1 focus-within:ring-blue-500/30 mb-1.5 ${index === currentIndex ? 'bg-blue-600/10 border-blue-500/30' : 'hover:bg-black/5 dark:hover:bg-white/5 border-transparent'}`}
                    >
                        <div className="w-8 h-8 rounded bg-black/5 dark:bg-white/5 overflow-hidden border border-black/5 dark:border-white/5 shrink-0 relative">
                            {track.albumArtUrl && (
                              <Image 
                                src={track.albumArtUrl} 
                                fill 
                                className="object-cover" 
                                alt={track.title} 
                                referrerPolicy="no-referrer"
                              />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold truncate text-black dark:text-white">{track.title}</div>
                            <div className="text-[10px] text-black/40 dark:text-white/40 truncate">{track.artist}</div>
                        </div>
                        <button onClick={(e)=>{e.stopPropagation();removeFromPlaylist(index);}} className="p-1.5 rounded-full text-black/30 dark:text-white/30 hover:bg-red-500/10 hover:text-red-500 transition-colors opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                )) : (
                    <div className="h-full flex items-center justify-center text-center text-black/20 dark:text-white/20">
                        <span className="text-[10px] uppercase font-bold tracking-widest">{t?.('common.empty')}</span>
                    </div>
                )}
            </div>
            
            <div className="pt-3 mt-auto border-t border-black/5 dark:border-white/5 space-y-3">
                {showUrlInput && (
                    <div className="flex gap-2 animate-fade-in-up">
                        <input type="text" value={urlValue} onChange={(e)=>setUrlValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleUrlImport()} placeholder={t?.('player.urlPlaceholder')} className="flex-1 bg-black/[0.04] dark:bg-black/40 border border-black/5 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-black dark:text-white placeholder-black/20 dark:placeholder-white/20 outline-none focus:border-blue-500/50" />
                        <button onClick={handleUrlImport} disabled={isImporting} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest disabled:opacity-50 hover:bg-blue-500 shadow-lg shadow-blue-500/20">{isImporting ? t?.('common.loading') : t?.('player.import')}</button>
                    </div>
                )}
                <div className="flex gap-3">
                    <button onClick={() => fileInputRef.current?.click()} className="flex-1 py-3 bg-black/[0.04] dark:bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-black/60 dark:text-white/60 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-transparent dark:hover:bg-transparent transition-all border border-black/5 dark:border-white/5 flex items-center justify-center gap-2">{t?.('player.add')}</button>
                    <input type="file" ref={fileInputRef} className="hidden" accept="audio/*" multiple onChange={handleFileUpload} />
                    <button onClick={() => setShowUrlInput(!showUrlInput)} className="flex-1 py-3 bg-black/[0.04] dark:bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-black/60 dark:text-white/60 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-transparent dark:hover:bg-transparent transition-all border border-black/5 dark:border-white/5 flex items-center justify-center gap-2">{t?.('player.addUrl')}</button>
                </div>
            </div>
        </div>
    </BentoCard>
  );
};

