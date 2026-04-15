/**
 * File: src/components/performance/WebVitals.tsx
 * Version: v1.0.0
 */

'use client';

import { useEffect } from 'react';

interface WebVitalsProps {
  reportMetric?: (metric: any) => void;
}

export const WebVitals = ({ reportMetric }: WebVitalsProps) => {
  useEffect(() => {
    const loadWebVitals = async () => {
      try {
        const { onLCP, onINP, onFCP, onCLS, onTTFB } = await import('web-vitals');
        
        const handleMetric = (metric: any) => {
          if (reportMetric) {
            reportMetric(metric);
          }
        };

        onLCP(handleMetric);
        onINP(handleMetric);
        onFCP(handleMetric);
        onCLS(handleMetric);
        onTTFB(handleMetric);
      } catch (error) {
        // Web Vitals loading error - handled silently
      }
    };

    loadWebVitals();
  }, [reportMetric]);

  return null;
};