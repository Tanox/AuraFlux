import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: "dist", // Changed to dist directory
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei", "postprocessing", "@react-three/postprocessing"],
  output: "export",
  images: {
    unoptimized: true
  },
  turbopack: {},
  compress: true,
  productionBrowserSourceMaps: false
};

export default nextConfig;
