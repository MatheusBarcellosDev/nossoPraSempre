/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['next-cloudinary'],
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
};

module.exports = nextConfig;
