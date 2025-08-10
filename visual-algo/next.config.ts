import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  distDir: "dist",
  basePath: "/visual-algo",
  assetPrefix: "/visual-algo/",
};

export default nextConfig;
