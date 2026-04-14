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
          if (process.env.NODE_ENV !== 'production') {
            console.log('Web Vitals Metric:', metric);
          }
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
        if (process.env.NODE_ENV !== 'production') {
          console.error('Failed to load web-vitals:', error);
        }
      }
    };

    loadWebVitals();
  }, [reportMetric]);

  return null;
};