'use client';

// src/components/controls/visual/ModeSpecificSettings.tsx v2.3.8
import React from 'react';
import { BentoCard } from '../../visualizers/ui/layout/BentoCard';
import { Slider } from '../../visualizers/ui/controls/Slider';
import { SettingsToggle } from '../../visualizers/ui/controls/SettingsToggle';
import { SegmentedControl } from '../../visualizers/ui/controls/SegmentedControl';
import { useVisuals, useUI } from '@/context/AppContext';
import { VisualizerMode } from '@/types';

export const ModeSpecificSettings: React.FC = () => {
  const { mode, settings, setSettings, activePreset, setActivePreset } = useVisuals();
  const { t } = useUI();

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setActivePreset('');
  };

  const renderModeSpecificSettings = () => {
    switch (mode) {
      case VisualizerMode.BARS:
        return (
          <div className="space-y-4">
            <Slider 
              label="Bar Count" 
              value={settings.barCount || 24} 
              min={8} 
              max={48} 
              step={1} 
              onChange={(v) => handleSettingChange('barCount', v)} 
            />
            <Slider 
              label="Bar Width" 
              value={settings.barWidth || 3.0} 
              min={1.0} 
              max={5.0} 
              step={0.1} 
              onChange={(v) => handleSettingChange('barWidth', v)} 
            />
            <SettingsToggle 
              label="Gradient Bars" 
              value={settings.gradientBars !== false} 
              onChange={() => handleSettingChange('gradientBars', !(settings.gradientBars !== false))} 
            />
          </div>
        );
      
      case VisualizerMode.WAVEFORM:
        return (
          <div className="space-y-4">
            <Slider 
              label="Particle Count" 
              value={settings.particleCount || 500} 
              min={100} 
              max={1000} 
              step={50} 
              onChange={(v) => handleSettingChange('particleCount', v)} 
            />
            <Slider 
              label="Particle Size" 
              value={settings.particleSize || 3} 
              min={1} 
              max={5} 
              step={0.1} 
              onChange={(v) => handleSettingChange('particleSize', v)} 
            />
            <SettingsToggle 
              label="Trails" 
              value={settings.trails !== false} 
              onChange={() => handleSettingChange('trails', !(settings.trails !== false))} 
            />
            <SettingsToggle 
              label="Glow" 
              value={settings.glow !== false} 
              onChange={() => handleSettingChange('glow', !(settings.glow !== false))} 
            />
          </div>
        );
      
      case VisualizerMode.TUNNEL:
        return (
          <div className="space-y-4">
            <Slider 
              label="Ring Count" 
              value={settings.ringCount || 20} 
              min={10} 
              max={40} 
              step={1} 
              onChange={(v) => handleSettingChange('ringCount', v)} 
            />
            <Slider 
              label="Tunnel Speed" 
              value={settings.tunnelSpeed || 2.0} 
              min={0.5} 
              max={5.0} 
              step={0.1} 
              onChange={(v) => handleSettingChange('tunnelSpeed', v)} 
            />
            <SettingsToggle 
              label="Glow" 
              value={settings.glow !== false} 
              onChange={() => handleSettingChange('glow', !(settings.glow !== false))} 
            />
          </div>
        );
      
      case VisualizerMode.PLASMA:
        return (
          <div className="space-y-4">
            <Slider 
              label="Particle Count" 
              value={settings.plasmaParticleCount || 12} 
              min={3} 
              max={20} 
              step={1} 
              onChange={(v) => handleSettingChange('plasmaParticleCount', v)} 
            />
            <Slider 
              label="Particle Size" 
              value={settings.plasmaParticleSize || 20} 
              min={10} 
              max={50} 
              step={1} 
              onChange={(v) => handleSettingChange('plasmaParticleSize', v)} 
            />
            <SettingsToggle 
              label="Fusion Effects" 
              value={settings.fusionEffects !== false} 
              onChange={() => handleSettingChange('fusionEffects', !(settings.fusionEffects !== false))} 
            />
            <SettingsToggle 
              label="Fullscreen Glow" 
              value={settings.fullscreenGlow !== false} 
              onChange={() => handleSettingChange('fullscreenGlow', !(settings.fullscreenGlow !== false))} 
            />
          </div>
        );
      
      case VisualizerMode.OCEAN_WAVE:
        return (
          <div className="space-y-4">
            <Slider 
              label="Particle Count" 
              value={settings.oceanParticleCount || 1024} 
              min={256} 
              max={4096} 
              step={256} 
              onChange={(v) => handleSettingChange('oceanParticleCount', v)} 
            />
            <Slider 
              label="Wave Intensity" 
              value={settings.waveIntensity || 1.5} 
              min={0.5} 
              max={3.0} 
              step={0.1} 
              onChange={(v) => handleSettingChange('waveIntensity', v)} 
            />
            <Slider 
              label="Horizontal Motion" 
              value={settings.horizontalMotion || 3.0} 
              min={0.0} 
              max={5.0} 
              step={0.1} 
              onChange={(v) => handleSettingChange('horizontalMotion', v)} 
            />
          </div>
        );
      
      case VisualizerMode.LASERS:
        return (
          <div className="space-y-4">
            <Slider 
              label="Laser Count" 
              value={settings.laserCount || 64} 
              min={16} 
              max={128} 
              step={8} 
              onChange={(v) => handleSettingChange('laserCount', v)} 
            />
            <Slider 
              label="Laser Length" 
              value={settings.laserLength || 1.0} 
              min={0.5} 
              max={2.0} 
              step={0.1} 
              onChange={(v) => handleSettingChange('laserLength', v)} 
            />
            <Slider 
              label="Flicker Intensity" 
              value={settings.flickerIntensity || 1.0} 
              min={0.0} 
              max={2.0} 
              step={0.1} 
              onChange={(v) => handleSettingChange('flickerIntensity', v)} 
            />
          </div>
        );
      
      case VisualizerMode.KINETIC_WALL:
        return (
          <div className="space-y-4">
            <Slider 
              label="Cube Count" 
              value={settings.cubeCount || 256} 
              min={64} 
              max={512} 
              step={32} 
              onChange={(v) => handleSettingChange('cubeCount', v)} 
            />
            <Slider 
              label="Cube Size" 
              value={settings.cubeSize || 3.0} 
              min={1.0} 
              max={5.0} 
              step={0.1} 
              onChange={(v) => handleSettingChange('cubeSize', v)} 
            />
            <Slider 
              label="Spacing" 
              value={settings.cubeSpacing || 4.5} 
              min={2.0} 
              max={8.0} 
              step={0.1} 
              onChange={(v) => handleSettingChange('cubeSpacing', v)} 
            />
          </div>
        );
      
      case VisualizerMode.NEURAL_FLOW:
        return (
          <div className="space-y-4">
            <Slider 
              label="Particle Count" 
              value={settings.neuralParticleCount || 8000} 
              min={2000} 
              max={20000} 
              step={2000} 
              onChange={(v) => handleSettingChange('neuralParticleCount', v)} 
            />
            <Slider 
              label="Flow Speed" 
              value={settings.flowSpeed || 1.0} 
              min={0.1} 
              max={3.0} 
              step={0.1} 
              onChange={(v) => handleSettingChange('flowSpeed', v)} 
            />
            <Slider 
              label="Particle Size" 
              value={settings.neuralParticleSize || 1.0} 
              min={0.5} 
              max={2.0} 
              step={0.1} 
              onChange={(v) => handleSettingChange('neuralParticleSize', v)} 
            />
          </div>
        );
      
      case VisualizerMode.CUBE_FIELD:
        return (
          <div className="space-y-4">
            <Slider 
              label="Cube Count" 
              value={settings.cubeFieldCount || 800} 
              min={200} 
              max={2000} 
              step={100} 
              onChange={(v) => handleSettingChange('cubeFieldCount', v)} 
            />
            <Slider 
              label="Cube Size" 
              value={settings.cubeFieldSize || 1.0} 
              min={0.5} 
              max={2.0} 
              step={0.1} 
              onChange={(v) => handleSettingChange('cubeFieldSize', v)} 
            />
            <Slider 
              label="Speed" 
              value={settings.cubeFieldSpeed || 4.5} 
              min={1.0} 
              max={10.0} 
              step={0.1} 
              onChange={(v) => handleSettingChange('cubeFieldSpeed', v)} 
            />
          </div>
        );
      
      case VisualizerMode.FISH_SWARM:
        return (
          <div className="space-y-4">
            <Slider 
              label="Max Particle Count" 
              value={settings.fishSwarmMaxParticles || 2000} 
              min={500} 
              max={3000} 
              step={100} 
              onChange={(v) => handleSettingChange('fishSwarmMaxParticles', v)} 
            />
            <Slider 
              label="Cohesion Strength" 
              value={settings.fishSwarmCohesion || 0.03} 
              min={0.01} 
              max={0.05} 
              step={0.001} 
              onChange={(v) => handleSettingChange('fishSwarmCohesion', v)} 
            />
            <Slider 
              label="Separation Distance" 
              value={settings.fishSwarmSeparation || 8} 
              min={4} 
              max={16} 
              step={0.5} 
              onChange={(v) => handleSettingChange('fishSwarmSeparation', v)} 
            />
            <Slider 
              label="Alignment Strength" 
              value={settings.fishSwarmAlignment || 0.08} 
              min={0.04} 
              max={0.12} 
              step={0.001} 
              onChange={(v) => handleSettingChange('fishSwarmAlignment', v)} 
            />
            <Slider 
              label="Trail Length" 
              value={settings.fishSwarmTrailLength || 10} 
              min={5} 
              max={20} 
              step={1} 
              onChange={(v) => handleSettingChange('fishSwarmTrailLength', v)} 
            />
            <Slider 
              label="Color Response" 
              value={settings.fishSwarmColorResponse || 1.0} 
              min={0.5} 
              max={2.0} 
              step={0.1} 
              onChange={(v) => handleSettingChange('fishSwarmColorResponse', v)} 
            />
          </div>
        );
      
      default:
        return (
          <div className="text-center text-gray-500">
            No specific settings for this mode
          </div>
        );
    }
  };

  return (
    <BentoCard 
      title="Mode Specific Settings"
    >
      {renderModeSpecificSettings()}
    </BentoCard>
  );
};