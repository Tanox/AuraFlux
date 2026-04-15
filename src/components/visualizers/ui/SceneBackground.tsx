'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color } from 'three';

export interface SceneBackgroundProps {
  enabled: boolean;
  color?: string;
  gradient?: {
    colors: string[];
    stops?: number[];
  };
  dynamic?: {
    enabled: boolean;
    speed?: number;
    colors: string[];
  };
}

const DEFAULT_BACKGROUND_COLORS = {
  DEFAULT: '#000000',
  KINETIC_WALL: '#050505',
} as const;

export const SceneBackground: React.FC<SceneBackgroundProps> = ({ 
  enabled, 
  color = DEFAULT_BACKGROUND_COLORS.DEFAULT,
  gradient,
  dynamic
}) => {
  if (!enabled) return null;

  const shaderMaterialRef = useRef<any>(null);

  useFrame((state) => {
    if (shaderMaterialRef.current) {
      shaderMaterialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  if (dynamic?.enabled && dynamic.colors.length > 0) {
    return (
      <group>
        <color attach="background" args={[color]} />
        <shaderMaterial
          ref={shaderMaterialRef}
          attach="background"
          uniforms={{
            uTime: { value: 0 },
            uColors: {
              value: dynamic.colors.map(c => new Color(c))
            },
            uSpeed: { value: dynamic.speed || 1.0 }
          }}
          vertexShader={`
            void main() {
              gl_Position = vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform float uTime;
            uniform vec3 uColors[4];
            uniform float uSpeed;

            void main() {
              float t = mod(uTime * uSpeed, 1.0);
              int numColors = 4;
              
              vec3 color1, color2;
              float mixFactor;
              
              if (t < 1.0 / numColors) {
                color1 = uColors[0];
                color2 = uColors[1];
                mixFactor = t * numColors;
              } else if (t < 2.0 / numColors) {
                color1 = uColors[1];
                color2 = uColors[2];
                mixFactor = (t - 1.0 / numColors) * numColors;
              } else if (t < 3.0 / numColors) {
                color1 = uColors[2];
                color2 = uColors[3];
                mixFactor = (t - 2.0 / numColors) * numColors;
              } else {
                color1 = uColors[3];
                color2 = uColors[0];
                mixFactor = (t - 3.0 / numColors) * numColors;
              }
              
              vec3 finalColor = mix(color1, color2, mixFactor);
              gl_FragColor = vec4(finalColor, 1.0);
            }
          `}
        />
      </group>
    );
  }

  if (gradient?.colors && gradient.colors.length > 1) {
    const stops = gradient.stops || gradient.colors.map((_, i) => i / (gradient.colors.length - 1));
    return (
      <group>
        {gradient.colors.map((c, i) => (
          <color 
            key={i} 
            attach="background" 
            args={[c]}
            opacity={stops[i] || 1.0}
          />
        ))}
      </group>
    );
  }

  return <color attach="background" args={[color]} />;
};
