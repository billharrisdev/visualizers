import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  distDir: "dist",
  basePath: isProd ? "/visualizers" : "",
  assetPrefix: isProd ? "/visualizers" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
