// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize native modules for server-side rendering
      config.externals = config.externals || [];
      config.externals.push({
        serialport: "commonjs serialport",
        "@serialport/bindings-cpp": "commonjs @serialport/bindings-cpp",
      });
    }
    return config;
  },
  // Updated: moved from experimental.serverComponentsExternalPackages
  serverExternalPackages: ["serialport"],
};

export default nextConfig;
