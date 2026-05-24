/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei", "postprocessing", "@react-three/postprocessing", "@google/genai"],
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig;
