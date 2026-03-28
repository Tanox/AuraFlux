import React from 'react';
import { useVisuals, useUI } from '@/context/AppContext';
import { BentoCard } from '@/components/visualizers/ui/layout/BentoCard';
import { SettingsToggle } from '@/components/visualizers/ui/controls/SettingsToggle';
import { Slider } from '@/components/visualizers/ui/controls/Slider';

export const TextChromaSettings: React.FC = () => {
    const { settings, setSettings } = useVisuals();
    const { t } = useUI();
    const colorPresets = ['#ffffff', '#64748b', '#f87171', '#facc15', '#22c55e', '#00e5ff', '#3b82f6', '#8b5cf6', '#ff007f'];

    return (
        <BentoCard id="panel-text-chroma" title={t?.customColor || "Dynamic Chroma"} className="flex-1">
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
    );
};
