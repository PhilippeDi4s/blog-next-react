const nextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
