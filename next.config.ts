import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // For Next.js 13+
  },
  // For production
  async rewrites() {
    return [];
  },
  // Set hostname in server config
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  images: {
    domains: ["http://localhost:3000/"], // Replace with your external domain
  },
};

export default nextConfig;
