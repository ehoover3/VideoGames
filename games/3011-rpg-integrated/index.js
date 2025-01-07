// index.js

import { startGame } from "./game/gameLoop/index.js";
import { setupCanvas } from "./utils/canvasSetup.js";
import { setupKeyboard } from "./utils/keyboard.js";
import { initGameObjects } from "./game/gameObjects.js";
import { gameState } from "./utils/gameState.js";

const { canvas, ctx } = setupCanvas("gameCanvas");
const keys = setupKeyboard();
const gameObjects = initGameObjects();
let game = { canvas, ctx, keys, gameState, gameObjects };

startGame(game);
