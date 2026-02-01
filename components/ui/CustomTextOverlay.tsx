/**
 * File: components/ui/CustomTextOverlay.tsx
 * Version: 1.8.70
 * Author: Sut
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

  // Utility to darken hex colors for the 3D side effect
  const darkenHex = useCallback((hex: string, amount: number) => {
    if (!hex.startsWith('#')) return hex;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${Math.max(0, r - amount)}, ${Math.max(0, g - amount)}, ${Math.max(0, b - amount)})`;
  }, []);

  // Priority Logic based on textSource setting
  let isSongMode = false;
  let isClockMode = false;
  const mode = settings.textSource || 'AUTO';

  if (mode === 'SONG') {
      isSongMode = true;
  } else if (mode === 'CLOCK') {
      isClockMode = true;
  } else if (mode === 'CUSTOM') {
      isSongMode = false;
  } else {
      isSongMode = !!(song && (song.title || song.artist) && !song.isError);
  }
  
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
        
        // Depth scales with text size: default 12vw yields ~6px depth
        const scale = sizeVw / 12;
        const depth = Math.max(1, Math.round(6 * scale));
        const shadowSteps = [];
        
        // Solid extrusion layers
        for (let i = 1; i <= depth; i++) {
            shadowSteps.push(`${i}px ${i}px 0px ${extrusionColor}`);
        }
        
        // Deep ambient shadow for "lift" effect
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
        
        // 3D Extrusion using the same hue but darker
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
          // Dynamic darkening for fixed colors
          const sideColor = baseColor.toLowerCase() === '#ffffff' ? '#bbbbbb' : darkenHex(baseColor, 80);
          textRef.current.style.textShadow = calculate3DShadow(sideColor);
      } else {
          textRef.current.style.textShadow = 'none';
      }
      lastTimeRef.current = 0;
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      lastTimeRef.current = 0;
    };
  }, [settings.customTextCycleColor, settings.customTextColor, settings.customTextCycleInterval, settings.customText3D, sizeVw, darkenHex]);


  if (!settings.showCustomText || !hasContent) return null;

  const getPositionClasses = () => {
      const pos = settings.customTextPosition || 'mc';
      const map: Record<string, string> = {
          tl: 'top-12 left-12 items-start',
          tc: 'top-12 left-1/2 -translate-x-1/2 items-center',
          tr: 'top-12 right-12 items-end',
          ml: 'top-1/2 left-12 -translate-y-1/2 items-start',
          mc: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center',
          mr: 'top-1/2 right-12 -translate-y-1/2 items-end',
          bl: 'bottom-12 left-12 items-start',
          bc: 'bottom-12 left-1/2 -translate-x-1/2 items-center',
          br: 'bottom-12 right-12 items-end',
      };
      return map[pos] || map.mc;
  };

  const alignClass = settings.customTextPosition?.includes('l') 
    ? 'items-start text-left' 
    : (settings.customTextPosition?.includes('r') ? 'items-end text-right' : 'items-center text-center');

  const rotation = settings.customTextRotation || 0;

  return (
    <div className={`pointer-events-none fixed inset-0 z-[100] flex flex-col ${getPositionClasses()}`}>
      <div 
        ref={textRef} 
        className={`font-black tracking-widest uppercase select-none flex flex-col justify-center origin-center transition-opacity duration-300 ${alignClass}`}
        style={{ 
            color: settings.customTextCycleColor ? undefined : (settings.customTextColor || '#ffffff'),
            fontSize: `min(${sizeVw}vw, ${sizePx}px)`, 
            fontFamily: settings.customTextFont || 'Inter, sans-serif',
            transform: `rotate(${rotation}deg) ${pulseEnabled ? 'scale(var(--pulse-scale, 1))' : ''}`,
            opacity: pulseEnabled ? 'var(--pulse-opacity, 1)' : settings.customTextOpacity,
            lineHeight: 1.1,
        } as React.CSSProperties}
      >
        <span className="whitespace-pre-wrap break-words max-w-[80vw]">{mainText}</span>
        {subText && (
            <span 
                className="font-bold opacity-80 mt-[0.2em] whitespace-nowrap overflow-hidden text-ellipsis max-w-[80vw]"
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