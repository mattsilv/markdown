import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    // This is needed to handle 'marked' and 'dompurify' as client-side modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    
    return config;
  },
  experimental: {
    turbo: true,
  },
};

export default nextConfig;
