import type { NextConfig } from "next";
import path from "path";

// Create a function to safely import optional dependencies
function withPWA(nextConfig: NextConfig): NextConfig {
  try {
    const withPWAInit = require("@ducanh2912/next-pwa").default;
    const withPWA = withPWAInit({
      dest: "public",
      disable: process.env.NODE_ENV === "development",
      reloadOnOnline: true,
    });
    return withPWA(nextConfig);
  } catch (error) {
    console.warn("@ducanh2912/next-pwa not found, continuing without PWA support");
    return nextConfig;
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: ".next", // Default directory, but it's ignored by git
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei", "postprocessing", "@react-three/postprocessing"],
  sassOptions: {
    includePaths: [path.join(__dirname, 'src')],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
    };
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      "bufferutil": "commonjs bufferutil",
    });
    return config;
  },
};

export default withPWA(nextConfig);
