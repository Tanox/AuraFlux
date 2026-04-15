'use client';
// File: src\components\visualizers\ui\FPSCounter.tsx | Version: v2.2.23
import React, { useState, useEffect } from 'react';

export const FPSCounter: React.FC = () => {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let requestId: number;

    const loop = (time: number) => {
      frameCount++;
      if (time - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (time - lastTime)));
        frameCount = 0;
        lastTime = time;
      }
      requestId = requestAnimationFrame(loop);
    };

    requestId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestId);
  }, []);

  return (
    <div id="fps-counter" className="fixed top-4 right-4 z-[60] bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-mono text-green-400 border border-white/10 pointer-events-none">
      {fps} FPS
    </div>
  );
};

