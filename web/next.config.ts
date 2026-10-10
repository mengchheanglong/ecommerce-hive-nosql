import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl =
      process.env.INTERNAL_API_URL || "http://127.0.0.1:8400";

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/nest-api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: "/sandbox-api/:path*",
        destination: "http://127.0.0.1:8500/api/:path*",
      },
      {
        source: "/pathfinder-api/:path*",
        destination: "http://127.0.0.1:8000/api/:path*",
      },
    ];
  },
};

export default nextConfig;
