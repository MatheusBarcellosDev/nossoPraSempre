/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['next-cloudinary'],
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
