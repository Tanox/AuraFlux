/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({ 
  dest: 'public',
  register: false,
  skipWaiting: false,
  buildExcludes: [/middleware-manifest\.json$/],
  disable: process.env.NODE_ENV === 'development'
});

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei", "postprocessing", "@react-three/postprocessing", "@google/genai"],
  images: {
    unoptimized: true
  },
  compress: true,
  productionBrowserSourceMaps: false,
  typescript: {
    ignoreBuildErrors: false
  }
};

module.exports = withPWA(nextConfig);