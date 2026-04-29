'use client';

import React, { useMemo, useCallback } from 'react';
import { useVisuals, useUI } from '@/context/AppContext';
import { BentoCard } from '@components/visualizers/ui/layout/BentoCard';
import { SettingsToggle } from '@/components/visualizers/ui/controls/SettingsToggle';
import { Slider } from '@/components/visualizers/ui/controls/Slider';
import { CustomSelect } from '@/components/visualizers/ui/controls/CustomSelect';
import { FONTS } from '@/constants/index';

export const TextStyleSettings: React.FC = React.memo(() => {
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

    const currentFont = useMemo(() => settings.customTextFont || 'Inter, sans-serif', [settings.customTextFont]);
    const isPresetFont = useMemo(() => localizedFonts.some(f => f.value !== 'custom' && f.value === currentFont), [localizedFonts, currentFont]);
    const selectValue = useMemo(() => isPresetFont ? currentFont : 'custom', [isPresetFont, currentFont]);

    const handleFontChange = useCallback((v: string) => {
        if (v === 'custom') {
            if (isPresetFont) {
                setSettings(prev => ({...prev, customTextFont: 'Arial, sans-serif'}));
            }
        } else {
            setSettings(prev => ({...prev, customTextFont: v}));
        }
    }, [isPresetFont, setSettings]);

    const handleCustomFontChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSettings(prev => ({...prev, customTextFont: e.target.value}));
    }, [setSettings]);

    const handleSizeChange = useCallback((v: number) => {
        setSettings(prev => ({...prev, customTextSize: v}));
    }, [setSettings]);

    const handleOpacityChange = useCallback((v: number) => {
        setSettings(prev => ({...prev, customTextOpacity: v}));
    }, [setSettings]);

    const handleRotationChange = useCallback((v: number) => {
        setSettings(prev => ({...prev, customTextRotation: v}));
    }, [setSettings]);

    const handleTogglePulse = useCallback(() => {
        setSettings(prev => ({...prev, textPulse: !prev.textPulse}));
    }, [setSettings]);

    const handleToggle3D = useCallback(() => {
        setSettings(prev => ({...prev, customText3D: !prev.customText3D}));
    }, [setSettings]);

    return (
        <BentoCard id="panel-text-style" title={t?.('textPanel.appearance') || "Style & Typography"} className="flex-1">
            <div className="space-y-5">
                <div className="space-y-4">
                    <CustomSelect label={t?.('textFont') || "Font"} value={selectValue} options={localizedFonts} onChange={handleFontChange} />
                    {selectValue === 'custom' && (
                        <div className="animate-fade-in-up">
                            <input 
                                type="text"
                                value={currentFont}
                                onChange={handleCustomFontChange}
                                placeholder={t?.('hints.enterLocalFont') || "e.g. Arial, Helvetica"}
                                className="w-full bg-black/[0.04] dark:bg-white/[0.04] border border-black/5 dark:border-white/5 rounded-xl px-3 py-2 text-[10px] text-black dark:text-white placeholder-black/20 dark:placeholder-white/20 focus:border-blue-500/50 outline-none font-mono"
                            />
                        </div>
                    )}
                </div>

                <div className="pt-3 border-t border-black/5 dark:border-white/5 grid gap-4">
                    <Slider label={t?.('textSize') || "Size"} value={settings.customTextSize ?? 12} min={2} max={60} step={1} onChange={handleSizeChange} />
                    <Slider label={t?.('visualPanel.opacity') || "Opacity"} value={settings.customTextOpacity ?? 0.5} min={0} max={1} step={0.05} onChange={handleOpacityChange} />
                    <Slider label={t?.('textRotation') || "Rotation"} value={settings.customTextRotation ?? 0} min={-180} max={180} step={5} onChange={handleRotationChange} unit="掳" />
                </div>

                <div className="pt-3 border-t border-black/5 dark:border-white/5 grid grid-cols-2 gap-3">
                    <SettingsToggle label={t?.('textAudioReactive') || "Pulse"} value={settings.textPulse} onChange={handleTogglePulse} variant="clean" activeColor="blue" />
                    <SettingsToggle label={t?.('text3D') || "3D"} value={!!settings.customText3D} onChange={handleToggle3D} variant="clean" activeColor="blue" />
                </div>
            </div>
        </BentoCard>
    );
});

TextStyleSettings.displayName = 'TextStyleSettings';
