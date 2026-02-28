/**
 * File: app/components/controls/panels/StudioPanel.tsx
 * Version: v1.9.73
 * Author: Sut
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useUI, useAudioContext } from '@/src/context/AppContext';
import { useVideoRecorder } from '../../../hooks/useVideoRecorder.ts';
import { CustomSelect } from '../../visualizers/ui/controls/CustomSelect.tsx';
import { Slider } from '../../visualizers/ui/controls/Slider.tsx';
import { SegmentedControl } from '../../visualizers/ui/controls/SegmentedControl.tsx';
import { BentoCard } from '../../visualizers/ui/layout/BentoCard.tsx';
import { SettingsToggle } from '../../visualizers/ui/controls/SettingsToggle.tsx';
import { getAverage } from '../../../services/audioUtils.ts';
import { ArmedVisualizer } from './studio/ArmedVisualizer';
import { RecordingPreview } from './studio/RecordingPreview';
import { StudioConfig } from './studio/StudioConfig.tsx';

const formatSize = (b: number) => b === 0 ? '0 MB' : `${(b / (1024 * 1024)).toFixed(1)} MB`;
const formatDur = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${Math.floor(s % 60).toString().padStart(2, '0')}`;

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
    const f = t.studioPanel.formats;
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
      <BentoCard id="panel-studio-recorder" className="lg:col-span-5 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
        <div className={`absolute inset-0 transition-colors duration-1000 ${isRecording ? 'bg-red-500/5' : isArmed ? 'bg-blue-500/5' : 'bg-transparent'}`} />
        <div className="relative z-10 flex flex-col items-center">
            <div className="relative group mb-6 flex items-center justify-center w-32 h-32">
                {isArmed && <ArmedVisualizer analyser={analyser} />}
                {isRecording && <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-20 scale-150" />}
                <button onClick={isRecording ? stopRecording : () => isArmed ? setIsArmed(false) : syncStart ? setIsArmed(true) : triggerRecording()} disabled={isProcessing} className={`w-24 h-24 rounded-full border-4 transition-all flex items-center justify-center relative z-10 duration-500 ${isRecording ? 'bg-red-900/20 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.4)]' : isArmed ? 'bg-blue-900/20 border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.4)] animate-pulse' : 'bg-black/10 dark:bg-white/5 border-black/10 dark:border-white/10 hover:border-red-500/50 hover:scale-105'}`}>
                    {isProcessing ? <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" /> : <div className={`transition-all duration-300 ${isRecording ? 'w-6 h-6 bg-red-500 rounded-lg animate-pulse' : isArmed ? 'w-8 h-8 bg-blue-500 rounded-full animate-pulse' : 'w-12 h-12 bg-red-600 rounded-full group-hover:scale-110 shadow-lg'}`} />}
                </button>
            </div>
            <div className="text-center space-y-1 h-14">
                <div className={`text-2xl font-black uppercase tracking-[0.2em] transition-all duration-300 ${isRecording ? 'text-red-500' : 'text-black dark:text-white'}`}>{isRecording ? formatDur(duration) : isFadingOut ? studio.stopping : isProcessing ? studio.processing : isArmed ? studio.arming : studio.start}</div>
                {isRecording && <div className="text-[10px] font-mono text-black/40 dark:text-white/40 uppercase tracking-widest animate-pulse flex items-center justify-center gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full" />{formatSize(size)} {studio.processing || "ENCODING"}</div>}
            </div>
        </div>
        {countdownVal > 0 && <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm"><span className="text-8xl font-black text-white animate-ping">{countdownVal}</span><span className="text-xs font-black text-white/40 uppercase tracking-[0.4em] mt-8">{t?.toasts?.audioNotReady || "Initializing..."}</span></div>}
      </BentoCard>
    </div>
  );
};