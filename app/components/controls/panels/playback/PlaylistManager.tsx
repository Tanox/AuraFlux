/**
 * File: app/components/controls/panels/playback/PlaylistManager.tsx
 * Version: v1.9.72
 * Author: Sut
 */

import React, { useRef, useEffect, useState } from 'react';
import { BentoCard } from '../../../visualizers/ui/layout/BentoCard.tsx';
import { useAudioContext, useUI } from '../../../../AppContext.tsx';

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
    
    if (!process.env.API_KEY) {
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
            const tracks = await importPlaylistFromUrl(urlValue);
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
                