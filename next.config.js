/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        hostname: "logo.clearbit.com",
        protocol: "https",
      },
    ],
  },
};

module.exports = nextConfig;
