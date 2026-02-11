
/**
 * File: components/controls/panels/playback/DisplayConfig.tsx
 * Version: 1.0.0
 * Author: Sut
 * Extracted from PlaybackPanel
 */

import React, { useMemo } from 'react';
import { BentoCard } from '../../../ui/layout/BentoCard';
import { SettingsToggle } from '../../../ui/controls/SettingsToggle';
import { CustomSelect } from '../../../ui/controls/CustomSelect';
import { Slider } from '../../../ui/controls/Slider';
import { useVisuals, useUI } from '../../../AppContext';
import { LyricsStyle, Position } from '../../../../core/types';
import { getPositionOptions } from '../../../../core/constants';

export const DisplayConfig: React.FC = () => {
  const { settings, setSettings } = useVisuals();
  const { t } = useUI();
  
  const lyricsStyles = t?.lyricsStyles || {};
  const positionOptions = useMemo(() => getPositionOptions(t), [t]);

  return (
    <BentoCard title={t?.player?.supportInfo || "Display Architecture"} className="flex-1">
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomSelect label={t?.lyricsStyle} value={settings.lyricsStyle || LyricsStyle.KARAOKE} options={Object.values(LyricsStyle).map(s => ({ value: s, label: lyricsStyles[s] || s }))} onChange={(v) => setSettings({...settings, lyricsStyle: v as LyricsStyle})} />
                <CustomSelect label={t?.lyricsPosition} value={settings.lyricsPosition} options={positionOptions} onChange={(v) => setSettings({ ...settings, lyricsPosition: v as Position })} />
            </div>
            <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <SettingsToggle label={t?.player?.bg || "Art BG"} value={!!settings.albumArtBackground} onChange={() => setSettings(p => ({ ...p, albumArtBackground: !p.albumArtBackground }))} variant="clean" />
                    <SettingsToggle label={t?.player?.cover || "Overlay"} value={settings.showAlbumArtOverlay} onChange={() => setSettings(p => ({ ...p, showAlbumArtOverlay: !p.showAlbumArtOverlay }))} variant="clean" />
                </div>
                {settings.albumArtBackground && <Slider label={t?.player?.blur} value={settings.albumArtBlur ?? 20} min={0} max={60} step={2} onChange={(v) => setSettings({...settings, albumArtBlur: v})} />}
            </div>
        </div>
    </BentoCard>
  );
};
