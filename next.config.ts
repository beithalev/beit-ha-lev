import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Jitsi iframe
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
