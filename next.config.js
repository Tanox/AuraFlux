/** @type {import('next').NextConfig} */
const withPWA = require('@ducanh2912/next-pwa').default;
const path = require('path');
const os = require('os');

// 获取用户主目录
const homeDir = os.homedir();
const globalNextDir = path.join(homeDir, '.next');
const globalNextCache = path.join(homeDir, '.next/cache');

const nextConfig = withPWA({
  reactStrictMode: true,
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei", "postprocessing", "@react-three/postprocessing", "@google/genai"],
  images: {
    unoptimized: true
  },
  pwa: {
    dest: 'public',
    register: false,
    skipWaiting: false,
    buildExcludes: [/middleware-manifest\.json$/],
    disable: process.env.NODE_ENV === 'development'
  },
  // Next.js 14.x 中使用 distDir 控制构建目录到全局位置
  distDir: path.relative(process.cwd(), globalNextDir)
});

module.exports = nextConfig;