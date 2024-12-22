const express = require("express");
const app = express();

// Serve static files from the 'public' folder
app.use(express.static("public")); // 'public' folder should be the folder where your HTML and assets are

// Start the server on port 3004
app.listen(3004, () => {
  console.log("App running on port 3004");
});
