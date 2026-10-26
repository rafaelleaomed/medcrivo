import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  outputFileTracingIncludes: {
    "/api/editorial/assets/[...path]": ["./assets/posts/**/*.{jpg,jpeg,png,webp}"],
  },
  allowedDevOrigins: [
    "nasty-pandas-shop.loca.lt",
    "*.loca.lt",
    "localhost:3000",
    "127.0.0.1:3000",
    "192.168.1.63:3000",
  ],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
