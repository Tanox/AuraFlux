'use client';
/**
 * File: app/components/controls/panels/StudioPanel.tsx
 * Version: v2.1.1
 * Author: Sut
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useUI, useAudioContext } from '@/context/AppContext';
import { useVideoRecorder } from '../../../hooks/useVideoRecorder';
import { getAverage } from '../../../services/audioUtils';
import { RecordingPreview } from './studio/RecordingPreview';
import { StudioConfig } from './studio/StudioConfig';
import { StudioRecorder } from './studio/StudioRecorder';

export const StudioPanel: React.FC = () => {
  const { t, showToast } = useUI();
  const { audioContext, analyser, mediaStream, sourceType, isPlaying, currentSong } = useAudioContext();
  const [resolution, setResolution] = useState<number | 'native'>('native');
  const [aspectRatio, setAspectRatio] = useState<number | 'native'>('native');
  const [fps, setFps] = useState(60);
  const [bitrate, setBitrate] = useState(12000000);
  const [mimeType, setMimeType] = useState('video/webm; codecs=vp9');
  const [recGain, setRecGain] = useState(1.0);
  const [syncStart, setSyncStart] = useState(false);
  const [enableCountdown, setEnableCountdown] = useState(false);
  const [isArmed, setIsArmed] = useState(false);
  const [countdownVal, setCountdownVal] = useState(0);
  const armCheckInterval = useRef<number | null>(null);

  const { isRecording, isProcessing, isFadingOut, recordedBlob, duration, size, startRecording, stopRecording, discardRecording, getSupportedMimeTypes } = useVideoRecorder({
    audioContext, analyser, mediaStream, sourceType, t, showToast
  });

  const studio = t.studioPanel;
  const labels = studio.settings;
  const hints = studio.hints;

  const shareT = (t as any).share || { 
      title: "Aura Flux Creation", 
      message: "Check out this art created with Aura Flux! \n\n{song} by {artist}", 
      hashtags: "#AuraFlux",
      copied: "Text copied!",
      unsupported: "Sharing not supported"
  };

  const supportedTypes = useMemo(() => {
    const types = getSupportedMimeTypes();
    if (types.length > 0 && !types.includes(mimeType)) setMimeType(types[0]);
    return types;
  }, [getSupportedMimeTypes, mimeType]);

  const previewUrl = useMemo(() => recordedBlob ? URL.createObjectURL(recordedBlob) : null, [recordedBlob]);

  const triggerRecording = useCallback(() => {
    setIsArmed(false);
    const doStart = () => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        startRecording(canvas);
      }
    };
    if (enableCountdown) {
      let count = 3; setCountdownVal(count);
      const timer = setInterval(() => { count--; if (count > 0) setCountdownVal(count); else { clearInterval(timer); setCountdownVal(0); doStart(); } }, 1000);
    } else doStart();
  }, [enableCountdown, startRecording]);

  useEffect(() => {
    if (isArmed && sourceType === 'file' && isPlaying) triggerRecording();
    if (isArmed && sourceType === 'microphone' && !armCheckInterval.current && analyser) {
      armCheckInterval.current = window.setInterval(() => {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        if (getAverage(data, 0, 10) / 255 > 0.1) triggerRecording();
      }, 50);
    }
    return () => { if (armCheckInterval.current) clearInterval(armCheckInterval.current); armCheckInterval.current = null; };
  }, [isArmed, sourceType, isPlaying, analyser, triggerRecording]);

  const getFormatLabel = (mime: string) => {
    const f = t.studioPanel.formats || {};
    if (mime.includes('vp9')) return f.vp9 || 'WebM (VP9)';
    if (mime.includes('vp8')) return f.vp8 || 'WebM (VP8)';
    if (mime.includes('avc1')) return f.mp4_h264 || 'MP4 (Social)';
    return mime.split('/')[1].toUpperCase();
  };

  const handleSaveVideo = () => {
    if (!recordedBlob) return;
    const url = URL.createObjectURL(recordedBlob);
    const a = document.createElement('a'); a.href = url;
    let ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
    let name = `AuraFlux_${Date.now()}`;
    if (currentSong?.title) name = `${currentSong.artist || 'Unknown'} - ${currentSong.title}`.replace(/[<>:"/\\|?*]/g, '_');
    a.download = `${name}.${ext}`; document.body.appendChild(a); a.click(); discardRecording();
  };

  const handleShare = async () => {
      if (!recordedBlob) return;
      const textBody = shareT.message.replace('{song}', currentSong?.title || t.common.unknownTrack).replace('{artist}', currentSong?.artist || t.common.unknownArtist) + `\n\n${window.location.origin}\n\n${shareT.hashtags}`;
      const file = new File([recordedBlob], `aura_flux_${Date.now()}.${mimeType.includes('mp4')?'mp4':'webm'}`, { type: mimeType });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try { await navigator.share({ title: shareT.title, text: textBody, files: [file] }); return; } catch (err) {}
      } 
      try { await navigator.clipboard.writeText(textBody); showToast(shareT.copied || "Text copied!", 'success'); } catch (e) { showToast(shareT.unsupported || "Sharing not supported", 'error'); }
  };

  return (
    <div id="panel-studio" className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
      <RecordingPreview 
        recordedBlob={recordedBlob}
        previewUrl={previewUrl}
        duration={duration}
        currentSong={currentSong}
        studio={studio}
        common={t.common}
        onDiscard={discardRecording}
        onShare={handleShare}
        onSave={handleSaveVideo}
      />
      <StudioConfig 
        studio={studio} labels={labels} hints={hints}
        resolution={resolution} setResolution={setResolution}
        aspectRatio={aspectRatio} setAspectRatio={setAspectRatio}
        fps={fps} setFps={setFps}
        mimeType={mimeType} setMimeType={setMimeType}
        supportedTypes={supportedTypes} getFormatLabel={getFormatLabel}
        bitrate={bitrate} setBitrate={setBitrate}
        recGain={recGain} setRecGain={setRecGain}
        syncStart={syncStart} setSyncStart={setSyncStart}
        enableCountdown={enableCountdown} setEnableCountdown={setEnableCountdown}
      />
      <StudioRecorder 
        isRecording={isRecording}
        isProcessing={isProcessing}
        isFadingOut={isFadingOut}
        isArmed={isArmed}
        setIsArmed={setIsArmed}
        syncStart={syncStart}
        duration={duration}
        size={size}
        stopRecording={stopRecording}
        triggerRecording={triggerRecording}
        analyser={analyser}
        countdownVal={countdownVal}
        studio={studio}
        t={t}
      />
    </div>
  );
};
