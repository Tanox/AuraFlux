// File: src/context/UIContext.tsx | Version: v1.0.0
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Language, Region } from '@/src/types';
import { useAppState } from '@/src/hooks/useAppState';
import { TranslationSchema } from '@/src/locales/index';

export type HelpTab = 'guide' | 'shortcuts' | 'about';

export interface UIContextType {
  language: Language; setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  region: Region; setRegion: React.Dispatch<React.SetStateAction<Region>>;
  hasStarted: boolean; setHasStarted: React.Dispatch<React.SetStateAction<boolean>>;
  resetSettings: () => void;
  manageWakeLock: (enabled: boolean) => Promise<void>;
  toggleFullscreen: () => void; t: TranslationSchema;
  showToast: (message: string, type?: 'success' | 'info' | 'error', duration?: number, position?: 'top' | 'bottom') => void;
  showHelpModal: boolean;
  setShowHelpModal: React.Dispatch<React.SetStateAction<boolean>>;
  helpModalInitialTab: HelpTab;
  setHelpModalInitialTab: React.Dispatch<React.SetStateAction<HelpTab>>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UIContext = createContext<UIContextType | null>(null);
export const useUI = () => useContext(UIContext)!;

export const UIProvider: React.FC<{ children: React.ReactNode; showToast: any }> = ({ children, showToast }) => {
  const uiState = useAppState();

  const toggleFullscreen = useCallback(() => {
    if (typeof document !== 'undefined') {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
        } else {
            if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
        }
    }
  }, []);

  const value = useMemo(() => ({
    ...uiState,
    toggleFullscreen,
    showToast
  }), [uiState, toggleFullscreen, showToast]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};
