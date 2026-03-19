// File: src/context/VisualsContext.tsx | Version: v1.0.0
import React, { createContext, useContext, useMemo } from 'react';
import { VisualizerMode, VisualizerSettings, SmartPreset } from '@/src/types';
import { useVisualsState } from '@/src/hooks/useVisualsState';

export interface VisualsContextType {
  mode: VisualizerMode; setMode: React.Dispatch<React.SetStateAction<VisualizerMode>>;
  colorTheme: string[]; setColorTheme: React.Dispatch<React.SetStateAction<string[]>>;
  settings: VisualizerSettings; setSettings: React.Dispatch<React.SetStateAction<VisualizerSettings>>;
  activePreset: string; setActivePreset: React.Dispatch<React.SetStateAction<string>>;
  isThreeMode: boolean;
  randomizeSettings: () => void; resetVisualSettings: () => void;
  resetTextSettings: () => void; resetAudioSettings: () => void;
  applyPreset: (preset: SmartPreset) => void;
}

export const VisualsContext = createContext<VisualsContextType | null>(null);
export const useVisuals = () => useContext(VisualsContext)!;

export const VisualsProvider: React.FC<{ children: React.ReactNode; hasStarted: boolean }> = ({ children, hasStarted }) => {
  const visualsState = useVisualsState(hasStarted, {} as any);

  const isThreeMode = useMemo(() => {
    return [
      VisualizerMode.DIGITAL_GRID, VisualizerMode.SILK_WAVE,
      VisualizerMode.OCEAN_WAVE, VisualizerMode.NEURAL_FLOW,
      VisualizerMode.CUBE_FIELD, VisualizerMode.KINETIC_WALL,
      VisualizerMode.RESONANCE_ORB, VisualizerMode.VORTEX,
      VisualizerMode.LASERS
    ].includes(visualsState.mode);
  }, [visualsState.mode]);

  const value = useMemo(() => ({ ...visualsState, isThreeMode }), [visualsState, isThreeMode]);

  return <VisualsContext.Provider value={value}>{children}</VisualsContext.Provider>;
};
