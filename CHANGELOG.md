# Changelog

All notable changes to the **Aura Flux** project will be documented in this file.

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