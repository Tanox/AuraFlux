# OpenSpec: AI 智能与语义规范 (04)

## 1. 模型选择 (v1.9.2)
- **主语言模型:** `gemini-3-flash-preview`。用于歌词检索、情绪分析与视觉导演建议。
- **视觉模型:** `gemini-2.5-flash-image`。用于根据当前歌曲氛围生成艺术背景。

## 2. 通感分析逻辑
1.  **音频采样:** 截取当前播放的 15 秒音频片段并转换为 Base64。
2.  **语义对齐:** 发送至 Gemini 3 进行音频指纹识别与情感建模。
3.  **结果映射:** 
    - AI 返回 JSON 格式配置（Mode, Colors, Speed）。
    - 客户端解析并应用 `applyPreset` 逻辑进行平滑过渡。

## 3. 歌词处理规范
- **检索优先级:** 
  1. ID3 Tags (本地提取)。
  2. Gemini 知识库 (云端检索)。
- **同步显示:** 采用 LRC 时间戳解析算法，结合 `currentTime` 实现毫秒级滚动。

---
*Aura Flux AI Integration Specification - Version 1.9.2*
*Author: Sut*