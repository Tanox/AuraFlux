// File: /src/hooks/useAudioPulse.ts | Version: v2.2.22
import { useEffect, useRef } from 'react';

interface AudioPulseProps {
  elementRef: React.RefObject<HTMLElement | null>;
  analyser: AnalyserNode | null;
  settings: any;
  isEnabled: boolean;
  pulseStrength?: number;
  opacityStrength?: number;
  baseOpacity?: number;
}

export const useAudioPulse = ({
  elementRef,
  analyser,
  settings,
  isEnabled,
  pulseStrength = 0.1,
  opacityStrength = 0,
  baseOpacity = 1.0
}: AudioPulseProps) => {
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isEnabled || !analyser || !elementRef.current) {
      if (elementRef.current) {
        elementRef.current.style.transform = 'scale(1)';
        elementRef.current.style.opacity = `${baseOpacity}`;
      }
      return;
    }

    if (!dataArrayRef.current) {
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
    }

    const animate = () => {
      if (!analyser || !elementRef.current || !dataArrayRef.current) return;

      analyser.getByteFrequencyData(dataArrayRef.current as any);
      
      // Calculate bass volume (low frequencies)
      let sum = 0;
      const bassCount = Math.floor(dataArrayRef.current.length * 0.1);
      for (let i = 0; i < bassCount; i++) {
        sum += dataArrayRef.current[i];
      }
      const average = sum / bassCount / 255; // 0-1
      
      const sensitivity = settings?.sensitivity || 1.0;
      const scale = 1 + (average * pulseStrength * sensitivity);
      const opacity = baseOpacity + (average * opacityStrength * sensitivity);

      elementRef.current.style.transform = `scale(${scale})`;
      if (opacityStrength !== 0) {
        elementRef.current.style.opacity = `${Math.min(1, opacity)}`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    const element = elementRef.current;
    animate();

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (element) {
        element.style.transform = 'scale(1)';
        element.style.opacity = `${baseOpacity}`;
      }
    };
  }, [analyser, isEnabled, pulseStrength, opacityStrength, baseOpacity, settings, elementRef]);
};

