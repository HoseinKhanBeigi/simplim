/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("chrome-aws-lambda", "puppeteer", "puppeteer-core", "canvas");
    } else {
      config.resolve.fallback = {
        canvas: false, // Prevent Webpack from bundling canvas
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ["chrome-aws-lambda", "puppeteer-core", "canvas"],
  },
};

module.exports = nextConfig;
