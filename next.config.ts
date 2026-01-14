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
  serverActions: {
    bodySizeLimit: "4mb", // Allow up to 4MB for file uploads (profile pictures are max 3MB)
  },
};

export default nextConfig;
