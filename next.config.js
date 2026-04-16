/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei", "postprocessing", "@react-three/postprocessing", "@google/genai"],
  images: {
    unoptimized: true
  },
  compress: true,
  productionBrowserSourceMaps: false,
  typescript: {
    ignoreBuildErrors: true
  },
  webpack: (config) => {
    config.resolve.modules = [
      path.resolve(process.env.USERPROFILE + '\\.npm-global\\node_modules'),
      ...config.resolve.modules
    ];
    return config;
  }
};

module.exports = nextConfig;