# Aura Flux 🎵👁️

### AI-Powered 3D Music Visualizer & Synesthesia Engine (v2.3.8)

[Live Demo](https://aura.ewuse.com/) | [简体中文](./README_ZH.md) | [Documentation](./openspec/)

**Aura Flux** is a professional-grade web application that transmutes audio frequencies into high-fidelity generative art. Powered by **React 19**, **Three.js (WebGL)**, and **Google Gemini 3 AI**, it delivers a seamless blend of edge-computing performance and cloud intelligence.

---

## 📚 Documentation Table of Contents

- [**Project Architecture & Modules**](./openspec/01_core_architecture.md) - 架构设计与核心模块说明
- [**User Guide**](./openspec/14_user_guide.md) - 用户操作指南与流程图
- [**API Documentation**](./openspec/12_api_reference.md) - 接口定义与 Gemini 集成说明
- [**FAQ & Troubleshooting**](./openspec/15_faq.md) - 常见问题与故障排除
- [**OpenSpec Standards**](./openspec/) - 详细的技术规范文档

---

## 🚀 Key Features

- **Hybrid Rendering Pipeline:** Seamlessly switch between high-fidelity 3D WebGL scenes (using R3F) and optimized 2D Canvas renderers for low-power devices.
- **AI Synesthesia HUD:** Real-time track identification, mood analysis, and full lyrics retrieval powered by **Gemini 3.0 Flash**.
- **AI Auto-Director:** Let the AI analyze 15 seconds of your music and automatically tune colors, speed, and visual modes to match the vibe.
- **4K Studio Recording:** Export your creations in high resolution (up to 4K) with custom audio gain and bitrate control.
- **Project Specification (OpenSpec):** Strictly follows the OpenSpec standard for documentation and architecture.

---

## 🛠️ Installation & Deployment

### 1. Prerequisites
- **Node.js**: v18.17.0 or higher
- **npm**: v9.0.0 or higher
- **Google Gemini API Key**: Required for AI features

### 2. Local Development

```bash
# 1. Clone the repository
git clone https://github.com/sutchan/aura-flux.git
cd aura-flux

# 2. Install dependencies
npm install

# 3. Configure Environment Variables
cp .env.example .env.local
# Edit .env.local and add your GEMINI_API_KEY (server-side only, not exposed to client)

# 4. Start Development Server
npm run dev
```
Access the app at `http://localhost:3000`.

### 3. Production Build

```bash
# Build the application
npm run build

# Start the production server
npm start
```

**Important:** Ensure `GEMINI_API_KEY` is set in your production environment variables.

### 4. Docker Deployment

```bash
# Build Docker image
docker build -t aura-flux .

# Run container with GEMINI_API_KEY
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key aura-flux
```

**Security Note:** The API key is now server-side only and never exposed to the client browser.

---

## 🧩 Functional Modules

| Module | Description |
| :--- | :--- |
| **Audio Engine** | Real-time FFT analysis using Web Audio API. Extracts Bass, Mid, Treble energy. |
| **Visualizer Engine** | Three.js based rendering system supporting multiple scenes (Silk, Neon). |
| **AI Service** | Integration with Google Gemini for song ID, lyrics, and mood analysis. |
| **UI System** | Responsive controls built with React & Tailwind CSS. |

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run specific test files
pnpm test -- --testPathPatterns="logger.test|visualization.test"

# Run tests with coverage
pnpm test -- --coverage
```

**Coverage Requirements:**
- Branches: ≥80%
- Functions: ≥80%
- Lines: ≥80%
- Statements: ≥80%

---

## 📝 Code Standards

This project follows strict naming conventions and coding standards:

- **File Naming**: PascalCase for components, camelCase for hooks/utils
- **Directory Structure**: kebab-case for directories
- **Type Definitions**: All types defined in `src/types/index.ts`
- **Visualizer Registry**: All visualizers registered in `src/components/visualizers/index.ts`

See [Naming Conventions](./openspec/18_naming_conventions.md) for detailed guidelines.

---

## 📄 License & Signature

Developed with ❤️ by **Sut**.
*Version: 2.3.8*
*Signature URL:* [https://github.com/sutchan/aura-flux](https://github.com/sutchan/aura-flux)
