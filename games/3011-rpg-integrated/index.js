// index.js

import { startGame } from "./game/gameLoop/index.js";
import { setupCanvas } from "./utils/canvasSetup.js";
import { setupKeyboard } from "./utils/keyboard.js";
import { initGameObjects } from "./game/gameObjects.js";
import { gameState } from "./utils/gameState.js";

const { ctx, canvas } = setupCanvas("gameCanvas");
const keys = setupKeyboard();
const gameObjects = initGameObjects();

startGame({
  ctx,
  canvas,
  keys,
  gameState,
  gameObjects,
});
