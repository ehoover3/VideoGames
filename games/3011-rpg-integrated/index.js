// index.js

import { startGame } from "./game/gameLoop/index.js";
import { setupCanvas } from "./game/gameStart/canvasSetup.js";
import { setupKeyboard } from "./game/gameStart/keyboard.js";
import { initGameObjects } from "./game/gameStart/gameObjects.js";
import { gameState } from "./game/gameStart/gameState.js";

export const ASPECT_RATIO = 16 / 9;
const { canvas, ctx } = setupCanvas("gameCanvas");
const keys = setupKeyboard();
const gameObjects = initGameObjects();
let game = { canvas, ctx, keys, gameState, gameObjects };

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
startGame(game);

function resizeCanvas() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  if (width / height > ASPECT_RATIO) {
    canvas.height = height;
    canvas.width = height * ASPECT_RATIO;
  } else {
    canvas.width = width;
    canvas.height = width / ASPECT_RATIO;
  }
  ctx.imageSmoothingEnabled = false;
}
