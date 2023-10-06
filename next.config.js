/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  nextConfig,
  env: {
    BACK_END_PORT: process.env.BACK_END_PORT,
  },
};
