# Aura Flux 🎵👁️

### AI-Powered 3D Music Visualizer & Synesthesia Engine (v2.3.0)

[Live Demo](https://aura.ewuse.com/) | [简体中文](./README_ZH.md) | [Documentation](./openspec/)

**Aura Flux** is a professional-grade web application that transmutes audio frequencies into high-fidelity generative art. Powered by **React 19**, **Three.js (WebGL)**, and **Google Gemini 3 AI**, it delivers a seamless blend of edge-computing performance and cloud intelligence.

---

## 📚 Documentation Table of Contents

- [**Project Architecture & Modules**](./openspec/13_architecture_overview.md) - 架构设计与核心模块说明
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
# Edit .env.local and add your NEXT_PUBLIC_GEMINI_API_KEY

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

### 4. Docker Deployment

```bash
# Build Docker image
docker build -t aura-flux .

# Run container
docker run -p 3000:3000 -e NEXT_PUBLIC_GEMINI_API_KEY=your_key aura-flux
```

---

## 🧩 Functional Modules

| Module | Description |
| :--- | :--- |
| **Audio Engine** | Real-time FFT analysis using Web Audio API. Extracts Bass, Mid, Treble energy. |
| **Visualizer Engine** | Three.js based rendering system supporting multiple scenes (Silk, Neon, Vortex). |
| **AI Service** | Integration with Google Gemini for song ID, lyrics, and mood analysis. |
| **UI System** | Responsive controls built with React & Tailwind CSS. |

---

## 📄 License & Signature

Developed with ❤️ by **Sut**.  
*Version: 2.3.0*  
*Signature URL:* [https://github.com/sutchan/aura-flux](https://github.com/sutchan/aura-flux)
