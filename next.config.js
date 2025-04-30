/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Fix for puppeteer
    // if (isServer) {
    //   config.externals.push("chrome-aws-lambda", "puppeteer-core");
    //   config.resolve.alias['canvas'] = false; // ✅ Fix for pdfjs-dist
    // }

    return config;
  },
  experimental: {
    // serverComponentsExternalPackages: ["chrome-aws-lambda", "puppeteer-core"],
  },
};

module.exports = nextConfig;
