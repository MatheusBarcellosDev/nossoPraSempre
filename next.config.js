/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['next-cloudinary'],
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  webpack: (config) => {
    config.externals.push({
      sharp: 'commonjs sharp',
      canvas: 'commonjs canvas',
    });
    return config;
  },
};

module.exports = nextConfig;
