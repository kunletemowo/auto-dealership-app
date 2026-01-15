import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Note: serverActions.bodySizeLimit is not available in Next.js 16.1.1
  // Profile images are uploaded client-side directly to Supabase, so this config is not needed
};

export default nextConfig;
