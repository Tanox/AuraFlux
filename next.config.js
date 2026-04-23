/** @type {import('next').NextConfig} */
const withPWA = require('@ducanh2912/next-pwa').default;

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
  }
});

module.exports = nextConfig;