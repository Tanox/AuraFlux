<!-- openspec/07_deployment.md v2.3.11 -->
# 部署与环境系统规范

## 版本信息
- **版本**: v2.3.11
- **更新日期**: 2026-04-22
- **作者**: Sut

## 1. 构建环境

### 1.1 构建工具
- **工具**: Vite 6.0+
- **目标平台**: `esnext`
- **压缩**: `esbuild`

### 1.2 环境变量
- **必需变量**: `process.env.GEMINI_API_KEY` (服务端)
- **可选变量**: 其他配置变量

### 1.3 构建配置
- **文件**: `next.config.ts`
- **功能**: Next.js 配置

**核心配置:**
- 别名设置 (`@/`)
- 构建优化
- 环境变量配置

**代码示例:**
```tsx
// next.config.ts 核心结构
// File: next.config.ts | Version: v2.3.11
import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, './src')
    };
    return config;
  }
};

export default nextConfig;
```

## 2. PWA 支持

### 2.1 PWA 配置
- **文件**: `public/manifest.json`
- **功能**: 渐进式 Web 应用配置

**核心配置:**
- 应用名称
- 图标配置
- 主题颜色
- 启动 URL

### 2.2 Service Worker
- **文件**: `public/sw.js`
- **功能**: 离线支持和缓存策略

**核心功能:**
- 资源缓存
- 离线访问
- 背景同步

## 3. 生产发布

### 3.1 构建流程
- **命令**: `npm run build`
- **输出目录**: `.next`
- **产物**: 优化后的静态资源和服务器代码

### 3.2 部署平台
- **支持的平台**:
  - Vercel
  - Netlify
  - AWS Amplify
  - Google Cloud Run
  - 自托管服务器

### 3.3 部署配置
- **环境变量**:
  - `GEMINI_API_KEY` - Gemini API 密钥
  - `NODE_ENV` - 环境模式
- **安全配置**:
  - HTTPS 配置
  - CORS 配置
  - 内容安全策略

## 4. 开发环境

### 4.1 开发服务器
- **命令**: `npm run dev`
- **端口**: 3000
- **热重载**: 支持

### 4.2 开发工具
- **代码编辑器**: Visual Studio Code
- **扩展推荐**:
  - ESLint
  - Prettier
  - TypeScript
  - React Developer Tools

### 4.3 调试
- **浏览器调试**: Chrome DevTools
- **React 调试**: React Developer Tools
- **网络调试**: Network Panel

## 5. 跨平台支持

### 5.1 浏览器支持
- **支持的浏览器**:
  - Chrome (最新版本)
  - Firefox (最新版本)
  - Safari (最新版本)
  - Edge (最新版本)

### 5.2 移动平台支持
- **支持的平台**:
  - iOS (Safari)
  - Android (Chrome)
- **响应式设计**:
  - 适配不同屏幕尺寸
  - 触摸友好

### 5.3 桌面平台支持
- **支持的平台**:
  - Windows
  - macOS
  - Linux
- **PWA 安装**:
  - 支持添加到主屏幕
  - 离线访问

## 6. 性能优化

### 6.1 构建优化
- **策略**:
  - 代码分割
  - 懒加载
  - 树摇
  - 缓存策略

### 6.2 加载优化
- **策略**:
  - 预加载关键资源
  - 字体优化
  - 图片优化
  - 资源压缩

### 6.3 运行时优化
- **策略**:
  - 内存管理
  - 渲染优化
  - 网络请求优化
  - 动画性能

## 7. 监控与日志

### 7.1 错误监控
- **工具**:
  - Sentry
  - LogRocket
- **监控内容**:
  - 运行时错误
  - 性能问题
  - 用户体验问题

### 7.2 性能监控
- **工具**:
  - Google Analytics
  - Web Vitals
- **监控指标**:
  - LCP (Largest Contentful Paint)
  - FID (First Input Delay)
  - CLS (Cumulative Layout Shift)

### 7.3 日志管理
- **服务器日志**:
  - API 调用日志
  - 错误日志
  - 访问日志

## 8. 安全

### 8.1 安全最佳实践
- **策略**:
  - HTTPS 配置
  - 内容安全策略
  - XSS 防护
  - CSRF 防护

### 8.2 依赖安全
- **工具**:
  - npm audit
  - Dependabot
- **策略**:
  - 定期更新依赖
  - 安全扫描
  - 漏洞修复

### 8.3 API 安全
- **策略**:
  - API 密钥管理
  - 请求验证
  - 速率限制
  - 数据加密

## 9. 维护与更新

### 9.1 版本管理
- **策略**:
  - 语义化版本控制
  - 版本发布流程
  - 版本回滚策略

### 9.2 部署流程
- **策略**:
  - 持续集成
  - 持续部署
  - 测试流程

### 9.3 监控与告警
- **策略**:
  - 服务器监控
  - 应用监控
  - 告警机制

## 10. 未来发展

### 10.1 计划功能
- **部署增强**:
  - 容器化部署
  - 边缘计算
  - 无服务器架构
- **性能优化**:
  - 更高效的构建流程
  - 更好的缓存策略
  - 智能资源加载

### 10.2 技术改进
- **工具链改进**:
  - 构建工具升级
  - 开发工具优化
- **流程改进**:
  - 自动化部署
  - 智能监控
  - 预测性维护