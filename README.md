# Aura Flux 🎵👁️

### AI-Powered 3D Music Visualizer & Synesthesia Engine (v1.9.36)

[Live Demo](https://aura.ewuse.com/) | [简体中文](./README_ZH.md)

**Aura Flux** is a professional-grade web application that transmutes audio frequencies into high-fidelity generative art. Powered by **React 19**, **Three.js (WebGL)**, and **Google Gemini 3 AI**, it delivers a seamless blend of edge-computing performance and cloud intelligence.

---

## 🚀 Key Features

- **Hybrid Rendering Pipeline:** Seamlessly switch between high-fidelity 3D WebGL scenes (using R3F) and optimized 2D Canvas renderers for low-power devices.
- **AI Synesthesia HUD:** Real-time track identification, mood analysis, and full lyrics retrieval powered by **Gemini 3.0 Flash**.
- **AI Auto-Director:** Let the AI analyze 15 seconds of your music and automatically tune colors, speed, and visual modes to match the vibe.
- **4K Studio Recording:** Export your creations in high resolution (up to 4K) with custom audio gain and bitrate control.
- **Data Portability:** Export your precision-tuned settings to JSON files and share them with the community.

---

## 🌟 Usage Scenarios

### 1. The Content Creator's Suite 📹
*   **The Goal:** Create stunning background visuals for TikTok, Reels, or YouTube music videos.
*   **The Workflow:** Import your high-quality `.mp3` or `.wav` file, activate "Studio Mode", set the aspect ratio to `9:16`, and record a synced performance.
*   **Pro Tip:** Use the "AI Inspiration Background" to generate a unique artistic layer that matches your song's mood.

---

## 🛠️ Technical Stack

- **Framework:** React 19 with Context API for global state management.
- **3D Engine:** Three.js / @react-three/fiber with custom GLSL shaders.
- **AI Integration:** Google Generative AI (@google/genai) utilizing Gemini 3.0.
- **Audio:** Web Audio API with Fast Fourier Transform (FFT) analysis.
- **Persistence:** IndexedDB (for large audio files) + LocalStorage (for settings).

---

## 📄 License & Signature

Developed with ❤️ by **Sut**.  
*Version: 1.9.36*  
*Signature URL:* [https://github.com/sutchan/aura-flux](https://github.com/sutchan/aura-flux)