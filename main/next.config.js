/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  output: "export", // Enable static export mode
  distDir: "out", // Output directory for the static files

  // Optional: Enable trailing slash for all routes (can help with static hosting compatibility)
  trailingSlash: true,
};
