'use client';
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PointLight, RectAreaLight } from 'three';
import { VisualizerSettings } from '@/src/types/index';

interface SceneLightingProps {
    settings: VisualizerSettings;
    features: {
        bass: number;
        treble: number;
        volume: number;
    };
    smoothedColors: string[];
}

export const SceneLighting: React.FC<SceneLightingProps> = ({ settings, features, smoothedColors }) => {
    const light1Ref = useRef<PointLight>(null);
    const light2Ref = useRef<PointLight>(null);
    const light3Ref = useRef<PointLight>(null);
    const rectLightRef = useRef<RectAreaLight>(null);
    const [c0, c1, c2] = smoothedColors;

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime() * settings.speed * 0.4;
        const { bass, treble, volume } = features;

        if (light1Ref.current) {
            light1Ref.current.color.set(c0);
            light1Ref.current.position.x = Math.sin(time * 0.5) * 20;
            light1Ref.current.position.z = Math.cos(time * 0.5) * 20;
            light1Ref.current.intensity = 15 + bass * 50;
        }
        if (light2Ref.current) {
            light2Ref.current.color.set(c1);
            light2Ref.current.position.y = Math.cos(time * 0.7) * 20;
            light2Ref.current.intensity = 10 + volume * 40;
        }
        if (light3Ref.current) {
            light3Ref.current.color.set(c2 || c0);
            light3Ref.current.position.x = Math.cos(time * 0.3) * -15;
            light3Ref.current.intensity = 5 + treble * 30;
        }
        if (rectLightRef.current) {
            rectLightRef.current.intensity = 5 + treble * 40;
            rectLightRef.current.lookAt(0, 0, 0);
        }
    });

    return (
        <>
            <ambientLight intensity={0.2} />
            <pointLight ref={light1Ref} position={[20, 10, 0]} intensity={20} distance={50} decay={2} />
            <pointLight ref={light2Ref} position={[-20, -10, 0]} intensity={15} distance={50} decay={2} />
            <pointLight ref={light3Ref} position={[0, 0, 15]} intensity={10} distance={40} decay={2} />
            <rectAreaLight ref={rectLightRef} position={[0, 0, 10]} width={20} height={20} intensity={10} color={c0} />
        </>
    );
};
