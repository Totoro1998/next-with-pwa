const path = require("path");
const runtimeCaching = require("next-pwa/cache");
// const currentModuleUrl = new URL(import.meta.url);
// const currentModuleDir = path.dirname(currentModuleUrl.pathname);

// Configuration options for Next.js
const nextConfig = {
  output: "standalone",
  images: {
    domains: ["*"],
    minimumCacheTTL: 2 * 60 * 60,
    loader: "custom",
    loaderFile: "./lib/loader.js",
  },
  // sassOptions: {
  //   includePaths: [path.join(currentModuleDir, "styles")],
  // },
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

// Configuration object tells the next-pwa plugin
const withPWA = require("next-pwa")({
  dest: "public", // Destination directory for the PWA files
  // disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
  // runtimeCaching,
  // exclude: [/app-build-manifest.json/],
  // buildExcludes: [
  //   /chunks\/images\/.*$/, // Don't precache files under .next/static/chunks/images this improves next-optimized-images behaviour
  //   /chunks\/pages\/api\/.*/, // Dont cache the API it needs fresh serverinfo
  // ],
  // exclude: [
  //   /\.map$/, // dont cache map files
  //   /^.*ts.*$/, // Dont let serviceworker touch the TS streams
  //   /-manifest.json$/, // exclude those pesky json files in _next root but still serve the ones we need from /_next/static
  // ],
  register: false, // Register the PWA service worker
  skipWaiting: true, // Skip waiting for service worker activation
  // fallbacks: {
  //   document: "/offline",
  // },
  cacheOnFrontEndNav: true,
  reloadOnOnline: true,
  // extendDefaultRuntimeCaching: true,
});

// Export the combined configuration for Next.js with PWA support
module.exports = withPWA(nextConfig);
