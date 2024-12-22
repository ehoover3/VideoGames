/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  output: "export", // Enable static export mode
  distDir: "out", // Output directory for the static files

  // Optional: Enable trailing slash for all routes (can help with static hosting compatibility)
  trailingSlash: true,

  // Optional: Customizing the export path map to ensure dynamic routes are correctly handled
  async exportPathMap() {
    const paths = {};

    // Assuming you have a list of games similar to the one in your `games.js` file
    const games = [{ id: "flappyBird" }, { id: "dinoRun" }, { id: "platformer" }, { id: "oceanShooter" }];

    // Add a path for each game
    games.forEach((game) => {
      paths[`/${game.id}`] = { page: "/[id]", query: { id: game.id } };
    });

    // Optionally include the homepage
    paths["/"] = { page: "/" };

    return paths;
  },
};
