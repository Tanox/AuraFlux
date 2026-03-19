// File: src/hooks/audio/usePlaylist.ts | Version: v1.0.0
import { useState, useCallback } from 'react';
import { Track, PlaybackMode } from '../../types';

export const usePlaylist = (showToast: (m: string, type?: any) => void) => {
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>(PlaybackMode.SEQUENCE);

  const importFiles = useCallback(async (files: FileList | File[]) => {
    const newTracks: Track[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).slice(2),
      file: file as File,
      title: (file as File).name.replace(/\.[^/.]+$/, ""),
      artist: 'Unknown Artist'
    }));
    setPlaylist(prev => [...prev, ...newTracks]);
    showToast(`Imported ${newTracks.length} tracks`);
  }, [showToast]);

  const playNext = useCallback(() => setCurrentIndex(prev => (prev + 1) % playlist.length), [playlist.length]);
  const playPrev = useCallback(() => setCurrentIndex(prev => (prev - 1 + playlist.length) % playlist.length), [playlist.length]);
  const playTrackByIndex = useCallback((i: number) => setCurrentIndex(i), []);
  const removeFromPlaylist = useCallback((i: number) => setPlaylist(prev => prev.filter((_, idx) => idx !== i)), []);
  const clearPlaylist = useCallback(() => setPlaylist([]), []);

  return {
    playlist, setPlaylist,
    currentIndex, setCurrentIndex,
    playbackMode, setPlaybackMode,
    importFiles,
    playNext, playPrev,
    playTrackByIndex, removeFromPlaylist,
    clearPlaylist
  };
};
