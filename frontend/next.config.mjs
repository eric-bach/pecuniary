/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // https://stackoverflow.com/questions/71835580/useeffect-being-called-twice-in-nextjs-typescript-app
  experimental: {
    turbo: {},
  },
};

export default nextConfig;
