import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  distDir: "dist",
  basePath: "/visualizers",
  assetPrefix: "/visualizers/",
};

export default nextConfig;
