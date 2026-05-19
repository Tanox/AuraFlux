'use client';

// src/components/controls/Controls.tsx v2.3.11

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { VisualSettingsPanel } from './panels/VisualSettingsPanel';
import { SystemSettingsPanel } from './panels/SystemSettingsPanel';
import { CustomTextSettingsPanel } from './panels/CustomTextSettingsPanel';
import { AudioSettingsPanel } from './panels/AudioSettingsPanel';
import { StudioPanel } from './panels/StudioPanel';
import { PlaybackPanel } from './panels/PlaybackPanel';
import { useUI, useVisuals } from '@/context/AppContext';
import { BottomBar } from './BottomBar';

type Tab = 'visual' | 'input' | 'playback' | 'text' | 'studio' | 'system';

export interface ControlsProps {
  isExpanded: boolean;
  setIsExpanded: (val: boolean | ((prev: boolean) => boolean)) => void;
  isIdle: boolean;
  toggleFullscreen: () => void;
}

const Controls: React.FC<ControlsProps> = ({ isExpanded, setIsExpanded, isIdle, toggleFullscreen }) => {
  const { t } = useUI();
  const { randomizeSettings, settings } = useVisuals();
  const [activeTab, setActiveTab] = useState<Tab>('visual');

  const TABS = useMemo(() => {
    const tabs: { id: Tab; label: Tab; component: React.ReactNode }[] = [
      { id: 'visual', label: 'visual', component: <VisualSettingsPanel /> },
      { id: 'input', label: 'input', component: <AudioSettingsPanel /> },
      { id: 'playback', label: 'playback', component: <PlaybackPanel /> },
      { id: 'text', label: 'text', component: <CustomTextSettingsPanel /> },
      { id: 'studio', label: 'studio', component: <StudioPanel /> },
      { id: 'system', label: 'system', component: <SystemSettingsPanel /> },
    ];

    return tabs.filter(tab => {
      if (tab.id === 'playback' && settings.showPlaybackTab === false) return false;
      if (tab.id === 'studio' && settings.showStudioTab === false) return false;
      return true;
    });
  }, [settings.showPlaybackTab, settings.showStudioTab]);

  const ActiveComponent = TABS.find(tab => tab.id === activeTab)?.component;

  const handleKeyDown = useCallback((e: globalThis.KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

    if (e.key.toLowerCase() === 'r') {
      e.preventDefault();
      randomizeSettings();
      return;
    }

    const numKey = parseInt(e.key, 10);
    if (!isNaN(numKey) && numKey >= 1 && numKey <= TABS.length) {
      e.preventDefault();
      setActiveTab(TABS[numKey - 1].id);
    }
  }, [TABS, randomizeSettings]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <div
        id="controls-expanded-panel"
        className={`fixed inset-x-0 bottom-24 z-[110] transition-all duration-500 ease-in-out ${isExpanded ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ pointerEvents: isExpanded ? 'auto' : 'none', display: isExpanded ? 'block' : 'none' }}
      >
        <div id="controls-panel-content" className="panel-container">
          <div className="panel-content">
            <div id="controls-tab-container" className="panel-tabs">
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`panel-${tab.id}`}
                  className={`px-4 sm:px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white dark:bg-black/40 text-black dark:text-white shadow-md' : 'text-black/40 dark:text-white/40 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                  {t(`tabs.${tab.label}`)}
                </button>
              ))}
            </div>
            <div 
              id="controls-panel-wrapper" 
              className="panel-body"
              role="tabpanel"
              aria-labelledby={`tab-${activeTab}`}
            >
              {ActiveComponent}
            </div>
          </div>
        </div>
      </div>
      <BottomBar isExpanded={isExpanded} setIsExpanded={setIsExpanded} isIdle={isIdle} toggleFullscreen={toggleFullscreen} />
    </>
  );
};

export default Controls;
