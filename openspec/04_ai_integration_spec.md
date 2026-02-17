# OpenSpec: AI 智能与语义规范 (04)

## 1. 模型架构 (v1.9.36)
所有 AI 逻辑由 `app/services/aiService.ts` 封装，遵循 **Gemini 3.0 SDK** 最新规范。

- **Gemini 3.0 Flash:** 核心音频识别与视觉导演（`responseSchema` 强制结构化）。
- **Gemini 2.5 Flash Image:** 艺术背景生成，支持 `aspectRatio: "16:9"`。
- **Gemini 3.0 Pro:** 复杂歌单解析（启用 `googleSearch` 工具）。

## 2. 功能协议
### 2.1. 歌曲识别 (Identification)
- **输入:** 4 秒 Base64 编码的音频片段 (`audio/webm`)。
- **输出格式:** 强制 JSON 包含 `title`, `artist`, `mood`, `identified`。
- **安全:** API 密钥在本地 LocalStorage 中以 `enc:` 前缀 Base64 加密存储。

### 2.2. AI 导演 (Auto-Director)
- **机制:** 分析 15 秒音频指纹。
- **反馈:** 返回视觉模式、配色方案（3色 HEX）及推荐理由的 JSON。

### 2.3. AI 艺术背景 (Artistic BG)
- **触发:** 提取歌曲 `mood_en_keywords` 作为 Prompt。
- **格式:** 响应中遍历 `parts` 查找 `inlineData` 以提取生成图像。

## 3. 调用规范
- 禁止使用旧版 `GoogleGenerativeAI` 导入。
- 必须使用 `ai.models.generateContent({ model, contents, config })` 格式。

---
*Aura Flux AI Integration Specification - Version 1.9.36*
*Author: Sut*