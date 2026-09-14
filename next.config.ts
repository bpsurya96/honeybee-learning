import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'unqcrhlsyqxmkmbmfcmz.supabase.co',
      },
    ],
  },
};

export default nextConfig;
