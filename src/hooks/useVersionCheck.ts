// File: src/hooks/useVersionCheck.ts | Version: v1.9.80
import { useEffect } from 'react';

export const useVersionCheck = (currentVersion: string, onUpdate: (newVersion: string) => void) => {
  useEffect(() => {
    const checkVersion = async () => {
      try {
        const response = await fetch('/version.json');
        if (response.ok) {
          const data = await response.json();
          if (data.version && data.version !== currentVersion) {
            onUpdate(data.version);
          }
        }
      } catch (err) {
        // Suppress version check error in preview environment
        console.warn('Version check skipped or failed.');
      }
    };

    // Check every 5 minutes
    const interval = setInterval(checkVersion, 5 * 60 * 1000);
    checkVersion();

    return () => clearInterval(interval);
  }, [currentVersion, onUpdate]);
};
