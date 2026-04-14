/**
 * File: src/components/performance/WebVitals.tsx
 * Version: v1.0.0
 */

'use client';

import { useEffect } from 'react';
import { onLCP, onINP, onFCP, onCLS, onTTFB } from 'web-vitals';

interface WebVitalsProps {
  reportMetric?: (metric: any) => void;
}

export const WebVitals = ({ reportMetric }: WebVitalsProps) => {
  useEffect(() => {
    const handleMetric = (metric: any) => {
      console.log('Web Vitals Metric:', metric);
      if (reportMetric) {
        reportMetric(metric);
      }
    };

    onLCP(handleMetric);
    onINP(handleMetric);
    onFCP(handleMetric);
    onCLS(handleMetric);
    onTTFB(handleMetric);
  }, [reportMetric]);

  return null;
};