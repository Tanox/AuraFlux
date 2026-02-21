// File: app/hooks/usePWA.ts | Version: v1.9.73
import { useState, useEffect, useCallback } from 'react';

export const usePWA = () => {
  // PWA features disabled for preview stability
  return { isInstallable: false, installPwa: () => {} };
};