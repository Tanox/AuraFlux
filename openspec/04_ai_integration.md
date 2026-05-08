<!-- openspec/04_ai_integration.md v2.3.10 -->
# AI 集成系统规范

## 1. AI 服务模块

### 1.1 aiService.ts
- **文件**: `src/services/aiService.ts`
- **版本**: v2.3.10
- **功能**: 提供 Google Gemini AI 服务集成

**核心功能**:
- AI 服务可用性检查
- 音频分析与视觉配置生成
- 艺术背景生成
- 歌曲识别

**核心方法**:
- `isAiServiceAvailable` - 检查 AI 服务是否可用
- `checkAiServiceAvailability` - 检查 AI 服务可用性并处理错误
- `getAiService` - 获取 AI 服务实例
- `generateVisualConfigFromAudio` - 从音频生成视觉配置
- `generateArtisticBackground` - 生成艺术背景
- `identifySong` - 识别歌曲

**AI 模型使用**:
- `gemini-3-flash-preview` - 用于音频分析和歌曲识别
- `gemini-2.5-flash-image` - 用于生成艺术背景

**API 密钥管理**:
- 使用 `process.env.GEMINI_API_KEY` (服务端)
- 通过 API 代理处理所有请求
- 统一的密钥验证和错误处理

**代码示例**:
```tsx
// aiService.ts 核心结构
// File: src/services/aiService.ts | Version: v2.3.4
import { GoogleGenAI } from '@google/genai';
import { en } from '@/locales/en';

let aiInstance: GoogleGenAI | null = null;

/**
 * 将Blob对象转换为base64字符串
 * @param {Blob} blob - 要转换的Blob对象
 * @returns {Promise<string>} Base64字符串
 */
const blobToBase64 = async (blob: Blob): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = () => reject(new Error(`Failed to read audio data: ${reader.error?.message || 'Unknown error'}`));
    reader.readAsDataURL(blob);
  });
};

/**
 * 检查AI服务是否可用
 * @returns {boolean} AI服务是否可用
 */
export const isAiServiceAvailable = (): boolean => {
  return process.env.GEMINI_API_KEY !== undefined && process.env.GEMINI_API_KEY !== '';
};

/**
 * 检查AI服务可用性并处理错误
 * @returns {Object} 包含可用性和错误信息的对象
 */
export const checkAiServiceAvailability = (): { available: boolean; error?: string } => {
  if (!isAiServiceAvailable()) {
    return { available: false, error: en.ai.noApiKey };
  }
  return { available: true };
};

/**
 * 获取AI服务实例
 * @returns {GoogleGenAI | null} AI服务实例
 */
export const getAiService = (): GoogleGenAI | null => {
  if (!isAiServiceAvailable()) {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI(process.env.GEMINI_API_KEY!);
  }
  return aiInstance;
};

// 其他方法...
```

## 2. AI 状态管理

### 2.1 useAiState Hook
- **文件**: `src/hooks/state/useAiState.ts`
- **版本**: v2.3.4
- **功能**: 管理 AI 相关状态
**核心状态**:
- `showLyrics` - 是否显示歌词
- `lyricsStyle` - 歌词样式
- `aiBackground` - AI 背景状态
- `aiServiceAvailable` - AI 服务可用性
- `isProcessing` - 是否正在处理

**核心方法**:
- `performIdentification` - 执行歌曲识别
- `generateAiBackground` - 生成 AI 背景
- `toggleLyrics` - 切换歌词显示
- `updateLyricsStyle` - 更新歌词样式

### 2.2 AppContext 中的 AI 状态
- **文件**: `src/context/AppContext.tsx`
- **版本**: v2.3.4
- **功能**: 在全局状态中管理 AI 状态
**核心功能**:
- 提供 AI 状态和方法
- 集成 AI 服务
- 处理 AI 相关错误

## 3. AI 集成背景

### 3.1 AI 背景生成
- **功能**: 基于音频生成艺术背景
- **技术实现**:
  - 使用 Gemini 2.5 Flash 模型
  - 分析音频特征
  - 生成与音频匹配的视觉效果
  - 动态更新背景

### 3.2 歌曲识别
- **功能**: 识别正在播放的歌曲
- **技术实现**:
  - 录制音频片段
  - 发送到 Gemini API
  - 解析识别结果
  - 显示歌曲信息和歌词

### 3.3 音频到视觉的转换
- **功能**: 将音频特征转换为视觉配置
- **技术实现**:
  - 分析音频频谱
  - 提取音频特征
  - 生成匹配的视觉参数
  - 应用到可视化系统

## 4. 错误处理与边界情况

### 4.1 API 错误
- **错误类型**:
  - API 密钥无效
  - API 调用失败
  - 速率限制
  - 网络错误
- **处理策略**:
  - 友好的错误提示
  - 自动重试机制
  - 降级方案

### 4.2 处理延迟
- **边界情况**:
  - AI 处理时间长
  - 网络延迟
  - 复杂音频分析
- **处理策略**:
  - 加载状态
  - 进度指示
  - 超时处理

### 4.3 资源限制
- **边界情况**:
  - 音频文件过大
  - 处理频率过高
  - 模型限制
- **处理策略**:
  - 文件大小限制
  - 请求节流
  - 资源管理

## 5. 性能优化

### 5.1  API 调用优化
- **策略**:
  - 批量请求
  - 缓存结果
  - 优化请求参数
  - 减少不必要的调用

### 5.2 处理优化
- **策略**:
  - 后台处理
  - 优先级队列
  - 并行处理
  - 资源池

### 5.3 缓存策略
- **策略**:
  - 本地缓存
  - 会话缓存
  - 结果缓存
  - 预加载

## 6. 兼容性与跨平台

### 6.1 浏览器兼容性
- **支持的浏览器**:
  - Chrome (最新版本)
  - Firefox (最新版本)
  - Safari (最新版本)
  - Edge (最新版本)
- **兼容性处理**:
  - 特性检测
  - 降级方案
  - polyfill

### 6.2 跨平台支持
- **支持的平台**:
  - 桌面端
  - 移动端
  - PWA
- **平台特定处理**:
  - 移动设备限制
  - PWA 限制
  - 平台特定 API 调用

## 7. 测试与验证

### 7.1 AI 功能测试
- **测试类型**:
  - 单元测试
  - 集成测试
  - 端到端测试
- **测试工具**:
  - Jest
  - Playwright
  - 自定义 AI 测试工具

### 7.2 性能测试
- **测试指标**:
  - API 响应时间
  - 处理时间
  - 内存使用
  - 电池消耗

### 7.3 兼容性测试
- **测试场景**:
  - 不同浏览器
  - 不同设备
  - 不同网络条件

## 8. 未来发展

### 8.1 计划功能
- **AI 增强**:
  - 更高级的音频分析
  - 个性化推荐
  - 实时风格转换
  - 情感分析
- **交互增强**:
  - AI 辅助创作
  - 语音控制
  - 智能场景生成

### 8.2 技术改进
- **性能优化**:
  - 模型优化
  - 边缘计算
  - 本地处理
- **架构改进**:
  - 模块化 AI 系统
  - 可扩展的 AI 服务
  - 更好的错误处理机制