// File: src\hooks\useVersionCheck.ts | Version: v2.2.23
import { useEffect } from 'react';

const normalizeVersion = (v: string) => v.replace(/^v/, '');

const isNewer = (newV: string, oldV: string) => {
    const n = normalizeVersion(newV).split('.').map(Number);
    const o = normalizeVersion(oldV).split('.').map(Number);
    for (let i = 0; i < Math.max(n.length, o.length); i++) {
        if ((n[i] || 0) > (o[i] || 0)) return true;
        if ((n[i] || 0) < (o[i] || 0)) return false;
    }
    return false;
};

export const useVersionCheck = (currentVersion: string, onUpdate: (newVersion: string) => void) => {
  useEffect(() => {
    const checkVersion = async () => {
      try {
        const response = await fetch('/version.json');
        if (response.ok) {
          const data = await response.json();
          if (data.version && isNewer(data.version, currentVersion)) {
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

