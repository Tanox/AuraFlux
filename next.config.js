/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei", "postprocessing", "@react-three/postprocessing"],
  output: "export",
  images: {
    unoptimized: true
  },
  turbopack: {},
  compress: true,
  productionBrowserSourceMaps: false,
  typescript: {
    ignoreBuildErrors: true
  }
};

module.exports = nextConfig;