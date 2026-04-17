# 闊抽寮曟搸瑙勮寖

## 1. 鏍稿績闊抽 Hook

### 1.1 useAudio Hook
- **鏂囦欢**: `src/hooks/useAudio.ts`
- **鐗堟湰**: v2.3.2
- **鍔熻兘**: 鎻愪緵闊抽澶勭悊鍜屽垎鏋愬姛鑳?
**鏍稿績鐘舵€?**
- `sourceType` - 闊抽婧愮被鍨?(`'microphone' | 'file' | 'url'`)
- `isListening` - 楹﹀厠椋庣洃鍚姸鎬?- `isPending` - 澶勭悊涓姸鎬?- `analyser` - 宸﹀０閬撳垎鏋愬櫒
- `analyserR` - 鍙冲０閬撳垎鏋愬櫒
- `mediaStream` - 濯掍綋娴?- `audioDevices` - 鍙敤闊抽璁惧鍒楄〃
- `selectedDeviceId` - 褰撳墠閫夋嫨鐨勮澶?ID
- `playlist` - 鎾斁鍒楄〃
- `currentIndex` - 褰撳墠鎾斁绱㈠紩
- `playbackMode` - 鎾斁妯″紡
- `isPlaying` - 鎾斁鐘舵€?- `duration` - 闊抽鏃堕暱
- `currentTime` - 褰撳墠鎾斁鏃堕棿

**鏍稿績鏂规硶:**
- `toggleMicrophone` - 鍒囨崲楹﹀厠椋庣姸鎬?- `importFiles` - 瀵煎叆闊抽鏂囦欢
- `togglePlayback` - 鍒囨崲鎾斁鐘舵€?- `seekFile` - 璺宠浆鎾斁浣嶇疆
- `playNext` - 鎾斁涓嬩竴棣?- `playPrev` - 鎾斁涓婁竴棣?- `playTrackByIndex` - 鎾斁鎸囧畾绱㈠紩鐨勬瓕鏇?- `removeFromPlaylist` - 浠庢挱鏀惧垪琛ㄧЩ闄ゆ瓕鏇?- `clearPlaylist` - 娓呯┖鎾斁鍒楄〃
- `getAudioSlice` - 鑾峰彇闊抽鐗囨
- `importFromUrl` - 浠嶶RL瀵煎叆闊抽
- `importPlaylistFromUrl` - 浠嶶RL瀵煎叆鎾斁鍒楄〃

**闊抽璁惧绠＄悊:**
- 鑷姩鏋氫妇鍙敤闊抽杈撳叆璁惧
- 鏀寔璁惧鍒囨崲
- 澶勭悊楹﹀厠椋庢潈闄?
**浠ｇ爜绀轰緥:**
```tsx
// useAudio.ts 鏍稿績缁撴瀯
// File: src/hooks/useAudio.ts | Version: v2.3.3
import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { VisualizerSettings, AudioDevice, Track, PlaybackMode, SongInfo } from '../types';

interface UseAudioProps {
  settings: VisualizerSettings;
  language: string;
  setCurrentSong: (s: SongInfo | null) => void;
  t: any;
  showToast: (m: string, type?: any) => void;
}

export const useAudio = ({ settings, language, setCurrentSong, t, showToast }: UseAudioProps) => {
  const [sourceType, setSourceType] = useState<'microphone' | 'file' | 'url'>('microphone');
  const [isListening, setIsListening] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [analyserR, setAnalyserR] = useState<AnalyserNode | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>(PlaybackMode.SEQUENCE);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioNode | null>(null);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices
          .filter(d => d.kind === 'audioinput')
          .map(d => ({ deviceId: d.deviceId, label: d.label || `Microphone ${d.deviceId.slice(0, 5)}` }));
        setAudioDevices(audioInputs);
      } catch (err: any) {
        console.warn('Error getting devices:', err?.message || err);
      }
    };
    getDevices();
  }, []);

  const toggleMicrophone = useCallback(async (deviceId: string) => {
    try {
      if (isListening) {
        mediaStream?.getTracks().forEach(t => t.stop());
        setIsListening(false);
        setMediaStream(null);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: deviceId ? { deviceId: { exact: deviceId } } : true
      });

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      const source = ctx.createMediaStreamSource(stream);
      const ana = ctx.createAnalyser();
      ana.fftSize = 2048;
      source.connect(ana);

      setAnalyser(ana);
      setMediaStream(stream);
      setIsListening(true);
      setSourceType('microphone');
      setSelectedDeviceId(deviceId);
    } catch (err: any) {
      console.warn('Microphone access skipped or denied:', err?.message || err);
      showToast('Microphone access denied. Running in silent mode.', 'error');
    }
  }, [isListening, mediaStream, showToast]);

  const importFiles = useCallback(async (files: FileList | File[]) => {
    const newTracks: Track[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).slice(2),
      file: file as File,
      title: (file as File).name.replace(/\.[^/.]+$/, ""),
      artist: 'Unknown Artist'
    }));
    setPlaylist(prev => [...prev, ...newTracks]);
    setSourceType('file');
    showToast(`Imported ${newTracks.length} tracks`);
  }, [showToast]);

  const togglePlayback = useCallback(() => setIsPlaying(prev => !prev), []);
  const seekFile = useCallback((t: number) => setCurrentTime(t), []);
  const playNext = useCallback(() => setCurrentIndex(prev => (prev + 1) % playlist.length), [playlist.length]);
  const playPrev = useCallback(() => setCurrentIndex(prev => (prev - 1 + playlist.length) % playlist.length), [playlist.length]);
  const playTrackByIndex = useCallback((i: number) => setCurrentIndex(i), []);
  const removeFromPlaylist = useCallback((i: number) => setPlaylist(prev => prev.filter((_, idx) => idx !== i)), []);
  const clearPlaylist = useCallback(() => setPlaylist([]), []);
  
  const getAudioSlice = useCallback(async (s?: number) => {
      // Mock implementation for now
      return null;
  }, []);

  return useMemo(() => ({
    sourceType, isListening, isPending,
    analyser, analyserR,
    mediaStream, audioDevices,
    selectedDeviceId, onDeviceChange: setSelectedDeviceId,
    toggleMicrophone,
    playlist, currentIndex, playbackMode,
    setPlaybackMode,
    importFiles,
    importFromUrl: async () => ({} as any),
    importPlaylistFromUrl: async () => [],
    togglePlayback, seekFile,
    playNext, playPrev,
    playTrackByIndex, removeFromPlaylist,
    clearPlaylist, getAudioSlice,
    isPlaying, duration, currentTime,
    audioContext: audioContextRef.current
  }), [sourceType, isListening, isPending, analyser, analyserR, mediaStream, audioDevices, selectedDeviceId, setSelectedDeviceId, toggleMicrophone, playlist, currentIndex, playbackMode, setPlaybackMode, importFiles, togglePlayback, seekFile, playNext, playPrev, playTrackByIndex, removeFromPlaylist, clearPlaylist, getAudioSlice, isPlaying, duration, currentTime]);
};
```

## 2. 闊抽宸ュ叿鏈嶅姟

### 2.1 闊抽宸ュ叿 (audioUtils.ts)
- **鏂囦欢**: `src/services/audioUtils.ts`
- **鐗堟湰**: v2.3.2
- **鍔熻兘**: 鎻愪緵闊抽澶勭悊宸ュ叿鍑芥暟

**涓昏鍔熻兘:**
- 闊抽鏍煎紡杞崲
- 棰戣氨鍒嗘瀽宸ュ叿
- 闊抽鏁版嵁澶勭悊
- 鑺傛媿妫€娴?
**鏍稿績鏂规硶:**
- `getAverage` - 璁＄畻闊抽鏁版嵁骞冲潎鍊?- `getAudioSlice` - 鎻愬彇闊抽鍒囩墖
- `audioBufferToWav` - 灏?AudioBuffer 杞崲涓?WAV 鏍煎紡

**浠ｇ爜绀轰緥:**
```tsx
// audioUtils.ts 鏍稿績缁撴瀯
// File: src/services/audioUtils.ts | Version: v2.3.3

export const getAverage = (dataArray: Uint8Array, start?: number, end?: number): number => {
  const startIndex = start || 0;
  const endIndex = end || dataArray.length;
  let sum = 0;
  for (let i = startIndex; i < endIndex; i++) {
    sum += dataArray[i];
  }
  return sum / (endIndex - startIndex);
};

export const getAudioSlice = async (file: File, duration: number = 10): Promise<Blob | null> => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioContext.sampleRate * duration,
      audioContext.sampleRate
    );

    const source = offlineContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(offlineContext.destination);
    source.start(0);

    const renderedBuffer = await offlineContext.startRendering();
    
    // Convert AudioBuffer to WAV Blob
    const wavBlob = audioBufferToWav(renderedBuffer);
    return wavBlob;
  } catch (err) {
    console.warn('Failed to get audio slice:', err);
    return null;
  }
};

function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  let result: Float32Array;
  if (numChannels === 2) {
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);
    result = new Float32Array(left.length * 2);
    for (let i = 0; i < left.length; i++) {
      result[i * 2] = left[i];
      result[i * 2 + 1] = right[i];
    }
  } else {
    result = buffer.getChannelData(0);
  }

  const dataLength = result.length * (bitDepth / 8);
  const bufferLength = 44 + dataLength;
  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  const writeString = (view: DataView, offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
  view.setUint16(32, numChannels * (bitDepth / 8), true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  const offset = 44;
  for (let i = 0; i < result.length; i++) {
    const s = Math.max(-1, Math.min(1, result[i]));
    view.setInt16(offset + i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([view], { type: 'audio/wav' });
}
```

## 3. 闊抽鍝嶅簲寮忕郴缁?
### 3.1 useAudioReactive Hook
- **鏂囦欢**: `src/hooks/useAudioReactive.ts`
- **鐗堟湰**: v2.3.2
- **鍔熻兘**: 灏嗛煶棰戞暟鎹浆鎹负瑙嗚鍝嶅簲

**鏍稿績鍔熻兘:**
- 澶勭悊闊抽棰戣氨鏁版嵁
- 鐢熸垚瑙嗚鍝嶅簲鍊?- 鏀寔涓嶅悓棰戠巼鑼冨洿鐨勫垎鏋?- 鎻愪緵骞虫粦杩囨浮鏁堟灉

**浠ｇ爜绀轰緥:**
```tsx
// useAudioReactive.ts 鏍稿績缁撴瀯
// File: src/hooks/useAudioReactive.ts | Version: v2.3.3
import { useState, useEffect, useRef } from 'react';

export const useAudioReactive = (analyser: AnalyserNode | null, sensitivity: number = 1.0) => {
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);
  const [smoothedData, setSmoothedData] = useState<number[]>([]);
  const [bass, setBass] = useState(0);
  const [mid, setMid] = useState(0);
  const [treble, setTreble] = useState(0);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const smoothData = Array(bufferLength).fill(0);

    const update = () => {
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate frequency ranges
      const bassRange = Math.floor(bufferLength * 0.1);
      const midRange = Math.floor(bufferLength * 0.3);
      
      let bassSum = 0;
      let midSum = 0;
      let trebleSum = 0;

      for (let i = 0; i < bassRange; i++) {
        bassSum += dataArray[i];
      }
      
      for (let i = bassRange; i < midRange; i++) {
        midSum += dataArray[i];
      }
      
      for (let i = midRange; i < bufferLength; i++) {
        trebleSum += dataArray[i];
      }

      // Smooth the data
      for (let i = 0; i < bufferLength; i++) {
        smoothData[i] = smoothData[i] * 0.8 + dataArray[i] * 0.2;
      }

      setAudioData(dataArray);
      setSmoothedData(smoothData);
      setBass((bassSum / bassRange) / 255 * sensitivity);
      setMid((midSum / (midRange - bassRange)) / 255 * sensitivity);
      setTreble((trebleSum / (bufferLength - midRange)) / 255 * sensitivity);

      animationFrameRef.current = requestAnimationFrame(update);
    };

    update();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyser, sensitivity]);

  return {
    audioData,
    smoothedData,
    bass,
    mid,
    treble
  };
};
```

### 3.2 useAudioPulse Hook
- **鏂囦欢**: `src/hooks/useAudioPulse.ts`
- **鐗堟湰**: v2.3.2
- **鍔熻兘**: 妫€娴嬮煶棰戣剦鍐插拰鑺傛媿

**鏍稿績鍔熻兘:**
- 鍒嗘瀽闊抽鑳介噺鍙樺寲
- 妫€娴嬭妭鎷嶅拰鑴夊啿
- 鐢熸垚鑴夊啿瑙﹀彂浜嬩欢

**浠ｇ爜绀轰緥:**
```tsx
// useAudioPulse.ts 鏍稿績缁撴瀯
// File: src/hooks/useAudioPulse.ts | Version: v2.3.3
import { useState, useEffect, useRef, useCallback } from 'react';

export const useAudioPulse = (analyser: AnalyserNode | null, threshold: number = 0.5) => {
  const [isPulse, setIsPulse] = useState(false);
  const [pulseStrength, setPulseStrength] = useState(0);
  const energyRef = useRef(0);
  const lastPulseRef = useRef(0);
  const pulseCooldownRef = useRef(0);
  const animationFrameRef = useRef<number>();

  const resetPulse = useCallback(() => {
    setIsPulse(false);
  }, []);

  useEffect(() => {
    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const update = () => {
      analyser.getByteFrequencyData(dataArray);

      // Calculate total energy
      let totalEnergy = 0;
      for (let i = 0; i < bufferLength; i++) {
        totalEnergy += dataArray[i];
      }
      const averageEnergy = totalEnergy / bufferLength / 255;

      // Calculate energy change
      const energyChange = averageEnergy - energyRef.current;
      energyRef.current = averageEnergy * 0.8 + energyRef.current * 0.2;

      // Check for pulse
      const now = Date.now();
      if (pulseCooldownRef.current < now) {
        if (energyChange > threshold) {
          setIsPulse(true);
          setPulseStrength(energyChange);
          lastPulseRef.current = now;
          pulseCooldownRef.current = now + 200; // 200ms cooldown

          // Reset pulse after 100ms
          setTimeout(resetPulse, 100);
        }
      }

      animationFrameRef.current = requestAnimationFrame(update);
    };

    update();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [analyser, threshold, resetPulse]);

  return {
    isPulse,
    pulseStrength
  };
};
```
