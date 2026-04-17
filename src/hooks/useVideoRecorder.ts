// File: src\hooks\useVideoRecorder.ts | Version: v2.3.3
import { useState, useCallback, useRef } from 'react';

export const useVideoRecorder = (props: any = {}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);
  const [size, setSize] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const getSupportedMimeTypes = useCallback(() => {
    return ['video/webm;codecs=vp9', 'video/webm', 'video/mp4'];
  }, []);

  const startRecording = useCallback((canvas: HTMLCanvasElement) => {
    try {
      const stream = canvas.captureStream(60);
      const options = { mimeType: 'video/webm;codecs=vp9' };
      
      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(stream, options);
      } catch (e) {
        recorder = new MediaRecorder(stream);
      }

      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
          setSize(prev => prev + e.data.size);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        setRecordedBlob(blob);
        setIsProcessing(false);
        setIsFadingOut(false);
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aura-flux-recording-${new Date().getTime()}.webm`;
        a.click();
        URL.revokeObjectURL(url);
      };

      recorder.start();
      setIsRecording(true);
      setDuration(0);
      setSize(0);
      
      const interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(interval);
    } catch (err) {
      console.warn('Failed to start recording:', err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      setIsProcessing(true);
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const discardRecording = useCallback(() => {
    setRecordedBlob(null);
    setDuration(0);
    setSize(0);
  }, []);

  return { 
    isRecording, 
    isProcessing,
    isFadingOut,
    recordedBlob,
    duration,
    size,
    startRecording, 
    stopRecording,
    discardRecording,
    getSupportedMimeTypes
  };
};

