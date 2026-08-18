/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  typescript: {
    // Allows production builds to successfully complete even if 
    // your project contains strict parameter type errors.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
