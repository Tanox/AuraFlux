// src/components/controls/studio/StudioConfig.tsx v2.3.8
import React from 'react';
import { CustomSelect } from '@/components/visualizers/ui/controls/CustomSelect';
import { Slider } from '@/components/visualizers/ui/controls/Slider';
import { SegmentedControl } from '@/components/visualizers/ui/controls/SegmentedControl';
import { BentoCard } from '@/components/visualizers/ui/layout/BentoCard';
import { SettingsToggle } from '@/components/visualizers/ui/controls/SettingsToggle';

interface StudioConfigProps {
  studio: any;
  labels: any;
  hints: any;
  resolution: number | 'native';
  setResolution: (v: number | 'native') => void;
  aspectRatio: number | 'native';
  setAspectRatio: (v: number | 'native') => void;
  fps: number;
  setFps: (v: number) => void;
  mimeType: string;
  setMimeType: (v: string) => void;
  supportedTypes: string[];
  getFormatLabel: (mime: string) => string;
  bitrate: number;
  setBitrate: (v: number) => void;
  recGain: number;
  setRecGain: (v: number) => void;
  syncStart: boolean;
  setSyncStart: (v: boolean) => void;
  enableCountdown: boolean;
  setEnableCountdown: (v: boolean) => void;
}

export const StudioConfig: React.FC<StudioConfigProps> = ({
  studio, labels, hints,
  resolution, setResolution,
  aspectRatio, setAspectRatio,
  fps, setFps,
  mimeType, setMimeType,
  supportedTypes, getFormatLabel,
  bitrate, setBitrate,
  recGain, setRecGain,
  syncStart, setSyncStart,
  enableCountdown, setEnableCountdown
}) => {
  return (
    <div className="lg:col-span-7 flex flex-col gap-3">
      <BentoCard id="panel-studio-video-config" title={studio.videoConfig}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <CustomSelect label={labels.resolution} value={resolution} onChange={(v) => setResolution(v === 'native' ? 'native' : Number(v))} options={[{ value: 'native', label: labels.resNative }, { value: 720, label: '720p' }, { value: 1080, label: '1080p' }, { value: 2160, label: '4K' }]} />
            <CustomSelect label={labels.aspectRatio} value={aspectRatio} onChange={(v) => setAspectRatio(v === 'native' ? 'native' : Number(v))} options={[{ value: 'native', label: labels.resNative }, { value: 16 / 9, label: '16:9' }, { value: 9 / 16, label: '9:16' }, { value: 1, label: '1:1' }]} />
            <CustomSelect label={labels.fps} value={fps} onChange={(v) => setFps(Number(v))} options={[{ value: 30, label: '30 FPS' }, { value: 60, label: '60 FPS' }]} />
          </div>
          <div className="pt-4 border-t border-black/5 dark:border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CustomSelect label={labels.codec} value={mimeType} onChange={(v) => setMimeType(v as string)} options={supportedTypes.map(t => ({ value: t, label: getFormatLabel(t) }))} />
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-black/50 dark:text-white/50 uppercase tracking-wider">{labels.bitrate}</label>
              <SegmentedControl value={bitrate.toString()} onChange={(v) => setBitrate(Number(v))} options={[{ id: "4000000", label: "4M" }, { id: "8000000", label: "8M" }, { id: "12000000", label: "12M" }, { id: "24000000", label: "24M" }]} />
            </div>
          </div>
        </div>
      </BentoCard>
      <BentoCard id="panel-studio-audio-mix" title={studio.audioMix} className="flex-1">
        <div className="h-full flex flex-col justify-between gap-4">
          <div className="max-w-md"><Slider label={labels.recGain} value={recGain} min={0} max={2} step={0.1} onChange={setRecGain} hintText={hints.recGain} /></div>
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-black/5 dark:border-white/5">
              <SettingsToggle label={labels.syncStart} value={syncStart} onChange={() => setSyncStart(!syncStart)} variant="clean" activeColor="blue" hintText={hints.syncStart} />
              <SettingsToggle label={labels.countdown} value={enableCountdown} onChange={() => setEnableCountdown(!enableCountdown)} variant="clean" activeColor="blue" hintText={hints.countdown} />
          </div>
        </div>
      </BentoCard>
    </div>
  );
};
