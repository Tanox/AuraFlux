# Changelog

All notable changes to the **Aura Flux** project will be documented in this file.

## [v1.9.10] - 2025-02-14

### 🔧 Stability & Reliability
*   **Audio Engine**: Resolved critical `Uncaught TypeError` in 3D scenes by fixing array resizing logic in `useAudioReactive`. Newly added slots in the color interpolation array are now properly initialized with `THREE.Color` objects.
*   **UI Assets**: Fixed SVG syntax error in `BottomBar` that caused browser console warnings about trailing garbage in the `viewBox` attribute.
*   **Versioning**: Synchronized global versioning to 1.9.10.

## [v1.9.9] - 2025-02-14

### 🔧 Stability & Reliability
*   **Audio Engine**: Fixed critical `Uncaught TypeError` in 3D scenes by hardening `useAudioReactive` with defensive null/empty checks for color themes and audio analysers.
*   **Service Worker**: Re-engineered the installation phase in `sw.js` to be fault-tolerant. 404 errors on non-critical assets (like favicon) will no longer block application caching.
*   **Render Pipeline**: Added safety guards in `ThreeVisualizer` to prevent rendering attempts with incomplete visual data.

## [v1.9.8] - 2025-02-14

### 🚀 Features
*   **Update System**: Implemented a real-time application update notification. Users will now see a sleek visual prompt when a new version of Aura Flux is available for deployment.
*   **Refined UX**: Added automatic cache flushing and session reload logic for seamless version transitions.

## [v1.9.7] - 2025-02-14

### 🔧 Fixes & Refinement
*   **Dependencies**: Resolved critical `ERESOLVE` dependency tree conflict between `@react-three/fiber` v9 and `@react-three/postprocessing` using npm overrides.
*   **Runtime**: Fixed `react/jsx-runtime` resolution error by updating the browser `importmap`.
*   **Infrastructure**: Global version synchronization across all documentation and source files.
