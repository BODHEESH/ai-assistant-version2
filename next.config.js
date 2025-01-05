/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['imgcdn.stablediffusionweb.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imgcdn.stablediffusionweb.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      }
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
