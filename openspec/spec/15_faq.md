# Aura Flux - 常见问题解答 (FAQ) & 故障排除

## 1. 常见问题 (FAQ)

### Q1: 为什么我看不到任何视觉效果？
**A:** 请检查以下几点：
1. 确保已授予浏览器 **麦克风权限**。
2. 确保您的设备正在播放声音，或者麦克风能接收到声音。
3. 尝试刷新页面。
4. 检查 **Sensitivity** (灵敏度) 设置是否过低。

### Q2: AI 识别功能总是失败？
**A:** 可能的原因包括：
1. **API Key 问题**: 检查环境变量 `GEMINI_API_KEY` 是否正确配置且有额度（服务器端）。
2. **网络问题**: 确保您的网络可以访问 Google Gemini API 服务。
3. **音频过噪**: 环境噪音过大可能影响识别，请尝试靠近音源。

### Q3: 页面运行卡顿怎么办？
**A:** WebGL 渲染对显卡有一定要求。
1. 在 **Settings** 面板中，降低 **Quality** (画质) 设置为 **Low**。
2. 确保浏览器已开启硬件加速。
3. 关闭其他占用显卡资源的程序。

### Q4: 移动端支持如何？
**A:** 支持现代移动浏览器 (Chrome, Safari)。但由于移动设备 GPU 性能限制，建议使用 **2D 模式** (如 Waveform, Bars) 或降低画质设置。iOS Safari 需要用户手动触发音频上下文（点击页面任意位置）。

## 2. 故障排除指南

### 2.1 麦克风权限被拒绝
**现象**: 提示 "Microphone access denied"。
**解决**:
1. 点击浏览器地址栏左侧的 "锁" 图标。
2. 找到 "麦克风" 选项，设置为 "允许" (Allow)。
3. 刷新页面。

### 2.2 AI 服务响应 403/401 错误
**现象**: 控制台报错 `POST ... 403 Forbidden`。
**解决**:
1. 确认 API Key 有效。
2. 确认 API Key 绑定的 Google Cloud 项目已启用 "Generative Language API"。

### 2.3 3D 场景黑屏
**现象**: UI 显示正常，但背景全黑。
**解决**:
1. 打开浏览器开发者工具 (F12) -> Console。
2. 查看是否有 WebGL 相关报错 (e.g., "WebGL context lost")。
3. 更新显卡驱动，或重启浏览器。

### 2.4 构建失败
**现象**: `npm run build` 报错。
**解决**:
1. 检查 `package.json` 依赖是否安装完整 (`npm install`)。
2. 检查 TypeScript 类型错误 (`npm run lint`)。
3. 清除 Next.js 缓存 (`rm -rf .next`) 后重试。

## 3. 获取支持

如果上述指南无法解决您的问题，请通过以下方式联系：
- **GitHub Issues**: 提交详细的 Bug 报告。
- **Email**: xepinchen@gmail.com
