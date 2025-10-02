import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['res.cloudinary.com'],
  },
  eslint: {
    // Temporarily disable ESLint during builds for CI/CD
    // Ignore patterns for components/ui and components/motion-primitives are set in eslint.config.mjs
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Disable TypeScript type checking during production builds (since we already fixed the errors)
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
