# Changelog

All notable changes to the **Aura Flux** project will be documented in this file.

## [v1.9.36]

### 🛠️ Dependency Audit & Integrity
*   **Importmap Cleanup**: Removed development-only dependencies (`vite`, `@vitejs/plugin-react`) from the browser runtime `importmap` to prevent potential execution conflicts.
*   **JSX Runtime Mapping**: Added explicit mapping for `react/jsx-runtime` to ensure full compatibility with React 19's new JSX transform in production environments.
*   **Version Consolidation**: Unified all core files (index, App, Context) and metadata to version `v1.9.36`.
*   **SW Refresh**: Incremented Service Worker cache version to force client browsers to re-resolve the cleaned dependency map.

## [v1.9.35]

### 🏗️ Major Refactor & Stability
*   **Gemini SDK Alignment**: Updated `aiService.ts` to strictly follow the latest `@google/genai` coding guidelines.
*   **Importmap Sanitization**: Fixed an invalid JSON error in `index.html`.

## [v1.9.34]
...