import React, { useMemo } from 'react';
import { useVisuals, useUI } from '@/context/AppContext';
import { BentoCard } from '@/components/visualizers/ui/layout/BentoCard';
import { TooltipArea } from '@/components/visualizers/ui/controls/Tooltip';
import { SettingsToggle } from '@/components/visualizers/ui/controls/SettingsToggle';
import { CustomSelect } from '@/components/visualizers/ui/controls/CustomSelect';
import { getPositionOptions } from '@/constants/index';
import { Position } from '@/types/index';

export const TextLayerSetup: React.FC = () => {
    const { settings, setSettings, resetTextSettings } = useVisuals();
    const { t } = useUI();
    const positionOptions = useMemo(() => getPositionOptions(t), [t]);

    return (
        <BentoCard 
            id="panel-text-layer-setup"
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
                                value={settings.customText || ''} 
                                onChange={(e) => setSettings({...settings, customText: e.target.value.toUpperCase()})} 
                                placeholder={t?.customTextPlaceholder || "ENTER TEXT"} 
                                className="w-full h-full min-h-[80px] bg-black/[0.04] dark:bg-white/[0.04] border border-black/5 dark:border-white/5 rounded-xl px-4 py-3 text-xs font-black text-black dark:text-white tracking-[0.1em] uppercase focus:border-blue-500/50 outline-none resize-none transition-all placeholder-black/10 dark:placeholder-white/10" 
                            />
                            <div className="absolute bottom-2 right-3 opacity-20 pointer-events-none text-[7px] font-mono uppercase tracking-widest">{(settings.customText || '').length}</div>
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
    );
};
