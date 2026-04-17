# Changelog

All notable changes to the **Aura Flux** project will be documented in this file.

## [v2.3.2]
### ‚ú?Version Update & Validation
- Êõ¥Êñ∞Â§öÂõΩËØ≠Ë®ÄÊîØÊåÅÁªìÊûÑÔºåËß£ÂÜ≥ÁøªËØëÁº∫Â§±ÈóÆÈ¢ò„Ä?- ÊµãËØïÂíå‰ºòÂåñÁ®≥ÂÆöÊÄß„Ä?- ÂêåÊ≠•ÂºÄÊ∫êÊñáÊ°?openspec)„Ä?- ÈÄíÂ¢ûÂπ∂ËßÑËåÉÊâÄÊúâÊ®°ÂùóÁâàÊú¨Âè∑Ëá?v2.3.2„Ä?
## [v2.3.0]
### ‚ú?Version Update
- **Version Synchronization**: Updated all project files to version v2.3.0
- **Documentation**: Updated all specification documents in the spec/ directory
- **Metadata**: Updated metadata.json and package.json with the new version
- **Layout**: Updated the HTML title in src/app/layout.tsx
- **Constants**: Updated version constants in src/constants/
- **Locales**: Updated all language files in src/locales/
- **README**: Updated README.md and README_ZH.md with the new version

## [v2.2.25]
### ‚ú?Visualization Enhancements
- **Plasma Mode**: Implemented advanced color system with dynamic color changes, audio-reactive intensity, and color mixing during particle fusion
- **Plasma Mode**: Added 3D visual effects with perspective projection, depth sorting, and near/far size effects
- **Plasma Mode**: Optimized performance with object pooling for particles and fusion effects, reduced Canvas state switching, and optimized drawing loop
- **Plasma Mode**: Updated version to v2.2.25

## [v2.2.24]
### ‚ú?Visualization Enhancements
- **Plasma Mode**: Implemented audio-responsive particle count adjustment (3-5 particles for low energy, 6-8 for medium, 9-12 for high energy)
- **Plasma Mode**: Extended particle parameter array to support up to 12 particles
- **Plasma Mode**: Updated version to v2.2.24

## [v2.2.22]
### ‚ú?Version Update
- **Version Synchronization**: Updated all project files to version v2.2.22
- **Documentation**: Updated all specification documents in the spec/ directory
- **Metadata**: Updated metadata.json and package.json with the new version
- **Layout**: Updated the HTML title in src/app/layout.tsx
- **Constants**: Updated version constants in src/constants/
- **Locales**: Updated all language files in src/locales/
- **README**: Updated README.md and README_ZH.md with the new version

## [v2.2.19]
### üóëÔ∏?Removal
- **Vortex Mode**: Removed the vortex visualization mode

### ‚ú?Visualization Enhancements
- **Waveform Mode**: Added new waveform visualization mode with gradient coloring and smooth rendering
- **Waveform Mode**: Implemented audio-reactive waveform display with sensitivity control

### üé® UI Improvements
- **Visualizer Mode Selector**: Fixed the selected mode border display issue by removing overflow-hidden and ensuring complete border visibility

## [v2.2.18]
### ‚ú?Visualization Enhancements
- **Bars Mode**: Updated bar count to 24 bars for cleaner visualization
- **Bars Mode**: Enhanced color scheme to synchronize with theme colors and implement height-based color variation
- **Bars Mode**: Added gradient effect from base to tip for more dynamic visual impact

## [v2.2.17]
### ‚ú?Visualization Enhancements
- **Bars Mode**: Reduced bar count to 24 bars for cleaner visualization
- **Bars Mode**: Implemented height-based colorÂèòÂåñ from green (low) to red (high)

## [v2.2.16]
### üêõ Bug Fixes
- **Portuguese Localization**: Fixed character encoding issues in Portuguese language file, correcting 'Intelig√™ncia' and 'Sinest√©sica' display

## [v2.2.15]
### ‚ú?Version Update
- **Version Synchronization**: Updated all project files to version v2.2.15
- **Documentation**: Updated all specification documents in the spec/ directory
- **Metadata**: Updated metadata.json and package.json with the new version
- **Layout**: Updated the HTML title in src/app/layout.tsx
- **Constants**: Updated version constants in src/constants/
- **Locales**: Updated all language files in src/locales/
- **README**: Updated README.md and README_ZH.md with the new version

## [v2.2.13]
### üêõ Bug Fixes
- **Build Fix**: Added missing `VORTEX` mode to the `VisualizerMode` enum to resolve TypeScript build errors

## [v2.2.14]
### ‚ú?Visualization Enhancements
- **Plasma Mode**: Dramatically increased glow effects by 10x, creating full-screenÂÖâÊôï coverage with enhanced particle trails and background illumination
- **Starfield Mode**: Enhanced with brightness variation, stronger audio reactivity, and improved glow effects
- **Starfield Mode**: Added center pulse effect and optimized particle movement

## [v2.2.13]
### üêõ Bug Fixes
- **Plasma Mode**: Fixed particle parameter array out-of-bounds issue by using modulo operation to ensure safe access

## [v2.2.12]
### ‚ú?Visualization Enhancements
- **Ocean Mode**: Doubled initial gain from 75% to 150% and adjusted initial position to be fixed at canvas bottom for more impactful visual effect

## [v2.2.11]
### üêõ Bug Fixes
- **Visualization Mode Cycle**: Fixed the auto-rotate functionality for visualization modes, ensuring that enabled modes cycle correctly based on the specified interval

### ‚ú?Visualization Enhancements
- **Plasma Mode**: Enhanced with more complex random motion patterns, stronger audio reactivity, particle trails, and improved glow effects

## [v2.2.10]
### ‚ú?Visualization Enhancements
- **Plasma Mode**: Restored to five glowing particles with random motion, enhanced with audio-reactive behavior

## [v2.2.9]
### ‚ú?Visualization Enhancements
- **Color Themes**: Optimized color schemes by replacing dim colors with more vibrant alternatives while preserving theme identities. Updated Ocean, Forest, Aurora, Cosmic, Desert, Sakura, Forest Dusk, Deep Sea, Lava, and Mint themes with brighter, more vivid color palettes

### üé® UI Improvements
- **Settings Panel**: Moved the settings options UI from the top to the bottom of the canvas, positioned above the mini toolbar to avoidÈÅÆÊå° (obstruction)

## [v2.2.8]
### ‚ú?Visualization Enhancements
- **Color Themes**: Added 12 new color themes, expanding the total to 18 themes. New themes include: Aurora, Fire, Cosmic, Desert, Sakura, Neon Glow, Forest Dusk, Deep Sea, Lava, Mint, Amethyst, and Sunset Beach

## [v2.2.7]
### üóëÔ∏?Removal
- **Vortex Mode**: Removed the vortex visualization mode

### ‚ú?Visualization Enhancements
- **Ocean Mode**: Confirmed curve lines default height is fixed at canvas bottom
- **Bars Mode**: Reduced bar count by 60% (to 40% of original) and increased bar width to 300% for more impactful visualization

## [v2.2.6]
### ‚ú?Visualization Enhancements
- **Bars Mode**: Adjusted bar count to 50% of original for balanced visualization

## [v2.2.5]
### ‚ú?Visualization Enhancements
- **Bars Mode**: Reduced bar count to 30% of original for cleaner visualization

## [v2.2.4]
### ‚ú?Visualization Enhancements
- **Ocean Mode**: Further reduced curve lines height to 10% of original and renamed to "Êµ∑Ê¥ã" (Ocean)
- **Localization**: Updated all translation files to use the new name "Êµ∑Ê¥ã" for Ocean Wave mode

## [v2.2.3]
### üóëÔ∏?Removal
- **Vortex Mode**: Removed the vortex visualization mode

## [v2.2.2]
### ‚ú?Visualization Enhancements
- **Ocean Mode**: Further reduced curve lines height to 20% for more natural appearance

## [v2.2.1]
### ‚ú?Visualization Enhancements
- **Silk Wave Mode**: Further thickened lines by 3-5x, reduced amplitude to 50%, and improved smoothness
- **Ocean Mode**: Optimized curve lines to be fixed at canvas bottom and reduced height to 30% for more natural appearance

## [v2.1.1]
### ‚ú?Version Update
- **Version Synchronization**: Updated all project files to version v2.1.1
- **Documentation**: Updated all specification documents in the spec/ directory
- **Metadata**: Updated metadata.json and package.json with the new version
- **Layout**: Updated the HTML title in src/app/layout.tsx
- **Constants**: Updated version constants in src/constants/
- **Locales**: Updated all language files in src/locales/
### üêõ Bug Fixes
*   **Localization Fix**: Added safe default for missing `studioPanel.formats` property in localization files, preventing "Cannot read properties of undefined (reading 'vp9')" error.
*   **Version Consistency**: Unified version numbers across all files to v2.1.1.

## [v2.0.7]
### üêõ Bug Fixes
*   **Build Fix**: Added missing `WAVEFORM` and `VORTEX` modes to the `VisualizerMode` enum to resolve TypeScript build errors.

## [v2.0.5]
### ‚ú?System Updates & Documentation
*   **i18n Integrity**: Checked and ensured all internationalization language files are complete and consistent.
*   **Robustness Testing**: Verified application robustness by successfully starting the development server.
*   **Documentation Update**: Updated README.md and README_ZH.md with the latest version information.
*   **OpenSpec Sync**: Synchronized code functionality details to the spec documentation, including updated visualization modes and directory structure.
*   **Version Synchronization**: Updated all files to version v2.0.5, ensuring consistency across the project.

## [v1.9.73]
### ‚ú?New Features & Optimization
*   **New Visualizer**: Introduced the **Gravitational Vortex** (`VortexScene.tsx`), a high-fidelity 3D particle visualizer with swirling gravitational distortion effects.
*   **Asset Optimization**: Removed the legacy `app/assets/` directory and consolidated all static assets into the `public/` directory, adhering to the project's architectural specifications.
*   **System Synchronization**: Executed a project-wide audit to synchronize all version numbers to `v1.9.73`, including file headers, `package.json`, `README` files, and all `openspec/` documentation.
*   **Code Integrity Audit**: Performed a comprehensive audit of the codebase, confirming the removal of the legacy `app/assets` directory and the absence of redundant commented-out code blocks. Verified that the `app/styles/` directory is integral to the application's styling pipeline.


## [v1.9.71]
### üõ°Ô∏?Deployment & Dependency Fix
*   **Production Hardening**: Cleaned the production `index.html` import map to remove all development-only dependencies (e.g., `vite`) and conflicting `react-dom` entries, ensuring a stable and consistent production build.
*   **Version Synchronization**: Executed a comprehensive project-wide audit to synchronize all version numbers to a consistent `v1.9.71`, ensuring code, documentation, and build configurations are in complete alignment.

## [v1.9.70]
### üõ°Ô∏?Deployment & Dependency Fix
*   **Critical Dependency Upgrade**: Upgraded `@react-three/postprocessing` to `v2.17.0` to resolve a peer dependency conflict with **React 19**, fixing `npm install` failures during deployment.
*   **Version Synchronization**: Executed a comprehensive project-wide audit to synchronize all version numbers to a consistent `v1.9.70`.
*   **Robustness Hardening**: Cleaned the production `index.html` import map to remove all development-only dependencies and conflicting entries, ensuring a stable and consistent production build.

## [v1.9.69]
### üõ†Ô∏?System Integrity Fix & Audit
*   **Version Synchronization**: Executed a comprehensive project-wide audit to synchronize all version numbers to a consistent `v1.9.69`.
*   **Component Restoration**: Restored full functional code for `PlaylistManager.tsx` and re-implemented the `SilkWaveScene.tsx` 3D visualizer, which were previously placeholder files.
*   **Code Quality**: Replaced a hard-coded version string in `SystemSettingsPanel.tsx` with the `APP_VERSION` constant for improved maintainability.

## [v1.9.68]
### üõ†Ô∏?System Integrity Fix & Audit
*   **Module Path Resolution**: Corrected all remaining extensionless relative imports for the `types` module (primarily in 3D scenes and UI panels), ensuring full native browser ES module compatibility.
*   **Version Synchronization**: Executed a comprehensive project-wide audit to synchronize all version numbers to a consistent `v1.9.68`, including all file headers, `package.json`, `README` files, and `openspec/` documentation.
*   **Component Restoration**: Restored the full functional code for `SystemSettingsPanel.tsx` and `PlaylistManager.tsx`, which were previously placeholder files.
*   **Robustness Hardening**: Cleaned the production `index.html` import map to remove all development-only dependencies and redundant entries.

## [v1.9.66]
### ‚öôÔ∏è Maintenance
*   **Version Synchronization**: Executed a project-wide audit to synchronize all version numbers to `v1.9.66`. This includes file headers, `package.json`, `README` files, all `openspec/` documentation, and internal i18n version constants.
*   **Robustness Hardening**: Cleaned the production `index.html` import map to remove development-only dependencies and conflicting `react-dom` entries, ensuring a stable and consistent production build.

## [v1.9.65]
### üõ†Ô∏?System Integrity Fix
*   **Restore Missing Files**: Recreated all 12 missing internationalization (i18n) language files to prevent application bootstrap failure.
*   **Module Path Resolution**: Corrected all extensionless relative imports across the entire codebase by adding `.ts` or `.tsx` extensions, ensuring native browser ES module compatibility.
*   **Version & Spec Synchronization**: Synchronized all file headers, `package.json`, `README`, and `openspec/` documentation to a consistent `v1.9.65`, reflecting a full system audit.
*   **Robustness Hardening**: Cleaned the production `index.html` import map by removing all development-only dependencies.

## [v1.9.64]
### üõ°Ô∏?System Audit
*   **i18n Integrity**: Audited all 11 language files against the English source to ensure complete key alignment. Synchronized internal version numbers across all locales.
*   **Robustness**: Hardened the application by removing development-only dependencies from the production `index.html` import map.
*   **OpenSpec Sync**: Audited and synchronized all `openspec/*.md` documentation files to version `v1.9.64`, ensuring code and specifications are in complete alignment.

## [v1.9.63]
### üêõ Bug Fixes
*   **Module Resolution**: Corrected all extensionless imports for the `types` module (e.g., `from '../types'`) to explicit paths (`from '../types/index.ts'`) to ensure compatibility with native browser ES module resolution via import maps.
*   **Import Map**: Removed development-only dependencies (`vite`, `@vitejs/plugin-react`) and redundant entries from the `index.html` import map.
