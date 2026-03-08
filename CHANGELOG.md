# Changelog

All notable changes to the **Aura Flux** project will be documented in this file.

## [v2.0.3]
### 🐛 Bug Fixes
*   **Visualizer Modes**: Fixed an issue where the `PLASMA` (等离子流), `NEBULA` (宇宙星云), and `RINGS` (共振环) visualizer modes were not displaying. Implemented these modes in the 2D `VisualizerCanvas` engine.

## [v2.0.2]
### 🎨 Visuals
*   **Background**: Removed the shared fixed particle background (`<Stars>`) from all 3D visualizer modes for a cleaner look.

## [v2.0.1]
### 🐛 Bug Fixes
*   **Laser Visualizer**: Fixed a bug where the "Laser Beams" mode was not displaying by implementing the `LaserScene` 3D component and integrating it into the `ThreeVisualizer` switch logic and `AppContext` mode classification.

## [v2.0.0]
### 🚀 Major Refactoring & Documentation
*   **Documentation Consolidation**: Merged the legacy `docs/` directory into the `openspec/` directory to establish a single, unified source of truth for all project specifications and guides.
*   **Code Optimization**: Refactored large visualizer components (`SilkWaveScene`, `VortexScene`, `NeuralFlowScene`, `DigitalGridScene`) by extracting complex inline shaders and logic into dedicated files and hooks, significantly reducing file size and improving maintainability.
*   **Version Synchronization**: Updated all version strings to `v2.0.0`.

## [v1.10.7]
### 📝 Documentation & Refactoring
*   **Documentation Consolidation**: Merged the legacy `docs/` directory into the `openspec/` directory to establish a single, unified source of truth for all project specifications and guides.
*   **Code Optimization**: Refactored large visualizer components (`SilkWaveScene`, `VortexScene`, `NeuralFlowScene`, `DigitalGridScene`) by extracting complex inline shaders and logic into dedicated files and hooks, significantly reducing file size and improving maintainability.
*   **Version Synchronization**: Updated all version strings to `v1.10.7`.

## [v1.10.6]
### 🐛 Bug Fixes
*   **Error Handling**: Fixed an issue where `FileReader` errors were being logged as raw Event objects (`{ "isTrusted": true }`), obscuring the actual error message.
*   **Version Synchronization**: Updated all version strings to `v1.10.6`.

## [v1.10.5]
### 🌍 Internationalization & Code Quality
*   **L10n Synchronization**: Completed and synchronized all 12 language translations (en, zh, tw, es, ar, fr, pt, pt-BR, de, ja, ko, ru).
*   **Translation Standard**: Standardized the location of `tabs` in all locale files for better maintainability.
*   **Bug Fix**: Resolved a React Hook dependency warning in the `Tooltip` component.
*   **Version Synchronization**: Updated all version strings to `v1.10.5`.

## [v1.10.4]
### 🐛 Bug Fixes & 🛠️ UI Refinements
*   **Randomization Engine**: Fixed a bug where the randomization button only affected sensitivity and speed. It now correctly randomizes the **Visualizer Mode**, **Color Theme**, **Glow**, and **Trails** for a truly dynamic experience.
*   **Version Synchronization**: Updated all version strings to `v1.10.4` across the system.

## [v1.10.3]
### 🛠️ UI & Layout Refinements
*   **Panel Re-balancing**: Reorganized the **Visual Settings** tab for a more balanced and scannable layout.
*   **System Panel Categorization**: Grouped system toggles into *Interface*, *Interaction*, and *Performance* categories.
*   **Performance Optimization**: Implemented `useMemo` across all core state hooks to resolve re-render loops.
*   **Localization**: Added missing translation keys for new panel headers.

## [v1.9.87]
### 🛠️ UI & Notification Improvements
*   **Auto-Dismissing Notifications**: Implemented a configurable duration for Toast notifications.
*   **Version Update Logic**: Set the "New version available" notification to automatically disappear after 10 seconds, improving user experience by reducing persistent UI clutter.

## [v1.9.86]
### 🔄 Next.js Optimization & Audit
*   **Gemini Model Upgrade**: Updated `aiService.ts` to use `gemini-3-flash-preview` for text tasks, providing faster and more accurate audio analysis and song identification.
*   **Layout Hardening**: Finalized the transition to Next.js 15 App Router patterns, ensuring all components are correctly optimized for the new architecture.
*   **UI Consistency**: Standardized all settings panels to a unified 12-column grid layout for a perfectly aligned and professional interface.
*   **Code Quality**: Performed a project-wide audit to ensure no legacy React-only patterns remain and all file headers are accurate.

## [v1.9.85]
### 📝 Documentation
*   **Changelog Consolidation**: Merged legacy `changelog.md` entries into `CHANGELOG.md` and removed the redundant file to maintain a single source of truth.
*   **Version Synchronization**: Updated all version strings to `v1.9.85`.

## [v1.9.84]
### 🛠️ Viewport & Layout Hardening
*   **Mobile Viewport Fix**: Updated `App.tsx` root container to use `h-[100dvh]` instead of `h-screen`. This solves layout issues on mobile browsers where the address bar would cut off the bottom of the application.
*   **Three.js Container**: Updated `ThreeVisualizer.tsx` to use `absolute inset-0` and forced `width: 100%; height: 100%` on the Canvas element to prevent 3D scenes from shrinking or overflowing.
*   **2D Canvas Sizing**: Added explicit inline styles `width: 100%; height: 100%` to `VisualizerCanvas.tsx` to ensure CSS dimensions always match the parent container, regardless of internal resolution scaling.

## [v1.9.83]
### 🐛 Bug Fixes
*   **Update Notification Loop**: Fixed a bug where the update notification would persist indefinitely due to a hardcoded version string mismatch in `App.tsx`.
*   **Version Normalization**: Implemented `normalizeVersion` in `useVersionCheck` to robustly handle version strings with or without the 'v' prefix.
*   **Constants**: Introduced `src/constants/version.ts` to centralize version management and prevent future mismatches.

## [v1.9.82]
### 🛠️ Layout & Canvas Hardening
*   **Full-Screen Reliability**: Changed `app-root` from `h-full min-h-screen` to `h-screen w-screen` to ensure absolute viewport coverage across all browsers.
*   **Canvas Sizing**: Updated `VisualizerCanvas.tsx` to use `ResizeObserver` on its parent container instead of itself, and set the canvas to `absolute inset-0`. This ensures the internal resolution perfectly matches the parent's content area.
*   **Global Styles**: Added `width: 100%` to `html`, `body`, `#root`, and `#__next` in `globals.css`.
*   **Version Synchronization**: Updated all version strings to `v1.9.82`.

## [v1.9.81]
### 🛠️ Robustness & Layout Fix
*   **Module Resolution**: Removed all `.ts` and `.tsx` extensions from relative imports across the entire `src/` directory to resolve Next.js chunk loading failures and "Cannot find module" errors.
*   **Layout Rendering**: Fixed a critical CSS issue where the visualizer display area was collapsed to a small strip. Added `height: 100%` to `html`, `body`, `#root`, and `#__next` in `globals.css`, and ensured the visualizer container uses `w-full h-full`.
*   **Canvas Optimization**: Replaced the legacy `window.resize` listener with `ResizeObserver` in `VisualizerCanvas.tsx` for more reliable and performant canvas resizing.
*   **Metadata**: Added `metadataBase` to Next.js metadata in `layout.tsx` for correct SEO and OpenGraph URL resolution.
*   **Version Synchronization**: Updated all version strings to `v1.9.81` across `metadata.json`, `layout.tsx`, and `openspec/` documentation.

## [v1.9.80]
### 🔄 Version Synchronization
*   **Global Update**: Executed a project-wide audit to synchronize all version numbers to `v1.9.80`, including file headers, `metadata.json`, `layout.tsx`, and all documentation.
*   **i18n Maintenance**: Updated all 12 language files to reflect the latest system version and ensured string parity across all modules.

## [v1.9.73]
### ✨ New Features & Optimization
*   **New Visualizer**: Introduced the **Gravitational Vortex** (`VortexScene.tsx`), a high-fidelity 3D particle visualizer with swirling gravitational distortion effects.
*   **Asset Optimization**: Removed the legacy `app/assets/` directory and consolidated all static assets into the `public/` directory, adhering to the project's architectural specifications.
*   **System Synchronization**: Executed a project-wide audit to synchronize all version numbers to `v1.9.73`, including file headers, `package.json`, `README` files, and all `openspec/` documentation.
*   **Code Integrity Audit**: Performed a comprehensive audit of the codebase, confirming the removal of the legacy `app/assets` directory and the absence of redundant commented-out code blocks. Verified that the `app/styles/` directory is integral to the application's styling pipeline.


## [v1.9.71]
### 🛡️ Deployment & Dependency Fix
*   **Production Hardening**: Cleaned the production `index.html` import map to remove all development-only dependencies (e.g., `vite`) and conflicting `react-dom` entries, ensuring a stable and consistent production build.
*   **Version Synchronization**: Executed a comprehensive project-wide audit to synchronize all version numbers to a consistent `v1.9.71`, ensuring code, documentation, and build configurations are in complete alignment.

## [v1.9.70]
### 🛡️ Deployment & Dependency Fix
*   **Critical Dependency Upgrade**: Upgraded `@react-three/postprocessing` to `v2.17.0` to resolve a peer dependency conflict with **React 19**, fixing `npm install` failures during deployment.
*   **Version Synchronization**: Executed a comprehensive project-wide audit to synchronize all version numbers to a consistent `v1.9.70`.
*   **Robustness Hardening**: Cleaned the production `index.html` import map to remove all development-only dependencies and conflicting entries, ensuring a stable and consistent production build.

## [v1.9.69]
### 🛠️ System Integrity Fix & Audit
*   **Version Synchronization**: Executed a comprehensive project-wide audit to synchronize all version numbers to a consistent `v1.9.69`.
*   **Component Restoration**: Restored full functional code for `PlaylistManager.tsx` and re-implemented the `SilkWaveScene.tsx` 3D visualizer, which were previously placeholder files.
*   **Code Quality**: Replaced a hard-coded version string in `SystemSettingsPanel.tsx` with the `APP_VERSION` constant for improved maintainability.

## [v1.9.68]
### 🛠️ System Integrity Fix & Audit
*   **Module Path Resolution**: Corrected all remaining extensionless relative imports for the `types` module (primarily in 3D scenes and UI panels), ensuring full native browser ES module compatibility.
*   **Version Synchronization**: Executed a comprehensive project-wide audit to synchronize all version numbers to a consistent `v1.9.68`, including all file headers, `package.json`, `README` files, and `openspec/` documentation.
*   **Component Restoration**: Restored the full functional code for `SystemSettingsPanel.tsx` and `PlaylistManager.tsx`, which were previously placeholder files.
*   **Robustness Hardening**: Cleaned the production `index.html` import map to remove all development-only dependencies and redundant entries.

## [v1.9.66]
### ⚙️ Maintenance
*   **Version Synchronization**: Executed a project-wide audit to synchronize all version numbers to `v1.9.66`. This includes file headers, `package.json`, `README` files, all `openspec/` documentation, and internal i18n version constants.
*   **Robustness Hardening**: Cleaned the production `index.html` import map to remove development-only dependencies and conflicting `react-dom` entries, ensuring a stable and consistent production build.

## [v1.9.65]
### 🛠️ System Integrity Fix
*   **Restore Missing Files**: Recreated all 12 missing internationalization (i18n) language files to prevent application bootstrap failure.
*   **Module Path Resolution**: Corrected all extensionless relative imports across the entire codebase by adding `.ts` or `.tsx` extensions, ensuring native browser ES module compatibility.
*   **Version & Spec Synchronization**: Synchronized all file headers, `package.json`, `README`, and `openspec/` documentation to a consistent `v1.9.65`, reflecting a full system audit.
*   **Robustness Hardening**: Cleaned the production `index.html` import map by removing all development-only dependencies.

## [v1.9.64]
### 🛡️ System Audit
*   **i18n Integrity**: Audited all 11 language files against the English source to ensure complete key alignment. Synchronized internal version numbers across all locales.
*   **Robustness**: Hardened the application by removing development-only dependencies from the production `index.html` import map.
*   **OpenSpec Sync**: Audited and synchronized all `openspec/*.md` documentation files to version `v1.9.64`, ensuring code and specifications are in complete alignment.

## [v1.9.63]
### 🐛 Bug Fixes
*   **Module Resolution**: Corrected all extensionless imports for the `types` module (e.g., `from '../types'`) to explicit paths (`from '../types/index.ts'`) to ensure compatibility with native browser ES module resolution via import maps.
*   **Import Map**: Removed development-only dependencies (`vite`, `@vitejs/plugin-react`) and redundant entries from the `index.html` import map.

## [v1.0.1]
### 🐛 Bug Fixes & ✨ Features
*   **Tailwind CSS**: Fixed `@apply` syntax error for Tailwind CSS v4.
*   **Dependencies**: Removed invalid `tw-animate-css` dependency.
*   **i18n**: Added basic support for internationalization.
*   **Robustness**: Added Error Boundary and Not Found handling.
*   **Documentation**: Synchronized project specifications to openspec documents.
*   **Versioning**: Updated version header comments in all code files.

## [v1.0.0]
### 🎉 Initial Release
*   **Project Setup**: Initialized Next.js project structure.