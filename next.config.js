/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  async redirects() {
    return [{ source: "/", destination: "/auth", permanent: true }];
  },
};

module.exports = nextConfig;
