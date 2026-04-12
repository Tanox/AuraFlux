# Changelog

All notable changes to the **Aura Flux** project will be documented in this file.

## [v2.2.0]
### ✨ Visualization Enhancements
- **Silk Wave Mode**: Thickened lines by 3-5x, made lines thicker near the viewer, and improved smoothness
- **Ocean Mode**: Optimized line default height to be at canvas bottom for more natural appearance
- **Neural Flow Mode**: Enhanced particles to follow sound changes
- **Tunnel Mode**: Increased ring thickness intensity with volume changes
- **Laser Mode**: Updated laser lines to react to sound
- **Plasma Mode**: Increased particle size several times
- **Bars Mode**: Reduced bar count by 50% and increased width

### 🗑️ Removed Modes
- **Vortex Mode**: Removed from the visualization options
- **Waveform Mode**: Removed from the visualization options

### 📋 Version Updates
- **Version Synchronization**: Updated all project files to version v2.2.0
- **Metadata**: Updated metadata.json with the new version
- **Layout**: Updated the HTML title in src/app/layout.tsx
- **Constants**: Updated version constants in src/constants/

## [v2.1.0]
### ✨ Version Update
- **Version Synchronization**: Updated all project files to version v2.1.0
- **Documentation**: Updated all specification documents in the spec/ directory
- **Metadata**: Updated metadata.json and package.json with the new version
- **Layout**: Updated the HTML title in src/app/layout.tsx
- **Constants**: Updated version constants in src/constants/
- **Locales**: Updated all language files in src/locales/

## [v2.1.0]
### ✨ Visualization Enhancement
- **Ocean Visualization**: Optimized the ocean visualization mode to position the default line height at the canvas bottom for a more natural ocean-like appearance.

## [v2.0.7]
### ✨ Documentation Comprehensive Updates
- **Core Architecture**: Enhanced 01_core_architecture.md with complete code examples and detailed implementation details
- **Audio Engine**: Improved 02_audio_engine.md with additional Hook implementations and updated version consistency
- **Visual Rendering**: Expanded 03_visual_rendering.md with more detailed 2D and 3D visualization mode implementations
- **AI Integration**: Enhanced 04_ai_integration.md with comprehensive AI service implementation and component examples
- **UI Interaction**: Verified 05_ui_interaction.md contains complete UI component implementations and interaction flows
- **Internationalization**: Confirmed 06_i18n_storage.md includes full internationalization and storage system details
- **Deployment**: Extended 07_deployment.md with additional build and deployment details, including CI/CD configuration and best practices
- **Testing**: Verified 08_testing_validation.md contains comprehensive testing strategies and tool configurations
- **Marketing**: Confirmed 09_marketing.md includes complete marketing and branding strategies
- **Contribution Guidelines**: Verified 10_contribution_guidelines.md contains clear contribution rules and workflows
- **Security Policy**: Confirmed 11_security_policy.md includes comprehensive security and privacy guidelines
- **API Reference**: Verified 12_api_reference.md contains complete API documentation and usage examples
- **Architecture Overview**: Confirmed 13_architecture_overview.md includes detailed system architecture and data flow diagrams
- **User Guide**: Verified 14_user_guide.md contains comprehensive user instructions and workflows
- **FAQ**: Confirmed 15_faq.md includes complete troubleshooting guides and common questions
- **Migration Guide**: Verified 16_migration_guide.md contains detailed version migration instructions
- **Documentation Guidelines**: Confirmed 17_documentation_guidelines.md includes comprehensive documentation maintenance and review processes

## [v2.0.6]
### ✨ Documentation Updates
- **Core Architecture**: Updated 01_core_architecture.md with detailed code examples for App.tsx, _not-found.tsx, AppContext.tsx, useAppState.ts, useVisualsState.ts, and types/index.ts
- **Audio Engine**: Updated 02_audio_engine.md with comprehensive code examples for useAudio.ts and audioUtils.ts
- **Visual Rendering**: Updated 03_visual_rendering.md with detailed code examples for VisualizerCanvas.tsx and ThreeVisualizer.tsx
- **AI Integration**: Updated 04_ai_integration.md with comprehensive code examples for aiService.ts and useAiState.ts
- **UI Interaction**: Updated 05_ui_interaction.md with detailed code examples for Controls.tsx and BottomBar.tsx
- **Internationalization**: Updated 06_i18n_storage.md with comprehensive code examples for locales/index.ts and useLocalStorage.ts
- **Deployment**: Updated 07_deployment.md with detailed code examples for next.config.ts, package.json, vercel.json, and PWA configuration
- **Testing**: Updated 08_testing_validation.md with comprehensive code examples for jest.config.js and test cases

## [v2.0.6]
### ⚠️ Version Rollback
- **Rollback Reason**: Reverted from v2.0.7 to v2.0.6 due to stability issues with the new STARFIELD visualization mode that required further refinement.

### ✨ Documentation Improvements
- **Documentation Structure**: Improved README.md structure with better categorization and navigation
- **Technical Details**: Enhanced core architecture documentation with detailed code examples
- **Architecture Diagrams**: Added comprehensive Mermaid diagrams for system architecture and data flows
- **API Documentation**: Expanded API reference with complete service interfaces and state management
- **Version Synchronization**: Updated version numbers across all specification documents to v2.0.6
- **Documentation Guidelines**: Added documentation review and maintenance mechanisms

### 🔄 Code and Documentation Synchronization
- **Core Architecture**: Updated App.tsx and AppContext.tsx code examples in core architecture documentation to match actual implementation
- **404 Page**: Added documentation for the _not-found.tsx component
- **Visual Rendering**: Updated visual rendering system documentation to reflect current 2D and 3D visualization modes, including corresponding enum values
- **AI Integration**: Updated AI state management documentation to match actual useAiState implementation, including parameter details
- **API Reference**: Updated state management interfaces to match current AppContext implementations
- **Constants**: Updated version constant example to match actual implementation
- **File Structure**: Verified and updated documentation to reflect current project file structure

## [v2.0.6]
### ✨ System Updates
- **Core Architecture Update**: Updated core architecture specifications to v2.0.6
- **App Version Display**: Fixed application name and version display in the bottom right corner of the canvas
- **Version Synchronization**: Updated version numbers across all files to v2.0.6

## [v2.0.7]
### ✨ Visualization Mode Updates
*   **Removed Modes**: Removed RINGS and PARTICLES visualization modes.
*   **Added Mode**: Added STARFIELD (星空) visualization mode with audio-reactive star movement and center effects.

## [v2.0.6]
### ✨ Visualization Enhancement
*   **Silk Wave Line Width**: Increased the line width in the Silk Wave visualization mode by 6x for a more prominent and immersive visual effect.

## [v2.0.5]
### ✨ System Updates & Documentation
*   **i18n Integrity**: Checked and ensured all internationalization language files are complete and consistent.
*   **Robustness Testing**: Verified application robustness by successfully starting the development server.
*   **Documentation Update**: Updated README.md and README_ZH.md with the latest version information.
*   **OpenSpec Sync**: Synchronized code functionality details to the spec documentation, including updated visualization modes and directory structure.
*   **Version Synchronization**: Updated all files to version v2.0.5, ensuring consistency across the project.

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