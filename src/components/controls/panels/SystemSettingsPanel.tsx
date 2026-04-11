// File: src\components\controls\panels\SystemSettingsPanel.tsx | Version: v2.0.6
import React from 'react';
import { SettingsToggle } from '../../visualizers/ui/controls/SettingsToggle';
import { useVisuals, useUI } from '@/context/AppContext';
import { CustomSelect } from '../../visualizers/ui/controls/CustomSelect';
import { SegmentedControl } from '../../visualizers/ui/controls/SegmentedControl';
import { BentoCard } from '../../visualizers/ui/layout/BentoCard';
import { Language } from '../../../types/index';
import { PresetManager } from './system/PresetManager';

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' }, { value: 'zh', label: '简体中文' }, { value: 'zh-TW', label: '繁體中文' },
  { value: 'ja', label: '日本語' }, { value: 'es', label: 'Español' }, { value: 'ko', label: '한국어' },
  { value: 'de', label: 'Deutsch' }, { value: 'fr', label: 'Français' }, { value: 'ru', label: 'Русский' },
  { value: 'ar', label: 'العربية' }, { value: 'pt', label: 'Português' }, { value: 'pt-BR', label: 'Português (Brasil)' }
];

export const SystemSettingsPanel: React.FC = () => {
  const { settings, setSettings } = useVisuals();
  const { t, resetSettings, language, setLanguage, setShowHelpModal, setHelpModalInitialTab } = useUI();

  return (
    <div id="panel-system" className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
      {/* Column 1: Appearance & Interaction (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-3">
        <BentoCard id="panel-system-localization" title={t?.systemPanel?.localization || "Aesthetics & Language"}>
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CustomSelect label={t?.language} value={language} options={LANGUAGES} onChange={(v) => setLanguage(v as Language)} />
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-black/50 dark:text-white/50 uppercase tracking-wider">{t?.systemPanel?.uiMode || "UI Mode"}</label>
                    <SegmentedControl value={settings.uiMode} options={[{ id: 'simple', label: t?.common?.simple || "Simple" }, { id: 'advanced', label: t?.common?.advanced || "Advanced" }]} onChange={(v) => setSettings({...settings, uiMode: v as any})} />
                  </div>
                </div>
                <div className="pt-4 border-t border-black/5 dark:border-white/5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-black/50 dark:text-white/50 uppercase tracking-wider">{t?.styleTheme || "Global Theme"}</label>
                    <SegmentedControl value={settings.appTheme} options={[{ id: 'dark', label: t?.systemPanel?.darkMode || 'Dark' }, { id: 'light', label: t?.systemPanel?.lightMode || 'Light' }]} onChange={(v) => setSettings({...settings, appTheme: v as any})} />
                  </div>
                </div>
            </div>
        </BentoCard>

        <BentoCard id="panel-system-behavior" title={t?.systemPanel?.interface || "System & Behavior"} className="flex-1">
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-[10px] font-black text-black/30 dark:text-white/30 uppercase tracking-widest">{t?.systemPanel?.uiSettings || "Interface"}</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-1 gap-x-6">
                  <SettingsToggle label={t?.showTooltips || "Show Tooltips"} value={settings.showTooltips} onChange={() => setSettings({...settings, showTooltips: !settings.showTooltips})} variant="clean" />
                  <SettingsToggle label={t?.autoHideUi || "Auto Hide UI"} value={settings.autoHideUi} onChange={() => setSettings({...settings, autoHideUi: !settings.autoHideUi})} variant="clean" />
                  <SettingsToggle label={t?.hideCursor || "Hide Cursor"} value={settings.hideCursor} onChange={() => setSettings({...settings, hideCursor: !settings.hideCursor})} variant="clean" />
                  <SettingsToggle label={t?.showPlaybackTab || "Playback Tab"} value={settings.showPlaybackTab !== false} onChange={() => setSettings({...settings, showPlaybackTab: !settings.showPlaybackTab})} variant="clean" />
                  <SettingsToggle label={t?.showStudioTab || "Studio Tab"} value={settings.showStudioTab !== false} onChange={() => setSettings({...settings, showStudioTab: !settings.showStudioTab})} variant="clean" />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5">
                <span className="text-[10px] font-black text-black/30 dark:text-white/30 uppercase tracking-widest">{t?.systemPanel?.interaction || "Interaction"}</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-1 gap-x-6">
                  <SettingsToggle label={t?.doubleClickFullscreen || "Double-Click Fullscreen"} value={!!settings.doubleClickFullscreen} onChange={() => setSettings({...settings, doubleClickFullscreen: !settings.doubleClickFullscreen})} variant="clean" />
                  <SettingsToggle label={t?.wakeLock || "Keep Awake"} value={settings.wakeLock} onChange={() => setSettings({...settings, wakeLock: !settings.wakeLock})} variant="clean" />
                  <SettingsToggle label={t?.mirrorDisplay || "Mirror Display"} value={!!settings.mirrorDisplay} onChange={() => setSettings({...settings, mirrorDisplay: !settings.mirrorDisplay})} variant="clean" />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-black/5 dark:border-white/5">
                <span className="text-[10px] font-black text-black/30 dark:text-white/30 uppercase tracking-widest">{t?.systemPanel?.performance || "Performance"}</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-1 gap-x-6">
                  <SettingsToggle label={t?.showFps || "Show FPS"} value={settings.showFps} onChange={() => setSettings({...settings, showFps: !settings.showFps})} variant="clean" />
                </div>
              </div>
            </div>
        </BentoCard>
      </div>

      {/* Column 2: Information & Data (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-3">
        <BentoCard id="panel-system-resources" title={t?.helpModal?.title || "Project Resources"}>
            <div className="grid grid-cols-3 gap-2">
                <button onClick={() => { setHelpModalInitialTab('guide'); setShowHelpModal(true); }} className="py-2.5 bg-black/[0.04] dark:bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all border border-black/5 dark:border-white/5 flex items-center justify-center gap-2">{t?.helpModal?.tabs?.guide || 'Guide'}</button>
                <button onClick={() => { setHelpModalInitialTab('shortcuts'); setShowHelpModal(true); }} className="py-2.5 bg-black/[0.04] dark:bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all border border-black/5 dark:border-white/5 flex items-center justify-center gap-2">{t?.helpModal?.tabs?.shortcuts || 'Keys'}</button>
                <button onClick={() => { setHelpModalInitialTab('about'); setShowHelpModal(true); }} className="py-2.5 bg-black/[0.04] dark:bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all border border-black/5 dark:border-white/5 flex items-center justify-center gap-2">{t?.helpModal?.tabs?.about || 'About'}</button>
            </div>
        </BentoCard>

        <BentoCard id="panel-system-data" title={t?.config?.title || "Data Management"} className="flex-1">
            <div className="flex flex-col h-full space-y-4">
                <PresetManager />
                <div className="pt-2 mt-auto border-t border-black/5 dark:border-white/5">
                    <button onClick={() => window.confirm(t?.hints?.confirmReset || "Are you sure?") && resetSettings()} className="w-full text-center py-2 bg-red-500/10 text-red-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500/20 hover:text-red-400 transition-all border border-red-500/10">
                        {t?.systemPanel?.factoryReset || 'HARD RESET'}
                    </button>
                </div>
            </div>
        </BentoCard>
      </div>
    </div>
  );
};
