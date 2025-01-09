// // index.js

import { startGame } from "./game/gameLoop/index.js";
import { setupCanvas } from "./game/gameStart/canvasSetup.js";
import { setupKeyboard } from "./game/gameStart/keyboard.js";
import { initGameObjects } from "./game/gameStart/gameObjects.js";
import { gameState } from "./game/gameStart/gameState.js";

// Initial setup
export const ASPECT_RATIO = 16 / 9;
const { canvas, ctx } = setupCanvas("gameCanvas");
const keys = setupKeyboard();
const gameObjects = initGameObjects();
let game = { canvas, ctx, keys, gameState, gameObjects };

// Resize canvas dynamically
function resizeCanvas() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  if (width / height > ASPECT_RATIO) {
    // Wider than aspect ratio: Use height as the limiting factor
    canvas.height = height;
    canvas.width = height * ASPECT_RATIO;
  } else {
    // Taller than aspect ratio: Use width as the limiting factor
    canvas.width = width;
    canvas.height = width / ASPECT_RATIO;
  }

  // Optional: Adjust the game's context if needed
  ctx.imageSmoothingEnabled = false;
}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
startGame(game);
