
/**
 * File: core/hooks/usePlaylist.ts
 * Version: 2.3.0
 * Author: Sut
 */

import { useState, useCallback, useEffect } from 'react';
import { Track, PlaybackMode, SongInfo } from '../types';
import { loadPlaylistFromDB, saveTrackToDB, clearPlaylistDB, removeTrackFromDB } from '../services/playlistService';
import { extractMetadata } from '../services/metadataService';
import { parsePlaylistWithSearch } from '../services/aiService';

interface PlaylistState {
  list: Track[];
  currentIndex: number;
}

export const usePlaylist = (setCurrentSong: (s: SongInfo | null) => void) => {
  const [state, setState] = useState<PlaylistState>({ list: [], currentIndex: -1 });
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

  /**
   * v2.3.0: 批量解析并导入歌单
   */
  const importPlaylistFromUrl = useCallback(async (url: string, apiKey: string) => {
    if (!url) return [];
    
    const items = await parsePlaylistWithSearch(url, apiKey);
    const newTracks: Track[] = items.map(item => ({
        id: 'remote_' + Math.random().toString(36).substr(2, 9) + Date.now(),
        file: new File([], item.title), // 占位
        title: item.title,
        artist: item.artist,
        albumArtUrl: item.albumArtUrl,
        // @fix: Removed duplicate property searchUrl that conflicted with the one below
        lyricsSnippet: 'Platform Remote Stream',
        identified: true,
        matchSource: 'AI',
        duration: 0,
        // 如果有音频预览链接，我们将其作为数据源
        searchUrl: item.audioPreviewUrl || item.platformUrl 
    }));

    if (newTracks.length > 0) {
        for (const t of newTracks) {
            await saveTrackToDB(t);
        }
        setState(prev => {
            const nextList = [...prev.list, ...newTracks];
            const nextIndex = prev.currentIndex === -1 ? 0 : prev.currentIndex;
            if (prev.currentIndex === -1) setCurrentSong(nextList[0]);
            return { list: nextList, currentIndex: nextIndex };
        });
    }
    return newTracks;
  }, [setCurrentSong]);

  const importFromUrl = useCallback(async (url: string) => {
    // 这里保持对单个直接 URL 的支持
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const fileName = url.split('/').pop() || 'Remote Track';
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
    } catch (e) {
        // 如果是歌单，由于 CORS 会报错，我们将直接进入 AI 解析逻辑 (由 PlaybackPanel 处理)
        throw e; 
    }
  }, [setCurrentSong]);

  const removeFromPlaylist = useCallback((index: number) => {
    let wasCurrent = false;
    setState(prev => {
      if (index < 0 || index >= prev.list.length) return prev;
      const trackToRemove = prev.list[index];
      if (trackToRemove) removeTrackFromDB(trackToRemove.id).catch(e => console.error(e));
      const nextList = prev.list.filter((_, i) => i !== index);
      let nextIndex = prev.currentIndex;
      wasCurrent = (index === prev.currentIndex);
      if (wasCurrent) {
        if (nextList.length === 0) {
          nextIndex = -1;
          setCurrentSong(null);
        } else {
          nextIndex = index >= nextList.length ? nextList.length - 1 : index;
          setCurrentSong(nextList[nextIndex]);
        }
      } else if (index < prev.currentIndex) {
        nextIndex = prev.currentIndex - 1;
      }
      return { list: nextList, currentIndex: nextIndex };
    });
    return { wasCurrent };
  }, [setCurrentSong]);

  const clearPlaylist = useCallback(() => {
    clearPlaylistDB().catch(e => console.error(e));
    setState({ list: [], currentIndex: -1 });
    setCurrentSong(null);
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
    clearPlaylist,
    removeFromPlaylist
  };
};
