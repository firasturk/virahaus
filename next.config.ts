import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Two root layouts (English and Arabic) need a 404 that sits outside both. */
  experimental: {
    globalNotFound: true,
  },
};

export default nextConfig;
