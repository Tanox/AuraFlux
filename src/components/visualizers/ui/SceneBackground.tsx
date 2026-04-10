'use client';

import React from 'react';

interface SceneBackgroundProps {
  enabled: boolean;
  color?: string;
}

const DEFAULT_BACKGROUND_COLORS = {
  DEFAULT: '#000000',
  KINETIC_WALL: '#050505',
} as const;

export const SceneBackground: React.FC<SceneBackgroundProps> = ({ 
  enabled, 
  color = DEFAULT_BACKGROUND_COLORS.DEFAULT 
}) => {
  if (!enabled) return null;
  
  return <color attach="background" args={[color]} />;
};
