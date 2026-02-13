# Aura Flux 🎵👁️

### AI-Powered 3D Music Visualizer & Synesthesia Engine (v1.9.2)

[Live Demo](https://github.com/sutchan) | [简体中文](./README_ZH.md)

**Aura Flux** is a professional-grade web application that transmutes audio frequencies into high-fidelity generative art. Powered by **React 18**, **Three.js (WebGL)**, and **Google Gemini 3 AI**, it delivers a seamless blend of edge-computing performance and cloud intelligence.

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

### 2. Live VJ / Streamer Atmosphere 🎙️
*   **The Goal:** Add a reactive visual layer to your live DJ set or podcast stream.
*   **The Workflow:** Set Audio Input to "Microphone" (or use a virtual audio cable like VB-Audio). Enable "Auto-Hide HUD" and "Auto-Cycle Engines" to keep the visuals evolving without manual intervention.
*   **Pro Tip:** Toggle "Mirror Display" for a psychedelic symmetrical effect.

### 3. Smart Home & Ambient Lounge 🏠
*   **The Goal:** Transform your living room TV into a living piece of digital art.
*   **The Workflow:** Connect your PC/Mac to a large display, enter "Calm" preset, and enable "Clock Overlay". 
*   **Pro Tip:** Use the "Silk Wave" or "Neural Flow" modes for a sophisticated, non-distracting ambient experience.

### 4. Zen Meditation & Focus 🧘
*   **The Goal:** Use rhythmic visual pulses to aid breathing and concentration.
*   **The Workflow:** Select the "Resonance Orb" mode, lower the "Flow Speed", and use a deep blue color palette. 
*   **Pro Tip:** Enable "Text Overlay" with custom affirmations or focus keywords.

### 5. Technical Playground 🧪
*   **The Goal:** Experiment with audio spectrum density and signal processing.
*   **The Workflow:** Switch to "Advanced Mode" to unlock FFT Size (up to 2048), Smoothing (Inertia), and individual gain controls.
*   **Pro Tip:** Monitor the FPS counter and adjust "Render Quality" to find the perfect balance for your GPU.

---

## ⌨️ VJ Control Center (Hotkeys)

| Key | Action |
|:---:|:---|
| `Space` | Toggle Microphone / Play File |
| `F` | Toggle Fullscreen |
| `R` | Randomize Aesthetics (Random Flux) |
| `L` | Toggle AI HUD (Lyrics & Mood) |
| `H` | Hide/Show Controls |
| `G` | Toggle Bloom (Glow) |
| `T` | Toggle Motion Trails |
| `← / →` | Change Visual Engine |
| `Shift + ↑/↓`| Adjust Flow Speed |
| `1 - 6` | Switch between Setting Tabs |
| `?` | Show Help Overlay |

---

## 🛠️ Technical Stack

- **Framework:** React 18 with Context API for global state management.
- **3D Engine:** Three.js / @react-three/fiber with custom GLSL shaders.
- **AI Integration:** Google Generative AI (@google/genai) utilizing Gemini 3.0.
- **Audio:** Web Audio API with Fast Fourier Transform (FFT) analysis.
- **Persistence:** IndexedDB (for large audio files) + LocalStorage (for settings).

---

## 📄 License & Signature

Developed with ❤️ by **Sut**.  
*Version: 1.9.2*  
*Signature URL:* [https://github.com/sutchan](https://github.com/sutchan)