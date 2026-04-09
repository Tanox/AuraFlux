# AI 集成系统规范

## 1. AI 服务模块

### 1.1 aiService.ts
- **文件**: `src/services/aiService.ts`
- **版本**: v2.0.6
- **功能**: 提供 Google Gemini AI 服务集成

**核心功能:**
- AI 服务可用性检查
- 音频分析与视觉配置生成
- 艺术背景生成
- 歌曲识别

**核心方法:**
- `isAiServiceAvailable` - 检查 AI 服务是否可用
- `checkAiServiceAvailability` - 检查 AI 服务可用性并处理错误
- `getAiService` - 获取 AI 服务实例
- `generateVisualConfigFromAudio` - 从音频生成视觉配置
- `generateArtisticBackground` - 生成艺术背景
- `identifySong` - 识别歌曲

**AI 模型使用:**
- `gemini-3-flash-preview` - 用于音频分析和歌曲识别
- `gemini-2.5-flash-image` - 用于生成艺术背景

**API 密钥管理:**
- 使用 `process.env.NEXT_PUBLIC_GEMINI_API_KEY`
- 严格的密钥验证和错误处理

## 2. AI 状态管理

### 2.1 useAiState Hook
- **文件**: `src/hooks/useAiState.ts`
- **功能**: 管理 AI 相关状态

**核心状态:**
- `lyricsStyle` - 歌词样式 (默认: `LyricsStyle.STANDARD`)
- `showLyrics` - 歌词显示状态 (默认: `false`)
- `enableAnalysis` - 启用分析状态 (默认: `true`)
- `isIdentifying` - 正在识别状态 (默认: `false`)

**核心方法:**
- `performIdentification(stream: MediaStream)` - 执行歌曲识别
- `resetAiSettings()` - 重置 AI 设置

**参数说明:**
- `language` - 当前语言
- `region` - 当前区域
- `provider` - AI 服务提供商 (GEMINI 或 MOCK)
- `isListening` - 是否正在监听
- `isSimulating` - 是否使用模拟模式
- `mediaStream` - 媒体流
- `initialSettings` - 初始设置
- `setSettings` - 设置更新函数
- `onSongIdentified` - 歌曲识别完成回调
- `currentSong` - 当前歌曲信息
- `getAudioSlice` - 获取音频片段的函数
- `t` - 翻译函数
- `showToast` - 显示提示的函数

## 3. AI 集成场景

### 3.1 AI 背景生成
- **组件**: `AiBackground.tsx`
- **功能**: 基于音乐情绪生成艺术背景

**工作流程:**
1. 分析音频数据
2. 生成描述音乐情绪的提示词
3. 调用 Gemini 2.5 Flash Image 生成背景
4. 应用生成的背景到可视化场景

### 3.2 AI 视觉导演
- **功能**: 基于音频分析自动配置视觉效果

**工作流程:**
1. 分析音频频谱和情绪
2. 生成适合的视觉模式配置
3. 自动应用到可视化系统
4. 实时调整视觉参数

### 3.3 歌曲识别
- **功能**: 识别正在播放的歌曲

**工作流程:**
1. 捕获音频片段
2. 发送到 Gemini 3.0 Flash 进行分析
3. 解析识别结果
4. 显示歌曲信息和专辑封面
