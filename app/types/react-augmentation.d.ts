/**
 * File: app/types/react-augmentation.d.ts
 * Version: v1.9.72
 * Author: Sut
 */

import React from 'react';

// Define the React Three Fiber (R3F) elements interface
// These are strictly for the Main Thread UI layer.
interface R3FElements {
  mesh: any;
  pointLight: any;
  spotLight: any;
  ambientLight: any;
  group: any;
  primitive: any;
  meshPhysicalMaterial: any;
  meshStandardMaterial: any;
  rectAreaLight: any;
  color: any;
  fog: any;
  directionalLight: any;
  points: any;
  bufferGeometry: any;
  bufferAttribute: any;
  instancedBufferAttribute: any; // Added for instanced scenes
  shaderMaterial: any;
  instancedMesh: any;
  boxGeometry: any;
  planeGeometry: any; // Explicitly adding planeGeometry
  [elemName: string]: any;
}

// Augment the global JSX namespace with R3F elements.
declare global {
  namespace JSX {
    interface IntrinsicElements extends R3FElements {}
  }
  
  // Extend Window interface for jsmediatags loaded via script tag
  interface Window {
    jsmediatags: {
      read: (file: File | Blob | string, callbacks: {
        onSuccess: (tag: any) => void;
        onError: (error: any) => void;
      }) => void;
    };
  }
}

// Augment React.JSX namespace for newer Typescript/React versions
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements extends R3FElements {}
  }
}