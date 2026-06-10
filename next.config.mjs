/** @type {import('next').NextConfig} */

// When building for GitHub Pages the site is served from a sub-path
// (https://<user>.github.io/<repo>/), so assets and links need a basePath.
// Local `npm run dev` and other hosts leave this unset and serve from root.
const basePath = process.env.PAGES_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
