/**
 * File: src/components/controls/panels/studio/ArmedVisualizer.tsx
 * Version: v1.9.80
 */

import React, { useEffect, useRef } from 'react';
import { getAverage } from '../../../../services/audioUtils';

interface Props {
  analyser: AnalyserNode | null;
}

export const ArmedVisualizer: React.FC<Props> = ({ analyser }) => {
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!analyser) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    let animFrameId: number;

    const render = () => {
      analyser.getByteFrequencyData(data);
      const bass = getAverage(data, 0, 10) / 255;
      const mid = getAverage(data, 20, 80) / 255;

      barsRef.current.forEach((bar, i) => {
        if (bar) {
          const level = (i < 4) ? bass : mid;
          bar.style.transform = `rotate(${i * 30}deg) translateY(-60px) scaleY(${Math.max(0.1, level * 2.5)})`;
        }
      });
      animFrameId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animFrameId);
  }, [analyser]);

  return (
    <div className="armed-visualizer-container">
      <div className="w-48 h-48 relative">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="armed-bar"
            ref={el => { barsRef.current[i] = el; }}
          />
        ))}
      </div>
    </div>
  );
};
