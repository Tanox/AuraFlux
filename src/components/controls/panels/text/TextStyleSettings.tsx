'use client';

import React, { useMemo } from 'react';
import { useVisuals, useUI } from '@/context/AppContext';
import { BentoCard } from '@/components/visualizers/ui/layout/BentoCard';
import { SettingsToggle } from '@/components/visualizers/ui/controls/SettingsToggle';
import { Slider } from '@/components/visualizers/ui/controls/Slider';
import { CustomSelect } from '@/components/visualizers/ui/controls/CustomSelect';
import { FONTS } from '@/constants/index';

export const TextStyleSettings: React.FC = () => {
    const { settings, setSettings } = useVisuals();
    const { t } = useUI();
    const localizedFonts = useMemo(() => {
        const fonts = FONTS.map(font => ({
            value: font,
            label: t?.(`common.fonts.${font}`) || font
        }));
        return [
            ...fonts,
            { value: 'custom', label: 'Custom' }
        ];
    }, [t]);

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
        <BentoCard id="panel-text-style" title={t?.textPanel?.appearance || "Style & Typography"} className="flex-1">
            <div className="space-y-5">
                <div className="space-y-4">
                    <CustomSelect label={t?.textFont || "Font"} value={selectValue} options={localizedFonts} onChange={handleFontChange} />
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
                    <Slider label={t?.textSize || "Size"} value={settings.customTextSize ?? 12} min={2} max={60} step={1} onChange={(v) => setSettings({...settings, customTextSize: v})} />
                    <Slider label={t?.visualPanel?.opacity || "Opacity"} value={settings.customTextOpacity ?? 0.5} min={0} max={1} step={0.05} onChange={(v) => setSettings({...settings, customTextOpacity: v})} />
                    <Slider label={t?.textRotation || "Rotation"} value={settings.customTextRotation ?? 0} min={-180} max={180} step={5} onChange={(v) => setSettings({...settings, customTextRotation: v})} unit="°" />
                </div>

                <div className="pt-3 border-t border-black/5 dark:border-white/5 grid grid-cols-2 gap-3">
                    <SettingsToggle label={t?.textAudioReactive || "Pulse"} value={settings.textPulse} onChange={() => setSettings({...settings, textPulse: !settings.textPulse})} variant="clean" activeColor="blue" />
                    <SettingsToggle label={t?.text3D || "3D"} value={!!settings.customText3D} onChange={() => setSettings({...settings, customText3D: !settings.customText3D})} variant="clean" activeColor="blue" />
                </div>
            </div>
        </BentoCard>
    );
};
