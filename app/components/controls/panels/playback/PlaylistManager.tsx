/**
 * File: app/components/controls/panels/playback/PlaylistManager.tsx
 * Version: v1.9.36
 * Author: Sut
 */

import React, { useRef, useEffect, useState } from 'react';
import { BentoCard } from '../../../visualizers/ui/layout/BentoCard';
import { useAudioContext, useUI, useAI } from '../../../../AppContext';

export const PlaylistManager: React.FC = () => {
  const { 
    playlist, currentIndex, playTrackByIndex, removeFromPlaylist, 
    importFiles, importFromUrl, importPlaylistFromUrl, clearPlaylist
  } = useAudioContext();
  const { t, showToast } = useUI();
  const { apiKeys } = useAI();
  
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
    
    const apiKey = apiKeys['GEMINI'] || process.env.API_KEY;
    if (!apiKey) {
        // @fix: Use correct localization key `errors.configMissing`
        showToast(t?.errors?.configMissing || "Gemini API Key Required", 'error');
        return;
    }

    setIsImporting(true);
    try {
        const isPlatform = urlValue.includes('163.com') || urlValue.includes('qq.com') || 
                           urlValue.includes('spotify.com') || urlValue.includes('youtube.com') || 
                           urlValue.includes('music.apple.com');

        if (isPlatform) {
            showToast(t?.player?.importing || "AI Parsing Playlist...", 'info');
            const tracks = await importPlaylistFromUrl(urlValue, apiKey);
            if (tracks.length > 0) {
                showToast(`${t?.player?.import} ${tracks.length} ${t?.common?.active || "Tracks"}`, 'success');
                setUrlValue('');
                setShowUrlInput(false);
            } else {
                throw new Error("Empty results");
            }
        } else {
            const track = await importFromUrl(urlValue);
            if (track) {
                showToast(t?.player?.import + ": " + (track.title || "Success"), 'success');
                setUrlValue('');
                setShowUrlInput(false);
            }
        }
    } catch (e) {
        // @fix: Use correct localization key `errors.trackLoad`
        showToast(t?.errors?.trackLoad || "Parsing failed. Please check the URL.", 'error');
    } finally {
        setIsImporting(false);
    }
  };

  const handleRemoveTrack = (e: React.MouseEvent, index: number) => {
    e.stopPropagation(); 
    e.preventDefault();
    const track = playlist[index];
    if (!track) return;
    removeFromPlaylist(index);
    // @fix: Use correct localization key `config.delete`
    showToast((t?.config?.delete || "Removed") + ": " + track.title, 'info');
  };

  return (
    <BentoCard 
        title={t?.player?.playlistTitle || "Playlist"} 
        className="lg:col-span-7 flex flex-col h-full"
        action={
            <div className="flex items-center gap-2">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="audio/*" multiple className="hidden" />
                {playlist.length > 0 && (
                    <button onClick={() => window.confirm(t?.common?.confirmClear) && clearPlaylist()} className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all text-[10px] font-black uppercase tracking-widest">{t?.common?.clearAll || 'CLEAR'}</button>
                )}
                <button onClick={() => setShowUrlInput(!showUrlInput)} className={`px-4 py-2 rounded-xl border transition-all text-[10px] font-black uppercase tracking-widest ${showUrlInput ? 'bg-blue-600/10 border-blue-500/40 text-blue-500' : 'bg-black/5 dark:bg-white/5 border-transparent text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white'}`}>{t?.player?.addUrl || 'AI LINK'}</button>
                <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-50 text-white transition-all text-[10px] font-black uppercase tracking-widest shadow-lg">{t?.player?.add || 'LOCAL'}</button>
            </div>
        }
    >
        <div className="flex-1 flex flex-col">
            {showUrlInput && (
                <div className="mb-4 p-4 bg-black/[0.04] dark:bg-white/[0.04] rounded-2xl border border-black/5 dark:border-white/5 animate-fade-in-up">
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={urlValue} 
                            onChange={(e) => setUrlValue(e.target.value)} 
                            onKeyDown={(e) => e.key === 'Enter' && handleUrlImport()}
                            placeholder={t?.player?.urlPlaceholder || "Paste URL..."} 
                            className="flex-1 bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2 text-xs text-black dark:text-white focus:border-blue-500/50 outline-none transition-all"
                        />
                        <button 
                            onClick={handleUrlImport}
                            disabled={isImporting || !urlValue.trim()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest disabled:opacity-30 hover:bg-blue-50 transition-all min-w-[100px]"
                        >
                            {isImporting ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" /> : (t?.player?.import || 'PARSE')}
                        </button>
                    </div>
                    <p className="text-[9px] text-black/30 dark:text-white/30 uppercase font-bold tracking-widest mt-2 px-1">
                        {t?.player?.supportInfo}
                    </p>
                </div>
            )}

            {playlist.length === 0 ? (
                <div onClick={() => fileInputRef.current?.click()} className="flex-1 min-h-[380px] flex flex-col items-center justify-center gap-4 transition-all cursor-pointer rounded-2xl text-black/10 dark:text-white/10 hover:text-black/20 dark:hover:text-white/20">
                    <div className="w-16 h-16 rounded-full border-2 border-current flex items-center justify-center"><svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg></div>
                    <div className="text-center space-y-1">
                        <p className="text-[11px] font-black uppercase tracking-[0.25em]">{t?.common?.dropFiles}</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest opacity-40">{t?.player?.supportInfo}</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-1.5 overflow-y-auto custom-scrollbar h-[380px] lg:h-[390px] pr-2">
                    {playlist.map((track, idx) => {
                        const isPlatformTrack = track.searchUrl && (
                            track.searchUrl.includes('163.com') || track.searchUrl.includes('qq.com') || 
                            track.searchUrl.includes('spotify') || track.searchUrl.includes('youtube') || 
                            track.searchUrl.includes('apple.com')
                        );
                        
                        return (
                            <div 
                                key={track.id} 
                                ref={idx === currentIndex ? activeTrackRef : null}
                                onClick={() => playTrackByIndex(idx)} 
                                className={`group flex items-center gap-4 p-3 rounded-2xl cursor-pointer transition-all border outline-none ${idx === currentIndex ? 'bg-blue-600/10 border-blue-500/30' : 'bg-transparent border-transparent hover:bg-black/[0.03] dark:hover:bg-white/[0.03]'}`}
                            >
                                <div className="w-8 text-[10px] font-black font-mono text-black/30 dark:text-white/30 text-center shrink-0">
                                    {idx === currentIndex ? (
                                        <div className="flex gap-0.5 justify-center items-end h-3">
                                            <div className="w-0.5 bg-blue-500 animate-[bounce_0.6s_infinite] h-full" />
                                            <div className="w-0.5 bg-blue-500 animate-[bounce_0.8s_infinite] h-2/3" />
                                            <div className="w-0.5 bg-blue-500 animate-[bounce_0.4s_infinite] h-1/2" />
                                        </div>
                                    ) : (
                                        (idx + 1).toString().padStart(2, '0')
                                    )}
                                </div>
                                
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-black/40 shrink-0 border border-black/5 dark:border-white/5 shadow-md relative group/cover">
                                    {track.albumArtUrl ? (
                                        <img src={track.albumArtUrl} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center opacity-10"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" /></svg></div>
                                    )}
                                    <div className="absolute inset-0 bg-blue-600/60 flex items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-opacity">
                                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"/></svg>
                                    </div>
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className={`text-[11px] font-black truncate uppercase tracking-wide ${idx === currentIndex ? 'text-black dark:text-white' : 'text-black/70 dark:text-white/70'}`}>
                                        {track.title || t?.common?.unknownTrack}
                                    </div>
                                    <div className="text-[9px] text-black/40 dark:text-white/40 truncate font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                                        {track.artist || t?.common?.unknownArtist}
                                        {isPlatformTrack && (
                                            <span className="px-1.5 py-0.5 bg-blue-500/10 text-blue-500 rounded text-[7px] font-black tracking-tighter uppercase">Cloud</span>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={(e) => handleRemoveTrack(e, idx)} 
                                        className={`p-2.5 rounded-xl transition-all ${idx === currentIndex ? 'opacity-100 bg-red-500/20 text-red-500' : 'opacity-0 group-hover:opacity-100 bg-black/5 dark:bg-white/5 text-black/20 dark:text-white/20 hover:bg-red-500/10 hover:text-red-500'}`}
                                        aria-label={t?.config?.delete || "Remove track"}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    </BentoCard>
  );
};