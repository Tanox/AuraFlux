'use client';

// src/components/controls/audio/InputSettings.tsx v2.3.8



import React, { useMemo, useCallback } from 'react';
import { BentoCard } from '../../visualizers/ui/layout/BentoCard';
import { TooltipArea } from '../../visualizers/ui/controls/Tooltip';
import { CustomSelect } from '../../visualizers/ui/controls/CustomSelect';
import { Slider } from '../../visualizers/ui/controls/Slider';
import { useVisuals, useAudioContext, useUI } from '@/context/AppContext';

export const InputSettings: React.FC = React.memo(() => {
  const { settings, setSettings, resetAudioSettings } = useVisuals();
  const {
      audioDevices, selectedDeviceId, onDeviceChange, toggleMicrophone, isListening, isPending,
      sourceType, fileName
  } = useAudioContext();
  const { t, showToast } = useUI();

  const isAdvanced = settings.uiMode === 'advanced';

  const deviceOptions = useMemo(() => [
    { value: '', label: t?.('audioPanel.defaultMic') || "Default Microphone" },
    ...audioDevices.map(d => ({ value: d.deviceId, label: d.label || `Microphone ${d.deviceId.substring(0, 8)}` }))
  ], [audioDevices, t]);

  const handleAudioSettingChange = useCallback((key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, [setSettings]);

  const handleResetAudioSettings = useCallback(() => {
    resetAudioSettings();
    showToast(t?.('hints.audioReset') || 'Audio settings reset to default', 'success');
  }, [resetAudioSettings, showToast, t]);

  const handleToggleMicrophone = useCallback(() => {
    toggleMicrophone(selectedDeviceId);
  }, [toggleMicrophone, selectedDeviceId]);

  return (
    <BentoCard 
        id="panel-audio-input"
        title={t?.('audioPanel.audioInput') || "Signal Architecture"}
        action={
            <TooltipArea text={t?.('hints.resetAudio')}>
                <button onClick={handleResetAudioSettings} className="p-1.5 text-black/30 dark:text-white/30 hover:text-blue-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </button>
            </TooltipArea>
        }
    >
        <div className="space-y-5">
            <div className="space-y-4">
                <CustomSelect label={t?.('audioPanel.mic')} value={selectedDeviceId} options={deviceOptions} onChange={onDeviceChange} />
                
                {sourceType === 'file' && (
                    <div className="px-4 py-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between animate-fade-in-up">
                        <div className="flex flex-col min-w-0">
                            <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">{t?.('audioPanel.fileActive') || "ACTIVE STREAM"}</span>
                            <span className="text-[10px] font-bold text-blue-200 truncate pr-2 uppercase">{fileName || "Local Session"}</span>
                        </div>
                        <div className="shrink-0 w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                    </div>
                )}

                <button 
                    onClick={handleToggleMicrophone} 
                    disabled={isPending}
                    className={`group relative w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.25em] transition-all overflow-hidden shadow-xl ${
                        isListening 
                        ? 'bg-red-500 text-white shadow-red-500/20' 
                        : 'bg-black dark:bg-white text-white dark:text-black hover:scale-[1.02] active:scale-95'
                    }`}
                >
                    {isPending ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            <span>{t?.('studioPanel.processing') || "LOADING"}</span>
                        </div>
                    ) : (
                        <span className="relative z-10">
                            {isListening ? (t?.('audioPanel.stop') || "STOP CAPTURE") : (t?.('audioPanel.start') || "START CAPTURE")}
                        </span>
                    )}
                    <div className={`absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity ${isListening ? 'hidden' : ''}`} />
                </button>
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/5 grid gap-5">
                <Slider 
                    label={t?.('sensitivity') || "Gain"} 
                    value={settings.sensitivity} 
                    min={0.5} 
                    max={4.0} 
                    step={0.1} 
                    onChange={(v) => handleAudioSettingChange('sensitivity', v)} 
                />
                {isAdvanced && (
                    <div className="grid grid-cols-2 gap-4 animate-fade-in-up">
                        <Slider 
                            label={t?.('smoothing') || "Inertia"} 
                            value={settings.smoothing} 
                            min={0} 
                            max={0.95} 
                            step={0.01} 
                            onChange={(v) => handleAudioSettingChange('smoothing', v)} 
                        />
                        <CustomSelect 
                            label={t?.('fftSize') || "FFT Size"} 
                            value={settings.fftSize} 
                            options={[
                                {value: 512, label: '512 (Fast)'},
                                {value: 1024, label: '1024 (Balanced)'},
                                {value: 2048, label: '2048 (Pro)'}
                            ]} 
                            onChange={(v) => handleAudioSettingChange('fftSize', v)} 
                        />
                    </div>
                )}
            </div>
        </div>
    </BentoCard>
  );
});

InputSettings.displayName = 'InputSettings';
