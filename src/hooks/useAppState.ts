// File: src/hooks/useAppState.ts | Version: v1.9.80
import { useState, useCallback, useMemo } from 'react';
import { Language, Region } from '../types';
import { TRANSLATIONS } from '../locales';

export const useAppState = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [region, setRegion] = useState<Region>('US');
  const [hasStarted, setHasStarted] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [helpModalInitialTab, setHelpModalInitialTab] = useState<'guide' | 'shortcuts' | 'about'>('guide');
  const [isDragging, setIsDragging] = useState(false);

  const t = useMemo(() => TRANSLATIONS[language] || TRANSLATIONS.en, [language]);

  const resetSettings = useCallback(() => {
    localStorage.clear();
    window.location.reload();
  }, []);

  const manageWakeLock = useCallback(async (enabled: boolean) => {
    if (typeof window !== 'undefined' && 'wakeLock' in navigator) {
      try {
        if (enabled) {
          await (navigator as any).wakeLock.request('screen');
        }
      } catch (err: any) {
        if (err.name !== 'NotAllowedError') {
          console.warn('Wake Lock error:', err);
        }
      }
    }
  }, []);

  return {
    language, setLanguage,
    region, setRegion,
    hasStarted, setHasStarted,
    showHelpModal, setShowHelpModal,
    helpModalInitialTab, setHelpModalInitialTab,
    isDragging, setIsDragging,
    t,
    resetSettings,
    manageWakeLock
  };
};
