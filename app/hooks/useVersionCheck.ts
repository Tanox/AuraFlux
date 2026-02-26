// File: app/hooks/useVersionCheck.ts | Version: v1.9.74
import { useEffect, useRef } from 'react';

interface VersionData {
  version: string;
}

/**
 * Hook to periodically check for application updates.
 * @param currentVersion The version currently running in the client.
 * @param onUpdate Callback triggered when a new version is detected.
 */
export const useVersionCheck = (currentVersion: string, onUpdate: (newVersion: string) => void) => {
  const checkInterval = 1000 * 60 * 5; // 5 minutes
  const timerRef = useRef<number | null>(null);

  const checkVersion = async () => {
    try {
      // Add a timestamp to bust cache
      const response = await fetch(`/version.json?t=${Date.now()}`);
      if (!response.ok) return;
      
      const data: VersionData = await response.json();
      
      if (data.version && data.version !== currentVersion) {
        onUpdate(data.version);
        // Stop checking once an update is found
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    } catch (error) {
      console.warn('[VersionCheck] Failed to fetch version metadata:', error);
    }
  };

  useEffect(() => {
    // Initial check after a short delay
    const initialTimer = window.setTimeout(checkVersion, 10000);
    
    // Periodic check
    timerRef.current = window.setInterval(checkVersion, checkInterval);

    return () => {
      window.clearTimeout(initialTimer);
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [currentVersion]);
};
