// File: app/hooks/usePlaylist.ts | Version: v1.9.73
import { useState, useCallback, useEffect } from 'react';
import { Track, PlaybackMode, SongInfo } from '../types/index.ts';
import { loadPlaylistFromDB, saveTrackToDB, clearPlaylistDB, removeTrackFromDB } from '../services/playlistService.ts';
import { extractMetadata } from '../services/metadataService.ts';
import { parsePlaylistSmart } from '../services/playlistParser.ts';

export const usePlaylist = (setCurrentSong: (s: SongInfo | null) => void, t?: any) => {
  const [state, setState] = useState<{list: Track[], currentIndex: number}>({ list: [], currentIndex: -1 });
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('repeat-all');

  useEffect(() => {
    loadPlaylistFromDB().then(saved => {
      if (saved && saved.length > 0) {
        setState({ list: saved, currentIndex: 0 });
        setCurrentSong(saved[0]);
      }
    });
  }, [setCurrentSong]);

  const importFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newTracks: Track[] = [];
    for (const file of fileArray) {
      const track = await extractMetadata(file);
      newTracks.push(track);
      await saveTrackToDB(track);
    }
    setState(prev => {
      const nextList = [...prev.list, ...newTracks];
      const nextIndex = prev.currentIndex === -1 ? 0 : prev.currentIndex;
      if (prev.currentIndex === -1) setCurrentSong(nextList[0]);
      return { list: nextList, currentIndex: nextIndex };
    });
    return newTracks;
  }, [setCurrentSong]);

  // @fix: Removed apiKey parameter as parsePlaylistSmart now uses process.env.API_KEY directly.
  const importPlaylistFromUrl = useCallback(async (url: string) => {
    if (!url) return [];
    
    // 调用智能解析引擎 (from playlistParser)
    const items = await parsePlaylistSmart(url);
    
    const newTracks: Track[] = items.map(item => ({
        id: 'remote_' + Math.random().toString(36).substr(2, 9) + Date.now(),
        file: new File([], item.title), 
        title: item.title || t?.common?.unknownTrack || "Unknown Track",
        artist: item.artist || (item.artists && item.artists[0]?.name) || "Unknown Artist",
        albumArtUrl: item.albumArtUrl,
        lyricsSnippet: 'Remote Platform Stream', // Usually instrumental or streaming, handled by AI anyway
        identified: true,
        matchSource: 'AI',
        duration: 0,
        searchUrl: item.audioPreviewUrl || `https://www.google.com/search?q=${encodeURIComponent(item.title + ' ' + item.artist + ' mp3 source')}`
    }));

    if (newTracks.length > 0) {
        for (const t of newTracks) await saveTrackToDB(t);
        setState(prev => {
            const nextList = [...prev.list, ...newTracks];
            const nextIndex = prev.currentIndex === -1 ? 0 : prev.currentIndex;
            if (prev.currentIndex === -1) setCurrentSong(nextList[0]);
            return { list: nextList, currentIndex: nextIndex };
        });
    }
    return newTracks;
  }, [setCurrentSong, t]);

  const importFromUrl = useCallback(async (url: string) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const fileName = url.split('/').pop() || t?.common?.unknownTrack || 'Remote Track';
        const file = new File([blob], fileName, { type: blob.type });
        const track = await extractMetadata(file);
        track.matchSource = 'LOCAL';
        await saveTrackToDB(track);
        setState(prev => {
            const nextList = [...prev.list, track];
            const nextIndex = prev.currentIndex === -1 ? 0 : prev.currentIndex;
            if (prev.currentIndex === -1) setCurrentSong(track);
            return { list: nextList, currentIndex: nextIndex };
        });
        return track;
    } catch (e) { throw e; }
  }, [setCurrentSong, t]);

  const removeFromPlaylist = useCallback((index: number) => {
    let wasCurrent = false;
    setState(prev => {
      if (index < 0 || index >= prev.list.length) return prev;
      removeTrackFromDB(prev.list[index].id);
      const nextList = prev.list.filter((_, i) => i !== index);
      wasCurrent = (index === prev.currentIndex);
      let nextIndex = prev.currentIndex;
      if (wasCurrent) {
        if (nextList.length === 0) { nextIndex = -1; setCurrentSong(null); }
        else { nextIndex = index >= nextList.length ? nextList.length - 1 : index; setCurrentSong(nextList[nextIndex]); }
      } else if (index < prev.currentIndex) {
        nextIndex = prev.currentIndex - 1;
      }
      return { list: nextList, currentIndex: nextIndex };
    });
    return { wasCurrent };
  }, [setCurrentSong]);

  return {
    playlist: state.list,
    currentIndex: state.currentIndex,
    setCurrentIndex: (idx: number) => setState(p => ({ ...p, currentIndex: idx })),
    playbackMode,
    setPlaybackMode,
    importFiles,
    importFromUrl,
    importPlaylistFromUrl,
    getNextIndex: () => {
        if (state.list.length === 0) return -1;
        if (playbackMode === 'shuffle') return Math.floor(Math.random() * state.list.length);
        return (state.currentIndex + 1) % state.list.length;
    },
    getPrevIndex: () => {
        if (state.list.length === 0) return -1;
        return (state.currentIndex - 1 + state.list.length) % state.list.length;
    },
    clearPlaylist: () => { clearPlaylistDB(); setState({ list: [], currentIndex: -1 }); setCurrentSong(null); },
    removeFromPlaylist
  };
};