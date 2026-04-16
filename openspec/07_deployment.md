# 部署与环境系统规范

## 版本信息
- **版本**: v2.2.25
- **更新日期**: 2026-04-08
- **作者**: Sut

## 1. 构建环境

### 1.1 构建工具
- **工具**: Vite 6.0+
- **目标平台**: `esnext`
- **压缩**: `esbuild`

### 1.2 环境变量
- **必须变量**: `process.env.GEMINI_API_KEY` (服务器端)
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
// File: next.config.ts | Version: v2.2.25
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
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: '2.2.15'
  },
  trailingSlash: false,
  output: 'export'
};

export default nextConfig;
```

## 2. PWA 支持

### 2.1 PWA 状态
- **当前状态**: 已停用
- **原因**: 增强受限执行环境下的稳定性

### 2.2 PWA 文件
- **文件**: `public/manifest.json`
- **文件**: `public/sw.js`

**说明:**
- 文件仍保留在代码库中
- 不在 `index.html` 中引用
- 准备在未来重新启用

## 3. 生产发布

### 3.1 部署路径
- **基准路径**: `./`
- **支持**: 任意子路径部署

### 3.2 权限申请
- **文件**: `metadata.json`
- **必须权限**: `camera` 和 `microphone`

### 3.3 版本管理
- **文件**: `public/version.json`
- **功能**: 存储应用版本信息

**内容结构:**
```json
{
  "version": "2.2.15"
}
```

## 4. 开发环境

### 4.1 开发服务器
- **命令**: `npm run dev`
- **端口**: 3000

### 4.2 依赖管理
- **包管理器**: pnpm
- **锁文件**: `pnpm-lock.yaml`

### 4.3 代码质量
- **ESLint**: 代码风格检查
- **TypeScript**: 类型检查
- **Tailwind CSS**: 样式管理

## 5. 跨平台支持

### 5.1 浏览器兼容性
- Chrome/Edge (最新版本)
- Firefox (最新版本)
- Safari (最新版本)

### 5.2 移动设备支持
- iOS Safari (最新版本)
- Android Chrome (最新版本)

### 5.3 性能优化
- 响应式加载
- 代码分割
- 资源优化
- 缓存策略

## 6. 构建与部署流程

### 6.1 构建命令
- **开发构建**: `npm run build`
- **生产构建**: `npm run build:prod`
- **预览构建**: `npm run preview`

### 6.2 部署平台
- **Vercel** (推荐)
- **Netlify**
- **GitHub Pages**
- **AWS Amplify**
- **Firebase Hosting**

### 6.3 CI/CD 配置
- **GitHub Actions**: 自动构建和部署
- **Vercel**: 自动部署
- **Netlify**: 自动部署

### 6.4 环境变量配置
- **开发环境**: `.env.development`
- **生产环境**: `.env.production`

### 6.5 部署最佳实践
- 使用 HTTPS
- 启用 gzip/brotli 压缩
- 配置正确的缓存策略
- 使用 CDN 加速静态资源
- 监控部署状态

## 7. 故障排查

### 7.1 常见部署问题
- **API 密钥问题**: 确保 `GEMINI_API_KEY` 正确配置（服务器端环境变量）
- **构建失败**: 检查依赖和 TypeScript 类型
- **运行时错误**: 检查浏览器控制台错误信息
- **性能问题**: 优化资源加载和代码分割

### 7.2 调试技巧
- 使用浏览器开发者工具
- 检查网络请求
- 查看构建日志
- 测试不同浏览器和设备
