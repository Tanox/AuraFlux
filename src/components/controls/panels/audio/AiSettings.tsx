'use client';
// File: /src/components/controls/panels/audio/AiSettings.tsx | Version: v2.2.22

import React, { useState } from 'react';
import { BentoCard } from '../../../visualizers/ui/layout/BentoCard';
import { SettingsToggle } from '../../../visualizers/ui/controls/SettingsToggle';
import { CustomSelect } from '../../../visualizers/ui/controls/CustomSelect';
import { useVisuals, useAudioContext, useUI, useAI } from '@/context/AppContext';
import { generateVisualConfigFromAudio, checkAiServiceAvailability } from '../../../../services/aiService';
import { VisualizerMode, Region } from '../../../../types/index';

export const AiSettings: React.FC = () => {
  const { settings, setSettings, setMode, setColorTheme } = useVisuals();
  const { sourceType, fileStatus, getAudioSlice } = useAudioContext();
  const { enableAnalysis, setEnableAnalysis, showLyrics, setShowLyrics } = useAI();
  const { t, showToast } = useUI();
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const isAdvanced = settings.uiMode === 'advanced';
  const currentProvider = settings.recognitionProvider || 'GEMINI';

  const handleAiDirector = async () => {
      if (fileStatus !== 'ready') return;
      if (!checkAiServiceAvailability((msg) => showToast(msg, 'error'))) return;
      setIsAnalyzing(true);
      try {
          const wavBlob = await getAudioSlice(15);
          if (!wavBlob) throw new Error("Failed");
          const reader = new FileReader();
          reader.readAsDataURL(wavBlob);
          reader.onloadend = async () => {
              const base64Audio = (reader.result as string).split(',')[1];
              const config = await generateVisualConfigFromAudio(base64Audio);
              if (config) {
                  if (config.mode && Object.values(VisualizerMode).includes(config.mode as VisualizerMode)) setMode(config.mode as VisualizerMode);
                  if (config.colors && config.colors.length === 3) setColorTheme(config.colors);
                  setSettings(p => ({ ...p, speed: config.speed || p.speed, sensitivity: config.sensitivity || p.sensitivity, glow: config.glow ?? p.glow }));
                  showToast(`AI: ${config.explanation}`, 'success');
              }
              setIsAnalyzing(false);
          };
      } catch (e) { setIsAnalyzing(false); }
  };

  return (
    <div className="flex flex-col gap-3">
        <BentoCard id="panel-audio-ai-engine" title={t?.('audioPanel.analysisAi') || "Neural Engine"}>
            <div className="space-y-6">
                {/* AI Master Toggle & Region */}
                <div className="bg-black/[0.04] dark:bg-white/[0.04] p-4 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <SettingsToggle label={t?.('showLyrics') || "Lyrics Display"} value={showLyrics} onChange={()=>setShowLyrics(!showLyrics)} activeColor="green" variant="clean" />
                        <SettingsToggle label={t?.('audioPanel.enableAi') || "Live Analysis"} value={enableAnalysis} onChange={()=>setEnableAnalysis(!enableAnalysis)} activeColor="blue" variant="clean" />
                    </div>
                    {enableAnalysis && isAdvanced && (
                        <div className="w-full pt-2 border-t border-black/5 dark:border-white/5 animate-fade-in-up">
                            <CustomSelect label={t?.('region')} value={settings.region || 'global'} options={Object.keys(t?.('regions') || {}).map(r=>({value:r,label:t?.(`regions.${r}`)||r}))} onChange={(v)=>setSettings({...settings,region:v as Region})} />
                        </div>
                    )}
                </div>
                
                {/* AI Provider Section */}
                {enableAnalysis && (
                  <div className="space-y-5 animate-fade-in-up">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <CustomSelect 
                              label={t?.('recognitionSource') || "AI Protocol"} 
                              value={currentProvider} 
                              options={Object.keys(t?.('aiProviders') || {}).map(p => ({ value: p, label: t?.(`aiProviders.${p}`) }))} 
                              onChange={(v) => setSettings(prev => ({ ...prev, recognitionProvider: v as any }))}
                          />
                      </div>

                      {sourceType === 'file' && fileStatus === 'ready' && (
                        <div className="pt-4 border-t border-black/5 dark:border-white/5 animate-fade-in-up">
                            <button 
                                onClick={handleAiDirector}
                                disabled={isAnalyzing}
                                className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-[0.25em] flex items-center justify-center gap-3 border transition-all ${
                                    isAnalyzing 
                                    ? 'bg-black/5 dark:bg-white/5 text-black/20 dark:text-white/20 border-transparent' 
                                    : 'bg-blue-500/5 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/10 hover:border-blue-500/40 hover:scale-[1.01]'
                                }`}
                            >
                                <svg className={`h-4 w-4 ${isAnalyzing ? 'animate-spin' : 'animate-pulse'}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/></svg>
                                {isAnalyzing ? t?.('audioPanel.analyzing') : t?.('audioPanel.aiDirector')}
                            </button>
                        </div>
                      )}
                  </div>
                )}
            </div>
        </BentoCard>

        {/* Informational Hint Card */}
        <div id="panel-audio-ai-guide" className="bg-black/5 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-2xl p-4 flex gap-4 items-center group transition-colors hover:bg-black/[0.07] dark:hover:bg-white/[0.04]">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-[10px] font-black text-black/60 dark:text-white/60 uppercase tracking-widest mb-0.5">{t?.('audioPanel.analysisAi') || "Guide"}</h4>
                <p className="text-[10px] text-black/30 dark:text-white/30 leading-relaxed truncate group-hover:whitespace-normal group-hover:break-words transition-all">
                    {t?.('helpModal.howItWorksSteps.3') || "Enable AI to see real-time lyrics and mood analysis."}
                </p>
            </div>
        </div>
    </div>
  );
};
