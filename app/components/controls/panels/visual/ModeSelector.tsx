/**
 * File: app/components/controls/panels/visual/ModeSelector.tsx
 * Version: v1.9.73
 * Author: Sut
 */

import React, { useCallback } from 'react';
import { VisualizerMode } from '../../../../types/index.ts';
import { BentoCard } from '../../../visualizers/ui/layout/BentoCard.tsx';
import { SettingsToggle } from '../../../visualizers/ui/controls/SettingsToggle.tsx';
import { Slider } from '../../../visualizers/ui/controls/Slider.tsx';
import { VisualizerPreview } from '../../panels/VisualizerPreview.tsx';
import { useVisuals, useUI } from '../../../../AppContext.tsx';

export const ModeSelector: React.FC = () => {
  const { mode: currentMode, setMode, settings, setSettings } = useVisuals();
  const { t } = useUI();

  const handleVisualSettingChange = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleIncludeMode = (m: VisualizerMode) => {
      const current = settings.includedModes || Object.values(VisualizerMode);
      if (current.includes(m)) {
          if (current.length > 1) {
              handleVisualSettingChange('includedModes', current.filter(x => x !== m));
          }
      } else {
          handleVisualSettingChange('includedModes', [...current, m]);
      }
  };

  const toggleAllModes = useCallback(() => {
      const all = Object.values(VisualizerMode);
      const current = settings.includedModes || [];
      if (current.length === all.length) {
          handleVisualSettingChange('includedModes', [currentMode]);
      } else {
          handleVisualSettingChange('includedModes', all);
      }
  }, [settings.includedModes, currentMode, setSettings]);

  return (
    <BentoCard 
        id="panel-visual-mode-selector"
        title={t?.visualizerMode || "Visualizer Mode"} 
        className="h-full min-h-[500px]"
        action={
            <div className="flex items-center gap-3">
                <button onClick={toggleAllModes} className="text-[9px] font-black uppercase text-blue-500 hover:text-blue-400 tracking-widest px-2 transition-colors">
                    {(settings.includedModes || []).length === Object.keys(VisualizerMode).length ? 'Unselect All' : 'Select All'}
                </button>
                {settings.autoRotate && (
                    <div className="animate-fade-in-up w-16">
                        <Slider label="" value={settings.rotateInterval || 30} min={5} max={120} step={5} onChange={(v) => handleVisualSettingChange('rotateInterval', v)} unit="s" />
                    </div>
                )}
                <SettingsToggle label="" value={settings.autoRotate} onChange={() => handleVisualSettingChange('autoRotate', !settings.autoRotate)} variant="clean" hintText={t?.hints?.autoRotate} />
            </div>
        }
    >
        <div className="grid grid-cols-2 gap-2.5 pb-2 lg:max-h-[520px] overflow-y-auto custom-scrollbar pr-1.5">
            {Object.values(VisualizerMode).map((mode) => (
                <VisualizerPreview 
                    key={mode} 
                    mode={mode} 
                    name={t?.modes?.[mode as keyof typeof t.modes] || mode} 
                    isActive={currentMode === mode}
                    isIncluded={settings.includedModes ? settings.includedModes.includes(mode) : true}
                    onClick={() => setMode(mode)}
                    onToggleInclude={() => toggleIncludeMode(mode)}
                />
            ))}
        </div>
    </BentoCard>
  );
};