import type { NextConfig } from "next";
import { resolve } from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  distDir: ".next", // Default directory, but it's ignored by git
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei", "postprocessing", "@react-three/postprocessing"],
  output: "export",
  images: {
    unoptimized: true
  }
};

export default nextConfig;
