/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("chrome-aws-lambda", "puppeteer-core");
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ["chrome-aws-lambda", "puppeteer-core"],
  },
};

module.exports = nextConfig;
