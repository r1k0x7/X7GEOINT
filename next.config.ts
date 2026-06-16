import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['tile.openstreetmap.org', 'api.mapbox.com'],
    unoptimized: true,
  },
  webpack: (config) => {
    config.externals.push({
      'cesium': 'Cesium',
    });
    return config;
  },
};

export default nextConfig;