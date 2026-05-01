const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname),
  images: {
    domains: ["res.cloudinary.com", "images.unsplash.com"], // Add your image host here
  },
};

module.exports = nextConfig;
