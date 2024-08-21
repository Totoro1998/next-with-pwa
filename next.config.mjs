import withSerwistInit from "@serwist/next";

// Configuration options for Next.js
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["*"],
    minimumCacheTTL: 2 * 60 * 60,
    loader: "custom",
    loaderFile: "./lib/loader.js",
  },

  reactStrictMode: false,
  webpack(config, context) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.(".svg"));

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: ["@svgr/webpack"],
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    // const isDev = context.dev;
    // if (!isDev) {
    //   config.optimization.splitChunks.minSize = 12000;
    //   config.optimization.splitChunks.maxAsyncRequests = 50;
    //   config.optimization.splitChunks.maxInitialRequests = 50;
    // }

    return config;
  },
  // reactStrictMode: true, // Enable React strict mode for improved error handling
  swcMinify: true, // Enable SWC minification for improved performance
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
  },
};
const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: "app/sw.js",
  swDest: "public/sw.js",
});
export default withSerwist(nextConfig);
