/**
 * File: app/components/controls/panels/visual/AiBackground.tsx
 * Version: v1.9.36
 * Author: Sut
 */

import React, { useState } from 'react';
import { BentoCard } from '../../../visualizers/ui/layout/BentoCard';
import { SettingsToggle } from '../../../visualizers/ui/controls/SettingsToggle';
import { Slider } from '../../../visualizers/ui/controls/Slider';
import { useVisuals, useUI, useAudioContext, useAI } from '../../../../AppContext';
import { generateArtisticBackground } from '../../../../services/aiService';

export const AiBackground: React.FC = () => {
  const { settings, setSettings } = useVisuals();
  const { currentSong } = useAudioContext();
  const { apiKeys } = useAI();
  const { t, showToast } = useUI();
  
  const [isGenerating, setIsGenerating] = useState(false);

  const handleVisualSettingChange = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerateAiBg = async () => {
      const mood = currentSong?.mood_en_keywords || currentSong?.mood || 'Vibrant, Abstract, Cosmic';
      const apiKey = apiKeys['GEMINI'] || process.env.API_KEY;
      
      if (!apiKey) {
          showToast(t?.toasts?.aiDirectorReq || 'Key required', 'error');
          return;
      }
      
      setIsGenerating(true);
      try {
          const imgUrl = await generateArtisticBackground(mood, apiKey);
          if (imgUrl) {
              setSettings(p => ({ ...p, aiBgUrl: imgUrl, showAiBg: true }));
              showToast(t?.visualPanel?.bgGenerated || "Background Generated", 'success');
          } else {
              throw new Error("Empty image");
          }
      } catch (e) {
          showToast(t?.toasts?.aiFail || "Failed to generate image", 'error');
      } finally {
          setIsGenerating(false);
      }
  };

  return (
    <BentoCard title={t?.visualPanel?.aiBg} className="flex-1">
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center h-full">
            <div className="shrink-0 flex gap-2">
                <button 
                    onClick={handleGenerateAiBg} 
                    disabled={isGenerating}
                    className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border ${isGenerating ? 'bg-black/5 dark:bg-white/5 text-black/40 dark:text-white/40 border-transparent' : 'bg-black dark:bg-white text-white dark:text-black border-black/10 dark:border-white/10 hover:bg-blue-600 dark:hover:bg-blue-400 hover:text-white dark:hover:text-black'}`}
                >
                    {/* @fix: Corrected a corrupted SVG path element that was causing a cryptic TypeScript error. */}
                    <svg className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                    <span>{isGenerating ? t?.common?.processing : (settings.aiBgUrl ? t?.visualPanel?.regenerate : t?.visualPanel?.generateBg)}</span>
                </button>
                <SettingsToggle label="" value={settings.showAiBg} onChange={() => handleVisualSettingChange('showAiBg', !settings.showAiBg)} />
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Slider label={t?.visualPanel?.opacity} value={settings.aiBgOpacity} min={0} max={1} step={0.05} onChange={(v)=>handleVisualSettingChange('aiBgOpacity', v)} />
                    <Slider label={t?.player?.blur} value={settings.aiBgBlur} min={0} max={60} step={2} onChange={(v)=>handleVisualSettingChange('aiBgBlur', v)} />
                </div>
            </div>
        </div>
    </BentoCard>
  );
};
