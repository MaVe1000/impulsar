import { resolve } from "node:path";

const asyncStorageShim = resolve(process.cwd(), "shims/async-storage");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@impulsar/ui",
    "@impulsar/stellar-sdk",
    "@impulsar/contracts",
    "@impulsar/dtos",
    "@impulsar/core",
    "@impulsar/config",
    
  ],
  // PRODUCTION-ALIGNED: Proxy API requests using environment variable
  // Change NEXT_PUBLIC_API_URL to switch between localhost/staging/production
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    turbo: {
      resolveAlias: {
        "@react-native-async-storage/async-storage": asyncStorageShim,
      },
    },
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve = webpackConfig.resolve || {};
    webpackConfig.resolve.alias = {
      ...(webpackConfig.resolve.alias || {}),
      "@react-native-async-storage/async-storage": asyncStorageShim,
    };
    return webpackConfig;
  },
};

export default nextConfig;
