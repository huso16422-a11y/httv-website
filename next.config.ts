import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Uyarıları build sırasında yok sayar, siteyi sorunsuz deploy edebilirsin
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
