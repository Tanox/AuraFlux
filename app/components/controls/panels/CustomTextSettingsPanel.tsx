/**
 * File: app/components/controls/panels/CustomTextSettingsPanel.tsx
 * Version: v1.9.68
 * Author: Sut
 */

import React, { useMemo } from 'react';
import { getPositionOptions, getFontOptions } from '../../../constants/index.ts';
import { SettingsToggle } from '../../visualizers/ui/controls/SettingsToggle.tsx';
import { Slider } from '../../visualizers/ui/controls/Slider.tsx';
import { CustomSelect } from '../../visualizers/ui/controls/CustomSelect.tsx';
import { BentoCard } from '../../visualizers/ui/layout/BentoCard.tsx';
import { useVisuals, useUI } from '../../../AppContext.tsx';
import { Position } from '../../../types/index.ts';
import { TooltipArea } from '../../visualizers/ui/controls/Tooltip.tsx';

export const CustomTextSettingsPanel: React.FC = () => {
  const { settings, setSettings, resetTextSettings } = useVisuals();
  const { t } = useUI();
  
  const positionOptions = useMemo(() => getPositionOptions(t), [t]);
  const localizedFonts = useMemo(() => getFontOptions(t), [t]);

  const colorPresets = ['#ffffff', '#64748b', '#f87171', '#facc15', '#22c55e', '#00e5ff', '#3b82f6', '#8b5cf6', '#ff007f'];

  const currentFont = settings.customTextFont || 'Inter, sans-serif';
  const isPresetFont = localizedFonts.some(f => f.value !== 'custom' && f.value === currentFont);
  const selectValue = isPresetFont ? currentFont : 'custom';

  const handleFontChange = (v: string) => {
    if (v === 'custom') {
      if (isPresetFont) setSettings({...settings, customTextFont: 'Arial, sans-serif'});
    } else {
      setSettings({...settings, customTextFont: v});
    }
  };

  return (
    <div id="panel-text" className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
      {/* Column 1: Core Configuration (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-3">
        <BentoCard 
            title={t?.textPanel?.overlay || "Text Layer Setup"}
            action={
                <TooltipArea text={t?.hints?.resetText}>
                    <button onClick={resetTextSettings} className="p-1.5 text-black/30 dark:text-white/30 hover:text-blue-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                </TooltipArea>
            }
        >
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Source Logic & Input Group */}
                    <div className="flex-1 space-y-4 flex flex-col">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <SettingsToggle label={t?.customText || "Layer Master"} value={settings.showCustomText} onChange={() => setSettings({...settings, showCustomText: !settings.showCustomText})} activeColor="blue" variant="clean" />
                            <CustomSelect label={t?.textSource} value={settings.textSource || 'AUTO'} options={[{ value: 'AUTO', label: t?.textSources?.auto || 'AUTO' }, { value: 'CUSTOM', label: t?.textSources?.custom || 'MANUAL' }, { value: 'SONG', label: t?.textSources?.song || 'SONG' }, { value: 'CLOCK', label: t?.textSources?.clock || 'CLOCK' }]} onChange={(v) => setSettings({...settings, textSource: v})} />
                        </div>
                        
                        {/* Compact Text Input Area - Directly follows source logic */}
                        <div className="relative group flex-1">
                            <textarea 
                                value={settings.customText} 
                                onChange={(e) => setSettings({...settings, customText: e.target.value.toUpperCase()})} 
                                placeholder={t?.customTextPlaceholder || "ENTER TEXT"} 
                                className="w-full h-full min-h-[80px] bg-black/[0.04] dark:bg-white/[0.04] border border-black/5 dark:border-white/5 rounded-xl px-4 py-3 text-xs font-black text-black dark:text-white tracking-[0.1em] uppercase focus:border-blue-500/50 outline-none resize-none transition-all placeholder-black/10 dark:placeholder-white/10" 
                            />
                            <div className="absolute bottom-2 right-3 opacity-20 pointer-events-none text-[7px] font-mono uppercase tracking-widest">{settings.customText.length}</div>
                        </div>
                    </div>

                    {/* Anchor Selector - Moved to side for balance */}
                    <div className="w-full sm:w-32 shrink-0 bg-black/[0.03] dark:bg-white/[0.03] rounded-2xl p-3 border border-black/5 dark:border-white/5 flex flex-col justify-center">
                        <span className="text-[8px] font-black uppercase text-black/30 dark:text-white/30 tracking-widest mb-2 block text-center">{t?.lyricsPosition || "Anchor"}</span>
                        <div className="grid grid-cols-3 gap-1">
                            {positionOptions.map(pos => (
                                <button 
                                    key={pos.value} 
                                    onClick={() => setSettings({...settings, customTextPosition: pos.value as Position})}
                                    className={`aspect-square rounded-lg transition-all flex items-center justify-center ${settings.customTextPosition === pos.value ? 'bg-blue-600 text-white shadow-md scale-105' : 'bg-black/5 dark:bg-white/5 text-black/20 dark:text-white/20 hover:text-black/40 dark:hover:text-white/40'}`}
                                >
                                    <div className={`w-1 h-1 rounded-full ${settings.customTextPosition === pos.value ? 'bg-white' : 'bg-current'}`} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </BentoCard>

        <BentoCard title={t?.customColor || "Dynamic Chroma"} className="flex-1">
            <div className="flex flex-col sm:flex-row gap-6 items-center h-full py-1">
                <div className="w-full sm:w-auto shrink-0">
                    <SettingsToggle label={t?.cycleColors || "Auto Cycle"} value={settings.customTextCycleColor} onChange={() => setSettings({...settings, customTextCycleColor: !settings.customTextCycleColor})} variant="clean" />
                </div>
                <div className="flex-1 w-full">
                    {!settings.customTextCycleColor ? (
                        <div className="grid grid-cols-9 gap-2 animate-fade-in-up">
                            {colorPresets.map(c => (
                                <button 
                                    key={c} 
                                    onClick={() => setSettings({...settings, customTextColor: c})} 
                                    className={`aspect-square rounded-lg border border-black/5 dark:border-white/10 transition-all ${settings.customTextColor === c ? 'ring-2 ring-blue-500 scale-110 shadow-lg z-10' : 'opacity-40 hover:opacity-100 hover:scale-105'}`} 
                                    style={{backgroundColor: c}} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="animate-fade-in-up">
                            <Slider label={t?.speed || "Tempo"} value={settings.customTextCycleInterval || 5} min={1} max={30} step={1} onChange={(v) => setSettings({...settings, customTextCycleInterval: v})} unit="s" />
                        </div>
                    )}
                </div>
            </div>
        </BentoCard>
      </div>

      {/* Column 2: Visual Style & Motion (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-3">
        <BentoCard title={t?.textPanel?.appearance || "Style & Typography"} className="flex-1">
            <div className="space-y-5">
                <div className="space-y-4">
                    <CustomSelect label={t?.textFont} value={selectValue} options={localizedFonts} onChange={handleFontChange} />
                    {selectValue === 'custom' && (
                        <div className="animate-fade-in-up">
                            <input 
                                type="text"
                                value={currentFont}
                                onChange={(e) => setSettings({...settings, customTextFont: e.target.value})}
                                placeholder={t?.hints?.enterLocalFont || "e.g. Arial, Helvetica"}
                                className="w-full bg-black/[0.04] dark:bg-white/[0.04] border border-black/5 dark:border-white/5 rounded-xl px-3 py-2 text-[10px] text-black dark:text-white placeholder-black/20 dark:placeholder-white/20 focus:border-blue-500/50 outline-none font-mono"
                            />
                        </div>
                    )}
                </div>

                <div className="pt-3 border-t border-black/5 dark:border-white/5 grid gap-4">
                    <Slider label={t?.textSize} value={settings.customTextSize ?? 12} min={2} max={60} step={1} onChange={(v) => setSettings({...settings, customTextSize: v})} />
                    <Slider label={t?.visualPanel?.opacity || "Opacity"} value={settings.customTextOpacity ?? 0.5} min={0} max={1} step={0.05} onChange={(v) => setSettings({...settings, customTextOpacity: v})} />
                    <Slider label={t?.textRotation || "Rotation"} value={settings.customTextRotation ?? 0} min={-180} max={180} step={5} onChange={(v) => setSettings({...settings, customTextRotation: v})} unit="°" />
                </div>

                <div className="pt-3 border-t border-black/5 dark:border-white/5 grid grid-cols-2 gap-3">
                    <SettingsToggle label={t?.textAudioReactive || "Pulse"} value={settings.textPulse} onChange={() => setSettings({...settings, textPulse: !settings.textPulse})} variant="clean" activeColor="blue" />
                    <SettingsToggle label={t?.text3D || "3D"} value={!!settings.customText3D} onChange={() => setSettings({...settings, customText3D: !settings.customText3D})} variant="clean" activeColor="blue" />
                </div>
            </div>
        </BentoCard>
      </div>
    </div>
  );
};