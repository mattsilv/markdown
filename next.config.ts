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
  // Fix hydration errors from Grammarly extension
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    // Prevent inclusion of external attributes in server-rendered HTML
    optimizeServerReact: true,
  },
};

export default nextConfig;
