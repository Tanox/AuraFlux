'use client';
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { IcosahedronGeometry, BufferAttribute, DoubleSide, MeshPhysicalMaterial, Mesh } from 'three';
import { VisualizerSettings } from '@/types/index';

interface ReactiveSphereProps {
    settings: VisualizerSettings;
    colors: string[];
    features: {
        bass: number;
        treble: number;
        volume: number;
        isBeat: boolean;
    };
    smoothedColors: string[];
}

export const ReactiveSphere: React.FC<ReactiveSphereProps> = ({ settings, colors, features, smoothedColors }) => {
    const meshRef = useRef<Mesh>(null);
    const materialRef = useRef<MeshPhysicalMaterial>(null);
    const [c0, c1] = smoothedColors;

    const geometry = useMemo(() => {
        let detail = 1;
        if (settings.quality === 'med') detail = 2;
        if (settings.quality === 'high') detail = 3;
        return new IcosahedronGeometry(4, detail);
    }, [settings.quality]);

    const originalPositions = useMemo(() => {
        const pos = geometry.attributes.position;
        const count = pos.count;
        const array = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            array[i * 3] = pos.getX(i);
            array[i * 3 + 1] = pos.getY(i);
            array[i * 3 + 2] = pos.getZ(i);
        }
        return array;
    }, [geometry]);

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime() * settings.speed * 0.4;
        const { bass, treble, volume, isBeat } = features;

        if (materialRef.current) {
            materialRef.current.color.set(c0);
            materialRef.current.emissive.set(c1);

            const beatFlash = isBeat ? 2.5 : 0;
            const currentEmissive = materialRef.current.emissiveIntensity;
            const targetEmissive = 0.2 + bass * 1.5 + beatFlash;
            materialRef.current.emissiveIntensity = targetEmissive * 0.15 + currentEmissive * 0.85; // Manual lerp
        }

        if (meshRef.current) {
            meshRef.current.rotation.x = time * 0.1;
            meshRef.current.rotation.y = time * 0.15;

            const positionAttribute = meshRef.current.geometry.attributes.position as BufferAttribute;
            const vertex = new Float32Array(3);

            for (let i = 0; i < positionAttribute.count; i++) {
                const x = originalPositions[i * 3];
                const y = originalPositions[i * 3 + 1];
                const z = originalPositions[i * 3 + 2];

                // Apply audio reactive displacement
                const displacement = (bass * 0.5 + treble * 0.3 + volume * 0.2) * settings.sensitivity * 0.5;
                const noise = Math.sin(x * 0.8 + time * 0.5) * 0.1 + Math.cos(y * 0.7 + time * 0.6) * 0.1;
                const pulse = Math.sin(x * 1.2 + y * 1.2 + z * 1.2 + time * 5.0) * 0.1;

                vertex[0] = x * (1 + displacement + noise * 0.5 + pulse * 0.3);
                vertex[1] = y * (1 + displacement + noise * 0.5 + pulse * 0.3);
                vertex[2] = z * (1 + displacement + noise * 0.5 + pulse * 0.3);

                positionAttribute.setXYZ(i, vertex[0], vertex[1], vertex[2]);
            }
            positionAttribute.needsUpdate = true;
            meshRef.current.geometry.computeVertexNormals();
        }
    });

    return (
        <mesh ref={meshRef} geometry={geometry}>
            <meshPhysicalMaterial
                ref={materialRef}
                color={c0}
                metalness={0.9}
                roughness={0.1}
                clearcoat={1}
                clearcoatRoughness={0.1}
                emissive={c1}
                emissiveIntensity={0.2}
                reflectivity={0.8}
                side={DoubleSide}
            />
        </mesh>
    );
};
