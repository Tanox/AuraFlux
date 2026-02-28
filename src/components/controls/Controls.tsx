// File: app/components/controls/Controls.tsx | Version: v1.9.73
import React, { useState, useEffect, useMemo } from 'react';
import { VisualSettingsPanel } from './panels/VisualSettingsPanel.tsx';
import { SystemSettingsPanel } from './panels/SystemSettingsPanel.tsx';
import { CustomTextSettingsPanel } from './panels/CustomTextSettingsPanel.tsx';
import { AudioSettingsPanel } from './panels/AudioSettingsPanel.tsx';
import { StudioPanel } from './panels/StudioPanel.tsx';
import { PlaybackPanel } from './panels/PlaybackPanel.tsx';
import { useUI } from '@/src/context/AppContext';
import { BottomBar } from './BottomBar.tsx';

type Tab = 'visual' | 'input' | 'playback' | 'text' | 'studio' | 'system';

export interface ControlsProps {
  isExpanded: boolean;
  setIsExpanded: (val: boolean | ((prev: boolean) => boolean)) => void;
  isIdle: boolean;
  toggleFullscreen: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ isExpanded, setIsExpanded, isIdle, toggleFullscreen }) => {
  const { t } = useUI();
  const [activeTab, setActiveTab] = useState<Tab>('visual');

  const TABS = useMemo<{ id: Tab, label: keyof typeof t.tabs, component: React.ReactNode }[]>(() => [
    { id: 'visual', label: 'visual', component: <VisualSettingsPanel /> },
    { id: 'input', label: 'input', component: <AudioSettingsPanel /> },
    { id: 'playback', label: 'playback', component: <PlaybackPanel /> },
    { id: 'text', label: 'text', component: <CustomTextSettingsPanel /> },
    { id: 'studio', label: 'studio', component: <StudioPanel /> },
    { id: 'system', label: 'system', component: <SystemSettingsPanel /> },
  ], [t]);

  const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.component;

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

      const numKey = parseInt(e.key, 10);
      if (!isNaN(numKey) && numKey >= 1 && numKey <= TABS.length) {
        e.preventDefault();
        setActiveTab(TABS[numKey - 1].id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [TABS]);

  return (
    <>
      <div
        id="controls-expanded-panel"
        className={`fixed inset-x-0 top-0 z-[110] transition-transform duration-500 ease-in-out ${isExpanded ? 'translate-y-0' : '-translate-y-full'}`}
        style={{ pointerEvents: isExpanded ? 'auto' : 'none' }}
      >
        <div id="controls-panel-content" className="max-w-6xl mx-auto p-4 pt-6">
          <div className="bg-white/90 dark:bg-[#0a0a0c]/90 backdrop-blur-2xl border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-fade-in-down">
            <div id="controls-tab-container" className="flex justify-center p-2 bg-black/[0.02] dark:bg-white/[0.02] border-b border-black/5 dark:border-white/5 overflow-x-auto no-scrollbar">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 sm:px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-colors whitespace-nowrap ${activeTab === tab.id ? 'bg-white dark:bg-black/40 text-black dark:text-white' : 'text-black/40 dark:text-white/40 hover:text-black/80 dark:hover:text-white/80'}`}
                >
                  {t.tabs[tab.label]}
                </button>
              ))}
            </div>
            <div id="controls-panel-wrapper" className="p-4 overflow-y-auto custom-scrollbar max-h-[calc(100vh-200px)]">
              {ActiveComponent}
            </div>
          </div>
        </div>
      </div>
      <BottomBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} isIdle={isIdle} toggleFullscreen={toggleFullscreen} />
    </>
  );
};