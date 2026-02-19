/**
 * File: app/components/controls/panels/visual/CoreVisuals.tsx
 * Version: v1.9.36
 * Author: Sut
 */

import React from 'react';
import { COLOR_THEMES, SMART_PRESETS } from '../../../../constants';
import { SettingsToggle } from '../../../visualizers/ui/controls/SettingsToggle';
import { Slider } from '../../../visualizers/ui/controls/Slider';
import { CustomSelect } from '../../../visualizers/ui/controls/CustomSelect';
import { SegmentedControl } from '../../../visualizers/ui/controls/SegmentedControl';
import { BentoCard } from '../../../visualizers/ui/layout/BentoCard';
import { useVisuals, useUI } from '../../../../AppContext';
import { TooltipArea } from '../../../visualizers/ui/controls/Tooltip';

export const CoreVisuals: React.FC = () => {
  const { 
    colorTheme, setColorTheme, 
    settings, setSettings, 
    resetVisualSettings, 
    applyPreset, 
    activePreset, setActivePreset
  } = useVisuals();
  
  const { t } = useUI();
  const localizedThemes = t?.themes || [];
  const isAdvanced = settings.uiMode === 'advanced';
  const q = (t?.qualities || {}) as any;

  const handleVisualSettingChange = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setActivePreset('');
  };

  const presetOptions = [
    { value: '', label: t?.presets?.select || 'Choose a mood...' },
    ...Object.values(SMART_PRESETS).map(p => ({
      value: p.nameKey,
      label: t?.presets?.[p.nameKey as keyof typeof t.presets] || p.nameKey
    }))
  ];

  return (
    <BentoCard 
        title={t?.presets?.title || "Visual Core"}
        action={
            <div className="flex items-center gap-1">
                <TooltipArea text={t?.hints?.resetVisual}>
                    <button onClick={resetVisualSettings} className="p-1.5 text-black/30 dark:text-white/30 hover:text-blue-500 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                </TooltipArea>
            </div>
        }
    >
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
                <div className="flex-1">
                    <CustomSelect 
                        label={t?.presets?.hint || "Atmosphere Engine"}
                        value={activePreset}
                        options={presetOptions}
                        onChange={(val) => {
                            const selected = SMART_PRESETS[val];
                            if (selected) applyPreset(selected);
                        }}
                    />
                </div>
                <div className="grid grid-cols-2 gap-3 w-full sm:w-[260px] shrink-0">
                    <SettingsToggle label={t?.glow || "Glow"} value={settings.glow} onChange={()=>handleVisualSettingChange('glow', !settings.glow)} variant="clean" />
                    <SettingsToggle label={t?.trails || "Trail"} value={settings.trails} onChange={()=>handleVisualSettingChange('trails', !settings.trails)} variant="clean" />
                </div>
            </div>
            
            <div className="pt-4 border-t border-black/5 dark:border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
                <Slider label={t?.speed} value={settings.speed} min={0.1} max={3.0} step={0.1} onChange={(v)=>handleVisualSettingChange('speed', v)} />
                <Slider label={t?.sensitivity} value={settings.sensitivity} min={0.5} max={4.0} step={0.1} onChange={(v)=>handleVisualSettingChange('sensitivity', v)} />
                
                {isAdvanced && (
                    <>
                        <Slider label={t?.smoothing} value={settings.smoothing} min={0} max={0.95} step={0.01} onChange={(v)=>handleVisualSettingChange('smoothing', v)} />
                        <SegmentedControl 
                            label={t?.visualPanel?.display}
                            value={settings.quality}
                            options={[{value:'low', label: q.low}, {value:'med', label: q.med}, {value:'high', label: q.high}]}
                            onChange={(val)=>handleVisualSettingChange('quality', val)}
                        />
                    </>
                )}
            </div>

            <div className="pt-4 border-t border-black/5 dark:border-white/5">
                <div className="flex justify-between items-center mb-3">
                    {/* @fix: Use correct localization key `styleTheme` */}
                    <span className="text-[10px] font-black text-black/30 dark:text-white/30 uppercase tracking-widest">{t?.styleTheme}</span>
                    <SettingsToggle label={t?.cycleColors} value={settings.cycleColors} onChange={() => handleVisualSettingChange('cycleColors', !settings.cycleColors)} variant="clean" />
                </div>
                {!settings.cycleColors ? (
                    <div className="grid grid-cols-6 sm:grid-cols-9 gap-2 animate-fade-in-up">
                        {COLOR_THEMES.map((theme, idx) => (
                            <button key={idx} onClick={() => setColorTheme(theme)} title={localizedThemes[idx] || localizedThemes[idx]} className={`w-full aspect-square rounded-lg transition-all duration-300 relative overflow-hidden ${JSON.stringify(colorTheme) === JSON.stringify(theme) ? 'ring-2 ring-blue-500 scale-105 shadow-lg' : 'opacity-60 hover:opacity-100 hover:scale-105'}`} style={{ background: `linear-gradient(135deg, ${theme[0]}, ${theme[1]})` }} />
                        ))}
                    </div>
                ) : (
                    <div className="animate-fade-in-up max-w-sm">
                        <Slider label={t?.speed} value={settings.colorInterval || 10} min={2} max={60} step={1} onChange={(v) => handleVisualSettingChange('colorInterval', v)} unit="s" />
                    </div>
                )}
            </div>
        </div>
    </BentoCard>
  );
};