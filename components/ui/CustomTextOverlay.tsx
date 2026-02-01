/**
 * File: components/ui/CustomTextOverlay.tsx
 * Version: 1.9.4
 * Author: Sut
 * Updated: 2025-07-20 22:10
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { VisualizerSettings, SongInfo } from '../../core/types';
import { useAudioPulse } from '../../core/hooks/useAudioPulse';

interface CustomTextOverlayProps {
  settings: VisualizerSettings;
  analyser: AnalyserNode | null;
  song?: SongInfo | null;
}

const CustomTextOverlay: React.FC<CustomTextOverlayProps> = ({ settings, analyser, song }) => {
  const textRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef(0);
  const lastTimeRef = useRef(0);
  const sizeVw = settings.customTextSize || 12;
  const sizePx = sizeVw * 13; 
  
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    if (settings.textSource === 'CLOCK') {
        const updateTime = () => setTimeString(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }
  }, [settings.textSource]);

  const darkenHex = useCallback((hex: string, amount: number) => {
    if (!hex.startsWith('#')) return hex;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${Math.max(0, r - amount)}, ${Math.max(0, g - amount)}, ${Math.max(0, b - amount)})`;
  }, []);

  const mode = settings.textSource || 'AUTO';
  const isSongMode = mode === 'SONG' || (mode === 'AUTO' && !!(song && (song.title || song.artist) && !song.isError));
  const isClockMode = mode === 'CLOCK';
  
  let mainText = '';
  let subText: string | null | undefined = null;

  if (isClockMode) {
      mainText = timeString;
  } else if (isSongMode) {
      mainText = song?.title || '';
      subText = song?.artist || '';
  } else {
      mainText = settings.customText;
  }

  const hasContent = !!mainText;
  const pulseEnabled = settings.showCustomText && hasContent && settings.textPulse;
  
  useAudioPulse({
    elementRef: textRef,
    analyser,
    settings,
    isEnabled: pulseEnabled,
    baseOpacity: settings.customTextOpacity,
    mode: 'beat', 
    pulseStrength: 0.6, 
    opacityStrength: 0.5
  });
  
  useEffect(() => {
    let rafId: number;
    const calculate3DShadow = (extrusionColor: string) => {
        if (!settings.customText3D) return 'none';
        const scale = sizeVw / 12;
        const depth = Math.max(1, Math.round(6 * scale));
        const shadowSteps = [];
        for (let i = 1; i <= depth; i++) {
            shadowSteps.push(`${i}px ${i}px 0px ${extrusionColor}`);
        }
        shadowSteps.push(`${depth + 1}px ${depth + 1}px ${Math.round(15 * scale)}px rgba(0,0,0,0.8)`);
        return shadowSteps.join(', ');
    };

    const animateColor = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (textRef.current && settings.customTextCycleColor) {
        const interval = settings.customTextCycleInterval || 5; 
        const speed = 360 / Math.max(0.1, interval);
        const delta = (deltaTime / 1000) * speed;
        hueRef.current = (hueRef.current + delta) % 360;
        const faceColor = `hsl(${hueRef.current}, 100%, 65%)`;
        textRef.current.style.color = faceColor;
        if (settings.customText3D) {
            const sideColor = `hsl(${hueRef.current}, 100%, 30%)`;
            textRef.current.style.textShadow = calculate3DShadow(sideColor);
        }
        rafId = requestAnimationFrame(animateColor);
      }
    };

    if (settings.customTextCycleColor) {
      rafId = requestAnimationFrame(animateColor);
    } else if (textRef.current) {
      const baseColor = settings.customTextColor || '#ffffff';
      textRef.current.style.color = baseColor;
      if (settings.customText3D) {
          const sideColor = baseColor.toLowerCase() === '#ffffff' ? '#bbbbbb' : darkenHex(baseColor, 80);
          textRef.current.style.textShadow = calculate3DShadow(sideColor);
      } else {
          textRef.current.style.textShadow = 'none';
      }
      lastTimeRef.current = 0;
    }
    return () => { if (rafId) cancelAnimationFrame(rafId); lastTimeRef.current = 0; };
  }, [settings.customTextCycleColor, settings.customTextColor, settings.customTextCycleInterval, settings.customText3D, sizeVw, darkenHex]);


  if (!settings.showCustomText || !hasContent) return null;

  /**
   * REFINED POSITIONING LOGIC:
   * Instead of using coordinate-based offsets (top-12 etc.) on a fixed inset-0 div,
   * we use Flexbox alignment logic which is far more accurate for center points
   * and handles content sizing variations automatically.
   */
  const getPositionClasses = () => {
      const pos = settings.customTextPosition || 'mc';
      const map: Record<string, string> = {
          tl: 'justify-start items-start text-left',
          tc: 'justify-start items-center text-center',
          tr: 'justify-start items-end text-right',
          ml: 'justify-center items-start text-left',
          mc: 'justify-center items-center text-center',
          mr: 'justify-center items-end text-right',
          bl: 'justify-end items-start text-left',
          bc: 'justify-end items-center text-center',
          br: 'justify-end items-end text-right',
      };
      return map[pos] || map.mc;
  };

  const rotation = settings.customTextRotation || 0;

  return (
    <div className={`pointer-events-none fixed inset-0 z-[100] flex flex-col p-8 md:p-16 ${getPositionClasses()}`}>
      <div 
        ref={textRef} 
        className={`font-black tracking-widest uppercase select-none flex flex-col origin-center transition-opacity duration-300 max-w-full`}
        style={{ 
            color: settings.customTextCycleColor ? undefined : (settings.customTextColor || '#ffffff'),
            fontSize: `min(${sizeVw}vw, ${sizePx}px)`, 
            fontFamily: settings.customTextFont || 'Inter, sans-serif',
            transform: `rotate(${rotation}deg) ${pulseEnabled ? 'scale(var(--pulse-scale, 1))' : ''}`,
            opacity: pulseEnabled ? 'var(--pulse-opacity, 1)' : settings.customTextOpacity,
            lineHeight: 1.1,
            // Sub-text or nested layout shouldn't inherit outer flex align
            textAlign: 'inherit'
        } as React.CSSProperties}
      >
        <span className="whitespace-pre-wrap break-words max-w-[85vw]">{mainText}</span>
        {subText && (
            <span 
                className="font-bold opacity-80 mt-[0.2em] whitespace-nowrap overflow-hidden text-ellipsis max-w-[85vw]"
                style={{ fontSize: '0.4em', lineHeight: 1.2, textShadow: 'none' }}
            >
                {subText}
            </span>
        )}
      </div>
    </div>
  );
};

export default CustomTextOverlay;